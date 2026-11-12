'use client';

import { useRef, type ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import useImageContentReady from '@/hooks/useImageContentReady';
import PromotionArticleSkeleton from './Skeleton';
import styles from './PromotionArticle.module.scss';

export default function PromotionArticleReveal({ imageSrc, imageRatio, children }: { imageSrc: string; imageRatio?: number; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Any visible part starts the wait, even for an article taller than ten screens.
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true, fallbackInView: true });
  useImageContentReady({ rootRef, imageSrc, inView, contentSelector: '[data-article-content]' });

  return <div ref={element => { rootRef.current = element; ref(element); }} className={styles.root} data-article-reveal data-state="loading">
    <article className={styles.content} data-article-content>{children}</article>
    <div className={styles.placeholder} aria-hidden="true"><PromotionArticleSkeleton decorative imageRatio={imageRatio}/></div>
    <noscript><style>{`.${styles.root} > .${styles.content}{opacity:1!important;pointer-events:auto!important}.${styles.root} > .${styles.placeholder}{display:none!important}`}</style></noscript>
  </div>;
}
