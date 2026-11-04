// Versioned import source only. Public pages read PostgreSQL, never these fixtures.
import { mainMenu, autumnMenu, kidsMenu, wineMenu } from '@/config/papapasta-menu';
import { papaPastaRecommendations } from '@/config/papapasta';
import { centroMainMenu, centroBreakfast, centroAutumnMenu, centroKidsMenu } from '@/config/centro-menu';
import { centroRecommendations } from '@/config/centro';
import type { MenuCategory, MenuGroup } from '@/types/menu';
import type { RecommendationItem } from '@/types/restaurant';
const grouped = (groups: readonly MenuGroup[], columns?: 2): MenuCategory[] => [{ id: 'all', label: '', groups, columns }];
const recommended = (items: readonly RecommendationItem[]) => grouped([{ id: 'recommendations', items: items.map(i => ({ id: i.id, name: i.name, portion: i.weight, description: [i.description], price: String(i.price) })) }]);
export const seedMenus: {
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
