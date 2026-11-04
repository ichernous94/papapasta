import 'server-only';
import { createDatabase } from './connection';
const globalDatabase = globalThis as typeof globalThis & {
    papaDatabase?: ReturnType<typeof createDatabase>;
};
export function getDb() {
    if (!process.env.DATABASE_URL)
        throw new Error('DATABASE_URL is required');
    globalDatabase.papaDatabase ??= createDatabase(process.env.DATABASE_URL);
    return globalDatabase.papaDatabase.db;
}
