import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getAuth } from './index';
import { isAdminHost } from './origin';
import { getDb } from '@/server/db';
import { session as sessionTable, user as userTable } from '@/server/db/schema';
export async function getAdminSession() {
    const requestHeaders = await headers();
    if (!isAdminHost(requestHeaders.get('host')))
        return null;
    const value = await getAuth().api.getSession({ headers: requestHeaders, query: { disableCookieCache: true } });
    if (!value)
        return null;
    const [user, session] = await Promise.all([
        getDb().query.user.findFirst({ where: eq(userTable.id, value.user.id) }),
        getDb().query.session.findFirst({ where: eq(sessionTable.id, value.session.id) }),
    ]);
    if (!user || user.banned || !session || session.expiresAt <= new Date())
        return null;
    return { user, session };
}
export async function requireEditor() {
    const active = await getAdminSession();
    if (!active)
        redirect('/login');
    if (active.user.role !== 'admin')
        redirect('/login');
    if (active.user.mustChangePassword)
        redirect('/change-password');
    if (!active.user.twoFactorEnabled)
        redirect('/setup-two-factor');
    if (!active.session.mfaVerifiedAt)
        redirect('/two-factor');
    return active;
}
export async function requireAdministrator() {
    const active = await requireEditor();
    if (active.user.role !== 'admin')
        throw new Error('Access denied');
    return active;
}
