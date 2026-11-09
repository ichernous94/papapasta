import { Suspense } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { papaPastaDarkSite } from '@/config/papapasta';
import { papaPastaMetadata } from '@/config/metadata';
import styles from './PapaPasta.module.scss';

export const metadata: Metadata = papaPastaMetadata;

export default function PapaPastaLayout({ children, dish }: { children: React.ReactNode; dish: React.ReactNode }) {
  return (
    <div className={styles.site}>
      <Suspense fallback={<div className={styles.headerFallback} aria-hidden="true"/>}><Header site={papaPastaDarkSite}/></Suspense>
      <main>{children}</main>
      {dish}
      <Footer site={papaPastaDarkSite}/>
    </div>
  );
}
