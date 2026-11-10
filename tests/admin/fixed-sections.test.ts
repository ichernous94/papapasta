import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { createDatabase } from '../../src/server/db/connection';
import * as schema from '../../src/server/db/schema';
import { legacySeedMenus } from '../../src/server/content/seed-data';
import { seedContent } from '../../src/server/content/seed';
import { readMenus } from '../../src/server/content/read';
import { saveStructure, changeContent, saveItem } from '../../src/server/content/write';
import { dishPath, findDish } from '../../src/server/content/dishes';

test('Upgrade to fixed sections preserves every dish/group, edited content and URL; seed never resurrects archived sections', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const url = new URL(process.env.TEST_DATABASE_URL!);
  assert.match(url.pathname, /^\/papapasta_test_[a-f0-9]+$/);
  const name = url.pathname.slice(1) + '_fixed';
  const original = createDatabase(url.toString());
  let fixture: ReturnType<typeof createDatabase> | undefined;
  let created = false;
  const directory = await mkdtemp(join(tmpdir(), 'papapasta-fixed-'));
  const previousImageBase = process.env.R2_PUBLIC_BASE_URL;
  try {
    await original.pool.query(`CREATE DATABASE "${name}"`); created = true;
    url.pathname = '/' + name; fixture = createDatabase(url.toString(), 4);
    const { db, pool } = fixture;
    const journal = JSON.parse(await readFile('drizzle/meta/_journal.json', 'utf8'));
    await mkdir(join(directory, 'meta'));
    await writeFile(join(directory, 'meta/_journal.json'), JSON.stringify({ ...journal, entries: journal.entries.slice(0, 5) }));
    for (const entry of journal.entries.slice(0, 5)) await writeFile(join(directory, entry.tag + '.sql'), await readFile('drizzle/' + entry.tag + '.sql'));
    await migrate(db, { migrationsFolder: directory });
    await db.transaction(async tx => {
      await tx.insert(schema.restaurants).values([{ id:'papapasta',name:'Papa Pasta' },{ id:'centro',name:'Centro' }]);
      for (const [sortOrder, source] of legacySeedMenus.entries()) {
        const menuId = `${source.restaurantId}:${source.key}`;
        await tx.insert(schema.menus).values({ id:menuId,restaurantId:source.restaurantId,key:source.key,title:source.title,subtitle:source.subtitle,sortOrder });
        for (const [sortOrder, c] of source.categories.entries()) {
          const categoryId = `${menuId}:${c.id}`;
          await tx.insert(schema.categories).values({ id:categoryId,menuId,slug:c.id,label:c.label,note:c.note,columns:c.columns??1,columnBreak:c.columnBreak??1,sortOrder });
          for (const [sortOrder,g] of c.groups.entries()) {
            const groupId = `${categoryId}:${g.id}`;
            await tx.insert(schema.groups).values({ id:groupId,categoryId,title:g.title,note:g.note,afterNote:g.afterNote,sortOrder });
            for (const [sortOrder,i] of g.items.entries()) await tx.insert(schema.items).values({ id:`${groupId}:${i.id}`,groupId,name:i.name,price:i.price,portion:i.portion,description:i.description??[],isNew:i.isNew,sortOrder });
          }
        }
      }
      await tx.insert(schema.menus).values({id:'custom-menu',restaurantId:'papapasta',key:'section-custom',title:'Test Section'});
      await tx.insert(schema.categories).values({id:'custom-category',menuId:'custom-menu',slug:'custom',label:''});
      await tx.insert(schema.groups).values({id:'custom-group',categoryId:'custom-category',note:'Preserved note',afterNote:'Preserved after-note'});
      await tx.insert(schema.items).values({id:'custom-item',groupId:'custom-group',name:'Edited dish',price:'29/36',allergens:['milk'],meatless:true,recommended:true,spicy:true,visible:false});
      await tx.update(schema.menus).set({title:'My main menu'}).where(eq(schema.menus.id,'papapasta:main'));
      await tx.update(schema.menus).set({title:'Piccoli',subtitle:'Custom subtitle'}).where(eq(schema.menus.id,'centro:kids'));
    });
    const imageId = randomUUID();
    await db.insert(schema.mediaAssets).values({id:imageId,objectKey:`papapasta/menu-images/${imageId}.webp`,width:1200,height:800,byteSize:100,mimeType:'image/webp',blurDataURL:'data:image/webp;base64,AA==',createdBy:'test',status:'ready'});
    const photographed = (await db.select().from(schema.items)).find(i=>i.id.startsWith('papapasta:autumn:')&&!i.id.includes('hot-drinks'))!;
    await db.update(schema.items).set({imageId,imageAlt:'Edited image',price:'61/72',allergens:['gluten'],spicy:true}).where(eq(schema.items.id,photographed.id));
    process.env.R2_PUBLIC_BASE_URL='https://images.example.test';
    const beforeItems = await db.select().from(schema.items).orderBy(schema.items.id);
    const beforeGroups = await db.select().from(schema.groups).orderBy(schema.groups.id);
    const beforeCategories = await db.select().from(schema.categories).orderBy(schema.categories.id);
    // Test the 0005 upgrade independently of subsequent, intentional content replacements.
    await writeFile(join(directory, 'meta/_journal.json'), JSON.stringify({ ...journal, entries: journal.entries.slice(0, 6) }));
    await writeFile(join(directory, journal.entries[5].tag + '.sql'), await readFile('drizzle/' + journal.entries[5].tag + '.sql'));
    await migrate(db, { migrationsFolder:directory });
    assert.deepEqual(await db.select().from(schema.items).orderBy(schema.items.id), beforeItems);
    const afterGroups = await db.select().from(schema.groups).orderBy(schema.groups.id);
    const groupContent = (rows: typeof beforeGroups) => rows.map(({categoryId,sortOrder,...content})=>{ void categoryId; void sortOrder; return content; });
    assert.deepEqual(groupContent(afterGroups),groupContent(beforeGroups));
    for (const c of beforeCategories) assert.ok(await db.query.categories.findFirst({where:eq(schema.categories.id,c.id)}));
    for (const restaurantId of ['papapasta','centro']) {
      const menus=await readMenus(db,restaurantId);
      assert.deepEqual(menus.map(m=>m.key),['main','kids','drinks']);
      assert.ok(!menus[0].categories.some(c=>c.id===`${restaurantId}:main:napoje`));
      assert.ok(menus[2].categories.some(c=>c.id===`${restaurantId}:main:napoje`));
      assert.ok(menus[2].categories.some(c=>c.groups.some(g=>g.id===`${restaurantId}:autumn:all:hot-drinks`)));
      assert.ok(await db.query.menus.findFirst({where:eq(schema.menus.id,`${restaurantId}:recommendations`)}));
      assert.ok(!menus.some(m=>m.key==='recommendations'));
    }
    const papa=await readMenus(db,'papapasta');
    assert.equal(papa[0].title,'My main menu');assert.equal(papa[1].title,'Menu Bambini');
    assert.equal((await readMenus(db,'centro'))[1].title,'Piccoli');
    assert.equal(papa[0].categories.find(c=>c.id==='custom-category')!.label,'Test Section');
    assert.ok(papa[2].categories.some(c=>c.id==='papapasta:wine:wina-czerwone'));
    assert.equal(findDish(papa,'papapasta',dishPath(photographed).split('/').at(-1)!)?.id,photographed.id);
    const archived=(await db.query.menus.findFirst({where:eq(schema.menus.id,'papapasta:recommendations')}))!;
    await assert.rejects(saveStructure(db,'test',{menuId:archived.id,id:archived.id,version:archived.version,kind:'menu',title:'Attempt',note:'',afterNote:''}),/archived/);
    const archiveGroup=(await db.query.groups.findFirst({where:eq(schema.groups.categoryId,'papapasta:recommendations:all')}))!;
    await assert.rejects(saveItem(db,'test',{menuId:archived.id,version:archived.version,groupId:archiveGroup.id,name:'Attempt',portion:'',price:'',description:'',isNew:false,visible:true,imageAlt:'',removeImage:false}),/archived/);
    for (const m of papa) await assert.rejects(changeContent(db,'test',{action:'deleteMenu',menuId:m.id,version:m.version}));
    const stable=await readMenus(db);
    await migrate(db,{migrationsFolder:directory});
    await seedContent(db);await seedContent(db);
    assert.deepEqual(await readMenus(db),stable);
    assert.deepEqual(await db.select().from(schema.items).orderBy(schema.items.id),beforeItems);
    assert.equal((await pool.query("select count(*)::int as count from public.audit_log where action='menu.fixed-sections'")).rows[0].count,2);
  } finally {
    if(previousImageBase===undefined)delete process.env.R2_PUBLIC_BASE_URL;else process.env.R2_PUBLIC_BASE_URL=previousImageBase;
    if(fixture)await fixture.pool.end();
    if(created)await original.pool.query(`DROP DATABASE "${name}" WITH (FORCE)`);
    await original.pool.end();await rm(directory,{recursive:true,force:true});
  }
});
