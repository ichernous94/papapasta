# Compact public interface — 2026-11-10

Both restaurants retain the shared dark Centro canvas. Kontakt spacing and mobile Header logos are smaller; PapaPasta category dividers now match Centro.

Burger navigation keeps the existing root overflow lock until closing finishes. A gesture guard prevents background wheel and single-touch scrolling, permitting only movement that the overflowing navigation list can consume. Header itself does not become a second scroll container on low screens. Body remains unfixed so sticky Header continues to work. Existing focus containment, Escape, restoration and overlay lock counting remain.

The Cocktail Bar reader retains the 14 existing images, page flip, arrows, counter and keyboard navigation. Reader/page surfaces are transparent. Zoom, thumbnails, fullscreen and the extra image-link list are removed along with their state and handlers. The viewport clips without nested scrolling; normal wheel and vertical touch gestures scroll the document. Pointer-based horizontal touch recognition avoids the library's short swipe timer; the library still animates the page turn, while vertical gestures keep native panning. Import/decode failure falls back to the current image with working bounded arrows/counter.

PublicFocusBoundary tracks pointer/touch versus keyboard input on public layouts and selection. Keyboard navigation uses a thin light focus indicator through a scoped CSS token. Pointer interaction and automatic focus do not show gold rectangles; dish headings never show an outline. Shared controls retain their prior fallback styles in admin. Decorative borders remain intact.

Video posters remain available up to 1024px. From 1025px they are hidden by CSS from first paint and are lazy rather than unconditionally preloaded. Desktop starts with the existing dark background, logo and playback control. Video loading, muted autoplay attempts, manual play/pause, offscreen pause, reduced motion and save-data behavior remain.

No migrations or deployment are part of this change. No connected database writes are required.

## Validation

Validation results are recorded below after running the checks. Physical iPhone/Safari and Android/Chrome are unavailable in this environment; touch emulation cannot confirm those browsers' autoplay and scrolling policies.

- TypeScript (`tsc --noEmit --incremental false`), targeted ESLint and all 28 affected SSR/unit tests passed.
- Production build passed with an unavailable dummy database URL, confirming no build-time dependency on connected menu data.
- Local production Chromium checks covered both restaurants at 320, 375, 768 and 1440px, the 4/2/1 contact grid, dark canvas, mobile logo dimensions, muted category separators and 260px-high burger navigation. Wheel and CDP touch checks covered background locking, list-only overflow, closing presence, Escape and restored document scrolling.
- Pointer/autofocus produced no outlines; first Tab on selection and subsequent keyboard navigation produced light outlines. Direct Pizza QR fragments restored the category without an automatic outline.
- Cocktail checks covered transparent surfaces, exactly two controls, actual counter changes, bounded Home/End navigation and forced library-chunk failure with functioning fallback image arrows/counter.
- Cold-cache/reduced-motion checks confirmed poster visibility at 375/1024px and hiding from 1025px. Video tests simulated autoplay refusal with native autoplay suppressed, verified muted inline attempts, manual playback and persistent manual pause at 375/1440px on both sites; simulated save-data prevented automatic video source loading. A poster image reused elsewhere in page content may still be requested by that content; there is no unconditional hero poster preload.
- These browser tests use Chromium emulation, not physical iPhone/Safari or Android/Chrome. Native device gesture/autoplay behavior remains a manual release check. No deployment or connected database mutation was performed.
- Final book checks at 320/375/768/1440px confirmed wheel scrolling directly over the card and no horizontal document overflow. CDP gestures over the visible card confirmed native vertical panning and exactly one page per slow horizontal swipe, including reduced motion. Desktop screenshots of both home heroes confirmed a dark canvas/logo without the poster; the popup's separate preload remains unaffected.
