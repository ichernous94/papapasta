# Coordinated dish loading and upload layout — 2026-11-12

This revision corrects the earlier photo-only loading behavior for photo menu rows and full dish cards. The image-only viewer remains independent; galleries, content photographs, banners, logos and video behavior are unchanged.

## Behavior

DishReveal keeps real content in flow and renders a complete row/card Skeleton over it. While waiting, the body is transparent and inert, so images can load lazily without exposing half-loaded content or invisible interactive links. After image decoding and the first-view delay, image and text fade in together over 350ms. There is no nested photo Skeleton or subsequent image blur. Seen, decoded sources skip the repeated delay; errors release the content rather than hanging; reduced motion and no-JS access remain supported.

Both standalone dish pages reserve their surface and back link before server data arrives. Data fallback and loaded card share column/image geometry. Mobile copy reserves a 15rem baseline in both skeleton and real layouts. Longer titles, descriptions or allergen lists may naturally need more space; photo arrival itself does not add layout height. Modals also have a full-card data fallback, an accessible loading heading and preserved close/focus behavior.

The public category bar is transparent from server rendering. Clipping is still enhanced after measurement; no-JS bars remain in flow, so no opaque initial rectangle is needed.

The admin's real file input remains accessible but its native one-line filename is replaced by wrapping text. Upload grids/preview rows have shrinkable tracks and mobile wrapping, keeping the dialog width bounded. Dish filenames are displayed once when selected. Banner and content image pickers reuse the selector. No storage/API/authentication behavior changes.

Hover transform transitions are preserved independently from loading. The whole-card fade does not set image transition properties, and the remaining image-only loader transitions both transform and filter.

## Validation

- Targeted ESLint, TypeScript, all 37 affected tests and final production build passed. The build used an unavailable dummy DB URL to retain request-time content reads.
- Local production Chromium checks covered 320, 375, 599, 768, 1024 and 1440px. A temporary fixture used the actual MenuEditor, card, row and tab components with fake records and local photos; no save action or R2 upload was invoked. The fixture and its photographs were removed before the final build.
- The real native file input accepted a long filename. It appeared once, wrapped at all six widths, and neither changed dialog width nor introduced horizontal dialog overflow. Both public menus had a transparent bar with JavaScript disabled and no clip-ready enhancement.
- During delayed server data and held photo delivery, the full detail shell measured 529.75px before/after data at 375px and 592px before/after at 1440px on the control example. The image/text body stayed covered until ready. Screenshots of the loading/ready UI and upload form were visually reviewed.
- Independently held row images confirmed one whole-content phase for both restaurant variants. Opacity sampling showed text/photo fading together, image filter remained none, row height stayed stable and an image failure released the text. Modal heading focus and cached reopening remained usable.
- Hover sampling captured scale 1.0121 during the transition, followed by 1.035 at completion, confirming interpolation instead of a jump.
- No connected database writes, R2 uploads, migrations, dependencies, deployment or server configuration changes were performed. Physical iPhone/Safari and Android/Chrome were not available; browser checks used desktop Chromium with viewport emulation.
