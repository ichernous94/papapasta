import ContactPage from '@/components/ContactPage';
import RestaurantGallery from '@/components/RestaurantGallery';
import { centro, centroMapsEmbedUrl } from '@/config/centro';
import { centroPageMetadata } from '@/config/metadata';
export const metadata = centroPageMetadata('/kontakt', 'Papa Pasta Centro - Kontakt', 'Skontaktuj się z Papa Pasta Centro: Jurowiecka 11/1, Białystok, tel. 883 317 389, kontakt@papapasta.pl.');
export default function CentroContactPage() {
  return <><ContactPage site={centro} mapsEmbedUrl={centroMapsEmbedUrl} mapsUrl="https://www.google.com/maps/search/?api=1&query=Jurowiecka+11%2F1+Bia%C5%82ystok"/><RestaurantGallery restaurantId="centro"/></>;
}
