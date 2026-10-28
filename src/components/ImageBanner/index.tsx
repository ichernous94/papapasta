import Image, { type StaticImageData } from 'next/image';
import styles from './ImageBanner.module.scss';

type ImageBannerProps = {
  image: StaticImageData;
  title: string;
  subtitle: string;
  headingLevel?: 'h1' | 'h2';
  preload?: boolean;
  id?: string;
  variant?: 'photo' | 'kids';
};

export default function ImageBanner({ image, title, subtitle, headingLevel: Heading = 'h2', preload = false, id, variant = 'photo' }: ImageBannerProps) {
  return (
    <section id={id} className={[styles.banner, variant === 'kids' && styles.kids].filter(Boolean).join(' ')} aria-label={title}>
      <Image src={image} alt="" fill placeholder="blur" sizes="100vw" preload={preload} className={styles.image} />
      <div className={styles.content}>
        <Heading>{title}</Heading>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
