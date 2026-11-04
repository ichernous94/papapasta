import type { createDatabase } from '@/server/db/connection';
import { restaurants, menus, categories, groups, items } from '@/server/db/schema';
import { seedMenus } from './seed-data';
export async function seedContent(db: ReturnType<typeof createDatabase>['db']) {
    await db.transaction(async (tx) => {
        await tx.insert(restaurants).values([{ id: 'papapasta', name: 'Papa Pasta' }, { id: 'centro', name: 'Papa Pasta Centro' }]).onConflictDoNothing();
        for (const [order, menu] of seedMenus.entries()) {
            const menuId = `${menu.restaurantId}:${menu.key}`;
            await tx.insert(menus).values({ id: menuId, restaurantId: menu.restaurantId, key: menu.key, title: menu.title, subtitle: menu.subtitle, sortOrder: order }).onConflictDoNothing();
            for (const [categoryOrder, category] of menu.categories.entries()) {
                const categoryId = `${menuId}:${category.id}`;
                await tx.insert(categories).values({ id: categoryId, menuId, slug: category.id, label: category.label, note: category.note, columns: category.columns ?? 1, columnBreak: category.columnBreak ?? 1, sortOrder: categoryOrder }).onConflictDoNothing();
                for (const [groupOrder, group] of category.groups.entries()) {
                    const groupId = `${categoryId}:${group.id}`;
                    await tx.insert(groups).values({ id: groupId, categoryId, title: group.title, note: group.note, afterNote: group.afterNote, sortOrder: groupOrder }).onConflictDoNothing();
                    for (const [itemOrder, item] of group.items.entries()) {
                        await tx.insert(items).values({ id: `${groupId}:${item.id}`, groupId, name: item.name, portion: item.portion, price: item.price, description: item.description ?? [], isNew: item.isNew, sortOrder: itemOrder }).onConflictDoNothing();
                    }
                }
            }
        }
    });
}
