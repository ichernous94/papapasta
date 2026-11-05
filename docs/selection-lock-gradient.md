# Selection scroll lock and Centro gradient — 2026-11-05

## Changes

Restaurant-selection panels now use `overflow: clip` instead of internal scrolling. Route-scoped CSS fixes the document and suppresses overscroll before hydration. Once hydrated, the existing reference-counted viewport lock is complemented by cancelable wheel/single-finger touch guards. Ctrl+wheel browser zoom, multi-touch gestures, link activation and keyboard focus are not blocked. Layout remains two equal rows or, on desktop/low landscape, two columns with both buttons visible at the supported viewport sizes.

Next.js can retain an inactive route inside a hidden React Activity. A server-rendered `data-selection-active` marker enables the initial CSS lock; a layout-effect cleanup disables it when leaving the selection, even if its DOM remains cached. Reactivation restores the marker. This prevents the landing page's CSS from freezing restaurant pages after client navigation or Back/Forward.

The shared `--page-background-gradient` token is `radial-gradient(ellipse at 10% 15%, #405542 0%, #2b3b2e 42%, #142119 100%)`, with `#142119` as a solid fallback. Both html/body and the Centro layout use it. Centro main text is `#f3ede0`; main content sections and the footer surface are transparent, so the layout paints one continuous gradient. The copyright band, photographs, gold accents and opaque menu/header/dialog surfaces retain their own styling.

PapaPasta has an explicit light layout surface; legacy pages such as Cookie Policy also retain a light wrapper. Admin styling is unchanged. The shared gradient is only the underlying document canvas for those light pages.

This revision supersedes the previous allowance for local panel scrolling in `mobile-header-selection.md`. No application scrolling is available inside selection panels; browser-managed zoom remains enabled.

## Validation

- Production Chrome checks at 320×568, 375×667, 667×375, 900×600 and 1440×900: both links visible, no document/panel scrolling, unchanged image geometry after scrolling gestures.
- CSS locking verified with JavaScript execution disabled. Gesture checks confirmed wheel and single-finger cancellation while preserving Ctrl+wheel zoom; keyboard link focus works.
- Client navigation releases the lock; Back reactivates it and Forward releases it again, including when the inactive selection DOM remains cached.
- Centro gradient and opaque header were inspected in a screenshot. Computed styles confirmed the gradient canvas and preserved PapaPasta/Admin light surfaces.
- TypeScript, targeted ESLint, seven SCSS compilations, seven existing Centro tests and production build passed. The build used an unavailable database URL; no database, R2 or deployment configuration changed.
- Physical iPhone/Safari elastic scrolling is not verified; Chrome device emulation cannot replace that check.

## Files

Shared SCSS entry, Centro/PapaPasta layout styles, shared ContentSection/Recommendations/Footer styles, SectionHome styles/marker/scroll-lock component, architecture notes and this report.

Deploy normally; this revision adds no migration, dependency or environment setting.
