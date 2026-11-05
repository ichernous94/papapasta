import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import PhotoImage from '../src/components/ui/PhotoImage';

test('PhotoImage preserves image markup and native blur placeholder without a permanent no-JS filter', () => {
  const html = renderToStaticMarkup(<PhotoImage src="/images/photo.webp" alt="Dish photo" width={300} height={200} sizes="50vw" placeholder="blur" blurDataURL="data:image/webp;base64,AA==" className="existing"/>);
  assert.ok(html.includes('alt="Dish photo"'));
  assert.ok(html.includes('width="300"')&&html.includes('height="200"')&&html.includes('sizes="50vw"'));
  assert.ok(html.includes('photo existing'));
  assert.ok(!html.includes('animation'));
  assert.ok(html.includes('data:image/webp;base64,AA=='));
});
