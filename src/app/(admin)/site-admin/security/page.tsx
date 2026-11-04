import { Suspense } from 'react';
import Link from 'next/link';
import { requireAdministrator } from '@/server/auth/guards';
import AdminShell from '@/components/Admin/Shell';
import ProfileForm from '@/components/Admin/ProfileForm';
import { PasswordForm, BackupCodesForm } from '@/components/Admin/AuthForms';
import { Status } from '@/components/Admin/Controls';
import styles from '@/components/Admin/Admin.module.scss';
async function Content({ searchParams }: { searchParams:Promise<{ panel?:string }> }) {
    const { user } = await requireAdministrator();
    const panel = (await searchParams).panel ?? 'profile';
    return <AdminShell><header className={styles.pageHeader}><div><h1>{panel === 'password' ? 'Change Password' : panel === 'two-factor' ? 'Two-Factor Authentication' : 'My Profile'}</h1><p>Manage your account and security</p></div></header><nav className={styles.toolbar} aria-label="Account settings"><Link href="/security?panel=profile">My Profile</Link><Link href="/security?panel=two-factor">Two-Factor Authentication</Link><Link href="/security?panel=password">Change Password</Link></nav><section className={styles.card}>{panel === 'password' ? <PasswordForm/> : panel === 'two-factor' ? <><Status active>2FA Enabled · Required</Status><BackupCodesForm/></> : <ProfileForm name={user.name} email={user.email}/>}</section></AdminShell>;
}
export default function Page(props: { searchParams:Promise<{ panel?:string }> }) { return <Suspense fallback={<p>Loading account…</p>}><Content {...props}/></Suspense>; }
