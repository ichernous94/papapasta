'use client';

import { useEffect, type ComponentProps } from 'react';
import { readMenuHash } from '@/utils/menuAnchor';

export function navigateMenuAnchor(anchor: string) {
  const next = new URL(window.location.href);
  next.hash = anchor;
  if (window.location.hash !== next.hash) window.history.pushState(window.history.state, '', next);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function MenuAnchorLink({ anchor, children, onClick, ...props }: ComponentProps<'a'> & { anchor: string }) {
  return <a {...props} href={`#${encodeURIComponent(anchor)}`} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault(); navigateMenuAnchor(anchor);
  }}>{children}</a>;
}

export default function MenuAnchors() {
  useEffect(() => {
    let cancel: (() => void) | undefined;
    let lastAnchor = '';
    const restore = (event?: Event) => {
      const anchor = readMenuHash(window.location.hash);
      // Closing a dish restores the menu's existing position, without replaying its unchanged hash.
      const nativeHistoryEvent = event?.type === 'popstate' || (event instanceof HashChangeEvent && !!event.newURL);
      if (nativeHistoryEvent && anchor === lastAnchor) return;
      lastAnchor = anchor;
      cancel?.();
      if ((!/^menu-(main|kids|drinks)(--.+)?$/.test(anchor) && anchor !== 'kartawin') || !window.location.pathname.endsWith('/menu')) return;
      let frame = 0;
      let stopped = false;
      let started = 0;
      let lastTarget = Number.NaN;
      let lastY = Number.NaN;
      let stillFrames = 0;
      let arrivedFrames = 0;
      const observer = new MutationObserver(schedule);
      function interrupt(event: Event) {
        if (!started || (event instanceof KeyboardEvent && !['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))) return;
        window.scrollTo({ top: window.scrollY, behavior: 'instant' }); cleanup();
      }
      function cleanup() {
        stopped = true; observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('load', schedule);
        window.removeEventListener('wheel', interrupt); window.removeEventListener('touchmove', interrupt); window.removeEventListener('keydown', interrupt);
        window.removeEventListener('pointerdown', interrupt);
      }
      function schedule() { if (!stopped && !frame) frame = requestAnimationFrame(attempt); }
      function attempt() {
        frame = 0;
        if (document.readyState !== 'complete') return;
        if (readMenuHash(window.location.hash) !== anchor || !window.location.pathname.endsWith('/menu')) { cleanup(); return; }
        if (started && performance.now() - started >= 1800) { cleanup(); return; }
        const target = document.getElementById(anchor);
        // Server content may still be streaming. A category is revealed by its own tab controller.
        if (!target || !document.querySelector('main')?.contains(target) || target.closest('[hidden]') || !target.getClientRects().length) return;
        // A QR link waits for the promotional poster/burger/modal to close before scrolling.
        if (document.documentElement.style.overflow === 'hidden' || document.querySelector('dialog[open], [data-popup-loading]')) {
          if (started) cleanup();
          return;
        }
        const origin = target.hasAttribute('data-menu-category') ? target.closest('[data-menu-tabs]') ?? target : target;
        const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--restaurant-header-height')) || 96;
        const top = Math.max(0, Math.min(origin.getBoundingClientRect().top + window.scrollY - header, document.documentElement.scrollHeight - innerHeight));
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { cleanup(); window.scrollTo({ top, behavior: 'instant' }); return; }
        const now = performance.now();
        stillFrames = Math.abs(scrollY - lastY) < 0.5 ? stillFrames + 1 : 0;
        const arrived = Math.abs(scrollY - top) <= 2;
        // Initial fragment restoration can run after hydration. Correct it while settling,
        // then release all observers/listeners; manual wheel/touch/keys always take over.
        if (!started || Math.abs(top - lastTarget) > 2 || (!arrived && stillFrames >= 3 && now - started > 150)) {
          started ||= now; lastTarget = top; stillFrames = 0;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        lastY = scrollY;
        arrivedFrames = arrived ? arrivedFrames + 1 : 0;
        if ((arrivedFrames >= 2 && now - started >= 400) || now - started >= 1800) { cleanup(); return; }
        schedule();
      }
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
      observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden','open','style'] });
      window.addEventListener('load', schedule);
      window.addEventListener('wheel', interrupt, { passive: true });
      window.addEventListener('touchmove', interrupt, { passive: true });
      window.addEventListener('keydown', interrupt);
      window.addEventListener('pointerdown', interrupt, { passive: true });
      cancel = cleanup;
      schedule();
    };
    restore();
    window.addEventListener('hashchange', restore);
    window.addEventListener('popstate', restore);
    return () => { cancel?.(); window.removeEventListener('hashchange', restore); window.removeEventListener('popstate', restore); };
  }, []);
  return null;
}
