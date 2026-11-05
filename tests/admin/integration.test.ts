import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { eq } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import { createDatabase } from '../../src/server/db/connection';
import { changeUser, consumeResetAttempt } from '../../src/server/auth/user-write';
import { createAuth } from '../../src/server/auth/config';
import * as schema from '../../src/server/db/schema';
import { seedContent } from '../../src/server/content/seed';
import { readMenus } from '../../src/server/content/read';
import { saveItem, moveItem, saveStructure, changeContent, createMenu } from '../../src/server/content/write';
function totp(uri: string) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (const c of new URL(uri).searchParams.get('secret')!.toUpperCase().replace(/=/g, ''))
        bits += alphabet.indexOf(c).toString(2).padStart(5, '0');
    const secret = Buffer.from((bits.match(/.{8}/g) ?? []).map(b => parseInt(b, 2)));
    const counter = Buffer.alloc(8);
    counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30000)));
    const hmac = createHmac('sha1', secret).update(counter).digest();
    const offset = hmac[19] & 15;
    return String((hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000).padStart(6, '0');
}
test('PostgreSQL: auth, mandatory MFA, roles, rate limits, revocation and content conflicts', { skip: !process.env.TEST_DATABASE_URL }, async () => {
    assert.match(new URL(process.env.TEST_DATABASE_URL!).pathname, /^\/papapasta_test_[a-f0-9]+$/);
    assert.notEqual(process.env.TEST_DATABASE_URL, process.env.DATABASE_URL);
    const { db, pool } = createDatabase(process.env.TEST_DATABASE_URL!, 4);
    try {
        // Rehearse an upgrade from the original migration with real credential/session rows.
        const legacyDir = await mkdtemp(join(tmpdir(), 'papapasta-legacy-'));
        try {
            await mkdir(join(legacyDir, 'meta'));
            const journal = JSON.parse(await readFile('drizzle/meta/_journal.json', 'utf8'));
            await writeFile(join(legacyDir, 'meta/_journal.json'), JSON.stringify({ ...journal, entries: journal.entries.slice(0,1) }));
            await writeFile(join(legacyDir, journal.entries[0].tag + '.sql'), await readFile('drizzle/' + journal.entries[0].tag + '.sql'));
            await migrate(db, { migrationsFolder: legacyDir });
            await pool.query(`INSERT INTO auth."user" (id,name,email,role,must_change_password) VALUES ('legacy-admin','Legacy','legacy@example.test','admin',false);
                INSERT INTO auth.account (id,account_id,provider_id,user_id,password) VALUES ('legacy-account','legacy-admin','credential','legacy-admin','preserved-hash');
                INSERT INTO auth.session (id,expires_at,token,user_id) VALUES ('legacy-session',now()+interval '1 hour','preserved-token','legacy-admin');
                INSERT INTO auth.two_factor (id,user_id,secret,backup_codes,verified) VALUES ('legacy-factor','legacy-admin','preserved-secret','preserved-codes',true);
                INSERT INTO content.restaurants (id,name) VALUES ('legacy-restaurant','Legacy Restaurant');`);
            // Upgrade the existing public schema (0001) with populated menu data.
            await writeFile(join(legacyDir, 'meta/_journal.json'), JSON.stringify({ ...journal, entries: journal.entries.slice(0,2) }));
            await writeFile(join(legacyDir, journal.entries[1].tag + '.sql'), await readFile('drizzle/' + journal.entries[1].tag + '.sql'));
            await migrate(db, { migrationsFolder: legacyDir });
            await pool.query(`INSERT INTO public.menus (id,restaurant_id,key,title) VALUES ('legacy-menu','legacy-restaurant','legacy','Legacy Menu');
                INSERT INTO public.menu_categories (id,menu_id,slug,label) VALUES ('legacy-category','legacy-menu','legacy','Legacy');
                INSERT INTO public.menu_groups (id,category_id) VALUES ('legacy-group','legacy-category');
                INSERT INTO public.menu_items (id,group_id,name,price) VALUES ('legacy-item','legacy-group','Preserved dish','29/36');`);
            await migrate(db, { migrationsFolder: './drizzle' });
            await migrate(db, { migrationsFolder: './drizzle' });
            assert.equal((await db.query.account.findFirst({ where:eq(schema.account.id,'legacy-account') }))!.password,'preserved-hash');
            assert.equal((await db.query.session.findFirst({ where:eq(schema.session.id,'legacy-session') }))!.token,'preserved-token');
            assert.equal((await db.query.twoFactor.findFirst({ where:eq(schema.twoFactor.id,'legacy-factor') }))!.secret,'preserved-secret');
            assert.equal((await db.query.user.findFirst({ where:eq(schema.user.id,'legacy-admin') }))!.lastLoginAt,null);
            assert.equal((await pool.query("select count(*)::int as count from information_schema.tables where table_schema in ('auth','content')")).rows[0].count,0);
            const legacyItem = await db.query.items.findFirst({ where:eq(schema.items.id,'legacy-item') });
            assert.deepEqual(legacyItem!.allergens,[]);
            assert.equal(legacyItem!.price,'29/36');
            assert.equal((await db.query.menus.findFirst({ where:eq(schema.menus.id,'legacy-menu') }))!.bannerImageId,null);
            await db.delete(schema.menus).where(eq(schema.menus.id,'legacy-menu'));
            await db.delete(schema.user).where(eq(schema.user.id,'legacy-admin'));
            await db.delete(schema.restaurants).where(eq(schema.restaurants.id,'legacy-restaurant'));
        } finally { await rm(legacyDir, {recursive:true,force:true}); }
        await seedContent(db);
        const original = await readMenus(db);
        assert.equal(original.length, 10);
        const main = original.find(m => m.id === 'papapasta:main')!;
        const group = main.categories[0].groups[0];
        const item = group.items[0];
        const payload = { menuId: main.id, version: 1, id: item.id, groupId: group.id, name: 'Changed safely', portion: item.portion, price: '29/36', description: 'Line one\nLine two', visible: false, isNew: true, imageAlt: '', removeImage: false };
        await saveItem(db, 'test-actor', payload);
        await assert.rejects(saveItem(db, 'test-actor', { ...payload, name: 'Lost update' }), /already changed/);
        await seedContent(db);
        assert.equal((await readMenus(db)).find(m => m.id === main.id)!.categories[0].groups[0].items[0].name, 'Changed safely');
        assert.ok(!(await readMenus(db, 'papapasta', true)).find(m => m.id === main.id)!.categories[0].groups[0].items.some(i => i.id === item.id));
        await assert.rejects(saveItem(db, 'test-actor', { ...payload, version: 2, groupId: original.find(m => m.id === 'centro:main')!.categories[0].groups[0].id }), /does not belong/);
        await saveItem(db, 'test-actor', { ...payload, version: 2, visible: true });
        await moveItem(db, 'test-actor', { menuId: main.id, version: 3, id: item.id, direction: 'down' });
        await saveStructure(db, 'test-actor', { menuId: main.id, version: 4, id: group.id, kind: 'group', title: 'Edited group', note: 'Note', afterNote: 'After' });
        assert.equal((await readMenus(db)).find(m => m.id === main.id)!.categories[0].groups[0].items[1].id, item.id);
        const beforeReorder = (await readMenus(db)).find(m => m.id === main.id)!;
        const orderedIds = beforeReorder.categories[0].groups[0].items.map(i => i.id).reverse();
        await changeContent(db, 'test-actor', { action:'reorder', menuId:main.id, version:beforeReorder.version, groupId:group.id, ids:orderedIds });
        const reordered = (await readMenus(db)).find(m => m.id === main.id)!;
        assert.deepEqual(reordered.categories[0].groups[0].items.map(i => i.id), orderedIds);
        await assert.rejects(changeContent(db, 'test-actor', { action:'reorder', menuId:main.id, version:reordered.version, groupId:group.id, ids:[orderedIds[0], orderedIds[0]] }), /group changed/);
        // Structure CRUD, full-order validation, cross-menu transfer and deletion.
        let current = (await readMenus(db)).find(m => m.id === main.id)!;
        await changeContent(db, 'test-actor', { action:'createCategory', menuId:main.id, version:current.version, title:'Temporary category', note:'', columns:2, columnBreak:1 });
        current = (await readMenus(db)).find(m => m.id === main.id)!;
        const addedCategory = current.categories.find(c => c.label === 'Temporary category')!;
        await changeContent(db, 'test-actor', { action:'createGroup', menuId:main.id, version:current.version, categoryId:addedCategory.id, title:'Temporary group', note:'', afterNote:'' });
        current = (await readMenus(db)).find(m => m.id === main.id)!;
        const addedGroup = current.categories.find(c => c.id === addedCategory.id)!.groups[0];
        await assert.rejects(changeContent(db, 'test-actor', { action:'deleteCategory', menuId:main.id, version:current.version, id:addedCategory.id }), /groups/);
        await saveItem(db, 'test-actor', { ...payload, id:undefined, version:current.version, groupId:addedGroup.id, name:'Temporary dish' });
        current = (await readMenus(db)).find(m => m.id === main.id)!;
        const addedItem = current.categories.find(c => c.id === addedCategory.id)!.groups[0].items[0];
        await assert.rejects(changeContent(db, 'test-actor', { action:'deleteGroup', menuId:main.id, version:current.version, id:addedGroup.id }), /dishes/);
        await assert.rejects(changeContent(db, 'test-actor', { action:'reorder', menuId:main.id, version:current.version, groupId:addedGroup.id, ids:[item.id] }), /group changed/);
        const destination = (await readMenus(db)).find(m => m.id === 'centro:main')!;
        await saveItem(db, 'test-actor', { ...payload, id:addedItem.id, sourceMenuId:main.id, sourceVersion:current.version, menuId:destination.id, version:destination.version, groupId:destination.categories[0].groups[0].id });
        current = (await readMenus(db)).find(m => m.id === main.id)!;
        await changeContent(db, 'test-actor', { action:'deleteGroup', menuId:main.id, version:current.version, id:addedGroup.id });
        current = (await readMenus(db)).find(m => m.id === main.id)!;
        await changeContent(db, 'test-actor', { action:'deleteCategory', menuId:main.id, version:current.version, id:addedCategory.id });
        const destVersion = (await readMenus(db)).find(m => m.id === destination.id)!.version;
        await changeContent(db, 'test-actor', { action:'deleteItem', menuId:destination.id, version:destVersion, id:addedItem.id });
        const qr = (await db.insert(schema.qrCodes).values({ restaurantId:'papapasta', name:'Menu', url:'https://papapasta.pl/menu', active:false, createdBy:'test-actor' }).returning())[0];
        assert.equal((await db.query.qrCodes.findFirst({ where:eq(schema.qrCodes.id,qr.id) }))!.active,false);
        await db.delete(schema.qrCodes).where(eq(schema.qrCodes.id,qr.id));
        // Allergen creation/update/clearing, old-client compatibility and independent recommendations.
        const findMenu = async (id:string) => (await readMenus(db)).find(m => m.id === id)!;
        const allergenGroup = (await findMenu(main.id)).categories[0].groups[0];
        await saveItem(db,'test-actor',{...payload,id:undefined,menuId:main.id,version:(await findMenu(main.id)).version,groupId:allergenGroup.id,name:'Allergen test dish',allergens:['nuts','milk','gluten','milk']});
        const allergyItem=(await findMenu(main.id)).categories[0].groups[0].items.find(i=>i.name==='Allergen test dish')!;
        assert.deepEqual(allergyItem.allergens,['milk','gluten','nuts']);
        const allergyPayload={...payload,id:allergyItem.id,groupId:allergenGroup.id,name:'Allergen test dish',visible:true};
        await saveItem(db,'test-actor',{...allergyPayload,version:(await findMenu(main.id)).version,allergens:['fish','eggs']});
        assert.deepEqual((await db.query.items.findFirst({where:eq(schema.items.id,allergyItem.id)}))!.allergens,['eggs','fish']);
        const staleVersion=(await findMenu(main.id)).version;
        await saveItem(db,'test-actor',{...allergyPayload,version:staleVersion,portion:'Updated portion'});
        assert.deepEqual((await db.query.items.findFirst({where:eq(schema.items.id,allergyItem.id)}))!.allergens,['eggs','fish']);
        await assert.rejects(saveItem(db,'test-actor',{...allergyPayload,version:staleVersion,allergens:[]}),/already changed/);
        assert.deepEqual((await db.query.items.findFirst({where:eq(schema.items.id,allergyItem.id)}))!.allergens,['eggs','fish']);
        await assert.rejects(saveItem(db,'test-actor',{...allergyPayload,version:(await findMenu(main.id)).version,allergens:['not-an-allergen']}));
        await saveItem(db,'test-actor',{...allergyPayload,version:(await findMenu(main.id)).version,allergens:[]});
        assert.deepEqual((await db.query.items.findFirst({where:eq(schema.items.id,allergyItem.id)}))!.allergens,[]);
        const recommendations=await findMenu('papapasta:recommendations');
        await saveItem(db,'test-actor',{...payload,id:undefined,menuId:recommendations.id,version:recommendations.version,groupId:recommendations.categories[0].groups[0].id,name:'Independent allergen recommendation',allergens:['nuts']});
        assert.deepEqual((await db.query.items.findFirst({where:eq(schema.items.id,allergyItem.id)}))!.allergens,[]);
        const recItem=(await findMenu(recommendations.id)).categories[0].groups[0].items.find(i=>i.name==='Independent allergen recommendation')!;
        assert.deepEqual(recItem.allergens,['nuts']);
        await changeContent(db,'test-actor',{action:'deleteItem',menuId:main.id,version:(await findMenu(main.id)).version,id:allergyItem.id});
        await changeContent(db,'test-actor',{action:'deleteItem',menuId:recommendations.id,version:(await findMenu(recommendations.id)).version,id:recItem.id});
        const adminId = randomUUID();
        const password = 'very-long-test-password';
        await db.insert(schema.user).values({ id: adminId, name: 'Test Admin', email: 'admin@example.test', role: 'admin', mustChangePassword: false });
        await db.insert(schema.account).values({ id: randomUUID(), userId: adminId, accountId: adminId, providerId: 'credential', password: await hashPassword(password) });
        const auth = createAuth(db, { secret: 'test-only-secret-at-least-32-characters-long', baseURL: 'http://admin.localhost:3000' });
        function client(ip: string) {
            const cookies = new Map<string, string>();
            return async (path: string, body?: unknown, host = 'admin.localhost:3000') => {
                const response = await auth.handler(new Request(`http://admin.localhost:3000/api/auth${path}`, { method: body ? 'POST' : 'GET', headers: { host, origin: 'http://admin.localhost:3000', 'content-type': 'application/json', 'x-forwarded-for': ip, cookie: [...cookies].map(([k, v]) => `${k}=${v}`).join('; ') }, body: body ? JSON.stringify(body) : undefined }));
                for (const line of response.headers.getSetCookie()) {
                    const pair = line.split(';')[0];
                    const i = pair.indexOf('=');
                    if (pair.slice(i + 1))
                        cookies.set(pair.slice(0, i), pair.slice(i + 1));
                    else
                        cookies.delete(pair.slice(0, i));
                }
                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                }
                catch {
                    data = {};
                }
                return { status: response.status, data, headers: response.headers };
            };
        }
        const admin = client('127.0.0.1');
        assert.equal((await admin('/sign-in/email', { email: 'admin@example.test', password }, 'papapasta.pl')).status, 404);
        assert.ok((await admin('/sign-up/email', { name: 'Public', email: 'x@example.test', password })).status >= 400);
        assert.equal((await admin('/sign-in/email', { email: 'admin@example.test', password })).status, 200);
        let sessions = await db.select().from(schema.session).where(eq(schema.session.userId, adminId));
        assert.equal(sessions[0].mfaVerifiedAt, null);
        assert.ok(sessions[0].expiresAt.getTime() - sessions[0].createdAt.getTime() <= 8 * 3600000 + 1000);
        assert.equal((await admin('/admin/list-users')).status, 403);
        const enabled = await admin('/two-factor/enable', { password });
        assert.equal(enabled.status, 200);
        assert.equal(enabled.data.method, 'totp');
        assert.equal((await admin('/two-factor/verify-totp', { code: 'bad' })).status, 401);
        assert.equal((await admin('/two-factor/verify-totp', { code: totp(enabled.data.totpURI) })).status, 200);
        sessions = await db.select().from(schema.session).where(eq(schema.session.userId, adminId));
        assert.equal(sessions.length, 1);
        assert.ok(sessions[0].mfaVerifiedAt);
        assert.equal((await admin('/admin/list-users')).status, 200);
        assert.equal((await admin('/two-factor/disable', { password })).status, 403);
        assert.equal((await admin('/two-factor/verify-totp', { code: totp(enabled.data.totpURI), trustDevice: true })).status, 403);
        const create = await admin('/admin/create-user', { name: 'Test Editor', email: 'editor@example.test', password, role: 'user' });
        assert.equal(create.status, 200);
        const editorId = create.data.user.id;
        assert.equal((await db.query.user.findFirst({ where: eq(schema.user.id, editorId) }))!.mustChangePassword, true);
        const editor = client('127.0.0.2');
        await editor('/sign-in/email', { email: 'editor@example.test', password });
        assert.equal((await editor('/two-factor/enable', { password })).status, 403);
        const newPassword = 'changed-editor-password';
        assert.equal((await editor('/change-password', { currentPassword: password, newPassword, revokeOtherSessions: true })).status, 200);
        assert.equal((await db.select().from(schema.session).where(eq(schema.session.userId, editorId))).length, 0);
        await editor('/sign-in/email', { email: 'editor@example.test', password: newPassword });
        const editorSetup = await editor('/two-factor/enable', { password: newPassword });
        assert.equal(editorSetup.status, 200);
        assert.equal((await editor('/two-factor/verify-totp', { code: totp(editorSetup.data.totpURI) })).status, 200);
        assert.equal((await editor('/admin/create-user', { name: 'Intruder', email: 'intruder@example.test', password, role: 'admin' })).status, 403);
        assert.equal((await editor('/admin/list-users')).status, 403);
        assert.ok((await editor('/update-user', { mustChangePassword: true, role: 'admin' })).status >= 400);
        await editor('/sign-out', {});
        const challenge = await editor('/sign-in/email', { email: 'editor@example.test', password: newPassword });
        assert.equal(challenge.data.twoFactorRedirect, true);
        assert.equal((await editor('/two-factor/verify-backup-code', { code: editorSetup.data.backupCodes[0] })).status, 200);
        assert.ok((await db.query.session.findFirst({ where: eq(schema.session.userId, editorId) }))!.mfaVerifiedAt);
        await admin('/admin/set-user-password', { userId: editorId, newPassword: 'reset-editor-password' });
        assert.equal((await db.select().from(schema.session).where(eq(schema.session.userId, editorId))).length, 0);
        assert.equal((await db.query.user.findFirst({ where: eq(schema.user.id, editorId) }))!.mustChangePassword, true);
        assert.equal((await admin('/admin/ban-user', { userId: editorId })).status, 403);
        assert.equal((await admin('/admin/set-role', { userId: adminId, role: 'user' })).status, 403);
        assert.ok((await db.query.user.findFirst({ where: eq(schema.user.id, adminId) }))!.lastLoginAt);
        const actorSession = (await db.query.session.findFirst({ where:eq(schema.session.userId,adminId) }))!;
        await assert.rejects(changeUser(db,adminId,actorSession.id,{action:'delete',userId:adminId}),/own access/);
        await assert.rejects(changeUser(db,adminId,actorSession.id,{action:'update',userId:adminId,name:'Admin',role:'user'}),/own access/);
        await assert.rejects(changeUser(db,editorId,actorSession.id,{action:'delete',userId:adminId}),/Administrator access/);
        await assert.rejects(changeUser(db,adminId,'missing-session',{action:'reset',userId:editorId}),/Administrator access/);
        for (let i=0;i<5;i++) await consumeResetAttempt(db,adminId,100000);
        await assert.rejects(consumeResetAttempt(db,adminId,100000),/Too many attempts/);
        await consumeResetAttempt(db,adminId,161000);
        await db.insert(schema.verification).values({ id:randomUUID(),identifier:'pending',value:editorId,expiresAt:new Date(Date.now()+60000) });
        await changeUser(db,adminId,actorSession.id,{action:'reset',userId:editorId});
        assert.equal((await db.query.user.findFirst({where:eq(schema.user.id,editorId)}))!.twoFactorEnabled,false);
        assert.equal(await db.query.twoFactor.findFirst({where:eq(schema.twoFactor.userId,editorId)}),undefined);
        assert.equal((await db.select().from(schema.verification).where(eq(schema.verification.value,editorId))).length,0);
        await changeUser(db,adminId,actorSession.id,{action:'update',userId:editorId,name:'Updated name',role:'admin'});
        assert.equal((await db.query.user.findFirst({where:eq(schema.user.id,editorId)}))!.name,'Updated name');
        await changeUser(db,adminId,actorSession.id,{action:'delete',userId:editorId});
        assert.equal(await db.query.user.findFirst({where:eq(schema.user.id,editorId)}),undefined);
        const attacker = client('127.0.0.3');
        let rateLimited = false;
        for (let i = 0; i < 8; i++) {
            if ((await attacker('/sign-in/email', { email: 'none@example.test', password })).status === 429)
                rateLimited = true;
        }
        assert.ok(rateLimited);
        assert.ok((await db.select().from(schema.rateLimit)).length);
        const audit = await db.select().from(schema.auditLog);
        assert.ok(audit.length >= 5);
        assert.ok(!JSON.stringify(audit).includes(password));
    }
    finally {
        await pool.end();
    }
});

