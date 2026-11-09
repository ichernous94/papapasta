import Image from '@/components/ui/PhotoImage';
import Link from 'next/link';
import ImageBanner from '@/components/ImageBanner';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import RestaurantGallery from '@/components/RestaurantGallery';
import { centro } from '@/config/centro';
import { centroImages } from '@/config/centro-images';
import type { Promotion } from '@/types/content';
import { promotionDate } from '@/types/content';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export default function PromotionArticle({ promotion }: { promotion: Promotion }) {
  return <>
    <ImageBanner restaurantId="centro" image={centroImages.landscape} title={promotion.slug === 'zestawy-obiadowe' ? 'ZESTAWY OBIADOWE' : promotion.title} subtitle={promotion.slug === 'zestawy-obiadowe' ? 'Więcej smaku za mniej' : 'Okazje i promocje'} headingLevel="h1" preload/>
    <Container as="section" size="text" className={`${styles.section} ${styles.article}`} aria-label="Szczegóły promocji">
      <Link href="/promocje" className={styles.link}>← Wróć do promocji</Link>
      {promotion.image && <Image src={promotion.image.src} width={promotion.image.width} height={promotion.image.height} blurDataURL={promotion.image.blurDataURL} placeholder="blur" alt={promotion.image.alt} sizes="(min-width: 768px) 738px, calc(100vw - 30px)"/>}
      <h2>{promotion.title}</h2><p><time dateTime={promotion.date}>{promotionDate(promotion.date)}</time></p>
      {promotion.body.map((block,index) => block.type === 'heading' ? <h3 key={index}>{block.text}</h3> : block.type === 'list' ? <ul key={index}>{block.text.split(/\r?\n/).filter(line => line.trim()).map((line,i) => <li key={i}>{line}</li>)}</ul> : <p key={index}>{block.text}</p>)}
      <div className={styles.section}><Button href={centro.phoneHref}>ZADZWOŃ DO LOKALU</Button></div>
    </Container>
    <RestaurantGallery restaurantId="centro"/>
  </>;
}
