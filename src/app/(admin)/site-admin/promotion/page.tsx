import { Suspense } from 'react';
import { requireAdministrator } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import { readPromotions } from '@/server/content/site-read';
import { storageConfig } from '@/server/media/storage';
import AdminShell from '@/components/Admin/Shell';
import Promotions from '@/components/Admin/Promotions';
async function Content() {
  await requireAdministrator();
  return <AdminShell><Promotions items={await readPromotions(getDb())} storageAvailable={!!storageConfig()}/></AdminShell>;
}
export default function Page() { return <Suspense fallback={<p>Loading promotions…</p>}><Content/></Suspense>; }
