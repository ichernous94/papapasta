import { relations } from 'drizzle-orm';
import { pgTable, pgEnum, text, boolean, timestamp, integer, bigint, index, uniqueIndex } from 'drizzle-orm/pg-core';
export const roleEnum = pgEnum('user_role', ['admin', 'user']);
const date = (name: string) => timestamp(name, { withTimezone: true });
export const user = pgTable('user', {
    id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull().unique(),
    emailVerified: boolean('email_verified').notNull().default(false), image: text('image'),
    createdAt: date('created_at').notNull().defaultNow(), updatedAt: date('updated_at').notNull().defaultNow(),
    role: roleEnum('role').notNull().default('user'), banned: boolean('banned').notNull().default(false),
    banReason: text('ban_reason'), banExpires: date('ban_expires'),
    twoFactorEnabled: boolean('two_factor_enabled').notNull().default(false),
    lastLoginAt: date('last_login_at'),
    mustChangePassword: boolean('must_change_password').notNull().default(true),
});
export const session = pgTable('session', {
    id: text('id').primaryKey(), expiresAt: date('expires_at').notNull(), token: text('token').notNull().unique(),
    createdAt: date('created_at').notNull().defaultNow(), updatedAt: date('updated_at').notNull().defaultNow(),
    ipAddress: text('ip_address'), userAgent: text('user_agent'),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'), mfaVerifiedAt: date('mfa_verified_at'),
}, table => [index('session_user').on(table.userId)]);
export const account = pgTable('account', {
    id: text('id').primaryKey(), accountId: text('account_id').notNull(), providerId: text('provider_id').notNull(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'), refreshToken: text('refresh_token'), idToken: text('id_token'),
    accessTokenExpiresAt: date('access_token_expires_at'), refreshTokenExpiresAt: date('refresh_token_expires_at'),
    scope: text('scope'), password: text('password'),
    createdAt: date('created_at').notNull().defaultNow(), updatedAt: date('updated_at').notNull().defaultNow(),
}, table => [index('account_user').on(table.userId), uniqueIndex('account_provider_id').on(table.providerId, table.accountId)]);
export const verification = pgTable('verification', {
    id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: date('expires_at').notNull(),
    createdAt: date('created_at').notNull().defaultNow(), updatedAt: date('updated_at').notNull().defaultNow(),
}, table => [index('verification_identifier').on(table.identifier)]);
export const twoFactor = pgTable('two_factor', {
    id: text('id').primaryKey(), userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }).unique(),
    secret: text('secret').notNull(), backupCodes: text('backup_codes').notNull(), verified: boolean('verified').notNull().default(false),
    failedVerificationCount: integer('failed_verification_count').notNull().default(0), lockedUntil: date('locked_until'),
});
export const rateLimit = pgTable('rate_limit', {
    id: text('id').primaryKey(), key: text('key').notNull().unique(), count: integer('count').notNull(),
    lastRequest: bigint('last_request', { mode: 'number' }).notNull(),
});
export const userRelations = relations(user, ({ many, one }) => ({ sessions: many(session), accounts: many(account), twoFactor: one(twoFactor, { fields: [user.id], references: [twoFactor.userId] }) }));
export const sessionRelations = relations(session, ({ one }) => ({ user: one(user, { fields: [session.userId], references: [user.id] }) }));
export const accountRelations = relations(account, ({ one }) => ({ user: one(user, { fields: [account.userId], references: [user.id] }) }));
export const twoFactorRelations = relations(twoFactor, ({ one }) => ({ user: one(user, { fields: [twoFactor.userId], references: [user.id] }) }));
