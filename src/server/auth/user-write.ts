import { and, eq, sql } from 'drizzle-orm';
import type { createDatabase } from '@/server/db/connection';
import { user, session, twoFactor, verification, auditLog, rateLimit } from '@/server/db/schema';
type Database = ReturnType<typeof createDatabase>['db'];
export class UserManagementError extends Error {}
export type UserOperation = { action:'update'; userId:string; name:string; role:'admin'|'user' } | { action:'delete'|'reset'; userId:string };
export async function changeUser(db:Database, actorId:string, sessionId:string, input:UserOperation) {
    return db.transaction(async tx => {
        await tx.execute(sql`select pg_advisory_xact_lock(7342941)`);
        const actor = await tx.query.user.findFirst({ where:eq(user.id,actorId) });
        const currentSession = await tx.query.session.findFirst({ where:and(eq(session.id,sessionId),eq(session.userId,actorId)) });
        if (!actor || actor.role !== 'admin' || actor.banned || actor.mustChangePassword || !actor.twoFactorEnabled || !currentSession?.mfaVerifiedAt || currentSession.expiresAt <= new Date()) throw new UserManagementError('Administrator access with verified 2FA is required.');
        if (input.userId === actorId && (input.action !== 'update' || input.role !== 'admin')) throw new UserManagementError('You cannot remove or restrict your own access.');
        const target = await tx.query.user.findFirst({ where:eq(user.id,input.userId) });
        if (!target) throw new UserManagementError('User not found.');
        if (target.role === 'admin' && !target.banned && (input.action === 'delete' || (input.action === 'update' && input.role !== 'admin'))) {
            const admins = await tx.select({ id:user.id }).from(user).where(and(eq(user.role,'admin'),eq(user.banned,false))).for('update');
            if (admins.length <= 1) throw new UserManagementError('The last active administrator cannot be removed or demoted.');
        }
        if (input.action === 'update') await tx.update(user).set({ name:input.name, role:input.role, updatedAt:new Date() }).where(eq(user.id,target.id));
        if (input.action !== 'update' || target.role !== input.role) {
            await tx.delete(session).where(eq(session.userId,target.id));
            await tx.delete(verification).where(eq(verification.value,target.id));
        }
        if (input.action === 'delete') await tx.delete(user).where(eq(user.id,target.id));
        if (input.action === 'reset') {
            await tx.delete(twoFactor).where(eq(twoFactor.userId,target.id));
            await tx.update(user).set({ twoFactorEnabled:false, updatedAt:new Date() }).where(eq(user.id,target.id));
        }
        await tx.insert(auditLog).values({ actorId, action:`user.${input.action}`, targetId:target.id });
    });
}
export async function consumeResetAttempt(db:Database, actorId:string, now=Date.now()) {
    const [limit] = await db.insert(rateLimit).values({ id:`reset:${actorId}`, key:`reset:${actorId}`, count:1, lastRequest:now }).onConflictDoUpdate({ target:rateLimit.key, set:{ count:sql`case when ${rateLimit.lastRequest} < ${now-60000} then 1 else ${rateLimit.count} + 1 end`, lastRequest:now } }).returning();
    if (limit.count > 5) throw new UserManagementError('Too many attempts. Try again in one minute.');
}
