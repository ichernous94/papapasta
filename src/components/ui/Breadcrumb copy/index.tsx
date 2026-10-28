import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumb.module.scss';
import { IoChevronForwardOutline } from 'react-icons/io5';

type BreadcrumbItem = {
  label: string;
  href?: string; // Если не передать — будет просто текст (активный элемент)
  shortLabel?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className={styles.breadcrumb}>
      {items.map((item, index) => (
        <div key={index} className={styles.breadcrumb__item}>
          {item.href ? (
            <Link href={item.href}>
              {item.shortLabel ? (
                <>
                  <span className={styles.desktop}>{item.label}</span>
                  <span className={styles.mobile}>{item.shortLabel}</span>
                </>
              ) : (
                item.label
              )}
            </Link>
          ) : (
            <span className={styles.breadcrumb__current}>
              {item.shortLabel ? (
                <>
                  <span className={styles.desktop}>{item.label}</span>
                  <span className={styles.mobile}>{item.shortLabel}</span>
                </>
              ) : (
                item.label
              )}
            </span>
          )}

          {index < items.length - 1 && (
            <IoChevronForwardOutline className={styles.breadcrumb__icon} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
