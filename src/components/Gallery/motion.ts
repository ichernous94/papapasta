import type { Swiper } from 'swiper';

export const GALLERY_SPEED = 450;

export function syncGallerySpeed(swiper: Swiper | null, speed: number) {
  if (!swiper || swiper.destroyed) return;
  swiper.params.speed = speed;
  // Returning below 1024px restores originalParams, not React's latest props.
  swiper.originalParams.speed = speed;
}
