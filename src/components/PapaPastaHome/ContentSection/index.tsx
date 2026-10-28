import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import styles from './ContentSection.module.scss';

type ContentSectionProps = {
  id: string;
  title: string;
  image: StaticImageData;
  imageAlt: string;
  imageSide?: 'left' | 'right';
  children: ReactNode;
  actions?: ReactNode;
};

export default function ContentSection({
  id, title, image, imageAlt, imageSide = 'right', children, actions,
}: ContentSectionProps) {
  return (
    <section
      id={id}
      className={[styles.section, imageSide === 'left' && styles.imageLeft].filter(Boolean).join(' ')}
      aria-labelledby={id + '-title'}
    >
      <div className={styles.copy}>
        <h2 id={id + '-title'} className={styles.title}>{title}</h2>
        <div className={styles.body}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <div className={styles.photo}>
        <Image src={image} alt={imageAlt} fill placeholder="blur" sizes="(min-width: 1024px) 60vw, 100vw" />
      </div>
    </section>
  );
}
