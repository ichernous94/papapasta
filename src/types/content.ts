import type { DishImage } from './menu';
export type RestaurantId = 'papapasta' | 'centro';
export type ArticleBlock = { type: 'paragraph' | 'heading' | 'list'; text: string };
export type Promotion = {
  id: string; slug: string; title: string; date: string; body: ArticleBlock[];
  published: boolean; version: number; imageId: string | null; staticImage: string | null;
  imageAlt: string; image?: DishImage;
};
export type GalleryEntry = {
  id: string; imageId: string | null; staticImage: string | null; alt: string;
  visible: boolean; sortOrder: number; image?: DishImage;
};
export type RestaurantGallery = { restaurantId: RestaurantId; version: number; images: GalleryEntry[] };
export function promotionPath(promotion: Pick<Promotion, 'slug'>) {
  return promotion.slug === 'zestawy-obiadowe' ? '/zestawy-obiadowe' : `/promocje/${promotion.slug}`;
}
export function promotionDate(date: string) {
  return new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Warsaw' }).format(new Date(`${date}T12:00:00Z`));
}
