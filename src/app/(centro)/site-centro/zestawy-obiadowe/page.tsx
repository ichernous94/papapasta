import Image from '@/components/ui/PhotoImage';
import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Gallery from '@/components/Gallery';
import { centro } from '@/config/centro';
import { centroImages as images, centroGallery } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/zestawy-obiadowe', 'Zestawy obiadowe - Papa Pasta Centro', 'Zestawy obiadowe w Papa Pasta Centro: od poniedziałku do piątku, 12:00–17:00. Zupa z makaronem, sałatką lub pizzą i deser ze zniżką.');
export default function LunchPage() {
  return <>
    <ImageBanner restaurantId="centro" image={images.landscape} title="ZESTAWY OBIADOWE" subtitle="Więcej smaku za mniej" headingLevel="h1" preload />
    <Container as="section" size="text" className={[styles.section, styles.article].join(' ')} aria-label="Szczegóły promocji">
      <Image src={images.promotion} alt="Zestawy obiadowe Papa Pasta Centro, poniedziałek–piątek, 12:00–17:00" placeholder="blur" sizes="(min-width: 768px) 738px, calc(100vw - 30px)" />
      <h2>Więcej smaku za mniej – zestawy obiadowe w Papa Pasta Centro</h2>
      <p><time dateTime="2025-10-28">28 października 2025</time></p>
      <p>Zapraszamy na zestawy obiadowe od poniedziałku do piątku, w godzinach 12:00–17:00, w Papa Pasta Centro przy ul. Jurowieckiej 11 w Białymstoku.</p>
      <ul><li>Zupa + dowolny makaron — 59 zł</li><li>Zupa + dowolna sałatka — 55 zł</li><li>Zupa + dowolna pizza — 57 zł</li></ul>
      <p>Do zestawu zamów deser ze zniżką 50%.</p>
      <p>Odwiedź nas w porze obiadowej, wybierz swój zestaw i zakończ posiłek czymś słodkim.</p>
      <div className={styles.section}><Button href={centro.phoneHref}>ZADZWOŃ DO LOKALU</Button></div>
    </Container>
    <Gallery name="Papa Pasta Centro" images={centroGallery} />
  </>;
}
