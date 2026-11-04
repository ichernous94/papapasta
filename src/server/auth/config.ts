import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { admin, twoFactor } from 'better-auth/plugins';
import { createAuthMiddleware, APIError, getSessionFromCtx } from 'better-auth/api';
import { deleteSessionCookie } from 'better-auth/cookies';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { createDatabase } from '@/server/db/connection';
import * as schema from '@/server/db/schema';
import { createUserSchema } from '@/validation/admin';
import { isAdminHost } from './origin';
// Factory also permits integration tests against a completely separate database.
export function createAuth(db: ReturnType<typeof createDatabase>['db'], config: {
    secret: string;
    baseURL: string;
}) {
    const origin = new URL(config.baseURL).origin;
    return betterAuth({
        appName: 'PapaPasta Admin', secret: config.secret, baseURL: config.baseURL,
        database: drizzleAdapter(db, { provider: 'pg', schema, transaction: true }),
        trustedOrigins: [origin],
        emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12, maxPasswordLength: 128 },
        user: { additionalFields: { mustChangePassword: { type: 'boolean', required: false, defaultValue: true, input: false } } },
        session: {
            expiresIn: 8 * 60 * 60, disableSessionRefresh: true, cookieCache: { enabled: false },
            additionalFields: { mfaVerifiedAt: { type: 'date', required: false, input: false, returned: false } },
        },
        advanced: { useSecureCookies: process.env.NODE_ENV === 'production', cookiePrefix: 'papapasta-admin', crossSubDomainCookies: { enabled: false } },
        rateLimit: { enabled: true, storage: 'database', window: 60, max: 100,
            customRules: { '/sign-in/email': { window: 60, max: 5 }, '/two-factor/*': { window: 60, max: 10 }, '/change-password': { window: 60, max: 5 }, '/verify-password': { window: 60, max: 5 } } },
        plugins: [admin({ defaultRole: 'user' }), twoFactor({ issuer: 'PapaPasta Admin', skipVerificationOnEnable: false })],
        databaseHooks: {
            session: { create: { before: async (data) => ({ data: { ...data, mfaVerifiedAt: null, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) } }) } },
        },
        hooks: {
            before: createAuthMiddleware(async (ctx) => {
                if (ctx.headers && !isAdminHost(ctx.headers.get('host')))
                    throw new APIError('NOT_FOUND');
                const path = ctx.path;
                if (['/two-factor/disable', '/two-factor/send-otp', '/two-factor/verify-otp', '/admin/update-user', '/admin/remove-user', '/admin/set-role', '/admin/ban-user'].includes(path) || path.includes('impersonate') || path === '/delete-user' || path === '/update-session')
                    throw new APIError('FORBIDDEN', { message: 'Operation unavailable' });
                if (path.startsWith('/two-factor/') && ctx.body?.trustDevice)
                    throw new APIError('FORBIDDEN', { message: 'Two-factor authentication is required at every sign in' });
                if (path === '/two-factor/enable' && ctx.body?.method && ctx.body.method !== 'totp')
                    throw new APIError('FORBIDDEN');
                const protectedOperation = path.startsWith('/admin/') || ['/update-user', '/change-email', '/two-factor/generate-backup-codes'].includes(path);
                const onboarding = ['/change-password', '/two-factor/enable', '/two-factor/get-totp-uri'].includes(path);
                if (protectedOperation || onboarding) {
                    const active = await getSessionFromCtx(ctx);
                    if (!active)
                        throw new APIError('UNAUTHORIZED');
                    const currentUser = await db.query.user.findFirst({ where: eq(schema.user.id, active.user.id) });
                    const currentSession = await db.query.session.findFirst({ where: eq(schema.session.id, active.session.id) });
                    if (!currentUser || currentUser.banned || !currentSession || currentSession.expiresAt <= new Date())
                        throw new APIError('UNAUTHORIZED');
                    if (protectedOperation && (currentUser.role !== 'admin' || !currentUser.twoFactorEnabled || !currentSession.mfaVerifiedAt || currentUser.mustChangePassword))
                        throw new APIError('FORBIDDEN', { message: 'Complete your security setup' });
                    if (onboarding && currentUser.twoFactorEnabled && !currentSession.mfaVerifiedAt)
                        throw new APIError('FORBIDDEN');
                    if (path !== '/change-password' && onboarding && currentUser.mustChangePassword)
                        throw new APIError('FORBIDDEN', { message: 'Change your temporary password first' });
                    if (path.startsWith('/admin/')) {
                        if (currentUser.role !== 'admin')
                            throw new APIError('FORBIDDEN');
                        if (path === '/admin/set-role' && !['admin', 'user'].includes(ctx.body?.role))
                            throw new APIError('BAD_REQUEST');
                        if (path === '/admin/set-user-password' && !z.string().min(12).max(128).safeParse(ctx.body?.newPassword).success)
                            throw new APIError('BAD_REQUEST');
                        if (path === '/admin/create-user') {
                            const parsed = createUserSchema.safeParse({ name: ctx.body?.name, email: ctx.body?.email, password: ctx.body?.password, role: ctx.body?.role ?? 'user' });
                            if (!parsed.success || ctx.body?.data)
                                throw new APIError('BAD_REQUEST', { message: 'Invalid user details' });
                        }
                        if (['/admin/ban-user', '/admin/remove-user', '/admin/set-role', '/admin/set-user-password'].includes(path) && ctx.body?.userId === currentUser.id)
                            throw new APIError('FORBIDDEN', { message: 'You cannot restrict your own access' });
                    }
                }
            }),
            after: createAuthMiddleware(async (ctx) => {
                const result = ctx.context.returned;
                if (!result || result instanceof APIError)
                    return;
                if (['/two-factor/verify-totp', '/two-factor/verify-backup-code'].includes(ctx.path)) {
                    const token = (result as {
                        token?: unknown;
                    }).token;
                    if (typeof token !== 'string')
                        return;
                    const id = ctx.context.newSession?.session.id;
                    const current = id ? await db.query.session.findFirst({ where: eq(schema.session.id, id) }) : await db.query.session.findFirst({ where: eq(schema.session.token, token) });
                    if (!current)
                        return;
                    const currentUser = await db.query.user.findFirst({ where: eq(schema.user.id, current.userId) });
                    const factor = await db.query.twoFactor.findFirst({ where: eq(schema.twoFactor.userId, current.userId) });
                    if (currentUser?.twoFactorEnabled && factor?.verified && !currentUser.banned) {
                        await db.transaction(async tx => {
                            await tx.update(schema.session).set({ mfaVerifiedAt: new Date() }).where(eq(schema.session.id, current.id));
                            await tx.update(schema.user).set({ lastLoginAt: new Date() }).where(eq(schema.user.id, current.userId));
                        });
                    }
                }
                if (ctx.path === '/change-password') {
                    const userId = ctx.context.session?.user.id ?? ctx.context.newSession?.user.id;
                    if (userId) {
                        await db.transaction(async (tx) => {
                            await tx.update(schema.user).set({ mustChangePassword: false }).where(eq(schema.user.id, userId));
                            await tx.delete(schema.session).where(eq(schema.session.userId, userId));
                            await tx.delete(schema.verification).where(eq(schema.verification.value, userId));
                        });
                        deleteSessionCookie(ctx);
                    }
                }
                if (['/admin/set-user-password', '/admin/ban-user'].includes(ctx.path) && typeof ctx.body?.userId === 'string') {
                    const userId = ctx.body.userId;
                    await db.transaction(async (tx) => {
                        if (ctx.path === '/admin/set-user-password')
                            await tx.update(schema.user).set({ mustChangePassword: true }).where(eq(schema.user.id, userId));
                        await tx.delete(schema.session).where(eq(schema.session.userId, userId));
                        await tx.delete(schema.verification).where(eq(schema.verification.value, userId));
                    });
                }
                if (ctx.path.startsWith('/admin/') && ctx.path !== '/admin/list-users') {
                    const active = await getSessionFromCtx(ctx);
                    if (active)
                        await db.insert(schema.auditLog).values({ actorId: active.user.id, action: ctx.path, targetId: String(ctx.body?.userId ?? 'users') });
                }
            }),
        },
    });
}
export function parseAuthEnvironment() {
    return z.object({ secret: z.string().min(32), baseURL: z.string().url() }).parse({ secret: process.env.BETTER_AUTH_SECRET, baseURL: process.env.BETTER_AUTH_URL });
}
