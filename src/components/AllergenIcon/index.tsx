import type { ReactNode } from 'react';
import type { AllergenId } from '@/config/allergens';

const drawings: Record<AllergenId, ReactNode> = {
  milk: <><path d="M20 12h8v4l3 5v15H17V21l3-5Z"/><path d="M20 16h8M20 12v-2h8v2M20 24v8"/></>,
  gluten: <><path d="M24 37V12M24 27c-7 0-10-4-9-9 6 0 9 4 9 9Zm0 0c7 0 10-4 9-9-6 0-9 4-9 9Zm0 7c-6 0-9-3-9-7 5 0 9 3 9 7Zm0 0c6 0 9-3 9-7-5 0-9 3-9 7Z"/><path d="M24 20c-4-3-4-7 0-11 4 4 4 8 0 11Z"/></>,
  nuts: <><path d="M15 32c-6-11 7-23 16-20 10 7 4 22-8 24-4 1-7-1-8-4Z"/><path d="M18 32c7-4 12-10 13-17M19 28l3-5"/></>,
  crustaceans: <><path d="M15 19c-5 2-5 8 0 12 5 5 15 3 18-4 3-6-2-13-8-13-4 0-7 3-6 6 1 4 7 3 7 0"/><path d="M17 30l-5 5 8-1M25 15l5-5m-2 6 7-3M15 19l5 4m-6 1 6 3m-3 3 6 1"/><circle cx="25" cy="17" r=".75"/></>,
  eggs: <><path d="M35 27c0 7-5 11-11 11s-11-4-11-11S19 10 24 10s11 10 11 17Z"/><path d="M18 26c0-3 2-7 4-9"/></>,
  fish: <><path d="M11 24c7-12 20-12 25 0-5 12-18 12-25 0Zm0 0-5-7v14l5-7ZM23 15l5-5 2 7m-7 16 5 5 2-7"/><path d="M29 18c-3 4-3 8 0 12"/><circle cx="32" cy="23" r=".8"/></>,
  peanuts: <><path d="M18 11c5-3 10 0 11 5 0 3 1 4 4 6 5 4 5 10 1 14-5 4-11 2-13-3-1-3-2-4-5-6-5-4-5-12 2-16Z"/><path d="m18 17 4 2m-6 3 4 2m3-8 1 4m0 7 4 2m-3 4 4 1m1-10 1 4"/></>,
  soy: <><path d="M13 34c-4-10 1-22 12-24 10 1 13 10 9 18-4 7-13 10-21 6Z"/><path d="M15 32c8-4 15-10 17-17"/><ellipse cx="22" cy="24" rx="4" ry="5" transform="rotate(40 22 24)"/></>,
  celery: <><path d="m19 37 1-16m9 16-1-16m-4 16V19M19 37h10M20 22c-9 0-10-8-5-10 4-1 7 3 9 7m4 3c9 0 10-8 5-10-4-1-7 3-9 7"/><path d="M24 19c-5-7-4-12 0-12s5 5 0 12Z"/></>,
  mustard: <><path d="M23 37V15m0 13 9-7m-9 1-8-7"/><circle cx="23" cy="11" r="4"/><circle cx="12" cy="12" r="3"/><circle cx="35" cy="18" r="3"/><path d="M23 34c7 0 11-3 11-7-6 0-10 2-11 7Z"/></>,
  sesame: <><ellipse cx="17" cy="17" rx="3" ry="6" transform="rotate(-30 17 17)"/><ellipse cx="30" cy="16" rx="3" ry="6" transform="rotate(25 30 16)"/><ellipse cx="24" cy="30" rx="3" ry="6" transform="rotate(25 24 30)"/><ellipse cx="35" cy="31" rx="2.5" ry="5" transform="rotate(45 35 31)"/><ellipse cx="12" cy="31" rx="2.5" ry="5" transform="rotate(-30 12 31)"/></>,
  sulphites: <><path d="M19 10h10m-8 0v10l-8 13c-1 2 0 4 3 4h16c3 0 4-2 3-4l-8-13V10M17 29h14"/><circle cx="22" cy="32" r="1"/><circle cx="27" cy="26" r="1"/></>,
  lupin: <><path d="M24 38V10m0 24-9-4m9 0 9-4"/><ellipse cx="21" cy="15" rx="3" ry="4" transform="rotate(-35 21 15)"/><ellipse cx="27" cy="15" rx="3" ry="4" transform="rotate(35 27 15)"/><ellipse cx="20" cy="23" rx="4" ry="3"/><ellipse cx="28" cy="23" rx="4" ry="3"/><path d="m24 37-8-1-4-7 7 2m5 6 8-1 4-7-7 2"/></>,
  molluscs: <><path d="M13 30c-12-15 3-25 11-15 8-10 23 0 11 15l-7 7h-8l-7-7Z"/><path d="m24 16-1 19m-9-19 7 19m13-19-9 19M10 23l10 13m18-13L27 36m-8 2h10"/></>,
};

export default function AllergenIcon({ id, className }: { id: AllergenId; className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22"/>{drawings[id]}</svg>;
}
