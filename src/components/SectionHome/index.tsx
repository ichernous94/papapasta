import Image from 'next/image';
import Button from '@/components/ui/Button';
import SelectionScrollLock from './SelectionScrollLock';
import CentroLink from './CentroLink';
import papaPastaImage from '../../../public/images/shared/papapasta-pizza-wino-steki.jpg';
import centroImage from '../../../public/images/shared/papapasta-centro.jpg';
import styles from './SectionHome.module.scss';

const restaurants = [
  {
    id: 'papapasta',
    name: 'Papa Pasta Pizza Wino Steki',
    address: 'ul. Rzemieślnicza 40',
    href: '/home',
    image: papaPastaImage,
    logo: '/icons/logo_papapasta.svg',
    logoWidth: 319,
    logoHeight: 72,
    logoClassName: styles.papaPastaLogo,
  },
  {
    id: 'centro',
    name: 'Papa Pasta Centro',
    address: 'ul. Jurowiecka 11',
    href: 'https://centro.papapasta.pl/',
    image: centroImage,
    logo: '/icons/centro_logo_small.svg',
    logoWidth: 145,
    logoHeight: 92,
    logoClassName: styles.centroLogo,
  },
];

export default function SectionHome() {
  return (
    <section className={styles.selection} aria-labelledby="restaurant-selection-title">
      <SelectionScrollLock/>
      <h1 id="restaurant-selection-title" className={styles.visuallyHidden}>
        Wybierz restaurację
      </h1>

      {restaurants.map((restaurant, index) => {
        const RestaurantLink = restaurant.id === 'centro' ? CentroLink : Button;
        return <article
          key={restaurant.id}
          className={styles.panel}
          aria-labelledby={`${restaurant.id}-title`}
        >
          <Image
            className={styles.backgroundImage}
            src={restaurant.image}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1920px) 960px, (min-width: 1024px) 50vw, 100vw"
            preload={index === 0}
            loading={index === 0 ? undefined : 'eager'}
          />

          <div className={styles.content}>
            <h2 id={`${restaurant.id}-title`} className={styles.logoHeading}>
              <Image
                className={`${styles.logo} ${restaurant.logoClassName}`}
                src={restaurant.logo}
                alt={restaurant.name}
                width={restaurant.logoWidth}
                height={restaurant.logoHeight}
                unoptimized
              />
            </h2>

            <p className={styles.address}>{restaurant.address}</p>

            <RestaurantLink
              className={styles.restaurantLink}
              href={restaurant.href}
              aria-label={`Przejdź do restauracji ${restaurant.name}`}
            >
              PRZEJDŹ DO RESTAURACJI
            </RestaurantLink>
          </div>
        </article>;
      })}
    </section>
  );
}
