'use client';

import type { StaticImageData } from 'next/image';
import Image from '@/components/ui/PhotoImage';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import Modal from '@/components/ui/Modal';
import useReducedMotion from '@/hooks/useReducedMotion';
import 'swiper/css';
import styles from './Gallery.module.scss';
import { GALLERY_SPEED, syncGallerySpeed } from './motion';

export type GalleryImage = { id: string; image: StaticImageData | import('@/types/menu').DishImage; alt: string };
type GalleryProps = { images: readonly GalleryImage[]; variant?: 'strip' | 'grid'; name?: string };

export default function Gallery({ images, variant = 'strip', name = 'Papa Pasta' }: GalleryProps) {
  const titleId = useId();
  const stripRef = useRef<SwiperInstance | null>(null);
  const [edges, setEdges] = useState({ first: true, last: images.length <= 2 });
  const stripId = useId();
  const syncEdges = (swiper: SwiperInstance) => setEdges(old => old.first === swiper.isBeginning && old.last === swiper.isEnd ? old : { first: swiper.isBeginning, last: swiper.isEnd });
  const sizes = variant === 'grid'
    ? '(min-width: 1170px) 375px, (min-width: 1024px) calc((100vw - 46px) / 3), (min-width: 768px) calc((100vw - 38px) / 2), calc(100vw - 30px)'
    : '(min-width: 1920px) 480px, (min-width: 1024px) 25vw, 50vw';
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const reducedMotion = useReducedMotion();
  const speed = reducedMotion ? 0 : GALLERY_SPEED;
  useLayoutEffect(() => {
    syncGallerySpeed(stripRef.current, speed);
    syncGallerySpeed(swiperRef.current, speed);
  }, [speed]);

  return (
    <section className={[styles.gallery, variant === 'grid' && styles.contained].filter(Boolean).join(' ')} aria-label={"Galeria restauracji " + name}>
      {variant === 'grid' ? <Container className={styles.grid}>
        {images.map((item, index) => <Reveal key={item.id} direction="up" delay={(index % 4) * 60}>
          <button type="button" className={styles.thumbnail} onClick={() => { setActiveIndex(index); setCurrentIndex(index); setOpen(true); }} aria-label={'Powiększ: ' + item.alt} aria-haspopup="dialog">
            <Image src={item.image} alt={item.alt} fill placeholder="blur" sizes={sizes}/>
          </button>
        </Reveal>)}
      </Container> : <>
        <Swiper id={stripId} key={images.map(i => i.id).join(',')} className={styles.strip} modules={[A11y]} slidesPerView={2} breakpoints={{ 1024: { slidesPerView: 4 } }} watchOverflow speed={speed}
          a11y={{ containerMessage: 'Galeria restauracji ' + name, slideLabelMessage: 'Zdjęcie {{index}} z {{slidesLength}}' }}
          onSwiper={swiper => { stripRef.current = swiper; syncGallerySpeed(swiper, speed); syncEdges(swiper); }}
          onSlideChange={syncEdges}
          onUpdate={syncEdges}
          onLock={syncEdges}
          onUnlock={syncEdges}
          onResize={swiper => requestAnimationFrame(() => { if (!swiper.destroyed) syncEdges(swiper); })}>
          {images.map((item, index) => <SwiperSlide key={item.id}>
            <button type="button" className={styles.thumbnail} onClick={() => { setActiveIndex(index); setCurrentIndex(index); setOpen(true); }} aria-label={'Powiększ: ' + item.alt} aria-haspopup="dialog">
              <Image src={item.image} alt={item.alt} fill placeholder="blur" sizes={sizes}/>
            </button>
          </SwiperSlide>)}
        </Swiper>
        {images.length > 2 && <div className={styles.stripControls}>
          <button type="button" className={styles.control} aria-controls={stripId} aria-label="Poprzednie zdjęcia" disabled={edges.first} onClick={() => stripRef.current?.slidePrev(speed)}><IoChevronBackOutline aria-hidden="true"/></button>
          <button type="button" className={styles.control} aria-controls={stripId} aria-label="Następne zdjęcia" disabled={edges.last} onClick={() => stripRef.current?.slideNext(speed)}><IoChevronForwardOutline aria-hidden="true"/></button>
        </div>}
      </>}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={titleId}
        className={styles.lightbox}
        animationDuration={650}
      >
        <h2 id={titleId} className={styles.visuallyHidden}>{"Galeria " + name}</h2>
        <Swiper
          className={styles.slider}
          modules={[Keyboard, A11y]}
          initialSlide={activeIndex}
          slidesPerView={1}
          loop={images.length > 1}
          speed={speed}
          keyboard={{ enabled: true, onlyInViewport: false }}
          a11y={{ containerMessage: 'Zdjęcia restauracji ' + name, slideLabelMessage: 'Zdjęcie {{index}} z {{slidesLength}}' }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            syncGallerySpeed(swiper, speed);
            requestAnimationFrame(() => { if (!swiper.destroyed) swiper.update(); });
          }}
          onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        >
          {images.map((item) => (
            <SwiperSlide key={item.id} className={styles.slide}>
              <Image src={item.image} alt={item.alt} fill placeholder="blur" style={{ objectFit: 'contain', objectPosition: 'center' }} sizes="(min-width: 1248px) 1200px, calc(100vw - 48px)" />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={styles.controls}>
          <button type="button" className={styles.control} aria-label="Poprzednie zdjęcie" disabled={images.length < 2} onClick={() => swiperRef.current?.slidePrev(speed)}>
            <IoChevronBackOutline aria-hidden="true" />
          </button>
          <p aria-live="polite" aria-atomic="true">{currentIndex + 1} / {images.length}</p>
          <button type="button" className={styles.control} aria-label="Następne zdjęcie" disabled={images.length < 2} onClick={() => swiperRef.current?.slideNext(speed)}>
            <IoChevronForwardOutline aria-hidden="true" />
          </button>
        </div>
      </Modal>
    </section>
  );
}
