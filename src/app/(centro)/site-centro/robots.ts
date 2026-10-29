import type { MetadataRoute } from 'next';
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/site-centro', '/api/'] }, sitemap: 'https://centro.papapasta.pl/sitemap.xml' };
}
