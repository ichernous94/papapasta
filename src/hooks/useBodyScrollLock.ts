'use client';

import { useLayoutEffect } from 'react';

const locks = new Set<symbol>();
let restoreScroll: (() => void) | undefined;

export default function useBodyScrollLock(active: boolean) {
  useLayoutEffect(() => {
    if (!active) return;

    const token = Symbol('scroll-lock');
    if (locks.size === 0) {
      const body = document.body;
      const root = document.documentElement;
      const x = window.scrollX;
      const y = window.scrollY;
      const url = window.location.href;
      const properties = ['paddingRight', 'overscrollBehavior'] as const;
      const previous = properties.map((property) => [property, body.style[property]] as const);
      const rootOverflow = root.style.overflow;
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      // Lock only the viewport. Body overflow creates a second scroll container,
      // detaching the sticky Header from the viewport on long pages.
      body.style.overscrollBehavior = 'none';
      body.style.paddingRight = padding + scrollbarWidth + 'px';
      root.style.overflow = 'hidden';

      restoreScroll = () => {
        previous.forEach(([property, value]) => { body.style[property] = value; });
        root.style.overflow = rootOverflow;
        // Route/hash navigation owns the destination's scroll position.
        if (window.location.href === url) window.scrollTo({ left: x, top: y, behavior: 'instant' });
      };
    }

    locks.add(token);
    return () => {
      locks.delete(token);
      if (locks.size === 0) {
        restoreScroll?.();
        restoreScroll = undefined;
      }
    };
  }, [active]);
}
