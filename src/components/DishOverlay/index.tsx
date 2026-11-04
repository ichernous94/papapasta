'use client';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import styles from './DishOverlay.module.scss';
export default function DishOverlay({ children, restaurantId }: { children: ReactNode; restaurantId: 'papapasta' | 'centro' }) {
  const router = useRouter();
  return <Modal open onClose={() => router.back()} labelledBy="dish-title" closeLabel="Zamknij kartę dania" className={`${styles.dialog} ${restaurantId === 'papapasta' ? styles.light : ''}`}>{children}</Modal>;
}
