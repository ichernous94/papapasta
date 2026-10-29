import Container from '@/components/ui/Container';
import Image from 'next/image';
import SocialLinks from '@/components/SocialLinks';
import CurrentYear from '@/components/ui/CurrentYear';
import { papaPastaSite } from '@/config/papapasta';
import type { RestaurantConfig } from '@/types/restaurant';
import styles from './Footer.module.scss';

export default function Footer({ site = papaPastaSite }: { site?: RestaurantConfig }) {
  return (
    <footer className={styles.footer} data-site={site.id}>
      <Container className={styles.content}>
        <div className={styles.brand}>
          <Image
            src={site.footerLogo.src}
            alt={site.name}
            width={site.footerLogo.width}
            height={site.footerLogo.height}
            className={styles.logo}
            unoptimized
          />
          <p>{site.description}</p>
          <div className={styles.socials}><SocialLinks site={site} /></div>
        </div>
        <section className={styles.column} aria-labelledby="footer-contact-title">
          <h2 id="footer-contact-title">KONTAKT</h2>
          <ul>
            <li>{site.address}</li>
            <li><a href={site.phoneHref}>tel. {site.phone}</a></li>
            <li><a href={'mailto:' + site.email}>{site.email}</a></li>
          </ul>
        </section>
        <section className={styles.column} aria-labelledby="footer-hours-title">
          <h2 id="footer-hours-title">GODZINY OTWARCIA</h2>
          <ul>
            {site.openingHours.map((item) => <li key={item.day}>{item.day} - {item.hours}</li>)}
          </ul>
        </section>
      </Container>
      <div className={styles.copyright}>
        <p>Papa Pasta ©<CurrentYear /> Wszelkie Prawa Zastrzeżone</p>
      </div>
    </footer>
  );
}
