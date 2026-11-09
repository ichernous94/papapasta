import ImageBanner from '@/components/ImageBanner';
import ContentSection from '@/components/ContentSection';
import RestaurantGallery from '@/components/RestaurantGallery';
import Button from '@/components/ui/Button';
import { centroCopy } from '@/config/centro';
import { centroImages as images } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
export const metadata = centroPageMetadata('/nasz-lokal', 'Papa Pasta Centro - Poznaj nasz lokal', 'Poznaj Papa Pasta Centro przy ul. Jurowieckiej 11 w Białymstoku: designerskie wnętrze, włoska kuchnia i autorskie koktajle.');
export default function LocalPage() {
  return <>
    <ImageBanner restaurantId="centro" image={images.interior} title="NASZ LOKAL" subtitle="Vivi Bene, Carpe Diem" headingLevel="h1" preload />
    <ContentSection id="lokalizacja" title="LOKALIZACJA" image={images.exterior} imageAlt="Wejście do Papa Pasta Centro przy Jurowieckiej"><p>{centroCopy.location}</p></ContentSection>
    <ContentSection id="wnetrze" title="WNĘTRZE" image={images.interior} imageAlt="Bar i wnętrze Papa Pasta Centro" imageSide="left"><p>{centroCopy.interior}</p></ContentSection>
    <ContentSection id="cocktail-bar" title="COCKTAIL BAR" image={images.cocktails} imageAlt="Wybór koktajli Centro" actions={<Button href="/cocktail-bar#karta-koktajli">KARTA KOKTAJLI</Button>}><p>{centroCopy.cocktails}</p></ContentSection>
    <RestaurantGallery restaurantId="centro"/>
  </>;
}
