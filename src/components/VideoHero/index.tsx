'use client';
import PhotoImage from '@/components/ui/PhotoImage';

import Image, { type StaticImageData } from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './VideoHero.module.scss';
import { waitForVideoFrame } from './videoFrame';

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
  const [playbackError, setPlaybackError] = useState('');
  const retryPlayback = useRef<() => void>(() => {});
  const [hasFrame, setHasFrame] = useState(false);
  const cancelFrame = useRef<() => void>(() => {});
  const resetFrame = () => { cancelFrame.current(); setHasFrame(false); };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: DataConnection }).connection;
    let active = true;
    let visible = video.getBoundingClientRect().bottom > 0;
    const attempt = () => {
      if (!active || !visible || document.hidden || userPaused.current || reducedMotion || connection?.saveData) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (!video.getAttribute('src')) video.src = videoSrc;
      void video.play().catch((error: unknown) => {
        if (active && error instanceof DOMException && error.name !== 'AbortError') setPlaybackError('Naciśnij odtwarzanie, aby uruchomić wideo.');
      });
    };
    const applyPreference = () => {
      if (reducedMotion || connection?.saveData) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } else attempt();
    };
    retryPlayback.current = attempt;
    applyPreference();
    connection?.addEventListener?.('change', applyPreference);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) video.pause();
      else attempt();
    });
    const visibility = () => { if (document.hidden) video.pause(); else attempt(); };
    document.addEventListener('visibilitychange', visibility);
    observer.observe(video);
    return () => {
      active = false;
      cancelFrame.current();
      retryPlayback.current = () => {};
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
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
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      if (!video.getAttribute('src')) video.src = videoSrc;
      void video.play().catch(() => setPlaybackError('Nie można odtworzyć wideo. Spróbuj ponownie.'));
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
        onPlaying={() => {
          setIsPlaying(true); setPlaybackError('');
          if (!hasFrame && videoRef.current) {
            cancelFrame.current();
            cancelFrame.current = waitForVideoFrame(videoRef.current, () => setHasFrame(true));
          }
        }}
        onCanPlay={() => retryPlayback.current()}
        onPause={() => setIsPlaying(false)}
        onEmptied={() => { setIsPlaying(false); resetFrame(); }}
        onError={() => { setIsPlaying(false); resetFrame(); setPlaybackError('Nie można odtworzyć wideo. Spróbuj ponownie.'); }}
      />
      <div className={styles.content}>
        <h1 id={titleId}>
          <span className={styles.visuallyHidden}>{name}</span>
          <Image src={logo.src} alt="" width={logo.width} height={logo.height} className={styles.logo} unoptimized />
        </h1>
        {action && <Button href={action.href}>{action.label}</Button>}
      </div>
      <span role="status" className={styles.visuallyHidden}>{playbackError}</span>
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
