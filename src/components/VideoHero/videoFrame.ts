// Wait for an actual video frame, rather than revealing the empty media surface on `playing`.
export function waitForVideoFrame(video: HTMLVideoElement, onReady: () => void) {
  let active = true;
  let frame: number | undefined;
  let animation: number | undefined;
  const reveal = () => {
    if (active && video.readyState >= 2 && !video.error) {
      active = false;
      onReady();
    }
  };
  const scheduleFallback = () => {
    if (animation === undefined && video.readyState >= 2) animation = requestAnimationFrame(reveal);
  };
  if (typeof video.requestVideoFrameCallback === 'function') {
    frame = video.requestVideoFrameCallback(reveal);
  } else {
    video.addEventListener('loadeddata', scheduleFallback);
    scheduleFallback();
  }
  return () => {
    active = false;
    if (frame !== undefined && typeof video.cancelVideoFrameCallback === 'function') video.cancelVideoFrameCallback(frame);
    if (animation !== undefined) cancelAnimationFrame(animation);
    video.removeEventListener('loadeddata', scheduleFallback);
  };
}
