import type { GalleryImage } from '@/components/Gallery';
import interior from '../../public/images/centro/restaurant-interior.jpg';
import exterior from '../../public/images/centro/restaurant-exterior.jpg';
import mojito from '../../public/images/centro/cocktail-mojito.jpg';
import cocktails from '../../public/images/centro/cocktail-selection.jpg';
import chicken from '../../public/images/centro/grilled-chicken-dish.jpg';
import platter from '../../public/images/centro/food-sharing-platter.jpg';
import breakfast from '../../public/images/centro/breakfast-menu.jpg';
import autumn from '../../public/images/centro/autumn-menu.jpg';
import kids from '../../public/images/centro/kids-menu.jpg';
import landscape from '../../public/images/centro/sezonowe.jpg';
import promotion from '../../public/images/centro/post.jpg';
import bar from '../../public/images/centro/bar-interior.jpg';
import signature from '../../public/images/centro/signature-cocktail.jpg';
import neon from '../../public/images/centro/neon-sign.jpg';

export const centroImages = { interior, exterior, mojito, cocktails, chicken, platter, breakfast, autumn, kids, landscape, promotion };
export const centroGallery: readonly GalleryImage[] = [
  { id: 'bar', image: bar, alt: 'Bar Papa Pasta Centro z pomarańczowymi fotelami' },
  { id: 'cocktail', image: signature, alt: 'Autorski koktajl z owocami i rozmarynem' },
  { id: 'neon', image: neon, alt: 'Neon Centro Papa Pasta' },
  { id: 'platter', image: platter, alt: 'Deska z owocami morza w Papa Pasta Centro' },
];
