import Container from '@/components/ui/Container';
import type { Metadata } from 'next';
import MenuBanner from '@/components/MenuBanner';
import DatabaseMenuSection from '@/components/DatabaseMenuSection';
import Gallery from '@/components/Gallery';
import Button from '@/components/ui/Button';
import { galleryImages, steakAndSides, autumnMenuImage, kidsMenuImage, wineCellar } from '@/config/papapasta-images';
import { papaPasta, papaPastaCopy } from '@/config/papapasta';
import { papaPastaPageMetadata } from '@/config/metadata';
import styles from '@/components/PapaPastaPages/PageContent.module.scss';

export const metadata: Metadata = papaPastaPageMetadata(
  '/menu',
  'Papa Pasta - Menu Restauracji - Pizza Wino Steki',
  'Poznaj menu Papa Pasta w Białymstoku: domowe makarony, włoska pizza, steki, desery i wina. Kuchnia toskańska to prawdziwa fantazja smaków!',
);

export default function MenuPage() {
  return (
    <>
      <MenuBanner restaurantId="papapasta" menuKey="main" image={steakAndSides} headingLevel="h1" preload />
      <Container size="text" className={styles.intro}>{papaPastaCopy.dishes.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Container>
      <Container as="section" className={styles.menuSection} aria-label="Menu główne">
        <DatabaseMenuSection restaurantId="papapasta" menuKey="main" tabs noteClassName={styles.note}/>
        <div className={styles.actions}>
          <Button href={papaPasta.phoneHref} variant="dark">ZAMÓW TELEFONICZNIE</Button>
          <Button href={papaPasta.orderUrl} variant="dark">ZAMÓW Z DOSTAWĄ NA PYSZNE.PL</Button>
        </div>
      </Container>
      <MenuBanner restaurantId="papapasta" menuKey="autumn" image={autumnMenuImage} />
      <Container as="section" className={styles.menuSection} aria-label="Menu jesienne"><DatabaseMenuSection restaurantId="papapasta" menuKey="autumn"/></Container>
      <MenuBanner restaurantId="papapasta" menuKey="kids" image={kidsMenuImage} variant="kids" />
      <Container as="section" className={styles.menuSection} aria-label="Menu bambini"><DatabaseMenuSection restaurantId="papapasta" menuKey="kids"/></Container>
      <MenuBanner restaurantId="papapasta" menuKey="wine" id="kartawin" image={wineCellar} />
      <Container as="section" className={styles.menuSection} aria-label="Wino i inne alkohole">
        <DatabaseMenuSection restaurantId="papapasta" menuKey="wine" tabs label="Kategorie win i piw"/>
      </Container>
      <Gallery images={galleryImages} />
    </>
  );
}
