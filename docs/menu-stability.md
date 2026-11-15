# Menu scrolling, dish dialogs and banner loading — 2026-11-16

## Causes and changes

Both restaurants share the affected presentation components. Before the change, a rapid upward scroll left the menu panel clipped by 765px until its animation-frame callback caught up to the required 65px. The same hook reacted to all focus changes, including pointer activation and dialog focus restoration; a real pointer activation reproduced a 74px document jump before the dish opened.

Transparent category bars remain. `usePanelClip` selects native view-timeline clipping when both timeline and crossing-range syntax are supported. Header/bar measurements update on geometry changes, while CSS follows scrolling. The animation ends at the same clipping limit as the outgoing sticky bar, preserving its trailing gap at the end of each section and during temporary category height guards. Older browsers update their existing clip immediately in the scroll event rather than adding another animation frame. The reveal-on-focus correction now requires a fresh Tab event and does not run while a dialog is open. Pointer and programmatic focus do not request document scrolling. Existing category transitions, immutable fragments and dish history restoration remain.

The inherited dialog's auto overflow also allowed a 20px internal scroll at 375×568. Dish dialogs now have a stable frame bounded by `100dvh - 2rem`, capped at 42rem below 600px and 32rem above. The actual card and its skeleton share that geometry. Mobile image/text rows divide the available height 40/60; wide layouts retain columns. Only the text region scrolls, with its title, price, descriptions and allergens available to touch and keyboard users. It has no forced 15rem minimum inside the overlay. The image, frame and backdrop do not scroll. A scoped gesture guard lasts through exit presence, allows movement only in a text region that can consume it, and preserves multi-touch/ctrl-wheel zoom. Standalone dish pages and other modals retain their normal layout/scrolling.

MenuBanner previously rendered its versioned default photograph in the Suspense fallback, before resolving the possible administrator-selected photograph. Its loading state now contains only a neutral, dimensioned placeholder and the existing section/QR targets. It emits no image or image preload. After the read resolves, the saved image or the genuine default is rendered once. No data/cache/deployment settings change.

## Other page image sources

- Both `/menu` pages share this fix for main, children and drink banners. PapaPasta retains the `#kartawin` alias.
- PapaPasta `/home`, Centro `/`, and both `/nasz-lokal` pages use explicit static content images; home videos use their own native posters. They do not substitute a default content photograph after a database response.
- Centro `/cocktail-bar` and `/promocje` use fixed banner images. Promotion details and `/zestawy-obiadowe` use the same fixed article banner before/after streaming; article photographs wait behind their own loading placeholders.
- Contact pages have no substituting photographic hero. Database galleries wait behind an empty reserved area; PapaPasta's venue grid is static. Neither uses an unrelated provisional photograph.

## Verification

Verification is performed against the local production build with read-only restaurant content. Synthetic long descriptions are inserted only into the test browser DOM; no database or media objects are modified. Verified:

- Production build, TypeScript, targeted ESLint and 24 component/unit tests passed, including a regression check that pending menu banners preserve QR targets without images/preloads.
- Both restaurant dish overlays passed at 320×568, 375×812, 430×932, 812×375 and 1440×900. Mobile tests included a 120px difference between small and dynamic viewport heights. Dialog scrollHeight matched clientHeight; image/backdrop gestures and text-edge gestures did not move the document or dialog.
- Synthetic long text scrolled only inside its region. Closing kept the document locked through the 280ms exit and restored the original position and ordinary scrolling. Mobile and desktop screenshots were inspected.
- Native and forced fallback clipping matched the sticky bar geometry within 0.5px, including rapid direction changes and section ends. Real pointer activation of partly clipped dishes, closing, programmatic focus return and fresh Tab navigation passed for both restaurants without intermediate document jumps.
- Both restaurants passed cold/warm-cache opening, Escape/backdrop dismissal, Back/Forward reopening, category selection and direct QR fragments, viewport rotation while open, native pinch zoom and reduced-motion dismissal.

The blocked-image browser test also passed: failed photographs released the loading state and left the text and close control usable.

Physical iPhone/Safari and Android checks remain necessary. No deployment is included.
