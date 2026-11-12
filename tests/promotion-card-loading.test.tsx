import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import PromotionCard from '../src/components/PromotionCard';
import PromotionCardSkeleton from '../src/components/PromotionCard/Skeleton';
import PhotoImage from '../src/components/ui/PhotoImage';
import type { Promotion } from '../src/types/content';

const promotion: Promotion = {
  id: 'lunch', slug: 'zestawy-obiadowe', title: 'Więcej smaku za mniej', date: '2026-11-12',
  body: [], published: true, version: 1, imageId: null, staticImage: null, imageAlt: 'Zestawy',
  image: { src: '/images/lunch.webp', width: 1200, height: 628, alt: 'Zestawy', blurDataURL: 'data:image/webp;base64,AA==' },
};

test('Promotion cards reserve real content under one Skeleton and preserve the legacy link, date and no-JS content', () => {
  const html = renderToStaticMarkup(<PromotionCard promotion={promotion}/>);
  assert.ok(html.includes('data-promotion-reveal') && html.includes('data-promotion-content'));
  assert.ok(html.includes('data-state="loading"') && html.includes('<noscript>'));
  assert.ok(html.includes('href="/zestawy-obiadowe"') && html.includes(promotion.title));
  assert.ok(html.includes('dateTime="2026-11-12"') && html.includes('12 listopada 2026'));
  assert.equal((html.match(/<img /g) ?? []).length, 1);
  assert.ok(!html.includes('background-image:') && !html.includes('data-dish-image'));
});

test('The streamed promotion Skeleton exposes loading status; the card overlay is decorative and uses the supplied ratio', () => {
  const fallback = renderToStaticMarkup(<PromotionCardSkeleton/>);
  assert.ok(fallback.includes('role="status"') && fallback.includes('Ładowanie promocji'));
  const overlay = renderToStaticMarkup(<PromotionCardSkeleton decorative imageRatio={0.75}/>);
  assert.ok(overlay.includes('--promotion-image-ratio:0.75') && overlay.includes('aria-hidden="true"'));
  assert.ok(!overlay.includes('role="status"') && !overlay.includes('<img'));
});

test('Contain sizing is available to Next Image when generating the gallery blur placeholder', () => {
  const html = renderToStaticMarkup(<PhotoImage src={promotion.image!} alt="Gallery" fill placeholder="blur" style={{ objectFit: 'contain', objectPosition: 'center' }}/>);
  assert.ok(html.includes('object-fit:contain') && html.includes('object-position:center'));
  assert.ok(html.includes('background-size:contain') && html.includes('background-position:center'));
});
