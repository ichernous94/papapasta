import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/cart',
        '/checkout/*',
        '/_next/static/media/*.woff2',
        '/_next/static/media/*.woff',
        '/_next/static/media/*.ttf',
        '/404.html',
      ],
    },
    sitemap: 'https://papapasta.pl/sitemap.xml',
  };
}
