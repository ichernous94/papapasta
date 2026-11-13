import './helpers/register-styles.cjs';
import './helpers/register-images.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import PublicFocusBoundary from '../src/components/PublicFocusBoundary';
import CocktailBook from '../src/components/CocktailBook';
import VideoHero from '../src/components/VideoHero';
import { canScrollMenu } from '../src/hooks/useMenuGestureLock';

test('Public focus defaults to pointer mode without introducing a different selection element', () => {
  const html=renderToStaticMarkup(<PublicFocusBoundary as="section" data-restaurant-selection aria-label="Restaurants"><a href="/home">Papa Pasta</a></PublicFocusBoundary>);
  assert.ok(html.startsWith('<section'));
  assert.ok(html.includes('data-keyboard-focus="false"'));
  assert.ok(html.includes('data-restaurant-selection="true"'));
});
test('Cocktail reader exposes only accessible page arrows and counter, without removed tools/links', () => {
  const html=renderToStaticMarkup(<CocktailBook/>);
  assert.equal((html.match(/<button/g)??[]).length,2);
  assert.ok(html.includes('Poprzednia strona')&&html.includes('Następna strona'));
  for(const label of ['Miniatury stron','Powiększ','Pomniejsz','Pełny ekran','Otwórz strony karty jako obrazy','>100%<'])assert.ok(!html.includes(label),label);
  assert.ok(html.includes('aria-live="polite"'));
});
test('Native video poster and autoplay are available from server markup alongside manual playback', () => {
  const html=renderToStaticMarkup(<VideoHero videoSrc="/videos/test.mp4" poster={{src:'/images/poster.jpg',width:1200,height:800,blurDataURL:'data:image/png;base64,AA=='}} name="Restaurant" logo={{src:'/logo.svg',width:200,height:60}}/>);
  const video = html.match(/<video[^>]+>/)?.[0];
  assert.ok(video?.includes('poster="/images/poster.jpg"'));
  assert.ok(/autoPlay=""/i.test(video!));
  assert.ok(html.includes('<source src="/videos/test.mp4" type="video/mp4"'));
  assert.ok(html.includes('Odtwórz wideo'));
  assert.ok(html.includes('<video'));
});
test('A short menu permits internal scrolling only while movement can be consumed', () => {
  const normal={scrollHeight:280,clientHeight:300,scrollTop:0};
  assert.equal(canScrollMenu(normal,100),false);
  const short={scrollHeight:400,clientHeight:160,scrollTop:0};
  assert.equal(canScrollMenu(short,100),true);assert.equal(canScrollMenu(short,-100),false);
  assert.equal(canScrollMenu({...short,scrollTop:240},100),false);assert.equal(canScrollMenu({...short,scrollTop:240},-100),true);
  assert.equal(canScrollMenu({...short,scrollTop:100},100),true);assert.equal(canScrollMenu({...short,scrollTop:100},-100),true);
});
