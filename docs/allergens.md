# Dish allergens — 2026-11-04

Added a shared catalog of 14 allergen categories with stable IDs, English admin labels, Polish public labels and outline SVG icons. Peanuts and tree nuts are separate. The Add/Edit Dish form exposes a native checkbox group under Additional details for both restaurants. No values are automatically inferred or assigned to existing dishes.

Centro's existing dish card renders the selection below the description, separated by a thin line, with the gold Alergeny heading, circular icons and readable Polish captions. The modal and standalone page reuse the same component. Empty selections omit the whole block and do not claim a dish is allergen-free. Menu/recommendation rows and PapaPasta public rendering stay unchanged. Recommendations retain independent selections.

## Changed files

- Catalog: new `src/config/allergens.ts`.
- Icons/public UI: new `src/components/AllergenIcon/index.tsx`, `src/components/AllergenList/index.tsx`, `src/components/AllergenList/AllergenList.module.scss`; updated `src/components/CentroDishCard/index.tsx`.
- Admin UI: new `src/components/Admin/AllergenPicker/index.tsx` and `AllergenPicker.module.scss`; updated `src/components/Admin/MenuEditor.tsx`.
- Data: `src/server/db/schema/content.ts`, `src/server/content/read.ts`, `src/server/content/write.ts`, `src/validation/admin.ts`, `src/types/menu.ts`, `src/types/admin.ts`.
- Migration: new `drizzle/0002_dish_allergens.sql`, `drizzle/meta/0002_snapshot.json`; updated `drizzle/meta/_journal.json`. Earlier migrations/snapshots are unchanged.
- Tests: new `tests/allergens.test.tsx`; updated `tests/admin/integration.test.ts`, `tests/centro-dishes.test.tsx`.
- Documentation: `docs/architecture.md`, `docs/admin.md`, this report.

## Data behavior

`public.menu_items.allergens` is `text[] NOT NULL DEFAULT '{}'`. The input schema accepts known IDs only and deduplicates them into catalog order. Absent fields preserve the current selection for old clients; explicit empty arrays clear it. Existing transactional menu-version checks, admin/MFA authorization, audit entries and cache tags are reused.

## Verification

- Four new focused tests: known IDs/peanut distinction/normalization/old input compatibility, empty public output and accessible captions, restored admin selections, shared modal/standalone card output.
- Existing and new unit/SSR suites: 15 passed. Existing Centro regression suite: 7 passed.
- Disposable PostgreSQL integration run: 8 passed, including the six admin unit tests also listed above. Integration specifically exercised 0000→0001→0002 with existing public menu rows, repeat migration, fresh installation, current Drizzle snapshot alignment, create/update/clear, omission preservation, invalid IDs, stale-version rejection and recommendation independence.
- Browser used only a temporary database and synthetic account. Verified creating a dish with three allergens, reopening it with the same checks, clearing/reopening, editing an existing Centro dish, and seeing three allergens in its modal and direct page. Native Space toggled the checkbox successfully.
- Reviewed screenshots at 1440, 900 and 375 px for three selected categories and all 14, including the long sulphites caption. No horizontal page overflow. Clearing the selection removed the public heading, divider and icons.
- Targeted ESLint, allergen SCSS compilation and `git diff --check` passed. Repository-wide TypeScript has the known errors in legacy product/cart/search/Dropdown modules, with no new diagnostics in the allergen implementation.
- Production build failed on existing duplicate `sass:math` imports in CookiePolicy, Product, Cookie and GoTopBtn styles and the missing `ProductDescription` module. No successful full build is claimed.

No dependencies, working data, R2 objects, credentials or environment configuration were changed. Temporary preview processes and test data are removed after verification.

## Applying to the working database

1. Back up the working database and verify the application's existing DATABASE_URL points to the intended database.
2. From `client`, run `pnpm db:migrate`. Drizzle applies pending migrations only, including `0002_dish_allergens`. Do not rerun old SQL manually or use `drizzle-kit push`.
3. Start/redeploy the updated application after the migration. It requires the new column for menu reads. The 0002 addition is compatible with the preceding application version, so it can be applied before deploying the new code.
4. Open Add/Edit Dish → Additional details → Allergens, save a selection and verify the Centro card. Existing dishes start with no assigned categories until an administrator updates them. No seed run is needed.

Catalog reference: https://food.ec.europa.eu/food-safety/campaign-2026/allergies_en
