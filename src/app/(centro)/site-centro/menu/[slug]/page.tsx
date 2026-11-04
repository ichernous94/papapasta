import { Suspense } from 'react';
import Link from 'next/link';
import CentroDishCard from '@/components/CentroDishCard';
import Container from '@/components/ui/Container';
import JsonLd from '@/components/JsonLd';
import { requireCentroDish } from '@/server/content/centro-dish-page';
import { centroDishMetadata, centroDishStructuredData } from '@/server/content/centro-dishes';
import styles from './DishPage.module.scss';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return centroDishMetadata(await requireCentroDish((await params).slug));
}
async function Content({ params }: Props) {
  const dish = await requireCentroDish((await params).slug);
  return <Container as="section" className={styles.page}>
    <Link href="/menu" className={styles.back}>← Wróć do menu</Link>
    <div className={styles.surface}><CentroDishCard dish={dish}/></div>
    <JsonLd data={centroDishStructuredData(dish)}/>
  </Container>;
}
export default function DishPage(props: Props) {
  return <Suspense fallback={<p className={styles.loading}>Ładowanie dania…</p>}><Content {...props}/></Suspense>;
}
