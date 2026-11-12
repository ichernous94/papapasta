import type { CSSProperties } from 'react';
import { DishImageSkeleton } from '@/components/MenuSkeleton';
import styles from './PromotionArticle.module.scss';

export default function PromotionArticleSkeleton({ decorative = false, imageRatio = 1200 / 628 }: { decorative?: boolean; imageRatio?: number }) {
  return <div className={styles.skeleton} style={{ '--article-image-ratio': imageRatio } as CSSProperties} aria-hidden={decorative || undefined} role={decorative ? undefined : 'status'} aria-busy={decorative ? undefined : true}>
    {!decorative && <span className={styles.visuallyHidden}>Ładowanie promocji…</span>}
    <div className={styles.skeletonImage}><DishImageSkeleton/></div>
    <div className={styles.skeletonCopy}>
      <div className={styles.skeletonTitle}><span/><span/></div>
      <div className={styles.skeletonDate}/>
      {Array.from({ length: 3 }, (_, index) => <div key={index} className={styles.skeletonParagraph}><span/><span/><span/></div>)}
      <div className={styles.skeletonButton}/>
    </div>
  </div>;
}
