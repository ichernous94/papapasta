'use client';

import { useLayoutEffect, useRef, type CSSProperties, type KeyboardEventHandler, type ReactNode } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useExitPresence from '@/hooks/useExitPresence';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './Modal.module.scss';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  animationDuration?: number;
  closeLabel?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
};

export default function Modal({ open, onClose, labelledBy, children, className, animationDuration = 280, closeLabel = 'Zamknij okno', onKeyDown }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();
  const present = useExitPresence(open, reducedMotion ? 0 : animationDuration);
  useBodyScrollLock(present);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !present) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const x = window.scrollX;
    const y = window.scrollY;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-modal-heading]')?.focus({ preventScroll: true });
    window.scrollTo({ left: x, top: y, behavior: 'instant' });

    return () => {
      dialog.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [present]);

  return (
    <dialog
      ref={dialogRef}
      className={[styles.dialog, className].filter(Boolean).join(' ')}
      aria-labelledby={labelledBy}
      data-state={open ? 'open' : 'closing'}
      style={{ '--modal-duration': `${animationDuration}ms` } as CSSProperties}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      <button type="button" className={styles.close} aria-label={closeLabel} onClick={onClose}>
        <IoCloseOutline aria-hidden="true" />
      </button>
      {present && children}
    </dialog>
  );
}
