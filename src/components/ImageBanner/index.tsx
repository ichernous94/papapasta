import Image, { type StaticImageData } from 'next/image';
import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';
import styles from './ImageBanner.module.scss';

type ImageBannerProps = {
  image: StaticImageData;
  title: string;
  subtitle: string;
  headingLevel?: 'h1' | 'h2';
  preload?: boolean;
  id?: string;
  variant?: 'photo' | 'kids';
  content?: ReactNode;
};

export function ImageBannerHeading({ title, subtitle, headingLevel: Heading = 'h2' }: Pick<ImageBannerProps, 'title' | 'subtitle' | 'headingLevel'>) {
  return <><Reveal as={Heading}>{title}</Reveal>{subtitle && <p>{subtitle}</p>}</>;
}

export default function ImageBanner({ image, title, subtitle, headingLevel = 'h2', preload = false, id, variant = 'photo', content }: ImageBannerProps) {
  return (
    <section id={id} className={[styles.banner, variant === 'kids' && styles.kids].filter(Boolean).join(' ')} aria-label={title}>
      <Image src={image} alt="" fill placeholder="blur" sizes="(min-width: 1920px) 1920px, 100vw" preload={preload} className={styles.image} />
      <div className={styles.content}>
        {content ?? <ImageBannerHeading title={title} subtitle={subtitle} headingLevel={headingLevel}/>}
      </div>
    </section>
  );
}
