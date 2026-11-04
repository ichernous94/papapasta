import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { proxy } from '../src/proxy';
import { temporarySiteHost, temporaryAdminHost, temporaryCentroHost, centroPreviewURL } from '../src/config/hosts';
import { isAdminHost } from '../src/server/auth/origin';

test('Workbase replaces the previous temporary aliases without accepting old admin/restaurant hosts', () => {
  assert.equal(temporarySiteHost, 'workbase.sbs');
  assert.equal(temporaryAdminHost, 'admin.workbase.sbs');
  assert.equal(temporaryCentroHost, 'centro.workbase.sbs');
  const old = 'fwos8o44go04wg8gc4cwsows.178.104.181.157.sslip.io';
  assert.equal(isAdminHost(`admin.${old}`), false);
  assert.equal(proxy(new NextRequest(`http://centro.${old}/menu`)).headers.get('x-middleware-rewrite'), null);
  assert.equal(centroPreviewURL(old, 'http:', ''), undefined);
});

test('Explicit temporary restaurant/admin hosts route with query preservation and noindex', () => {
  for (const [host, prefix] of [[temporarySiteHost, ''], [temporaryCentroHost, '/site-centro'], [temporaryAdminHost, '/site-admin']]) {
    for (const path of ['/', '/menu', '/kontakt']) {
      const response = proxy(new NextRequest(`http://${host}${path}?source=test`, { headers: { host } }));
      const rewrite = response.headers.get('x-middleware-rewrite');
      assert.equal(rewrite, prefix ? `http://${host}${prefix}${path === '/' ? '' : path}?source=test` : null);
      assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
    }
  }
});

test('Temporary admin auth permits only its exact host, including case/port normalization', () => {
  assert.equal(isAdminHost(temporaryAdminHost), true);
  assert.equal(isAdminHost(temporaryAdminHost.toUpperCase() + ':443'), true);
  for (const host of [temporarySiteHost, temporaryCentroHost, `admin.${temporarySiteHost}.evil.example`, 'admin.other.178.104.181.157.sslip.io', null]) assert.equal(isAdminHost(host), false);
  assert.equal(isAdminHost('admin.papapasta.pl'), true);
});

test('Unknown preview hosts are not rewritten and technical paths stay blocked', () => {
  for (const host of [`centro.${temporarySiteHost}.evil.example`, 'centro.other.sslip.io']) {
    assert.equal(proxy(new NextRequest(`http://${host}/menu`)).headers.get('x-middleware-rewrite'), null);
  }
  for (const host of [temporarySiteHost, temporaryAdminHost, temporaryCentroHost]) {
    assert.equal(proxy(new NextRequest(`http://${host}/site-admin/menus`)).status, 404);
    assert.equal(proxy(new NextRequest(`http://${host}/site-centro/menu`)).status, 404);
    assert.equal(proxy(new NextRequest(`http://${host}/api/auth/get-session`)).headers.get('x-middleware-rewrite'), null);
  }
});

test('Landing Centro destination remains on the explicit temporary deployment only', () => {
  assert.equal(centroPreviewURL(temporarySiteHost, 'http:', ''), `http://${temporaryCentroHost}/`);
  assert.equal(centroPreviewURL(temporarySiteHost, 'https:', '3600'), `https://${temporaryCentroHost}:3600/`);
  assert.equal(centroPreviewURL('papapasta.pl', 'https:', ''), undefined);
  assert.equal(centroPreviewURL('other.sslip.io', 'https:', ''), undefined);
});
