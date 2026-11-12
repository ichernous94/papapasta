# Explicit Centro cocktail photo and gallery motion — 2026-11-12

The Centro homepage Cocktail Bar section now selects the already imported `signature-cocktail.jpg` through its own `centroImages.signature` key. It no longer relies on the `mojito` key, which correctly remains associated with the separate mojito asset. The chosen alt, cover crop and `KARTA KOKTAJLI` target are preserved. This is a static code reference; no gallery or menu image data is modified.

## Reproduced cause and correction

On both restaurants, normal hydration produced Swiper `params.speed = 450` but `originalParams.speed = 0`, inherited from the shared reduced-motion hook's conservative server snapshot. A 375 → 1440 → 375px resize restored the original parameters below 1024px. Both actual speed and the computed wrapper transition became zero. The lightbox normally initialized later with 450ms, but it also needs both values synchronized for live motion-preference changes.

Gallery now synchronizes the live/original speed together on each instance's creation and preference changes, keeping 450ms for normal motion and zero for reduced motion. Arrow handlers pass that duration explicitly; touch settling uses the corrected instance parameters. The shared preference hook and other components retain their behavior. No gallery is remounted to apply motion changes. The lightbox retains its selected photo; the strip retains valid positions, with normal Swiper clamping if a wider viewport fits every photo.

## Verification

- TypeScript, targeted ESLint, all 44 affected tests and the production build passed. Regression tests invoke the installed Swiper's actual breakpoint reset, as well as live motion changes and destroyed/null instance handling.
- Chromium verified both restaurant galleries with real read-only content. Before and after 375 → 1440 → 375px resizing, arrow transitions reported 0.45s and the photograph's transform at 100ms was strictly between the start and target positions. Each transition completed normally.
- Touch-emulated swipes in both strips and both lightboxes settled using 450ms. Lightbox selection and instance identity survived resizing. Changing reduced motion without reloading set both instances' live/original speeds to zero; arrows switched immediately. Turning it off restored smooth 450ms movement without changing the selected photo or recreating the instances.
- Centro's explicit signature photograph and alt were checked at 375 and 1440px; screenshots were inspected for the existing crop and layout.
- Physical iPhone/Safari and Android/Chrome were unavailable. Chromium touch emulation does not replace those device checks.
- No database writes, R2/media edits, schema changes, new dependencies or deployment were performed. A new build must be published separately for the production website to receive these source changes.
