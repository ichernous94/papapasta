import { ALLERGENS, type AllergenId } from '@/config/allergens';
import AllergenIcon from '@/components/AllergenIcon';
import styles from './AllergenPicker.module.scss';

export default function AllergenPicker({ selected = [], disabled = false }: { selected?: readonly AllergenId[]; disabled?: boolean }) {
  return <fieldset className={styles.fieldset} disabled={disabled}>
    <legend>Allergens</legend>
    <p>Select all allergens that apply to this dish.</p>
    <div className={styles.grid}>{ALLERGENS.map(allergen => <label className={styles.option} key={allergen.id}>
      <input type="checkbox" name="allergens" value={allergen.id} defaultChecked={selected.includes(allergen.id)}/>
      <AllergenIcon id={allergen.id}/><span>{allergen.en}</span>
    </label>)}</div>
  </fieldset>;
}
