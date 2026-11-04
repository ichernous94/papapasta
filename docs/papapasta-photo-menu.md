# PapaPasta photo menu and dish cards

Implemented on 2026-11-04. No new dependencies, environment variables, database columns or migrations. Existing `0002_dish_allergens.sql` is reused; this task does not apply it to the working database. Working data, R2 contents and deployment were untouched.

## Behavior

PapaPasta menu sections and `/home` recommendations use light photo rows: image right at 600 px and above, image first below 600 px; 3:2 thumbnails. A category with photos uses one column. Plain items retain the original markup; all-plain categories retain column configuration. Recommendations resolve their own records, prices, photos and allergens.

Shared components preserve Centro's dark styling and existing URLs. PapaPasta cards use white, dark typography, Allura prices, gray descriptions and gold accents. Allergens appear only inside the modal and standalone card; empty selections omit the whole section. The admin picker remains unchanged.

Both sites resolve dish identity within an explicitly selected restaurant. Renamed slugs redirect to their current canonical. Hidden items and items without ready photos are excluded. Direct requests render server pages with title, description, canonical, social photo and MenuItem JSON-LD. Client navigation opens the accessible native dialog and preserves the menu underneath. No modal catch-all was added.

Root sitemap now contains `/`, `/home`, `/nasz-lokal`, `/menu`, `/kontakt` and published PapaPasta photo dish URLs. Robots references the correct sitemap. Centro's sitemap remains separate.

## Validation

- 23 targeted tests passed: dish identity/restaurant isolation, metadata/schema, recommendation independence, plain-markup fallback, allergens, admin unit checks and Centro host/content regressions.
- ESLint passed for changed TS/TSX; all seven changed/new SCSS modules compiled with Sass. Next route type generation passed.
- Local Chrome used an isolated migrated/seeded PostgreSQL database with 12 fixture photo dishes across both restaurants. Image requests were fulfilled from existing local assets using browser interception; no R2 operations occurred. Fixture photos are layout samples, not representations of the dishes.
- Compared screenshots at 1440, 900 and 375 px against the supplied layout: photo placement, light surface, gold tabs, dotted separators and card hierarchy. Tested three and all 14 allergens with no horizontal overflow; long-heading layout was also exercised through a temporary browser DOM change. Empty allergens are covered by rendered component tests.
- Browser: menu/recommendation opening, direct URL, reload, Back/Forward, Escape, backdrop dismissal, focus and scroll restoration passed. Both themes were opened. Papa canonical and social image, MenuItem JSON-LD, 308 rename redirect, cross-restaurant 404, sitemap and robots were verified over local HTTP.
- Whole-project TypeScript still fails in unrelated legacy product/cart components: missing IProduct, IDropdown, ProductDescription, getProductById, useCartStore/useSearchMenuStore and HeaderActions typing. No errors were reported in this feature.
- Production webpack build remains blocked by pre-existing duplicate `sass:math` imports in CookiePolicy, Product, Cookie and GoTopBtn styles and the missing legacy ProductDescription module. The previous invalid sitemap revalidate configuration was removed as part of this feature. Build log: `/tmp/papapasta-photo-build.log`; TypeScript log: `/tmp/papapasta-photo-tsc.log`.

## Changed files

- New shared components (replacing the three Centro-prefixed directories): `src/components/DishRow/{index.tsx,DishRow.module.scss}`, `DishCard/{index.tsx,DishCard.module.scss}`, `DishOverlay/{index.tsx,DishOverlay.module.scss}`.
- New shared server helpers (replacing Centro-prefixed helpers): `src/server/content/dishes.ts`, `dish-page.ts`.
- Papa routes: `src/app/(papapasta)/layout.tsx`, `PapaPasta.module.scss`, `menu/page.tsx`, new `menu/[slug]/{page.tsx,DishPage.module.scss}`; new `@dish/default.tsx`, `@dish/home/page.tsx`, `@dish/menu/page.tsx`, `@dish/(.)menu/[slug]/page.tsx`.
- Centro adapters: `src/app/(centro)/site-centro/menu/[slug]/page.tsx`, `@dish/(.)menu/[slug]/page.tsx`, `sitemap.ts`.
- Shared consumers/styles: `src/components/MenuList/index.tsx`, `Recommendations/index.tsx`, `MenuTabs/{index.tsx,MenuTabs.module.scss}`, `Header/index.tsx`, `AllergenList/AllergenList.module.scss`.
- SEO: `src/app/sitemap.ts`, `src/app/robots.ts`.
- Tests: `tests/centro-dishes.test.tsx`, `tests/allergens.test.tsx`.
- Documentation: this report, `docs/architecture.md`, `docs/centro-photo-menu.md`, `docs/allergens.md`.

## Running after deployment approval

Deploy application code through the normal process; no new migration command is required for this feature. In a configured environment, run the existing project dev command and open `/menu` or `/home` on the PapaPasta host. Only dishes with an assigned ready photo open cards. Verify a direct dish URL and `/sitemap.xml` on each domain. Production deployment is outside this change.
