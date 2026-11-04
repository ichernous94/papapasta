import AllergenList from '@/components/AllergenList';
import Image from 'next/image';
import type { CentroDish } from '@/server/content/centro-dishes';
import styles from './CentroDishCard.module.scss';
export default function CentroDishCard({ dish, modal = false }: { dish: CentroDish; modal?: boolean }) {
  const Heading = modal ? 'h2' : 'h1';
  return <article className={styles.card}>
    <div className={styles.image}><Image src={dish.image.src} alt={dish.image.alt} width={dish.image.width} height={dish.image.height}
      sizes="(max-width: 599px) calc(100vw - 80px), (max-width: 1023px) 38vw, 430px" placeholder="blur" blurDataURL={dish.image.blurDataURL} loading="eager"/></div>
    <div className={styles.copy}>
      <p className={styles.category}>{dish.category}</p>
      <div className={styles.heading}><Heading id="centro-dish-title" data-modal-heading={modal ? '' : undefined} tabIndex={modal ? -1 : undefined}>{dish.name}</Heading>{dish.price && <span className={styles.price}>{dish.price}</span>}</div>
      {dish.portion && <p className={styles.portion}>{dish.portion}</p>}
      {dish.isNew && <p className={styles.badge}>Nowość</p>}
      {dish.description?.map((line, index) => <p key={index} className={styles.description}>{line}</p>)}
      <AllergenList allergens={dish.allergens}/>
    </div>
  </article>;
}
