import type { MetadataRoute } from 'next';
import { publicMenus } from '@/server/content/public';
import { listCentroDishes } from '@/server/content/centro-dishes';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ['', '/nasz-lokal', '/menu', '/cocktail-bar', '/promocje', '/zestawy-obiadowe', '/kontakt'];
  const dishes = listCentroDishes(await publicMenus('centro'));
  return [...paths.map(path => ({ url: 'https://centro.papapasta.pl' + (path || '/') })),
    ...dishes.map(dish => ({ url: 'https://centro.papapasta.pl' + dish.href }))];
}
