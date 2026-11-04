import type { ReactNode } from 'react';
import DishRow from '@/components/DishRow';
import DishPhoto from '@/components/DishPhoto';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import type { RecommendationItem } from '@/types/restaurant';
import styles from './Recommendations.module.scss';

type ListProps = { items: readonly RecommendationItem[]; restaurantId?: 'papapasta' | 'centro' };
export function RecommendationList({ items, restaurantId }: ListProps) {
  return (<ul className={[styles.list, restaurantId && items.some(item => item.image) ? styles.photoList : ''].filter(Boolean).join(' ')}>
    {items.map((item) => restaurantId && item.image ? <li key={item.id}><DishRow restaurantId={restaurantId} item={{ ...item, price: String(item.price), portion: item.weight, description: item.description ? item.description.split('\n') : [] }}/></li> : (
      <li key={item.id} className={styles.item}>
        {item.image && <DishPhoto image={item.image} />}
        <div className={styles.itemHeading}>
          <h3>{item.name}{item.weight && <small> {item.weight}</small>}</h3>
          {item.price !== '' && <>
            <span className={styles.leader} aria-hidden="true" />
            <span className={styles.price}>{item.price}</span>
          </>}
        </div>
        <p>{item.description}</p>
      </li>
    ))}
  </ul>);
}
export function RecommendationHeading({ title = 'Z CAŁEGO SERCA', subtitle = 'polecamy' }: { title?: string; subtitle?: string }) {
  return <><Reveal as="h2" id="recommendations-title">{title}</Reveal>{subtitle && <p className={styles.subtitle}>{subtitle}</p>}</>;
}
export function RecommendationsFrame({ heading, children, variant = 'dark' }: { heading: ReactNode; children: ReactNode; variant?: 'light' | 'dark' }) {
  return <section className={styles.section} aria-labelledby="recommendations-title">
    <Container className={styles.content}>
      {heading}
      {children}
      <Button href="/menu" variant={variant}>ZOBACZ CAŁE MENU</Button>
    </Container>
  </section>;
}
export default function Recommendations({ items, title, subtitle, variant = 'dark', restaurantId }: ListProps & { title?: string; subtitle?: string; variant?: 'light' | 'dark' }) {
  return <RecommendationsFrame variant={variant} heading={<RecommendationHeading title={title} subtitle={subtitle}/>}>
    <RecommendationList items={items} restaurantId={restaurantId}/>
  </RecommendationsFrame>;
}
