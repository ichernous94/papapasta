# Production build repair — 2026-11-04

The Coolify log failed during `pnpm run build`, before runtime startup or database migrations. The six reported failures were four duplicate Sass math namespaces and two missing imports in an unrelated legacy shop route. Fixing those exposed further legacy Sass/TypeScript problems; all were resolved without suppressing checks.

## Changes

- Removed automatic Sass `additionalData` injection from Next config. Styles now use their own explicit imports. Added the missing variables import to the global Sass entrypoint.
- CookiePolicy, Cookie and GoTopBtn now use explicit Sass modules and the existing `mixins.toRem()` helper instead of unresolved old `rem()` calls. Removed references to undefined legacy color/shadow tokens, retaining existing white/gold/gray palette values and ordinary local shadows. Cookie Policy and its URL remain available.
- `/products/[id]` now returns Next notFound. The removed page/layout belonged to Sfora Festival, referenced missing ProductDescription/IProduct and an unrelated API/domain, and had no functioning restaurant content. The obsolete foreign metadata and unused product stylesheet were removed.
- Removed unreferenced legacy HeaderActions and Dropdown components/styles. They depended on absent cart/search stores and types; repository searches showed no consumers. No replacement shop, API, fake types or disabled build/type checks were introduced.

## Verification

- `next build` (default Turbopack, matching the deployed package build command) passed: compilation, TypeScript, page-data collection and all 36 static pages. Log: `/tmp/deploy-fix-build.log`.
- `tsc --noEmit` passed after regenerating stale route types. Old generated `.next/types` and `.next/dev/types` referring to the deleted product layout were moved to a temporary backup outside the project; no generated file is committed.
- 31 targeted tests passed: admin unit, QR, dish cards, allergens, menu loading and Centro regressions. Logs: `/tmp/deploy-fix-tests.log`, `/tmp/deploy-fix-centro-tests.log`.
- ESLint passed for changed TS/config. All affected Sass entrypoints compile independently. `git diff --check` passed.
- Started the built application with `next start` against the temporary database. HTTP checks passed: PapaPasta `/`, `/home`, `/menu`, `/cookie-policy`, `/sitemap.xml`; Centro `/`, `/menu`, `/kontakt`; admin `/login` return 200. Legacy `/products/test-removed-shop` returns 404. Runtime log: `/tmp/deploy-fix-runtime.log`.

Build/runtime checks used an isolated migrated and seeded database and a fixture image origin, not production storage. Working database, R2, environment files and deployment configuration were unchanged. The temporary database and server processes were removed after verification.

## Deploying the correction

Commit and push the corrected application source to the branch Coolify deploys, then redeploy using the existing `pnpm run build` command. No Webpack workaround or disabled TypeScript check is needed. This correction introduces no migration; use the existing database initialization/update instructions separately for the actual target database.

Earlier feature reports describe build/type blockers at the time those features were completed. This report supersedes their status: the current source now passes the complete production build and TypeScript.
