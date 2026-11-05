'use server';
import { unstable_rethrow } from 'next/navigation';
import { and, eq, sql } from 'drizzle-orm';
import { ZodError } from 'zod';
import { requireEditor } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import { mediaAssets, items, menus } from '@/server/db/schema';
import { prepareUpload } from '@/server/media/upload';
import { saveItem, moveItem, saveStructure, changeContent, createMenu, ContentError } from './write';
import { itemInputSchema, structureInputSchema, createMenuSchema } from '@/validation/admin';
import { readMenus } from './read';
import { invalidateRestaurantContent } from './invalidation';
const message = (error: unknown) => error instanceof ContentError ? error.message : error instanceof ZodError ? 'Check the form fields' : 'Could not save changes. Try again.';
export async function saveItemAction(raw: unknown, form: FormData) {
    const { user } = await requireEditor();
    const parsed = itemInputSchema.safeParse(raw);
    if (!parsed.success)
        return { error: 'Check the form fields' };
    let uploadId: string | undefined;
    try {
        const file = form.get('image');
        if (file instanceof File && file.size) {
            try {
                uploadId = await prepareUpload(file, user.id);
            }
            catch (error) {
                return { error: error instanceof Error ? error.message : 'Upload failed' };
            }
        }
        // A photo may take time to upload; recheck revocation before committing content.
        await requireEditor();
        const restaurant = await saveItem(getDb(), user.id, parsed.data, uploadId);
        const affectedRestaurants = [restaurant];
        if (parsed.data.sourceMenuId && parsed.data.sourceMenuId !== parsed.data.menuId) {
            const source = await getDb().query.menus.findFirst({ where: (m, { eq }) => eq(m.id, parsed.data.sourceMenuId!) });
            if (source) affectedRestaurants.push(source.restaurantId);
        }
        invalidateRestaurantContent(affectedRestaurants);
        return { menus: await readMenus(getDb()) };
    }
    catch (error) {
        if (uploadId)
            await getDb().update(mediaAssets).set({ status: 'orphan' }).where(and(eq(mediaAssets.id, uploadId), sql `not exists (select 1 from ${items} where ${items.imageId} = ${uploadId})`, sql`not exists (select 1 from ${menus} where ${menus.bannerImageId} = ${uploadId})`));
        unstable_rethrow(error);
        return { error: message(error) };
    }
}
export async function moveItemAction(raw: unknown) {
    const { user } = await requireEditor();
    try {
        const restaurant = await moveItem(getDb(), user.id, raw);
        invalidateRestaurantContent([restaurant]);
        return { menus: await readMenus(getDb()) };
    }
    catch (error) {
        unstable_rethrow(error);
        return { error: message(error) };
    }
}
export async function saveStructureAction(raw: unknown, form?: FormData) {
    const { user } = await requireEditor();
    let uploadId: string | undefined;
    try {
        const input = structureInputSchema.parse(raw);
        const file = form?.get('image');
        if (file instanceof File && file.size) {
            if (input.kind !== 'menu') return { error: 'Only menu sections have banners' };
            try { uploadId = await prepareUpload(file, user.id); }
            catch (error) { return { error: error instanceof Error ? error.message : 'Upload failed' }; }
        }
        await requireEditor();
        const restaurant = await saveStructure(getDb(), user.id, input, uploadId);
        invalidateRestaurantContent([restaurant]);
        return { menus: await readMenus(getDb()) };
    }
    catch (error) {
        if (uploadId) await getDb().update(mediaAssets).set({ status: 'orphan' }).where(and(eq(mediaAssets.id, uploadId), sql`not exists (select 1 from ${items} where ${items.imageId} = ${uploadId})`, sql`not exists (select 1 from ${menus} where ${menus.bannerImageId} = ${uploadId})`));
        unstable_rethrow(error);
        return { error: message(error) };
    }
}

export async function changeContentAction(raw: unknown) {
    const { user } = await requireEditor();
    try {
        const restaurant = await changeContent(getDb(), user.id, raw);
        invalidateRestaurantContent([restaurant]);
        return { menus: await readMenus(getDb()) };
    } catch (error) { unstable_rethrow(error); return { error: message(error) }; }
}

export async function createMenuAction(raw: unknown, form: FormData) {
    const { user } = await requireEditor();
    let uploadId: string | undefined;
    try {
        const input = createMenuSchema.parse(raw);
        const file = form.get('image');
        if (file instanceof File && file.size) {
            try { uploadId = await prepareUpload(file, user.id); }
            catch (error) { return { error: error instanceof Error ? error.message : 'Upload failed' }; }
        }
        await requireEditor();
        const created = await createMenu(getDb(), user.id, input, uploadId);
        invalidateRestaurantContent([created.restaurantId]);
        return { menus: await readMenus(getDb()), menuId: created.menuId };
    } catch (error) {
        if (uploadId) await getDb().update(mediaAssets).set({ status: 'orphan' }).where(and(eq(mediaAssets.id, uploadId), sql`not exists (select 1 from ${items} where ${items.imageId} = ${uploadId})`, sql`not exists (select 1 from ${menus} where ${menus.bannerImageId} = ${uploadId})`));
        unstable_rethrow(error);
        return { error: message(error) };
    }
}
