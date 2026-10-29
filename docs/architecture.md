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
- A later `src/proxy.ts` will map approved hostnames to separate internal route branches without changing public URLs. Internal route paths must not be exposed as duplicate public pages.
- Each site will have its own layout and metadata. The root layout remains shared and contains no restaurant-specific metadata.
- Domain routing and the administration interface remain subsequent implementation steps; the landing page does not implement hostname routing.

**Confirmed landing page**
- The restaurant-selection page lives at `src/app/(landing)/page.tsx`, outside the existing `(main)` layout. Its public URL remains `/` and it exports the full PapaPasta metadata with its own canonical and Open Graph URL.
- The landing page has its own `main` and uses `src/components/SectionHome/` with colocated SCSS. It does not include the legacy Header, Footer, Cookie or GoTopBtn.
- Use the supplied images by their agreed filenames: `papapasta-pizza-wino-steki.jpg` for the PapaPasta panel and `papapasta-centro.jpg` for Centro, even though their interior photographs do not match those names. Do not rename the assets.
- The two panels are side by side from 1024 CSS px and stacked below that width. Center the content in both layouts, preserve safe padding, and allow panels to grow when text needs more space.
- Statically import both JPEGs and use `next/image` blur placeholders with responsive sizes. Preserve clear SVG logos and darken only the background photographs.
- The PapaPasta landing link opens the internal `/home` route. Centro still opens `https://centro.papapasta.pl/` in the same tab until its internal hostname routing is implemented.
- Shared `src/components/ui/Button/` supports typed anchor and native button modes. Use Next Link for internal destinations, native anchors for external destinations, visible keyboard focus, and a light fill with dark text on hover.

