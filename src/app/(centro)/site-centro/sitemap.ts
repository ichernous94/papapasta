import type { MetadataRoute } from 'next';
import { publicMenus } from '@/server/content/public';
import { listDishes } from '@/server/content/dishes';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ['', '/nasz-lokal', '/menu', '/cocktail-bar', '/promocje', '/zestawy-obiadowe', '/kontakt'];
  const dishes = listDishes(await publicMenus('centro'), 'centro');
  return [...paths.map(path => ({ url: 'https://centro.papapasta.pl' + (path || '/') })),
    ...dishes.map(dish => ({ url: 'https://centro.papapasta.pl' + dish.href }))];
}
