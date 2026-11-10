# Fixed menu sections — 2026-11-10

Both restaurants expose exactly three sections in this order: `main`, `kids`, `drinks`. Initial titles are MENU GŁÓWNE, Menu Bambini and Napoje. Names, subtitles and banners remain editable independently; keys and order do not depend on names.

## Data migration

`0005_fixed_menu_sections` is transactional and changes data only. It preserves old menu rows as an archive, category/group/item IDs and all dish values, media references, visibility, notes and URLs of transferred dishes.

- Main-menu NAPOJE categories, PapaPasta's wine/beer categories and the seasonal Gorące napoje groups move to `drinks`.
- Other seasonal content, Centro breakfasts and additional/custom sections move to main-menu categories. Existing category names are retained; empty names use the former section title.
- Recommendations stay in the database, outside the editor, public menus, dish lookup and sitemap.
- The default MENU / bambini heading becomes Menu Bambini. Existing custom main/kids headings are preserved. Old banner references are retained; PapaPasta's saved wine banner is also used for the new drinks section.
- Menu versions are advanced to reject stale forms. Migration audit entries record the preserved dish count for each restaurant.

New installations seed the fixed structure directly with explicit original storage IDs for transferred categories/groups/items. Seeding initializes only newly inserted menu rows, so repeats cannot overwrite names, restore deleted records, recreate archived sections or duplicate dishes. Existing media/gallery/promotion initialization remains independent and idempotent.

## Editor and public pages

Add Section and section deletion, their dialogs, server action and write operation are removed. Archived sections are rejected by the shared write lock, including transfers and edits from older open clients. Category/group/dish editing, arrows, search, cross-restaurant transfers, validation, audit, concurrency control and invalidation remain.

Only fixed sections are loaded by the shared menu reader, in a fixed order. Public pages compose those three banners/sections explicitly using saved titles and subtitles. Main/drinks retain category tabs; Bambini uses a list with one category and tabs with multiple categories. PapaPasta's existing `/menu#kartawin` link now targets drinks independently of its title. Automatic additional-section rendering is removed.

## Verification

- 49 focused unit/SSR/routing tests pass, as do TypeScript, targeted ESLint and the production build with an unavailable build-time database.
- 13 admin-suite tests pass on a separate temporary PostgreSQL server, including an upgrade from the old populated menu layout, fresh-install/schema snapshot checks, rename/concurrency/media checks and legacy create/delete request rejection.
- A second rehearsal copied only content tables from the configured database into an isolated database: all 238 item records remained byte-for-byte unchanged. The resulting 219 active items and 19 archived recommendations were retained; both restaurants had exactly three available sections. No auth rows or credentials were copied.
- Production Chrome checks pass at 320, 375, 768 and 1440px for both public menus, fixed order/count, no horizontal overflow, drinks placement and the wine anchor. Admin checks cover absence of create/delete controls, retained banner controls, renaming all six sections, three dish-transfer destinations and the resulting public title updates. No browser runtime exceptions occurred.
- Browser/admin mutations were performed only on the isolated copy. Artifacts are under `/private/tmp/fixed-sections-*`.

## Application to the configured database

Apply the checked-in migration after the isolated checks, then run the updated idempotent seed if initialization is needed, and start/restart the updated app. No deployment, auth, dependency or environment configuration changes are required. The completion record below reports the actual application result.

### Completed application — 2026-11-10

Migration 0005 and the updated seed were applied successfully to the configured database after the isolated rehearsals and browser checks. The migration ledger matches the checked-in journal. All 238 item records remained unchanged; all 29 original categories and every original menu row were retained. Group content was also compared, excluding only the approved parent/order changes.

Active sections now contain:

| Restaurant | Main | Bambini | Drinks | Archived recommendations |
| --- | ---: | ---: | ---: | ---: |
| PapaPasta | 57 | 5 | 49 | 9 |
| Centro | 72 | 5 | 31 | 10 |

A pre-migration content-only snapshot is retained at `/private/tmp/fixed-sections-connected-before.json` with owner-only permissions. No auth records or credentials are included. Browser rename tests affected only the isolated copy; the configured database retains its initial section names. No site was published or deployed.

Final runtime verification against the updated configured database also passed: both restaurant `/menu` responses and both sitemaps returned HTTP 200, menu reads reported no database errors, initial Bambini/drinks titles rendered and PapaPasta's wine anchor remained present. The temporary verification server used the project's standard `0.0.0.0` binding and was stopped after verification.
