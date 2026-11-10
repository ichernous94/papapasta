import MenuBanner from '@/components/MenuBanner';
import DatabaseMenuSection from '@/components/DatabaseMenuSection';
import Container from '@/components/ui/Container';
import RestaurantGallery from '@/components/RestaurantGallery';
import { centroCopy } from '@/config/centro';
import { centroImages as images } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/menu', 'Papa Pasta Centro - Menu Restauracji', 'Menu Papa Pasta Centro: włoska pizza, domowe makarony, steki, owoce morza, śniadania i desery w Białymstoku.');
export default function CentroMenuPage() {
  return <>
    <MenuBanner restaurantId="centro" menuKey="main" image={images.platter} headingLevel="h1" preload />
    <Container size="text" className={styles.intro}><p>{centroCopy.menu}</p></Container>
    <Container as="section" className={styles.section} aria-label="Menu główne Centro">
      <DatabaseMenuSection restaurantId="centro" menuKey="main" tabs noteClassName={styles.note}/>
    </Container>
    <MenuBanner restaurantId="centro" menuKey="kids" image={images.kids} variant="kids"/>
    <Container as="section" className={styles.section} aria-label="Menu dziecięce"><DatabaseMenuSection restaurantId="centro" menuKey="kids" tabs="auto" noteClassName={styles.note}/></Container>
    <MenuBanner restaurantId="centro" menuKey="drinks" image={images.cocktails}/>
    <Container as="section" className={styles.section} aria-label="Napoje"><DatabaseMenuSection restaurantId="centro" menuKey="drinks" tabs label="Kategorie napojów" noteClassName={styles.note}/></Container>
    <RestaurantGallery restaurantId="centro"/>
  </>;
}
