import { IProduct } from '@/types';
import { Metadata } from 'next';

// PROPS
type Props = {
  params: Promise<{ id: string }>;
};

// DYNAMIC METADATA
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const res = await fetch(`${process.env.API}/products/${id}`);
  const productMetadata = (await res.json()) as IProduct;

  return {
    metadataBase: new URL('https://merch.sforafestival.com'),
    alternates: {
      canonical: `/products/${id}`,
    },
    title: `${productMetadata.title}`,
    description: productMetadata.description.pl,
    // Robots metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: productMetadata.title,
      description: productMetadata.description.pl,
      url: `https://merch.sforafestival.com/products/${id}`,
      siteName: 'Sfora Festival',
      type: 'article',
      images: [
        {
          url: productMetadata.images[0].link,
          width: 1200,
          height: 630,
          alt: productMetadata.title,
        },
      ],
    },
    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      site: `https://merch.sforafestival.com/products/${id}`,
      title: productMetadata.title,
      description: productMetadata.description.en,
      images: [productMetadata.images[0].link],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
