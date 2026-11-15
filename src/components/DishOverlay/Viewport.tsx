'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { canScrollMenu } from '@/hooks/useMenuGestureLock';
import styles from './DishOverlay.module.scss';

// Mounted by Modal for its entire presence, including the exit animation.
export default function DishViewport({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let lastY = 0;
    const allow = (target: EventTarget | null, delta: number) => {
      if (!(target instanceof Element)) return false;
      const dialog = target.closest('dialog[open]');
      if (dialog && dialog !== root.closest('dialog')) return true;
      const copy = target.closest<HTMLElement>('[data-dish-copy]');
      return !!copy && root.contains(copy) && canScrollMenu(copy, delta);
    };
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !allow(event.target, event.deltaY) && event.cancelable) event.preventDefault();
    };
    const start = (event: TouchEvent) => { if (event.touches.length === 1) lastY = event.touches[0].clientY; };
    const move = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const y = event.touches[0].clientY;
      const delta = lastY - y;
      lastY = y;
      if (!allow(event.target, delta) && event.cancelable) event.preventDefault();
    };
    document.addEventListener('wheel', wheel, { passive: false });
    document.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('touchmove', move, { passive: false });
    return () => {
      document.removeEventListener('wheel', wheel);
      document.removeEventListener('touchstart', start);
      document.removeEventListener('touchmove', move);
    };
  }, []);
  return <div ref={ref} className={styles.viewport}>{children}</div>;
}
