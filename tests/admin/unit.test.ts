import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { itemInputSchema, createUserSchema, qrInputSchema } from '../../src/validation/admin';
import { processDishImage } from '../../src/server/media/image-processing';
import { contentOperationSchema } from '../../src/server/content/write';
import { seedMenus, legacySeedMenus } from '../../src/server/content/seed-data';
import { isAdminHost } from '../../src/server/auth/origin';
test('Only standard roles; price is a display string, server flags cannot be injected', () => {
    const user = { name: 'Editor', email: 'editor@example.test', password: 'temporary-password' };
    assert.equal(createUserSchema.safeParse({ ...user, role: 'user' }).success, true);
    assert.equal(createUserSchema.safeParse({ ...user, role: 'superadmin' }).success, false);
    assert.equal(createUserSchema.safeParse({ ...user, role: 'user', mustChangePassword: false }).success, false);
    for (const price of ['29/36', 'do wyboru', 'w cenie steków', ''])
        assert.equal(itemInputSchema.safeParse({ menuId: 'menu', version: 1, groupId: 'group', name: 'Danie', portion: '', price, description: '', isNew: false, visible: true, imageAlt: '', removeImage: false }).success, true);
    assert.equal(isAdminHost('centro.localhost:3000'), false);
    assert.equal(isAdminHost('admin.papapasta.pl.evil.example'), false);
});
test('Seed has exactly three sections per restaurant, current PapaPasta screenshots and unchanged Centro identities', () => {
    for (const restaurantId of ['papapasta','centro']) {
        const fixed = seedMenus.filter(m => m.restaurantId === restaurantId);
        assert.deepEqual(fixed.map(m => m.key), ['main','kids','drinks']);
        const identities = fixed.flatMap(m => m.categories.flatMap(c => c.groups.flatMap(g => g.items.map(i => i.storageId))));
        const original = legacySeedMenus.filter(m => m.restaurantId === restaurantId && m.key !== 'recommendations').flatMap(m => m.categories.flatMap(c => c.groups.flatMap(g => g.items.map(i => `${restaurantId}:${m.key}:${c.id}:${g.id}:${i.id}`))));
        if (restaurantId === 'centro') assert.deepEqual([...identities].sort(), original.sort());
        else {
            assert.equal(identities.length, 151);
            assert.deepEqual(fixed[0].categories.map(c => c.label), ['Przystawki','Sałatki','Zupy','Makarony','Dania główne','Pizza','Desery','Napoje zimne','Napoje gorące']);
            const items = fixed.flatMap(m => m.categories.flatMap(c => c.groups.flatMap(g => g.items)));
            assert.equal(items.filter(i => i.name === 'Finlandia').length, 1);
            assert.equal(items.find(i => i.id === 'gamberetti-mela')!.price, '59');
            assert.equal(items.find(i => i.id === 'gamberetti-mela')!.recommended, true);
            assert.equal(items.find(i => i.id === 'crema-pomodoro')!.meatless, true);
            assert.equal(items.find(i => i.id === 'salame-piccante')!.spicy, true);
            assert.equal(items.find(i => i.id === 'salame-piccante')!.recommended, true);
            assert.ok(items.filter(i => i.name.startsWith('Altiero')).every(i => !i.meatless));
        }
        assert.equal(new Set(identities).size, identities.length);
        const drinks = fixed.find(m => m.key === 'drinks')!;
        if (restaurantId === 'centro') {
            assert.ok(drinks.categories.some(c => c.id === 'napoje'));
            assert.ok(drinks.categories.some(c => c.groups.some(g => g.id === 'hot-drinks')));
        } else assert.deepEqual(drinks.categories.map(c => c.label), ['Koktajle','Koktajle bezalkoholowe','Wina Czerwone','Wina Białe','Wermuty','Whisky','Piwo','Pozostałe alkohole']);
    }
    const main = seedMenus.find(m => m.restaurantId === 'centro' && m.key === 'main')!;
    assert.equal(main.categories.flatMap(c => c.groups.flatMap(g => g.items)).find(i => i.name.toLowerCase().startsWith('gnocchi'))!.price, '54');
});
test('Photo processing checks actual bytes, strips metadata, caps size and creates individual blur', async () => {
    const buffer = await sharp({ create: { width: 2000, height: 1000, channels: 3, background: '#ff8800' } }).jpeg().withMetadata().toBuffer();
    const image = await processDishImage(buffer);
    assert.equal(image.width, 1600);
    assert.equal(image.height, 800);
    const metadata = await sharp(image.data).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.exif, undefined);
    assert.ok(image.blurDataURL.startsWith('data:image/webp;base64,'));
    await assert.rejects(processDishImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"/>')));
    await assert.rejects(processDishImage(Buffer.from('not an image')));
    await assert.rejects(processDishImage(Buffer.alloc(5 * 1024 * 1024 + 1)));
    const oversized = await sharp({ create: { width: 6000, height: 5000, channels: 3, background: 'white' } }).png().toBuffer();
    await assert.rejects(processDishImage(oversized));
    const frameA = Buffer.alloc(20 * 20 * 3, 25), frameB = Buffer.alloc(20 * 20 * 3, 220);
    const animated = await sharp(Buffer.concat([frameA, frameB]), { raw: { width: 20, height: 40, channels: 3, pageHeight: 20 } }).webp({ loop: 0, delay: [100, 100] }).toBuffer();
    assert.equal((await sharp(animated, { animated: true }).metadata()).pages, 2);
    await assert.rejects(processDishImage(animated));
});
test('R2 unavailable and transport failures are reported without modifying Cloudflare configuration', async () => {
    const { mock } = await import('node:test');
    const { S3Client } = await import('@aws-sdk/client-s3');
    const { uploadObject, deleteObject, MEDIA_PREFIX } = await import('../../src/server/media/storage');
    const names = ['R2_ACCOUNT_ID', 'R2_BUCKET_NAME', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_BASE_URL'];
    const previous = names.map(name => process.env[name]);
    try {
        names.forEach(name => delete process.env[name]);
        await assert.rejects(uploadObject(MEDIA_PREFIX + 'test.webp', Buffer.from('test')), /not configured/);
        names.forEach((name, index) => { process.env[name] = index === 4 ? 'https://images.example.test' : 'test-only'; });
        const transport = mock.method(S3Client.prototype, 'send', async () => { throw new Error('Simulated transport error'); });
        await assert.rejects(uploadObject(MEDIA_PREFIX + 'test.webp', Buffer.from('test')), /Simulated/);
        await assert.rejects(deleteObject('outside-app/test.webp'), /outside the application scope/);
        assert.equal(transport.mock.callCount(), 1);
        transport.mock.restore();
    }
    finally {
        names.forEach((name, index) => { if (previous[index] === undefined)
            delete process.env[name];
        else
            process.env[name] = previous[index]; });
    }
});
test('Admin rewrites preserve queries, mark private responses and block technical paths', async () => {
    const { NextRequest } = await import('next/server');
    const { proxy } = await import('../../src/proxy');
    for (const host of ['admin.papapasta.pl', 'admin.localhost:3000']) {
        const response = proxy(new NextRequest(`http://${host}/menus?restaurant=centro`, { headers: { host } }));
        assert.match(response.headers.get('x-middleware-rewrite')!, /\/site-admin\/menus\?restaurant=centro$/);
        assert.match(response.headers.get('cache-control')!, /no-store/);
        assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
        assert.equal(proxy(new NextRequest(`http://${host}/site-admin/login`, { headers: { host } })).status, 404);
    }
    assert.equal(proxy(new NextRequest('http://localhost:3000/site-admin', { headers: { host: 'localhost:3000' } })).status, 404);
    assert.equal(proxy(new NextRequest('http://localhost:3000/%73ite-admin/login', { headers: { host: 'localhost:3000' } })).status, 404);
});

test('QR links permit only absolute HTTP(S) URLs and known restaurants', () => {
    const base = { name:'Main menu', restaurantId:'papapasta', active:true };
    for (const url of ['https://papapasta.pl/menu','http://centro.localhost:3000/menu']) assert.ok(qrInputSchema.safeParse({...base,url}).success);
    for (const url of ['javascript:alert(1)','data:text/html,test','/menu','ftp://example.test/menu','invalid']) assert.equal(qrInputSchema.safeParse({...base,url}).success,false);
    assert.equal(qrInputSchema.safeParse({...base,url:'https://example.test',restaurantId:'other'}).success,false);
});

test('Server operation validation rejects legacy section creation/deletion requests', () => {
    assert.equal(contentOperationSchema.safeParse({ action:'deleteMenu', menuId:'papapasta:main', version:1 }).success, false);
    assert.equal(contentOperationSchema.safeParse({ action:'createMenu', restaurantId:'centro', title:'Another section', subtitle:'' }).success, false);
});
