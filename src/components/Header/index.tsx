'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { IoCloseOutline, IoMenuOutline } from 'react-icons/io5';
import BurgerMenu from '@/components/BurgerMenu';
import { papaPasta, papaPastaNavigation } from '@/config/papapasta';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useBurgerMenuStore from '@/store/useBurgerMenuStore';
import styles from './Header.module.scss';

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isOpen = useBurgerMenuStore((state) => state.isBurgerMenuOpen);
  const closeMenu = useBurgerMenuStore((state) => state.closeBurgerMenu);
  const toggleMenu = useBurgerMenuStore((state) => state.toggleBurgerMenu);

  useBodyScrollLock(isOpen);

  useEffect(() => { closeMenu(); }, [pathname, closeMenu]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1025px)');
    const onChange = () => { if (media.matches) closeMenu(); };
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [closeMenu]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const updateHeight = () => document.documentElement.style.setProperty(
      '--restaurant-header-height', header.getBoundingClientRect().height + 'px'
    );
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--restaurant-header-height');
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const header = headerRef.current;
    if (!header) return;
    const trigger = toggleRef.current;
    const inertElements: HTMLElement[] = [];
    let branch = header;
    while (branch.parentElement && branch !== document.body) {
      const parent = branch.parentElement;
      Array.from(parent.children).forEach((child) => {
        if (child !== branch && child instanceof HTMLElement && !child.inert) {
          child.inert = true;
          inertElements.push(child);
        }
      });
      branch = parent;
    }

    header.querySelector<HTMLAnchorElement>('#papapasta-mobile-menu a')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(header.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]'
      )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const outside = !header.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      inertElements.forEach((element) => { element.inert = false; });
      document.removeEventListener('keydown', onKeyDown);
      if (trigger?.getClientRects().length) trigger.focus({ preventScroll: true });
      else header.querySelector<HTMLAnchorElement>('a[href]')?.focus({ preventScroll: true });
    };
  }, [isOpen, closeMenu]);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      role={isOpen ? 'dialog' : undefined}
      aria-modal={isOpen ? true : undefined}
      aria-label={isOpen ? 'Nawigacja restauracji' : undefined}
    >
      <div className={styles.mobilePhone}>
        ZAMÓW Z DOSTAWĄ <a href={papaPasta.phoneHref}>{papaPasta.phone}</a>
      </div>
      <div className={styles.bar}>
        <Link href="/home" className={styles.logoLink} onClick={closeMenu} aria-label="Papa Pasta — strona główna">
          <Image src="/icons/logo.svg" alt="Papa Pasta Restauracja" width={481} height={51} className={styles.logo} unoptimized />
        </Link>
        <nav className={styles.desktopNavigation} aria-label="Główna nawigacja">
          <ul>
            {papaPastaNavigation.map((item) => (
              <li key={item.id}>
                {item.href.startsWith('https://') ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <Link href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="papapasta-mobile-menu"
          aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
        >
          {isOpen ? <IoCloseOutline aria-hidden="true" /> : <IoMenuOutline aria-hidden="true" />}
        </button>
        <div className={styles.phone}>
          <span>ZAMÓW Z DOSTAWĄ</span>
          <a href={papaPasta.phoneHref}>{papaPasta.phone}</a>
        </div>
      </div>
      {isOpen && (
        <button className={styles.backdrop} type="button" tabIndex={-1} onClick={closeMenu} aria-label="Zamknij menu" />
      )}
      <BurgerMenu pathname={pathname} />
    </header>
  );
}
