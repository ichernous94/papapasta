import './helpers/register-styles.cjs';
import React, { Suspense } from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import { redirect } from 'next/navigation';
import MenuSkeleton from '../src/components/MenuSkeleton';
import { loadMenuState, findMenuSection, hasPublishedItems, publishedCategories, additionalMenuSections } from '../src/server/content/menu-state';
import { menuHeadings } from '../src/config/menu-headings';
import { seedMenus } from '../src/server/content/seed-data';
import type { EditorMenu, EditorItem } from '../src/types/admin';

const item: EditorItem = { id:'item', groupId:'group', name:'Published dish', portion:'', price:'55', description:[], isNew:false, visible:true, imageId:null, imageAlt:'', sortOrder:0, allergens:[] };
const menu: EditorMenu = { id:'papa:main', restaurantId:'papapasta', key:'main', title:'Edited title', subtitle:'Edited subtitle', version:1, bannerImageId:null, categories:[{ id:'cat', label:'Category', groups:[{ id:'group', title:'', note:'', afterNote:'', items:[item] }] }] };

test('Skeleton has one accessible loading message, decorative rows and explicit themes', () => {
  for (const restaurantId of ['papapasta','centro'] as const) {
    const html = renderToStaticMarkup(<MenuSkeleton restaurantId={restaurantId}/>);
    assert.ok(html.includes(`data-restaurant="${restaurantId}"`));
    assert.ok(html.includes('aria-busy="true"'));
    assert.equal((html.match(/Ładowanie menu…/g) ?? []).length, 1);
    assert.equal((html.match(/class="row"/g) ?? []).length, 4);
    assert.equal((html.match(/class="tabs"/g) ?? []).length, 1);
    assert.ok(html.includes('aria-hidden="true"'));
    assert.ok(!/<button|<a\b|tabindex/.test(html));
    const rec = renderToStaticMarkup(<MenuSkeleton restaurantId={restaurantId} showTabs={false} rows={3}/>);
    assert.ok(!rec.includes('class="tabs"'));
    assert.equal((rec.match(/class="row"/g) ?? []).length, 3);
  }
});

test('Section selection isolates restaurants and keeps admin titles; empty/hidden data has no published items', async () => {
  const centro = { ...menu, restaurantId:'centro', title:'Centro title' };
  const state = await loadMenuState(async () => [menu, centro]);
  assert.equal(findMenuSection(state,'papapasta','main')?.title,'Edited title');
  assert.equal(findMenuSection(state,'centro','main')?.title,'Centro title');
  assert.equal(findMenuSection(state,'papapasta','wine'),undefined);
  assert.equal(findMenuSection(await loadMenuState(async () => []),'papapasta','main'),undefined);
  assert.equal(hasPublishedItems({ ...menu, categories:[] }),false);
  const hidden = { ...menu, categories:[{ ...menu.categories[0],groups:[{ ...menu.categories[0].groups[0],items:[{ ...item,visible:false }] }] }] };
  assert.equal(hasPublishedItems(hidden),false);
  assert.deepEqual(publishedCategories(hidden)[0].groups[0].items,[]);
  assert.equal(hasPublishedItems(menu),true);
  assert.equal(hidden.categories[0].groups[0].items.length,1);
});

test('Read failure exposes no details, can be retried, and Next redirects are rethrown', async () => {
  assert.deepEqual(await loadMenuState(async () => { throw new Error('private connection details'); }),{ status:'error' });
  const next = await loadMenuState(async () => [menu]);
  assert.equal(next.status,'ready');
  await assert.rejects(loadMenuState(async () => redirect('/menu')),error => (error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT') === true);
});

test('Initial heading defaults match seed copy without importing dish fixtures in the public shell', () => {
  for (const source of seedMenus) {
    const defaults: Record<string,{ title:string; subtitle:string }> = menuHeadings[source.restaurantId as keyof typeof menuHeadings];
    assert.deepEqual(defaults[source.key],{ title:source.title,subtitle:source.subtitle });
  }
});

test('Delayed server data streams static shell and skeleton before actual dishes', async () => {
  let release!: (value: EditorMenu[]) => void;
  const delayed = new Promise<EditorMenu[]>(resolve => { release = resolve; });
  const statePromise = loadMenuState(() => delayed);
  async function Content() {
    const state = await statePromise;
    const section = findMenuSection(state,'papapasta','main');
    return <div>{section?.categories[0].groups[0].items[0].name}</div>;
  }
  let chunks = '';
  const output = new PassThrough();
  output.on('data',chunk => { chunks += chunk.toString(); });
  const finished = new Promise<void>((resolve,reject) => { output.on('end',resolve); output.on('error',reject); });
  let shellReady!: () => void;
  const shell = new Promise<void>(resolve => { shellReady = resolve; });
  // eslint-disable-next-line @next/next/no-head-element -- Standalone React stream needs an explicit document preamble.
  const stream = renderToPipeableStream(<html><head/><body><header>Restaurant header</header><h1>Static banner</h1><Suspense fallback={<MenuSkeleton restaurantId="papapasta"/>}><Content/></Suspense><footer>Static gallery</footer></body></html>,{
    bootstrapScripts: ['/test-client.js'],
    onShellReady() { output.once('data', shellReady); stream.pipe(output); }, onError(error) { output.destroy(error as Error); },
  });
  await shell;
  assert.ok(chunks.includes('Static banner') && chunks.includes('Static gallery'));
  assert.ok(chunks.includes('Ładowanie menu…'));
  assert.ok(!chunks.includes('Published dish'));
  release([menu]);
  await finished;
  assert.ok(chunks.includes('Published dish'));
});

test('Dynamic sections preserve order, admin copy and restaurant isolation without duplicating built-ins', () => {
  const custom = { ...menu, id: 'new', key: 'section-stable-id', title: 'Menu letnie' };
  const another = { ...custom, id: 'newer', key: 'section-another' };
  const state = { status: 'ready' as const, menus: [menu, { ...menu, key: 'wine' }, { ...menu, key: 'recommendations' }, custom, { ...custom, restaurantId: 'centro' }, another] };
  assert.deepEqual(additionalMenuSections(state, 'papapasta'), [custom, another]);
  assert.deepEqual(additionalMenuSections(state, 'centro'), [{ ...custom, restaurantId: 'centro' }]);
  assert.deepEqual(additionalMenuSections({ status: 'error' }, 'centro'), []);
});
