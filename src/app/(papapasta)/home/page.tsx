import type { Metadata } from 'next';
import VideoHero from '@/components/PapaPastaHome/VideoHero';
import AboutSection from '@/components/PapaPastaHome/AboutSection';
import DishesSection from '@/components/PapaPastaHome/DishesSection';
import WineSection from '@/components/PapaPastaHome/WineSection';
import Recommendations from '@/components/PapaPastaHome/Recommendations';
import Gallery from '@/components/PapaPastaHome/Gallery';
import { papaPastaMetadata } from '@/config/metadata';

export const metadata: Metadata = {
  alternates: { canonical: '/home' },
  openGraph: { ...papaPastaMetadata.openGraph, url: '/home' },
};

export default function PapaPastaHomePage() {
  return (
    <>
      <VideoHero />
      <AboutSection />
      <DishesSection />
      <WineSection />
      <Recommendations />
      <Gallery />
    </>
  );
}
