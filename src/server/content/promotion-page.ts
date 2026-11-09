import 'server-only';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { publicPromotions } from './site-public';
export const requirePromotion = cache(async (slug: string) => {
  const promotion = (await publicPromotions()).find(p => p.slug === slug);
  if (!promotion || !promotion.image) notFound();
  return promotion;
});
