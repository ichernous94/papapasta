import type { FixedMenuKey } from '@/types/menu';

export function menuSectionAnchor(key: FixedMenuKey) { return `menu-${key}`; }
// Storage identity survives renames and category reordering, including legacy moved categories.
export function menuCategoryAnchor(key: FixedMenuKey, categoryId: string) { return `${menuSectionAnchor(key)}--${categoryId}`; }
export function readMenuHash(hash: string) {
  try { return decodeURIComponent(hash.replace(/^#/, '')); } catch { return ''; }
}
