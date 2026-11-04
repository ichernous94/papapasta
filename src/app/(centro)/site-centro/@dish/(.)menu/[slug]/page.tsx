import { Suspense } from 'react';
import CentroDishCard from '@/components/CentroDishCard';
import CentroDishOverlay from '@/components/CentroDishOverlay';
import { requireCentroDish } from '@/server/content/centro-dish-page';
import { centroDishMetadata } from '@/server/content/centro-dishes';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return centroDishMetadata(await requireCentroDish((await params).slug));
}
async function Content({ params }: Props) {
  const dish = await requireCentroDish((await params).slug);
  return <CentroDishOverlay><CentroDishCard dish={dish} modal/></CentroDishOverlay>;
}
export default function DishModal(props: Props) {
  return <Suspense fallback={null}><Content {...props}/></Suspense>;
}
