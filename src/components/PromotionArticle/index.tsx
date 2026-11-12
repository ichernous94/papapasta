import Image from 'next/image';
import Button from '@/components/ui/Button';
import { centro } from '@/config/centro';
import type { Promotion } from '@/types/content';
import { promotionDate } from '@/types/content';
import styles from '@/components/CentroPages/CentroPages.module.scss';
import PromotionArticleFrame from './Frame';
import PromotionArticleReveal from './Reveal';
export default function PromotionArticle({ promotion }: { promotion: Promotion }) {
  return <PromotionArticleFrame title={promotion.slug === 'zestawy-obiadowe' ? 'ZESTAWY OBIADOWE' : promotion.title} subtitle={promotion.slug === 'zestawy-obiadowe' ? 'Więcej smaku za mniej' : 'Okazje i promocje'}>
    <PromotionArticleReveal imageSrc={promotion.image?.src ?? ''} imageRatio={promotion.image ? promotion.image.width / promotion.image.height : undefined}>
      {promotion.image && <Image src={promotion.image.src} width={promotion.image.width} height={promotion.image.height} alt={promotion.image.alt} sizes="(min-width: 768px) 738px, calc(100vw - 30px)"/>}
      <h2>{promotion.title}</h2><p><time dateTime={promotion.date}>{promotionDate(promotion.date)}</time></p>
      {promotion.body.map((block,index) => block.type === 'heading' ? <h3 key={index}>{block.text}</h3> : block.type === 'list' ? <ul key={index}>{block.text.split(/\r?\n/).filter(line => line.trim()).map((line,i) => <li key={i}>{line}</li>)}</ul> : <p key={index}>{block.text}</p>)}
      <div className={styles.section}><Button href={centro.phoneHref}>ZADZWOŃ DO LOKALU</Button></div>
    </PromotionArticleReveal>
  </PromotionArticleFrame>;
}
