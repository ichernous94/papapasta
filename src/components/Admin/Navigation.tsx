'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { FiUsers, FiGrid, FiMenu, FiX, FiChevronRight, FiUser, FiShield, FiKey, FiLogOut } from 'react-icons/fi';
import { IoRestaurantOutline } from 'react-icons/io5';
import Modal from '@/components/ui/Modal';
import { authClient } from '@/lib/auth-client';
import styles from './Admin.module.scss';
export default function Navigation({ user }: { user: { name: string; email: string; twoFactorEnabled: boolean } }) {
    const router = useRouter();
    const path = usePathname().replace(/^\/site-admin/, '') || '/';
    const [mobile, setMobile] = useState(false);
    const [profile, setProfile] = useState(false);
    const [error, setError] = useState('');
    const profileRef = useRef<HTMLDivElement>(null);
    const profileButton = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        function close(event: MouseEvent) { if (!profileRef.current?.contains(event.target as Node)) setProfile(false); }
        function key(event: KeyboardEvent) { if (event.key === 'Escape') { setProfile(false); profileButton.current?.focus(); } }
        if (profile) { document.addEventListener('mousedown', close); document.addEventListener('keydown', key); }
        return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', key); };
    }, [profile]);
    const content = <><Link className={styles.brand} href="/menus" onClick={() => setMobile(false)}><Image src="/icons/logo_papapasta.svg" width={210} height={48} alt="Papa Pasta"/><small>Admin Panel</small></Link><nav aria-label="Administration">{[['/users', 'Users', FiUsers], ['/menus', 'Menus', IoRestaurantOutline], ['/qr-codes', 'QR Codes', FiGrid]].map(([href, label, Icon]) => { const Glyph = Icon as typeof FiUsers; return <Link key={String(href)} href={String(href)} aria-current={path === href ? 'page' : undefined} onClick={() => { setMobile(false); setProfile(false); }}><Glyph aria-hidden="true"/>{String(label)}</Link>; })}</nav><div className={styles.profile} ref={profileRef}><button ref={profileButton} type="button" aria-expanded={profile} onClick={() => setProfile(!profile)}><span className={styles.avatar}>{(user.name || user.email)[0].toUpperCase()}</span><span><strong>{user.email}</strong><small>Administrator</small></span><FiChevronRight /></button>{profile && <div className={styles.profileMenu}><strong>{user.email}</strong>{[['profile', 'My Profile', FiUser], ['two-factor', 'Two-Factor Authentication', FiShield], ['password', 'Change Password', FiKey]].map(([panel, label, Icon]) => { const Glyph = Icon as typeof FiUser; return <Link key={String(panel)} href={`/security?panel=${panel}`} onClick={() => { setProfile(false); setMobile(false); }}><Glyph />{String(label)}{panel === 'two-factor' && <small>Enabled</small>}</Link>; })}<button type="button" className={styles.danger} onClick={async () => { try { const result = await authClient.signOut(); if (result.error) throw new Error(); router.replace('/login'); router.refresh(); } catch { setError('Could not sign out. Try again.'); } }}><FiLogOut />Sign Out</button>{error && <p role="alert">{error}</p>}</div>}</div></>;
    return <><a className={styles.skip} href="#admin-content">Skip to content</a><aside className={styles.sidebar}>{content}</aside><div className={styles.mobileBar}><strong>PAPA PASTA</strong><button type="button" aria-label="Open navigation" onClick={() => setMobile(true)}><FiMenu /></button></div><Modal open={mobile} onClose={() => setMobile(false)} labelledBy="mobile-navigation-title" closeLabel="Close navigation" className={styles.mobileNav}><h2 id="mobile-navigation-title" className={styles.srOnly}>Navigation</h2><button type="button" className={styles.srOnly} onClick={() => setMobile(false)}><FiX />Close</button>{mobile && content}</Modal></>;
}
