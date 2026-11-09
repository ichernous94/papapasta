import { Suspense } from 'react';
import { requireAdministrator } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import { readGallery } from '@/server/content/site-read';
import { storageConfig } from '@/server/media/storage';
import AdminShell from '@/components/Admin/Shell';
import Galleries from '@/components/Admin/Galleries';
async function Content() {
  await requireAdministrator();
  const galleries = await Promise.all([readGallery(getDb(),'papapasta'),readGallery(getDb(),'centro')]);
  return <AdminShell><Galleries galleries={galleries} storageAvailable={!!storageConfig()}/></AdminShell>;
}
export default function Page() { return <Suspense fallback={<p>Loading galleries…</p>}><Content/></Suspense>; }
