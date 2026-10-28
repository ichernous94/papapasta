'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import styles from './Modal.module.scss';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
};

export default function Modal({ open, onClose, labelledBy, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useBodyScrollLock(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('[data-modal-heading]')?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={[styles.dialog, className].filter(Boolean).join(' ')}
      aria-labelledby={labelledBy}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}
    >
      <button type="button" className={styles.close} aria-label="Zamknij okno" onClick={onClose}>
        <IoCloseOutline aria-hidden="true" />
      </button>
      {children}
    </dialog>
  );
}
