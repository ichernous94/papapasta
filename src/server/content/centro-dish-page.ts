import 'server-only';
import { cache } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { publicMenus } from './public';
import { findCentroDish } from './centro-dishes';

export const requireCentroDish = cache(async (slug: string) => {
  const dish = findCentroDish(await publicMenus('centro'), slug);
  if (!dish) notFound();
  if (dish.slug !== slug) permanentRedirect(dish.href);
  return dish;
});
