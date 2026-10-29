import { FaFacebookF, FaInstagram, FaTripadvisor } from 'react-icons/fa';
import { papaPastaSite } from '@/config/papapasta';
import type { RestaurantConfig } from '@/types/restaurant';
import styles from './SocialLinks.module.scss';

export default function SocialLinks({ variant = 'plain', site = papaPastaSite }: { variant?: 'plain' | 'boxed'; site?: RestaurantConfig }) {
  return (
    <div className={[styles.socials, variant === 'boxed' && styles.boxed].filter(Boolean).join(' ')}>
      <a href={site.facebookUrl} aria-label={"Facebook " + site.name}><FaFacebookF aria-hidden="true" /></a>
      <a href={site.instagramUrl} aria-label={"Instagram " + site.name}><FaInstagram aria-hidden="true" /></a>
      {site.showTripadvisor && <span role="img" aria-label="Tripadvisor" title="Tripadvisor"><FaTripadvisor aria-hidden="true" /></span>}
    </div>
  );
}
