// A presented frame is preferred; a moving media clock also proves that playback started.
export function waitForVideoFrame(video: HTMLVideoElement, onReady: () => void) {
  let active = true;
  let frame: number | undefined;
  let animation: number | undefined;
  const native = typeof video.requestVideoFrameCallback === 'function';
  const initialTime = video.currentTime;
  const deadline = performance.now() + 2000;
  const cancel = () => {
    active = false;
    if (frame !== undefined && typeof video.cancelVideoFrameCallback === 'function') video.cancelVideoFrameCallback(frame);
    if (animation !== undefined) cancelAnimationFrame(animation);
    video.removeEventListener('loadeddata', scheduleFallback);
    video.removeEventListener('timeupdate', scheduleFallback);
  };
  const reveal = () => {
    if (active && video.readyState >= 2 && !video.error) { cancel(); onReady(); }
  };
  const check = () => {
    animation = undefined;
    if (!active) return;
    if (!native || (!video.paused && video.currentTime > initialTime)) reveal();
    if (active && !video.paused && !video.error && video.readyState >= 2 && performance.now() < deadline) scheduleFallback();
  };
  function scheduleFallback() {
    if (active && animation === undefined && video.readyState >= 2 && typeof requestAnimationFrame === 'function') animation = requestAnimationFrame(check);
  }
  if (native) frame = video.requestVideoFrameCallback(reveal);
  video.addEventListener('loadeddata', scheduleFallback);
  video.addEventListener('timeupdate', scheduleFallback);
  scheduleFallback();
  return cancel;
}
