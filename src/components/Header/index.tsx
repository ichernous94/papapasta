'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, type CSSProperties } from 'react';
import { IoCloseOutline, IoMenuOutline } from 'react-icons/io5';
import Container from '@/components/ui/Container';
import BurgerMenu from '@/components/BurgerMenu';
import { papaPastaSite } from '@/config/papapasta';
import type { RestaurantConfig } from '@/types/restaurant';
import { restaurantPath } from '@/utils/restaurantPath';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import useExitPresence from '@/hooks/useExitPresence';
import useReducedMotion from '@/hooks/useReducedMotion';
import useBurgerMenuStore from '@/store/useBurgerMenuStore';
import styles from './Header.module.scss';

const MENU_DURATION = 350;

export default function Header({ site = papaPastaSite }: { site?: RestaurantConfig }) {
  const pathname = restaurantPath(usePathname());
  const navigationPathname = pathname.startsWith('/menu/') ? '/menu' : pathname;
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isOpen = useBurgerMenuStore((state) => state.isBurgerMenuOpen);
  const closeMenu = useBurgerMenuStore((state) => state.closeBurgerMenu);
  const toggleMenu = useBurgerMenuStore((state) => state.toggleBurgerMenu);

  const reducedMotion = useReducedMotion();
  const animatedPresence = useExitPresence(isOpen, reducedMotion ? 0 : MENU_DURATION);
  const menuPresent = reducedMotion ? isOpen : animatedPresence;
  const navigationTarget = useRef<string | null>(null);
  useBodyScrollLock(menuPresent);

  const navigateToTop = (href: string) => {
    navigationTarget.current = href;
    closeMenu();
    if (pathname === href && !menuPresent) {
      navigationTarget.current = null;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  useEffect(() => {
    if (menuPresent || navigationTarget.current !== pathname) return;
    navigationTarget.current = null;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, menuPresent]);

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
    if (!menuPresent) return;
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

    document.getElementById(menuId)?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });

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
        event.preventDefault(); last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault(); first.focus({ preventScroll: true });
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      inertElements.forEach((element) => { element.inert = false; });
      document.removeEventListener('keydown', onKeyDown);
      if (trigger?.getClientRects().length) trigger.focus({ preventScroll: true });
      else header.querySelector<HTMLAnchorElement>('a[href]')?.focus({ preventScroll: true });
    };
  }, [menuPresent, closeMenu, menuId]);

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-site={site.id}
      style={{ '--menu-duration': `${MENU_DURATION}ms` } as CSSProperties}
      role={menuPresent ? 'dialog' : undefined}
      aria-modal={menuPresent ? true : undefined}
      aria-label={menuPresent ? 'Nawigacja restauracji' : undefined}
    >
      <div className={styles.mobilePhone}>
        {site.phoneLabel} <a href={site.phoneHref}>{site.phone}</a>
      </div>
      <Container className={styles.bar}>
        <Link href={site.homeHref} className={styles.logoLink} scroll={false} onNavigate={() => navigateToTop(site.homeHref)} aria-label={site.name + " — strona główna"}>
          <Image src={site.logo.src} alt={site.name} width={site.logo.width} height={site.logo.height} className={styles.logo} unoptimized />
        </Link>
        <nav className={styles.desktopNavigation} aria-label="Główna nawigacja">
          <ul>
            {site.navigation.map((item) => (
              <li key={item.id}>
                {item.href.startsWith('https://') ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <Link href={item.href} scroll={false} onNavigate={() => navigateToTop(item.href)} aria-current={navigationPathname === item.href ? 'page' : undefined}>{item.label}</Link>
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
          aria-controls={menuId}
          aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
        >
          {isOpen ? <IoCloseOutline aria-hidden="true" /> : <IoMenuOutline aria-hidden="true" />}
        </button>
        <div className={styles.phone}>
          <span>{site.phoneLabel}</span>
          <a href={site.phoneHref}>{site.phone}</a>
        </div>
      </Container>
      {menuPresent && (
        <button className={styles.backdrop} data-state={isOpen ? 'open' : 'closing'} type="button" tabIndex={-1} onClick={closeMenu} aria-label="Zamknij menu" />
      )}
      <BurgerMenu id={menuId} navigation={site.navigation} pathname={navigationPathname} open={isOpen} present={menuPresent} onNavigate={navigateToTop} />
    </header>
  );
}
