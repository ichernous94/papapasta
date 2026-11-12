import type { ReactNode } from 'react';
import Link from 'next/link';
import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import landscape from '../../../public/images/centro/sezonowe.jpg';
import styles from '@/components/CentroPages/CentroPages.module.scss';

export default function PromotionArticleFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <>
    <ImageBanner restaurantId="centro" image={landscape} title={title} subtitle={subtitle} headingLevel="h1" preload/>
    <Container as="section" size="text" className={`${styles.section} ${styles.article}`} aria-label="Szczegóły promocji">
      <Link href="/promocje" className={styles.link}>← Wróć do promocji</Link>
      {children}
    </Container>
  </>;
}
