# Compact header and fixed restaurant selection — 2026-11-05

Later update: [selection-lock-gradient.md](selection-lock-gradient.md) supersedes local selection-panel scrolling with a strict scroll lock.

## Behavior

Below 768 CSS px, both headers keep their existing telephone strip. Centro places its 4.5rem logo on the left and the burger on the right. PapaPasta uses equal 3rem side columns to keep its logo geometrically centered; its former `min(70vw, 17rem)` width is reduced by 15% to `min(59.5vw, 14.45rem)`. The burger remains 48×48 px. Layouts at 768 px and above are unchanged.

Menu panel and backdrop now use 350 ms ease-in-out transitions, coordinated with the React exit-presence lifetime through a header CSS variable. Opacity and a small vertical translation replace clip-path keyframes. `@starting-style` provides the initial opening state; reversing a transition continues from its current value. Escape, focus containment/restoration, scrolling lock and navigation behavior remain intact. Reduced motion removes transitions and bypasses the closing-presence delay.

The root restaurant selection is fixed to a stable 100svh viewport. Panels use two equal rows below 1024 px and two columns above, with columns also used in landscape below 500 px height. Fixed panel minimum heights are removed. Safe-area padding and compact low-height spacing keep both buttons visible. Each panel can scroll locally when text is enlarged; browser zoom is not disabled. A small client component applies the existing reference-counted viewport lock only while the selection is mounted, restoring normal restaurant-page scrolling on navigation.

## Verification

- Production Chrome screenshots were inspected at 320×568, 375×667, 667×375, 900×600 and 1440×900: both selection links are visible, document and panels have no ordinary scrolling range, and synthesized scroll gestures leave the document stationary.
- A 200% text-size check kept the selected link reachable through local panel scrolling. SPA navigation to `/home` released the root scroll lock.
- Both headers passed geometry/overflow checks at 320, 375, 767 and 768 px. Centro was 72 px wide below the breakpoint; PapaPasta's logo center matched the viewport center. Controls were vertically aligned with 48×48 px toggle targets.
- Opening opacity was measured mid-transition. Panel duration was 350 ms; rapid close/open preserved the current opacity, focus and scroll lock. Escape restored focus/scroll; reduced motion had neither a CSS transition nor a close delay.
- TypeScript, targeted ESLint, three Sass compilations, seven existing Centro tests and production build passed. Build completed all 36 static pages with the database unavailable. Expected DB connection errors during the `/home` scroll-restoration check came from the deliberately unavailable test source; no database was accessed or modified.
- Real iPhone/Safari and native address-bar movement were unavailable. No claim of physical-device validation is made.

## Changed files and delivery

`Header/index.tsx`, `Header/Header.module.scss`, `BurgerMenu/BurgerMenu.module.scss`, `SectionHome/index.tsx`, `SectionHome/SectionHome.module.scss`, new `SectionHome/SelectionScrollLock.tsx`, architecture notes and this report.

Deploy the application normally. This change requires no migration, dependency, environment, R2 or infrastructure change. Earlier uncommitted section-management work remains preserved.
