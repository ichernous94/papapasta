import { Suspense } from 'react';
import { requireAdministrator } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import { readPromotions, readPromotionPopup } from '@/server/content/site-read';
import { storageConfig } from '@/server/media/storage';
import AdminShell from '@/components/Admin/Shell';
import Promotions from '@/components/Admin/Promotions';
async function Content() {
  await requireAdministrator();
  const [items, popup] = await Promise.all([readPromotions(getDb()), readPromotionPopup(getDb())]);
  return <AdminShell><Promotions items={items} popup={popup} storageAvailable={!!storageConfig()}/></AdminShell>;
}
export default function Page() { return <Suspense fallback={<p>Loading promotions…</p>}><Content/></Suspense>; }
