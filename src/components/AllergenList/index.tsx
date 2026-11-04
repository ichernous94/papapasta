import { ALLERGENS, type AllergenId } from '@/config/allergens';
import AllergenIcon from '@/components/AllergenIcon';
import styles from './AllergenList.module.scss';

export default function AllergenList({ allergens }: { allergens?: readonly AllergenId[] }) {
  const selected = ALLERGENS.filter(allergen => allergens?.includes(allergen.id));
  if (!selected.length) return null;
  return <section className={styles.section} aria-label="Alergeny">
    <h3>Alergeny:</h3>
    <ul className={styles.list}>{selected.map(allergen => <li key={allergen.id}><AllergenIcon id={allergen.id}/><span>{allergen.pl}</span></li>)}</ul>
  </section>;
}
