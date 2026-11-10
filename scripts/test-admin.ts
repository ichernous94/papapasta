import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { database } from './environment';
async function main() {
    const { pool } = database();
    const name = `papapasta_test_${randomBytes(8).toString('hex')}`;
    let created = false;
    try {
        await pool.query(`CREATE DATABASE "${name}"`);
        created = true;
        const url = new URL(process.env.DATABASE_URL!);
        url.pathname = `/${name}`;
        const result = spawnSync(process.execPath, ['--import', 'tsx', '--test', 'tests/admin/unit.test.ts', 'tests/admin/integration.test.ts', 'tests/admin/fixed-sections.test.ts', 'tests/admin/menu-refresh.test.ts', 'tests/admin/centro-menu-refresh.test.ts'], { stdio: 'inherit', env: { ...process.env, TEST_DATABASE_URL: url.toString(), NODE_ENV: 'test' } });
        process.exitCode = result.status ?? 1;
    }
    finally {
        if (created)
            await pool.query(`DROP DATABASE "${name}" WITH (FORCE)`);
        await pool.end();
    }
}
main().catch(() => { console.error('Изолированная проверка БД недоступна. Нужны права CREATE DATABASE у локального пользователя. Рабочие данные не менялись.'); process.exitCode = 1; });
