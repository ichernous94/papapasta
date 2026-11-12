'use client';

import { useLayoutEffect, useRef } from 'react';
import type { ImageProps } from 'next/image';
import { useInView } from 'react-intersection-observer';
import Image from '@/components/ui/PhotoImage';
import { DishImageSkeleton } from '@/components/MenuSkeleton';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './DishImage.module.scss';

// Shared by menu rows and detail cards for the current browser session.
const shown = new Set<string>();

export default function DishImage({ src, alt, className, onLoad, onError, ...props }: ImageProps) {
  const frameRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const loaded = useRef<() => void>(() => {});
  const failed = useRef<() => void>(() => {});
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true, fallbackInView: true });
  const key = typeof src === 'string' ? src : 'default' in src ? src.default.src : src.src;

  useLayoutEffect(() => {
    const frame = frameRef.current, image = imageRef.current;
    if (!frame || !image) return;
    let active = true, ready = false, elapsed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Read the real preference: the SSR snapshot is intentionally conservative.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = (value: string) => {
      frame.dataset.state = value;
      frame.setAttribute('aria-busy', String(value === 'loading'));
    };
    const finish = () => {
      if (active && ready && elapsed) { state('ready'); shown.add(key); }
    };
    const error = () => { if (active) { clearTimeout(timer); state('error'); } };
    const decode = () => {
      void (image.decode?.() ?? Promise.resolve()).then(() => {
        if (active) { ready = true; finish(); }
      }).catch(error);
    };
    loaded.current = decode;
    failed.current = error;
    if (shown.has(key)) state('ready');
    else {
      state('loading');
      if (reduce) elapsed = true;
      else if (inView) timer = setTimeout(() => { elapsed = true; finish(); }, 250);
      if (image.complete) {
        if (image.naturalWidth) decode();
        else error();
      }
    }
    return () => {
      active = false; clearTimeout(timer);
      loaded.current = () => {}; failed.current = () => {};
    };
  }, [key, inView, reducedMotion]);

  return <span ref={element => { frameRef.current = element; ref(element); }} className={styles.frame} data-dish-image data-state="ready">
    <Image {...props} src={src} alt={alt} ref={imageRef} className={[styles.image, className].filter(Boolean).join(' ')}
      onLoad={event => { loaded.current(); onLoad?.(event); }}
      onError={event => { failed.current(); onError?.(event); }}/>
    <span className={styles.placeholder} aria-hidden="true"><DishImageSkeleton/></span>
  </span>;
}