test('Fresh database installs all migrations and keeps the Drizzle snapshot aligned', { skip:!process.env.TEST_DATABASE_URL }, async () => {
    const original = new URL(process.env.TEST_DATABASE_URL!);
    assert.match(original.pathname,/^\/papapasta_test_[a-f0-9]+$/);
    const name = original.pathname.slice(1) + '_fresh';
    const source = createDatabase(original.toString());
    let fresh:ReturnType<typeof createDatabase>|undefined;
    let created=false;
    try {
        await source.pool.query(`CREATE DATABASE "${name}"`); created=true;
        original.pathname='/'+name; fresh=createDatabase(original.toString());
        await migrate(fresh.db,{migrationsFolder:'./drizzle'});
        await seedContent(fresh.db);
        assert.equal((await readMenus(fresh.db)).length,10);
        const tables = await fresh.pool.query("select tablename from pg_tables where schemaname='public'");
        assert.ok(tables.rows.some(row=>row.tablename==='qr_codes'));
        assert.equal(tables.rows.length,14);
        const {generateDrizzleJson,generateMigration}=await import('drizzle-kit/api');
        const snapshot=JSON.parse(await readFile('drizzle/meta/0003_snapshot.json','utf8'));
        const current=generateDrizzleJson(schema,snapshot.id,['public']);
        assert.deepEqual(await generateMigration(snapshot,current),[]);
    } finally { if(fresh) await fresh.pool.end(); if(created) await source.pool.query(`DROP DATABASE "${name}" WITH (FORCE)`); await source.pool.end(); }
});

