import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { database } from './environment';
async function main() {
    const { db, pool } = database();
    try {
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('Миграции применены.');
    }
    finally {
        await pool.end();
    }
}
main().catch(() => { console.error('Не удалось применить миграции. Проверьте подключение и права БД.'); process.exitCode = 1; });
