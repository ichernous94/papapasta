import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import MenuTabs from '@/components/MenuTabs';
import MenuList from '@/components/MenuList';
import Gallery from '@/components/Gallery';
import { centroCopy } from '@/config/centro';
import { centroMainMenu, centroBreakfast, centroAutumnMenu, centroKidsMenu } from '@/config/centro-menu';
import { centroImages as images, centroGallery } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/menu', 'Papa Pasta Centro - Menu Restauracji', 'Menu Papa Pasta Centro: włoska pizza, domowe makarony, steki, owoce morza, śniadania i desery w Białymstoku.');
export default function CentroMenuPage() {
  return <>
    <ImageBanner image={images.platter} title="MENU GŁÓWNE" subtitle="specjalności lokalu" headingLevel="h1" preload />
    <Container size="text" className={styles.intro}><p>{centroCopy.menu}</p></Container>
    <Container as="section" className={styles.section} aria-label="Menu główne Centro">
      <MenuTabs label="Kategorie menu" tabs={centroMainMenu.map(category => ({ id: category.id, label: category.label, content: <>
        {category.note && <p className={styles.note}>{category.note}</p>}
        <MenuList groups={category.groups} columns={category.columns} columnBreak={category.columnBreak} />
      </> }))} />
    </Container>
    <ImageBanner image={images.breakfast} title="MENU ŚNIADAŃ" subtitle="" />
    <Container as="section" className={styles.section} aria-label="Menu śniadań"><MenuList groups={centroBreakfast} columns={2} /></Container>
    <ImageBanner image={images.autumn} title="JESIENNE SMAKI" subtitle="Sapori d’Autunno" />
    <Container as="section" className={styles.section} aria-label="Jesienne smaki"><MenuList groups={centroAutumnMenu} /></Container>
    <ImageBanner image={images.kids} title="MENU" subtitle="bambini" variant="kids" />
    <Container as="section" className={styles.section} aria-label="Menu bambini"><MenuList groups={centroKidsMenu} /></Container>
    <Gallery name="Papa Pasta Centro" images={centroGallery} />
  </>;
}
