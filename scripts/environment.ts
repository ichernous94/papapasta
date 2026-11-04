import { loadEnvConfig } from '@next/env';
import { createDatabase } from '../src/server/db/connection';
loadEnvConfig(process.cwd());
export function database() {
    if (!process.env.DATABASE_URL)
        throw new Error('DATABASE_URL не задан');
    return createDatabase(process.env.DATABASE_URL, 2);
}
