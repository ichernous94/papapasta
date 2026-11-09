import type { Metadata } from 'next';
import ContactPage from '@/components/ContactPage';
import { papaPasta, papaPastaSite } from '@/config/papapasta';
import RestaurantGallery from '@/components/RestaurantGallery';
import { papaPastaPageMetadata } from '@/config/metadata';

export const metadata: Metadata = papaPastaPageMetadata(
  '/kontakt',
  'Papa Pasta - Kontakt - Zarezerwuj stolik',
  'Zapraszamy do Papa Pasta: Rzemieślnicza 40/1U, 15-773 Białystok. Zarezerwuj stolik: 798 017 284. Napisz do nas: kontakt@papapasta.pl.',
);

export default function PapaPastaContactPage() {
  return <><ContactPage site={papaPastaSite} mapsEmbedUrl={papaPasta.mapsEmbedUrl} mapsUrl={papaPasta.mapsUrl}/><RestaurantGallery restaurantId="papapasta"/></>;
}
