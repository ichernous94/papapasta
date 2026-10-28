import Image from 'next/image';
import Button from '@/components/ui/Button';
import { papaPasta, papaPastaCopy } from '@/config/papapasta';
import background from '../../../public/images/papapasta/food-delivery.jpg';
import styles from './DeliveryBanner.module.scss';

export default function DeliveryBanner() {
  return (
    <section className={styles.banner} aria-label="Zamów z dostawą">
      <Image src={background} alt="" fill placeholder="blur" sizes="100vw" className={styles.background} />
      <div className={styles.content}>
        <Image src="/icons/logo_papapasta.svg" alt="Papa Pasta Pizza Wino Steki" width={319} height={72} className={styles.logo} />
        <p>{papaPastaCopy.delivery}</p>
        <Button href={papaPasta.orderUrl}>ZAMÓW Z DOSTAWĄ</Button>
      </div>
    </section>
  );
}
