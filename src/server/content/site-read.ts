import { and, eq } from 'drizzle-orm';
import type { createDatabase } from '@/server/db/connection';
import { promotions, galleryEntries, restaurantGalleries } from '@/server/db/schema';
import { contentImages } from '@/config/content-images';
import { publicImageURL } from '@/server/media/storage';
import type { Promotion, RestaurantGallery, RestaurantId } from '@/types/content';
import type { DishImage } from '@/types/menu';
type Database = ReturnType<typeof createDatabase>['db'];
export async function resolveContentImage(db: Database, imageId: string | null, staticImage: string | null, alt: string): Promise<DishImage | undefined> {
  if (imageId) {
    const asset = await db.query.mediaAssets.findFirst({ where: (m, { eq }) => eq(m.id, imageId) });
    const src = asset?.status === 'ready' ? publicImageURL(asset.objectKey) : null;
    return asset && src ? { src, width: asset.width, height: asset.height, blurDataURL: asset.blurDataURL, alt } : undefined;
  }
  const initial = staticImage ? contentImages[staticImage as keyof typeof contentImages] : undefined;
  return initial ? { ...initial, alt } : undefined;
}
export async function readPromotions(db: Database, onlyPublished = false): Promise<Promotion[]> {
  const rows = await db.query.promotions.findMany({ where: onlyPublished ? and(eq(promotions.restaurantId, 'centro'), eq(promotions.published, true)) : eq(promotions.restaurantId, 'centro'), orderBy: (p, { desc, asc }) => [desc(p.date), asc(p.id)] });
  return Promise.all(rows.map(async row => ({ ...row, image: await resolveContentImage(db, row.imageId, row.staticImage, row.imageAlt || row.title) })));
}
export async function readGallery(db: Database, restaurantId: RestaurantId, onlyVisible = false): Promise<RestaurantGallery> {
  const parent = await db.query.restaurantGalleries.findFirst({ where: eq(restaurantGalleries.restaurantId, restaurantId) });
  if (!parent) throw new Error('Gallery is not initialized. Run db:seed after migrating.');
  const rows = await db.query.galleryEntries.findMany({ where: onlyVisible ? and(eq(galleryEntries.restaurantId, restaurantId), eq(galleryEntries.visible, true)) : eq(galleryEntries.restaurantId, restaurantId), orderBy: (g, { asc }) => [asc(g.sortOrder), asc(g.id)] });
  return { restaurantId, version: parent.version, images: await Promise.all(rows.map(async row => ({ ...row, image: await resolveContentImage(db, row.imageId, row.staticImage, row.alt) }))) };
}
