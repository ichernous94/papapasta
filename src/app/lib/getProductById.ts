import { IArticle } from '@/types';

// FETCH PRODUCT by ID for STATIC SITE GENERATION (SSG)
export const getProductById = async (id: string): Promise<IArticle> => {
  const res = await fetch(`${process.env.API}/products/${id}`);

  if (!res.ok) throw new Error('Failed to fetch product by ID!');

  return res.json();
};
