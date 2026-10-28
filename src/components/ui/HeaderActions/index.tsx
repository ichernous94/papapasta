'use client';

import React from 'react';
import Link from 'next/link';
import styles from './HeaderActions.module.scss';
import { IoSearchOutline, IoBagOutline } from 'react-icons/io5';

// ZUSTAND
import useStore from '@/store/useStore';
import useCartStore from '@/store/useCartStore';
import useSearchMenuStore from '@/store/useSearchMenuStore';
import useBurgerMenuStore from '@/store/useBurgerMenuStore';

const HeaderActions: React.FC = () => {
  const cartStore = useStore(useCartStore, (state) => state);
  const { toggleSearchrMenu } = useSearchMenuStore((state) => state);
  const { isBurgerMenuOpen, toggleBurgerMenu } = useBurgerMenuStore((state) => state);

  return (
    <div className={styles.actions}>
      {/* SEARCH BTN */}
      <div className={styles.actions__searchField} onClick={toggleSearchrMenu}>
        <IoSearchOutline className={styles.icon} />
        <span>Поиск...</span>
      </div>
      <IoSearchOutline
        className={styles.actions__searchIcon}
        onClick={toggleSearchrMenu}
      />
      {/* CART BTN */}
      <Link
        href="/cart"
        className={styles.actions__cart}
        aria-label="View shopping cart"
      >
        <IoBagOutline />
        {cartStore?.getTotalProducts() && cartStore.getTotalProducts() > 0 ? (
          <span>{cartStore.getTotalProducts()}</span>
        ) : null}
      </Link>
      {/* BURGER MENU BTN */}
      <button
        type="button"
        aria-label="Open navigation menu"
        className={`${styles.actions__burger} ${
          isBurgerMenuOpen ? styles.burgerTransform : ''
        }`}
        onClick={toggleBurgerMenu}
      >
        <span></span>
      </button>
    </div>
  );
};

export default HeaderActions;
