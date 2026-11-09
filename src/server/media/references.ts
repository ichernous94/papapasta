import { and, eq, sql } from 'drizzle-orm';
import type { createDatabase } from '@/server/db/connection';
import { mediaAssets, items, menus, promotions, galleryEntries } from '@/server/db/schema';
import { ContentError } from '@/server/content/errors';
type Database = ReturnType<typeof createDatabase>['db'];
type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];
export function unreferencedMedia(id: string) {
  return sql`not exists (select 1 from ${items} where ${items.imageId} = ${id})
    and not exists (select 1 from ${menus} where ${menus.bannerImageId} = ${id})
    and not exists (select 1 from ${promotions} where ${promotions.imageId} = ${id})
    and not exists (select 1 from ${galleryEntries} where ${galleryEntries.imageId} = ${id})`;
}
export async function orphanUnused(tx: Transaction, id: string) {
  await tx.select({ id: mediaAssets.id }).from(mediaAssets).where(eq(mediaAssets.id, id)).for('update');
  await tx.update(mediaAssets).set({ status: 'orphan' }).where(and(eq(mediaAssets.id, id), unreferencedMedia(id)));
}
export async function attachUpload(tx: Transaction, actorId: string, id: string) {
  const [asset] = await tx.select().from(mediaAssets).where(eq(mediaAssets.id, id)).for('update');
  if (!asset || asset.status !== 'pending' || asset.createdBy !== actorId) throw new ContentError('Image upload is unavailable');
  await tx.update(mediaAssets).set({ status: 'ready' }).where(eq(mediaAssets.id, id));
}
