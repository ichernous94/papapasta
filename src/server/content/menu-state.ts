import { unstable_rethrow } from 'next/navigation';
import type { EditorMenu } from '@/types/admin';
import type { RestaurantId } from './dishes';

export type MenuLoadState = { status: 'ready'; menus: EditorMenu[] } | { status: 'error' };

// Catch outside the persistent cache: a transient failure must be retryable.
export async function loadMenuState(load: () => Promise<EditorMenu[]>): Promise<MenuLoadState> {
  try { return { status: 'ready', menus: await load() }; }
  catch (error) { unstable_rethrow(error); return { status: 'error' }; }
}

export function findMenuSection(state: MenuLoadState, restaurantId: RestaurantId, key: string) {
  return state.status === 'ready' ? state.menus.find(menu => menu.restaurantId === restaurantId && menu.key === key) : undefined;
}

export function publishedCategories(menu: EditorMenu) {
  return menu.categories.map(category => ({ ...category, groups: category.groups.map(group => ({ ...group, items: group.items.filter(item => item.visible) })) }));
}

export function hasPublishedItems(menu: EditorMenu) {
  return menu.categories.some(category => category.groups.some(group => group.items.some(item => item.visible)));
}

// Existing special sections retain their own layouts/anchors; all other sections render dynamically.
const builtInSections = {
  papapasta: new Set(['main', 'recommendations', 'autumn', 'kids', 'wine']),
  centro: new Set(['main', 'recommendations', 'breakfast', 'autumn', 'kids']),
};
export function additionalMenuSections(state: MenuLoadState, restaurantId: RestaurantId) {
  return state.status === 'ready' ? state.menus.filter(menu => menu.restaurantId === restaurantId && !builtInSections[restaurantId].has(menu.key)) : [];
}
