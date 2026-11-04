import { loadEnvConfig } from '@next/env';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { Writable } from 'node:stream';
import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { createUserSchema } from '../src/validation/admin';
loadEnvConfig(process.cwd());
// Do not print the password, hash, SQL contents, or environment values.
async function main() {
    if (!stdin.isTTY)
        throw new Error('Нужен интерактивный терминал');
    let muted = false;
    const output = new Writable({ write(chunk, _encoding, callback) { if (!muted)
            stdout.write(chunk); callback(); } });
    const rl = createInterface({ input: stdin, output, terminal: true });
    try {
        const name = await rl.question('Имя первого администратора: ');
        const email = await rl.question('Email: ');
        stdout.write('Пароль (не отображается, минимум 12 символов): ');
        muted = true;
        let password = await rl.question('');
        muted = false;
        stdout.write('\n');
        const input = createUserSchema.parse({ name, email, password, role: 'admin' });
        const hash = await hashPassword(input.password);
        password = '';
        const quote = (value: string) => "'" + value.replace(/'/g, "''") + "'";
        const userId = randomUUID();
        const accountId = randomUUID();
        const sql = `BEGIN;\nINSERT INTO public.\"user\" (id, name, email, email_verified, role, must_change_password) VALUES (${quote(userId)}, ${quote(input.name)}, ${quote(input.email)}, true, 'admin', false);\nINSERT INTO public.account (id, account_id, provider_id, user_id, password) VALUES (${quote(accountId)}, ${quote(userId)}, 'credential', ${quote(userId)}, ${quote(hash)});\nCOMMIT;\n`;
        await mkdir('.local', { recursive: true, mode: 0o700 });
        await writeFile('.local/bootstrap-admin.sql', sql, { mode: 0o600, flag: 'wx' });
        console.log('SQL сохранён в .local/bootstrap-admin.sql. Примените его самостоятельно. Пользователь не создан автоматически.');
    }
    finally {
        muted = false;
        rl.close();
    }
}
main().catch(() => { console.error('SQL не создан. Проверьте ввод; существующий .local/bootstrap-admin.sql не перезаписывается.'); process.exitCode = 1; });
