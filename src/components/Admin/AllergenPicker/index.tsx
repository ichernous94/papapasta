import { ALLERGENS, type AllergenId } from '@/config/allergens';
import AllergenIcon from '@/components/AllergenIcon';
import MeatlessIcon from '@/components/DishBadges/MeatlessIcon';
import styles from './AllergenPicker.module.scss';

export default function AllergenPicker({ selected = [], meatless = false, disabled = false }: { selected?: readonly AllergenId[]; meatless?: boolean; disabled?: boolean }) {
  return <fieldset className={styles.fieldset} disabled={disabled}>
    <legend>Allergens</legend>
    <p>Select allergens and dish information.</p>
    <div className={styles.grid}>{ALLERGENS.map(allergen => <label className={styles.option} key={allergen.id}>
      <input type="checkbox" name="allergens" value={allergen.id} defaultChecked={selected.includes(allergen.id)}/>
      <AllergenIcon id={allergen.id}/><span>{allergen.en}</span>
    </label>)}<label className={`${styles.option} ${styles.meatless}`}>
      <input type="checkbox" name="meatless" defaultChecked={meatless}/>
      <MeatlessIcon/><span>Dania bez mięsa</span>
    </label></div>
  </fieldset>;
}
