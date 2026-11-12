import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import CocktailBook from '@/components/CocktailBook';
import RestaurantGallery from '@/components/RestaurantGallery';
import { centroCopy } from '@/config/centro';
import { centroImages as images } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/cocktail-bar', 'Papa Pasta Centro - Cocktail Bar i karta alkoholi', 'Odkryj autorskie koktajle, włoskie spritze, toskańskie wina i alkohole premium w Papa Pasta Centro. Poznaj naszą kartę alkoholi.');
export default function CocktailBarPage() {
  return <><ImageBanner restaurantId="centro" image={images.cocktails} title="COCKTAIL BAR" subtitle="Karta alkoholi" headingLevel="h1" preload />
    <Container size="text" className={`${styles.intro} ${styles.cocktailIntro}`}><p>{centroCopy.cocktails}</p></Container>
    <CocktailBook className={styles.cocktailBook}/><RestaurantGallery restaurantId="centro"/>
  </>;
}
