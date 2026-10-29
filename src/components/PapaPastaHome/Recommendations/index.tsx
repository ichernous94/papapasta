import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { papaPastaRecommendations } from '@/config/papapasta';
import styles from './Recommendations.module.scss';

export default function Recommendations() {
  return (
    <section className={styles.section} aria-labelledby="recommendations-title">
      <div className={styles.content}>
        <Reveal as="h2" id="recommendations-title">Z CAŁEGO SERCA</Reveal>
        <p className={styles.subtitle}>polecamy</p>
        <ul className={styles.list}>
          {papaPastaRecommendations.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.itemHeading}>
                <h3>{item.name}{item.weight && <small> {item.weight}</small>}</h3>
                <span className={styles.leader} aria-hidden="true" />
                <span className={styles.price} aria-label={item.price + ' złotych'}>{item.price}</span>
              </div>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
        <Button href="/menu" variant="dark">ZOBACZ CAŁE MENU</Button>
      </div>
    </section>
  );
}
