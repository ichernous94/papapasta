'use client';

import { useEffect } from 'react';

const locks = new Set<symbol>();
let restoreScroll: (() => void) | undefined;

export default function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const token = Symbol('scroll-lock');
    if (locks.size === 0) {
      const body = document.body;
      const root = document.documentElement;
      const x = window.scrollX;
      const y = window.scrollY;
      const properties = ['overflow', 'paddingRight', 'overscrollBehavior'] as const;
      const previous = properties.map((property) => [property, body.style[property]] as const);
      const rootOverflow = root.style.overflow;
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;

      body.style.overflow = 'hidden';
      body.style.overscrollBehavior = 'none';
      body.style.paddingRight = padding + scrollbarWidth + 'px';
      root.style.overflow = 'hidden';

      restoreScroll = () => {
        previous.forEach(([property, value]) => { body.style[property] = value; });
        root.style.overflow = rootOverflow;
        const scrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        window.scrollTo(x, y);
        root.style.scrollBehavior = scrollBehavior;
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
