import React from 'react';
import styles from './Loader.module.scss';

const Loader: React.FC = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.preloader}>
        <div className={styles.loader}></div>
        <p className={styles.text}>Чертежи онлайн</p>
      </div>
    </div>
  );
};

export default Loader;
