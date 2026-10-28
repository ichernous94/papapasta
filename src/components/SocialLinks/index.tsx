import { FaFacebookF, FaInstagram, FaTripadvisor } from 'react-icons/fa';
import { papaPasta } from '@/config/papapasta';
import styles from './SocialLinks.module.scss';

export default function SocialLinks({ variant = 'plain' }: { variant?: 'plain' | 'boxed' }) {
  return (
    <div className={[styles.socials, variant === 'boxed' && styles.boxed].filter(Boolean).join(' ')}>
      <a href={papaPasta.facebookUrl} aria-label="Facebook Papa Pasta"><FaFacebookF aria-hidden="true" /></a>
      <a href={papaPasta.instagramUrl} aria-label="Instagram Papa Pasta"><FaInstagram aria-hidden="true" /></a>
      <span role="img" aria-label="Tripadvisor" title="Tripadvisor"><FaTripadvisor aria-hidden="true" /></span>
    </div>
  );
}