**Confirmed PapaPasta home page**
- The `/home` route lives in `src/app/(papapasta)/home/page.tsx`. Its restaurant layout contains the shared Header, main content and Footer, independently of landing and legacy `(main)` UI. The page sets its canonical and Open Graph URL to `/home` using the PapaPasta metadata defaults.
- Compose the page from VideoHero, AboutSection, DishesSection, WineSection, Recommendations and Gallery under `src/components/PapaPastaHome/`, with colocated SCSS Modules. Keep static copy, navigation, contacts, opening hours and typed recommended dishes in `src/config/papapasta.ts`.
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
- The menu page uses eight food/drink categories, a static autumn menu, a children's menu and three alcohol categories. Keep the supplied assortment in `src/config/papapasta-menu.ts`, with stable IDs, optional portions/descriptions/new badges and display-only string prices that also support ranges and nonnumeric labels. No database or admin coupling is introduced.
- MenuList is shared presentation. MenuTabs is a small client component with independent local state for each tab group, accessible keyboard navigation and horizontally scrollable mobile tabs. All panel content is server-composed and present in the initial render; inactive panels are hidden. Pizza and soft drinks use two explicit reading-order columns from 1024 px, one below. `/menu#kartawin` remains the wine-section anchor with a dynamic sticky-header offset.
- Contact details, social URLs, maps URLs and shared page copy live in `src/config/papapasta.ts`. The contact page reuses Reservation, embeds the supplied lazy Google Maps iframe, offers an ordinary external map link, and finishes with the shared photo strip. Tripadvisor stays noninteractive pending a real profile URL.
- Every public page has its own title, description, canonical and Open Graph URL, keeping shared robots/brand defaults. A permanent Next.js redirect (308) maps legacy `/menu-restauracji` to `/menu`; no other route or domain migration is implied.
- Restaurant pages, including `/home`, share bounded spacing and compact mobile buttons via layout-scoped CSS variables. Landing styles remain unchanged. Light surfaces remain plain; Allura is applied to decorative subtitles on home, venue, menu and contact pages, and the home/menu price columns, using normal style and weight 400. Decorative Allura subtitles are 48px and use $colorGoldText (#D7BB91); price sizes and inherited dark colors remain unchanged.
- Administration, APIs, hostname routing, and the broader sitemap/robots migration remain future stages. Autumn content is static and does not expire automatically.

**Confirmed motion and navigation refinements**
- Reveal is a small client component using the installed react-intersection-observer. Section/page headings enter from 36px above over 1200ms once; content/gallery photographs fade and scale from 1.05 to 1 over 1200ms inside clipped containers, with a short stagger. Image scale is independent of the hover transform. Server HTML remains visible without JS. Respect prefers-reduced-motion and preserve blur placeholders.
- Header navigation explicitly scrolls to the document top after the target route commits and the exiting menu releases its scroll lock. Re-selecting the current page also goes to the top. Wine hash links retain their section-anchor behavior.
- Scroll locking changes only the root viewport overflow, preserving body overflow so a second scroll container cannot detach the sticky Header. Overlay focus changes use preventScroll. Keep locks and focus containment until exit animations finish, including rapid reopen and concurrent overlays.
- Burger navigation is viewport-positioned immediately below the measured Header, with a sliding/fading entrance and exit, independent internal scrolling and a lightly dimmed backdrop. Header has a visible bottom shadow.
- The gallery dialog has a transparent surface and a lightly dimmed page backdrop, with centered contain-fit photographs, a 70% dark backdrop with 4px blur, and 650ms entry/exit. Scroll lock persists through the closing animation. Native dialog focus behavior and Swiper keyboard/swipe support are retained.
- Public text and logos use slightly smaller bounded sizes, including landing. Shared buttons retain at least a 44px target with compact padding. Hover transitions are gradual; active menu tabs use gold text without a gold underline. Keyboard focus indicators remain visible.

**Not yet decided**
- Detailed page-to-route mapping beyond the entry URLs above, including migration redirects.
- Admin role model and content editing workflow.
- Database, ORM, authentication/2FA provider and media storage provider.

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
- Keep typed restaurant metadata defaults in `src/config/metadata.ts`; apply PapaPasta defaults to the landing page and PapaPasta/legacy public layouts. Centro defaults and admin noindex/nofollow metadata will be connected when their route branches are implemented.
- Preserve the supplied Polish titles and descriptions. Public metadata allows indexing and following, large image previews and unrestricted snippet/video previews; Open Graph uses `website` and `pl_PL`.
- Set canonical and Open Graph URLs per page, not to `/` in a shared layout. Spread shared Open Graph fields when adding page-specific values because nested metadata objects are replaced rather than deeply merged.
- Do not invent keywords, social images or social account handles. JSON-LD, robots.txt, sitemap and legacy product metadata require separate migration work before launch.

- For new components, default to `src/components/ComponentName/index.tsx` and `ComponentName.module.scss`, matching the existing project if it differs.
- Prefer reusable components for shared navigation, buttons, cards and layout patterns.
- Keep restaurant-specific copy and imagery separate from shared presentation when helpful.
- Use semantic HTML, accessible labels, keyboard-accessible controls and responsive layouts.
- Do not introduce a UI framework or new design-token system unless agreed upon.

## 5. Data and state

- Server Components may fetch server-side data directly through server-only modules.
- Use TanStack Query for interactive client-side server state when it adds value.
- Use Zustand for shared client UI state; prefer local React state for local interactions.
- Use react-hook-form for nontrivial forms; validation strategy remains to be selected.
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
- Detailed host-to-route mapping, local domain testing and deployment domain configuration, following the confirmed single-deployment direction.
- Admin permission model and content editing workflow, using the confirmed `admin.papapasta.pl` hostname.
- Content model for restaurants, menus, pages and media.
- PostgreSQL/other database and ORM choice.
- Authentication, session management and 2FA.
- Media upload, image optimization and CDN strategy.
- SEO migration inventory and redirect mapping.

## 8. Codex working agreement

- **Analyze:** inspect relevant code and references, explain findings, do not modify files.
- **Plan:** propose alternatives, tradeoffs and a file-level implementation plan.
- **Implement:** after approval, change only agreed files and run relevant checks.
- **Review:** inspect diffs, report risks and verify screenshots where tools are available.
