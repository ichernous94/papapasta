import 'server-only';
import { cache } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { getDb } from '@/server/db';
import { readMenus } from './read';
import { loadMenuState } from './menu-state';
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

// Deduplicate the result across banners, lists and recommendations in one render.
export const publicMenuState = cache((restaurantId: 'papapasta' | 'centro') => loadMenuState(() => publicMenus(restaurantId)));
