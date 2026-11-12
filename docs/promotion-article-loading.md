# Full promotion article Skeleton — 2026-11-12

Centro's `/zestawy-obiadowe` and `/promocje/[slug]` now render a full article loading shell. The fallback reserves the shared banner, text container, back link, image and representative title/date/paragraph/action placeholders. Its image ratio and article length are estimates until data arrives. Actual content stays in normal flow behind a decorative Skeleton, preserving exact geometry during photograph loading.

The article uses the existing shared image-readiness hook: decoding plus a minimum 250ms first-view interval, followed by a 350ms whole-content fade. Its photo uses Next Image directly without the independent PhotoImage blur. The banner, back link and separately streamed lower gallery remain outside this loading effect. Pending article content is inert; errors release it, reduced motion removes delay/transitions, seen decoded sources avoid repeated delay, and the no-JS stylesheet exposes readable content. A zero intersection threshold prevents very tall articles from waiting for an unattainable visible percentage.

Cocktail Bar's text-to-book gap is now `clamp(2rem, 6vw, 5rem)` (32–80px), replacing 80–192px. The intro's existing top padding and other pages' spacing remain unchanged.

## Verification

- TypeScript without emitting files, targeted ESLint, 42 affected component/unit tests, and the final production build passed.
- Chromium checks covered 320, 375, 599, 768, 1024 and 1440px. Article layouts had no horizontal overflow. Cocktail gaps were 32, 32, 35.94, 46.08, 61.44 and 80px respectively.
- A temporary local UI fixture delayed server data and held image responses. Its article was longer than ten screens. The full loading shell rendered first, the photo-loading phase held article content together, article/image dimensions stayed stable through decoding, and the article then became visible as a unit without an additional blur.
- Image failure, reduced motion, no-JS readability and a repeat visit from the promotions list were checked. The real lunch article was also viewed using read-only requests to the connected database, retaining its banner, back link, text/date and phone action. Screenshots of loading/loaded states and compact cocktail spacing were inspected.
- The temporary UI fixture was removed before the final production build. No database writes, media changes, dependencies, configuration changes or deployment were performed.
- Physical iPhone/Safari and Android/Chrome were unavailable and remain unverified.
