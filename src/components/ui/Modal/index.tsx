'use client';

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type KeyboardEventHandler, type ReactNode } from 'react';
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
  onExited?: () => void;
  style?: CSSProperties;
};

export default function Modal({ open, onClose, labelledBy, children, className, animationDuration = 280, closeLabel = 'Zamknij okno', onKeyDown, onExited, style }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();
  const present = useExitPresence(open, reducedMotion ? 0 : animationDuration);
  useBodyScrollLock(present);
  const wasPresent = useRef(false);
  useEffect(() => {
    if (present) wasPresent.current = true;
    else if (wasPresent.current) { wasPresent.current = false; onExited?.(); }
  }, [present, onExited]);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !present) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const x = window.scrollX;
    const y = window.scrollY;
    const openedURL = window.location.href;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-modal-heading]')?.focus({ preventScroll: true });
    window.scrollTo({ left: x, top: y, behavior: 'instant' });

    return () => {
      const left = window.scrollX, top = window.scrollY;
      dialog.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
      // Native dialog.close() may scroll its restored focus before preventScroll can run.
      if (window.location.href === openedURL) window.scrollTo({ left, top, behavior: 'instant' });
    };
  }, [present]);

  return (
    <dialog
      ref={dialogRef}
      className={[styles.dialog, className].filter(Boolean).join(' ')}
      aria-labelledby={labelledBy}
      data-state={open ? 'open' : 'closing'}
      style={{ '--modal-duration': `${animationDuration}ms`, ...style } as CSSProperties}
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
