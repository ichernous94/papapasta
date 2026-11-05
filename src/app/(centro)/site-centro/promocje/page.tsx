import Image from '@/components/ui/PhotoImage';
import Link from 'next/link';
import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import Gallery from '@/components/Gallery';
import Reveal from '@/components/ui/Reveal';
import { centroCopy } from '@/config/centro';
import { centroImages as images, centroGallery } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/promocje', 'Papa Pasta Centro - Okazje i promocje', 'Poznaj promocje Papa Pasta Centro: zestawy obiadowe, specjalne propozycje i sezonowe smaki przy Jurowieckiej 11 w Białymstoku.');
export default function PromotionsPage() {
  return <>
    <ImageBanner restaurantId="centro" image={images.landscape} title="OKAZJE I PROMOCJE" subtitle="specjalne propozycje w lokalu" headingLevel="h1" preload />
    <Container size="text" className={styles.intro}><p>{centroCopy.promotions}</p></Container>
    <Container className={[styles.section, styles.cards].join(' ')}>
      <article><Link href="/zestawy-obiadowe/" className={styles.card}>
        <Reveal className={styles.cardImage}><Image src={images.promotion} alt="Więcej smaku za mniej — zestawy obiadowe w Papa Pasta Centro" placeholder="blur" sizes="(min-width: 1170px) 554px, (min-width: 768px) 50vw, calc(100vw - 30px)" /></Reveal>
        <div className={styles.cardBody}><h2>Więcej smaku za mniej – zestawy obiadowe w Papa Pasta Centro</h2><span>ZOBACZ SZCZEGÓŁY »</span></div>
        <time dateTime="2025-10-28" className={styles.cardDate}>28 października, 2025</time>
      </Link></article>
    </Container>
    <Gallery name="Papa Pasta Centro" images={centroGallery} />
  </>;
}
