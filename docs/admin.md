# Papa Pasta administration

Local: `http://admin.localhost:3000`. Production: `https://admin.papapasta.pl`. One panel manages both restaurants. DNS, HTTPS, hosting and SMTP configuration remain separate operational tasks.

## Database and first administrator

1. Install dependencies from the lockfile with `pnpm install --frozen-lockfile`.
2. Keep the existing Docker Compose and `DATABASE_URL`. Complete the ignored environment file using `.env.example`; never commit secrets.
3. Keep a stable `BETTER_AUTH_SECRET` of at least 32 characters. Replacing it after enrollment prevents decryption of TOTP secrets/backup codes. Set `BETTER_AUTH_URL` to the admin origin (HTTPS in production).
4. Back up working data before `pnpm db:migrate`. Migration 0000 creates the original schemas; migration 0001 moves all application tables and the role enum into `public`, preserving records, constraints and relationships. Drizzle's migration history remains separate. Never use `drizzle-kit push` on working data.
5. Run `pnpm db:seed` only for initial content population. It adds missing stable IDs without overwriting edits. A later rerun can restore deleted original dishes; seed is not publishing synchronization.
6. Use the interactive `pnpm admin:bootstrap-sql` generator for the first administrator. It writes ignored `.local/bootstrap-admin.sql` with mode 0600, containing a Better Auth password hash, and does not execute it. Apply it manually to the same database, then remove the local SQL. No real administrator is created automatically.
7. Sign in and enroll an authenticator. The QR and manual secret come from Better Auth. After verifying TOTP, save the one-time backup codes before continuing.

The UI revision did not migrate the working database or change its environment.

## Access and account lifecycle

- Only `admin` accesses the panel. The `user` role remains in PostgreSQL but has no admin access. No public registration, restaurant assignments or custom role hierarchy is introduced.
- Add User generates a strong temporary password on the server through Better Auth and displays it once to Admin. Pass it through a private channel. The employee changes it, signs in again and enrolls TOTP.
- Mandatory TOTP cannot be disabled in the UI. Sessions expire after eight hours without refresh. Cookies are host-only/HttpOnly and Secure in production. Trusted devices, SMS/email OTP and impersonation are disabled.
- Every protected operation rereads current user/session state, including role, ban, expiry, password-change flag and server-written MFA proof. Upload actions recheck authorization before attachment. Admin API role/ban/delete mutations are blocked in favor of guarded server actions.
- Self-deletion/demotion and removal/demotion of the last active Admin are forbidden. Destructive user changes are serialized in a database transaction. Role changes revoke sessions/challenges.
- Edit User can issue a new temporary password and reset another account's 2FA. Reset 2FA requires the current Admin password, permits five attempts per minute, and transactionally removes the factor and revokes sessions/pending challenges with audit. Never edit password hashes or TOTP state manually in the UI.
- `last_login_at` records successful MFA; unknown historical dates display as `—`. UI dates use English and Europe/Warsaw.
- The profile menu opens My Profile, Two-Factor Authentication and Change Password in `/security`, and signs out through Better Auth. Forgot Password directs users to Admin; SMTP is not configured. Remember Me and trusted-device checkboxes are omitted because the session policy is fixed.
- Authentication rate counters are persisted in PostgreSQL. Sign in: five attempts/minute; 2FA routes: ten/minute, plus Better Auth's factor lockouts. Production reverse proxies must overwrite untrusted client IP headers. Do not cache the admin hostname on a CDN.

## Menus

The hierarchy remains restaurant > menu section > category > group > dish. Dishes, Categories and Groups use tables and modal forms. Empty category/group names already present in source content retain their public rendering; the panel supplies informational labels where needed.

Dish fields preserve name, portion, display-string price, description paragraphs, New badge/Nowość, visibility and optional image/alt text. Numeric prices display in PLN; values such as `29/36`, `do wyboru`, `w cenie steków` and empty strings remain intact. Additional fields live under Additional details. This section also includes a multi-select Allergens checkbox group with 14 categories; selections are stored independently for each dish/recommendation. Recommendations and full menus remain independent.

