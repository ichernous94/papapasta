# PapaPasta screenshot menu import — 2026-11-10

The 18 supplied menu screenshots replace PapaPasta's active menu data. Centro is unchanged. This intentionally supersedes migration 0005's placement of PapaPasta cold/hot non-alcoholic drinks: both now belong to the main menu, as requested in the latest menu inventory.

## Content and source

`src/server/content/defaults/papapasta-menu-2026-11.json` is the versioned default dataset. Its immutable copy is embedded in data-only migration `0006_papapasta_menu_refresh.sql`; a test checks their equality. Fresh databases use the same dataset through `seed-data.ts` and `seed.ts`. The old fixtures remain available for historical upgrade tests and Centro defaults, and are not a public fallback.

| Section | Categories | Positions, including priced additions |
| --- | --- | --- |
| main | Przystawki, Sałatki, Zupy, Makarony, Dania główne, Pizza, Desery, Napoje zimne, Napoje gorące | 97 |
| kids | Menu Bambini, with Makarony / Pizza / Dania główne groups | 5 |
| drinks | Koktajle, Koktajle bezalkoholowe, Wina Czerwone, Wina Białe, Wermuty, Whisky, Piwo, Pozostałe alkohole | 49 |

There are 151 positions across 18 categories. Piwo has separate draught/bottled groups. The final screenshot is Pozostałe alkohole, despite the repeated Piwo label in the initial list. Finlandia appears once. Four vermouths are present. Screenshot hearts, peppers and crossed-meat symbols initialize independent `recommended`, `spicy` and `meatless` flags. The user explicitly omitted white gluten-free icons and green wine leaves. Written gluten-free pasta options, supplements, ranges, portions and other notes remain; existing presentation removes currency from displayed amounts.

Existing explicitly assigned allergen arrays are retained on matched identities. New records have empty allergen arrays: ingredient descriptions are not used to infer allergen declarations. Meatless remains a separate boolean, shown/edited beside allergens; only recommended/spicy badges appear beside dish names.

## Migration guarantees

- Drizzle applies 0006 transactionally once. It locks the PapaPasta restaurant and menu rows. The schema, dependencies, auth, R2 configuration and deployment settings do not change.
- Existing fixed section identities, names, subtitles and banners survive. Their versions advance, rejecting stale administrator writes.
- Known matching categories/groups/items reuse their original storage IDs, including moved wine and dessert records. New containers have explicit stable IDs. Migration refuses ownership collisions with another restaurant.
- Old containers and unmatched items remain under `archive-menu-2026-11`; recommendations retain their existing archive. Cloned archive containers keep unmatched items out of groups reactivated for the new public menu. No old item/category/group is deleted. Fixed-key public/admin readers, detail lookup and sitemap exclude archives.
- All PapaPasta dish `image_id` values are cleared and `image_alt` reset, including archived dishes. Media rows/statuses and R2 files are untouched. No orphan-marking or object-cleanup operation runs. Banners, galleries and promotional media references remain intact.
- Dishes without photographs have no photo detail links/sitemap entries under the existing design. Uploading the right photo enables their detail page again; matched IDs retain the hash used to resolve earlier dish URLs, including after a name change.
- Existing-section seed guards prevent reruns from restoring deleted content, overwriting administrator changes or clearing subsequently uploaded photos. A fresh database is initialized directly with this menu; 0006 skips an absent PapaPasta restaurant before the seed.
- The import is audited as `menu.screenshot-import` with revision, item counts and detached-photo count.

## Verification and application

Passed TypeScript, targeted ESLint, 27 component/unit checks, and 15 PostgreSQL/admin checks including the import. Database coverage checks the immutable manifest, fresh-install flags, failed-import rollback, old identity retention, archived extras, preserved allergen assignments, Centro/media/banner/gallery/promotion isolation, stale versions, repeat migrations/seeds and edits/photos after import. Existing auth/MFA, category ordering, transfers and media-reference protection checks also pass.

Production build completed all 39 static routes with DATABASE_URL deliberately pointing to an unavailable local port, verifying no build-time content read. Production Chromium checks exercised every PapaPasta category at 320, 375, 768 and 1440 px, prices/notes without currency, hearts/peppers, keyboard category selection, one Finlandia, the wine anchor and no old dish image URLs. Both restaurant menus had no document overflow or browser runtime exceptions at those widths. Desktop and mobile screenshots were visually reviewed. Physical iPhone/Safari and Android/Chrome were not tested in this data-import task.

Rehearsal used a content-only copy of the connected database in isolated PostgreSQL, without copying authentication records. After successful checks, 0006 was applied to the currently connected database on 2026-11-10. Result: 151 active PapaPasta positions; 86 reused dish IDs; all 120 previous PapaPasta records retained, with 34 now archived; five old dish-photo links detached. All 16 media records, all Centro data, section headings/banners, galleries and promotions were verified unchanged. A content-only pre-import backup is stored locally at `/private/tmp/papapasta-menu-connected-before-import.json` with mode 0600; it is not committed. Repeat migration and seed checks preserved the resulting content.

For a separate environment, apply normal migrations before serving this code (`db:migrate`, then `db:seed`). Restart an already running application after a CLI data migration so its in-memory public menu cache reads the new data. Application edits continue using existing restaurant-tag/path invalidation. No website was published or deployed by this task.
