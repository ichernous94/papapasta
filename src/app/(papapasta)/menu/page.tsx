import type { Metadata } from 'next';
import ImageBanner from '@/components/ImageBanner';
import MenuList from '@/components/MenuList';
import MenuTabs from '@/components/MenuTabs';
import Gallery from '@/components/Gallery';
import Button from '@/components/ui/Button';
import { mainMenu, autumnMenu, kidsMenu, wineMenu } from '@/config/papapasta-menu';
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
      <ImageBanner image={steakAndSides} title="MENU GŁÓWNE" subtitle="specjalności lokalu" headingLevel="h1" preload />
      <div className={styles.intro}>{papaPastaCopy.dishes.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <section className={styles.menuSection} aria-label="Menu główne">
        <MenuTabs label="Kategorie menu" tabs={mainMenu.map((category) => ({
          id: category.id,
          label: category.label,
          content: <>
            {category.note && <p className={styles.note}>{category.note}</p>}
            <MenuList groups={category.groups} columns={category.columns} columnBreak={category.columnBreak} />
          </>,
        }))} />
        <div className={styles.actions}>
          <Button href={papaPasta.phoneHref} variant="dark">ZAMÓW TELEFONICZNIE</Button>
          <Button href={papaPasta.orderUrl} variant="dark">ZAMÓW Z DOSTAWĄ NA PYSZNE.PL</Button>
        </div>
      </section>
      <ImageBanner image={autumnMenuImage} title="MENU JESIENNE" subtitle="Sapori d’Autunno" />
      <section className={styles.menuSection} aria-label="Menu jesienne"><MenuList groups={autumnMenu} /></section>
      <ImageBanner image={kidsMenuImage} title="MENU" subtitle="bambini" variant="kids" />
      <section className={styles.menuSection} aria-label="Menu bambini"><MenuList groups={kidsMenu} /></section>
      <ImageBanner id="kartawin" image={wineCellar} title="WINO" subtitle="i inne alkohole" />
      <section className={styles.menuSection} aria-label="Wino i inne alkohole">
        <MenuTabs label="Kategorie win i piw" tabs={wineMenu.map((category) => ({
          id: category.id,
          label: category.label,
          content: <MenuList groups={category.groups} />,
        }))} />
      </section>
      <Gallery images={galleryImages} />
    </>
  );
}
