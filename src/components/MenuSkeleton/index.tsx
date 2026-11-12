import styles from './MenuSkeleton.module.scss';
import cardStyles from '@/components/DishCard/DishCard.module.scss';

type Props = { restaurantId: 'papapasta' | 'centro'; showTabs?: boolean; rows?: number };

export default function MenuSkeleton({ restaurantId, showTabs = true, rows = 4 }: Props) {
  return <div className={styles.skeleton} data-restaurant={restaurantId} aria-busy="true" role="status">
    <span className={styles.visuallyHidden}>Ładowanie menu…</span>
    <div aria-hidden="true">
      {showTabs && <div className={styles.tabs}>{Array.from({ length: 8 }, (_, index) => <span key={index}/>)}</div>}
      {showTabs && <div className={styles.category}><span/></div>}
      {Array.from({ length: rows }, (_, index) => <div className={styles.row} key={index}>
        <div className={styles.copy}>
          <div className={styles.heading}><span/><span/></div>
          <div className={styles.lines}><span/><span/><span/></div>
        </div>
        <SkeletonPhoto/>
      </div>)}
    </div>
  </div>;
}

function SkeletonPhoto({ as: Tag = 'div' }: { as?: 'div' | 'span' }) {
  return <Tag className={styles.photo}><svg viewBox="0 0 48 48" fill="none" focusable="false"><rect x="5" y="8" width="38" height="32" rx="3"/><circle cx="33" cy="17" r="3"/><path d="m7 34 12-13 10 11 5-6 8 8"/></svg></Tag>;
}

export function DishImageSkeleton() {
  return <span className={`${styles.skeleton} ${styles.imageOnly}`} aria-hidden="true"><SkeletonPhoto as="span"/></span>;
}

export function DishRowSkeleton() {
  return <div className={`${styles.skeleton} ${styles.singleRow}`} data-restaurant="centro" aria-hidden="true"><div className={styles.row}><div className={styles.copy}><div className={styles.heading}><span/><span/></div><div className={styles.lines}><span/><span/><span/></div></div><SkeletonPhoto/></div></div>;
}

export function DishCardSkeleton({ decorative = false, modal = false }: { decorative?: boolean; modal?: boolean }) {
  return <div className={`${styles.skeleton} ${cardStyles.card} ${styles.detail}`} data-restaurant="centro" aria-hidden={decorative || undefined} role={decorative ? undefined : 'status'} aria-busy={decorative ? undefined : true}>
    {!decorative && (modal ? <h2 id="dish-title" data-modal-heading tabIndex={-1} className={styles.visuallyHidden}>Ładowanie dania…</h2> : <span className={styles.visuallyHidden}>Ładowanie dania…</span>)}
    <div className={cardStyles.image}><SkeletonPhoto/></div>
    <div className={styles.detailCopy}><div className={styles.labelBar}/><div className={styles.heading}><span/><span/></div><div className={styles.lines}><span/><span/><span/></div></div>
  </div>;
}
