import type { MenuGroup } from '@/config/papapasta-menu';
import styles from './MenuList.module.scss';

type MenuListProps = { groups: readonly MenuGroup[]; columns?: 2; columnBreak?: number };

function Groups({ groups }: Pick<MenuListProps, 'groups'>) {
  return groups.map((group) => (
    <div key={group.id} className={styles.group}>
      {group.title && <h3 className={styles.groupTitle}>{group.title}</h3>}
      {group.note && <p className={styles.note}>{group.note}</p>}
      <ul className={styles.list}>
        {group.items.map((item) => {
          const Heading = group.title ? 'h4' : 'h3';
          return (
            <li key={item.id} className={styles.item}>
              <div className={styles.heading}>
                <Heading>
                  {item.name}{item.portion && <small> {item.portion}</small>}
                  {item.isNew && <span className={styles.badge}>Nowość</span>}
                </Heading>
                {item.price && <>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.price}>{item.price}</span>
                </>}
              </div>
              {item.description?.map((line, index) => <p key={index} className={styles.description}>{line}</p>)}
            </li>
          );
        })}
      </ul>
      {group.afterNote && <p className={styles.afterNote}>{group.afterNote}</p>}
    </div>
  ));
}

export default function MenuList({ groups, columns, columnBreak = 1 }: MenuListProps) {
  return columns === 2 ? (
    <div className={styles.columns}>
      <div><Groups groups={groups.slice(0, columnBreak)} /></div>
      <div><Groups groups={groups.slice(columnBreak)} /></div>
    </div>
  ) : <div><Groups groups={groups} /></div>;
}
