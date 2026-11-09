import DishBadges from '@/components/DishBadges';
import { menuText } from '@/utils/menuText';
import MenuPrice from '@/components/MenuPrice';
import Image from '@/components/ui/PhotoImage';
import Link from 'next/link';
import type { MenuItem } from '@/types/menu';
import { dishPath } from '@/server/content/dishes';
import styles from './DishRow.module.scss';

type Props = { restaurantId: 'papapasta' | 'centro'; item: MenuItem; headingLevel?: 'h3' | 'h4' };
export default function DishRow({ item, restaurantId, headingLevel: Heading = 'h3' }: Props) {
  if (!item.image) return null;
  return <Link href={dishPath(item)} scroll={false} prefetch={false} className={`${styles.row} ${restaurantId === 'papapasta' ? styles.light : ''}`} aria-label={`Zobacz danie: ${item.name}`}>
    <div className={styles.copy}>
      <div className={styles.heading}>
        <Heading>{item.name}{item.portion && <small> {item.portion}</small>}<DishBadges item={item}/>{item.isNew && <span className={styles.badge}>Nowość</span>}</Heading>
        {item.price && <span className={styles.price}><MenuPrice value={item.price}/></span>}
      </div>
      {item.description?.map((line, index) => <p key={index} className={styles.description}>{menuText(line)}</p>)}
    </div>
    <div className={styles.photo}>
      <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height}
        sizes="(max-width: 599px) 40vw, (max-width: 1023px) 28vw, 340px"
        placeholder="blur" blurDataURL={item.image.blurDataURL}/>
    </div>
  </Link>;
}
