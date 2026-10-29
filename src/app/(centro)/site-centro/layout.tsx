import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { centro } from '@/config/centro';
import { centroMetadata } from '@/config/metadata';
import styles from './Centro.module.scss';

export const metadata = centroMetadata;
export default function CentroLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.site}><Header site={centro} /><main>{children}</main><Footer site={centro} /></div>;
}