test('Sections: banner lifecycle, shared photos, protected deletion and optimistic conflicts', { skip: !process.env.TEST_DATABASE_URL }, async () => {
    const { db, pool } = createDatabase(process.env.TEST_DATABASE_URL!,4);
    const restaurantId = randomUUID();
    const actor = 'section-test';
    const mainId = randomUUID(), extraId = randomUUID(), recId = randomUUID();
    const photo = randomUUID(), replacement = randomUUID(), wrong = randomUUID();
    const categoryId = randomUUID(), groupId = randomUUID(), itemId = randomUUID();
    const input = (version:number, removeBanner=false) => ({ menuId:extraId, id:extraId, version, kind:'menu', title:'Seasonal', note:'Subtitle', afterNote:'', removeBanner });
    try {
        await db.insert(schema.restaurants).values({ id:restaurantId, name:'Test sections' });
        await db.insert(schema.menus).values([{id:mainId,restaurantId,key:'main',title:'Main'},{id:extraId,restaurantId,key:'autumn',title:'Seasonal'},{id:recId,restaurantId,key:'recommendations',title:'Recommendations'}]);
        for (const id of [photo,replacement,wrong]) await db.insert(schema.mediaAssets).values({ id,objectKey:`papapasta/menu-images/${id}.webp`,width:1200,height:600,mimeType:'image/webp',byteSize:100,blurDataURL:'data:image/webp;base64,AA==',createdBy:id===wrong?'someone-else':actor });
        await assert.rejects(saveStructure(db,actor,input(1),wrong),/unavailable/);
        await saveStructure(db,actor,input(1),photo);
        assert.equal((await db.query.mediaAssets.findFirst({where:eq(schema.mediaAssets.id,photo)}))!.status,'ready');
        await db.insert(schema.categories).values({id:categoryId,menuId:mainId,slug:'test',label:'Shared'});
        await db.insert(schema.groups).values({id:groupId,categoryId});
        await db.insert(schema.items).values({id:itemId,groupId,name:'Shared image',imageId:photo});
        await saveStructure(db,actor,input(2),replacement);
        assert.equal((await db.query.mediaAssets.findFirst({where:eq(schema.mediaAssets.id,photo)}))!.status,'ready');
        await assert.rejects(saveStructure(db,actor,input(2,true)),/already changed/);
        assert.equal((await db.query.menus.findFirst({where:eq(schema.menus.id,extraId)}))!.bannerImageId,replacement);
        await saveStructure(db,actor,input(3,true));
        assert.equal((await db.query.mediaAssets.findFirst({where:eq(schema.mediaAssets.id,replacement)}))!.status,'orphan');
        const dto=(await readMenus(db,restaurantId)).find(m=>m.id===extraId)!;
        assert.equal(dto.bannerImageId,null);
        for(const id of [mainId,recId]) await assert.rejects(changeContent(db,actor,{action:'deleteMenu',menuId:id,version:1}),/cannot be deleted/);
        // A banner reference must keep an image alive when its last dish is removed.
        await db.update(schema.menus).set({bannerImageId:photo}).where(eq(schema.menus.id,extraId));
        await changeContent(db,actor,{action:'deleteItem',menuId:mainId,version:1,id:itemId});
        assert.equal((await db.query.mediaAssets.findFirst({where:eq(schema.mediaAssets.id,photo)}))!.status,'ready');
        // Deleting a populated section cascades its entire hierarchy and releases its banner.
        await db.insert(schema.categories).values({id:'delete-'+categoryId,menuId:extraId,slug:'test',label:'Delete'});
        await db.insert(schema.groups).values({id:'delete-'+groupId,categoryId:'delete-'+categoryId});
        await db.insert(schema.items).values({id:'delete-'+itemId,groupId:'delete-'+groupId,name:'Delete me'});
        await assert.rejects(changeContent(db,actor,{action:'deleteMenu',menuId:extraId,version:3}),/already changed/);
        await changeContent(db,actor,{action:'deleteMenu',menuId:extraId,version:4});
        assert.equal(await db.query.items.findFirst({where:eq(schema.items.id,'delete-'+itemId)}),undefined);
        assert.equal(await db.query.categories.findFirst({where:eq(schema.categories.id,'delete-'+categoryId)}),undefined);
        assert.equal((await db.query.mediaAssets.findFirst({where:eq(schema.mediaAssets.id,photo)}))!.status,'orphan');
        assert.equal((await db.query.auditLog.findFirst({where:eq(schema.auditLog.targetId,extraId),orderBy:(a,{desc})=>[desc(a.createdAt)]}))!.action,'menu.delete');
    } finally { await pool.end(); }
});

