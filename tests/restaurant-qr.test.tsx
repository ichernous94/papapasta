import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import RestaurantQRCode from '../src/components/RestaurantQRCode';
import { restaurantQRLogo, loadRestaurantLogo } from '../src/components/RestaurantQRCode/logo';

test('QR branding uses the selected restaurant, with no unknown-restaurant fallback', () => {
  assert.equal(restaurantQRLogo('papapasta'), '/icons/logo_papapasta_dark.svg');
  assert.equal(restaurantQRLogo('centro'), '/icons/centro_logo_qr.svg');
  assert.equal(restaurantQRLogo('unknown'), undefined);
});

test('Existing oversized records do not crash server rendering before the client boundary can handle capacity errors', () => {
  const html = renderToStaticMarkup(<RestaurantQRCode value={'https://example.com/?q=' + 'x'.repeat(1900)} restaurantId="centro" size={256} label="Existing QR"/>);
  assert.ok(html.includes('Loading QR code…'));
  assert.ok(!html.includes('<svg'));
});

test('Unavailable logo requests are deduplicated and a failed request can be retried', async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => { requests++; return new Response('', { status: 503 }); };
  try {
    const first = loadRestaurantLogo('/test-unavailable-logo.svg');
    const second = loadRestaurantLogo('/test-unavailable-logo.svg');
    assert.equal(first, second);
    await assert.rejects(first, /Logo unavailable/);
    assert.equal(requests, 1);
    await assert.rejects(loadRestaurantLogo('/test-unavailable-logo.svg'), /Logo unavailable/);
    assert.equal(requests, 2);
  } finally { globalThis.fetch = original; }
});
