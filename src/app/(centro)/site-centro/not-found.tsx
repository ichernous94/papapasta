import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import styles from '@/components/CentroPages/CentroPages.module.scss';
export default function CentroNotFound() { return <Container className={styles.contact}><h1 className={styles.title}>Nie znaleziono strony</h1><p className={styles.intro}>Wróć do Papa Pasta Centro.</p><Button href="/">STRONA GŁÓWNA</Button></Container>; }
