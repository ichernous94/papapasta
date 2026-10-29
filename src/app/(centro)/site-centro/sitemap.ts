import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/nasz-lokal', '/menu', '/cocktail-bar', '/promocje', '/zestawy-obiadowe', '/kontakt'].map(path => ({ url: 'https://centro.papapasta.pl' + (path || '/') }));
}
