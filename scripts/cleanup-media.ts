import { and, eq, lt, ne } from 'drizzle-orm';
import { database } from './environment';
import { mediaAssets, items, menus } from '../src/server/db/schema';
import { deleteObject, MEDIA_PREFIX } from '../src/server/media/storage';
async function main() {
    const { db, pool } = database();
    let count = 0;
    try {
        const assets = await db.select({ id: mediaAssets.id }).from(mediaAssets).where(and(ne(mediaAssets.status, 'ready'), lt(mediaAssets.createdAt, new Date(Date.now() - 86400000))));
        for (const asset of assets) {
            await db.transaction(async (tx) => {
                const [row] = await tx.select().from(mediaAssets).where(eq(mediaAssets.id, asset.id)).for('update');
                if (!row || row.status === 'ready' || !row.objectKey.startsWith(MEDIA_PREFIX))
                    return;
                const [referenced] = await tx.select({ id: items.id }).from(items).where(eq(items.imageId, row.id)).limit(1);
                const [banner] = await tx.select({ id: menus.id }).from(menus).where(eq(menus.bannerImageId, row.id)).limit(1);
                if (referenced || banner)
                    return;
                if (process.argv.includes('--apply')) {
                    await deleteObject(row.objectKey);
                    await tx.delete(mediaAssets).where(eq(mediaAssets.id, row.id));
                }
                count++;
            });
        }
        console.log(`${process.argv.includes('--apply') ? 'Удалено' : 'Можно удалить (предпросмотр)'}: ${count}. Учитываются только непривязанные объекты приложения старше суток.`);
    }
    finally {
        await pool.end();
    }
}
main().catch(() => { console.error('Очистка не выполнена. Проверьте подключение БД и R2.'); process.exitCode = 1; });
