import { papaPasta } from '@/config/papapasta';
import styles from './MapSection.module.scss';

export default function MapSection() {
  return (
    <section className={styles.section} aria-label="Lokalizacja restauracji Papa Pasta">
      <iframe
        src={papaPasta.mapsEmbedUrl}
        title="Papa Pasta Restauracja — Rzemieślnicza 40/1U, Białystok"
        width="600"
        height="450"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
      <p><a href={papaPasta.mapsUrl}>Otwórz w Mapach Google</a></p>
    </section>
  );
}
