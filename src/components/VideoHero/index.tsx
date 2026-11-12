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
  const manualStarted = useRef(false);
  const startPlayback = useRef<(manual?: boolean) => void>(() => {});
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
    let active = true, pending = false, blocked = false, request = 0;
    const rect = video.getBoundingClientRect();
    let visible = rect.bottom > 0 && rect.top < window.innerHeight;
    const attempt = (manual = false) => {
      if (!active) return;
      if (!manual && (!visible || document.hidden || userPaused.current || blocked || pending ||
        ((reducedMotion || connection?.saveData) && !manualStarted.current))) return;
      if (manual) { userPaused.current = false; manualStarted.current = true; blocked = false; setPlaybackError(''); }
      if (!video.paused && !video.error) return;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      const retry = !!video.error;
      if (video.getAttribute('src') !== videoSrc) video.src = videoSrc;
      if (retry) video.load();
      const id = ++request;
      pending = true;
      const failed = (error: unknown) => {
        if (!active || id !== request || (error instanceof DOMException && error.name === 'AbortError')) return;
        if (error instanceof DOMException && error.name === 'NotAllowedError') blocked = true;
        setIsPlaying(false);
        setPlaybackError(manual ? 'Nie można odtworzyć wideo. Spróbuj ponownie.' : 'Naciśnij odtwarzanie, aby uruchomić wideo.');
      };
      // Keep this call synchronous with the user's click for mobile Safari.
      try { void video.play().catch(failed).finally(() => { if (id === request) pending = false; }); }
      catch (error) { pending = false; failed(error); }
    };
    const applyPreference = () => {
      if ((reducedMotion || connection?.saveData) && !manualStarted.current) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } else attempt();
    };
    startPlayback.current = attempt;
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
      startPlayback.current = () => {};
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
      startPlayback.current(true);
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
      <span role="status" className={playbackError ? styles.error : styles.visuallyHidden}>{playbackError}</span>
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
