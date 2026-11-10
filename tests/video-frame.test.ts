import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waitForVideoFrame } from '../src/components/VideoHero/videoFrame';

function media() {
  const target = new EventTarget();
  return Object.assign(target, { readyState: 2, error: null as MediaError | null });
}

test('Video stays covered until a presented frame and reveals once', () => {
  const video = media();
  let callback: (() => void) | undefined;
  let reveals = 0;
  const framed = Object.assign(video, {
    requestVideoFrameCallback: (fn: () => void) => { callback = fn; return 7; },
    cancelVideoFrameCallback: () => {},
  });
  const cancel = waitForVideoFrame(framed as unknown as HTMLVideoElement, () => reveals++);
  assert.equal(reveals, 0);
  callback!(); callback!();
  assert.equal(reveals, 1);
  cancel();
});

test('Cancelled or failed media cannot be revealed by a late frame callback', () => {
  for (const failed of [false, true]) {
    const video = media();
    let callback: (() => void) | undefined;
    let cancelled: number | undefined;
    let revealed = false;
    const framed = Object.assign(video, {
      requestVideoFrameCallback: (fn: () => void) => { callback = fn; return 7; },
      cancelVideoFrameCallback: (id: number) => { cancelled = id; },
    });
    const cancel = waitForVideoFrame(framed as unknown as HTMLVideoElement, () => { revealed = true; });
    if (failed) video.error = { code: 3 } as MediaError;
    else cancel();
    callback!();
    assert.equal(revealed, false);
    if (!failed) assert.equal(cancelled, 7);
    cancel();
  }
});

test('Browsers without frame callbacks wait for current data and a paint; cleanup cancels the fallback', () => {
  const previousRequest = globalThis.requestAnimationFrame;
  const previousCancel = globalThis.cancelAnimationFrame;
  let paint: FrameRequestCallback | undefined;
  const cancelled: number[] = [];
  globalThis.requestAnimationFrame = callback => { paint = callback; return 11; };
  globalThis.cancelAnimationFrame = id => { cancelled.push(id); };
  try {
    const video = media(); video.readyState = 1;
    let reveals = 0;
    const cancel = waitForVideoFrame(video as unknown as HTMLVideoElement, () => reveals++);
    assert.equal(paint, undefined);
    video.readyState = 2; video.dispatchEvent(new Event('loadeddata'));
    assert.equal(reveals, 0);
    paint!(0);
    assert.equal(reveals, 1);
    cancel();
    const cancelledVideo = media();
    const stop = waitForVideoFrame(cancelledVideo as unknown as HTMLVideoElement, () => reveals++);
    stop(); paint!(0);
    assert.equal(reveals, 1);
    assert.ok(cancelled.includes(11));
  } finally {
    if (previousRequest) globalThis.requestAnimationFrame = previousRequest;
    else Reflect.deleteProperty(globalThis, 'requestAnimationFrame');
    if (previousCancel) globalThis.cancelAnimationFrame = previousCancel;
    else Reflect.deleteProperty(globalThis, 'cancelAnimationFrame');
  }
});
