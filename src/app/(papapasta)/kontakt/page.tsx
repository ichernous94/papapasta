import type { Metadata } from 'next';
import ContactSection from '@/components/PapaPastaPages/ContactSection';
import MapSection from '@/components/PapaPastaPages/MapSection';
import Gallery from '@/components/Gallery';
import { galleryImages } from '@/config/papapasta-images';
import { papaPastaPageMetadata } from '@/config/metadata';

export const metadata: Metadata = papaPastaPageMetadata(
  '/kontakt',
  'Papa Pasta - Kontakt - Zarezerwuj stolik',
  'Zapraszamy do Papa Pasta: Rzemieślnicza 40/1U, 15-773 Białystok. Zarezerwuj stolik: 798 017 284. Napisz do nas: kontakt@papapasta.pl.',
);

export default function ContactPage() {
  return <><ContactSection /><MapSection /><Gallery images={galleryImages} /></>;
}
