'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Cookie.module.scss';

// ZUSTAND
import useStore from '@/store/useStore';
import useCookieStore from '@/store/useCookieStore';

const Cookie: React.FC = () => {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const cookieStore = useStore(useCookieStore, (state) => state);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`${styles.cookie} ${showBanner ? styles.bannerVisible : ''} ${
        cookieStore?.isAccept ? styles.bannerHidden : ''
      }`}
    >
      <div className={styles.cookie__container}>
        <div className={styles.cookie__content}>
          <Image
            className={styles.cookie__content__img}
            src="/svg/cookie.svg"
            alt="Cookie"
            width={62}
            height={62}
          />
          <p className={styles.cookie__content__text}>
            Мы используем файлы cookie, чтобы пользоваться сайтом и делиться
            информацией было удобно. Подробнее в{' '}
            <Link href="/privacy">политике обработки персональных данных.</Link>{' '}
            .
          </p>
        </div>
        <button className={`${styles.cookie__btn} btn-yellow`} onClick={cookieStore?.setAccept}>
          Принять
        </button>
      </div>
    </div>
  );
};

export default Cookie;
