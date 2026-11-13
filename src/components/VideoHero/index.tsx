'use client';

import Image, { type StaticImageData } from 'next/image';
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import styles from './VideoHero.module.scss';

type VideoHeroProps = {
  videoSrc: string; poster: StaticImageData; name: string;
  logo: { src: string; width: number; height: number };
  action?: { href: string; label: string };
};

export default function VideoHero({ videoSrc, poster, name, logo, action }: VideoHeroProps) {
  const titleId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackError, setPlaybackError] = useState('');
  const subscribe = useCallback((onChange: () => void) => {
    const video = videoRef.current;
    if (!video) return () => {};
    const events = ['play', 'playing', 'pause', 'ended', 'error', 'emptied'];
    events.forEach(event => video.addEventListener(event, onChange));
    return () => events.forEach(event => video.removeEventListener(event, onChange));
  }, []);
  const readPlaying = useCallback(() => !!videoRef.current && !videoRef.current.paused && !videoRef.current.ended, []);
  // Native autoplay can start before hydration; read the real media state for the button.
  const isPlaying = useSyncExternalStore(subscribe, readPlaying, () => false);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.defaultMuted = true;
    videoRef.current.preload = 'auto';
  }, []);

  const showError = () => setPlaybackError('Nie można odtworzyć wideo. Spróbuj ponownie.');
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) video.pause();
    else {
      setPlaybackError('');
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) video.load();
      // Only the manual button calls play(); native autoPlay owns the initial start.
      void video.play().catch(error => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) showError();
      });
    }
  };

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <video
        ref={videoRef}
        className={styles.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster.src}
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setPlaybackError('')}
        onError={showError}
      >
        <source src={videoSrc} type="video/mp4" onError={showError}/>
      </video>
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
