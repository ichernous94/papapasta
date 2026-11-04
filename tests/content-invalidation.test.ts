import { test } from 'node:test';
import assert from 'node:assert/strict';
import { invalidateRestaurantContent, restaurantInvalidationTargets } from '../src/server/content/invalidation';

test('PapaPasta invalidates its tag, public pages, sitemap and grouped dish patterns only', () => {
  const tags: string[] = [], paths: [string, string | undefined][] = [];
  invalidateRestaurantContent(['papapasta'], { updateTag: tag => { tags.push(tag); }, revalidatePath: (path, type) => { paths.push([path, type]); } });
  assert.deepEqual(tags, ['menu:papapasta']);
  assert.deepEqual(paths, [['/home', undefined], ['/menu', undefined], ['/sitemap.xml', undefined], ['/(papapasta)/menu/[slug]', 'page'], ['/(papapasta)/@dish/(.)menu/[slug]', 'page']]);
  assert.ok(!paths.some(([path]) => path.includes('site-centro')));
});

test('Centro uses rewrite destinations and transfer invalidation deduplicates both restaurants', () => {
  const tags: string[] = [], paths: string[] = [];
  invalidateRestaurantContent(['centro', 'papapasta', 'centro'], { updateTag: tag => { tags.push(tag); }, revalidatePath: path => { paths.push(path); } });
  assert.deepEqual(tags, ['menu:centro', 'menu:papapasta']);
  assert.equal(paths.filter(path => path === '/site-centro/menu').length, 1);
  assert.ok(paths.includes('/site-centro/sitemap.xml'));
  assert.ok(paths.includes('/(centro)/site-centro/menu/[slug]'));
  assert.ok(paths.includes('/(centro)/site-centro/@dish/(.)menu/[slug]'));
});

test('Invalid restaurant identifiers cannot cause partial or global invalidation', () => {
  assert.throws(() => restaurantInvalidationTargets('unknown'), /Unknown restaurant/);
  let called = false;
  assert.throws(() => invalidateRestaurantContent(['papapasta', 'unknown'], { updateTag: () => { called = true; }, revalidatePath: () => { called = true; } }), /Unknown restaurant/);
  assert.equal(called, false);
});
