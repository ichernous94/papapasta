# Public menu freshness — 2026-11-04

Public menu reads now wait for `connection()` before entering the existing tagged cache. Database content is excluded from the build snapshot; static banners, copy and skeletons remain prerendered. Restaurant tags, the one-hour revalidation policy and React request deduplication are retained.

After a successful content transaction, one helper expires the restaurant tag and invalidates its home, menu, sitemap and both standalone/intercepted dish routes. Centro uses the internal `/site-centro` rewrite destinations. Cross-restaurant transfers invalidate both restaurants, once each. Saves, structure changes, deletion and reorder actions share this helper. Existing authentication, MFA, version checks, audits and upload handling are unchanged.

## Validation

- Production Turbopack build passed with `DATABASE_URL` pointing at an unavailable local port; compilation, TypeScript and all 36 static pages completed without database access.
- TypeScript and ESLint passed for the changed source and tests.
- 39 targeted tests passed, including three new invalidation tests. A further eight admin tests passed against a disposable local PostgreSQL database, including migrations, content conflicts, authorization and upload failures.
- A production server used an isolated seeded database with no dish photos. Both menus, home recommendations and sitemaps were warmed before edits. Real browser sign-in, TOTP enrollment and admin form saves were exercised; only the R2 transport was replaced with local test storage.
- Without rebuilding or restarting that process, PapaPasta upload, replacement, removal and price changes updated the menu; its standalone dish and sitemap reflected the photo changes. Centro upload updated its rewritten menu and sitemap. Recommendation photos updated both warmed home pages independently. Restaurant isolation checks passed.
- Real Cloudflare/R2 delivery was not retested; production data and infrastructure were not changed.

## Delivery

Deploy this source once through the existing Coolify workflow. No migration, database reseed, R2 change or new environment variable is required. Subsequent successful admin edits appear on the next page request or ordinary browser refresh; already-open tabs do not poll or reload automatically.

Changed files: `src/server/content/public.ts`, `src/server/content/invalidation.ts`, `src/server/content/actions.ts`, `tests/content-invalidation.test.ts`, this report, `docs/admin.md` and `docs/architecture.md`.
