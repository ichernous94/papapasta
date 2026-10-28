import { IArticle } from '@/types';

// FETCH PRODUCTS for STATIC SITE GENERATION (SSG)
export const getProducts = async (category: string): Promise<IArticle[]> => {
  const res = await fetch(`${process.env.API}/products?category=${category}`);

  if (!res.ok) throw new Error('Failed to fetch products!');

  return res.json();
};
