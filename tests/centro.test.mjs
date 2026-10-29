import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { NextRequest } from 'next/server.js';
import pageFlip from 'page-flip';
const { PageFlip } = pageFlip;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const requireModule = createRequire(import.meta.url);

// Compile the actual TS modules in memory; no generated files or test framework needed.
function load(relativePath) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('exports', 'require', source)(exports, requireModule);
  return exports;
}
const { proxy } = load('src/proxy.ts');
const { centroMainMenu, centroBreakfast, centroAutumnMenu, centroKidsMenu } = load('src/config/centro-menu.ts');
const { centro, centroRecommendations, centroMapsEmbedUrl } = load('src/config/centro.ts');
const { centroBookPages } = load('src/config/centro-book.ts');
const { centroPageMetadata } = load('src/config/metadata.ts');
const { restaurantPath } = load('src/utils/restaurantPath.ts');

for (const hostname of ['centro.papapasta.pl', 'centro.localhost:3000']) {
  test(`Centro rewrites preserve public path and query on ${hostname}`, () => {
    for (const page of ['', '/menu', '/nasz-lokal', '/kontakt', '/cocktail-bar', '/promocje', '/zestawy-obiadowe', '/missing', '/robots.txt', '/sitemap.xml']) {
      const request = new NextRequest(`http://${hostname}${page || '/'}?source=test&_rsc=abc`, { headers: { host: hostname } });
      const response = proxy(request);
      const url = new URL(response.headers.get('x-middleware-rewrite'));
      assert.equal(url.pathname, '/site-centro' + page);
      assert.equal(url.searchParams.get('source'), 'test');
      assert.equal(url.searchParams.get('_rsc'), 'abc');
    }
  });
}

test('PapaPasta, localhost and preview hosts retain existing routes', () => {
  for (const host of ['papapasta.pl', 'localhost:3000', 'preview.example.com', 'centro.papapasta.pl.example.com']) {
    const response = proxy(new NextRequest(`https://${host}/menu`, { headers: { host } }));
    assert.equal(response.headers.get('x-middleware-rewrite'), null);
  }
});

test('Technical routes are blocked on either host, assets and APIs pass through', () => {
  for (const host of ['papapasta.pl', 'centro.papapasta.pl']) {
    for (const suffix of ['', '/menu', '/robots.txt']) {
      assert.equal(proxy(new NextRequest(`https://${host}/site-centro${suffix}`, { headers: { host } })).status, 404);
    }
  }
  for (const url of ['/api', '/api/revalidate', '/_next/static/app.js', '/_next/image?url=test', '/images/centro/post.jpg', '/icons/logo.svg', '/videos/centro.mp4', '/fonts/font.woff2', '/documents/menu.pdf', '/favicon.ico']) {
    assert.equal(proxy(new NextRequest('https://centro.papapasta.pl' + url)).headers.get('x-middleware-rewrite'), null);
  }
  assert.equal(restaurantPath('/site-centro'), '/');
  assert.equal(restaurantPath('/site-centro/menu'), '/menu');
  assert.equal(restaurantPath('/home'), '/home');
});

test('Assortment, approved price differences and identifiers are preserved', () => {
  const count = groups => groups.reduce((sum, group) => sum + group.items.length, 0);
  assert.deepEqual(centroMainMenu.map(category => count(category.groups)), [10, 3, 10, 10, 4, 18, 4, 28]);
  assert.equal(count(centroBreakfast), 10);
  assert.equal(count(centroAutumnMenu), 6);
  assert.equal(count(centroKidsMenu), 5);
  assert.equal(centroRecommendations.length, 10);
  const items = centroMainMenu.flatMap(category => category.groups.flatMap(group => group.items));
  assert.equal(new Set(items.map(item => item.id)).size, items.length);
  assert.equal(items.find(item => item.id === 'gnocchi').price, '54');
  assert.equal(centroRecommendations.find(item => item.id === 'gnocchi').price, 53);
  assert.equal(items.find(item => item.id === 'gambero-piccante').price, '51');
  assert.equal(items.find(item => item.id === 'burrata-piccante').price, '58');
  assert.equal(items.find(item => item.name === 'Cappy pomarańczowy').price, '9');
  assert.ok(items.every(item => !item.description?.some(line => line.includes('bezglutenowym'))));
});

test('Centro metadata, contacts, book order and local assets', () => {
  assert.equal(centro.phoneHref, 'tel:+48883317389');
  assert.equal(centro.facebookUrl, 'https://www.facebook.com/papapasta.centro/');
  assert.equal(new URL(centroMapsEmbedUrl).searchParams.get('pb').includes('23.1612644'), true);
  assert.equal(centroBookPages.length, 14);
  assert.equal(centroBookPages[0].file, 'mojito-promo.png');
  assert.equal(centroBookPages[4].file, 'сoffee-and-cocktails.png');
  assert.equal(centroBookPages[13].file, 'business-card.png');
  for (const page of centroBookPages) assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', page.src)));
  for (const page of ['/', '/menu', '/nasz-lokal', '/kontakt', '/cocktail-bar', '/promocje', '/zestawy-obiadowe']) {
    const metadata = centroPageMetadata(page, 'Centro test', 'Centro description');
    assert.equal(metadata.metadataBase.origin, 'https://centro.papapasta.pl');
    assert.equal(metadata.alternates.canonical, page);
    assert.equal(metadata.openGraph.url, page);
    assert.equal(metadata.twitter.title, 'Centro test');
  }
});

test('Patched page-flip stops rendering and cancels delayed initialization on destroy', async () => {
  const calls = [];
  let initialized = false;
  const book = {
    initTimer: setTimeout(() => { initialized = true; }, 5),
    render: { stop: () => calls.push('stop') },
    ui: { destroy: () => calls.push('ui') },
    block: { remove: () => calls.push('remove') },
  };
  PageFlip.prototype.destroy.call(book);
  await new Promise(resolve => setTimeout(resolve, 15));
  assert.equal(initialized, false);
  assert.deepEqual(calls, ['stop', 'ui', 'remove']);
});
