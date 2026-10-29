'use client';

import Link from 'next/link';
import { papaPastaNavigation } from '@/config/papapasta';
import styles from './BurgerMenu.module.scss';

type BurgerMenuProps = {
  pathname: string;
  open: boolean;
  present: boolean;
  onNavigate: (href: string) => void;
};

export default function BurgerMenu({ pathname, open, present, onNavigate }: BurgerMenuProps) {
  if (!present) return null;

  return (
    <nav id="papapasta-mobile-menu" className={styles.menu} data-state={open ? 'open' : 'closing'} aria-label="Menu restauracji">
      <ul>
        {papaPastaNavigation.map((item) => (
          <li key={item.id}>
            {item.href.startsWith('https://') ? (
              <a href={item.href} onClick={() => onNavigate(item.href)}>{item.label}</a>
            ) : (
              <Link href={item.href} scroll={false} onNavigate={() => onNavigate(item.href)} aria-current={pathname === item.href ? 'page' : undefined}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
