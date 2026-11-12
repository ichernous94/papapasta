'use client';
import { useId, useState } from 'react';
import Image from '@/components/DishImage';
import Modal from '@/components/ui/Modal';
import type { DishImage } from '@/types/menu';
import styles from './DishPhoto.module.scss';
export default function DishPhoto({ image }: { image: DishImage }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <button
        className={styles.thumbnail}
        type="button"
        aria-label={`Powiększ zdjęcie: ${image.alt}`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="96px"
          placeholder="blur"
          blurDataURL={image.blurDataURL}
        />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy={id}
        className={styles.viewer}
        animationDuration={650}
      >
        <h2 id={id} className={styles.hidden} data-modal-heading tabIndex={-1}>
          {image.alt}
        </h2>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="90vw"
          placeholder="blur"
          blurDataURL={image.blurDataURL}
        />
      </Modal>
    </>
  );
}
