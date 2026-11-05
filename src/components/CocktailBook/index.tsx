'use client';

import Image from '@/components/ui/PhotoImage';
import photoStyles from '@/components/ui/PhotoImage/PhotoImage.module.scss';
import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import type { PageFlip } from 'page-flip';
import { useInView } from 'react-intersection-observer';
import { IoChevronBackOutline, IoChevronForwardOutline, IoGridOutline, IoExpandOutline, IoRemoveOutline, IoAddOutline } from 'react-icons/io5';
import Container from '@/components/ui/Container';
import Modal from '@/components/ui/Modal';
import useReducedMotion from '@/hooks/useReducedMotion';
import { centroBookPages as pages } from '@/config/centro-book';
import cover from '../../../public/images/centro/mojito-promo.png';
import styles from './CocktailBook.module.scss';

// The library owns only the DOM appended inside mountRef, never React-owned nodes.
function BookViewer({ initialPage, onPageChange, expanded = false }: {
  initialPage: number; onPageChange: (page: number) => void; expanded?: boolean;
}) {
  const titleId = useId();
  const thumbsId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<PageFlip | null>(null);
  const currentRef = useRef(initialPage);
  const onPageChangeRef = useRef(onPageChange);
  const [page, setPage] = useState(initialPage);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [landscape, setLandscape] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [thumbnails, setThumbnails] = useState(false);
  const reducedMotion = useReducedMotion();
  const { ref: visibilityRef, inView } = useInView({ rootMargin: '300px', triggerOnce: true, fallbackInView: true });
  const panRef = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  useEffect(() => { onPageChangeRef.current = onPageChange; }, [onPageChange]);

  useEffect(() => {
    if (!inView) return;
    const mount = mountRef.current;
    const frame = frameRef.current;
    if (!mount || !frame) return;
    let cancelled = false;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    let lastSize = '';
    let observer: ResizeObserver | undefined;
    let disposeBook: (() => void) | undefined;
    const media = window.matchMedia('(min-width: 1024px)');

    void import('page-flip').then((module) => {
      const PageFlip = module.default?.PageFlip ?? module.PageFlip;
      if (cancelled) return;
      const build = () => {
        if (cancelled) return;
        const { width, height } = frame.getBoundingClientRect();
        if (!width || !height) return;
        const wide = media.matches;
        const pageHeight = Math.floor(Math.min(height, width / (wide ? 2 : 1) * 1.414));
        const pageWidth = Math.floor(pageHeight / 1.414);
        const key = `${pageWidth}:${pageHeight}:${wide}`;
        if (key === lastSize) return;
        lastSize = key;
        disposeBook?.();
        const element = document.createElement('div');
        element.style.width = `${pageWidth * (wide ? 2 : 1)}px`;
        element.style.height = `${pageHeight}px`;
        element.setAttribute('aria-hidden', 'true');
        mount.append(element);
        const imageElements: HTMLImageElement[] = [];
        const nodes = pages.map((item, index) => {
          const node = document.createElement('div');
          node.className = styles.page;
          const image = document.createElement('img');
          image.alt = item.title;
          image.className = `${photoStyles.photo} ${photoStyles.animation}`;
          image.onload = image.onerror = () => image.classList.remove(photoStyles.animation);
          image.width = 1020; image.height = 1430;
          image.decoding = 'async';
          image.draggable = false;
          image.dataset.src = item.src;
          if (Math.abs(index - currentRef.current) <= 2) {
            image.src = item.src;
            if (image.complete && image.naturalWidth > 0) image.classList.remove(photoStyles.animation);
          }
          imageElements.push(image);
          node.append(image);
          return node;
        });
        const centerCover = (index: number) => {
          const offset = wide && (index === 0 || index === pages.length - 1)
            ? (index === 0 ? -pageWidth / 2 : pageWidth / 2) : 0;
          element.style.transform = `translateX(${offset}px)`;
        };
        centerCover(currentRef.current);
        const loadNearby = (index: number) => imageElements.forEach((image, i) => {
          if (Math.abs(i - index) <= 2 && !image.getAttribute('src')) image.src = image.dataset.src!;
        });
        const book = new PageFlip(element, {
          width: pageWidth, height: pageHeight, size: 'fixed', startPage: currentRef.current,
          usePortrait: true, autoSize: false, showCover: true, mobileScrollSupport: true,
          useMouseEvents: true, flippingTime: 850, maxShadowOpacity: 0.35,
          showPageCorners: !reducedMotion, disableFlipByClick: reducedMotion,
        });
        book.on('flip', event => {
          if (cancelled) return;
          const index = event.data;
          currentRef.current = index;
          setPage(index); setZoom(1);
          loadNearby(index); centerCover(index);
          onPageChangeRef.current(index);
        });
        book.loadFromHTML(nodes);
        bookRef.current = book;
        const spread = book.getOrientation() === 'landscape';
        setLandscape(spread);
        setError(false); setZoom(1);
        const start = book.getCurrentPageIndex();
        const visibleImages = imageElements.slice(start, start + (spread && start > 0 && start < pages.length - 1 ? 2 : 1));
        void Promise.all(visibleImages.map(image => image.decode())).then(() => {
          if (!cancelled && bookRef.current === book) setReady(true);
        }).catch(() => {
          if (!cancelled && bookRef.current === book) { setReady(false); setError(true); }
        });
        disposeBook = () => {
          // destroy removes its own root; mountRef remains owned by React.
          book.destroy();
          if (bookRef.current === book) bookRef.current = null;
        };
      };
      const scheduleBuild = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(build, 100); };
      observer = new ResizeObserver(scheduleBuild);
      observer.observe(frame);
      media.addEventListener('change', scheduleBuild);
      build();
      removeMediaListener = () => media.removeEventListener('change', scheduleBuild);
    }).catch(() => { if (!cancelled) { setError(true); setReady(false); } });
    let removeMediaListener = () => {};
    return () => {
      cancelled = true;
      clearTimeout(resizeTimer);
      observer?.disconnect(); removeMediaListener(); disposeBook?.();
    };
  }, [inView, reducedMotion]);

  const lastIndex = pages.length - 1;
  const spreadEnd = landscape && page > 0 && page < lastIndex ? Math.min(page + 1, lastIndex) : page;
  const turn = (direction: -1 | 1) => {
    const book = bookRef.current;
    if (!book || (direction === -1 ? page === 0 : spreadEnd === lastIndex)) return;
    setZoom(1);
    if (reducedMotion) {
      const next = direction === 1 ? spreadEnd + 1 : page - (landscape && page > 1 ? 2 : 1);
      book.turnToPage(Math.max(0, Math.min(lastIndex, next)));
    } else if (direction === 1) book.flipNext();
    else book.flipPrev();
  };
  const setBookPage = (index: number) => { setZoom(1); bookRef.current?.turnToPage(index); };
  const toggleFullscreen = async () => {
    if (document.fullscreenElement === rootRef.current) { await document.exitFullscreen(); return; }
    try {
      if (!rootRef.current?.requestFullscreen) throw new Error('Fullscreen unavailable');
      await rootRef.current.requestFullscreen();
    } catch { setFallbackFullscreen(true); }
  };
  const onPanStart = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) { if (reducedMotion) swipeRef.current = { x: event.clientX, y: event.clientY }; return; }
    const viewport = viewportRef.current;
    if (!viewport) return;
    panRef.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  return <div ref={rootRef} className={[styles.viewer, expanded && styles.expanded].filter(Boolean).join(' ')}>
    <div ref={visibilityRef}>
      <div role="region" aria-labelledby={titleId} tabIndex={0} onKeyDown={event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); turn(event.key === 'ArrowLeft' ? -1 : 1); }
        if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); setBookPage(event.key === 'Home' ? 0 : lastIndex); }
      }}>
        <h2 id={titleId} className={styles.visuallyHidden}>Karta koktajli i alkoholi Papa Pasta Centro</h2>
        <div ref={frameRef} className={styles.frame}>
          <div ref={viewportRef} className={styles.viewport} data-zoomed={zoom > 1} onPointerDown={onPanStart} onPointerMove={event => {
            const pan = panRef.current; const viewport = viewportRef.current;
            if (pan && viewport) { viewport.scrollLeft = pan.left - event.clientX + pan.x; viewport.scrollTop = pan.top - event.clientY + pan.y; }
          }} onPointerUp={event => {
            const swipe = swipeRef.current;
            if (swipe && Math.abs(event.clientX - swipe.x) > 45 && Math.abs(event.clientY - swipe.y) < 35) turn(event.clientX < swipe.x ? 1 : -1);
            panRef.current = null; swipeRef.current = null;
          }} onPointerCancel={() => { panRef.current = null; swipeRef.current = null; }}>
            <div className={styles.zoomArea} style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
              <div ref={mountRef} className={styles.mount} data-disabled={zoom > 1 || reducedMotion} style={{ width: `${100 / zoom}%`, height: `${100 / zoom}%`, transform: `scale(${zoom})` }} />
            </div>
          </div>
          {!ready && <Image src={cover} alt="Okładka karty koktajli Papa Pasta Centro" fill placeholder="blur" sizes="(min-width: 1024px) 550px, 100vw" className={styles.cover} />}
        </div>
        {error && <p role="status">Nie udało się uruchomić książki. Otwórz strony z listy poniżej.</p>}
        <div className={styles.toolbar} role="group" aria-label="Sterowanie kartą">
          <button type="button" disabled={!ready || page === 0} onClick={() => turn(-1)} aria-label="Poprzednia strona"><IoChevronBackOutline /></button>
          <p className={styles.counter} aria-live="polite" aria-atomic="true">{page + 1}{spreadEnd !== page ? `–${spreadEnd + 1}` : ''} / {pages.length}</p>
          <button type="button" disabled={!ready || spreadEnd === lastIndex} onClick={() => turn(1)} aria-label="Następna strona"><IoChevronForwardOutline /></button>
          <button type="button" disabled={!ready} aria-label="Miniatury stron" aria-expanded={thumbnails} aria-controls={thumbsId} onClick={() => setThumbnails(!thumbnails)}><IoGridOutline /></button>
          <button type="button" disabled={!ready || zoom <= 1} aria-label="Pomniejsz" onClick={() => setZoom(Math.max(1, zoom - 0.25))}><IoRemoveOutline /></button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button type="button" disabled={!ready || zoom >= 2} aria-label="Powiększ" onClick={() => setZoom(Math.min(2, zoom + 0.25))}><IoAddOutline /></button>
          {!expanded && <button type="button" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? "Wyjdź z pełnego ekranu" : "Pełny ekran"} aria-pressed={fullscreen}><IoExpandOutline /></button>}
        </div>
        <div id={thumbsId} className={styles.thumbnails} hidden={!thumbnails}>
          {thumbnails && pages.map((item, index) => <button key={item.id} type="button" aria-label={`${index + 1}. ${item.title}`} aria-pressed={index === page} onClick={() => setBookPage(index)}>
            <Image src={item.src} alt="" width={100} height={142} sizes="100px" /><span>{index + 1}</span>
          </button>)}
        </div>
        <details className={styles.links}><summary>Otwórz strony karty jako obrazy</summary><ol>{pages.map((item, index) => <li key={item.id}><a href={item.src}>{index + 1}. {item.title}</a></li>)}</ol></details>
      </div>
    </div>
    {!expanded && <Modal open={fallbackFullscreen} onClose={() => setFallbackFullscreen(false)} labelledBy={titleId + '-fullscreen'} className={styles.fullscreenModal} animationDuration={400}>
      <h2 id={titleId + '-fullscreen'} className={styles.visuallyHidden}>Karta alkoholi — pełny ekran</h2>
      <BookViewer initialPage={page} onPageChange={index => { setBookPage(index); }} expanded />
    </Modal>}
  </div>;
}

export default function CocktailBook() {
  const [page, setPage] = useState(0);
  return <Container as="section" id="karta-koktajli" className={styles.section} aria-label="Karta koktajli i alkoholi"><BookViewer initialPage={page} onPageChange={setPage} /></Container>;
}
