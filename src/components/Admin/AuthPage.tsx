import Image from 'next/image';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/server/auth/guards';
import { LoginForm, TwoFactorForm, SetupFactorForm, PasswordForm } from './AuthForms';
import SignOutButton from './SignOutButton';
import styles from './Admin.module.scss';
type Mode = 'login' | 'two-factor' | 'setup-two-factor' | 'change-password';
const titles: Record<Mode, string> = { login: 'Sign In', 'two-factor': 'Two-Factor Authentication', 'setup-two-factor': 'Set Up Authenticator App', 'change-password': 'Change Password' };
const subtitles: Record<Mode, string> = { login: 'Access your restaurant admin panel', 'two-factor': 'Enter the 6-digit code from your authenticator app', 'setup-two-factor': 'Secure your account with two-factor authentication (2FA)', 'change-password': 'Set a new password for your account' };
async function Content({ mode }: {
    mode: Mode;
}) {
    const active = await getAdminSession();
    if (active && active.user.role !== 'admin') return <main className={styles.auth}><div className={styles.card}><h1>Access Denied</h1><p>Administrator access is required.</p><SignOutButton/></div></main>;
    if (mode === 'setup-two-factor' || mode === 'change-password') {
        if (!active)
            redirect('/login');
        if (mode === 'setup-two-factor' && active.user.mustChangePassword)
            redirect('/change-password');
        if (mode === 'setup-two-factor' && active.user.twoFactorEnabled)
            redirect('/two-factor');
    }
    if (mode === 'login' && active)
        redirect(active.user.mustChangePassword ? '/change-password' : !active.user.twoFactorEnabled ? '/setup-two-factor' : !active.session.mfaVerifiedAt ? '/two-factor' : '/menus');
    const form: Record<Mode, ReactNode> = { login: <LoginForm />, 'two-factor': <TwoFactorForm />, 'setup-two-factor': <SetupFactorForm />, 'change-password': <PasswordForm /> };
    return <main className={styles.auth}><div className={styles.brand}><Image src="/icons/logo_papapasta_dark.svg" width={260} height={59} alt="Papa Pasta"/><small>Admin Panel</small></div><div className={styles.card}><h1>{titles[mode]}</h1><p className={styles.muted}>{subtitles[mode]}</p>{form[mode]}</div></main>;
}
export default function AuthPage({ mode }: {
    mode: Mode;
}) { return <Suspense fallback={<p>Loading…</p>}><Content mode={mode}/></Suspense>; }
