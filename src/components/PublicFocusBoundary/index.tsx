'use client';
import { useEffect, useState, type HTMLAttributes } from 'react';
import styles from './PublicFocusBoundary.module.scss';

type Props = HTMLAttributes<HTMLElement> & { as?: 'div' | 'section' };
export default function PublicFocusBoundary({ as: Tag = 'div', className, children, ...props }: Props) {
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    // Listen before focus enters the wrapper, including the first Tab from the browser chrome.
    const onKey = (event: KeyboardEvent) => {
      if (!event.altKey && !event.ctrlKey && !event.metaKey && ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) setKeyboard(true);
    };
    const onPointer = () => setKeyboard(false);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer, true);
    document.addEventListener('touchstart', onPointer, { capture: true, passive: true });
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer, true);
      document.removeEventListener('touchstart', onPointer, true);
    };
  }, []);
  return <Tag {...props} className={[styles.boundary, className].filter(Boolean).join(' ')} data-keyboard-focus={keyboard}>{children}</Tag>;
}
