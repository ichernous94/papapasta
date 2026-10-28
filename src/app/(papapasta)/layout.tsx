import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { papaPastaMetadata } from '@/config/metadata';
import styles from './PapaPasta.module.scss';

export const metadata: Metadata = papaPastaMetadata;

export default function PapaPastaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.site}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
