import DishBadges from '@/components/DishBadges';
import { menuText } from '@/utils/menuText';
import MenuPrice from '@/components/MenuPrice';
import DishRow from '@/components/DishRow';
import DishPhoto from '@/components/DishPhoto';
import type { MenuGroup } from '@/types/menu';
import styles from './MenuList.module.scss';

type MenuListProps = { groups: readonly MenuGroup[]; columns?: 2; columnBreak?: number; variant?: 'default' | 'centro' | 'papapasta' };

function Groups({ groups, variant }: Pick<MenuListProps, 'groups' | 'variant'>) {
  return groups.map((group) => (
    <div key={group.id} className={styles.group}>
      {group.title && <h3 className={styles.groupTitle}>{group.title}</h3>}
      {group.note && <p className={styles.note}>{menuText(group.note)}</p>}
      <ul className={[styles.list, variant !== 'default' && group.items.some(item => item.image) ? styles.photoList : ''].filter(Boolean).join(' ')}>
        {group.items.map((item) => {
          const Heading = group.title ? 'h4' : 'h3';
          if (variant !== 'default' && item.image) return <li key={item.id}><DishRow restaurantId={variant === 'papapasta' ? 'papapasta' : 'centro'} item={item} headingLevel={Heading}/></li>;
          return (
            <li key={item.id} className={styles.item}>
              {item.image && <DishPhoto image={item.image} />}
              <div className={styles.heading}>
                <Heading>
                  {item.name}{item.portion && <small> {item.portion}</small>}
                  <DishBadges item={item}/>{item.isNew && <span className={styles.badge}>Nowość</span>}
                </Heading>
                {item.price && <>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.price}><MenuPrice value={item.price}/></span>
                </>}
              </div>
              {item.description?.map((line, index) => <p key={index} className={styles.description}>{menuText(line)}</p>)}
            </li>
          );
        })}
      </ul>
      {group.afterNote && <p className={styles.afterNote}>{menuText(group.afterNote)}</p>}
    </div>
  ));
}

export default function MenuList({ groups, columns, columnBreak = 1, variant = 'default' }: MenuListProps) {
  const hasPhotos = variant !== 'default' && groups.some(group => group.items.some(item => item.image));
  return columns === 2 && !hasPhotos ? (
    <div className={`${styles.columns} ${variant === 'default' ? '' : `${styles.restaurant} ${styles[variant!]}`}`}>
      <div><Groups groups={groups.slice(0, columnBreak)} variant={variant} /></div>
      <div><Groups groups={groups.slice(columnBreak)} variant={variant} /></div>
    </div>
  ) : <div className={variant === 'default' ? undefined : `${styles.restaurant} ${styles[variant!]}`}><Groups groups={groups} variant={variant} /></div>;
}
