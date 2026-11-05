import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SocialLinks from '@/components/SocialLinks';
import Gallery from '@/components/Gallery';
import { centro, centroMapsEmbedUrl } from '@/config/centro';
import { centroGallery } from '@/config/centro-images';
import { centroPageMetadata } from '@/config/metadata';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export const metadata = centroPageMetadata('/kontakt', 'Papa Pasta Centro - Kontakt', 'Skontaktuj się z Papa Pasta Centro: Jurowiecka 11/1, Białystok, tel. 883 317 389, kontakt@papapasta.pl.');
export default function CentroContactPage() {
  return <>
    <Container as="section" className={styles.contact} aria-labelledby="contact-title">
      <Reveal as="h1" id="contact-title" className={styles.title}>ZAPRASZAMY</Reveal><p className={styles.subtitle}>do kontaktu</p>
      <div className={styles.contacts}>
        <section className={styles.contactBlock}><h2>ADRES</h2><p>{centro.street}<br />{centro.postalAddress}</p></section>
        <section className={styles.contactBlock}><h2>TELEFON</h2><a href={centro.phoneHref}>{centro.phone}</a></section>
        <section className={styles.contactBlock}><h2>EMAIL</h2><a href={'mailto:' + centro.email}>{centro.email}</a></section>
        <section className={styles.contactBlock}><h2>ODWIEDŹ PROFIL</h2><SocialLinks site={centro} variant="boxed" /></section>
      </div>
    </Container>
    <iframe className={styles.map} src={centroMapsEmbedUrl} title="Mapa — Papa Pasta Centro, Jurowiecka 11/1, Białystok" width="600" height="450" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
    <Gallery name="Papa Pasta Centro" images={centroGallery} />
  </>;
}
