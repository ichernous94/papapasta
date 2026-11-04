# PapaPasta — Architecture Notes

> Status: working document. Only decisions explicitly marked **Confirmed** are treated as established. Review against the actual repository after initial scaffolding.

## 1. Product scope

**Confirmed context**
- Migrate existing WordPress restaurant experiences to Next.js.
- The public entry at `papapasta.pl` currently lets visitors choose between two restaurants.
- One experience is PapaPasta Pizza Wino Steki, currently reached through routes such as `papapasta.pl/home`.
- The Centro experience is currently reached through `centro.papapasta.pl`, including routes such as `/menu`.
- A shared administration experience is planned. The goal is to minimize unnecessary complexity for the client.

**Confirmed deployment direction**
- One Next.js application and deployment will serve the public sites and shared administration.
- `https://papapasta.pl/` remains the restaurant-selection page; `https://papapasta.pl/home/` opens PapaPasta Pizza Wino Steki.
- `https://centro.papapasta.pl/` opens the Centro site.
- `https://admin.papapasta.pl/` will open the shared administration interface for both restaurants.
- `src/proxy.ts` maps Centro hostnames to a separate internal branch without changing public URLs. Internal paths return 404 when requested directly; administration uses its own `/site-admin` internal branch with the same direct-path protection.
- Each site will have its own layout and metadata. The root layout remains shared and contains no restaurant-specific metadata.
- Centro hostname routing is implemented in Proxy; the landing page remains independent. Domain/HTTPS deployment setup remains a subsequent step; the administration interface is now implemented.

**Confirmed landing page**
- The restaurant-selection page lives at `src/app/(landing)/page.tsx`, outside the existing `(main)` layout. Its public URL remains `/` and it exports the full PapaPasta metadata with its own canonical and Open Graph URL.
- The landing page has its own `main` and uses `src/components/SectionHome/` with colocated SCSS. It does not include the legacy Header, Footer, Cookie or GoTopBtn.
- Use the supplied images by their agreed filenames: `papapasta-pizza-wino-steki.jpg` for the PapaPasta panel and `papapasta-centro.jpg` for Centro, even though their interior photographs do not match those names. Do not rename the assets.
- The two panels are side by side from 1024 CSS px and stacked below that width. Center the content in both layouts, preserve safe padding, and allow panels to grow when text needs more space.
- Statically import both JPEGs and use `next/image` blur placeholders with responsive sizes. Preserve clear SVG logos and darken only the background photographs.
- The PapaPasta landing link opens the internal `/home` route. Centro opens `https://centro.papapasta.pl/` in the same tab, where Proxy selects the Centro branch. During local development, the Centro selection button uses `centro.localhost` with the current protocol and port; production keeps the canonical domain.
- Shared `src/components/ui/Button/` supports typed anchor and native button modes. Use Next Link for internal destinations, native anchors for external destinations, visible keyboard focus, and a light fill with dark text on hover.

**Confirmed PapaPasta home page**
- The `/home` route lives in `src/app/(papapasta)/home/page.tsx`. Its restaurant layout contains the shared Header, main content and Footer, independently of landing and legacy `(main)` UI. The page sets its canonical and Open Graph URL to `/home` using the PapaPasta metadata defaults.
- Compose the page from VideoHero, AboutSection, DishesSection, WineSection, Recommendations and Gallery. Shared ContentSection, VideoHero, Recommendations and Gallery live directly in `src/components/`; PapaPastaHome retains its restaurant-specific sections and default adapters, with colocated SCSS Modules. Keep static copy, navigation, contacts and opening hours in `src/config/papapasta.ts`. Its original recommendation data is now a versioned seed source; runtime recommendations come from PostgreSQL.
- Navigation retains `/home`, `/nasz-lokal`, `/menu`, the supplied external ordering URL and `/kontakt`. These are distinct public pages; do not substitute invented content or redirect them to `/home`.
- Header is sticky. Desktop navigation is shown above 1024 CSS px; 768–1024 uses the logo, burger and phone row; below 768 the phone appears in a dark top strip. Burger state is kept in the existing Zustand store without persistence and has explicit open/close actions.
- Closing the menu via its toggle, navigation, backdrop, Escape, route change or desktop breakpoint restores page interaction. Constrain keyboard focus while open and share a reference-counted body scroll lock with dialogs, preserving previous styles and scroll position.
- Use a native dialog-based Modal for telephone reservation information and the gallery lightbox, with focus restoration and backdrop/Escape/close-button dismissal. Use the installed Swiper for cyclic slide navigation, keyboard arrows and touch swipes only while the gallery is open.
- Gallery uses four columns from 1024 CSS px and two columns below. Information sections use a 40/60 text/image split on desktop and text before the image below 1024 px. Import local JPEGs statically with responsive sizes and blur placeholders.
- The video hero uses the existing muted inline looping video. Keep a static steak image before playback, when autoplay fails, or when reduced motion/data saving is enabled. Expose play/pause controls and pause offscreen video.
- Footer has three columns above 1024 CSS px and centered stacked content below. Its small CurrentYear client component computes the Warsaw calendar year after hydration, on returning to the tab and periodically, so it is independent of the build date. Tripadvisor remains a noninteractive icon until a real profile URL is supplied.
- Use plain light surfaces and Lato. Allura is the selected script font, loaded through next/font/google for decorative subtitles and price columns; Lato remains the body font. Reuse `$colorGold: #c9a579` for decorative accents and `$colorGoldText: #D7BB91` for text on light surfaces, with explicit Sass module imports. Original SVG colors remain unchanged; the footer has a separate dark logo variant.
- Shared Button has light (default) and dark variants. Preserve the landing appearance; use the dark variant on light content sections. Bound fluid typography and spacing with clamp and the existing toRem helper.
- Recommendation prices and portions on `/home` remain independent from the full `/menu` assortment, as explicitly agreed. Do not synchronize them automatically.

