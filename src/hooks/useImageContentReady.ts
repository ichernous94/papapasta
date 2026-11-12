'use client';

import { useLayoutEffect, type RefObject } from 'react';
import useReducedMotion from '@/hooks/useReducedMotion';

const shown = new Set<string>();

// Content stays in normal flow while its placeholder waits for image decoding.
export default function useImageContentReady({ rootRef, imageSrc, inView, contentSelector, focusModalHeading = false }: {
  rootRef: RefObject<HTMLDivElement | null>;
  imageSrc: string;
  inView: boolean;
  contentSelector: string;
  focusModalHeading?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const content = root.querySelector<HTMLElement>(contentSelector);
    const images = Array.from(root.querySelectorAll<HTMLImageElement>(`${contentSelector} img`));
    let active = true, elapsed = false, failed = false, interacted = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ready = new Set<HTMLImageElement>();
    const dialog = focusModalHeading ? root.closest('dialog') : null;
    const interaction = () => { interacted = true; };
    const setState = (state: string) => { root.dataset.state = state; root.setAttribute('aria-busy', String(state === 'loading')); if (content) content.inert = state === 'loading'; };
    const finish = () => {
      if (!active || ready.size < images.length || (!elapsed && !failed)) return;
      setState(failed ? 'error' : 'ready');
      if (!failed) shown.add(imageSrc);
      if (!interacted && dialog?.open && (document.activeElement === dialog || document.activeElement === dialog.querySelector('button'))) {
        root.querySelector<HTMLElement>('[data-modal-heading]')?.focus({ preventScroll: true });
      }
    };
    const complete = (image: HTMLImageElement, error = false) => {
      if (!active) return;
      failed ||= error;
      ready.add(image); finish();
    };
    const decode = (image: HTMLImageElement) => {
      void (image.decode?.() ?? Promise.resolve()).then(() => complete(image)).catch(() => complete(image, true));
    };
    const load = (event: Event) => decode(event.currentTarget as HTMLImageElement);
    const error = (event: Event) => complete(event.currentTarget as HTMLImageElement, true);
    if (shown.has(imageSrc) && images.every(image => image.complete && image.naturalWidth > 0)) setState('ready');
    else {
      setState('loading');
      if (shown.has(imageSrc) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) elapsed = true;
      else if (inView) timer = setTimeout(() => { elapsed = true; finish(); }, 250);
      dialog?.addEventListener('keydown', interaction); dialog?.addEventListener('pointerdown', interaction);
      images.forEach(image => {
        image.addEventListener('load', load); image.addEventListener('error', error);
        if (image.complete) { if (image.naturalWidth) decode(image); else complete(image, true); }
      });
      finish();
    }
    return () => {
      active = false; clearTimeout(timer); if (content) content.inert = false;
      images.forEach(image => { image.removeEventListener('load', load); image.removeEventListener('error', error); });
      dialog?.removeEventListener('keydown', interaction); dialog?.removeEventListener('pointerdown', interaction);
    };
  }, [rootRef, imageSrc, inView, reducedMotion, contentSelector, focusModalHeading]);
}
