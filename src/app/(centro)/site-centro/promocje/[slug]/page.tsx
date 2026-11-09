import { Suspense } from 'react';
import { permanentRedirect } from 'next/navigation';
import PromotionArticle from '@/components/PromotionArticle';
import { requirePromotion } from '@/server/content/promotion-page';
import { centroPageMetadata } from '@/config/metadata';
import { promotionPath } from '@/types/content';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const promotion = await requirePromotion((await params).slug);
  const description = promotion.body.map(b => b.text).join(' ').slice(0,160);
  const metadata = centroPageMetadata(promotionPath(promotion), `${promotion.title} - Papa Pasta Centro`, description);
  return { ...metadata, openGraph: { ...metadata.openGraph, images: promotion.image ? [promotion.image.src] : [] } };
}
async function Content({ params }: Props) {
  const promotion = await requirePromotion((await params).slug);
  if (promotion.slug === 'zestawy-obiadowe') permanentRedirect('/zestawy-obiadowe');
  return <PromotionArticle promotion={promotion}/>;
}
export default function Page(props: Props) { return <Suspense fallback={<p>Ładowanie promocji…</p>}><Content {...props}/></Suspense>; }
