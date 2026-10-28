'use client';

import Link from 'next/link';
import { papaPastaNavigation } from '@/config/papapasta';
import useBurgerMenuStore from '@/store/useBurgerMenuStore';
import styles from './BurgerMenu.module.scss';

export default function BurgerMenu({ pathname }: { pathname: string }) {
  const isOpen = useBurgerMenuStore((state) => state.isBurgerMenuOpen);
  const closeMenu = useBurgerMenuStore((state) => state.closeBurgerMenu);
  if (!isOpen) return null;

  return (
    <nav id="papapasta-mobile-menu" className={styles.menu} aria-label="Menu restauracji">
      <ul>
        {papaPastaNavigation.map((item) => (
          <li key={item.id}>
            {item.href.startsWith('https://') ? (
              <a href={item.href} onClick={closeMenu}>{item.label}</a>
            ) : (
              <Link href={item.href} onClick={closeMenu} aria-current={pathname === item.href ? 'page' : undefined}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
