import { Suspense } from 'react';
import Image from '@/components/ui/PhotoImage';
import Link from 'next/link';
import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import RestaurantGallery from '@/components/RestaurantGallery';
import Reveal from '@/components/ui/Reveal';
import { centroCopy } from '@/config/centro';
import { centroImages as images } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import { publicPromotions } from '@/server/content/site-public';
import { promotionPath, promotionDate } from '@/types/content';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/promocje', 'Papa Pasta Centro - Okazje i promocje', 'Poznaj promocje Papa Pasta Centro: zestawy obiadowe, specjalne propozycje i sezonowe smaki przy Jurowieckiej 11 w Białymstoku.');
async function Cards() {
  const promotions = (await publicPromotions()).filter(p => p.image);
  return <Container className={`${styles.section} ${styles.cards}`}>{promotions.length ? promotions.map(promotion => <article key={promotion.id}><Link href={promotionPath(promotion)} className={styles.card}>
    <Reveal className={styles.cardImage}><Image src={promotion.image!.src} width={promotion.image!.width} height={promotion.image!.height} alt={promotion.image!.alt} placeholder="blur" blurDataURL={promotion.image!.blurDataURL} sizes="(min-width: 1170px) 554px, (min-width: 768px) 50vw, calc(100vw - 30px)"/></Reveal>
    <div className={styles.cardBody}><h2>{promotion.title}</h2><span>ZOBACZ SZCZEGÓŁY »</span></div>
    <time dateTime={promotion.date} className={styles.cardDate}>{promotionDate(promotion.date)}</time>
  </Link></article>) : <p>Aktualnie nie ma promocji. Zapraszamy wkrótce!</p>}</Container>;
}
export default function PromotionsPage() {
  return <><ImageBanner restaurantId="centro" image={images.landscape} title="OKAZJE I PROMOCJE" subtitle="specjalne propozycje w lokalu" headingLevel="h1" preload/>
    <Container size="text" className={styles.intro}><p>{centroCopy.promotions}</p></Container>
    <Suspense fallback={<Container className={styles.section}><p>Ładowanie promocji…</p></Container>}><Cards/></Suspense>
    <RestaurantGallery restaurantId="centro"/></>;
}
