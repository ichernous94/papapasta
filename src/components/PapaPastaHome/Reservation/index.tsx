'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { papaPasta, papaPastaCopy } from '@/config/papapasta';
import styles from './Reservation.module.scss';

export default function Reservation() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="dark" onClick={() => setOpen(true)} aria-haspopup="dialog">
        ZAREZERWUJ STOLIK
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} labelledBy="reservation-title">
        <div className={styles.reservation}>
          <h2 id="reservation-title" tabIndex={-1} data-modal-heading>ZAREZERWUJ STOLIK</h2>
          <p className={styles.call}>
            Aby zarezerwować stolik zadzwoń pod numer{' '}
            <a href={papaPasta.phoneHref}>{papaPasta.phone}</a>
          </p>
          <p>{papaPastaCopy.reservation}</p>
        </div>
      </Modal>
    </>
  );
}
