'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MenuState.module.scss';

export default function MenuState({ error = false, recommendations = false }: { error?: boolean; recommendations?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <div className={styles.state} role={error ? 'alert' : 'status'} aria-busy={pending}>
    <p>{error ? 'Nie udało się załadować menu.' : recommendations ? 'Obecnie brak rekomendacji.' : 'Menu jest obecnie niedostępne.'}</p>
    {error && <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())}>{pending ? 'Ładowanie…' : 'Spróbuj ponownie'}</button>}
  </div>;
}
