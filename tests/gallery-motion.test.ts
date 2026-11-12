import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Swiper } from 'swiper';
import { GALLERY_SPEED, syncGallerySpeed } from '../src/components/Gallery/motion';

test('Normal gallery speed survives the actual Swiper breakpoint reset to mobile defaults', () => {
  const swiper = new Swiper({ init: false, speed: 0, slidesPerView: 2, breakpoints: { 1024: { slidesPerView: 4 } } });
  // Reproduce hydration: React updates live params, but originalParams stays zero.
  swiper.params.speed = GALLERY_SPEED;
  assert.equal(swiper.originalParams.speed, 0);
  syncGallerySpeed(swiper, GALLERY_SPEED);
  swiper.currentBreakpoint = '1024';
  swiper.getBreakpoint = () => 'max';
  swiper.setBreakpoint();
  assert.equal(swiper.params.speed, 450);
  assert.equal(swiper.originalParams.speed, 450);
  assert.equal(swiper.params.slidesPerView, 2);
});

test('Live reduced-motion changes update both parameter sets without replacing a gallery or its selected slide', () => {
  const swiper = new Swiper({ init: false, speed: 450 });
  swiper.activeIndex = 2;
  syncGallerySpeed(swiper, 0);
  assert.equal(swiper.params.speed, 0);
  assert.equal(swiper.originalParams.speed, 0);
  syncGallerySpeed(swiper, GALLERY_SPEED);
  assert.equal(swiper.params.speed, 450);
  assert.equal(swiper.originalParams.speed, 450);
  assert.equal(swiper.activeIndex, 2);
  swiper.destroyed = true;
  syncGallerySpeed(swiper, 0);
  assert.equal(swiper.params.speed, 450);
  assert.doesNotThrow(() => syncGallerySpeed(null, 0));
});
