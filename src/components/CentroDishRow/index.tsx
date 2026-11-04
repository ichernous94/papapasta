import Image from 'next/image';
import Link from 'next/link';
import type { MenuItem } from '@/types/menu';
import { centroDishPath } from '@/server/content/centro-dishes';
import styles from './CentroDishRow.module.scss';

type Props = { item: MenuItem; headingLevel?: 'h3' | 'h4' };
export default function CentroDishRow({ item, headingLevel: Heading = 'h3' }: Props) {
  if (!item.image) return null;
  return <Link href={centroDishPath(item)} scroll={false} prefetch={false} className={styles.row} aria-label={`Zobacz danie: ${item.name}`}>
    <div className={styles.copy}>
      <div className={styles.heading}>
        <Heading>{item.name}{item.portion && <small> {item.portion}</small>}{item.isNew && <span className={styles.badge}>Nowość</span>}</Heading>
        {item.price && <span className={styles.price}>{item.price}</span>}
      </div>
      {item.description?.map((line, index) => <p key={index} className={styles.description}>{line}</p>)}
    </div>
    <div className={styles.photo}>
      <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height}
        sizes="(max-width: 599px) calc(100vw - 60px), (max-width: 1023px) 28vw, 340px"
        placeholder="blur" blurDataURL={item.image.blurDataURL}/>
    </div>
  </Link>;
}
