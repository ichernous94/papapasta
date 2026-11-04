# Admin UI implementation — 2026-11-03

## Result

Application tables and the role enum move from `auth`/`content` into `public`, preserving existing records. Added QR storage and MFA-based last-login timestamps. The panel now has an English responsive sidebar, menu tables/modals, category/group CRUD, user management, QR cards, authenticator onboarding and account settings. Existing menu structure, display-string prices, portion/new flags, independent recommendations and R2 processing are retained.

Temporary preview processes were stopped and the synthetic preview database was removed after verification.

Working database migrations, deployment, environment configuration and new dependencies were not performed. Existing unrelated worktree changes were preserved.

## Changed-file inventory for this revision

- Database: `src/server/db/schema/auth.ts`, `src/server/db/schema/content.ts`, `drizzle.config.ts`, `drizzle/0001_public_admin.sql`, `drizzle/meta/0001_snapshot.json`, `drizzle/meta/_journal.json`, `scripts/bootstrap-admin.ts`.
- Authorization/users: `src/server/auth/config.ts`, `src/server/auth/guards.ts`, `src/server/auth/user-actions.ts`, new `src/server/auth/user-write.ts`.
- Content/media/validation: `src/server/content/write.ts`, `src/server/content/actions.ts`, new `src/server/content/qr-actions.ts`, `src/server/content/public.ts`, `src/server/media/upload.ts`, `src/server/media/storage.ts`, `src/server/media/image-processing.ts`, `src/validation/admin.ts`, `src/types/admin.ts`.
- Admin components: `Admin.module.scss`, `Navigation.tsx`, `Shell.tsx`, `MenuEditor.tsx`, `Users.tsx`, `AuthPage.tsx`, `AuthForms.tsx`; new `Controls.tsx`, `QRCodes.tsx`, `ProfileForm.tsx`, `SignOutButton.tsx` under `src/components/Admin/`.
- Shared modal: `src/components/ui/Modal/index.tsx` adds an optional close-label prop while retaining the public-site default.
- Admin routes under `src/app/(admin)/site-admin/`: `layout.tsx`, `page.tsx`, `error.tsx`, `not-found.tsx`, `menus/page.tsx`, `users/page.tsx`, `security/page.tsx`, new `qr-codes/page.tsx`.
- Tests/docs: `tests/admin/unit.test.ts`, `tests/admin/integration.test.ts`, `docs/architecture.md`, `docs/admin.md`, this report.

## Verification

- Admin unit/integration suite: **8/8 passed**, using a disposable PostgreSQL 17 cluster in `/tmp` and separate `papapasta_test_*` databases. Covers original-schema upgrade with existing credential/session/factor rows, migration rerun, fresh installation, Drizzle snapshot alignment, content CRUD/reorder/transfer/conflicts, auth/MFA/rate limits/revocation, guarded user changes/reset and QR URL validation.
- Existing Centro suite: **7/7 passed**.
- Admin SCSS compilation and `git diff --check`: passed.
- Targeted ESLint: passed for Admin components/routes, server modules, validation, shared Modal and admin tests.
- TypeScript: no diagnostics in changed admin/server modules; repository-wide check fails on existing missing `IProduct`, `IDropdown`, product/cart/search modules and related implicit types.
- Production build: Webpack compilation fails on existing duplicate `sass:math` imports in CookiePolicy, Product, Cookie and GoTopBtn styles, plus missing `ProductDescription`. Default Turbopack build did not complete and was stopped; no successful production build is claimed.
- Browser: real sign-in, TOTP enrollment, backup-code handoff, dish create/edit/delete and search, persisted drag-and-drop and arrow reordering, user creation with one-time password, password-confirmed 2FA reset and user deletion passed against a separate synthetic preview database. QR creation/live preview/PNG download passed. Apple Vision independently decoded the downloaded PNG to the expected menu URL.
- Menus, Users and QR Codes inspected at 1536×864, 768×864 and 375×812: no document-level horizontal overflow. Tables retain their own horizontal scrolling on small screens. Mobile navigation receives focus and closes with native Escape.
- Desktop screenshots compared with supplied references: green sidebar, light surfaces, tables, dialogs, buttons and card styling follow the references. Existing restaurant SVG wordmarks, real Polish menu content and required section/group controls are retained; this is not a pixel-identical reproduction of illustrative mock data.
- Live R2 upload/replace was not exercised against Cloudflare. Existing image-validation and unavailable-storage/transport-failure tests passed.

## Applying to the working database

Back up the working database first. Apply the checked-in migration chain with `pnpm db:migrate` using the existing `DATABASE_URL`; do not use `drizzle-kit push`. Deploy application code and schema together during a maintenance window because the previous code references the old schemas. If rollback is necessary, restore schema and the matching application version together from the backup. Do not rerun seed as a migration step for existing content.

The local pnpm launcher attempted a registry-dependent version switch and could not verify/download the pinned version in this environment. Checks used installed binaries directly (`node node_modules/typescript/bin/tsc`, `node node_modules/eslint/bin/eslint.js`, `node --import tsx scripts/test-admin.ts`, `node node_modules/next/dist/bin/next build --webpack`), without changing package metadata or bypassing registry verification.
