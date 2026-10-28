import React, { useEffect, useRef, useState } from 'react';
import styles from './DropdownCategory.module.scss';
import { IoChevronDownOutline } from 'react-icons/io5';
import Link from 'next/link';

// CATEGORIES ARRAY
const categoriesArr = [
  {
    id: 'sborochnye-chertezhi-i-detalirovka-prisposobleniy',
    link: '/category/sborochnye-chertezhi-i-detalirovka-prisposobleniy',
    title: 'Сборочные чертежи и деталировка приспособлений',
  },
  {
    id: 'planirovka-otdeleniy-i-zon-atp',
    link: '/category/planirovka-otdeleniy-i-zon-atp',
    title: 'Планировочные решения отделений и зон АТП',
  },
  {
    id: 'general-plans-atp-sto-other',
    link: '/category/general-plans-atp-sto-other',
    title: 'Чертежи генеральных планов АТП, СТО и других предприятий',
  },
  {
    id: 'coursework',
    link: '/category/coursework',
    title: 'Курсовые работы',
  },
  {
    id: 'diploma',
    link: '/category/diploma',
    title: 'Дипломные работы',
  },
  {
    id: 'marshrutnaya-karta',
    link: '/category/marshrutnaya-karta',
    title: 'Маршрутные карты (технологический процесс)',
  },
];

const DropdownCategory: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // CLOSE DROPDOWN MENU
  useEffect(() => {
    const handleClickOut = (e: MouseEvent) => {
      if (!e.composedPath().includes(selectRef.current as EventTarget)) {
        setIsOpen(false);
      }
    };
    document.body.addEventListener('click', handleClickOut);
    return () => {
      document.body.removeEventListener('click', handleClickOut);
    };
  }, []);

  return (
    <div ref={selectRef} className={styles.dropdownCategory}>
      <button
        className={styles.dropdownCategory__btn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <p>Категории</p>
        <IoChevronDownOutline
          className={isOpen ? styles.chevronRotate : styles.chevronDown}
        />
      </button>
      <div
        className={`${styles.dropdownCategory__menu} ${
          isOpen && styles.openDropdown
        }`}
      >
        <ul className={styles.dropdownCategory__menu__list}>
          {categoriesArr.map((category) => (
            <li key={category.id} className={styles.item} role="presentation">
              <Link href={category.link}>{category.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownCategory;
