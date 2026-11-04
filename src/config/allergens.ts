// Shared IDs are stored in PostgreSQL; labels remain presentation-only.
export const ALLERGEN_IDS = ['milk', 'gluten', 'nuts', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soy', 'celery', 'mustard', 'sesame', 'sulphites', 'lupin', 'molluscs'] as const;
export type AllergenId = typeof ALLERGEN_IDS[number];
export const ALLERGENS = [
  { id: 'milk', en: 'Milk', pl: 'Mleko' },
  { id: 'gluten', en: 'Cereals containing gluten', pl: 'Gluten' },
  { id: 'nuts', en: 'Tree nuts', pl: 'Orzechy' },
  { id: 'crustaceans', en: 'Crustaceans', pl: 'Skorupiaki' },
  { id: 'eggs', en: 'Eggs', pl: 'Jaja' },
  { id: 'fish', en: 'Fish', pl: 'Ryby' },
  { id: 'peanuts', en: 'Peanuts', pl: 'Orzeszki ziemne' },
  { id: 'soy', en: 'Soybeans', pl: 'Soja' },
  { id: 'celery', en: 'Celery', pl: 'Seler' },
  { id: 'mustard', en: 'Mustard', pl: 'Gorczyca' },
  { id: 'sesame', en: 'Sesame seeds', pl: 'Sezam' },
  { id: 'sulphites', en: 'Sulphur dioxide and sulphites', pl: 'Dwutlenek siarki i siarczyny' },
  { id: 'lupin', en: 'Lupin', pl: 'Łubin' },
  { id: 'molluscs', en: 'Molluscs', pl: 'Mięczaki' },
] as const satisfies readonly { id: AllergenId; en: string; pl: string }[];

export function normalizeAllergens(values: readonly string[]): AllergenId[] {
  return ALLERGEN_IDS.filter(id => values.includes(id));
}
