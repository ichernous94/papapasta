import { createHash } from 'node:crypto';
import type { Metadata } from 'next';
import type { EditorMenu } from '@/types/admin';
import type { DishImage, MenuItem } from '@/types/menu';
import { centroPageMetadata, papaPastaPageMetadata } from '@/config/metadata';

export type RestaurantId = 'papapasta' | 'centro';
export type Dish = MenuItem & { restaurantId: RestaurantId; image: DishImage; category: string; menuTitle: string; slug: string; href: string };
const origins = { papapasta: 'https://papapasta.pl', centro: 'https://centro.papapasta.pl' };

export function dishSlug(item: Pick<MenuItem, 'id' | 'name'>) {
  const name = item.name.toLowerCase().replace(/ł/g, 'l').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100).replace(/-$/, '') || 'danie';
  const identity = createHash('sha256').update(item.id).digest('hex').slice(0, 12);
  return `${name}-${identity}`;
}

export function dishPath(item: Pick<MenuItem, 'id' | 'name'>) {
  return `/menu/${dishSlug(item)}`;
}

// Only published records with a ready, publicly addressable photo get detail URLs.
export function listDishes(menus: readonly EditorMenu[], restaurantId: RestaurantId): Dish[] {
  return menus.filter(menu => menu.restaurantId === restaurantId).flatMap(menu => menu.categories.flatMap(category =>
    category.groups.flatMap(group => group.items.flatMap(item => item.visible && item.image ? [{
      ...item, restaurantId, image: item.image, category: category.label || group.title || menu.title,
      menuTitle: menu.title, slug: dishSlug(item), href: dishPath(item),
    }] : []))));
}

export function findDish(menus: readonly EditorMenu[], restaurantId: RestaurantId, slug: string) {
  const identity = slug.match(/-([a-f0-9]{12})$/)?.[1];
  if (!identity) return undefined;
  return listDishes(menus, restaurantId).find(dish => dish.slug.endsWith(`-${identity}`));
}

export function dishMetadata(dish: Dish): Metadata {
  const brand = dish.restaurantId === 'centro' ? 'Papa Pasta Centro' : 'PapaPasta Pizza Wino Steki';
  const title = `${dish.name} | ${dish.menuTitle} | ${brand}`;
  const description = (dish.description?.join(' ').trim() || `${dish.name} — ${dish.category}, ${brand} w Białymstoku.`).slice(0, 160);
  const metadata = (dish.restaurantId === 'centro' ? centroPageMetadata : papaPastaPageMetadata)(dish.href, title, description);
  const image = { url: dish.image.src, width: dish.image.width, height: dish.image.height, alt: dish.image.alt };
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [image] }, twitter: { ...metadata.twitter, card: 'summary_large_image', images: [dish.image.src] } };
}

export function dishStructuredData(dish: Dish) {
  const origin = origins[dish.restaurantId];
  const price = dish.price?.trim().replace(',', '.');
  return {
    '@context': 'https://schema.org', '@type': 'MenuItem', '@id': `${origin}${dish.href}#dish`,
    name: dish.name, description: dish.description?.join(' '), image: dish.image.src, url: origin + dish.href,
    ...(price && /^\d+(?:\.\d{1,2})?$/.test(price) ? { offers: { '@type': 'Offer', price, priceCurrency: 'PLN', url: origin + dish.href } } : {}),
  };
}
