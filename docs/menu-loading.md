# Menu and recommendation loading

Implemented 2026-11-04 for both restaurants. No new dependencies, migrations, environment variables or deployment steps.

## Behavior

Static menu page content is outside the database wait: banner photographs, introductory text, ordering links and galleries render immediately. Section lists have their own Suspense boundary. Header keeps its existing pathname boundary and renders while the database is pending.

`MenuSkeleton` is a Server Component accepting `restaurantId`, optional `showTabs` (default true), and `rows` (default four). The recommendation variant uses three rows without tabs. It matches the photo rows: 3:2 image right at 600 px and above, above text on smaller screens; dotted separators and light/dark colors follow the restaurant. One Polish status message describes loading, while placeholder graphics are hidden from assistive technology. Shimmer is disabled for reduced motion.

Banner images remain static. Banner heading boundaries initially show the versioned heading copy in `menu-headings.ts`, then use saved menu title/subtitle, including intentional empty subtitles. Recommendations likewise retain an immediately visible heading/frame and stream their saved heading and list independently. These defaults contain no dish data and are checked against seed headings by a test.

`publicMenuState` wraps the existing cached `publicMenus` read with per-render React memoization. Recoverable failures become a local error result outside persistent cache; Next redirects/control-flow errors are rethrown. Selection remains explicitly restaurant-specific. The existing cache tags and admin invalidation are unchanged.

Missing menus/sections, empty categories or hidden-only items show `Menu jest obecnie niedostępne.` Empty recommendations show `Obecnie brak rekomendacji.` Read errors show `Nie udało się załadować menu.` with `Spróbuj ponownie`. Retry disables the button during a single router refresh transition; there are no timers or automatic retries. Errors do not replace the static page. Technical error details and old static dishes are never displayed as fallback.

## Verification

- 28 tests passed: five new loading tests plus existing dish, allergen, admin unit and Centro regression suites. New checks cover both skeleton variants/accessibility, missing and hidden-only data, restaurant isolation, edited headings, retryable errors, preserved Next redirects, seed heading consistency and streaming the static shell before delayed data.
- Local Chrome checks used an isolated migrated/seeded PostgreSQL database. A temporary table lock delayed real reads; skeletons were visible alongside banner headings/images and Header. Releasing a bounded lock replaced placeholders with real tabs/dishes on both sites without changing document time origin.
- Compared skeleton screenshots with the supplied layout at 1440, 900 and 375 px for both themes: tabs, dotted rules, photo position and text placeholders. No horizontal overflow. Reduced-motion emulation reported no animation. Example artifacts: `/tmp/menu-skeleton-papapasta-1440.png`, `/tmp/menu-skeleton-centro-375.png` and corresponding 900 px/other-theme files.
- A temporary table rename simulated read failure exclusively in the test database. Both menu pages kept their banners with four local error messages; both home pages retained recommendation headings with local errors. Restoring the table and pressing Retry recovered a recommendation list and an edited saved heading without reloading the document.
- Verified missing PapaPasta main section, hidden-only Centro main section and empty recommendations on both sites. A delayed PapaPasta home request showed its three-row recommendation skeleton; shared three-row markup is tested for both restaurant themes. Empty-source behavior is covered by the load-state test.
- ESLint passed for changed TS/TSX. New SCSS modules compile. Whole-project TypeScript reports only existing legacy product/cart errors: missing IProduct/IDropdown, ProductDescription/getProductById, cart/search stores and HeaderActions typing.
- Production webpack build is blocked by the existing duplicate `sass:math` imports in CookiePolicy, Product, Cookie and GoTopBtn styles, plus missing legacy ProductDescription. No new skeleton/menu module is listed in those build errors. Logs: `/tmp/menu-skeleton-build.log`, `/tmp/menu-skeleton-tsc.log`.

The browser tests touched only the temporary database. R2 photo requests used local browser interception. Working database, R2 objects and deployment were untouched. Temporary development processes and database are removed after verification.

## Changed files in this extension

- New components: `MenuSkeleton/{index.tsx,MenuSkeleton.module.scss}`, `MenuState/{index.tsx,MenuState.module.scss}`, `MenuBanner/index.tsx`, `DatabaseMenuSection/index.tsx` under `src/components/`.
- New data/copy helpers: `src/server/content/menu-state.ts`, `src/config/menu-headings.ts`; updated `src/server/content/public.ts`.
- Both restaurants' `menu/page.tsx`; Centro home `src/app/(centro)/site-centro/page.tsx`; PapaPasta recommendation adapter.
- Shared `ImageBanner/index.tsx`, `Recommendations/index.tsx`, `DatabaseRecommendations/index.tsx`.
- `tests/menu-loading.test.tsx`, `docs/architecture.md` and this report.
