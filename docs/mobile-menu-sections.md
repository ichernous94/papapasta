# Mobile menu and editable sections — 2026-11-05

## Public behavior

Below 600 px, both restaurant menus show the selected category heading and dotted separators. Dish photos stay on the right, the price appears below the name and numeric prices receive a mobile-only `zł` suffix. Existing fonts, nonnumeric price labels, dish links and desktop/tablet layouts remain intact. The loading skeleton follows the same mobile composition.

Centro's promotional dialog uses a 350 ms opacity animation without scaling the poster. Its intrinsic aspect ratio is reserved; reduced motion disables animation. Other dialogs retain their existing animation. The homepage recommendation block is removed only from Centro; its recommendation data and the PapaPasta block remain available.

The global reset now uses a minimum document/body height instead of a fixed 100% height, allowing the sticky header's scroll ancestors to grow with content. Existing viewport-only, reference-counted scroll locking remains in place. Centro's Google Maps embed now includes the missing `!3f0!` parameter and the supplied complete address. Both contact maps were verified in Chrome; Centro also has an ordinary external map link.

## Section editing and media

In Admin → Menus, select a menu section, then use Edit menu section to upload/replace its banner or restore the default image. JPEG, PNG and WebP up to 5 MB use the existing authenticated R2 upload/processing path, preview and failure handling. Changing names/subtitles without a new image preserves the current banner. Recommendations have no public menu banner and do not show this control.

Delete menu section opens a confirmation displaying category, group and dish counts. Deletion cascades through the hierarchy in one version-checked transaction and records an audit entry. `main` and `recommendations` are protected on the server and in the UI. After deletion, the editor selects a remaining section; public optional sections disappear entirely, including their banners and spacing. During lookup, a neutral skeleton is shown rather than a possibly deleted static banner.

Migration `0003_menu_banners` adds nullable `public.menus.banner_image_id` referencing `media_assets`. Existing sections retain their default local image. `EditorMenu` now exposes `bannerImageId` and optional `bannerImage`; structure updates accept optional `removeBanner` and an optional upload FormData. Existing callers remain compatible. Content operations additionally accept `deleteMenu` with `menuId` and `version`.

An image is orphaned only when neither a dish nor a menu banner references it. The cleanup script checks both references before deleting any object. Uploads are re-authorized after processing, and failures preserve prior content. No immediate R2 deletion is performed by section deletion.

Request-time menu reads retain tagged caching, and successful content mutations invalidate the affected restaurant's menu, home, dish and sitemap paths. Centro invalidates internal rewrite destinations. Banner changes and deleted sections do not require a rebuild after this release.

## Verification

- Migration upgrade/re-run, clean installation and Drizzle snapshot alignment passed on disposable PostgreSQL databases.
- Integration coverage includes banner attachment/replacement/reset, upload ownership, version conflicts, protected sections, cascading deletion, audit and shared-image retention.
- Chrome production-server checks passed for both restaurants at 320, 375, 600, 900 and 1440 px: no horizontal overflow, correct mobile photo/price/category layout, sticky header at multiple scroll depths and after navigation/dish overlays. Screenshots were inspected against the supplied composition; test dish photos are local fixtures.
- Real admin sign-in/TOTP and forms verified banner upload/replacement/reset, deletion counts, cancellation, deletion of a populated breakfast section and removal from the public page. File transport used a local R2 substitute; production R2 was untouched.
- Both Google Maps iframes returned HTTP 200 and rendered maps. Reduced-motion promo and short-viewport close-button checks passed.
- TypeScript, ESLint on changed TypeScript files, seven Sass compilations and the final production build passed. The build completed all 36 static pages with an unavailable database URL. All 34 distinct tests passed across unit/presentation, admin integration and Centro suites; the admin runner also repeats six unit tests.
- Upload, replacement and reset were additionally checked against a warmed public menu without restarting the production process; each change appeared on the next request.
- Real iOS Safari/address-bar collapse was unavailable; verify on an actual iPhone before release. Real R2 delivery was not retested.

## Apply

Back up the target database. Run `pnpm db:migrate` from this release with the target database environment, then deploy this application version through the existing workflow. This adds one nullable field and does not delete any section automatically. Delete unwanted sections explicitly in the admin after deployment. No new dependencies or environment variables are required. Working database, R2 objects and deployment configuration were not changed during implementation.

## Changed areas

Public menu rows/tabs/skeleton, banner/optional-section composition, Centro homepage/contact/promo, document reset, admin section forms, content actions/read/write/cache invalidation, media cleanup, Drizzle schema/migration/snapshot, related tests and documentation.
