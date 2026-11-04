import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
export function createDatabase(connectionString: string, max = 10) {
    const pool = new Pool({ connectionString, max, connectionTimeoutMillis: 5000 });
    return { pool, db: drizzle(pool, { schema }) };
}
