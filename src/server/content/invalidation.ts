import { revalidatePath, updateTag } from 'next/cache';

type CacheOperations = { updateTag: typeof updateTag; revalidatePath: typeof revalidatePath };

export function restaurantInvalidationTargets(restaurantId: string) {
  if (restaurantId === 'papapasta') return {
    tag: 'menu:papapasta',
    paths: ['/home', '/menu', '/sitemap.xml'],
    // Dynamic patterns use the actual App Router file path, including route groups/slots.
    pages: ['/(papapasta)/menu/[slug]', '/(papapasta)/@dish/(.)menu/[slug]'],
  };
  if (restaurantId === 'centro') return {
    tag: 'menu:centro',
    paths: ['/site-centro', '/site-centro/menu', '/site-centro/sitemap.xml'],
    pages: ['/(centro)/site-centro/menu/[slug]', '/(centro)/site-centro/@dish/(.)menu/[slug]'],
  };
  throw new Error('Unknown restaurant');
}

// Called only by authenticated Server Actions, after the content transaction succeeds.
export function invalidateRestaurantContent(restaurantIds: readonly string[], operations: CacheOperations = { updateTag, revalidatePath }) {
  const targets = [...new Set(restaurantIds)].map(restaurantInvalidationTargets);
  for (const target of targets) {
    operations.updateTag(target.tag);
    for (const path of target.paths) operations.revalidatePath(path);
    for (const path of target.pages) operations.revalidatePath(path, 'page');
  }
}