**Confirmed PapaPasta public pages**
- `/nasz-lokal`, `/menu` and `/kontakt` share the `(papapasta)` layout, Header and Footer. A dedicated full-content layout wrapper provides a containing block for the sticky Header, independently of the global fixed body height; do not apply overflow clipping or transforms to it.
- Shared Gallery and Reservation live directly under `src/components/`. Gallery accepts typed image data and `strip` (four columns, two below 1024 px) or `grid` (three columns, two below 1024 px, one below 768 px) variants. Reuse native Modal and Swiper; dialog labels have unique IDs.
- The venue page uses an image heading banner, supplied venue description, twelve-photo grid and delivery banner. Static restaurant image collections live in `src/config/papapasta-images.ts`; original asset filenames remain unchanged.
- The menu page uses eight food/drink categories, a static autumn menu, a children's menu and three alcohol categories. The supplied assortment in `src/config/papapasta-menu.ts` is a versioned seed source with stable IDs. Runtime menu data comes from PostgreSQL via shared presentation types, retaining optional portions/descriptions/new badges and display-only string prices.
- MenuList is shared presentation. MenuTabs is a small client component with independent local state for each tab group, accessible keyboard navigation and horizontally scrollable mobile tabs. All panel content is server-composed and present in the initial render; inactive panels are hidden. Pizza and soft drinks use two explicit reading-order columns from 1024 px, one below. `/menu#kartawin` remains the wine-section anchor with a dynamic sticky-header offset.
- Contact details, social URLs, maps URLs and shared page copy live in `src/config/papapasta.ts`. The contact page reuses Reservation, embeds the supplied lazy Google Maps iframe, offers an ordinary external map link, and finishes with the shared photo strip. Tripadvisor stays noninteractive pending a real profile URL.
- Every public page has its own title, description, canonical and Open Graph URL, keeping shared robots/brand defaults. A permanent Next.js redirect (308) maps legacy `/menu-restauracji` to `/menu`; no other route or domain migration is implied.
- Restaurant pages, including `/home`, share bounded spacing and compact mobile buttons via layout-scoped CSS variables. Landing styles remain unchanged. Light surfaces remain plain; Allura is applied to decorative subtitles on home, venue, menu and contact pages, and the home/menu price columns, using normal style and weight 400. Decorative Allura subtitles are 48px and use $colorGoldText (#D7BB91); price sizes and inherited dark colors remain unchanged.
- Administration and content APIs are implemented below; the broader PapaPasta sitemap/robots migration remains a future stage; Centro has separate hostname routing and metadata routes. Autumn content is static and does not expire automatically.

**Confirmed motion and navigation refinements**
- Reveal is a small client component using the installed react-intersection-observer. Section/page headings enter from 36px above over 1200ms once; content/gallery photographs fade and scale from 1.05 to 1 over 1200ms inside clipped containers, with a short stagger. Image scale is independent of the hover transform. Server HTML remains visible without JS. Respect prefers-reduced-motion and preserve blur placeholders.
- Header navigation explicitly scrolls to the document top after the target route commits and the exiting menu releases its scroll lock. Re-selecting the current page also goes to the top. Wine hash links retain their section-anchor behavior.
- Scroll locking changes only the root viewport overflow, preserving body overflow so a second scroll container cannot detach the sticky Header. Overlay focus changes use preventScroll. Keep locks and focus containment until exit animations finish, including rapid reopen and concurrent overlays.
- Burger navigation is viewport-positioned immediately below the measured Header, with a sliding/fading entrance and exit, independent internal scrolling and a lightly dimmed backdrop. Header has a visible bottom shadow.
- The gallery dialog has a transparent surface and a lightly dimmed page backdrop, with centered contain-fit photographs, a 70% dark backdrop with 4px blur, and 650ms entry/exit. Scroll lock persists through the closing animation. Native dialog focus behavior and Swiper keyboard/swipe support are retained.
- Public text and logos use slightly smaller bounded sizes, including landing. Shared buttons retain at least a 44px target with compact padding. Hover transitions are gradual; PapaPasta active menu tabs use gold text without an underline; Centro category tabs use the scoped gold underline from its photo-menu revision. Keyboard focus indicators remain visible.

**Confirmed site wrapper and containers**
- A root `.siteWrapper` wraps route content (including landing and restaurant layouts) with width 100%, min-width 320px, max-width 1920px, centered margins and min-height 100svh. Toasts remain outside it. Do not add overflow clipping, transforms or a fixed height to the active site wrappers; sticky Header and viewport overlays depend on this.
- Shared `src/components/ui/Container/` accepts default (1170px) and text (768px) sizes, div/section tags and standard HTML attributes. Width includes 15px horizontal padding on each side: default content width is 1140px. Reuse the existing SCSS width/padding tokens and `$maxWidthTextContainer: 768px`; vertical spacing belongs to each section.
- Header/Footer inner content, recommendations, contact information, menu lists and the venue photo grid use the default Container. Only the introductory paragraphs on `/nasz-lokal` and `/menu` use text size. Remove competing section widths/horizontal padding instead of nesting additional page gutters.
- Banners, video, home split sections, photo strips and landing photography stay full-width within the 1920px wrapper. Image sizes reflect the wrapper and container caps. The fixed burger panel is centered and capped at 1920px; modal/backdrop behavior remains viewport-based.

**Confirmed Centro site**
- One application serves Centro at `centro.papapasta.pl`, with `centro.localhost:3000` for local development. Proxy rewrites public paths into `src/app/(centro)/site-centro/`, preserves query/RSC parameters, and passes through API, Next.js internals and shared static assets. The existing main-domain routes and localhost retain PapaPasta behavior. Direct technical paths return 404 on all hosts; unknown Centro paths use Centro's 404.
- Centro routes are `/`, `/nasz-lokal`, `/menu`, `/cocktail-bar`, `/promocje`, `/zestawy-obiadowe` and `/kontakt`. Next.js retains its existing trailing-slash normalization. `/menu-restauracji` redirects permanently to `/menu` on both hosts. Each page has Centro metadata and public canonical/OG URL; Centro robots and sitemap contain only Centro URLs. PapaPasta's legacy sitemap/robots migration remains outstanding.
- Header, BurgerMenu, Footer and SocialLinks accept a typed restaurant configuration. PapaPasta defaults preserve existing behavior; normalize internal rewrite paths when matching active navigation and top-of-page navigation targets. Shared ContentSection, VideoHero and Recommendations accept input data, with lightweight PapaPasta adapters. No request headers or hostname-dependent fetching are needed in the shared root layout.
- Centro owns static copy/contact/navigation/recommendation data in `src/config/centro.ts`, a separate `centro-menu.ts`, image collections and a 14-page drink-book manifest. Shared menu and restaurant types live in `src/types/`. Recommendation prices intentionally remain independent from full menu prices (gnocchi 53 vs 54). Preserve the supplied Gambero piccante 51 and Burrata Piccante 58, including identical descriptions, and confirmed Cappy pomarańczowy 9.
- Theme variables are scoped to the Centro layout: #00191B surface, #F7F7F5 text, #C4CFCE secondary text and existing gold accents. Shared components keep their original fallbacks for PapaPasta. Allura subtitles retain 48px/gold styling; prices inherit light text. No WordPress texture, decorative heading bars, dark-on-dark text or PapaPasta reservation/delivery controls are copied into Centro.
- Reuse the 1920px site wrapper, 1170px default and 768px text containers, responsive split sections, blur placeholders, reduced-motion support and existing heading/image animations. Centro uses its own logo proportions, sticky header, shared burger/focus/scroll-lock behavior, and a four-image Gallery ribbon.
- Centro contact details are Jurowiecka 11/1, 15-001 Białystok, +48 883 317 389, kontakt@papapasta.pl. Facebook/Instagram are the user-confirmed papapasta.centro profiles, with no Tripadvisor placeholder. Preserve the supplied Google Maps embed URL exactly. Footer hours are Mon 09–20, Tue–Wed 09–21, Thu 09–22, Fri–Sat 09–24, Sun 09–20; year uses CurrentYear. Gold copyright band uses dark text for contrast.
- The promotion listing links to the static `/zestawy-obiadowe` page, published 2025-10-28. Terms: Mon–Fri 12–17, soup + pasta 59 zł / salad 55 zł / pizza 57 zł, dessert with a set -50%. Publication dates are static and independent of the current footer year; no expiry automation is implied.
- The user approved `page-flip` 2.0.7 as the only new dependency. CocktailBook dynamically imports it near the viewport and renders the 14 existing PNGs in the approved order, including the Cyrillic initial in `сoffee-and-cocktails.png`. No PDF or PDF renderer is required. The library owns imperatively created DOM inside an isolated React mount.
- The drink book shows a spread from 1024px and one page below; front/back covers are separate, navigation is bounded, and controls provide thumbnails, keyboard arrows/Home/End, swipes, zoom 1–2 in 0.25 steps and browser fullscreen with Modal fallback. Zoom disables page gestures and permits panning. Reduced motion uses immediate page changes. Keep a static cover and image links without JS, and load only nearby page images. A versioned pnpm patch stops page-flip's RAF loop and delayed initialization on destroy; keep it when updating the package.
- The Centro migration did not change DNS/HTTPS/deployment; the subsequent administration implementation is documented below. Browser/production verification requires the corresponding local execution permission; do not infer visual fidelity from static checks.

**Not yet decided**
- Additional migration redirects beyond the explicitly confirmed public routes above.
- Further content editing beyond the confirmed menu/photo editor.
- Production database hosting, backup scheduling and Cloudflare domain/deployment setup.

Do not rewrite the existing URL scheme until the migration and SEO consequences have been reviewed.

## 2. Frontend stack

**Confirmed preference**
- Next.js App Router, React, TypeScript, pnpm, SCSS Modules.
- Prefer a component-oriented structure with colocated component styles and `@/` imports.

**Available/considered packages**
- `@tanstack/react-query`, `axios`, `sass`, `zustand`, `react-hook-form`, `react-icons`, `react-intersection-observer`, `react-toastify`, `sharp`, `swiper`; `schema-dts` for schema typing.
- Package presence does not imply it must be used in every feature.

## 3. Suggested directory responsibilities

The following is a **starting convention**, not a mandate to create empty folders:

```text
src/
  app/          # routes, layouts, metadata and route composition
  components/   # shared and feature UI, with colocated SCSS Modules
  config/       # application configuration, if needed
  hooks/        # reusable client UI hooks (not API data hooks)
  services/     # client API functions and query hooks, if needed
  store/        # Zustand for shared client UI state
  styles/       # global SCSS, tokens and mixins
  types/        # shared domain types
  utils/        # pure utilities
  server/       # server-only data/business logic, if needed
public/
  images/
    landing/    # restaurant-selection images
    papapasta/  # static assets for first restaurant
    centro/     # static assets for Centro
    shared/     # shared static imagery
  icons/        # static SVG assets
  videos/       # small static videos
  documents/    # public PDFs or similar
```

Use `next/font/local` for local fonts; colocate font files in `src/assets/fonts/` if that fits the final setup. Keep dynamically uploaded menu photos in external object storage rather than committing them into `public/`.

## 4. Component and styling conventions

**Confirmed fonts and metadata**
- Use `next/font/google` for Lato (the default font, weights 400 and 700), Open Sans, Roboto and Noto Sans. The latter three use variable fonts.
- Define fonts in `src/config/fonts.ts` with normal style, `display: 'swap'` and `latin`/`latin-ext` subsets. Preload only Lato; expose all four fonts as CSS variables.
- Allura exposes `--font-allura`, uses latin/latin-ext, display swap and no additional preload. Only Lato remains preloaded. No font package or dependency is added.
- Font CSS variables are `--font-lato`, `--font-open-sans`, `--font-roboto` and `--font-noto-sans`. Global text and form controls use Lato with a sans-serif fallback.
- The shared root layout uses `lang="pl-PL"` and places client providers inside `body`.
- Keep typed restaurant metadata defaults in `src/config/metadata.ts`; apply PapaPasta defaults to the landing page and PapaPasta/legacy public layouts. Centro defaults are connected to the Centro branch. Admin noindex/nofollow metadata applies only to its own branch.
- Preserve the supplied Polish titles and descriptions. Public metadata allows indexing and following, large image previews and unrestricted snippet/video previews; Open Graph uses `website` and `pl_PL`.
- Set canonical and Open Graph URLs per page, not to `/` in a shared layout. Spread shared Open Graph fields when adding page-specific values because nested metadata objects are replaced rather than deeply merged.
- Do not invent keywords, social images or social account handles. JSON-LD, PapaPasta robots.txt/sitemap and legacy product metadata require separate migration work before launch; Centro has its own robots/sitemap.

- For new components, default to `src/components/ComponentName/index.tsx` and `ComponentName.module.scss`, matching the existing project if it differs.
- Prefer reusable components for shared navigation, buttons, cards and layout patterns.
- Keep restaurant-specific copy and imagery separate from shared presentation when helpful.
- Use semantic HTML, accessible labels, keyboard-accessible controls and responsive layouts.
- Do not introduce a UI framework or new design-token system unless agreed upon.

## 5. Data and state

- Server Components may fetch server-side data directly through server-only modules.
- Use TanStack Query for interactive client-side server state when it adds value.
- Use Zustand for shared client UI state; prefer local React state for local interactions.
- Use react-hook-form and Zod for admin forms, with repeated validation on the server.
- Server-side authorization must protect admin and content-changing operations, regardless of client-side navigation guards.

## 6. WordPress migration checklist

Before implementing each page:
1. Record its original URL and desired destination URL.
2. Capture desktop and mobile screenshots with known CSS viewport widths.
3. Inventory original copy, images, links, forms, interactions and fonts.
4. Record title, description, canonical, headings, relevant structured data and redirects.
5. Identify reusable components and existing styling conventions.
6. Implement only the agreed page or section.
7. Compare original and local screenshots at matching viewport widths.
8. Verify responsive behavior, accessibility, internal links and available project checks.

Preserve existing URLs where feasible; use appropriate permanent redirects if paths change. Do not invent content or metadata when the source is available.

## 7. Open architecture decisions

Discuss and document before implementation:
- Deployment domain/HTTPS configuration and administration host mapping, following the confirmed single-deployment direction. Centro application routing and local hostname are confirmed below.
- Administration extensions beyond the confirmed admin/user menu workflow.
- Content models for pages beyond text menus and dish photos.
- Production PostgreSQL operations and backup strategy (Drizzle/PostgreSQL confirmed below).
- Any future authentication providers beyond the confirmed email/password and mandatory TOTP.
- Media editing beyond dish photos and production R2/CDN operations.
- SEO migration inventory and redirect mapping.

## 8. Codex working agreement

- **Analyze:** inspect relevant code and references, explain findings, do not modify files.
- **Plan:** propose alternatives, tradeoffs and a file-level implementation plan.
- **Implement:** after approval, change only agreed files and run relevant checks.
- **Review:** inspect diffs, report risks and verify screenshots where tools are available.


## 9. Confirmed administration, PostgreSQL and R2

- One app serves `admin.papapasta.pl`, locally `admin.localhost:3000`, through Proxy rewriting into `(admin)/site-admin`. Direct technical paths return 404 on every host. Auth API checks the actual admin hostname separately; public/Centro routing and static assets retain their behavior. Admin pages have their own English UI, noindex/nofollow, robots disallow-all and private/no-store responses. DNS, HTTPS and deployment changes are not included.
- Better Auth uses its standard admin plugin with exactly `admin` and `user`; a PostgreSQL enum enforces these values. Only admin accesses the panel and manages both restaurants; user accounts remain in the model without panel access. No superadmin, singleton owner, restaurant assignments, custom access matrix or impersonation UI. Public signup, HTTP 2FA disable and trusted devices are disabled.
- Email/password and TOTP are mandatory. Local QR generation, manual key entry and one-time backup codes are supported. New users first change their temporary password; every protected operation rereads the current DB user/session, checking ban, expiry, password-change flag and server-only `mfaVerifiedAt`. MFA proof is recorded only after successful TOTP/backup verification, including enrollment's rotated session. Sessions are eight hours without refresh, host-only HttpOnly cookies, Secure in production. PostgreSQL stores auth rate counters and two-factor attempt locks.
- `papapasta.public` contains all application tables: Better Auth user/account/session/verification/two-factor/rate-limit, restaurants, menus, categories, groups, items, media assets, audit log and QR codes. Migration 0001 moves existing tables and the role enum without recreating data; the Drizzle migration ledger remains in its service schema. Last login is recorded after successful MFA, with unknown historical values left null. Drizzle schemas live in `src/server/db/schema/`; checked-in additive migrations live in `drizzle/`. Existing Docker Compose and DATABASE_URL are preserved. Secrets stay in ignored local environment files.
- Original static menu configurations are **seed inputs only**. `db:seed` adds missing stable IDs without overwriting edits. Ten independent menu sections include both restaurants' recommendations, main menus, autumn/children menus, PapaPasta wines and Centro breakfasts. Recommendations retain independent prices. Non-numeric/range/empty prices remain display strings; group notes, columns and order are retained.
- Public menu pages and recommendations read PostgreSQL through a restaurant-tagged cache. There is no silent static-data fallback. Admin saves lock a menu row, compare its version, update content/version/audit in one transaction and invalidate the restaurant tag. Concurrent stale writes fail explicitly. Administrators can create/edit/delete dishes, categories and groups, edit section labels/notes/column settings, reorder dishes within groups with arrows or drag-and-drop, and transfer dishes between sections/restaurants with stable-order locks and version checks on both sections. Nonempty categories/groups cannot be deleted; search disables reordering. Auth/content server actions always enforce access; UI navigation is not a guard.
- Dish images are optional, one per item or recommendation. Sharp validates actual JPEG/PNG/WebP bytes, rejects animation, caps input at 5 MB/25 MP, rotates, removes metadata and creates WebP up to 1600 px plus individual blur. Server-only S3 SDK uploads unique keys below `papapasta/menu-images/` in R2. Image attachment occurs only after successful upload and content commit. Replaced/failed assets become orphaned; cleanup only deletes unreferenced application objects older than a day.
- `R2_PUBLIC_BASE_URL` determines the exact allowed Next Image source/prefix. R2 credentials never enter client bundles. Without R2 configuration, text editing works and photo upload reports unavailability. Public lists retain their text layout without photos. PapaPasta photo thumbnails retain the existing shared image viewer; Centro uses the dish-card routes described below. Banners, galleries, PNG drink book, contacts and promotions remain outside the editor.
- `admin:bootstrap-sql` generates ignored local SQL with a Better Auth password hash; the operator applies it manually. No real admin is created automatically. The local audited `admin:reset-2fa` recovery procedure remains available. The panel can reset another account after checking the current administrator password, with persistent per-actor rate limiting, session/challenge revocation and audit. User management serializes destructive operations and blocks self-removal/demotion and removal/demotion of the last active administrator. Generated temporary passwords are shown once and never stored or audited in plaintext. Password changes/resets and bans revoke sessions and pending login challenges. SMTP/email recovery is not configured.
- Detailed setup, environment, migration, seed, first-user, recovery and media-cleanup instructions are in `docs/admin.md`. Integration tests use an isolated disposable database, never working data. Live R2 and browser/production validation remain environment-dependent and must be reported separately.

**Confirmed admin UI revision (2026-11-03)**
- Sidebar: Users, Menus and QR Codes; responsive navigation uses the existing accessible native Modal. The profile menu opens profile, required 2FA/backup-code settings, password change and sign out within existing security routing. Existing Papa Pasta SVG wordmarks are retained.
- QR codes store restaurant, name, direct HTTP(S) URL, active flag, author and timestamps in `public.qr_codes`. SVG previews and downloadable PNGs are generated locally. Inactive is informational: downloaded direct-link QR codes cannot be revoked. No redirect service, QR file storage, mock entries or SMTP is introduced.
- Session length remains eight hours without remember-me or trusted devices. Forgot Password directs users to an administrator. TOTP setup uses Better Auth and password confirmation; backup codes are shown after verification before continuing.
- Validation and the changed-file inventory are in `docs/admin-ui-implementation.md`. This revision does not migrate the working database or deploy the site.

**Confirmed Centro photo menu and dish URLs (2026-11-04)**
- Only Centro menu/recommendation entries with a ready image use the new full-width photo row: text/price on the left and a 3:2 image on the right from 600px; below 600px the image moves above the text. Categories with photographs use one reading-order column; photo-free categories retain their original column layout and text-only markup. No placeholder photographs are assigned to live content.
- The shared row links to `/menu/<normalized-name>-<12-character-stable-id-hash>`. Slugs derive from existing item IDs without a schema migration. Main-menu and recommendation records keep separate identity, prices and photographs. A renamed item is resolved by its stable suffix and redirected to the current canonical slug. Hidden/no-photo/non-Centro records have no detail page or sitemap entry.
- App Router interception in the Centro layout's `@dish` slot opens a native Modal while keeping the source page, selected category and scroll position. Back/Escape/close restore the page and focus; Forward reopens the card. Default/null home/menu slots avoid catch-all conflicts with metadata routes. Links load details on activation rather than prefetching all dish routes.
- Direct navigation/reload renders a server-composed dish page with the same card, its own title/description/canonical/OG/Twitter image, and escaped JSON-LD MenuItem. Offers are emitted only for simple numeric PLN prices. Centro sitemap includes current published photo-dish URLs. Public text remains Polish.
- Header is inside a scoped Suspense boundary because Cache Components requires it for usePathname on unknown dynamic params; menu navigation remains active on dish URLs. Existing public URLs, schema, authentication, environment and deployment are unchanged.
- Verification and changed-file inventory: `docs/centro-photo-menu.md`.

**Confirmed allergens (2026-11-04)**
- A shared 14-category catalog defines stable allergen IDs, English admin labels, Polish public labels and decorative outline SVG icons. Peanuts and tree nuts are distinct. The catalog follows the European Commission list; assigned values are entered by administrators, never inferred from dish descriptions.
- Migration `0002_dish_allergens` adds `public.menu_items.allergens` as non-null text[] with an empty default. Shared public types allow absent values for static content; database editor DTOs always carry an array. Server validation rejects unknown IDs and normalizes duplicates into catalog order. An omitted field preserves an existing record; an explicit [] clears it. Existing version locks, role/MFA checks, audit and cache invalidation remain in force.
- Add/Edit Dish exposes a native checkbox group under Additional details for both restaurants. Recommendations retain separate values. Centro's modal and standalone dish cards render a gold Alergeny block with labelled circular icons below a divider; empty lists render no block and imply no allergen-free claim. Menu/recommendation rows and PapaPasta public rendering are unchanged.
- Tests and rollout instructions are recorded in `docs/allergens.md`. The working database is not migrated automatically.


**Confirmed shared dish cards — 2026-11-04**
- PapaPasta and Centro use shared `DishRow`, `DishCard`, `DishOverlay`, `server/content/dishes.ts` and `dish-page.ts`. Every resolved dish carries an explicit `restaurantId`; lookup filters that restaurant before matching its stable hash. Metadata/schema origins derive from that identity.
- Both sites expose `/menu/<name>-<12-character SHA256 ID>`. Renames redirect to the current canonical. Only published items with ready photos receive detail URLs, including independent recommendation records. Existing Centro URLs remain unchanged.
- PapaPasta opts into a light photo-row/card theme throughout main, autumn, children, wine and recommendation sections. Centro retains its dark theme. Photos use 3:2 rows, right from 600 px and above below 600 px. Categories containing photos use one column; plain-text categories retain their configured columns and markup.
- Shared allergen icons remain card-only; PapaPasta uses #9A6B2F labels and #c9a579 lines. Empty lists render no section. The existing admin selection and migration 0002 remain unchanged.
- PapaPasta has its own parallel `@dish` slot with explicit empty `/home` and `/menu` routes, default fallback and intercepted dish route. Its landing `/` remains outside this layout. Direct requests render server pages with canonical/social metadata and MenuItem schema.
- Root sitemap now uses PapaPasta public pages and its published photo dishes, including recommendations; robots references https://papapasta.pl/sitemap.xml. Centro keeps its separate sitemap.
- No database schema, environment, R2 objects or deployment changes are part of this extension. See `docs/papapasta-photo-menu.md` for validation and file inventory.


**Confirmed incremental menu loading — 2026-11-04**
- Both menu pages now render static banner images, introduction, ordering links and galleries outside data Suspense. Each section uses shared `DatabaseMenuSection` with `MenuSkeleton`, while `MenuBanner` streams the saved title/subtitle over versioned initial heading copy. Existing main/wine tabs and section layout remain unchanged after loading.
- `publicMenuState` deduplicates the load result per restaurant/render with React cache while retaining `publicMenus` and its existing persistent cache/tag invalidation. Recoverable read failures are converted outside the persistent cache; Next control-flow exceptions are rethrown. Public section selection explicitly filters restaurant and key.
- Missing/empty/hidden-only sections render a Polish unavailable message; empty recommendations render their own message. Read errors render a local message and an explicit retry button using one router.refresh transition. No polling, browser API endpoint or automatic refresh loop is introduced. Static seed dishes are never served as fallback.
- Recommendation frames and heading fallbacks render immediately on both home pages; their lists use three-row skeletons, and saved headings still replace fallback copy. Menu skeletons use four rows, optional decorative tabs, light/dark themes and 3:2 photo placeholders; photos move above text below 600 px. Reduced-motion users get static placeholders.
- No schema, working DB, R2, auth or deployment changes. Verification and inventory are in `docs/menu-loading.md`.


**Confirmed Centro promotional popup — 2026-11-04**
- Centro's persistent layout mounts `PromotionalPopup`, opening the existing native Modal on hydration for direct visits to any Centro page. A component-local useState keeps dismissal through internal navigation/Back/Forward; a fresh document or reload shows the promotion again. PapaPasta, landing and admin do not mount it. No storage/cookie or menu-data dependency is introduced.
- The supplied vertical promotional-image.jpg is shown whole, with a gold frame and blurred dark backdrop, without added visual copy or CTA. Normal viewports fit the image within 16 px margins and 680 px maximum width; short viewports allow internal scrolling with a sticky close control. A hidden transcript supplies the poster's text alternative.
- Existing close/Escape/backdrop, scroll-lock and reduced-motion behavior is reused. Modal accepts an optional keyboard callback used only by this single-control popup to retain Tab/Shift+Tab on its close button; other consumers' behavior remains unchanged.
- No schema, working DB, R2, environment or deployment changes. See `docs/centro-promotional-popup.md` for tests and changed files.


**Confirmed restaurant-branded menu QR codes — 2026-11-04**
- Menu QR preview, saved cards and 1024×1024 PNG export share RestaurantQRCode. The record/selection restaurantId chooses the existing dark PapaPasta logo or a QR-only dark-letter Centro SVG variant, regardless of the URL domain. Logos retain their aspect ratio at 20% matrix width on a 28% white disc, with no green background. QR uses H correction and four-module white margins derived from actual matrix size.
- Verified local logo data is embedded in the SVG, making export self-contained. Generation errors are isolated by a client boundary; oversized saved URLs cannot fail server rendering. Creation/download require a ready branded QR. Existing oversized records retain Copy/Open/Delete. Logo and export failures report English errors without silently exporting an unbranded code.
- Existing records need no migration, and no new files are stored in R2. TOTP/auth QR rendering is unchanged. Validation, decoding evidence and inventory: docs/restaurant-qr-logos.md.

- QR cards use three columns at 1200 px and above, two from 768–1199 px, and one below 768 px. Container queries select 104/120 px thumbnails. Open/Download/Delete are accessible 40×40 icon actions below an ellipsized URL; long headings wrap, and all actions stay inside the card. Updated layout and PNG decoding checks are documented in docs/restaurant-qr-logos.md.


**Confirmed production build repair — 2026-11-04**
- Removed global Sass additionalData injection: imports belong to each entrypoint/module, including explicit variables in styles/index.scss. Legacy CookiePolicy/Cookie/GoTopBtn use the existing toRem helper and defined palette values; Cookie Policy remains available.
- The nonfunctional Sfora shop `/products/[id]` route now returns 404 with no foreign API request or product metadata. Its obsolete layout/stylesheet and unreferenced HeaderActions/Dropdown shop components were removed. No restaurant route or administration functionality was removed.
- Full default Turbopack production build, all 36 generated static pages, tsc --noEmit and 31 targeted tests pass. Production HTTP checks passed for both restaurant hosts, admin login, sitemap, Cookie Policy and legacy product 404. Earlier reported build/type blockers are resolved; details and deployment instructions are in docs/production-build-fix.md.
