import type { FixedMenuKey } from '@/types/menu';
export const FIXED_MENU_KEYS = ['main', 'kids', 'drinks'] as const satisfies readonly FixedMenuKey[];
export const fixedMenuDefaults = {
  main: { title: 'MENU GŁÓWNE', subtitle: 'specjalności lokalu' },
  kids: { title: 'Menu Bambini', subtitle: '' },
  drinks: { title: 'Napoje', subtitle: '' },
} satisfies Record<FixedMenuKey, { title: string; subtitle: string }>;
export function isFixedMenuKey(key: string): key is FixedMenuKey {
  return FIXED_MENU_KEYS.some(value => value === key);
}
