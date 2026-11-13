import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import VideoHero from '../src/components/VideoHero';

test('Both heroes expose native autoplay, the direct MP4 source and native poster before hydration', () => {
  for (const name of ['papapasta', 'centro']) {
    const html = renderToStaticMarkup(<VideoHero videoSrc={`/videos/${name}.mp4`} poster={{ src: '/poster.webp', width: 1920, height: 1080 }} name={name} logo={{ src: '/logo.svg', width: 200, height: 60 }}/>);
    const video = html.match(/<video\b[^>]*>/)?.[0];
    assert.ok(video);
    assert.ok(html.includes(`<source src="/videos/${name}.mp4" type="video/mp4"`));
    assert.ok(video.includes('preload="metadata"') && video.includes('poster="/poster.webp"'));
    assert.ok(video.includes('muted=""') && video.includes('playsInline=""') && video.includes('loop=""'));
    assert.ok(/autoplay=""/i.test(video));
    assert.ok(!html.includes('/api/video/') && !html.includes('data:image/'));
    assert.ok(html.includes('Odtwórz wideo'));
  }
});
