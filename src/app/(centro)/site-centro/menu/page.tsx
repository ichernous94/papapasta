import AdditionalMenuSections from '@/components/AdditionalMenuSections';
import OptionalMenuSection from '@/components/OptionalMenuSection';
import MenuBanner from '@/components/MenuBanner';
import DatabaseMenuSection from '@/components/DatabaseMenuSection';
import Container from '@/components/ui/Container';
import Gallery from '@/components/Gallery';
import { centroCopy } from '@/config/centro';
import { centroImages as images, centroGallery } from '@/config/centro-images';
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
    <OptionalMenuSection restaurantId="centro" menuKey="breakfast">
<MenuBanner restaurantId="centro" menuKey="breakfast" image={images.breakfast} />
    <Container as="section" className={styles.section} aria-label="Menu śniadań"><DatabaseMenuSection restaurantId="centro" menuKey="breakfast" columns={2}/></Container>
</OptionalMenuSection>
    <OptionalMenuSection restaurantId="centro" menuKey="autumn">
<MenuBanner restaurantId="centro" menuKey="autumn" image={images.autumn} />
    <Container as="section" className={styles.section} aria-label="Jesienne smaki"><DatabaseMenuSection restaurantId="centro" menuKey="autumn"/></Container>
</OptionalMenuSection>
    <OptionalMenuSection restaurantId="centro" menuKey="kids">
<MenuBanner restaurantId="centro" menuKey="kids" image={images.kids} variant="kids" />
    <Container as="section" className={styles.section} aria-label="Menu bambini"><DatabaseMenuSection restaurantId="centro" menuKey="kids"/></Container>
</OptionalMenuSection>
    <AdditionalMenuSections restaurantId="centro" className={styles.section} noteClassName={styles.note}/>
    <Gallery name="Papa Pasta Centro" images={centroGallery} />
  </>;
}
