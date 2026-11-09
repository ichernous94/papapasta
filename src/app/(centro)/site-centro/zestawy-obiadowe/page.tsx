import { Suspense } from 'react';
import PromotionArticle from '@/components/PromotionArticle';
import { requirePromotion } from '@/server/content/promotion-page';
import { centroPageMetadata } from '@/config/metadata';
export async function generateMetadata() {
  const promotion = await requirePromotion('zestawy-obiadowe');
  return centroPageMetadata('/zestawy-obiadowe', `${promotion.title} - Papa Pasta Centro`, promotion.body.map(b => b.text).join(' ').slice(0,160));
}
async function Content() { return <PromotionArticle promotion={await requirePromotion('zestawy-obiadowe')}/>; }
export default function LunchPage() { return <Suspense fallback={<p>Ładowanie promocji…</p>}><Content/></Suspense>; }
