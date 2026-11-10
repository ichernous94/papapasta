import { randomUUID } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import type { createDatabase } from '@/server/db/connection';
import { promotions, galleryEntries, restaurantGalleries, restaurants, auditLog } from '@/server/db/schema';
import { popupInputSchema, promotionInputSchema, promotionDeleteSchema, galleryInputSchema, galleryOperationSchema } from '@/validation/site-content';
import { CENTRO_POPUP_SLUG } from '@/config/promotion-popup';
import { attachUpload, orphanUnused } from '@/server/media/references';
import { ContentError } from './errors';
type Database = ReturnType<typeof createDatabase>['db'];
type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];
const conflict = () => new ContentError('This content was already changed. Copy your changes and refresh the page.');
async function audit(tx: Transaction, actorId: string, action: string, targetId: string) {
  await tx.insert(auditLog).values({ actorId, action, targetId });
}
export async function savePromotion(db: Database, actorId: string, raw: unknown, uploadId?: string) {
  const input = promotionInputSchema.parse(raw);
  return db.transaction(async tx => {
    // Serialize creation to keep initial content and concurrent editors consistent.
    await tx.select().from(restaurants).where(eq(restaurants.id, 'centro')).for('update');
    const old = input.id ? (await tx.select().from(promotions).where(and(eq(promotions.id, input.id), eq(promotions.restaurantId, 'centro'))).for('update'))[0] : undefined;
    if (input.id && !old) throw new ContentError('Promotion not found');
    if (old?.slug === CENTRO_POPUP_SLUG) throw new ContentError('Use the dedicated popup editor');
    if (old && old.version !== input.version) throw conflict();
    if (uploadId) await attachUpload(tx, actorId, uploadId);
    const imageId = uploadId ?? (input.removeImage ? null : old?.imageId ?? null);
    const staticImage = uploadId || input.removeImage ? null : old?.staticImage ?? null;
    if (input.published && !imageId && !staticImage) throw new ContentError('Published promotions need an image');
    const id = old?.id ?? randomUUID();
    const stem = input.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'l').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'promocja';
    const values = { title: input.title, date: input.date, body: input.body.filter(b => b.text), published: input.published, imageAlt: input.imageAlt, imageId, staticImage, updatedAt: new Date() };
    if (old) await tx.update(promotions).set({ ...values, version: old.version + 1 }).where(eq(promotions.id, id));
    else await tx.insert(promotions).values({ id, restaurantId: 'centro', slug: `${stem}-${id.slice(0,8)}`, ...values });
    if (old?.imageId && old.imageId !== imageId) await orphanUnused(tx, old.imageId);
    await audit(tx, actorId, old ? 'promotion.update' : 'promotion.create', id);
    return id;
  });
}
export async function deletePromotion(db: Database, actorId: string, raw: unknown) {
  const input = promotionDeleteSchema.parse(raw);
  await db.transaction(async tx => {
    const [old] = await tx.select().from(promotions).where(and(eq(promotions.id, input.id), eq(promotions.restaurantId, 'centro'))).for('update');
    if (!old) throw new ContentError('Promotion not found');
    if (old.slug === CENTRO_POPUP_SLUG) throw new ContentError('The popup cannot be deleted. Disable it in the popup editor.');
    if (old.version !== input.version) throw conflict();
    await tx.delete(promotions).where(eq(promotions.id, old.id));
    if (old.imageId) await orphanUnused(tx, old.imageId);
    await audit(tx, actorId, 'promotion.delete', old.id);
  });
}
export async function savePromotionPopup(db: Database, actorId: string, raw: unknown, uploadId?: string) {
  const input = popupInputSchema.parse(raw);
  await db.transaction(async tx => {
    await tx.select().from(restaurants).where(eq(restaurants.id, 'centro')).for('update');
    const [old] = await tx.select().from(promotions).where(and(eq(promotions.restaurantId, 'centro'), eq(promotions.slug, CENTRO_POPUP_SLUG))).for('update');
    if (!old) throw new ContentError('Popup is not initialized. Run migrations and db:seed.');
    if (old.version !== input.version) throw conflict();
    if (uploadId) await attachUpload(tx, actorId, uploadId);
    const imageId = uploadId ?? (input.removeImage ? null : old.imageId);
    const staticImage = uploadId || input.removeImage ? null : old.staticImage;
    if (input.enabled && !imageId && !staticImage) throw new ContentError('An enabled popup needs an image');
    const body = [{ type: 'paragraph' as const, text: input.description, enabled: input.enabled }];
    await tx.update(promotions).set({ title: input.title, body,
      published: false, imageAlt: input.imageAlt, imageId, staticImage, version: old.version + 1, updatedAt: new Date(),
    }).where(eq(promotions.id, old.id));
    if (old.imageId && old.imageId !== imageId) await orphanUnused(tx, old.imageId);
    await audit(tx, actorId, 'popup.update', old.id);
  });
}
async function lockGallery(tx: Transaction, restaurantId: string, version: number) {
  const [gallery] = await tx.select().from(restaurantGalleries).where(eq(restaurantGalleries.restaurantId, restaurantId)).for('update');
  if (!gallery) throw new ContentError('Gallery is not initialized. Run db:seed first.');
  if (gallery.version !== version) throw conflict();
}
async function finishGallery(tx: Transaction, actorId: string, restaurantId: string, action: string, targetId: string) {
  await tx.update(restaurantGalleries).set({ version: sql`${restaurantGalleries.version} + 1` }).where(eq(restaurantGalleries.restaurantId, restaurantId));
  await audit(tx, actorId, `gallery.${action}`, targetId);
}
export async function saveGalleryEntry(db: Database, actorId: string, raw: unknown, uploadId?: string) {
  const input = galleryInputSchema.parse(raw);
  await db.transaction(async tx => {
    await lockGallery(tx, input.restaurantId, input.version);
    const old = input.id ? (await tx.select().from(galleryEntries).where(and(eq(galleryEntries.id, input.id), eq(galleryEntries.restaurantId, input.restaurantId))))[0] : undefined;
    if (input.id && !old) throw new ContentError('Photo does not belong to this gallery');
    if (!old && !uploadId) throw new ContentError('Choose an image');
    if (uploadId) await attachUpload(tx, actorId, uploadId);
    const id = old?.id ?? randomUUID();
    const values = { alt: input.alt, visible: input.visible, imageId: uploadId ?? old?.imageId ?? null, staticImage: uploadId ? null : old?.staticImage ?? null };
    if (old) await tx.update(galleryEntries).set(values).where(eq(galleryEntries.id, id));
    else {
      const [last] = await tx.select({ order: sql<number>`coalesce(max(${galleryEntries.sortOrder}), -1)` }).from(galleryEntries).where(eq(galleryEntries.restaurantId, input.restaurantId));
      await tx.insert(galleryEntries).values({ id, restaurantId: input.restaurantId, sortOrder: Number(last.order) + 1, ...values });
    }
    if (old?.imageId && old.imageId !== values.imageId) await orphanUnused(tx, old.imageId);
    await finishGallery(tx, actorId, input.restaurantId, old ? 'update' : 'create', id);
  });
  return input.restaurantId;
}
export async function changeGallery(db: Database, actorId: string, raw: unknown) {
  const input = galleryOperationSchema.parse(raw);
  await db.transaction(async tx => {
    await lockGallery(tx, input.restaurantId, input.version);
    const siblings = await tx.select().from(galleryEntries).where(eq(galleryEntries.restaurantId, input.restaurantId)).orderBy(galleryEntries.sortOrder, galleryEntries.id);
    const index = siblings.findIndex(g => g.id === input.id);
    if (index < 0) throw new ContentError('Photo does not belong to this gallery');
    if (input.action === 'delete') {
      await tx.delete(galleryEntries).where(eq(galleryEntries.id, input.id));
      if (siblings[index].imageId) await orphanUnused(tx, siblings[index].imageId!);
    } else {
      const target = index + (input.action === 'up' ? -1 : 1);
      if (target < 0 || target >= siblings.length) return;
      [siblings[index], siblings[target]] = [siblings[target], siblings[index]];
      for (const [sortOrder, row] of siblings.entries()) await tx.update(galleryEntries).set({ sortOrder }).where(eq(galleryEntries.id, row.id));
    }
    await finishGallery(tx, actorId, input.restaurantId, input.action, input.id);
  });
  return input.restaurantId;
}
