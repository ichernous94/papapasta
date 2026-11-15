'use client';

import { useLayoutEffect, type RefObject } from 'react';

// Native view timelines keep transparent tabs and their clipping in the same scroll frame.
export default function usePanelClip(rootRef: RefObject<HTMLDivElement | null>, stickyRef: RefObject<HTMLDivElement | null>, enabled: boolean, activeKey?: string) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    const sticky = stickyRef.current;
    if (!enabled || !root || !sticky || typeof CSS === 'undefined' || typeof ResizeObserver === 'undefined' || !CSS.supports('clip-path', 'inset(0px)')) return;
    const panel = root.querySelector<HTMLElement>(':scope > [role="tabpanel"]:not([hidden])');
    if (!panel) return;
    const native = CSS.supports('animation-timeline', 'view()') && CSS.supports('animation-range', 'exit-crossing 0% exit-crossing calc(100% - 1px)');
    let frame = 0;
    let tabPending = false;
    let tabTimer: ReturnType<typeof setTimeout> | undefined;
    function update() {
      frame = 0;
      if (!root || !sticky || !panel) return;
      const bar = sticky.getBoundingClientRect();
      if (bar.height <= 0) return;
      const headerHeight = parseFloat(getComputedStyle(root).getPropertyValue('--restaurant-header-height')) || 96;
      const gap = parseFloat(getComputedStyle(sticky).marginBlockEnd) || 0;
      panel.style.setProperty('--menu-clip-boundary', `${headerHeight + bar.height}px`);
      panel.style.setProperty('--menu-category-offset', `${bar.height + gap}px`);
      const bounds = panel.getBoundingClientRect();
      if (native) {
        // The bar moves out with its section. Preserve the gap below it at that boundary,
        // including a temporary taller root during a long-to-short category transition.
        const tail = Math.max(0, Math.min(bounds.height - 1, bounds.bottom - root.getBoundingClientRect().bottom + gap));
        panel.style.setProperty('--menu-clip-end', `calc(100% - ${tail}px)`);
      } else {
        panel.style.setProperty('--menu-panel-clip-top', `${Math.max(0, Math.min(bounds.height, bar.bottom - bounds.top))}px`);
      }
      root.dataset.clipReady = 'true';
      root.dataset.clipMode = native ? 'native' : 'fallback';
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    // Do not add another animation-frame delay to fallback scroll events.
    function scroll() { if (frame) cancelAnimationFrame(frame); update(); }
    function keydown(event: KeyboardEvent) {
      tabPending = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey;
      clearTimeout(tabTimer);
      tabTimer = setTimeout(() => { tabPending = false; }, 0);
    }
    function pointer() { tabPending = false; }
    function focus(event: FocusEvent) {
      const fromTab = tabPending;
      tabPending = false;
      if (!fromTab || document.querySelector('dialog[open]') || !(event.target instanceof HTMLElement) || !panel?.contains(event.target) || !sticky || !root) return;
      const target = event.target.getBoundingClientRect();
      const headerHeight = parseFloat(getComputedStyle(root).getPropertyValue('--restaurant-header-height')) || 96;
      const visibleTop = Math.max(headerHeight, sticky.getBoundingClientRect().bottom) + 8;
      if (target.height > 0 && target.top < visibleTop) window.scrollBy({ top: target.top - visibleTop, behavior: 'instant' });
    }
    update();
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    resize.observe(panel);
    resize.observe(sticky);
    const header = new MutationObserver(schedule);
    header.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    if (!native) {
      window.addEventListener('scroll', scroll, { passive: true });
      window.visualViewport?.addEventListener('scroll', scroll, { passive: true });
    }
    window.addEventListener('resize', schedule, { passive: true });
    window.visualViewport?.addEventListener('resize', schedule, { passive: true });
    document.addEventListener('keydown', keydown, true);
    document.addEventListener('pointerdown', pointer, true);
    root.addEventListener('focusin', focus);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(tabTimer);
      resize.disconnect();
      header.disconnect();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('scroll', scroll);
      document.removeEventListener('keydown', keydown, true);
      document.removeEventListener('pointerdown', pointer, true);
      root.removeEventListener('focusin', focus);
      root.removeAttribute('data-clip-ready');
      root.removeAttribute('data-clip-mode');
      panel.style.removeProperty('--menu-panel-clip-top');
      panel.style.removeProperty('--menu-clip-boundary');
      panel.style.removeProperty('--menu-clip-end');
      panel.style.removeProperty('--menu-category-offset');
    };
  }, [rootRef, stickyRef, enabled, activeKey]);
}
