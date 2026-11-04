'use client';

import { useId, useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import promotionalImage from '../../../public/images/promotional/promotional-image.jpg';
import styles from './PromotionalPopup.module.scss';

const offers = [
  ['Crème Brulée — 38 zł', 'Kremowy, deserowy koktajl na rumie z nutą wanilii, Cointreau i aksamitną pianką.'],
  ['Vanilla Pear — 37 zł', 'Rześki gin sour z soczystą gruszką, waniliowym akcentem i delikatną pianką.'],
  ['Aperol Martini — 38 zł', 'Tequila reposado i Aperol w duecie z cydrem, limonką oraz pikantnym miodem.'],
  ['Golden Fall — 39 zł', 'Bourbon Maker’s Mark i amaretto w słodko-kwaśnym wydaniu z cynamonem i pianką.'],
  ['Cinnamone Fashion — 39 zł, pikantny', 'Korzenny miks bourbonu i Jack Daniel’s Fire ze słodkim cynamonem oraz rześkim cydrem.'],
] as const;

export default function PromotionalPopup() {
  // Centro's persistent layout owns this state. A new document shows the offer again.
  const [open, setOpen] = useState(true);
  const titleId = useId();

  return <Modal open={open} onClose={() => setOpen(false)} labelledBy={titleId}
    closeLabel="Zamknij ofertę promocyjną" className={styles.dialog}
    onKeyDown={event => {
      // The poster has only one interactive control; keep both Tab directions on it.
      if (event.key === 'Tab') {
        event.preventDefault();
        event.currentTarget.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
      }
    }}>
    <Image className={styles.poster} src={promotionalImage} alt="" placeholder="blur" loading="eager"
      sizes="(max-height: 499px) min(480px, calc(100vw - 36px)), min(680px, calc(100vw - 36px), calc((100svh - 36px) * 2079 / 2954))"/>
    <div className={styles.transcript}>
      <h2 id={titleId}>Rozgrzewające menu — Włoska Jesień</h2>
      <p>Papa Pasta Centro</p>
      <ul>{offers.map(([name, description]) => <li key={name}><h3>{name}</h3><p>{description}</p></li>)}</ul>
    </div>
  </Modal>;
}
