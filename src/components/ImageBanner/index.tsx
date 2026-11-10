import type { StaticImageData } from 'next/image';
import Image from '@/components/ui/PhotoImage';
import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';
import { MenuAnchorLink } from '@/components/MenuAnchors';
import styles from './ImageBanner.module.scss';

type ImageBannerProps = {
  image: StaticImageData | { src: string; width: number; height: number; blurDataURL?: string; alt: string };
  title: string;
  subtitle: string;
  headingLevel?: 'h1' | 'h2';
  preload?: boolean;
  id?: string;
  variant?: 'photo' | 'kids';
  content?: ReactNode;
  restaurantId?: 'papapasta' | 'centro';
  revealKey?: string;
  menuAnchor?: string;
};

export function ImageBannerHeading({ title, subtitle, headingLevel: Heading = 'h2', revealKey, menuAnchor }: Pick<ImageBannerProps, 'title' | 'subtitle' | 'headingLevel' | 'revealKey' | 'menuAnchor'>) {
  return <><Reveal as={Heading} onceKey={revealKey}>{menuAnchor ? <MenuAnchorLink anchor={menuAnchor} className={styles.headingLink}>{title}</MenuAnchorLink> : title}</Reveal>{subtitle && <p>{subtitle}</p>}</>;
}

export default function ImageBanner({ image, title, subtitle, headingLevel = 'h2', preload = false, id, variant = 'photo', content, restaurantId = 'papapasta', revealKey, menuAnchor }: ImageBannerProps) {
  return (
    <section id={id} className={[styles.banner, variant === 'kids' && styles.kids].filter(Boolean).join(' ')} aria-label={title}>
      {menuAnchor && menuAnchor !== id && <span id={menuAnchor} className={styles.anchor} aria-hidden="true"/>}
      <Image src={image} alt="" fill placeholder={image.blurDataURL ? "blur" : "empty"} blurDataURL={image.blurDataURL} sizes="(min-width: 1920px) 1920px, 100vw" preload={preload} className={styles.image} />
      <div className={styles.content}>
        {content ?? <ImageBannerHeading title={title} subtitle={subtitle} headingLevel={headingLevel} menuAnchor={menuAnchor} revealKey={`${restaurantId}:banner:${revealKey ?? id ?? title}`}/>}
      </div>
    </section>
  );
}
