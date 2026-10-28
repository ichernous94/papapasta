import React, { useRef, useEffect, useState } from 'react';
import styles from './Dropdown.module.scss';
import { IoChevronDownOutline } from 'react-icons/io5';

// TYPES
import { IDropdown } from '@/types';

type TDropdownProps = {
  onValueChange: (sortName: string) => void;
};

const Dropdown: React.FC<TDropdownProps> = ({ onValueChange }) => {
  const [sortName, setSortName] = useState<string>('');
  const [sortType, setSortType] = useState({
    name: 'Новейшие',
    sortProperty: 'newest',
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const dropdownMenu: IDropdown[] = [
    { name: 'Новейшие', sortProperty: 'newest' },
    { name: 'Старейшие', sortProperty: 'old' },
    {
      name: 'Цена от низкой',
      sortProperty: 'asc',
    },
    {
      name: 'Цена от высокой',
      sortProperty: 'desc',
    },
  ];

  const handlerDropdown = (item: IDropdown) => {
    setSortType(item);
    setSortName(item.sortProperty);
    setIsOpen(false);
  };

  // ADD PROPS to CategoryPage COMPONENT
  useEffect(() => {
    onValueChange(sortName);
  }, [sortName, onValueChange]);

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
    <div ref={selectRef} className={styles.dropdown}>
      <button
        className={styles.dropdown__btn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoChevronDownOutline
          className={isOpen ? styles.chevronRotate : styles.chevronDown}
        />
        <span>{sortType.name}</span>
        <p>Фильтры</p>
      </button>
      <div
        className={`${styles.dropdown__menu} ${isOpen && styles.openDropdown}`}
      >
        <ul className={styles.listDropdown}>
          {dropdownMenu.map((item, index) => (
            <li
              className={styles.listDropdown__item}
              key={index.toString()}
              onClick={() => handlerDropdown(item)}
              role="presentation"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
