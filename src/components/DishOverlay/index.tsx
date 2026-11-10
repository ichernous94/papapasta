'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import styles from './DishOverlay.module.scss';
export default function DishOverlay({ children, restaurantId }: { children: ReactNode; restaurantId: 'papapasta' | 'centro' }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const origin = useRef({ left: 0, top: 0 });
  useLayoutEffect(() => {
    origin.current = { left: window.scrollX, top: window.scrollY };
    // Next Activity can retain a dismissed route; reactivate its dialog on the next visit.
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const goBack = useCallback(() => {
    const position = origin.current;
    const dishPath = window.location.pathname;
    const menuPath = dishPath.slice(0, dishPath.lastIndexOf('/menu/')) + '/menu';
    const began = performance.now();
    let arrived = 0, frame = 0;
    function stop() {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', stop); window.removeEventListener('touchmove', stop); window.removeEventListener('pointerdown', stop);
    }
    function restore(now: number) {
      if (window.location.pathname === menuPath) {
        arrived ||= now;
        // Next restores focus to the URL fragment after Back. Keep the originating row
        // in place through that commit, then release control to normal page scrolling.
        if (Math.abs(window.scrollY - position.top) > 1) window.scrollTo({ ...position, behavior: 'instant' });
        if (now - arrived >= 300) { stop(); return; }
      } else if (window.location.pathname !== dishPath) { stop(); return; }
      if (now - began > 1500) { stop(); return; }
      frame = requestAnimationFrame(restore);
    }
    window.addEventListener('wheel', stop, { passive: true }); window.addEventListener('touchmove', stop, { passive: true }); window.addEventListener('pointerdown', stop, { passive: true });
    router.back(); frame = requestAnimationFrame(restore);
  }, [router]);
  return <Modal open={open} onClose={() => setOpen(false)} onExited={goBack} labelledBy="dish-title" closeLabel="Zamknij kartę dania" className={`${styles.dialog} ${restaurantId === 'papapasta' ? styles.light : ''}`}>{children}</Modal>;
}
