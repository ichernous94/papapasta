import { Suspense } from 'react';
import Link from 'next/link';
import DishCard from '@/components/DishCard';
import { DishCardSkeleton } from '@/components/MenuSkeleton';
import Container from '@/components/ui/Container';
import JsonLd from '@/components/JsonLd';
import { requireDish } from '@/server/content/dish-page';
import { dishMetadata, dishStructuredData } from '@/server/content/dishes';
import styles from './DishPage.module.scss';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return dishMetadata(await requireDish('papapasta', (await params).slug));
}
async function Content({ params }: Props) {
  const dish = await requireDish('papapasta', (await params).slug);
  return <><DishCard dish={dish}/><JsonLd data={dishStructuredData(dish)}/></>;
}
export default function DishPage(props: Props) {
  return <Container as="section" className={styles.page}>
    <Link href="/menu" className={styles.back}>← Wróć do menu</Link>
    <div className={styles.surface}><Suspense fallback={<DishCardSkeleton/>}><Content {...props}/></Suspense></div>
  </Container>;
}
