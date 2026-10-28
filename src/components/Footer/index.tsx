import Image from 'next/image';
import SocialLinks from '@/components/SocialLinks';
import CurrentYear from '@/components/ui/CurrentYear';
import { papaPasta } from '@/config/papapasta';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Image
            src="/icons/logo_papapasta_dark.svg"
            alt="Papa Pasta Pizza Wino Steki"
            width={319}
            height={72}
            className={styles.logo}
            unoptimized
          />
          <p>{papaPasta.description}</p>
          <div className={styles.socials}><SocialLinks /></div>
        </div>
        <section className={styles.column} aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">KONTAKT</h2>
          <ul>
            <li>{papaPasta.address}</li>
            <li><a href={papaPasta.phoneHref}>tel. {papaPasta.phone}</a></li>
            <li><a href={'mailto:' + papaPasta.email}>{papaPasta.email}</a></li>
          </ul>
        </section>
        <section className={styles.column} aria-labelledby="footer-hours-title">
          <h2 id="footer-hours-title">GODZINY OTWARCIA</h2>
          <ul>
            {papaPasta.openingHours.map((item) => <li key={item.day}>{item.day} - {item.hours}</li>)}
          </ul>
        </section>
      </div>
      <div className={styles.copyright}>
        <p>Papa Pasta ©<CurrentYear /> Wszelkie Prawa Zastrzeżone</p>
      </div>
    </footer>
  );
}
