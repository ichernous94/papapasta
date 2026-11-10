import { isFixedMenuKey } from '@/config/menu-sections';
import { randomUUID } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import type { createDatabase } from '@/server/db/connection';
import { menus, categories, groups, items, auditLog } from '@/server/db/schema';
import { itemInputSchema, structureInputSchema } from '@/validation/admin';
import { z } from 'zod';
type Database = ReturnType<typeof createDatabase>['db'];
type Transaction = Parameters<Parameters<Database['transaction']>[0]>[0];
export { ContentError } from './errors';
import { ContentError } from './errors';
import { orphanUnused, attachUpload } from '@/server/media/references';
async function lockMenu(tx: Transaction, menuId: string, version: number) {
    const [menu] = await tx.select().from(menus).where(eq(menus.id, menuId)).for('update');
    if (!menu)
        throw new ContentError('Menu section not found');
    if (!isFixedMenuKey(menu.key)) throw new ContentError('This menu section is archived and cannot be edited');
    if (menu.version !== version)
        throw new ContentError('This menu was already changed by another editor. Copy your changes and refresh the page.');
    return menu;
}
async function groupBelongs(tx: Transaction, groupId: string, menuId: string) {
    const [row] = await tx.select({ id: groups.id }).from(groups).innerJoin(categories, eq(groups.categoryId, categories.id)).where(and(eq(groups.id, groupId), eq(categories.menuId, menuId)));
    if (!row)
        throw new ContentError('Group does not belong to this menu');
}
async function finish(tx: Transaction, actorId: string, menuId: string, action: string, targetId: string, details: Record<string, unknown> = {}) {
    await tx.update(menus).set({ version: sql `${menus.version} + 1`, updatedAt: new Date() }).where(eq(menus.id, menuId));
    await tx.insert(auditLog).values({ actorId, action, targetId, details: { menuId, ...details } });
}
export async function saveItem(db: Database, actorId: string, raw: unknown, uploadId?: string) {
    const input = itemInputSchema.parse(raw);
    return db.transaction(async (tx) => {
        // Lock all involved menus in a stable order to avoid cross-transfer deadlocks.
        const menuIds = [...new Set([input.menuId, input.sourceMenuId ?? input.menuId])].sort();
        for (const menuId of menuIds) await lockMenu(tx, menuId, menuId === input.menuId ? input.version : input.sourceVersion ?? 0);
        const menu = (await tx.select().from(menus).where(eq(menus.id, input.menuId)))[0];
        await groupBelongs(tx, input.groupId, input.menuId);
        const old = input.id ? (await tx.select().from(items).where(eq(items.id, input.id)))[0] : undefined;
        if (input.id && !old)
            throw new ContentError('Dish not found');
        if (old)
            await groupBelongs(tx, old.groupId, input.sourceMenuId ?? input.menuId);
        if (uploadId) await attachUpload(tx, actorId, uploadId);
        const id = old?.id ?? randomUUID();
        const imageId = uploadId ?? (input.removeImage ? null : old?.imageId ?? null);
        const values = { meatless: input.meatless ?? old?.meatless ?? false, recommended: input.recommended ?? old?.recommended ?? false, spicy: input.spicy ?? old?.spicy ?? false, allergens: input.allergens ?? old?.allergens ?? [], groupId: input.groupId, name: input.name, portion: input.portion, price: input.price, description: input.description.split(/\r?\n/).filter(line => line.trim()), isNew: input.isNew, visible: input.visible, imageAlt: input.imageAlt, imageId };
        if (old && old.groupId !== input.groupId) {
            const [last] = await tx.select({ order: sql<number>`coalesce(max(${items.sortOrder}), -1)` }).from(items).where(eq(items.groupId, input.groupId));
            await tx.update(items).set({ sortOrder: Number(last.order) + 1 }).where(eq(items.id, id));
        }
        if (old)
            await tx.update(items).set(values).where(eq(items.id, id));
        else {
            const [last] = await tx.select({ order: sql<number> `coalesce(max(${items.sortOrder}), -1)` }).from(items).where(eq(items.groupId, input.groupId));
            await tx.insert(items).values({ id, ...values, sortOrder: Number(last.order) + 1 });
        }
        if (old?.imageId && old.imageId !== imageId) {
            await orphanUnused(tx, old.imageId);
        }
        await finish(tx, actorId, menu.id, old ? 'item.update' : 'item.create', id, { visible: input.visible, imageId, allergens: values.allergens, meatless: values.meatless, recommended: values.recommended, spicy: values.spicy });
        if (old && input.sourceMenuId && input.sourceMenuId !== menu.id) await finish(tx, actorId, input.sourceMenuId, 'item.transfer', id);
        return menu.restaurantId;
    });
}
export const reorderSchema = z.object({ menuId: z.string(), version: z.number().int().positive(), id: z.string(), direction: z.enum(['up', 'down']) }).strict();
export async function moveItem(db: Database, actorId: string, raw: unknown) {
    const input = reorderSchema.parse(raw);
    return db.transaction(async (tx) => {
        const menu = await lockMenu(tx, input.menuId, input.version);
        const [item] = await tx.select().from(items).where(eq(items.id, input.id));
        if (!item)
            throw new ContentError('Dish not found');
        await groupBelongs(tx, item.groupId, menu.id);
        const siblings = await tx.select().from(items).where(eq(items.groupId, item.groupId)).orderBy(items.sortOrder, items.id);
        const index = siblings.findIndex(i => i.id === item.id);
        const target = index + (input.direction === 'up' ? -1 : 1);
        if (target < 0 || target >= siblings.length)
            return menu.restaurantId;
        [siblings[index], siblings[target]] = [siblings[target], siblings[index]];
        for (const [order, sibling] of siblings.entries())
            await tx.update(items).set({ sortOrder: order }).where(eq(items.id, sibling.id));
        await finish(tx, actorId, menu.id, 'item.reorder', item.id, { direction: input.direction });
        return menu.restaurantId;
    });
}
export async function saveStructure(db: Database, actorId: string, raw: unknown, uploadId?: string) {
    const input = structureInputSchema.parse(raw);
    return db.transaction(async (tx) => {
        const menu = await lockMenu(tx, input.menuId, input.version);
        if (input.kind === 'menu') {
            if (input.id !== menu.id || !input.title)
                throw new ContentError('Invalid menu section title');
            if (uploadId) await attachUpload(tx, actorId, uploadId);
            const bannerImageId = uploadId ?? (input.removeBanner ? null : menu.bannerImageId);
            await tx.update(menus).set({ title: input.title, subtitle: input.note, bannerImageId }).where(eq(menus.id, menu.id));
            if (menu.bannerImageId && menu.bannerImageId !== bannerImageId) await orphanUnused(tx, menu.bannerImageId);
        }
        else if (input.kind === 'category') {
            if (uploadId || input.removeBanner) throw new ContentError('Only menu sections have banners');
            if (['main', 'drinks'].includes(menu.key) && !input.title) throw new ContentError('The category name cannot be empty');
            const result = await tx.update(categories).set({ label: input.title, note: input.note, ...(input.columns !== undefined ? { columns: input.columns } : {}), ...(input.columnBreak !== undefined ? { columnBreak: input.columnBreak } : {}) }).where(and(eq(categories.id, input.id), eq(categories.menuId, menu.id))).returning({ id: categories.id });
            if (!result.length)
                throw new ContentError('Category not found');
        }
        else {
            if (uploadId || input.removeBanner) throw new ContentError('Only menu sections have banners');
            await groupBelongs(tx, input.id, menu.id);
            await tx.update(groups).set({ title: input.title, note: input.note, afterNote: input.afterNote }).where(eq(groups.id, input.id));
        }
        await finish(tx, actorId, menu.id, `${input.kind}.update`, input.id);
        return menu.restaurantId;
    });
}

