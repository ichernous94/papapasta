import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';
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
        <Reveal as="h2" id={id + '-title'} className={styles.title}>{title}</Reveal>
        <div className={styles.body}>{children}</div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
      <Reveal className={styles.photo} direction="up">
        <Image src={image} alt={imageAlt} fill placeholder="blur" sizes="(min-width: 1920px) 1152px, (min-width: 1024px) 60vw, 100vw" />
      </Reveal>
    </section>
  );
}
