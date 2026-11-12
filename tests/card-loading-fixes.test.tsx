import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import DishRow from '../src/components/DishRow';
import DishCard from '../src/components/DishCard';
import { DishCardSkeleton } from '../src/components/MenuSkeleton';
import ImageFileInput from '../src/components/Admin/ImageFileInput';

const image = { src:'/images/dish.jpg',width:1200,height:800,alt:'Dish',blurDataURL:'data:image/gif;base64,AA==' };
const item = { id:'sample',name:'Carpaccio',price:'63',description:['Description'],image };

test('A photo menu row has one whole-content loading boundary, rather than nested image Skeletons', () => {
  const html=renderToStaticMarkup(<DishRow restaurantId="papapasta" item={item}/>);
  assert.ok(html.includes('data-dish-reveal="row"'));
  assert.ok(!html.includes('data-dish-image'));
  assert.ok(html.includes('Carpaccio') && html.includes('63') && html.includes('Description'));
  assert.ok(html.includes('<noscript>'));
  assert.equal((html.match(/<img /g)??[]).length,1);
});

test('Full dish details and their loading shell reserve the same card/image layout', () => {
  const html=renderToStaticMarkup(<DishCard dish={{...item,restaurantId:'centro',category:'Przystawki',menuTitle:'Menu',slug:'sample',href:'/menu/sample'}}/>);
  assert.ok(html.includes('data-dish-reveal="card"') && !html.includes('data-dish-image'));
  const skeleton=renderToStaticMarkup(<DishCardSkeleton/>);
  assert.ok(skeleton.includes('card') && skeleton.includes('image'));
  assert.ok(skeleton.includes('role="status"') && skeleton.includes('Ładowanie dania'));
  assert.ok(!skeleton.includes('<img'));
  const modal=renderToStaticMarkup(<DishCardSkeleton modal/>);
  assert.ok(modal.includes('id="dish-title"') && modal.includes('data-modal-heading'));
});

test('Upload filenames are separate wrapping text rather than a stretching native file control', () => {
  const filename='bardzo-dluga-nazwa-'.repeat(25)+'.webp';
  const html=renderToStaticMarkup(<ImageFileInput filename={filename} accept="image/webp" disabled/>);
  assert.ok(html.includes(filename));
  assert.ok(html.includes('fileName') && html.includes('type="file"'));
  assert.ok(html.includes('srOnly') && html.includes('disabled=""') && html.includes('accept="image/webp"'));
});
