'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import Modal from '@/components/ui/Modal';
import useReducedMotion from '@/hooks/useReducedMotion';
import { galleryImages } from '../images';
import 'swiper/css';
import styles from './Gallery.module.scss';

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const reducedMotion = useReducedMotion();

  return (
    <section className={styles.gallery} aria-label="Galeria restauracji Papa Pasta">
      <div className={styles.grid}>
        {galleryImages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={styles.thumbnail}
            onClick={() => { setActiveIndex(index); setCurrentIndex(index); }}
            aria-label={'Powiększ: ' + item.alt}
            aria-haspopup="dialog"
          >
            <Image src={item.image} alt={item.alt} fill placeholder="blur" sizes="(min-width: 1024px) 25vw, 50vw" />
          </button>
        ))}
      </div>
      <Modal
        open={activeIndex !== null}
        onClose={() => setActiveIndex(null)}
        labelledBy="gallery-title"
        className={styles.lightbox}
      >
        <h2 id="gallery-title" className={styles.visuallyHidden}>Galeria Papa Pasta</h2>
        {activeIndex !== null && (
          <>
            <Swiper
              className={styles.slider}
              modules={[Keyboard, A11y]}
              initialSlide={activeIndex}
              slidesPerView={1}
              loop
              speed={reducedMotion ? 0 : 250}
              keyboard={{ enabled: true, onlyInViewport: false }}
              a11y={{ containerMessage: 'Zdjęcia restauracji Papa Pasta', slideLabelMessage: 'Zdjęcie {{index}} z {{slidesLength}}' }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                requestAnimationFrame(() => { if (!swiper.destroyed) swiper.update(); });
              }}
              onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
            >
              {galleryImages.map((item) => (
                <SwiperSlide key={item.id} className={styles.slide}>
                  <Image src={item.image} alt={item.alt} fill placeholder="blur" sizes="(min-width: 1600px) 1440px, 100vw" />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className={styles.controls}>
              <button type="button" className={styles.control} aria-label="Poprzednie zdjęcie" onClick={() => swiperRef.current?.slidePrev()}>
                <IoChevronBackOutline aria-hidden="true" />
              </button>
              <p aria-live="polite" aria-atomic="true">{currentIndex + 1} / {galleryImages.length}</p>
              <button type="button" className={styles.control} aria-label="Następne zdjęcie" onClick={() => swiperRef.current?.slideNext()}>
                <IoChevronForwardOutline aria-hidden="true" />
              </button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
