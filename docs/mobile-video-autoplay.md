# Native video autoplay — 2026-11-13

The shared VideoHero now follows the supplied old-project examples for both restaurant home pages. Server HTML contains `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`, a native `poster`, and a typed MP4 `<source>`.

Sources are the existing `/videos/papapasta.mp4` and `/videos/centro.mp4`. The previously added video API, custom range handler and range tests have been removed. Video files and hosting configuration are unchanged.

The mount effect only sets `defaultMuted = true` and `preload = 'auto'`. There are no application preference checks, visibility/intersection observers, startup play/pause calls, source resets or automatic retry state machine. Native autoplay is requested regardless of reduced-motion/save-data preferences, as explicitly selected for this revision. Browser media policies still apply.

The video is always visible. The separate image placeholder, opacity gate, first-frame callback and 400ms reveal have been removed from VideoHero; the browser owns the native poster-to-video transition. Existing hero dimensions, cover crop, overlay, logo and menu action remain.

The manual button reads native media state through media-event subscriptions, including playback that began before hydration. Only a manual click calls play or pause. A manual retry may reload a genuinely failed source. Video and source errors retain a readable status message; automatic startup does not run a JavaScript retry loop.

## Verification

- TypeScript, targeted ESLint, five affected component tests and the production build passed.
- Both home pages' initial HTML contains the native autoplay attributes, the correct direct `<source>` and native poster. The removed API URLs return 404.
- Both direct MP4s return video/mp4 and exact two-byte range probes from the local production server.
- Chromium at 375px and 1440px verified both sites with cold and warm caches, with JavaScript enabled and fully disabled. Media time advanced and the video was visible without a click. With JavaScript enabled, startup made zero application play/load calls, including simulated save-data and reduced-motion settings.
- Manual pause survived page scrolling; a real click resumed playback, with only that click issuing play. The button reflected native playback that started before hydration.
- Both MP4 URLs were opened directly in the browser and decoded with nonzero frame dimensions and no media error.

These are local source changes, not a deployment. Published pages must be checked after this exact build is deployed. Physical iPhone/Safari and Android devices were unavailable; Chromium checks do not establish playback on the user's phone or override a browser's autoplay restrictions.
