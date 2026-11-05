# Menu section creation — 2026-11-05

In Admin → Menus, select the restaurant and use **Add Section** next to the section selector. Enter a name (required, up to 200 characters), an optional subtitle (up to 6000 characters), and an optional JPEG/PNG/WebP banner (up to 5 MB). Without an upload the section uses the restaurant's main-menu photograph. Resetting its banner restores that same default.

After saving, the editor selects the new section and opens Categories. Add a category, then a group, then dishes using the existing controls. An empty section has the existing public unavailable-menu state; unpublished dishes stay hidden. Duplicate names are allowed: section identity uses a generated UUID-based key, independent of its editable name. New sections append after existing menus and retain stable identity when renamed.

Creation uses a dedicated validated Server Action with Admin/MFA checks before upload and again before committing. Restaurant selection is restricted to PapaPasta/Centro; clients cannot supply keys, order, banner IDs or protected-section identities. The transaction locks the restaurant to serialize concurrent creation, attaches only the current actor's pending upload and records `menu.create` audit. Failed unattached uploads use the existing orphan cleanup. The action invokes shared restaurant cache invalidation and returns refreshed menus plus the new `menuId`.

Both public menu pages render additional sections from request-time cached menu data. Existing special sections retain their layouts/anchors; recommendations stay separate. New sections use the restaurant theme, category tabs and the existing dish/card/allergen components. They do not require hardcoded page entries or a rebuild after creation. Renaming/deleting and banner replacement use the existing versioned operations.

## Validation

- TypeScript, targeted ESLint and Admin SCSS compilation passed.
- 22 targeted loading/card/invalidation/unit checks passed.
- 11 isolated PostgreSQL/admin checks passed, including migration upgrade/fresh install, concurrent creation, independent keys/order, upload ownership/rollback, audit, restaurant isolation, category creation, stale-version rejection and deletion/orphan cleanup.
- Production build passed with an unavailable database URL. A local production server using a temporary database rendered newly defined sections on both domains without adding their keys to page code.
- Browser checks at 375, 900 and 1440 px used the real form with test action responses: empty required name, correct restaurant, empty initial fields, upload failure retaining values, section selection/Categories after success and no horizontal overflow. These tests did not access working R2. Physical iPhone/Safari and a live R2 upload were not tested.

Changed areas: shared admin form/banner picker; creation validation/action/transaction; additional public sections and both menu pages; targeted tests; architecture documentation. No dependency, schema/migration, environment or deployment setting changes. Deploy the new application version normally; no database command is required for this feature.
