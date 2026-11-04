import 'server-only';
import { cacheTag, cacheLife } from 'next/cache';
import { getDb } from '@/server/db';
import { readMenus } from './read';
export async function publicMenus(restaurantId: 'papapasta' | 'centro') {
    'use cache';
    cacheTag(`menu:${restaurantId}`);
    cacheLife({ stale: 0, revalidate: 3600, expire: 86400 });
    return readMenus(getDb(), restaurantId, true);
}
export async function publicMenu(restaurantId: 'papapasta' | 'centro', key: string) {
    const menu = (await publicMenus(restaurantId)).find(m => m.key === key);
    if (!menu)
        throw new Error('Menu data is unavailable.');
    return menu;
}
