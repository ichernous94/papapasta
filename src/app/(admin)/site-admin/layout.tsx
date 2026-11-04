import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { adminMetadata } from '@/config/metadata';
import styles from '@/components/Admin/Admin.module.scss';
export const metadata: Metadata = { ...adminMetadata, title: 'PapaPasta — Admin Panel', referrer: 'same-origin' };
export default function AdminLayout({ children }: {
    children: ReactNode;
}) { return <div lang="en" className={styles.admin}>{children}</div>; }
