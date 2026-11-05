'use client';
import { useEffect, useLayoutEffect } from 'react';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

// The CSS lock covers initial HTML; gesture listeners exist only while this route is mounted.
export default function SelectionScrollLock() {
  useBodyScrollLock(true);
  useLayoutEffect(() => {
    const selection = document.querySelector<HTMLElement>('[data-restaurant-selection]');
    if (!selection) return;
    selection.dataset.selectionActive = 'true';
    // Next can retain the old route in a hidden Activity. Do not lock its new neighbour.
    return () => { selection.dataset.selectionActive = 'false'; };
  }, []);
  useEffect(() => {
    const wheel = (event: WheelEvent) => { if (!event.ctrlKey && event.cancelable) event.preventDefault(); };
    const touch = (event: TouchEvent) => { if (event.touches.length === 1 && event.cancelable) event.preventDefault(); };
    document.addEventListener('wheel', wheel, { passive: false });
    document.addEventListener('touchmove', touch, { passive: false });
    return () => {
      document.removeEventListener('wheel', wheel);
      document.removeEventListener('touchmove', touch);
    };
  }, []);
  return null;
}
