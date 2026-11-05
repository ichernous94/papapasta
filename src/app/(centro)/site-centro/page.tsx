import VideoHero from '@/components/VideoHero';
import ContentSection from '@/components/ContentSection';
import Gallery from '@/components/Gallery';
import Button from '@/components/ui/Button';
import { centroCopy } from '@/config/centro';
import { centroImages as images, centroGallery } from '@/config/centro-images';
import { centroMetadata, centroPageMetadata } from '@/config/metadata';

export const metadata = centroPageMetadata('/', centroMetadata.title, centroMetadata.description);
export default function CentroHome() {
  return <>
    <VideoHero videoSrc="/videos/centro.mp4" poster={images.cocktails} name="Papa Pasta Centro" logo={{ src: '/icons/centro_logo_big.svg', width: 140, height: 135 }} />
    <ContentSection id="o-nas" title="O NAS" image={images.interior} imageAlt="Wnętrze Papa Pasta Centro"><p>{centroCopy.about}</p></ContentSection>
    <ContentSection id="cocktail-bar" title="COCKTAIL BAR" image={images.mojito} imageAlt="Autorski zielony koktajl" imageSide="left" actions={<Button href="/cocktail-bar#karta-koktajli">KARTA KOKTAJLI</Button>}><p>{centroCopy.cocktails}</p></ContentSection>
    <ContentSection id="nasze-potrawy" title="NASZE POTRAWY" image={images.chicken} imageAlt="Kurczak ze szparagami" actions={<Button href="/menu">ZOBACZ MENU</Button>}><p>{centroCopy.dishes}</p></ContentSection>
    <Gallery name="Papa Pasta Centro" images={centroGallery} />
  </>;
}
