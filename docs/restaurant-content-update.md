# Restaurant content and theme update — 2026-11-09

## Implemented behavior

- Both public restaurant layouts use the existing Centro radial gradient, light text, gold accents and dark dish/modal surfaces. PapaPasta's horizontal wordmark has a light SVG variant with its original proportions and tricolor bars; footer uses its existing light wordmark. Admin remains independent.
- Home recommendation blocks are omitted for both restaurants. All recommendation records, prices, photo URLs and editor controls are retained.
- Selection panels use one stretched semantic link per restaurant, including photo, logo and button appearance. Existing local/temporary/production destinations and viewport locking remain intact.
- Video sets muted/defaultMuted/playsInline before playback, retries when ready/visible and after tab return, and handles rejected playback. Manual play/pause, poster, reduced motion and Save-Data remain supported. The browser may still block autoplay; physical iOS/Android checks are required.
- Both Kontakt pages share phone/email information, PapaPasta reservation information and the centered social/map/address/directions layout. Existing contact details and Google Maps embeds are preserved.
- `menuText()` removes currency suffixes attached to amounts in displayed menu prices, descriptions, category/group notes and dish details. Stored data, structured-data currency, promotional article prices and embedded image/PNG artwork are unchanged.
- The bottom gallery is a Swiper carousel with 4 slides from 1024px and 2 below, arrows/swipe, bounded navigation, no autoplay and the existing lightbox. The standalone PapaPasta venue photo grid is retained.

## Administration and persistence

- Categories have transactional up/down movement inside their section, using the existing menu version lock, audit and restaurant invalidation.
- Three independent optional input flags (`meatless`, `recommended`, `spicy`) are stored as non-null booleans defaulting to false. An omitted flag preserves the prior value; explicit false clears it. Flags are separate from the 14 allergens and appear in photo/text menu rows and both dish cards with Polish accessible labels.
- `/promotion` is Centro-only. Promotions have a stable generated slug, image/alt, date, paragraph/heading/list blocks, published flag and optimistic version. Published entries need image and nonempty body. Lists sort by date descending. The existing lunch promotion is initialized with its original content/date and `/zestawy-obiadowe` URL; new entries use `/promocje/[slug]`. The nested legacy URL redirects to the original URL. Draft/deleted articles are unavailable publicly and absent from sitemap.
- `/gallery` switches between restaurants. Each restaurant has one shared photo collection with alt text, visibility, order and a parent version lock. New uploads and replacements use existing JPEG/PNG/WebP validation, Sharp processing and R2; existing static photographs work without R2.
- Additive migration `0004_restaurant_content` adds the flags and the `promotions`, `restaurant_galleries`, `gallery_entries` tables. The Drizzle snapshot/journal match the schema.
- `seedContent()` initializes new content once, when creating the persistent restaurant-gallery parent. Existing local photographs are referenced using versioned metadata, without uploading them to R2. Subsequent seeds preserve edits and do not recreate deleted photos/articles, including intentionally empty galleries. This initialization runs in a transaction and is safe under concurrent seed calls.
- Shared media attachment requires a pending upload owned by the administrator. All detach/failure paths and cleanup inspect dishes, menu banners, promotions and gallery references under the media-row lock. Text edits remain available without image storage. Administrator/MFA checks are repeated after upload; auth configuration is unchanged.
- Public reads await request-time `connection()` outside tagged caches. Gallery saves invalidate the selected restaurant layout/tag; promotion saves invalidate listing/details/lunch/sitemap. Public database data is not required at build time.

## Release procedure

Working database, environment, DNS, R2 objects and deployment were not changed.

1. Apply checked-in migrations to the intended database with the existing `db:migrate` workflow.
2. Run `db:seed` once after migration to initialize the existing photo collections and Centro lunch promotion. Repeat runs preserve this new content.
3. Deploy the updated application with the existing build/deployment process. Migration and seed should precede serving this code.

No dependency or environment-variable changes are required. If the package-manager shim cannot verify/download the pinned pnpm release in an offline environment, the installed entrypoints can run the same checks: `node node_modules/typescript/bin/tsc --noEmit --incremental false`, `node --import tsx scripts/test-admin.ts`, and `node node_modules/next/dist/bin/next build`.

## Validation

- TypeScript, targeted ESLint, focused unit/SSR/routing tests and default Turbopack production build are run for this revision.
- Admin integration tests use a separate temporary PostgreSQL server/database. They cover upgrades preserving data, fresh snapshot alignment, category movement, independent flags, publication/drafts, stable slugs, invalid dates, photo visibility/order/upload ownership, optimistic conflicts, shared-media retention and repeated seed after deletion.
- Browser QA uses local restaurant/admin hosts and a separate disposable fixture. Responsive screenshots and functional findings are recorded in the completion report. Physical iPhone/Safari and Android/Chrome and live R2 uploads are not validated by desktop emulation.

### Final results

- TypeScript and targeted ESLint: pass; `git diff --check`: pass.
- Focused unit/SSR/routing suite: 49/49 pass. Admin suite: 12/12 pass, including five PostgreSQL integration scenarios on a separately initialized temporary server. The test databases are disposable; working data was not used.
- Default Turbopack production build: compilation, TypeScript and all 39 static/partial shells pass with an intentionally unavailable database URL.
- Production HTTP smoke: 17 checks pass across both restaurant hosts, the existing Cookie Policy, admin access guards/noindex, both sitemaps, legacy/new article URLs and technical-route protection. Legacy light-layout logos remain unchanged.
- Chrome responsive checks: both contact pages at 320, 375, 768 and 1440px, dark theme, map/button fit and no horizontal overflow; menu currency removal and all three badges; full-photo selection links; automatic muted video and manual pause/play; carousel arrows, image viewer, close/scroll restoration; form-based draft creation, gallery editing and category ordering; public gallery cache updates.
- Promotion browser checks: unpublish removes list/detail/sitemap exposure; publish restores the existing URL; safe literal article text, heading/list blocks, new-route canonical and published-only sitemap pass. Carousel navigation correctly disables when four photos fit and re-enables on mobile resize.
- Clean production Chrome input checks: touch swipe, Enter on a focused arrow, keyboard ArrowRight and native Escape all pass. Escape restores the opener focus and document scrolling.
- Verification artifacts are local under `/private/tmp/papapasta-refresh-*` (logs and responsive screenshots). Temporary fixture photos were removed from the repository; the automatically generated Next.js instruction-file addition was also removed.
- Physical iPhone/Safari, physical Android/Chrome and actual R2 uploads remain unverified. No working database migration, production seeding or deployment was performed.
