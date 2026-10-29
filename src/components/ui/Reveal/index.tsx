'use client';

import type { CSSProperties, ReactNode } from 'react';
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
};

export default function Reveal({ as: Tag = 'div', children, className, id, direction = 'down', delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true, fallbackInView: true, skip: reducedMotion });

  return (
    <Tag
      ref={ref}
      id={id}
      className={[styles.reveal, className].filter(Boolean).join(' ')}
      data-visible={inView && !reducedMotion ? 'true' : undefined}
      data-direction={direction}
      data-effect={Tag === 'div' ? 'scale' : 'slide'}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >{children}</Tag>
  );
}
