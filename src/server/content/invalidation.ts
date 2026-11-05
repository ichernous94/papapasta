import { revalidatePath, updateTag } from 'next/cache';

export function invalidateRestaurantContent(ids: readonly string[]) {
  for (const id of new Set(ids)) {
    if (id !== 'papapasta' && id !== 'centro') throw new Error('Unknown restaurant');
    updateTag(`menu:${id}`);
    const root = id === 'centro' ? '/site-centro' : '';
    for (const path of [id === 'centro' ? root : '/home', `${root}/menu`, `${root}/sitemap.xml`]) revalidatePath(path);
    const group = id === 'centro' ? '/(centro)/site-centro' : '/(papapasta)';
    revalidatePath(`${group}/menu/[slug]`, 'page');
    revalidatePath(`${group}/@dish/(.)menu/[slug]`, 'page');
  }
}
