'use client';

import { useId, useState, type CSSProperties } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';
import Image from '@/components/ui/PhotoImage';
import Modal from '@/components/ui/Modal';
import type { PromotionPopup } from '@/types/content';
import styles from './PromotionalPopup.module.scss';

export default function PromotionalPopup({ popup }: { popup: PromotionPopup }) {
  // Persistent layout state keeps dismissal during navigation; a new document shows it again.
  const [open, setOpen] = useState(true);
  const titleId = useId();
  const reducedMotion = useReducedMotion();
  if (!popup.enabled || !popup.image) return null;
  const image = popup.image;
  return <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}
    animationDuration={open ? 600 : reducedMotion ? 0 : 450} closeLabel="Zamknij ofertę promocyjną" className={styles.dialog}
    style={{ '--poster-ratio': image.width / image.height } as CSSProperties}
    onKeyDown={event => {
      if (event.key === 'Tab') {
        event.preventDefault();
        event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
      }
    }}>
    <Image className={styles.poster} src={image.src} width={image.width} height={image.height} alt={popup.imageAlt}
      blurDataURL={image.blurDataURL} placeholder={image.blurDataURL ? 'blur' : 'empty'} loading="eager"
      sizes={`min(680px, calc(100vw - 36px), calc((100svh - 36px) * ${image.width / image.height}))`}/>
    <div className={styles.transcript}><h2 id={titleId}>{popup.title}</h2><p>{popup.description}</p></div>
  </Modal>;
}
