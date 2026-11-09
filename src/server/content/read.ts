import type { createDatabase } from '@/server/db/connection';
import { eq } from 'drizzle-orm';
import { menus } from '@/server/db/schema';
import type { EditorMenu } from '@/types/admin';
import { publicImageURL } from '@/server/media/storage';
export async function readMenus(db: ReturnType<typeof createDatabase>['db'], restaurantId?: string, onlyVisible = false): Promise<EditorMenu[]> {
    const rows = await db.query.menus.findMany({
        where: restaurantId ? eq(menus.restaurantId, restaurantId) : undefined,
        orderBy: (m, { asc }) => [asc(m.sortOrder)],
        with: { bannerImage: true, categories: { orderBy: (c, { asc }) => [asc(c.sortOrder)], with: { groups: { orderBy: (g, { asc }) => [asc(g.sortOrder)], with: { items: {
                                where: (i) => onlyVisible ? eq(i.visible, true) : undefined,
                                orderBy: (i, { asc }) => [asc(i.sortOrder), asc(i.id)], with: { image: true },
                            } } } } } },
    });
    return rows.map(m => ({ id: m.id, restaurantId: m.restaurantId, key: m.key, title: m.title, subtitle: m.subtitle, version: m.version, bannerImageId: m.bannerImageId,
        bannerImage: m.bannerImage?.status === 'ready' && publicImageURL(m.bannerImage.objectKey) ? { src: publicImageURL(m.bannerImage.objectKey)!, width: m.bannerImage.width, height: m.bannerImage.height, blurDataURL: m.bannerImage.blurDataURL, alt: m.title } : undefined,
        categories: m.categories.map(c => ({ id: c.id, label: c.label, note: c.note, columns: c.columns === 2 ? 2 as const : undefined, columnBreak: c.columnBreak,
            groups: c.groups.map(g => ({ id: g.id, title: g.title, note: g.note, afterNote: g.afterNote, items: g.items.map(i => {
                    const url = i.image?.status === 'ready' ? publicImageURL(i.image.objectKey) : null;
                    return { id: i.id, allergens: i.allergens, meatless: i.meatless, recommended: i.recommended, spicy: i.spicy, groupId: g.id, name: i.name, portion: i.portion, price: i.price, description: i.description, isNew: i.isNew, visible: i.visible, sortOrder: i.sortOrder, imageId: i.imageId, imageAlt: i.imageAlt,
                        image: url && i.image ? { src: url, width: i.image.width, height: i.image.height, blurDataURL: i.image.blurDataURL, alt: i.imageAlt || i.name } : undefined };
                }) })) })),
    }));
}
