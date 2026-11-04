import { Suspense } from 'react';
import { requireAdministrator } from '@/server/auth/guards';
import { getDb } from '@/server/db';
import AdminShell from '@/components/Admin/Shell';
import QRCodes from '@/components/Admin/QRCodes';
async function Content() {
    await requireAdministrator();
    const codes = await getDb().query.qrCodes.findMany({ columns:{ id:true, restaurantId:true, name:true, url:true, active:true }, orderBy:(q,{desc}) => [desc(q.createdAt)] });
    return <AdminShell><QRCodes codes={codes}/></AdminShell>;
}
export default function Page() { return <Suspense fallback={<p>Loading QR codes…</p>}><Content/></Suspense>; }