test('New sections: independent IDs, serialized order, upload ownership, audit and CRUD', { skip: !process.env.TEST_DATABASE_URL }, async () => {
    const { db, pool } = createDatabase(process.env.TEST_DATABASE_URL!, 4);
    const actor = 'section-create-test';
    const photo = randomUUID();
    const input = { restaurantId: 'centro', title: 'Menu letnie', subtitle: 'Estate' };
    try {
        await db.insert(schema.mediaAssets).values({ id: photo, objectKey: `test/${photo}.webp`, width: 1200, height: 600, mimeType: 'image/webp', byteSize: 100, blurDataURL: '', createdBy: actor });
        const before = await readMenus(db, 'centro');
        await assert.rejects(createMenu(db, 'other-editor', input, photo), /unavailable/);
        assert.equal((await readMenus(db, 'centro')).length, before.length);
        assert.equal((await db.query.mediaAssets.findFirst({ where: eq(schema.mediaAssets.id, photo) }))!.status, 'pending');
        const [first, second] = await Promise.all([createMenu(db, actor, input, photo), createMenu(db, actor, input)]);
        assert.notEqual(first.menuId, second.menuId);
        const rows = await db.query.menus.findMany({ where: eq(schema.menus.restaurantId, 'centro'), orderBy: (m, { asc }) => [asc(m.sortOrder)] });
        const created = rows.filter(m => [first.menuId, second.menuId].includes(m.id));
        assert.equal(created.length, 2);
        assert.equal(new Set(created.map(m => m.sortOrder)).size, 2);
        assert.ok(created.every(m => m.key.startsWith('section-') && m.version === 1));
        assert.ok(rows.slice(-2).every(m => [first.menuId, second.menuId].includes(m.id)));
        const section = (await readMenus(db, 'centro')).find(m => m.id === first.menuId)!;
        assert.equal(section.bannerImageId, photo);
        assert.deepEqual(section.categories, []);
        assert.ok(!(await readMenus(db, 'papapasta')).some(m => m.id === first.menuId));
        assert.equal((await db.query.mediaAssets.findFirst({ where: eq(schema.mediaAssets.id, photo) }))!.status, 'ready');
        assert.equal((await db.query.auditLog.findFirst({ where: eq(schema.auditLog.targetId, first.menuId) }))!.action, 'menu.create');
        await changeContent(db, actor, { action: 'createCategory', menuId: first.menuId, version: 1, title: 'Starters', note: '', columns: 1, columnBreak: 1 });
        await assert.rejects(saveStructure(db, actor, { menuId: first.menuId, id: first.menuId, version: 1, kind: 'menu', title: 'Stale', note: '', afterNote: '' }), /already changed/);
        await changeContent(db, actor, { action: 'deleteMenu', menuId: first.menuId, version: 2 });
        assert.equal((await db.query.mediaAssets.findFirst({ where: eq(schema.mediaAssets.id, photo) }))!.status, 'orphan');
        await changeContent(db, actor, { action: 'deleteMenu', menuId: second.menuId, version: 1 });
    } finally { await pool.end(); }
});
