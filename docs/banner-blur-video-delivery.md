# Banner previews, smooth scrolling and Safari delivery — 2026-11-16

## Application changes

The root HTML now declares `data-scroll-behavior="smooth"`, matching the existing CSS setting and allowing Next's router to temporarily disable smooth scrolling during its own scroll restoration.

MenuBanner's Suspense placeholder receives the section's static image metadata. ImageBanner uses the public Next `getImageProps` API to generate the same inline blur SVG/background styling as Next Image, but renders only that background in the pending state: no provisional full-size image, srcset or image preload. Section dimensions, skeleton text, overlay darkness and QR targets remain. The user explicitly accepted a provisional **blur** of the standard section image before the administrator-selected source becomes known.

Once data resolves, the selected image (or actual default when no custom image exists) uses Next Image's normal blur placeholder. A separate inline blur background of that same selected image also remains underneath it, so an image error cannot uncover the dark section surface when Next removes its own placeholder. Completed photographs paint above this background. Both layers use matching cover positioning, including the right-aligned children banner.

VideoHero, its native autoplay/muted/loop/playsInline markup, video posters and direct public MP4 files are unchanged. No video API, startup retries, database changes or deployment configuration edits are introduced.

## Video diagnosis

The published native video attributes were verified and the downloaded public MP4s matched the local files byte-for-byte. Both MP4s have their metadata before their media data. The public endpoints nevertheless returned HTTP 200 and the entire file for Range: bytes=0-1, with no Content-Range/Content-Length interval headers.

The user supplied these production checks for PapaPasta:

- Inside the Coolify application container: HTTP 206, Content-Range bytes 0-1/24866740, Content-Length 2.
- External direct-origin HTTPS connection: timed out; this alone says nothing about range handling.
- Through the Coolify proxy from the server itself, resolving the hostname to 127.0.0.1: HTTP/2 206 with the same correct two-byte headers.

This isolates the observed PapaPasta response change to the public delivery path after the functioning application/proxy. Both public restaurant URLs show the same faulty response. The user is applying narrowly scoped Cloudflare rules to those two MP4 URLs: eligible + respect strong ETags, followed by bypass cache, then purge only those URLs, following Cloudflare's Safari troubleshooting guidance. A rule preserves strong validators when supplied; it does not manufacture a strong ETag from the existing weak one.

Sources:
- https://nextjs.org/docs/messages/missing-data-scroll-behavior
- https://bugs.webkit.org/show_bug.cgi?id=211323
- https://developers.cloudflare.com/cache/troubleshooting/mp4-videos-on-ios-and-safari/

## Verification and remaining release checks

Production build, TypeScript, targeted ESLint and 12 component/unit tests passed. The pending-banner regression test checks inline blur, retained fragment targets and absence of a provisional full-image request/preload.

Valid local range tests passed byte-for-byte for the first bytes, middle, suffix and open-ended ranges of both files; HEAD exposed the correct full length and Accept-Ranges. An additional unsatisfiable-range probe returned 500 from the existing Next static server instead of 416; this is separate from the valid Safari initial request, which succeeds locally and in the production container. No custom range implementation was added to conceal that framework behavior.

Chromium verified all three pending banners on both restaurant hosts at 375px and 1440px with JavaScript disabled: inline blur backgrounds were present, dimensions were reserved and no full photograph was rendered in the fallback. With hydration enabled and full-image requests held pending, all resolved banners retained their selected-image blur. Forced image failures retained the separate blur background on both hosts. Dish opening/closing preserved document scroll positions with the new root attribute. Mobile and desktop screenshots were inspected. Post-rule public verification remains pending. Physical iPhone/Safari confirmation and publication of the application changes remain release checks; local Chromium does not establish playback on the user's device.
