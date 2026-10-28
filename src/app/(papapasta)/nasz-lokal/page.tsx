import type { Metadata } from 'next';
import ImageBanner from '@/components/ImageBanner';
import Gallery from '@/components/Gallery';
import DeliveryBanner from '@/components/DeliveryBanner';
import { localGalleryImages, restaurantInterior } from '@/config/papapasta-images';
import { papaPastaCopy } from '@/config/papapasta';
import { papaPastaPageMetadata } from '@/config/metadata';
import styles from '@/components/PapaPastaPages/PageContent.module.scss';

export const metadata: Metadata = papaPastaPageMetadata(
  '/nasz-lokal',
  'Papa Pasta - Poznaj nasz lokal - Pizza Wino Steki',
  'Restauracja Papa Pasta to nie tylko przepyszna kuchnia toskańska, ale i wyjątkowa atmosfera. Poznaj nasz lokal przy ul. Rzemieślniczej w Białymstoku.',
);

export default function RestaurantPage() {
  return (
    <>
      <ImageBanner image={restaurantInterior} title="NASZ LOKAL" subtitle="pizza wino steki" headingLevel="h1" preload />
      <div className={styles.intro}><p>{papaPastaCopy.local}</p></div>
      <Gallery images={localGalleryImages} variant="grid" />
      <DeliveryBanner />
    </>
  );
}
