import { IArticle } from '@/types';

// FETCH RELATED PRODUCTS by ID for STATIC SITE GENERATION (SSG)
export const getRelatedProducts = async (id: string): Promise<IArticle[]> => {
  const res = await fetch(`${process.env.API}/products/related?id=${id}`);

  if (!res.ok)
    throw new Error('Failed to fetch related products with current ID!');

  return res.json();
};
