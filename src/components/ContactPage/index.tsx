import { FiExternalLink, FiMapPin } from 'react-icons/fi';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import SocialLinks from '@/components/SocialLinks';
import Reservation from '@/components/Reservation';
import type { RestaurantConfig } from '@/types/restaurant';
import styles from './ContactPage.module.scss';
export default function ContactPage({ site, mapsEmbedUrl, mapsUrl }: { site: RestaurantConfig; mapsEmbedUrl: string; mapsUrl: string }) {
  return <>
    <Container as="section" className={styles.contact} aria-labelledby="contact-title">
      <Reveal as="h1" id="contact-title">ZAPRASZAMY</Reveal><p className={styles.subtitle}>do kontaktu</p>
      <div className={styles.details}>
        <section><h2>TELEFON</h2><a href={site.phoneHref}>{site.phone}</a></section>
        <section><h2>EMAIL</h2><a href={`mailto:${site.email}`}>{site.email}</a></section>
      </div>
      {site.id === 'papapasta' && <Reservation/>}
    </Container>
    <Container as="section" className={styles.location} aria-labelledby="location-title">
      <SocialLinks site={site} variant="boxed"/>
      <h2 id="location-title" className={styles.find}><span>ZNAJDŹ NAS</span></h2>
      <iframe className={styles.map} src={mapsEmbedUrl} title={`Mapa — ${site.name}, ${site.address}`} width="900" height="345" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>
      <address className={styles.address}><FiMapPin aria-hidden="true"/><div><strong>{site.street}</strong><span>{site.postalAddress}</span></div></address>
      <a className={styles.mapsButton} href={mapsUrl} target="_blank" rel="noopener noreferrer"><FiExternalLink aria-hidden="true"/>OTWÓRZ W MAPACH</a>
    </Container>
  </>;
}
