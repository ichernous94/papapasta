'use server';
import { randomBytes } from 'node:crypto';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { unstable_rethrow } from 'next/navigation';
import { z } from 'zod';
import { getAuth } from './index';
import { requireAdministrator } from './guards';
import { getDb } from '@/server/db';
import { changeUser, consumeResetAttempt, UserManagementError } from './user-write';
import { emailSchema } from '@/validation/admin';
const fields = z.object({ name: z.string().trim().min(1).max(120), role: z.enum(['admin', 'user']) });
export async function createUserAction(raw: unknown) {
    await requireAdministrator();
    try {
        const input = fields.extend({ email: emailSchema }).strict().parse(raw);
        const password = randomBytes(24).toString('base64url');
        await getAuth().api.createUser({ headers: await headers(), body: { ...input, password } });
        revalidatePath('/site-admin/users');
        return { success: true, password };
    } catch (error) { unstable_rethrow(error); return { error: 'Could not create user. Check the fields and email address.' }; }
}
const operation = z.discriminatedUnion('action', [
    fields.extend({ action: z.literal('update'), userId: z.string().min(1) }),
    z.object({ action: z.literal('delete'), userId: z.string().min(1) }),
    z.object({ action: z.literal('reset'), userId: z.string().min(1), password: z.string().min(1).max(128) }),
    z.object({ action: z.literal('password'), userId: z.string().min(1) }),
]);
export async function manageUserAction(raw: unknown) {
    const active = await requireAdministrator();
    try {
        // FormData keeps password-bearing action arguments out of Next's object argument trace.
        const input = operation.parse(raw instanceof FormData ? Object.fromEntries(raw) : raw);
        if (input.userId === active.user.id && (input.action !== 'update' || input.role !== 'admin')) throw new UserManagementError('You cannot remove or restrict your own access.');
        if (input.action === 'reset') {
            // Server API calls bypass HTTP rate limiting; persist a separate per-actor limit.
            await consumeResetAttempt(getDb(), active.user.id);
            await getAuth().api.verifyPassword({ headers: await headers(), body: { password: input.password } });
        }
        let temporaryPassword: string | undefined;
        if (input.action === 'password') {
            temporaryPassword = randomBytes(24).toString('base64url');
            await getAuth().api.setUserPassword({ headers: await headers(), body: { userId: input.userId, newPassword: temporaryPassword } });
        } else {
            await changeUser(getDb(), active.user.id, active.session.id, input);
        }
        revalidatePath('/site-admin/users');
        return { success: true, password: temporaryPassword };
    } catch (error) { unstable_rethrow(error); return { error: error instanceof UserManagementError ? error.message : 'Could not verify or update the account.' }; }
}
export async function updateProfileAction(raw: unknown) {
    await requireAdministrator();
    try {
        const input = z.object({ name: z.string().trim().min(1).max(120) }).strict().parse(raw);
        await getAuth().api.updateUser({ headers: await headers(), body: input });
        revalidatePath('/site-admin/security');
        return { success: true };
    } catch (error) { unstable_rethrow(error); return { error: 'Could not update profile.' }; }
}
