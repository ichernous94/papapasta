import type { MetadataRoute } from 'next';
import { publicMenus } from '@/server/content/public';
import { listDishes } from '@/server/content/dishes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dishes = listDishes(await publicMenus('papapasta'), 'papapasta');
  return [...['/', '/home', '/nasz-lokal', '/menu', '/kontakt'].map(path => ({ url: `https://papapasta.pl${path}` })),
    ...dishes.map(dish => ({ url: `https://papapasta.pl${dish.href}`, images: [dish.image.src] }))];
}
