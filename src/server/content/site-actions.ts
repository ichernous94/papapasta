'use server';
import { unstable_rethrow } from 'next/navigation';
import { ZodError } from 'zod';
import { getDb } from '@/server/db';
import { requireAdministrator } from '@/server/auth/guards';
import { prepareUpload } from '@/server/media/upload';
import { orphanUnused } from '@/server/media/references';
import { ContentError } from './errors';
import { savePromotion, savePromotionPopup, deletePromotion, saveGalleryEntry, changeGallery } from './site-write';
import { popupInputSchema, promotionInputSchema, galleryInputSchema } from '@/validation/site-content';
import { invalidatePromotions, invalidatePromotionPopup, invalidateGallery } from './site-invalidation';
async function uploadedAction(raw: unknown, form: FormData, kind: 'promotion' | 'popup' | 'gallery') {
  const { user } = await requireAdministrator();
  let uploadId: string | undefined;
  try {
    const input = kind === 'promotion' ? promotionInputSchema.parse(raw) : kind === 'popup' ? popupInputSchema.parse(raw) : galleryInputSchema.parse(raw);
    const file = form.get('image');
    if (file instanceof File && file.size) uploadId = await prepareUpload(file, user.id);
    await requireAdministrator();
    if (kind === 'promotion') { await savePromotion(getDb(), user.id, input, uploadId); invalidatePromotions(); }
    else if (kind === 'popup') { await savePromotionPopup(getDb(), user.id, input, uploadId); invalidatePromotionPopup(); }
    else { const restaurantId = await saveGalleryEntry(getDb(), user.id, input, uploadId); invalidateGallery(restaurantId); }
    return { success: true };
  } catch (error) {
    if (uploadId) await getDb().transaction(tx => orphanUnused(tx, uploadId!));
    unstable_rethrow(error);
    return { error: error instanceof ContentError || error instanceof ZodError ? error.message : 'Could not save changes. Your form is preserved; try again.' };
  }
}
export async function savePromotionAction(raw: unknown, form: FormData) { return uploadedAction(raw, form, 'promotion'); }
export async function savePromotionPopupAction(raw: unknown, form: FormData) { return uploadedAction(raw, form, 'popup'); }
export async function saveGalleryAction(raw: unknown, form: FormData) { return uploadedAction(raw, form, 'gallery'); }
export async function deletePromotionAction(raw: unknown) {
  const { user } = await requireAdministrator();
  try { await deletePromotion(getDb(), user.id, raw); invalidatePromotions(); return { success: true }; }
  catch (error) { unstable_rethrow(error); return { error: error instanceof ContentError ? error.message : 'Could not delete promotion.' }; }
}
export async function changeGalleryAction(raw: unknown) {
  const { user } = await requireAdministrator();
  try { const restaurantId = await changeGallery(getDb(), user.id, raw); invalidateGallery(restaurantId); return { success: true }; }
  catch (error) { unstable_rethrow(error); return { error: error instanceof ContentError ? error.message : 'Could not change gallery.' }; }
}
