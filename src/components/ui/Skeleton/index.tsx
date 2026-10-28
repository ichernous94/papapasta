import React from 'react';
import styles from './Skeleton.module.scss';

// COMPONENT ICON
import { LogoWithText } from '../Icon';

type SkeletonType = {
  type: string;
};

const Skeleton: React.FC<SkeletonType> = ({ type }) => {
  const ProductSearchItemSkeleton = () => (
    <div className={styles.productSearchItemSkeleton}>
      <div className={styles.productSearchItemSkeleton__img}>
        <LogoWithText className={styles.logo} />
      </div>
      <div className={styles.productSearchItemSkeleton__title}></div>
      <div className={styles.productSearchItemSkeleton__price}></div>
    </div>
  );

  const ProductItemSkeleton = () => (
    <div className={styles.productItemSkeleton}>
      <div className={styles.productItemSkeleton__img}>
        <LogoWithText className={styles.logo} />
      </div>
      <div className={styles.productItemSkeleton__title}></div>
      <div className={styles.productItemSkeleton__price}></div>
    </div>
  );

  const ProductBreadCrumbSkeleton = () => (
    <div className={styles.productBreadCrumbSkeleton}></div>
  );

  const ProductDescriptionSliderSkeleton = () => (
    <div className={styles.productDescriptionSliderSkeleton}>
      <LogoWithText className={styles.logo} />
    </div>
  );

  const ProductOptionsSkeleton = () => (
    <div className={styles.productOptionsSkeleton}>
      <div className={styles.productOptionsSkeleton__title}></div>
      <div className={styles.productOptionsSkeleton__price}></div>
      <div className={styles.productOptionsSkeleton__btn}></div>
      <div className={styles.productOptionsSkeleton__contents}></div>
    </div>
  );

  const ProductInfoSkeleton = () => (
    <div className={styles.productInfoSkeleton}></div>
  );

  if (type === 'productSearchItem') return <ProductSearchItemSkeleton />;
  if (type === 'productItem') return <ProductItemSkeleton />;
  if (type === 'productBreadCrumb') return <ProductBreadCrumbSkeleton />;
  if (type === 'productSlider') return <ProductDescriptionSliderSkeleton />;
  if (type === 'productOptions') return <ProductOptionsSkeleton />;
  if (type === 'productInfo') return <ProductInfoSkeleton />;

  return null;
};

export default Skeleton;
