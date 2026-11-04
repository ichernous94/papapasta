# Centro seasonal promotional popup

Implemented 2026-11-04. The existing `public/images/promotional/promotional-image.jpg` poster is displayed unchanged, without cropping, added promotional copy or CTA. The reference screenshot guides the gold frame and blurred backdrop; the actual supplied poster is the vertical Włoska Jesień menu.

## Behavior and accessibility

`PromotionalPopup` is mounted only in Centro's persistent restaurant layout. `useState(true)` opens the existing native Modal on hydration. Closing changes only this state, so client navigation and Back/Forward keep it dismissed while a new document/reload opens it again. No browser storage, cookies, API or menu loading dependency is involved.

The cross, Escape and backdrop close without changing the URL. The existing Modal manages scroll locking, focus restoration and exit animation. Its new optional `onKeyDown` prop allows this single-control popup to keep Tab/Shift+Tab on its close button; other modal consumers remain unchanged. The Polish close label is `Zamknij ofertę promocyjną`. A visually hidden heading and complete text transcript of all five poster offers provide a text alternative; the image has empty alt to avoid duplicate announcements.

The statically imported Next image retains its 2079:2954 ratio and blur placeholder. The dialog is at most 680 px wide and fits the ordinary viewport with at least 16 px margins. Below 500 px viewport height it uses up to 480 px width and internal scrolling. A sticky 44×44 px close control stays accessible while scrolling. The common reduced-motion behavior is retained.

## Verification

- Local Chrome: direct Centro entry on `/`, `/menu`, `/kontakt` and a real test dish page opens the popup; reload opens it again. Internal navigation, Back and Forward keep a closed popup dismissed.
- Cross, Escape and backdrop dismissal passed; URL remains unchanged and scroll lock is removed. Tab/Shift+Tab keep focus on the close button. Reduced-motion animation was separately checked.
- A dish modal opens after promo dismissal, with one open dialog and normal focus restoration on closing.
- Promo is absent on PapaPasta `/`, `/home`, `/menu` and the admin login page.
- Compared actual screenshots at 1440×1000, 900×1000, 375×812 and 812×375: entire uncropped poster, gold border, dark blurred backdrop and contrast close control. No horizontal overflow; the landscape close button remains visible after scrolling to the bottom. Screenshots are in `/tmp/centro-promo-*.png`; browser results in `/tmp/centro-promo-browser-results.log`.
- 22 existing targeted regression tests passed (loading, dish cards, allergens and Centro). ESLint passed for changed TSX and the new SCSS module compiles.
- TypeScript still reports the existing legacy product/cart problems: missing IProduct/IDropdown, ProductDescription/getProductById, cart/search stores and HeaderActions typing. No promo-related errors. Log: `/tmp/centro-promo-tsc.log`. Production build was not rerun for this isolated UI addition; its known legacy blockers remain documented in `menu-loading.md`.

Browser checks used a temporary migrated/seeded database and intercepted fixture image requests locally. No working data, R2 objects, environment files or deployment were changed. Temporary test processes and the database were removed afterwards.

## Files

- New `src/components/PromotionalPopup/index.tsx` and `PromotionalPopup.module.scss`.
- `src/app/(centro)/site-centro/layout.tsx` mounts the popup.
- `src/components/ui/Modal/index.tsx` forwards an optional consumer keyboard handler.
- `docs/architecture.md` and this report document the decision and verification.
