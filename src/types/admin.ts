import type { AllergenId } from '@/config/allergens';
import type { MenuCategory, MenuItem } from './menu';
export type EditorItem = MenuItem & { allergens: AllergenId[]; groupId: string; portion: string; price: string; description: string[]; isNew: boolean; visible: boolean; imageId: string | null; imageAlt: string; sortOrder: number };
export type EditorCategory = Omit<MenuCategory, 'groups'> & { groups: { id: string; title: string; note: string; afterNote: string; items: EditorItem[] }[] };
export type EditorMenu = { id: string; restaurantId: string; key: string; title: string; subtitle: string; version: number; categories: EditorCategory[] };
export type AdminUserRow = { id: string; name: string; email: string; role: 'admin' | 'user'; banned: boolean; twoFactorEnabled: boolean; mustChangePassword: boolean; createdAt: string; lastLoginAt: string | null };
export type QRCodeRow = { id: string; restaurantId: string; name: string; url: string; active: boolean };
