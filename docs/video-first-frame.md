# First-frame video previews — 2026-11-10

Both restaurant home heroes display the first frame of their corresponding video at every viewport width. This replaces the earlier steak/cocktail photos and the desktop-only poster hiding rule.

## Assets and rendering

The existing `public/videos/papapasta.mp4` and `centro.mp4` were decoded in a separate local Chromium session while paused at timestamp 0. Their first 1920×1080 frames were exported losslessly to temporary PNGs, then encoded by the installed Sharp library as WebP at quality 85:

| Poster | Dimensions | Bytes |
| --- | --- | --- |
| `public/images/video-posters/papapasta.webp` | 1920×1080 | 140330 |
| `public/images/video-posters/centro.webp` | 1920×1080 | 125748 |

No dependencies were installed and the MP4 files were not changed. Regenerate the matching poster if a video is replaced. Static imports retain responsive Next Image output, preload and a blur placeholder in the server HTML. Poster and video share centered `object-fit: cover` geometry and one dark overlay.

## Playback

The poster remains behind the video while loading. `playing` updates controls, but does not reveal the video until `requestVideoFrameCallback` confirms a presented frame. Without that API, current-data readiness and an animation frame provide the fallback. Video opacity then transitions to 1 over 400ms, without an artificial delay.

Error/emptied events and effect cleanup cancel pending readiness work. Error/reset returns immediately to the preview. Manual pause preserves the last video frame and is respected on viewport re-entry. Autoplay remains muted/inline; reduced motion and save-data suppress automatic loading/playback. Manual start remains available, and reduced motion removes the fade.

The existing component props and restaurant routes remain unchanged. No database writes, migrations or deployment are part of this change.

## Validation

- TypeScript, targeted ESLint, all 31 affected unit/SSR tests and production build passed. The build used an unavailable dummy database URL, retaining request-time content loading.
- Local production Chromium checks covered both restaurants at 320, 375, 768, 1024 and 1440px with a cold cache: visible matching posters, server image preload, identical poster/video rectangles and cover positioning, and no horizontal document overflow. Mobile and desktop screenshots were visually reviewed against the extracted frames.
- Held frame callbacks confirmed that `playing` alone does not reveal the video. Browser animation-frame sampling captured intermediate opacity and the 400ms transition on both sites at 375/1440px. Simulated missing frame-callback APIs used the fallback successfully.
- Delayed MP4 requests left a loaded preview visible until playback became ready. Cancelled callbacks after media errors could not reveal the video. Simulated autoplay refusal retained the preview and manual control; manual start and persistent manual pause passed on both sites at 375/1440px. Reduced motion retained the preview without an automatic source; save-data likewise suppressed automatic loading.
- Physical iPhone/Safari and Android/Chrome are unavailable; Chromium emulation does not confirm those devices’ native media policies. These remain manual release checks.
- No connected database writes, migrations, dependency installation or deployment were performed.
