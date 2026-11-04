'use client';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import styles from './CentroDishOverlay.module.scss';
export default function CentroDishOverlay({ children }: { children: ReactNode }) {
  const router = useRouter();
  return <Modal open onClose={() => router.back()} labelledBy="centro-dish-title" closeLabel="Zamknij kartę dania" className={styles.dialog}>{children}</Modal>;
}
