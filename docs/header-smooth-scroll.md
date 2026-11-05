# Smooth Header navigation — 2026-11-05

The shared Header requests `window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })` for user-triggered internal navigation on both restaurant sites. Its existing navigation coordinator still waits for the requested pathname and for mobile menu exit presence to finish. The viewport scroll lock releases before the request. Selecting the current page or its home logo also scrolls smoothly to the top. The logo's home destination remains `/home` on PapaPasta and `/` on Centro.

The existing reduced-motion subscription selects `behavior: 'instant'` instead. Native browser smooth scrolling controls duration; no custom timer, global scroll CSS change or new animation is introduced. Back/Forward, external links, category tabs and wine-section anchors keep their current behavior.

Validation: TypeScript, Header ESLint, diff whitespace check and production build passed. Local production Chrome checks passed for both restaurants at 1440 px desktop and 375 px mobile: current-page navigation and logo interpolate scroll position; cross-page links preserve destinations and request smooth return; mobile same/cross-page return occurs after unlock; rapid destinations finish without a lock; Back/Forward receive no extra Header smooth-scroll request; reduced motion requests instant positioning. An unavailable test database was used; no working database/R2 access was needed. Physical iPhone/Safari was unavailable.

Changed files: `src/components/Header/index.tsx`, `docs/architecture.md`, this document. Deploy the application version normally; this change has no migration or configuration requirements.
