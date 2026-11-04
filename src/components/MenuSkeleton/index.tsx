import styles from './MenuSkeleton.module.scss';

type Props = { restaurantId: 'papapasta' | 'centro'; showTabs?: boolean; rows?: number };

export default function MenuSkeleton({ restaurantId, showTabs = true, rows = 4 }: Props) {
  return <div className={styles.skeleton} data-restaurant={restaurantId} aria-busy="true" role="status">
    <span className={styles.visuallyHidden}>Ładowanie menu…</span>
    <div aria-hidden="true">
      {showTabs && <div className={styles.tabs}>{Array.from({ length: 8 }, (_, index) => <span key={index}/>)}</div>}
      {Array.from({ length: rows }, (_, index) => <div className={styles.row} key={index}>
        <div className={styles.copy}>
          <div className={styles.heading}><span/><span/></div>
          <div className={styles.lines}><span/><span/><span/></div>
        </div>
        <div className={styles.photo}><svg viewBox="0 0 48 48" fill="none" focusable="false"><rect x="5" y="8" width="38" height="32" rx="3"/><circle cx="33" cy="17" r="3"/><path d="m7 34 12-13 10 11 5-6 8 8"/></svg></div>
      </div>)}
    </div>
  </div>;
}
