import { Suspense } from 'react';
import DishCard from '@/components/DishCard';
import { DishCardSkeleton } from '@/components/MenuSkeleton';
import DishOverlay from '@/components/DishOverlay';
import { requireDish } from '@/server/content/dish-page';
import { dishMetadata } from '@/server/content/dishes';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return dishMetadata(await requireDish('papapasta', (await params).slug));
}
async function Content({ params }: Props) {
  const dish = await requireDish('papapasta', (await params).slug);
  return <DishCard dish={dish} modal/>;
}
export default function DishModal(props: Props) {
  return <DishOverlay restaurantId="papapasta"><Suspense fallback={<DishCardSkeleton modal/>}><Content {...props}/></Suspense></DishOverlay>;
}
