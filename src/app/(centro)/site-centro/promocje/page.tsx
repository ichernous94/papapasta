import { Suspense } from 'react';
import PromotionCard from '@/components/PromotionCard';
import PromotionCardSkeleton from '@/components/PromotionCard/Skeleton';
import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import RestaurantGallery from '@/components/RestaurantGallery';
import { centroCopy } from '@/config/centro';
import { centroImages as images } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import { publicPromotions } from '@/server/content/site-public';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/promocje', 'Papa Pasta Centro - Okazje i promocje', 'Poznaj promocje Papa Pasta Centro: zestawy obiadowe, specjalne propozycje i sezonowe smaki przy Jurowieckiej 11 w Białymstoku.');
async function Cards() {
  const promotions = (await publicPromotions()).filter(p => p.image);
  return <Container className={`${styles.section} ${styles.cards}`}>{promotions.length ? promotions.map(promotion => <PromotionCard key={promotion.id} promotion={promotion}/>) : <p>Aktualnie nie ma promocji. Zapraszamy wkrótce!</p>}</Container>;
}
export default function PromotionsPage() {
  return <><ImageBanner restaurantId="centro" image={images.landscape} title="OKAZJE I PROMOCJE" subtitle="specjalne propozycje w lokalu" headingLevel="h1" preload/>
    <Container size="text" className={styles.intro}><p>{centroCopy.promotions}</p></Container>
    <Suspense fallback={<Container className={`${styles.section} ${styles.cards}`}><PromotionCardSkeleton/></Container>}><Cards/></Suspense>
    <RestaurantGallery restaurantId="centro"/></>;
}
