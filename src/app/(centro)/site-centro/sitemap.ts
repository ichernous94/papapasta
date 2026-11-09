import type { MetadataRoute } from 'next';
import { publicPromotions } from '@/server/content/site-public';
import { promotionPath } from '@/types/content';
import { publicMenus } from '@/server/content/public';
import { listDishes } from '@/server/content/dishes';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = ['', '/nasz-lokal', '/menu', '/cocktail-bar', '/promocje', '/kontakt'];
  const dishes = listDishes(await publicMenus('centro'), 'centro');
  const promotions = await publicPromotions();
  return [...promotions.filter(p => p.image).map(p => ({ url: 'https://centro.papapasta.pl' + promotionPath(p) })), ...paths.map(path => ({ url: 'https://centro.papapasta.pl' + (path || '/') })),
    ...dishes.map(dish => ({ url: 'https://centro.papapasta.pl' + dish.href }))];
}
