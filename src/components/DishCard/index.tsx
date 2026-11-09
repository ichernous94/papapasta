import DishBadges from '@/components/DishBadges';
import { menuText } from '@/utils/menuText';
import AllergenList from '@/components/AllergenList';
import Image from '@/components/ui/PhotoImage';
import type { Dish } from '@/server/content/dishes';
import styles from './DishCard.module.scss';
export default function DishCard({ dish, modal = false }: { dish: Dish; modal?: boolean }) {
  const Heading = modal ? 'h2' : 'h1';
  return <article className={`${styles.card} ${dish.restaurantId === 'papapasta' ? styles.light : ''}`}>
    <div className={styles.image}><Image src={dish.image.src} alt={dish.image.alt} width={dish.image.width} height={dish.image.height}
      sizes="(max-width: 599px) calc(100vw - 80px), (max-width: 1023px) 38vw, 430px" placeholder="blur" blurDataURL={dish.image.blurDataURL} loading="eager"/></div>
    <div className={styles.copy}>
      <p className={styles.category}>{dish.category}</p>
      <div className={styles.heading}><Heading id="dish-title" data-modal-heading={modal ? '' : undefined} tabIndex={modal ? -1 : undefined}>{dish.name}<DishBadges item={dish}/></Heading>{dish.price && <span className={styles.price}>{menuText(dish.price)}</span>}</div>
      {dish.portion && <p className={styles.portion}>{dish.portion}</p>}
      {dish.isNew && <p className={styles.badge}>Nowość</p>}
      {dish.description?.map((line, index) => <p key={index} className={styles.description}>{menuText(line)}</p>)}
      <AllergenList allergens={dish.allergens}/>
    </div>
  </article>;
}
