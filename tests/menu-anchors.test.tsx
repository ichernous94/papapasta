import './helpers/register-styles.cjs';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import MenuTabs from '../src/components/MenuTabs';
import ContactPage from '../src/components/ContactPage';
import { menuCategoryAnchor, menuSectionAnchor, readMenuHash } from '../src/utils/menuAnchor';
import { papaPastaSite } from '../src/config/papapasta';
import { centro } from '../src/config/centro';
import { popupInputSchema } from '../src/validation/site-content';

test('QR fragments use immutable identities, distinguish repeated labels and decode safely', () => {
  assert.equal(menuSectionAnchor('main'),'menu-main');
  const id='papapasta:main:przystawki';
  const anchor=menuCategoryAnchor('main',id);
  assert.equal(anchor,'menu-main--papapasta:main:przystawki');
  assert.equal(readMenuHash('#'+encodeURIComponent(anchor)),anchor);
  assert.equal(readMenuHash('#%E0%A4%A'),'');
  assert.notEqual(menuCategoryAnchor('kids',id),anchor);
  assert.notEqual(menuCategoryAnchor('main','another-id'),anchor);
  const html=renderToStaticMarkup(<MenuTabs menuKey="main" label="Menu" tabs={[{id,label:'Renamed dish category',content:<p>Content</p>}]} variant="papapasta"/>);
  assert.ok(html.includes(`id="${anchor}"`));
  assert.ok(html.includes(`href="#${encodeURIComponent(anchor)}"`));
  assert.ok(html.includes(`aria-controls="${anchor}"`));
  assert.ok(html.includes('data-menu-tabs="true"'));
});
test('Both contact introductions retain address, phone, email, socials and restaurant-specific reservation target', () => {
  for(const site of [papaPastaSite,centro]) {
    const html=renderToStaticMarkup(<ContactPage site={site} mapsUrl="https://maps.example.test/" mapsEmbedUrl="https://maps.example.test/embed"/>);
    for(const text of ['ADRES','TELEFON','EMAIL','ODWIEDŹ PROFIL','ZAREZERWUJ STOLIK','ZNAJDŹ NAS','OTWÓRZ W MAPACH',site.street,site.postalAddress,site.phone]) assert.ok(html.includes(text),text);
    assert.ok(html.includes(`href="${site.phoneHref}"`));
    assert.ok(html.includes(`href="mailto:${site.email}"`));
    assert.equal((html.match(/aria-label="Facebook /g)??[]).length,1);
  }
});
test('Popup validation rejects cross-restaurant/ID injection and requires an enabled poster text alternative', () => {
  const input={version:1,title:'Popup',description:'Offer text',imageAlt:'Offer',enabled:true,removeImage:false};
  assert.ok(popupInputSchema.safeParse(input).success);
  assert.equal(popupInputSchema.safeParse({...input,description:''}).success,false);
  assert.ok(popupInputSchema.safeParse({...input,enabled:false,description:''}).success);
  assert.equal(popupInputSchema.safeParse({...input,restaurantId:'papapasta'}).success,false);
  assert.equal(popupInputSchema.safeParse({...input,id:'another-record'}).success,false);
});