export const contentOperationSchema = z.discriminatedUnion('action', [
    z.object({ action: z.literal('deleteItem'), menuId: z.string(), version: z.number().int().positive(), id: z.string() }),
    z.object({ action: z.literal('reorder'), menuId: z.string(), version: z.number().int().positive(), groupId: z.string(), ids: z.array(z.string()).min(1) }),
    z.object({ action: z.literal('createCategory'), menuId: z.string(), version: z.number().int().positive(), title: z.string().trim().min(1).max(200), note: z.string().max(6000), columns: z.number().int().min(1).max(2), columnBreak: z.number().int().min(1) }),
    z.object({ action: z.literal('createGroup'), menuId: z.string(), version: z.number().int().positive(), categoryId: z.string(), title: z.string().trim().max(200), note: z.string().max(6000), afterNote: z.string().max(6000) }),
    z.object({ action: z.literal('deleteCategory'), menuId: z.string(), version: z.number().int().positive(), id: z.string() }),
    z.object({ action: z.literal('deleteGroup'), menuId: z.string(), version: z.number().int().positive(), id: z.string() }),
    z.object({ action: z.literal('categoryLayout'), menuId: z.string(), version: z.number().int().positive(), id: z.string(), columns: z.number().int().min(1).max(2), columnBreak: z.number().int().min(1) }),
]);
export async function changeContent(db: Database, actorId: string, raw: unknown) {
    const input = contentOperationSchema.parse(raw);
    return db.transaction(async tx => {
        const menu = await lockMenu(tx, input.menuId, input.version);
        let target = 'id' in input ? input.id : randomUUID();
        if (input.action === 'deleteItem') {
            const item = await tx.query.items.findFirst({ where: eq(items.id, input.id) });
            if (!item) throw new ContentError('Dish not found.');
            await groupBelongs(tx, item.groupId, menu.id);
            await tx.delete(items).where(eq(items.id, item.id));
            if (item.imageId) await orphanUnused(tx, item.imageId);
        } else if (input.action === 'reorder') {
            await groupBelongs(tx, input.groupId, menu.id);
            const siblings = await tx.select({ id: items.id }).from(items).where(eq(items.groupId, input.groupId));
            if (new Set(input.ids).size !== input.ids.length || siblings.length !== input.ids.length || siblings.some(i => !input.ids.includes(i.id))) throw new ContentError('The group changed. Refresh before reordering.');
            for (const [order, id] of input.ids.entries()) await tx.update(items).set({ sortOrder: order }).where(eq(items.id, id));
            target = input.groupId;
        } else if (input.action === 'createCategory') {
            const siblings = await tx.select().from(categories).where(eq(categories.menuId, menu.id));
            await tx.insert(categories).values({ id: target, slug: target, menuId: menu.id, label: input.title, note: input.note, columns: input.columns, columnBreak: input.columnBreak, sortOrder: Math.max(-1, ...siblings.map(c => c.sortOrder)) + 1 });
        } else if (input.action === 'createGroup') {
            const category = await tx.query.categories.findFirst({ where: and(eq(categories.id, input.categoryId), eq(categories.menuId, menu.id)) });
            if (!category) throw new ContentError('Category does not belong to this menu.');
            const siblings = await tx.select().from(groups).where(eq(groups.categoryId, category.id));
            await tx.insert(groups).values({ id: target, categoryId: category.id, title: input.title, note: input.note, afterNote: input.afterNote, sortOrder: Math.max(-1, ...siblings.map(g => g.sortOrder)) + 1 });
        } else if (input.action === 'deleteGroup') {
            await groupBelongs(tx, input.id, menu.id);
            if ((await tx.select({ id: items.id }).from(items).where(eq(items.groupId, input.id)).limit(1)).length) throw new ContentError('Move or delete all dishes before deleting this group.');
            await tx.delete(groups).where(eq(groups.id, input.id));
        } else {
            const category = await tx.query.categories.findFirst({ where: and(eq(categories.id, input.id), eq(categories.menuId, menu.id)) });
            if (!category) throw new ContentError('Category not found.');
            if (input.action === 'deleteCategory') {
                if ((await tx.select({ id: groups.id }).from(groups).where(eq(groups.categoryId, input.id)).limit(1)).length) throw new ContentError('Move or delete all groups before deleting this category.');
                await tx.delete(categories).where(eq(categories.id, input.id));
            } else await tx.update(categories).set({ columns: input.columns, columnBreak: input.columnBreak }).where(eq(categories.id, input.id));
        }
        await finish(tx, actorId, menu.id, input.action, target);
        return menu.restaurantId;
    });
}

export async function moveCategory(db: Database, actorId: string, raw: unknown) {
    const input = reorderSchema.parse(raw);
    return db.transaction(async tx => {
        const menu = await lockMenu(tx, input.menuId, input.version);
        const siblings = await tx.select().from(categories).where(eq(categories.menuId, menu.id)).orderBy(categories.sortOrder, categories.id);
        const index = siblings.findIndex(c => c.id === input.id);
        if (index < 0) throw new ContentError('Category does not belong to this menu');
        const target = index + (input.direction === 'up' ? -1 : 1);
        if (target < 0 || target >= siblings.length) return menu.restaurantId;
        [siblings[index], siblings[target]] = [siblings[target], siblings[index]];
        for (const [order, sibling] of siblings.entries()) await tx.update(categories).set({ sortOrder: order }).where(eq(categories.id, sibling.id));
        await finish(tx, actorId, menu.id, 'category.reorder', input.id, { direction: input.direction });
        return menu.restaurantId;
    });
}
