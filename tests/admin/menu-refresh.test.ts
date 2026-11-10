import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { eq } from 'drizzle-orm';
import { createDatabase } from '../../src/server/db/connection';
import * as schema from '../../src/server/db/schema';
import { legacySeedMenus } from '../../src/server/content/seed-data';
import { seedContent } from '../../src/server/content/seed';
import { readMenus } from '../../src/server/content/read';
import { saveItem } from '../../src/server/content/write';
import { listDishes, dishSlug, findDish } from '../../src/server/content/dishes';
import defaults from '../../src/server/content/defaults/papapasta-menu-2026-11.json';

test('Screenshot migration and fresh seed use the same immutable manifest', async () => {
  const sql = await readFile('drizzle/0006_papapasta_menu_refresh.sql', 'utf8');
  assert.deepEqual(JSON.parse(sql.split('$menu_manifest$')[1]), defaults);
});

test('PapaPasta import preserves identities/allergens/media/Centro, archives old dishes and never repeats over edits', { skip: !process.env.TEST_DATABASE_URL }, async () => {
  const url = new URL(process.env.TEST_DATABASE_URL!);
  assert.match(url.pathname, /^\/papapasta_test_[a-f0-9]+$/);
  const name = url.pathname.slice(1) + '_refresh';
  const original = createDatabase(url.toString());
  const directory = await mkdtemp(join(tmpdir(), 'papapasta-refresh-'));
  let fixture: ReturnType<typeof createDatabase> | undefined;
  let created = false;
  const previousBase = process.env.R2_PUBLIC_BASE_URL;
  try {
    await original.pool.query(`CREATE DATABASE "${name}"`); created = true;
    url.pathname = '/' + name; fixture = createDatabase(url.toString(), 4);
    const { db, pool } = fixture;
    const journal = JSON.parse(await readFile('drizzle/meta/_journal.json', 'utf8'));
    await mkdir(join(directory, 'meta'));
    await writeFile(join(directory, 'meta/_journal.json'), JSON.stringify({ ...journal, entries: journal.entries.slice(0, 5) }));
    for (const entry of journal.entries.slice(0, 6)) await writeFile(join(directory, entry.tag + '.sql'), await readFile('drizzle/' + entry.tag + '.sql'));
    await migrate(db, { migrationsFolder: directory });
    await db.transaction(async tx => {
      await tx.insert(schema.restaurants).values([{id:'papapasta',name:'Papa Pasta'},{id:'centro',name:'Centro'}]);
      for (const source of legacySeedMenus) {
        const menuId = `${source.restaurantId}:${source.key}`;
        await tx.insert(schema.menus).values({id:menuId,restaurantId:source.restaurantId,key:source.key,title:source.title,subtitle:source.subtitle});
        for (const [sortOrder,c] of source.categories.entries()) {
          const categoryId = `${menuId}:${c.id}`;
          await tx.insert(schema.categories).values({id:categoryId,menuId,slug:c.id,label:c.label,note:c.note,sortOrder});
          for (const [sortOrder,g] of c.groups.entries()) {
            const groupId = `${categoryId}:${g.id}`;
            await tx.insert(schema.groups).values({id:groupId,categoryId,title:g.title,note:g.note,afterNote:g.afterNote,sortOrder});
            for (const [sortOrder,i] of g.items.entries()) await tx.insert(schema.items).values({id:`${groupId}:${i.id}`,groupId,name:i.name,price:i.price,portion:i.portion,description:i.description??[],sortOrder});
          }
        }
      }
    });
    await writeFile(join(directory,'meta/_journal.json'), JSON.stringify({...journal,entries:journal.entries.slice(0,6)}));
    await migrate(db,{migrationsFolder:directory});
    await seedContent(db); // Existing sections remain untouched; initialize independent site content.
    const imageId = randomUUID();
    await db.insert(schema.mediaAssets).values({id:imageId,objectKey:`papapasta/menu-images/${imageId}.webp`,width:1200,height:800,byteSize:100,mimeType:'image/webp',blurDataURL:'data:image/webp;base64,AA==',createdBy:'test',status:'ready'});
    const matchedId='papapasta:main:przystawki:przystawki:gamberetti-mela';
    const obsoleteId='custom-obsolete-dish';
    await db.insert(schema.items).values({id:obsoleteId,groupId:'papapasta:main:przystawki:przystawki',name:'Retain in archive',price:'99/100',description:['Old note'],allergens:['eggs'],visible:false,meatless:true,imageId,imageAlt:'Old photo'});
    await db.update(schema.items).set({imageId,imageAlt:'Existing photo',allergens:['milk','gluten','nuts'],price:'53',isNew:true}).where(eq(schema.items.id,matchedId));
    await db.update(schema.items).set({imageId,imageAlt:'Centro photo'}).where(eq(schema.items.id,'centro:main:przystawki:przystawki:tartare'));
    await db.update(schema.menus).set({title:'Edited Papa main',subtitle:'Keep subtitle',bannerImageId:imageId}).where(eq(schema.menus.id,'papapasta:main'));
    await db.update(schema.galleryEntries).set({imageId,staticImage:null});
    await db.update(schema.promotions).set({imageId,staticImage:null});
    process.env.R2_PUBLIC_BASE_URL='https://images.example.test';
    const beforeItems = await db.select().from(schema.items).orderBy(schema.items.id);
    const beforeMenus = await readMenus(db);
    const centroBefore = await readMenus(db,'centro');
    const mediaBefore = await db.select().from(schema.mediaAssets);
    const galleriesBefore = await db.select().from(schema.galleryEntries).orderBy(schema.galleryEntries.id);
    const promotionsBefore = await db.select().from(schema.promotions).orderBy(schema.promotions.id);
    const beforeCategories = await db.select().from(schema.categories);
    const beforeGroups = await db.select().from(schema.groups);
    // Failure halfway through the DO block must roll the entire import back.
    await pool.query("ALTER TABLE public.menu_items ADD CONSTRAINT import_failure CHECK (name <> 'Bruchetta con burrata e anchovies')");
    await assert.rejects(migrate(db,{migrationsFolder:'./drizzle'}));
    assert.deepEqual(await db.select().from(schema.items).orderBy(schema.items.id),beforeItems);
    assert.deepEqual(await readMenus(db),beforeMenus);
    await pool.query('ALTER TABLE public.menu_items DROP CONSTRAINT import_failure');
    await migrate(db,{migrationsFolder:'./drizzle'});
    const papa = await readMenus(db,'papapasta');
    const imported = papa.flatMap(m=>m.categories.flatMap(c=>c.groups.flatMap(g=>g.items)));
    assert.equal(imported.length,151);
    assert.deepEqual(papa.map(m=>m.categories.length),[9,1,8]);
    assert.deepEqual(papa.map(m=>m.categories.reduce((n,c)=>n+c.groups.reduce((n,g)=>n+g.items.length,0),0)),[97,5,49]);
    assert.deepEqual(imported.map(i=>i.id),defaults.sections.flatMap(s=>s.categories.flatMap(c=>c.groups.flatMap(g=>g.items.map(i=>i.storageId)))));
    const matched = imported.find(i=>i.id===matchedId)!;
    assert.equal(matched.price,'59'); assert.equal(matched.recommended,true);assert.equal(matched.meatless,false);assert.equal(matched.spicy,false);assert.equal(matched.isNew,false);
    assert.deepEqual(matched.allergens,['milk','gluten','nuts']);
    assert.ok(imported.every(i=>i.imageId===null&&i.imageAlt===''&&i.visible));
    assert.ok(imported.filter(i=>!beforeItems.some(old=>old.id===i.id)).every(i=>i.allergens?.length===0));
    const afterItems=await db.select().from(schema.items).orderBy(schema.items.id);
    assert.ok(beforeItems.every(old=>afterItems.some(i=>i.id===old.id)));
    const archived=afterItems.find(i=>i.id===obsoleteId)!;
    const {groupId,imageId:detachedId,imageAlt,...archivedContent}=archived;void groupId;void detachedId;void imageAlt;
    const {groupId:oldGroup,imageId:oldImage,imageAlt:oldAlt,...oldContent}=beforeItems.find(i=>i.id===obsoleteId)!;void oldGroup;void oldImage;void oldAlt;
    assert.deepEqual(archivedContent,oldContent);
    assert.ok(!imported.some(i=>i.id===obsoleteId));
    assert.equal(listDishes(papa,'papapasta').length,0); // Detail links return after a correct photo is uploaded.
    assert.equal(papa[0].title,'Edited Papa main');assert.equal(papa[0].subtitle,'Keep subtitle');assert.equal(papa[0].bannerImageId,imageId);
    assert.deepEqual(await readMenus(db,'centro'),centroBefore);
    const centroIds=new Set(centroBefore.flatMap(m=>m.categories.flatMap(c=>c.groups.flatMap(g=>g.items.map(i=>i.id)))));
    assert.deepEqual(afterItems.filter(i=>centroIds.has(i.id)),beforeItems.filter(i=>centroIds.has(i.id)));
    assert.deepEqual(await db.select().from(schema.mediaAssets),mediaBefore);
    assert.deepEqual(await db.select().from(schema.galleryEntries).orderBy(schema.galleryEntries.id),galleriesBefore);
    assert.deepEqual(await db.select().from(schema.promotions).orderBy(schema.promotions.id),promotionsBefore);
    const afterCategories=await db.select().from(schema.categories),afterGroups=await db.select().from(schema.groups);
    assert.ok(beforeCategories.every(c=>afterCategories.some(a=>a.id===c.id)));
    assert.ok(beforeGroups.every(g=>afterGroups.some(a=>a.id===g.id)));
    await assert.rejects(saveItem(db,'test',{menuId:papa[0].id,version:beforeMenus.find(m=>m.id===papa[0].id)!.version,id:matchedId,groupId:matched.groupId,name:'Stale edit',portion:'',price:'1',description:'',isNew:false,visible:true,imageAlt:'',removeImage:false}),/already changed/);
    await db.update(schema.items).set({name:'Subsequent edit',price:'99',imageId,imageAlt:'New photo'}).where(eq(schema.items.id,matchedId));
    await db.update(schema.menus).set({title:'Subsequent title'}).where(eq(schema.menus.id,papa[0].id));
    const subsequent=await readMenus(db);
    await migrate(db,{migrationsFolder:'./drizzle'});await seedContent(db);await seedContent(db);
    assert.deepEqual(await readMenus(db),subsequent);
    const oldSlug=dishSlug(beforeItems.find(i=>i.id===matchedId)!);
    assert.equal(findDish(await readMenus(db),'papapasta',oldSlug)?.id,matchedId);
    const count=(await pool.query("select count(*)::int as count from public.audit_log where action='menu.screenshot-import'")).rows[0].count;
    assert.equal(count,1);
  } finally {
    if(previousBase===undefined)delete process.env.R2_PUBLIC_BASE_URL;else process.env.R2_PUBLIC_BASE_URL=previousBase;
    if(fixture)await fixture.pool.end();
    if(created)await original.pool.query(`DROP DATABASE "${name}" WITH (FORCE)`);
    await original.pool.end();await rm(directory,{recursive:true,force:true});
  }
});
