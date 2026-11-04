import { Suspense } from 'react';
import { requireEditor } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import { readMenus } from '@/server/content/read';
import { storageConfig } from '@/server/media/storage';
import AdminShell from '@/components/Admin/Shell';
import MenuEditor from '@/components/Admin/MenuEditor';
async function Content() {
    const { user } = await requireEditor();
    const menus = await readMenus(getDb());
    return <AdminShell admin={user.role === 'admin'}><MenuEditor initialMenus={menus} storageAvailable={!!storageConfig()}/></AdminShell>;
}
export default function Page() { return <Suspense fallback={<p>Loading menus…</p>}><Content /></Suspense>; }
