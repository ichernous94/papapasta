# Centro screenshot menu import — 2026-11-10

The supplied Centro screenshots replace only Centro's active menu. PapaPasta retains its completed 0006 inventory and all subsequent edits. The same three fixed sections, editable section names/banners, public layouts and administration controls remain.

## Inventory and defaults

`src/server/content/defaults/centro-menu-2026-11.json` is the versioned source for a fresh install. Data-only migration `0007_centro_menu_refresh.sql` embeds an immutable copy; a test checks equality. Both restaurant defaults now come from their independent screenshot manifests. Historical config fixtures remain for upgrade tests, with no public fallback.

| Section | Categories | Priced positions, including additions |
| --- | --- | --- |
| main | Śniadanie (do 12:00), Przystawki, Sałatki, Zupy, Makarony, Dania główne, Pizza, Desery | 82 |
| kids | Menu Bambini, with Makarony / Pizza / Dania główne groups | 5 |
| drinks | Napoje zimne, Napoje gorące | 28 |

Total: 115 positions across 11 categories. Breakfast keeps all ten entries, grouped into Na słono / Na słodko with two columns on desktop and a stacked layout on mobile. Cold and hot drinks remain in Centro's drinks section, unlike PapaPasta's requested main-menu placement. Piwo, wines and cocktails are not introduced into Centro without a source screenshot. Pizza has 20 entries and five priced additions; steaks have eight additions and their sauce note. Written Matecznik descriptions and milk/supplement options are retained.

Screenshot hearts, peppers and green crossed-meat symbols set the existing independent recommended/spicy/meatless fields. White gluten-free icons are omitted under the user's existing instruction. Centro-specific differences are retained, including non-recommended Zuppa di pesce and Insalata di fegatini glassati, Crema di pori, Tagiatelle ’Nduja, goose, steak/risotto dishes, four desserts and Centro prices. Allergens already explicitly assigned to matched records survive; new records start with no allergen assignments. No ingredient-based inference is made.

## Migration and media

0007 uses the same transactional archive/import approach as 0006. It locks only Centro restaurant/menu rows, validates ownership, retains matching storage identities, archives unmatched content and advances fixed menu versions. Old items, groups, categories, recommendations and section rows are retained. Archived records remain excluded from administration, public menu, detail lookup and sitemap by the existing fixed-key readers. Existing section titles, subtitles and banner references are preserved.

Centro dish photo references and alternative text are cleared, including archived items, so correct photos can be uploaded later. No media row/status or R2 file is modified or deleted, and no orphan-marking/cleanup operation runs. PapaPasta, galleries, promotional articles and banners remain intact. Without a photo, a dish has no photo detail link/sitemap entry; adding a photo enables it again, and matching identities continue resolving the hash in older dish URLs. Repeated seed/migration runs do not replace subsequent edits or uploaded photos.

Migration audit uses `menu.screenshot-import`, target Centro and revision `centro-menu-2026-11`. No schema, dependency, auth or deployment setting changes are involved. The PapaPasta 0006 regression test is explicitly bounded to its historical migration set so it continues testing that import independently of this intentional Centro replacement.

## Verification

- TypeScript and targeted ESLint passed. The existing affected component/unit checks passed (27). PostgreSQL/admin checks passed (17), including both independent imports, fresh-install flag values, failed-import rollback, ID retention, allergen preservation, media isolation, version conflicts and migration/seed idempotence. Existing category ordering, transfers, auth/MFA and referenced-media checks remain covered.
- Production build generated all 39 static routes with an intentionally unavailable DATABASE_URL, confirming no build-time menu read.
- An isolated PostgreSQL instance rehearsed 0007 against a content-only snapshot of the connected database; authentication records were not copied. It produced 115 active positions, reused 87 dish IDs and retained 31 old Centro items in archives, while clearing five old dish-photo references. Every existing item/category/group/menu ID survived. All PapaPasta rows, all 16 media rows, galleries, promotions and section headings/banners were compared unchanged.
- Local production Chromium verification exercises every Centro category, breakfast groups, prices/supplements, badges, keyboard navigation and overflow at 320, 375, 768 and 1440 px, with a PapaPasta overflow regression check at all four sizes. Physical iPhone/Safari and Android/Chrome are not part of this data-import verification.

## Application

Apply normal migrations and seed before serving updated code in another environment. Existing initialized menus are not overwritten by seed. Restart an application already running during a CLI migration to refresh its in-memory public data cache; ordinary administrator edits continue using existing tag/path invalidation. Website deployment remains a separate task.

0007 was applied successfully to the currently connected database on 2026-11-10 after the isolated and browser checks. Verified result: 115 active Centro positions (82 / 5 / 28), 87 retained dish IDs, all 118 previous Centro items preserved with 31 archived, and five dish-photo references detached. All 16 media rows/statuses, every PapaPasta menu/category/group/item row, section headings/banners, galleries and promotions were unchanged. Subsequent migration/seed verification did not change the result. The content-only pre-import backup is `/private/tmp/centro-menu-connected-before-import.json`, mode 0600, outside the repository. Local desktop/mobile screenshots were visually reviewed; no browser runtime exceptions or horizontal document overflow were found. No website was deployed.
