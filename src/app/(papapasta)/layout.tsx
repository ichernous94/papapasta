import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { papaPastaMetadata } from '@/config/metadata';

export const metadata: Metadata = papaPastaMetadata;

export default function PapaPastaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
