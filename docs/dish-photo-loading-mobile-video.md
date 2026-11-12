# Dish-photo loading, mobile prices and public video — 2026-11-12

Photo rows and full cards now use the coordinated loading revision described in [card-loading-and-upload-fixes.md](card-loading-and-upload-fixes.md). The video and price changes below remain in effect.

Both restaurants share these changes. No connected database records or media were changed; no dependencies were added.

## Dish-only Skeleton

DishImage wraps the existing PhotoImage only for menu dish photos, dish details and the dish photo viewer. It reuses the existing menu-loading photo placeholder, rather than applying the legacy shop-card Skeleton to restaurant text. Generic photographs, galleries, banners, logos and first-frame video previews have no new delay. The streamed menu-data Skeleton remains intact.

On first viewport entry (10%), the placeholder stays for at least 250ms and until successful image decoding. It then fades out while the image's 5px blur clears over 350ms. Text, prices and layout remain in place. A session-local source set avoids repeating Skeletons for photographs already shown, including reopened cards. A new source resets the state; errors stop the placeholder. Reduced motion removes the intentional delay and animation, retaining a static placeholder only while the file loads. SSR/no-JS markup still contains the actual image.

## Mobile menu prices

Below 600px, rows without a photograph place the name and price in separate columns, with the price aligned right. Long names wrap in their column; composed prices remain supported. Prices use Allura 400 and the shared light text color. Rows with photographs retain the price under the title with the same restored typeface. No currency or content changes were made.

## Video from public

The existing MP4 files and /videos/papapasta.mp4 / /videos/centro.mp4 URLs are retained. One start function prepares muted/defaultMuted/playsInline and calls play synchronously from a manual click. Automatic attempts are guarded against overlap, policy refusal, hidden/offscreen playback and user pause. A media error triggers reload on manual retry. Preferences suppress automatic source loading but permit explicit manual playback.

The first-frame poster and 400ms fade remain. Native frame callbacks are supplemented by current-data/media-clock checks, so a missing callback cannot indefinitely conceal advancing video. Both readiness paths are cancelled on reset/cleanup; frame polling is bounded and later timeupdate/loadeddata events can wake it. A readable error message leaves the manual retry button usable.

Cloudflare is not configured or used as part of the solution. The directly serving production server must support byte ranges; local Next.js responses are checked independently. Published-domain configuration/deployment is a separate step.

## Verification

The following checks passed. Physical iPhone/Safari and Android/Chrome are unavailable; local Chromium emulation cannot confirm those devices' media policies.

- TypeScript, targeted ESLint, all 34 affected unit/SSR tests and the final production build passed. The build used an unavailable dummy DB URL to preserve request-time content loading.
- Both real menus passed production Chromium price/font/overflow checks at 320, 375, 599, 768, 1024 and 1440px. The connected local database contained no dish photographs, so photo layouts and interaction scenarios used a temporary dev-only fixture with the actual components and local photos. The temporary route and images were removed before the final production build; the route is absent from the production manifest.
- Both restaurant variants passed mixed photo/no-photo layout, composed-price, long-name, image geometry and no-overflow checks at all six widths. Screenshots at 375/1440px were visually reviewed. Changing source retained the placeholder before 250ms; delayed image delivery retained it past that delay, then opacity sampling confirmed a gradual fade. Blur cleared, errors terminated loading, reopened cards skipped Skeletons and reduced motion had no image transition.
- Production video checks passed on both sites at 375/1440px for simulated autoplay refusal, explicit manual start, user pause/re-entry and save-data suppression. With native frame callbacks deliberately disabled from completing, advancing video still became visible. A simulated media error reloaded once on a real browser click; the play call retained active user activation and muted inline properties. Delayed MP4 delivery kept the poster visible until playback became ready.
- Both local MP4 range GETs returned 206 with Content-Type video/mp4, Accept-Ranges bytes, Content-Range bytes 0-1/<file-size> and Content-Length 2. No Cloudflare changes or published-domain configuration were performed.
- Physical iPhone/Safari and Android/Chrome remain untested. Published playback must be checked after direct-server deployment; local Chromium results are not a claim that the user's existing deployed Safari failure is fixed remotely.
