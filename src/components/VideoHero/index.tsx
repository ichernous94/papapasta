'use client';
import PhotoImage from '@/components/ui/PhotoImage';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './VideoHero.module.scss';

type DataConnection = {
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

type VideoHeroProps = {
  videoSrc: string; poster: StaticImageData; name: string;
  logo: { src: string; width: number; height: number };
  action?: { href: string; label: string };
};
export default function VideoHero({ videoSrc, poster, name, logo, action }: VideoHeroProps) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const reducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: DataConnection }).connection;
    const applyPreference = () => {
      if (reducedMotion || connection?.saveData) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        return;
      }
      if (!video.getAttribute('src')) video.src = videoSrc;
      if (!userPaused.current) void video.play().catch(() => {});
    };
    applyPreference();
    connection?.addEventListener?.('change', applyPreference);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
      else if (!userPaused.current && !reducedMotion && !connection?.saveData && video.getAttribute('src')) {
        void video.play().catch(() => {});
      }
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      connection?.removeEventListener?.('change', applyPreference);
      video.pause();
    };
  }, [reducedMotion, videoSrc]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      userPaused.current = true;
      video.pause();
    } else {
      userPaused.current = false;
      if (!video.getAttribute('src')) video.src = videoSrc;
      void video.play().catch(() => {});
    }
  };

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <PhotoImage
        className={styles.poster}
        src={poster}
        alt=""
        fill
        placeholder="blur"
        sizes="(min-width: 1920px) 1920px, 100vw"
        preload
      />
      <video
        ref={videoRef}
        className={[styles.video, hasFrame && styles.visible].filter(Boolean).join(' ')}
        muted
        loop
        playsInline
        autoPlay={!reducedMotion}
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => { setIsPlaying(true); setHasFrame(true); }}
        onPause={() => setIsPlaying(false)}
        onEmptied={() => { setIsPlaying(false); setHasFrame(false); }}
        onError={() => { setIsPlaying(false); setHasFrame(false); }}
      />
      <div className={styles.content}>
        <h1 id={titleId}>
          <span className={styles.visuallyHidden}>{name}</span>
          <Image src={logo.src} alt="" width={logo.width} height={logo.height} className={styles.logo} unoptimized />
        </h1>
        {action && <Button href={action.href}>{action.label}</Button>}
      </div>
      <button
        type="button"
        className={styles.playback}
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Wstrzymaj wideo' : 'Odtwórz wideo'}
      >
        {isPlaying ? <IoPauseOutline aria-hidden="true" /> : <IoPlayOutline aria-hidden="true" />}
      </button>
    </section>
  );
}
