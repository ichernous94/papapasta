'use client';

import Image, { type ImageProps } from 'next/image';
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import styles from './PhotoImage.module.scss';

const PhotoImage = forwardRef<HTMLImageElement, ImageProps>(function PhotoImage({ src, alt, className, onLoad, onError, ...props }, forwardedRef) {
  const imageRef = useRef<HTMLImageElement>(null);
  useImperativeHandle(forwardedRef, () => imageRef.current!);
  useLayoutEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    // Keep server/no-JS HTML sharp. Cached loads and failures may precede hydration.
    if (image.complete && image.naturalWidth > 0) { image.classList.remove(styles.animation); return; }
    image.classList.toggle(styles.animation, !image.complete);
  }, [src, className]);

  return <Image {...props} src={src} alt={alt} ref={imageRef} className={[styles.photo, className].filter(Boolean).join(' ')}
    onLoad={event => {
      event.currentTarget.classList.remove(styles.animation);
      onLoad?.(event);
    }}
    onError={event => {
      event.currentTarget.classList.remove(styles.animation);
      onError?.(event);
    }}/>;
});
export default PhotoImage;
