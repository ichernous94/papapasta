import { FaHeart, FaPepperHot } from 'react-icons/fa';
import type { MenuItem } from '@/types/menu';
import styles from './DishBadges.module.scss';
export default function DishBadges({ item }: { item: Pick<MenuItem, 'recommended' | 'spicy'> }) {
  if (!item.recommended && !item.spicy) return null;
  return <span className={styles.badges}>
    {item.recommended && <span role="img" aria-label="Polecamy" title="Polecamy"><FaHeart aria-hidden="true"/></span>}
    {item.spicy && <span role="img" aria-label="Danie pikantne" title="Danie pikantne"><FaPepperHot aria-hidden="true"/></span>}
  </span>;
}
