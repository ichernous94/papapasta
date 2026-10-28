import type { Metadata } from 'next';
import { papaPastaMetadata } from '@/config/metadata';

// COMPONENTS
import Header from '@/components/Header';
import GoTopBtn from '@/components/ui/GoTopBtn';
import Cookie from '@/components/ui/Cookie';
import Footer from '@/components/Footer';

export const metadata: Metadata = papaPastaMetadata;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <div className="wrapper" id="home">
      <Header />
      <main>{children}</main>
      <GoTopBtn />
      <Cookie />
      <Footer />
    </div>
  );
}
