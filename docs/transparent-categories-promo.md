# Transparent Centro categories and smoother promo — 2026-11-05

Later revision: [category-switching.md](category-switching.md) adds intentional page return and panel fading on category selection; clipping and sticky boundaries remain.

## Centro background

The approved theme was already configured and is retained: `radial-gradient(ellipse at 10% 15%, #405542 0%, #2b3b2e 42%, #142119 100%)`, text `#f3ede0`, fallback `#142119`. Page/document and dish-card surfaces continue using the shared token. Main sections remain transparent; Header/navigation remain opaque. No photographs, poster or gold accents were changed; PapaPasta/Admin retain light themes.

## PromotionalPopup

Opening now uses 600 ms and closing 450 ms ease-in-out opacity transitions for both dialog and backdrop. Scaling/keyframes are overridden only by the promo stylesheet. A close during opening reverses from the current opacity rather than restarting from a keyframe. The existing Modal exit presence receives the same closing duration; the body stays locked until the close lifecycle completes. Opening duration stays 600 ms even during the initial reduced-motion server snapshot, while the CSS media query synchronously disables motion for users who prefer it. Reduced-motion closing uses a zero duration. Other Modal callers retain their prior timings and behavior.

Native dialog, poster dimensions, focus, Escape/backdrop/close dismissal and layout-owned display state are retained. No storage or delayed-show timer is introduced.

## Transparent categories

Centro's MenuTabs now progressively enhances its active panel with `usePanelClip`. An initial layout calculation sets `--menu-panel-clip-top = clamp(bar.bottom - panel.top, 0, panel.height)` and marks the component ready. The active panel then uses clip-path and its sticky category bar becomes transparent, showing the real underlying page gradient. Content is clipped rather than repainted behind the tabs.

Scroll/viewport events, active-category changes, panel/bar resizing and the Header height published on html all update the measurement. At most one animation frame is pending and scroll updates do not set React state. Observers, listeners, ready state and CSS properties are cleaned up when the panel changes or React Activity hides the tree, then reinitialized on return. Unsupported clip-path/ResizeObserver and no-JS HTML keep the opaque gradient fallback.

Focus entering clipped content is corrected below the greater of Header height and category-bar bottom, plus 8 px, after native focus scrolling. Screen-reader content remains present. This does not introduce page scrolling on tab selection. Horizontal category scrolling, vertical document scrolling and the end-of-section sticky boundary remain intact. PapaPasta does not enable clipping.

## Verification

- Real production promo measured at 600 ms open / 450 ms close, with a measured close lifecycle around 456 ms. Opacity samples confirmed intermediate values, identical backdrop/dialog progression, no transform and stable poster dimensions.
- Close during opening retained the current opacity. Close button, Escape, backdrop, scroll restoration and reduced-motion zero-delay closing passed in Chrome.
- Actual MenuTabs/clip-hook browser fixtures under the production Header passed on 375, 768 and 1440 px: exact clip geometry, transparent Centro bar, unchanged PapaPasta, section boundaries and independent next menus.
- Focus correction, content growth/ResizeObserver, changed Header CSS height, fast scrolling, horizontal/vertical touch gestures, bounded short-panel clipping, React Activity cleanup/restoration and no-JS opaque fallback passed. Screenshots were inspected for continuous background and absence of overlapping text. Activity cycles model the lifecycle used by cached Back/Forward routes; database-backed menu navigation was not needed for these checks.
- TypeScript, targeted ESLint, two SCSS compilations, 15 menu/card/allergen tests, seven Centro tests and production build passed. Build used an unavailable test database and generated all 36 static pages.
- Physical iPhone/Safari was unavailable. Fixtures supply test menu content; no working database, R2 object or deployment setting was changed. The previously reported server menu-read error is outside this styling change.

Changed areas: MenuTabs component/styles/new colocated clip hook, PromotionalPopup component/styles, this report and architecture notes. Normal redeploy only; no migration, API, URL, dependency or environment changes.
