'use client';
import { useRef, type ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';
import useImageContentReady from '@/hooks/useImageContentReady';
import { DishCardSkeleton, DishRowSkeleton } from '@/components/MenuSkeleton';
import styles from './DishReveal.module.scss';

export default function DishReveal({ imageSrc, layout, children }: { imageSrc: string; layout: 'row' | 'card'; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true, fallbackInView: true });
  useImageContentReady({ rootRef, imageSrc, inView, contentSelector: '[data-dish-content]', focusModalHeading: true });
  return <div ref={element => { rootRef.current = element; ref(element); }} className={styles.root} data-dish-reveal={layout} data-state="loading">
    <div className={styles.body} data-dish-content>{children}</div>
    <div className={styles.placeholder} aria-hidden="true">{layout === 'card' ? <DishCardSkeleton decorative/> : <DishRowSkeleton/>}</div>
    <noscript><style>{`.${styles.root} > .${styles.body}{opacity:1!important;pointer-events:auto!important}.${styles.root} > .${styles.placeholder}{display:none!important}`}</style></noscript>
  </div>;
}
