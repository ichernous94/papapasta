import { Suspense } from 'react';
import { publicMenus } from '@/server/content/public';
import Container from '@/components/ui/Container';
import type { Metadata } from 'next';
import ImageBanner from '@/components/ImageBanner';
import MenuList from '@/components/MenuList';
import MenuTabs from '@/components/MenuTabs';
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

export default function MenuPage() { return <Suspense fallback={<p>Ładowanie menu…</p>}><MenuContent /></Suspense>; }
async function MenuContent() {
  const data = await publicMenus('papapasta');
  const section = (key: string) => { const menu = data.find(m => m.key === key); if (!menu) throw new Error('Menu not seeded'); return menu; };
  const mainMenu = section('main').categories, autumnMenu = section('autumn').categories.flatMap(c => c.groups), kidsMenu = section('kids').categories.flatMap(c => c.groups), wineMenu = section('wine').categories;
  return (
    <>
      <ImageBanner image={steakAndSides} title={section('main').title} subtitle={section('main').subtitle} headingLevel="h1" preload />
      <Container size="text" className={styles.intro}>{papaPastaCopy.dishes.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</Container>
      <Container as="section" className={styles.menuSection} aria-label="Menu główne">
        <MenuTabs variant="papapasta" label="Kategorie menu" tabs={mainMenu.map((category) => ({
          id: category.id,
          label: category.label,
          content: <>
            {category.note && <p className={styles.note}>{category.note}</p>}
            <MenuList variant="papapasta" groups={category.groups} columns={category.columns} columnBreak={category.columnBreak} />
          </>,
        }))} />
        <div className={styles.actions}>
          <Button href={papaPasta.phoneHref} variant="dark">ZAMÓW TELEFONICZNIE</Button>
          <Button href={papaPasta.orderUrl} variant="dark">ZAMÓW Z DOSTAWĄ NA PYSZNE.PL</Button>
        </div>
      </Container>
      <ImageBanner image={autumnMenuImage} title={section('autumn').title} subtitle={section('autumn').subtitle} />
      <Container as="section" className={styles.menuSection} aria-label="Menu jesienne"><MenuList variant="papapasta" groups={autumnMenu} /></Container>
      <ImageBanner image={kidsMenuImage} title={section('kids').title} subtitle={section('kids').subtitle} variant="kids" />
      <Container as="section" className={styles.menuSection} aria-label="Menu bambini"><MenuList variant="papapasta" groups={kidsMenu} /></Container>
      <ImageBanner id="kartawin" image={wineCellar} title={section('wine').title} subtitle={section('wine').subtitle} />
      <Container as="section" className={styles.menuSection} aria-label="Wino i inne alkohole">
        <MenuTabs variant="papapasta" label="Kategorie win i piw" tabs={wineMenu.map((category) => ({
          id: category.id,
          label: category.label,
          content: <MenuList variant="papapasta" groups={category.groups} />,
        }))} />
      </Container>
      <Gallery images={galleryImages} />
    </>
  );
}
