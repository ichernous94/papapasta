import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import Reservation from '@/components/Reservation';
import SocialLinks from '@/components/SocialLinks';
import { papaPasta } from '@/config/papapasta';
import styles from './ContactSection.module.scss';

export default function ContactSection() {
  return (
    <Container as="section" className={styles.section} aria-labelledby="contact-title">
      <header className={styles.heading}>
        <Reveal as="h1" id="contact-title">ZAPRASZAMY</Reveal>
        <p>do kontaktu</p>
      </header>
      <div className={styles.details}>
        <section>
          <h2>ADRES</h2>
          <address>{papaPasta.street}<br />{papaPasta.postalAddress}</address>
        </section>
        <section>
          <h2>TELEFON</h2>
          <a href={papaPasta.phoneHref}>{papaPasta.phone}</a>
        </section>
        <section>
          <h2>EMAIL</h2>
          <a href={'mailto:' + papaPasta.email}>{papaPasta.email}</a>
        </section>
        <section>
          <h2>ODWIEDŹ PROFIL</h2>
          <SocialLinks variant="boxed" />
        </section>
      </div>
      <Reservation />
    </Container>
  );
}
