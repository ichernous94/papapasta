import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { requireEditor } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import AdminShell from '@/components/Admin/Shell';
import Users from '@/components/Admin/Users';
async function Content() {
    const { user } = await requireEditor();
    if (user.role !== 'admin')
        redirect('/menus');
    const users = await getDb().query.user.findMany({ columns: { id: true, name: true, email: true, role: true, banned: true, twoFactorEnabled: true, mustChangePassword: true, createdAt: true, lastLoginAt: true }, orderBy: (u, { asc }) => [asc(u.createdAt)] });
    return <AdminShell admin><Users users={users.map(u => ({ ...u, twoFactorEnabled: !!u.twoFactorEnabled, createdAt: u.createdAt.toISOString(), lastLoginAt: u.lastLoginAt?.toISOString() ?? null }))} currentUserId={user.id}/></AdminShell>;
}
export default function Page() { return <Suspense fallback={<p>Loading users…</p>}><Content /></Suspense>; }
