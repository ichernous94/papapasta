import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { centro } from '@/config/centro';
import { centroMetadata } from '@/config/metadata';
import styles from './Centro.module.scss';

export const metadata = centroMetadata;
export default function CentroLayout({ children, dish }: { children: React.ReactNode; dish: React.ReactNode }) {
  return <div className={styles.site}><Suspense fallback={<div className={styles.headerFallback} aria-hidden="true"/>}><Header site={centro} /></Suspense><main>{children}</main>{dish}<Footer site={centro} /></div>;
}
