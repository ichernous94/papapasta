import 'server-only';
import { connection } from 'next/server';
import { cacheTag, cacheLife } from 'next/cache';
import { getDb } from '@/server/db';
import type { RestaurantId } from '@/types/content';
import { readPromotions, readPromotionPopup, readGallery } from './site-read';
async function cachedPromotions() {
  'use cache';
  cacheTag('promotions:centro');
  cacheLife({ stale: 0, revalidate: 3600, expire: 86400 });
  return readPromotions(getDb(), true);
}
export async function publicPromotions() { await connection(); return cachedPromotions(); }
async function cachedPromotionPopup() {
  'use cache';
  cacheTag('popup:centro');
  cacheLife({ stale: 0, revalidate: 3600, expire: 86400 });
  return readPromotionPopup(getDb(), true);
}
export async function publicPromotionPopup() { await connection(); return cachedPromotionPopup(); }
async function cachedGallery(restaurantId: RestaurantId) {
  'use cache';
  cacheTag(`gallery:${restaurantId}`);
  cacheLife({ stale: 0, revalidate: 3600, expire: 86400 });
  return readGallery(getDb(), restaurantId, true);
}
export async function publicGallery(restaurantId: RestaurantId) { await connection(); return cachedGallery(restaurantId); }
