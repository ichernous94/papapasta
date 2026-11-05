# Photo loading and one-time banner titles — 2026-11-05

## Photo loading

`ui/PhotoImage` forwards Next Image properties and the native image ref without adding a DOM wrapper. Server HTML contains the ordinary Next Image markup and existing placeholder; the extra loading class is applied only after hydration to an unsettled image. This preserves sharp photos without JavaScript and avoids re-blurring a cached image.

The `.animation` class applies `blur(5px)` with a 350 ms filter transition. `onLoad` removes that class before invoking an existing callback; errors also remove it and forward their callback. A layout effect checks `complete`/`naturalWidth` for images that loaded before hydration, and handles source/class changes. Reduced motion disables the extra blur and transition.

Photographic uses across both restaurants and Admin now use the wrapper: menu rows/detail cards, gallery/lightbox, content and delivery banners, selection backgrounds, video poster, promotional poster and upload previews. Cocktail-book Next Image covers/thumbnails use it; native page-flip images share the loading styles and native load/error cleanup. Logos, icons, QR codes and the 404 vector illustration remain outside this effect. Existing hover transformations are preserved alongside the filter transition.

## Titles and repeated appearances

Heading offset is now -1rem from above or +1rem from below (formerly 2.25rem). Duration remains 1200 ms with `cubic-bezier(0.25, 0.1, 0.25, 1)`.

`MenuBanner` has separate fallback and resolved ImageBanner trees. A component-local `triggerOnce` cannot guarantee once-per-document behavior when those trees are replaced or a route is reactivated. A controlled browser Suspense reproduction with the real unkeyed Reveal produced two `slideIn` starts (fallback and edited heading). The keyed version produced one. The ordinary delayed production baseline run produced one start, confirming that this symptom depends on timing rather than occurring on every request.

An optional `onceKey` now uses the document's persistent root Reveal provider. Banner keys include the restaurant and stable identity; menu banners use the menu key, so edited titles or photos do not reset the effect. Reservations prevent concurrent duplicates, are marked started by the actual animation event, and are released if interrupted before starting. Started entries survive hidden React Activity cleanup and navigation. Pending cleanup permits Strict Mode effect replay without consuming an animation that never started. A new document gets a fresh registry; other unkeyed Reveal uses retain their existing triggerOnce behavior. No browser storage or server-global registry is used.

## Verification

- 22 targeted SSR/registry/menu/allergen/QR tests and seven existing Centro tests passed. New tests cover pending reservations, started-title persistence, restaurant isolation and progressive image markup.
- Controlled browser fixture used the real components under React Strict Mode: two legacy heading starts versus one keyed start, no replay after hiding/showing Activity, pending/loaded/source-replacement/cached/error image states, load/error callbacks, blob preview, reduced motion and a photo loaded before hydration.
- Production browser checks held an actual photo response to verify pending blur and class removal, opened the gallery lightbox, checked the promotional poster and excluded logos. Both delayed menu pages produced one keyed title start, Back did not restart it, and no-JS photos/headings remained readable. Menu read failure was simulated by a local delayed connection source, without modifying a database or cache policy. An edited heading was covered by the controlled fixture rather than a database write.
- TypeScript, ESLint on changed TypeScript, Sass checks and production build passed. The build used an unavailable database and generated all 36 static pages. No dependencies, schema, database/R2 data, public URLs or deployment configuration were changed.
- Physical Safari/iPhone testing was unavailable. Admin blob loading was covered through the common wrapper fixture; no account or database mutation was needed for this UI change.

## Changed areas and delivery

New PhotoImage component/styles, Reveal provider/registry/once-key behavior, root provider composition, banner identity wiring, photographic image imports throughout public/Admin components, compatible hover transitions, tests and architecture notes.

A normal deployment delivers the change. This revision requires no migration or new environment variables.
