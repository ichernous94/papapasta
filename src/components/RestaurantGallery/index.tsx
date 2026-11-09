import { Suspense } from 'react';
import { unstable_rethrow } from 'next/navigation';
import Gallery from '@/components/Gallery';
import { publicGallery } from '@/server/content/site-public';
import type { RestaurantId } from '@/types/content';
async function Content({ restaurantId }: { restaurantId: RestaurantId }) {
  let gallery;
  try { gallery = await publicGallery(restaurantId); }
  catch (error) { unstable_rethrow(error); return <p role="status" style={{ padding: '1rem', textAlign: 'center' }}>Galeria jest chwilowo niedostępna.</p>; }
  const images = gallery.images.flatMap(row => row.image ? [{ id: row.id, image: row.image, alt: row.alt }] : []);
  return images.length ? <Gallery images={images} name={restaurantId === 'centro' ? 'Papa Pasta Centro' : 'Papa Pasta'}/> : null;
}
export default function RestaurantGallery(props: { restaurantId: RestaurantId }) {
  return <Suspense fallback={<div aria-label="Ładowanie galerii" style={{ minHeight: '10rem' }}/> }><Content {...props}/></Suspense>;
}
