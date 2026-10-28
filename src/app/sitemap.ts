import { MetadataRoute } from 'next';

export const revalidate = 3600; // revalidate at most every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // STATIC ROUTES
  const staticRoutesArr = [
    '',
    '/about',
    '/category',
    '/category/sborochnye-chertezhi-i-detalirovka-prisposobleniy',
    '/category/planirovka-otdeleniy-i-zon-atp',
    '/category/general-plans-atp-sto-other',
    // '/category/coursework',
    // '/category/diploma',
    // '/category/marshrutnaya-karta',
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticRoutesArr.map((route) => ({
    url: `https://chertezhi.online${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // DYNAMIC ROUTES
  const res = await fetch(`${process.env.API}/products?isAdmin=true`);
  const data = await res.json();

  const dynamicRoutes: MetadataRoute.Sitemap = data.map(
    (product: { _id: string; category: string; createdAt: Date }) => ({
      url: `https://chertezhi.online/category/${product.category}/${product._id}`,
      lastModified: new Date(product.createdAt).toISOString().split('T')[0],
      changeFrequency: 'weekly',
      priority: 1,
    })
  );

  return [...staticRoutes, ...dynamicRoutes];
}
