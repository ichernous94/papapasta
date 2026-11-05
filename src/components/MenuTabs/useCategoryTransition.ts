'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';

type Transition = { cancel: (keepHeight?: boolean) => void; originalMin: string };

export default function useCategoryTransition(rootRef: RefObject<HTMLDivElement | null>, stickyRef: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const current = useRef<Transition | null>(null);
  useLayoutEffect(() => () => { current.current?.cancel(); }, []);

  return (index: number) => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    const panel = root?.querySelectorAll<HTMLElement>(':scope > [role="tabpanel"]')[index];
    if (!enabled || !root || !sticky || !panel) return;
    // Preserve the occupied height across rapid selections before releasing the old operation.
    const height = root.getBoundingClientRect().height;
    const originalMin = current.current?.originalMin ?? root.style.minBlockSize;
    current.current?.cancel(true);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const origin = window.location.href;
    const headerHeight = () => parseFloat(getComputedStyle(root).getPropertyValue('--restaurant-header-height')) || 96;
    const needsScroll = root.getBoundingClientRect().top < headerHeight() - 2;
    const destination = () => Math.max(0, Math.min(
      root.getBoundingClientRect().top + window.scrollY - headerHeight(),
      document.documentElement.scrollHeight - document.documentElement.clientHeight
    ));
    root.style.minBlockSize = needsScroll && !motion.matches ? `${height}px` : originalMin;
    if (!needsScroll) return;
    root.dataset.categoryTransition = 'scrolling';
    let frame = 0;
    let scrolling = false;
    let stopped = false;
    let lastTarget = Number.NaN;
    let arrived = 0;
    const start = performance.now();

    function cleanup(keepHeight = false) {
      if (stopped) return;
      stopped = true;
      if (frame) cancelAnimationFrame(frame);
      root!.removeAttribute('data-category-transition');
      if (!keepHeight) root!.style.minBlockSize = originalMin;
      window.removeEventListener('wheel', interrupt, true);
      window.removeEventListener('touchmove', interrupt, true);
      window.removeEventListener('pointerdown', pointer, true);
      window.removeEventListener('keydown', keyboard, true);
      motion.removeEventListener('change', preference);
      if (current.current?.cancel === cancel) current.current = null;
    }
    function cancel(keepHeight = false) {
      if (scrolling && window.location.href === origin) window.scrollTo({ top: window.scrollY, behavior: 'instant' });
      cleanup(keepHeight);
    }
    function finishReturn() {
      scrolling = false;
      cleanup();
    }
    function tick(now: number) {
      frame = 0;
      if (stopped) return;
      if (!root!.isConnected || !panel!.isConnected) { cancel(); return; }
      // A discrete tab selection normally commits before the first frame; tolerate deferred hydration.
      if (panel!.hidden) {
        if (now - start >= 1500) { cancel(); return; }
        frame = requestAnimationFrame(tick); return;
      }
      if (motion.matches) {
        if (needsScroll) window.scrollTo({ top: destination(), behavior: 'instant' });
        finishReturn(); return;
      }
      const target = destination();
      if (!scrolling || Math.abs(target - lastTarget) > 2) {
        window.scrollTo({ top: target, behavior: 'smooth' });
        lastTarget = target; scrolling = true; arrived = 0;
      }
      arrived = Math.abs(window.scrollY - target) <= 2 ? arrived + 1 : 0;
      if (arrived >= 2 || now - start >= 1500) {
        // Stop an incomplete browser animation before releasing its temporary layout guard.
        if (arrived < 2) window.scrollTo({ top: window.scrollY, behavior: 'instant' });
        finishReturn(); return;
      }
      frame = requestAnimationFrame(tick);
    }
    function interrupt() { cancel(); }
    function ownTab(target: EventTarget | null) { return target instanceof Element && root!.contains(target) && !!target.closest('[role="tab"]'); }
    function pointer(event: PointerEvent) { if (!ownTab(event.target)) cancel(); }
    function keyboard(event: KeyboardEvent) {
      if (ownTab(event.target) && ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' '].includes(event.key)) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Tab', 'Escape'].includes(event.key)) cancel();
    }
    function preference() {
      if (!motion.matches) return;
      if (needsScroll) window.scrollTo({ top: destination(), behavior: 'instant' });
      cleanup();
    }
    current.current = { cancel, originalMin };
    window.addEventListener('wheel', interrupt, { passive: true, capture: true });
    window.addEventListener('touchmove', interrupt, { passive: true, capture: true });
    window.addEventListener('pointerdown', pointer, { passive: true, capture: true });
    window.addEventListener('keydown', keyboard, true);
    motion.addEventListener('change', preference);
    frame = requestAnimationFrame(tick);
  };
}
