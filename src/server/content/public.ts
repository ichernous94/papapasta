import 'server-only';
import { connection } from 'next/server';
import { cache } from 'react';
import { cacheTag, cacheLife } from 'next/cache';
import { connection } from 'next/server';
import { getDb } from '@/server/db';
import { readMenus } from './read';
import { loadMenuState } from './menu-state';
async function cachedPublicMenus(restaurantId: 'papapasta' | 'centro') {
    'use cache';
    cacheTag(`menu:${restaurantId}`);
    cacheLife({ stale: 0, revalidate: 3600, expire: 86400 });
    return readMenus(getDb(), restaurantId, true);
}
export async function publicMenus(restaurantId: 'papapasta' | 'centro') {
    // Keep database content out of the build/static shell, but retain tagged runtime caching.
    // This must stay outside the cached scope: connection() inside "use cache" is invalid.
    await connection();
    return cachedPublicMenus(restaurantId);
}
export async function publicMenu(restaurantId: 'papapasta' | 'centro', key: string) {
    const menu = (await publicMenus(restaurantId)).find(m => m.key === key);
    if (!menu)
        throw new Error('Menu data is unavailable.');
    return menu;
}

// Deduplicate the result across banners, lists and recommendations in one render.
export const publicMenuState = cache((restaurantId: 'papapasta' | 'centro') => loadMenuState(() => publicMenus(restaurantId)));
