import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import DishImage from '../src/components/DishImage';
import PhotoImage from '../src/components/ui/PhotoImage';

test('Dish image keeps accessible image geometry and a decorative skeleton without hiding server/no-JS content', () => {
  const html = renderToStaticMarkup(<DishImage src="/dish.webp" alt="Pasta" width={600} height={400} sizes="40vw"/>);
  assert.ok(html.includes('data-dish-image="true"'));
  assert.ok(html.includes('data-state="ready"'));
  assert.ok(html.includes('alt="Pasta"') && html.includes('width="600"') && html.includes('height="400"'));
  assert.ok(html.includes('aria-hidden="true"'));
  assert.equal((html.match(/<img /g) ?? []).length, 1);
});

test('Ordinary content photos retain their existing behavior without dish skeletons', () => {
  const html = renderToStaticMarkup(<PhotoImage src="/content.webp" alt="Restaurant" width={600} height={400}/>);
  assert.ok(!html.includes('data-dish-image') && !html.includes('placeholder'));
});
