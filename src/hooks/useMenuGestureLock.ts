'use client';
import { useEffect } from 'react';

export function canScrollMenu(menu: Pick<HTMLElement, 'scrollHeight' | 'clientHeight' | 'scrollTop'>, delta: number) {
  const limit = menu.scrollHeight - menu.clientHeight;
  return limit > 1 && (delta > 0 ? menu.scrollTop < limit - 1 : delta < 0 && menu.scrollTop > 1);
}

// Protect the background without creating a second body scroll container (notably on iOS).
export default function useMenuGestureLock(active: boolean, menuId: string) {
  useEffect(() => {
    if (!active) return;
    let lastY = 0;
    const allow = (target: EventTarget | null, delta: number) => {
      if (!(target instanceof Element)) return false;
      // A native modal owns its own gesture policy if it opens above the burger.
      if (target.closest('dialog[open]')) return true;
      const menu = document.getElementById(menuId);
      return !!menu && menu.contains(target) && canScrollMenu(menu, delta);
    };
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !allow(event.target, event.deltaY) && event.cancelable) event.preventDefault();
    };
    const start = (event: TouchEvent) => { if (event.touches.length === 1) lastY = event.touches[0].clientY; };
    const move = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const y = event.touches[0].clientY, delta = lastY - y;
      lastY = y;
      if (!allow(event.target, delta) && event.cancelable) event.preventDefault();
    };
    document.addEventListener('wheel', wheel, { passive: false });
    document.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('touchmove', move, { passive: false });
    return () => {
      document.removeEventListener('wheel', wheel); document.removeEventListener('touchstart', start); document.removeEventListener('touchmove', move);
    };
  }, [active, menuId]);
}
