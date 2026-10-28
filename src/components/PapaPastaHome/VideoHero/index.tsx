'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IoPauseOutline, IoPlayOutline } from 'react-icons/io5';
import Button from '@/components/ui/Button';
import useReducedMotion from '@/hooks/useReducedMotion';
import { grilledSteak } from '../images';
import styles from './VideoHero.module.scss';

type DataConnection = {
  saveData?: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

export default function VideoHero() {
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
      if (!video.getAttribute('src')) video.src = '/videos/papapasta.mp4';
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
  }, [reducedMotion]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!video.paused) {
      userPaused.current = true;
      video.pause();
    } else {
      userPaused.current = false;
      if (!video.getAttribute('src')) video.src = '/videos/papapasta.mp4';
      void video.play().catch(() => {});
    }
  };

  return (
    <section className={styles.hero} aria-labelledby="papapasta-title">
      <Image
        className={styles.poster}
        src={grilledSteak}
        alt=""
        fill
        placeholder="blur"
        sizes="100vw"
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
        <h1 id="papapasta-title">
          <span className={styles.visuallyHidden}>Papa Pasta Pizza Wino Steki</span>
          <Image src="/icons/logo_papapasta.svg" alt="" width={319} height={72} className={styles.logo} unoptimized />
        </h1>
        <Button href="/menu">ZOBACZ MENU</Button>
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
