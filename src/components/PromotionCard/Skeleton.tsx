import type { CSSProperties } from 'react';
import { DishImageSkeleton } from '@/components/MenuSkeleton';
import styles from './PromotionCard.module.scss';

export default function PromotionCardSkeleton({ decorative = false, imageRatio = 1.91 }: { decorative?: boolean; imageRatio?: number }) {
  return <div className={styles.skeleton} style={{ '--promotion-image-ratio': imageRatio } as CSSProperties} aria-hidden={decorative || undefined} role={decorative ? undefined : 'status'} aria-busy={decorative ? undefined : true}>
    {!decorative && <span className={styles.visuallyHidden}>Ładowanie promocji…</span>}
    <div className={styles.skeletonImage}><DishImageSkeleton/></div>
    <div className={styles.skeletonBody}><span/><span/><span/></div>
    <div className={styles.skeletonDate}><span/></div>
  </div>;
}
