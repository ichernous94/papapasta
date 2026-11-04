export type NavigationItem = { id: string; label: string; href: string };
export type RestaurantConfig = {
  id: 'papapasta' | 'centro';
  name: string;
  homeHref: string;
  logo: { src: string; width: number; height: number };
  footerLogo: { src: string; width: number; height: number };
  navigation: readonly NavigationItem[];
  phone: string;
  phoneHref: string;
  phoneLabel: string;
  email: string;
  street: string;
  postalAddress: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  showTripadvisor?: boolean;
  description: string;
  openingHours: readonly { day: string; hours: string }[];
};
export type RecommendationItem = {
  id: string; name: string; weight?: string; description: string; price: number | string; image?: import('./menu').DishImage;
};
