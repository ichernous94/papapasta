import type { Metadata } from 'next';
import SectionHome from '@/components/SectionHome';
import { papaPastaMetadata } from '@/config/metadata';

export const metadata: Metadata = {
  ...papaPastaMetadata,
  alternates: { canonical: '/' },
  openGraph: {
    ...papaPastaMetadata.openGraph,
    url: '/',
  },
};

export default function LandingPage() {
  return (
    <main>
      <SectionHome />
    </main>
  );
}
