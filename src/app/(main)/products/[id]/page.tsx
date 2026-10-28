import React from 'react';
import Link from 'next/link';
import styles from './Product.module.scss';

// COMPONENTS
import ProductDescription from '@/components/ProductDescription';

// ISR SERVICE
import { getProductById } from '@/lib/getProductById';
import { IoChevronBackCircle } from 'react-icons/io5';

// PROPS
type Props = {
  params: Promise<{ id: string }>;
};

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;
  const data = await getProductById(id);
  const productById = data;

  return (
    <section className={styles.productPage}>
      <div className="productPage__container">
        {/* HEADER */}
        <div className={styles.productPage__header}>
          <Link href="/">
            <IoChevronBackCircle
              className={styles.backBtn}
              role="presentation"
            />
          </Link>
          <h1 className={styles.title}>{productById.title}</h1>
        </div>
        {/* PRODUCT DESCRIPTION */}
        <ProductDescription productById={productById} />
      </div>
    </section>
  );
};

export default ProductPage;
