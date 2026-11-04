import { Suspense } from 'react';
import { publicMenus } from '@/server/content/public';
import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import MenuTabs from '@/components/MenuTabs';
import MenuList from '@/components/MenuList';
import Gallery from '@/components/Gallery';
import { centroCopy } from '@/config/centro';
import { centroImages as images, centroGallery } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/menu', 'Papa Pasta Centro - Menu Restauracji', 'Menu Papa Pasta Centro: włoska pizza, domowe makarony, steki, owoce morza, śniadania i desery w Białymstoku.');
export default function CentroMenuPage() { return <Suspense fallback={<p>Ładowanie menu…</p>}><MenuContent /></Suspense>; }
async function MenuContent() {
  const data = await publicMenus('centro');
  const section = (key: string) => { const menu = data.find(m => m.key === key); if (!menu) throw new Error('Menu not seeded'); return menu; };
  const centroMainMenu = section('main').categories, centroBreakfast = section('breakfast').categories.flatMap(c => c.groups), centroAutumnMenu = section('autumn').categories.flatMap(c => c.groups), centroKidsMenu = section('kids').categories.flatMap(c => c.groups);
  return <>
    <ImageBanner image={images.platter} title={section('main').title} subtitle={section('main').subtitle} headingLevel="h1" preload />
    <Container size="text" className={styles.intro}><p>{centroCopy.menu}</p></Container>
    <Container as="section" className={styles.section} aria-label="Menu główne Centro">
      <MenuTabs variant="centro" label="Kategorie menu" tabs={centroMainMenu.map(category => ({ id: category.id, label: category.label, content: <>
        {category.note && <p className={styles.note}>{category.note}</p>}
        <MenuList variant="centro" groups={category.groups} columns={category.columns} columnBreak={category.columnBreak} />
      </> }))} />
    </Container>
    <ImageBanner image={images.breakfast} title={section('breakfast').title} subtitle={section('breakfast').subtitle} />
    <Container as="section" className={styles.section} aria-label="Menu śniadań"><MenuList variant="centro" groups={centroBreakfast} columns={2} /></Container>
    <ImageBanner image={images.autumn} title={section('autumn').title} subtitle={section('autumn').subtitle} />
    <Container as="section" className={styles.section} aria-label="Jesienne smaki"><MenuList variant="centro" groups={centroAutumnMenu} /></Container>
    <ImageBanner image={images.kids} title={section('kids').title} subtitle={section('kids').subtitle} variant="kids" />
    <Container as="section" className={styles.section} aria-label="Menu bambini"><MenuList variant="centro" groups={centroKidsMenu} /></Container>
    <Gallery name="Papa Pasta Centro" images={centroGallery} />
  </>;
}
