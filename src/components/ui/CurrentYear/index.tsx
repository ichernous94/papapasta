'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  const onVisible = () => { if (!document.hidden) callback(); };
  document.addEventListener('visibilitychange', onVisible);
  const timer = window.setInterval(callback, 60_000);
  return () => {
    document.removeEventListener('visibilitychange', onVisible);
    window.clearInterval(timer);
  };
}

function getYear() {
  return new Intl.DateTimeFormat('pl-PL', { year: 'numeric', timeZone: 'Europe/Warsaw' }).format(new Date());
}

export default function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getYear, () => null);
  return <span>{year}</span>;
}
