import { eq } from 'drizzle-orm';
import { database } from './environment';
import { user, session, twoFactor, verification, auditLog } from '../src/server/db/schema';
import { emailSchema } from '../src/validation/admin';
async function main() {
    const email = emailSchema.parse(process.argv[2]);
    if (!process.argv.includes('--confirm'))
        throw new Error('Требуется --confirm');
    const { db, pool } = database();
    try {
        await db.transaction(async (tx) => {
            const found = await tx.query.user.findFirst({ where: eq(user.email, email) });
            if (!found)
                throw new Error('Не найден');
            await tx.update(user).set({ twoFactorEnabled: false }).where(eq(user.id, found.id));
            await tx.delete(twoFactor).where(eq(twoFactor.userId, found.id));
            await tx.delete(session).where(eq(session.userId, found.id));
            // Invalidate outstanding sign-in challenges as well as established sessions.
            await tx.delete(verification).where(eq(verification.value, found.id));
            await tx.insert(auditLog).values({ actorId: 'local-recovery', action: 'auth.reset-two-factor', targetId: found.id });
        });
        console.log('TOTP сброшен, сессии завершены. Следующий вход потребует новой настройки TOTP.');
    }
    finally {
        await pool.end();
    }
}
main().catch(() => { console.error('Восстановление не выполнено. Использование: pnpm admin:reset-2fa email --confirm'); process.exitCode = 1; });
