import { createHash } from 'node:crypto';
import type { Metadata } from 'next';
import type { EditorMenu } from '@/types/admin';
import type { DishImage, MenuItem } from '@/types/menu';
import { centroPageMetadata } from '@/config/metadata';

export type CentroDish = MenuItem & { image: DishImage; category: string; menuTitle: string; slug: string; href: string };
const origin = 'https://centro.papapasta.pl';

export function centroDishSlug(item: Pick<MenuItem, 'id' | 'name'>) {
  const name = item.name.toLowerCase().replace(/ł/g, 'l').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 100).replace(/-$/, '') || 'danie';
  const identity = createHash('sha256').update(item.id).digest('hex').slice(0, 12);
  return `${name}-${identity}`;
}

export function centroDishPath(item: Pick<MenuItem, 'id' | 'name'>) {
  return `/menu/${centroDishSlug(item)}`;
}

// Only published Centro records with a ready, publicly addressable photo get detail URLs.
export function listCentroDishes(menus: readonly EditorMenu[]): CentroDish[] {
  return menus.filter(menu => menu.restaurantId === 'centro').flatMap(menu => menu.categories.flatMap(category =>
    category.groups.flatMap(group => group.items.flatMap(item => item.visible && item.image ? [{
      ...item, image: item.image, category: category.label || group.title || menu.title,
      menuTitle: menu.title, slug: centroDishSlug(item), href: centroDishPath(item),
    }] : []))));
}

export function findCentroDish(menus: readonly EditorMenu[], slug: string) {
  const identity = slug.match(/-([a-f0-9]{12})$/)?.[1];
  if (!identity) return undefined;
  return listCentroDishes(menus).find(dish => dish.slug.endsWith(`-${identity}`));
}

export function centroDishMetadata(dish: CentroDish): Metadata {
  const title = `${dish.name} | ${dish.menuTitle} | Papa Pasta Centro`;
  const description = (dish.description?.join(' ').trim() || `${dish.name} — ${dish.category}, Papa Pasta Centro w Białymstoku.`).slice(0, 160);
  const metadata = centroPageMetadata(dish.href, title, description);
  const image = { url: dish.image.src, width: dish.image.width, height: dish.image.height, alt: dish.image.alt };
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [image] }, twitter: { ...metadata.twitter, card: 'summary_large_image', images: [dish.image.src] } };
}

export function centroDishStructuredData(dish: CentroDish) {
  const price = dish.price?.trim().replace(',', '.');
  return {
    '@context': 'https://schema.org', '@type': 'MenuItem', '@id': `${origin}${dish.href}#dish`,
    name: dish.name, description: dish.description?.join(' '), image: dish.image.src, url: origin + dish.href,
    ...(price && /^\d+(?:\.\d{1,2})?$/.test(price) ? { offers: { '@type': 'Offer', price, priceCurrency: 'PLN', url: origin + dish.href } } : {}),
  };
}
