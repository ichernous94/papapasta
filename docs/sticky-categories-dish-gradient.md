# Sticky menu categories and Centro dish gradient — 2026-11-05

## Behavior

Both restaurant MenuTabs now contain an outer sticky surface and a separate horizontal tablist. The surface uses `--restaurant-header-height` for its top offset; its containing block is the corresponding MenuTabs, so it stops sticking as that menu ends. Each subsequent menu has its own independent bar. Z-index 20 keeps it below Header/navigation overlays (50). Centro uses the shared opaque radial gradient with a dark-green fallback; PapaPasta retains its existing light surface.

The inner tablist has horizontal auto overflow and hidden vertical overflow. Touch gestures can still chain vertically to the document; no `touch-action: pan-x` or gesture-canceling listeners were introduced. Existing selection state, active underline, keyboard arrows/Home/End, horizontal focus reveal and URL/page-scroll rules are unchanged. The visual gap before menu content was moved to the outer wrapper to preserve spacing.

Centro's dish overlay and standalone dish-page surface use the existing `--page-background-gradient` token with a #142119 fallback. Its modal text is #f3ede0. Borders, rounding, photos and allergens are retained. The PapaPasta overlay is explicitly excluded from the gradient selector; its standalone white surface is untouched. Shared Modal behavior is unchanged.

## Verification

- Production build passed without an available database: compilation, TypeScript and all 36 static pages completed.
- TypeScript, targeted ESLint, three SCSS compilations, 15 menu/card/allergen tests and seven Centro tests passed.
- Chrome fixtures rendered the actual MenuTabs, DishCard, DishOverlay and standalone route surface styles under the production site's real Header. Fixture content supplied two menus with long and short categories without reading or mutating a working database.
- Both themes passed at 375, 768 and 1440 px: normal flow before the threshold, exact header alignment while pinned, release at the containing menu's bottom, no stale bar in the intervening banner gap and independent sticking of the next menu.
- Browser checks passed for horizontal-only inner scrolling, vertical touch scrolling of the document, End/Home selection and horizontal focus reveal, unchanged URL, short categories, orientation/header-height changes, and navigation overlays covering the sticky bar.
- Standalone route surface styles and native modal surfaces were verified with fixture dishes: Centro computed a radial gradient; PapaPasta remained white with no background image. Screenshots were inspected after modal opening completed. Real database-backed dish URLs were not used for this styling check.
- Real iPhone/Safari was unavailable; physical-device sticky/gesture behavior remains a release check.

## Files and delivery

Changed: `MenuTabs/index.tsx`, `MenuTabs/MenuTabs.module.scss`, `DishOverlay/DishOverlay.module.scss`, Centro's `menu/[slug]/DishPage.module.scss`, architecture notes and this report.

Deploy normally. No dependencies, URLs, API, database schema/data, R2 objects or deployment settings were changed by this revision.
