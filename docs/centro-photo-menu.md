# Centro photo menu and dish cards

The Centro menu and homepage recommendations now use a shared photograph row when an item has an uploaded image. Desktop/tablet place a 3:2 photo on the right; mobile below 600px places it above the title, portion, price and description. Centro category tabs have a gold active underline. Items without images keep the previous markup, and PapaPasta keeps its original rendering/photo viewer.

Clicking a photo dish opens a Centro-themed native dialog and changes the URL. Direct navigation or reload renders the same information as a standalone SSR page with a return-to-menu link. Cards reuse real database content and independent recommendation prices; no photo, price or dish copy from the illustrative screenshot is inserted into working data.

## URLs and SEO

- `/menu/<dish-name>-<stable-id-hash>` distinguishes duplicate names without database migrations. The suffix is a 12-character SHA-256 digest of the existing item ID. A renamed dish redirects to its current name using the stable suffix.
- Only visible Centro records with a ready/public image receive links and sitemap entries. Unknown, hidden, deleted and photo-free records resolve through Next's `notFound()` and are not indexable. With streamed responses Next can return HTTP 200 plus noindex; blocking crawlers receive HTTP 404. Canonical renames return HTTP 308 to blocking crawlers.
- Each dish has server metadata: title, description, canonical, Open Graph and large Twitter image. Direct pages emit escaped `MenuItem` JSON-LD. Only simple numeric prices become PLN Offers; display labels/ranges remain unchanged.
- Native modal navigation preserves the source page/category/scroll/focus and supports Back/Forward/Escape/backdrop/close. Explicit default/home/menu slots avoid a broad catch-all that would conflict with Centro sitemap/robots routes. Detail prefetch is disabled so a long photographed menu does not request every modal route in advance.

## Changed files

- Added components: `CentroDishRow`, `CentroDishCard`, `CentroDishOverlay`, each with colocated SCSS under `src/components/`.
- Updated presentation: `MenuList`, `Recommendations`, `DatabaseRecommendations`, `MenuTabs`; `Header` keeps Centro's menu section active on detail URLs. `JsonLd` escapes `<` in database text.
- Added data/SEO helpers: `src/server/content/centro-dishes.ts`, `src/server/content/centro-dish-page.ts`.
- Centro routes: `menu/page.tsx`, new `menu/[slug]/page.tsx` and `DishPage.module.scss`, `@dish/default.tsx`, `@dish/page.tsx`, `@dish/menu/page.tsx`, `@dish/(.)menu/[slug]/page.tsx`, plus `layout.tsx`, `Centro.module.scss`, `sitemap.ts` under `src/app/(centro)/site-centro/`.
- Tests: `tests/centro-dishes.test.tsx`, `tests/helpers/register-styles.cjs`. Updated architecture notes and this report.

The temporary preview processes were stopped and the synthetic database was removed after verification.

No dependencies, database schema, real bucket contents, secrets or deployment configuration changed. Existing unrelated worktree changes were preserved.

## Validation

- Five focused tests cover readable/distinct/rename-safe URLs, published-photo filtering, metadata and schema pricing, safe JSON-LD, exact markup preservation without photos and PapaPasta's existing viewer.
- Together with existing admin unit and Centro regression tests: 18 tests passed.
- Targeted ESLint and SCSS compilation passed. Repository-wide TypeScript reports only the existing product/cart/search/Dropdown errors outside this change.
- The production build passes the new parallel-route structure validation, then fails on existing duplicate `sass:math` imports and the missing legacy `ProductDescription` module. A full successful build is not claimed. The unrelated main-domain sitemap also retains its existing Cache Components/configuration issue.
- Browser review uses an isolated disposable PostgreSQL database with synthetic image attachments. Only test browser requests for the fake image domain are fulfilled from local fixture photos. Real R2 uploads and working data are not modified.
- Checked the 1440px desktop layout and 900px/375px menu/dialog layouts: no document or dialog horizontal overflow. Compared screenshots with the supplied visual references; existing Centro palette/fonts/wordmark are retained.
- Verified URL/title/canonical updates on modal open, Escape/focus/scroll restoration, Forward reopening, direct SSR page with Open Graph and MenuItem JSON-LD, and opening a recommendation's own URL. Centro sitemap returned six fixture dish entries; canonical-name redirect returned 308 and unknown URLs included noindex (404 for blocking crawlers).

## Using the feature

Upload an image to the relevant Centro dish through Add/Edit Dish in the admin panel. The new layout and detail URL appear automatically after saving. Recommendations are separate records: upload their images independently. Removing an image restores that item's text-only presentation and removes its detail URL from the current sitemap. No new migration is needed for this feature.

Shared implementation update (2026-11-04): Centro dish components and server helpers were moved to `DishRow`, `DishCard`, `DishOverlay`, `server/content/dishes.ts` and `dish-page.ts` when adding the PapaPasta light theme. See [PapaPasta photo menu](papapasta-photo-menu.md); historical verification above remains unchanged.
