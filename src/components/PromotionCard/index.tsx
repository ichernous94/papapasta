'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import useImageContentReady from '@/hooks/useImageContentReady';
import { promotionDate, promotionPath, type Promotion } from '@/types/content';
import PromotionCardSkeleton from './Skeleton';
import styles from './PromotionCard.module.scss';

export default function PromotionCard({ promotion }: { promotion: Promotion }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true, fallbackInView: true });
  const image = promotion.image;
  useImageContentReady({ rootRef, imageSrc: image?.src ?? '', inView, contentSelector: '[data-promotion-content]' });

  return <div ref={element => { rootRef.current = element; ref(element); }} className={styles.root} data-promotion-reveal data-state="loading">
    <article className={styles.content} data-promotion-content>
      <Link href={promotionPath(promotion)} className={styles.card}>
        {image && <div className={styles.image}>
          <Image src={image.src} width={image.width} height={image.height} alt={image.alt} sizes="(min-width: 1170px) 554px, (min-width: 768px) 50vw, calc(100vw - 30px)"/>
        </div>}
        <div className={styles.body}><h2>{promotion.title}</h2><span>ZOBACZ SZCZEGÓŁY »</span></div>
        <time dateTime={promotion.date} className={styles.date}>{promotionDate(promotion.date)}</time>
      </Link>
    </article>
    <div className={styles.placeholder} aria-hidden="true"><PromotionCardSkeleton decorative imageRatio={image ? image.width / image.height : undefined}/></div>
    <noscript><style>{`.${styles.root} > .${styles.content}{opacity:1!important;pointer-events:auto!important}.${styles.root} > .${styles.placeholder}{display:none!important}`}</style></noscript>
  </div>;
}
