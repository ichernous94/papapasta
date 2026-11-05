import styles from './MenuPrice.module.scss';
export default function MenuPrice({ value }: { value: string }) {
  return <>{value}{/^\d+(?:[.,]\d+)?$/.test(value.trim()) && <span className={styles.currency}> zł</span>}</>;
}
