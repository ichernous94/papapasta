import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reserveReveal, startReveal, releasePendingReveal, type RevealRegistry } from '../src/components/ui/Reveal/registry';

test('A fallback and resolved banner share one animation; different restaurants remain independent', () => {
  const registry: RevealRegistry = new Map();
  const fallback = {}, resolved = {};
  assert.equal(reserveReveal(registry,'centro:banner:menu:main',fallback),true);
  startReveal(registry,'centro:banner:menu:main',fallback);
  releasePendingReveal(registry,'centro:banner:menu:main',fallback);
  assert.equal(reserveReveal(registry,'centro:banner:menu:main',resolved),false);
  assert.equal(reserveReveal(registry,'papapasta:banner:menu:main',resolved),true);
  assert.equal(reserveReveal(new Map(),'centro:banner:menu:main',resolved),true);
});

test('An unstarted effect is released for Strict Mode replay or replacement before the first frame', () => {
  const registry: RevealRegistry = new Map();
  const owner = {};
  assert.equal(reserveReveal(registry,'banner',owner),true);
  releasePendingReveal(registry,'banner',owner);
  assert.equal(reserveReveal(registry,'banner',owner),true);
  startReveal(registry,'banner',owner);
  releasePendingReveal(registry,'banner',owner);
  assert.equal(reserveReveal(registry,'banner',owner),false);
});

test('A competing component cannot release another banner reservation', () => {
  const registry: RevealRegistry = new Map();
  const owner = {}, other = {};
  reserveReveal(registry,'banner',owner);
  releasePendingReveal(registry,'banner',other);
  startReveal(registry,'banner',other);
  assert.equal(reserveReveal(registry,'banner',other),false);
  assert.equal(registry.get('banner')?.started,false);
});
