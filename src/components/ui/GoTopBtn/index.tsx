'use client';

import React, { useEffect, useState } from 'react';
import styles from './GoTopBtn.module.scss';
import { FaArrowUpLong } from 'react-icons/fa6';

const GoTopBtn: React.FC = () => {
  const [isView, setIsView] = useState<boolean>(false);

  // SCROLL TO TOP FUNCTION
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // VISIBLE GO TO TOP BTN
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      scrollY >= 300 ? setIsView(true) : setIsView(false);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`${styles.goTopBtn} ${isView ? styles.showBtn : ''}`}
    >
      <FaArrowUpLong />
    </button>
  );
};

export default GoTopBtn;
