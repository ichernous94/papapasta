import 'server-only';
import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { publicMenus } from './public';
import { findDish, type RestaurantId } from './dishes';

export const requireDish = cache(async (restaurantId: RestaurantId, slug: string) => {
  const dish = findDish(await publicMenus(restaurantId), restaurantId, slug);
  if (!dish) notFound();
  if (dish.slug !== slug) permanentRedirect(dish.href);
  return dish;
});
