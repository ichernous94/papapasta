# Restaurant logos in menu QR codes

Implemented 2026-11-04. Menu QR creation preview, saved cards and PNG export share `RestaurantQRCode`. Branding comes from `restaurantId`, independently of the destination URL. No schema, dependency, environment, R2 or deployment changes.

## Rendering and export

PapaPasta uses the existing dark `logo_papapasta_dark.svg`; Centro uses `centro_logo_qr.svg`, a copy of the original big logo changing only white lettering to #1d1d1b and retaining gold paths/geometry. Both retain their original proportions at 20% of matrix width on a white disc (28%); no green background is used. The matrix remains black on white with correction level H. The actual matrix module count determines four-module white margins. SVG sizing rules in the admin now target the outer SVG so nested QR geometry is not resized like an interface icon.

Known local logo assets are fetched, embedded as data URLs, and decoded before enabling export. Concurrent loads are deduplicated, and failed loads are not retained. PNG uses the same self-contained SVG at 1024×1024, including its quiet zone. The original URL is never shortened, rewritten or inferred from restaurant branding. Existing records receive the new design automatically without changing their data.

The QR matrix renders after logo loading on the client. This prevents an oversized existing URL from failing server rendering; a keyed error boundary catches client generation errors and resets when URL/restaurant changes. Creation stays disabled until the current branded preview is ready. Capacity failures show an English message; existing cards retain Copy/Open/Delete while Download is disabled. Logo errors disable creation/download, and export errors report failure instead of silently producing an unbranded image. Object URLs are revoked after export.

Authentication/TOTP QR components remain on their existing implementation with no logos.

## Verification

- Real local admin session on a temporary migrated/seeded database, including normal Better Auth login and TOTP setup. Created four test QR records through the form: PapaPasta, Centro, Unicode URL and a 746-character URL.
- Confirmed instant restaurant switching in preview; a PapaPasta QR pointing to the Centro domain still has PapaPasta branding. Preview and saved SVGs embed the selected logo. PNG output was captured from the Download button's generated data URL, including its filename.
- Apple Vision decoded all four resulting PNGs back to the exact input strings, including query parameters and Unicode (`żółć` and emoji). Sharp confirmed all files are 1024×1024. Evidence: `/tmp/restaurant-qr-decoded.jsonl`; images `/tmp/restaurant-qr-{Papa-normal,Centro-normal,Unicode,Long}.png`. Physical phone-camera/printed-paper testing was not performed.
- A URL beyond H capacity shows a local error and disables Create. A pre-existing oversized test record retains enabled Copy/Open/Delete and disabled Download.
- Injected HTTP 503 for PapaPasta logo: affected cards show an error and disable downloads, Centro remains available, and creation cannot proceed with the missing logo. Injected missing canvas context: an English export error appears and no download occurs.
- First-iteration screenshots at 1440 and 375 px verified the original badge; the final enlarged white-disc design and full responsive grid are verified below. Compared restaurant artwork with the approved reference; the supplied wide PapaPasta wordmark is preserved rather than replaced by an invented compact symbol. Artifacts: `/tmp/restaurant-qr-preview.png`, `/tmp/restaurant-qr-cards-{1440,375}.png`.
- 24 targeted tests pass: three new QR tests plus admin unit, dishes, allergens and menu-loading suites. New checks cover branding selection, safe server rendering of oversized records and deduplicated/retryable asset failures.
- ESLint passed for changed TS/TSX. Both changed/new SCSS modules compile. TypeScript still reports only existing legacy product/cart errors (IProduct/IDropdown, ProductDescription/getProductById, cart/search stores and HeaderActions typing). Log: `/tmp/restaurant-qr-tsc.log`. Production build was not rerun; known legacy blockers remain documented in `menu-loading.md`.

Tests touched only the temporary database and local browser; working database and R2 contents were untouched. Test processes and database were removed after verification.

## Files

- New `src/components/RestaurantQRCode/{index.tsx,logo.ts,download.ts,RestaurantQRCode.module.scss}`.
- Updated `src/components/Admin/QRCodes.tsx` and `Admin.module.scss`.
- New `tests/restaurant-qr.test.tsx`.
- Updated `docs/architecture.md` and this report.


## Card layout refinement — 2026-11-04

- White backgrounds for both restaurants and enlarged branding are shared by preview, saved cards and PNG. New QR-only Centro SVG preserves all original shapes and gold coloring; existing public-site logos remain unchanged.
- Three columns from 1200 px, two from 768 px and one below 768 px. QR thumbnails are 104 px by default and 120 px when the card content width reaches 330 px, using a container query. Previous conflicting grid rules were removed.
- Open, Download and Delete are icon-only 40×40 controls with specific English accessible labels, standard title tooltips and inherited visible focus. Delete retains its red appearance. URLs keep complete Open/Copy values while visually ellipsizing, headings wrap, and header status does not shrink.
- Browser verified widths 1536, 1280, 1200, 1024, 768, 375 and 320: expected 3/3/3/2/2/1/1 columns, no horizontal overflow, all action bounds inside each card, including a long title and a 746-character URL. Thumbnail measurements confirmed 120/104 px variants. Mobile creation preview also has no overflow. Screenshots: `/tmp/qr-layout-cards-<width>.png`, `/tmp/qr-layout-mobile-preview.png`.
- Re-exported PapaPasta, Centro, Unicode and long-URL PNGs all measure 1024×1024 and decode to exact original strings with Apple Vision after enlarging the white disc. Evidence: `/tmp/qr-layout-decoded.jsonl` and `/tmp/qr-layout-{Papa-normal,Centro-normal,Unicode,Long}.png`. No physical phone/print test was performed.
- Verified keyboard tab order and accessible icon names; cancellation retains the QR and confirmed deletion removes only the test record. Capacity overflow still disables creation/download while keeping other existing-card actions. Repeated logo-503 and canvas-failure tests passed without silently downloading an incomplete QR.
- 24 targeted tests pass; ESLint and SCSS pass. TypeScript remains blocked only by the same legacy product/cart errors; `/tmp/qr-layout-tsc.log`. No production build rerun for this UI refinement.
- Additional changed asset: `public/icons/centro_logo_qr.svg`; tests updated to assert dark-logo mapping. All previous no-migration/no-working-data-change constraints remain in force.
