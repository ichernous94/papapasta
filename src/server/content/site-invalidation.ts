import { updateTag, revalidatePath } from 'next/cache';
import type { RestaurantId } from '@/types/content';
export function invalidateGallery(restaurantId: RestaurantId) {
  updateTag(`gallery:${restaurantId}`);
  if (restaurantId === 'centro') revalidatePath('/(centro)/site-centro', 'layout');
  else revalidatePath('/(papapasta)', 'layout');
  revalidatePath('/site-admin/gallery');
}
export function invalidatePromotions() {
  updateTag('promotions:centro');
  revalidatePath('/site-centro/promocje');
  revalidatePath('/(centro)/site-centro/promocje/[slug]', 'page');
  revalidatePath('/site-centro/zestawy-obiadowe');
  revalidatePath('/site-centro/sitemap.xml');
  revalidatePath('/site-admin/promotion');
}
