'use client';

import { useLayoutEffect, type RefObject } from 'react';

// Clip only the active panel. The transparent sticky bar then reveals the actual page canvas.
export default function usePanelClip(rootRef: RefObject<HTMLDivElement | null>, stickyRef: RefObject<HTMLDivElement | null>, enabled: boolean, activeKey?: string) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    if (!enabled || !root || !sticky || typeof CSS === 'undefined' || typeof ResizeObserver === 'undefined' || !CSS.supports('clip-path', 'inset(0px)')) return;
    const panel = root.querySelector<HTMLElement>(':scope > [role="tabpanel"]:not([hidden])');
    if (!panel) return;
    let frame = 0;
    let focusTarget: HTMLElement | null = null;
    function update() {
      frame = 0;
      if (!root || !sticky || !panel) return;
      const bar = sticky.getBoundingClientRect();
      let bounds = panel.getBoundingClientRect();
      if (bar.height <= 0 || bounds.height <= 0) return;
      if (focusTarget && focusTarget === document.activeElement && panel.contains(focusTarget)) {
        const target = focusTarget.getBoundingClientRect();
        const headerHeight = parseFloat(getComputedStyle(root).getPropertyValue('--restaurant-header-height')) || 96;
        const visibleTop = Math.max(headerHeight, bar.bottom) + 8;
        if (target.height > 0 && target.top < visibleTop) {
          window.scrollBy({ top: target.top - visibleTop, behavior: 'instant' });
          bounds = panel.getBoundingClientRect();
        }
      }
      focusTarget = null;
      // Scrolling may move a bar away from its sticky limit at the end of the section.
      const clipTop = Math.max(0, Math.min(bounds.height, sticky.getBoundingClientRect().bottom - bounds.top));
      panel.style.setProperty('--menu-panel-clip-top', `${clipTop}px`);
      root.dataset.clipReady = 'true';
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function focus(event: FocusEvent) {
      if (event.target instanceof HTMLElement && panel?.contains(event.target)) {
        focusTarget = event.target;
        schedule();
      }
    }
    update();
    const resize = new ResizeObserver(schedule);
    resize.observe(root); // Includes the temporary height guard used during category return.
    resize.observe(panel);
    resize.observe(sticky);
    // Header publishes its measured height on html, including changes without a viewport resize.
    const header = new MutationObserver(schedule);
    header.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.visualViewport?.addEventListener('resize', schedule, { passive: true });
    window.visualViewport?.addEventListener('scroll', schedule, { passive: true });
    root.addEventListener('focusin', focus);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resize.disconnect();
      header.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', schedule);
      root.removeEventListener('focusin', focus);
      root.removeAttribute('data-clip-ready');
      panel.style.removeProperty('--menu-panel-clip-top');
    };
  }, [rootRef, stickyRef, enabled, activeKey]);
}
