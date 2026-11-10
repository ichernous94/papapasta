// Versioned import source only. Public pages read PostgreSQL, never these fixtures.
import { mainMenu, autumnMenu, kidsMenu, wineMenu } from '@/config/papapasta-menu';
import { papaPastaRecommendations } from '@/config/papapasta';
import { centroMainMenu, centroBreakfast, centroAutumnMenu, centroKidsMenu } from '@/config/centro-menu';
import { centroRecommendations } from '@/config/centro';
import type { MenuCategory, MenuGroup } from '@/types/menu';
import type { RecommendationItem } from '@/types/restaurant';
import papaPastaDefaults from './defaults/papapasta-menu-2026-11.json';
const grouped = (groups: readonly MenuGroup[], columns?: 2): MenuCategory[] => [{ id: 'all', label: '', groups, columns }];
const recommended = (items: readonly RecommendationItem[]) => grouped([{ id: 'recommendations', items: items.map(i => ({ id: i.id, name: i.name, portion: i.weight, description: [i.description], price: String(i.price) })) }]);
export const legacySeedMenus: {
    restaurantId: 'papapasta' | 'centro';
    key: string;
    title: string;
    subtitle: string;
    categories: readonly MenuCategory[];
}[] = [
    { restaurantId: 'papapasta', key: 'main', title: 'MENU GŁÓWNE', subtitle: 'specjalności lokalu', categories: mainMenu },
    { restaurantId: 'papapasta', key: 'autumn', title: 'MENU JESIENNE', subtitle: 'Sapori d’Autunno', categories: grouped(autumnMenu) },
    { restaurantId: 'papapasta', key: 'kids', title: 'MENU', subtitle: 'bambini', categories: grouped(kidsMenu) },
    { restaurantId: 'papapasta', key: 'wine', title: 'WINO', subtitle: 'i inne alkohole', categories: wineMenu },
    { restaurantId: 'papapasta', key: 'recommendations', title: 'Z CAŁEGO SERCA', subtitle: 'polecamy', categories: recommended(papaPastaRecommendations) },
    { restaurantId: 'centro', key: 'main', title: 'MENU GŁÓWNE', subtitle: 'specjalności lokalu', categories: centroMainMenu },
    { restaurantId: 'centro', key: 'breakfast', title: 'MENU ŚNIADAŃ', subtitle: '', categories: grouped(centroBreakfast, 2) },
    { restaurantId: 'centro', key: 'autumn', title: 'JESIENNE SMAKI', subtitle: 'Sapori d’Autunno', categories: grouped(centroAutumnMenu) },
    { restaurantId: 'centro', key: 'kids', title: 'MENU', subtitle: 'bambini', categories: grouped(centroKidsMenu) },
    { restaurantId: 'centro', key: 'recommendations', title: 'Z CAŁEGO SERCA', subtitle: 'polecamy', categories: recommended(centroRecommendations) },
];

// Persist original identities even when their categories/groups now belong to a different section.
import { FIXED_MENU_KEYS, fixedMenuDefaults } from '@/config/menu-sections';
import type { FixedMenuKey } from '@/types/menu';
type SeedItem = MenuGroup['items'][number] & { storageId: string };
type SeedGroup = Omit<MenuGroup, 'items'> & { storageId: string; items: SeedItem[] };
type SeedCategory = Omit<MenuCategory, 'groups'> & { storageId: string; groups: SeedGroup[] };
type SeedMenu = { restaurantId: 'papapasta' | 'centro'; key: FixedMenuKey; title: string; subtitle: string; categories: SeedCategory[] };
function sourceCategories(restaurantId: string, sourceKey: string): SeedCategory[] {
  const menu = legacySeedMenus.find(m => m.restaurantId === restaurantId && m.key === sourceKey);
  return (menu?.categories ?? []).map(category => {
    const storageId = `${restaurantId}:${sourceKey}:${category.id}`;
    return { ...category, storageId, groups: category.groups.map(group => {
      const groupId = `${storageId}:${group.id}`;
      return { ...group, storageId: groupId, items: group.items.map(item => ({ ...item, storageId: `${groupId}:${item.id}` })) };
    }) };
  });
}
export const seedMenus = (['papapasta', 'centro'] as const).flatMap<SeedMenu>(restaurantId => {
  if (restaurantId === 'papapasta') return FIXED_MENU_KEYS.map(key => ({
    restaurantId, key, ...fixedMenuDefaults[key],
    categories: papaPastaDefaults.sections.find(section => section.key === key)!.categories as SeedCategory[],
  }));
  const originalMain = sourceCategories(restaurantId, 'main');
  const autumn = sourceCategories(restaurantId, 'autumn');
  const food = autumn.map(c => ({ ...c, label: 'JESIENNE SMAKI', groups: c.groups.filter(g => g.id !== 'hot-drinks') }));
  const hot = autumn.flatMap(c => c.groups.filter(g => g.id === 'hot-drinks'));
  const sections: Record<FixedMenuKey, SeedCategory[]> = {
    main: [...originalMain.filter(c => c.id !== 'napoje'), ...sourceCategories(restaurantId, 'breakfast').map(c => ({ ...c, label: c.label || 'MENU ŚNIADAŃ' })), ...food],
    kids: sourceCategories(restaurantId, 'kids').map(c => ({ ...c, label: c.label || 'Menu Bambini' })),
    drinks: [...originalMain.filter(c => c.id === 'napoje'), ...sourceCategories(restaurantId, 'wine'), ...(hot.length ? [{ id: 'hot-drinks', storageId: `${restaurantId}:drinks:hot-drinks`, label: 'Gorące napoje', groups: hot }] : [])],
  };
  return FIXED_MENU_KEYS.map(key => ({ restaurantId, key, ...fixedMenuDefaults[key], categories: sections[key] }));
});
