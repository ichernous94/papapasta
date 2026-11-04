import { Suspense } from 'react';
import DishCard from '@/components/DishCard';
import DishOverlay from '@/components/DishOverlay';
import { requireDish } from '@/server/content/dish-page';
import { dishMetadata } from '@/server/content/dishes';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return dishMetadata(await requireDish('centro', (await params).slug));
}
async function Content({ params }: Props) {
  const dish = await requireDish('centro', (await params).slug);
  return <DishOverlay restaurantId="centro"><DishCard dish={dish} modal/></DishOverlay>;
}
export default function DishModal(props: Props) {
  return <Suspense fallback={null}><Content {...props}/></Suspense>;
}
