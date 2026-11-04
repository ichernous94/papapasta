import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { requireEditor } from '@/server/auth/guards';
async function Entry() { await requireEditor(); return redirect('/menus'); }
export default function Page() { return <Suspense fallback={<p>Checking your session…</p>}><Entry /></Suspense>; }
