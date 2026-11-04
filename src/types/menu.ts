import type { AllergenId } from '@/config/allergens';
export type DishImage = { src: string; width: number; height: number; blurDataURL: string; alt: string };
export type MenuItem = {
  image?: DishImage;
  allergens?: AllergenId[];
  id: string;
  name: string;
  portion?: string;
  price?: string;
  description?: string[];
  isNew?: boolean;
};
export type MenuGroup = { id: string; title?: string; note?: string; items: readonly MenuItem[]; afterNote?: string };
export type MenuCategory = { id: string; label: string; columns?: 2; columnBreak?: number; note?: string; groups: readonly MenuGroup[] };

