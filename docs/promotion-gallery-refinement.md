# Promotion loading and gallery/menu refinement — 2026-11-12

Centro promotion cards now use the same image-readiness lifecycle as whole dish cards: wait for decoding and a 250ms first-view interval, then fade all content together over 350ms. The shared hook preserves dish modal focus behavior. Promotion links, dates, publication filtering and legacy article URLs stay unchanged. The data fallback uses one card in the existing two/one-column grid, matching the current single published promotion. Before data arrives the item count and edited image/title geometry are unknown; that fallback is a reservation estimate. Once data arrives, the actual content reserves the exact image/text dimensions throughout photo loading.

The enlarged gallery had `object-fit: contain` only in its stylesheet. Next Image could not use that stylesheet value when generating its blur SVG/background and defaulted to cover. Supplying centered contain sizing through the image's inline style aligns both stages. Lightbox width/height are reserved before loading. Thumbnail cover cropping, dialogs, swipe and keyboard behavior are preserved. Responsive arrow visuals use a pseudo-element so their 32–44px sizing does not reduce the 44px button hit target.

Both restaurant menus share the smaller mobile category heading (22px), photo price (24px, Allura 400), and 12px padding before the first group heading. Photo-free prices keep their existing typography/placement. Cocktail Bar's intro/book spacing is scoped to that route rather than changing other Centro pages.

## Validation

- TypeScript without emitting files, targeted ESLint, all 40 affected component/unit tests and the final production build passed. The final build excludes the temporary UI route.
- Chromium checks at 320, 375, 599, 768, 1024 and 1440px confirmed both menu variants' heading/price fonts, first-group padding, no horizontal overflow, smoothly sized arrows and 44px targets.
- An isolated temporary UI route exercised the real components with local images and delayed server data. Holding image responses confirmed that the whole promotion card stays covered and inert, keeps its dimensions, then fades as one block without a second blur. A failed image releases the content. The first-load interval, reduced-motion behavior and readable no-JS markup were checked.
- The existing Centro `/promocje` route was also checked against the connected database using read-only requests. Its current single promotion loaded successfully; popup settings/content were not changed.
- Portrait and landscape gallery images were checked while loading and after load, including matching contain/background sizing, stable dimensions, navigation by arrows/keyboard, reopening at the clicked slide and resizing an open lightbox to a short 768×550px viewport.
- Screenshots of loading/loaded states and mobile/desktop layouts were inspected. Temporary UI fixtures are removed before the final production build; no fixture routes or records are shipped.
- Physical iPhone/Safari and Android/Chrome were unavailable. Touch behavior on those physical devices remains unverified. No deployment, database mutation, R2 upload or configuration change was performed.
