'use client';

import { useCallback, useContext, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { RevealContext } from './Provider';
import { reserveReveal, startReveal, releasePendingReveal } from './registry';
import { useInView } from 'react-intersection-observer';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './Reveal.module.scss';

type RevealProps = {
  as?: 'div' | 'h1' | 'h2';
  children: ReactNode;
  className?: string;
  id?: string;
  direction?: 'down' | 'up';
  delay?: number;
  onceKey?: string;
};

export default function Reveal({ as: Tag = 'div', children, className, id, direction = 'down', delay = 0, onceKey }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true, fallbackInView: true, skip: reducedMotion });

  const registry = useContext(RevealContext);
  const elementRef = useRef<HTMLElement | null>(null);
  const owner = useRef<object>({});
  const setRef = useCallback((element: HTMLElement | null) => { elementRef.current = element; ref(element); }, [ref]);
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!onceKey || !element || !inView || reducedMotion) return;
    if (!registry || reserveReveal(registry, onceKey, owner.current)) element.dataset.visible = 'true';
    const token = owner.current;
    return () => {
      element.removeAttribute('data-visible');
      if (registry) releasePendingReveal(registry, onceKey, token);
    };
  }, [onceKey, registry, inView, reducedMotion]);

  return (
    <Tag
      ref={setRef}
      id={id}
      className={[styles.reveal, className].filter(Boolean).join(' ')}
      data-visible={!onceKey && inView && !reducedMotion ? 'true' : undefined}
      data-reveal-key={onceKey}
      onAnimationStart={event => {
        if (onceKey && registry && event.target === event.currentTarget) startReveal(registry, onceKey, owner.current);
      }}
      data-direction={direction}
      data-effect={Tag === 'div' ? 'scale' : 'slide'}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >{children}</Tag>
  );
}
