import { database } from './environment';
import { seedContent } from '../src/server/content/seed';
async function main() {
    const { db, pool } = database();
    try {
        await seedContent(db);
        console.log('Меню добавлены. Существующие данные сохранены.');
    }
    finally {
        await pool.end();
    }
}
main().catch(() => { console.error('Не удалось заполнить меню. Сначала примените миграции.'); process.exitCode = 1; });
