import type { ReactNode } from 'react';
import { requireAdministrator } from '@/server/auth/guards';
import Navigation from './Navigation';
import styles from './Admin.module.scss';
export default async function AdminShell({ children }: { children: ReactNode; admin?: boolean }) {
    const { user } = await requireAdministrator();
    return <div className={styles.shell}><Navigation user={{ name: user.name, email: user.email, twoFactorEnabled: !!user.twoFactorEnabled }}/><main id="admin-content" className={styles.workspace}>{children}</main></div>;
}