Arrows and drag-and-drop reorder only the full selected group. Search disables reorder. Deleting a nonempty group/category is rejected until its contents have been moved or deleted. Category editing preserves note/column-count/column-break settings. The action beside the section selector edits its heading/subtitle.

Saves lock menu rows, compare versions, update content/version and `public.audit_log` together, then invalidate restaurant cache tags and the affected home, menu, dish and sitemap paths. Cross-section transfers lock both sections in stable ID order and check both versions; cross-restaurant transfers invalidate both restaurants. Stale writes return a conflict without overwriting another editor. Public menus read PostgreSQL after request-time `connection()`, outside the tagged cache boundary, with no static-price fallback or build-time database requirement. Existing open public tabs do not refresh automatically. See [public menu freshness](content-refresh.md) for verification and the one-time redeploy requirement.

Contacts, banners, galleries, promotions and the PNG cocktail book remain outside the editor.

## Cloudflare R2

Use the five R2 settings in `.env.example`, with a key scoped to the bucket. Keep credentials server-side. Cloudflare resources/domains are not created automatically. `R2_PUBLIC_BASE_URL` must have no query/hash; use a custom HTTPS domain for production. Restart Next.js after changing it so Next Image permits the exact source prefix.

Uploads accept static JPEG/PNG/WebP, at most 5 MB and 25 megapixels. Sharp validates actual bytes, rejects animation, rotates, strips metadata and produces WebP up to 1600 px plus an individual blur placeholder. Uploads use unique keys under `papapasta/menu-images/`; files are not stored in `public/` or Git.

The previous image remains until upload and database attachment succeed. Failure preserves form details. Replaced/deleted images are marked orphan only when no item references them. Without R2, text editing remains available and upload controls explain unavailability.

`pnpm media:cleanup` reports unreferenced pending/orphan objects older than one day. `pnpm media:cleanup --apply` deletes only such application objects from R2 and PostgreSQL. Scheduling is not configured automatically.

## QR Codes

`public.qr_codes` stores real entries: restaurant, name, absolute HTTP(S) URL, active flag, author and timestamps. Creation has a live QR preview; cards support Copy, Open, Download PNG and confirmed deletion. Images are generated locally rather than stored in R2.

Inactive is informational. A downloaded/printed direct-link QR continues to open its URL after deactivation or deletion of the database record. There is no redirect/revocation service. No illustrative QR entries are seeded.

## Local recovery

For lost factors, an operator can run:

```sh
pnpm admin:reset-2fa employee@example.com --confirm
```

This revokes sessions/pending challenges, removes the factor/backup codes and audits `local-recovery`. Next sign-in requires new TOTP enrollment. If the password is also lost, another Admin issues a temporary password. For a sole Admin with no access, create a separate recovery Admin using the bootstrap SQL procedure, recover the original account and remove the temporary account afterward. Keep database backups and the original Better Auth secret.

## Verification and rollout

`pnpm test:admin` creates unique disposable `papapasta_test_*` databases, runs unit/integration tests and drops only those databases. It requires CREATE DATABASE on a local test server. Unit-only checks: `node --import tsx --test tests/admin/unit.test.ts`. Existing public/Centro checks: `node --test tests/centro.test.mjs`.

See `docs/admin-ui-implementation.md` for this revision's changed files and verification results. Before applying the migration, back up working data and stop old application processes: old code expects `auth`/`content`, new code expects `public`. Deploy schema and application together. Restore the matching schema/application versions together if rollback is needed.

## Allergens

Apply `0002_dish_allergens` with `pnpm db:migrate` after backing up the working database, before starting the updated application. This additive migration initializes existing dishes with an empty list and does not infer allergen information from descriptions.

In Add/Edit Dish, expand Additional details and select all applicable Allergens. Unchecking every option clears the selection. The field is available for both restaurants. Centro displays chosen categories under Alergeny in the photo dish modal and standalone dish page; list rows are unchanged. An empty selection hides the entire public block. Recommendations have independent selections.

See `docs/allergens.md` for the file inventory and validation results.

## Temporary deployment

The temporary workbase.sbs deployment has explicit admin/Centro host aliases. See [temporary domains](temporary-domains.md) for the three Coolify hostnames and BETTER_AUTH_URL setup. Production login still requires HTTPS; Secure cookies and origin checks have not been relaxed.
