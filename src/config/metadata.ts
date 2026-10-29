import type { Metadata } from 'next';

const publicRobots = {
  index: true,
  follow: true,
  'max-image-preview': 'large',
  'max-snippet': -1,
  'max-video-preview': -1,
} satisfies Metadata['robots'];

const papaPastaTitle = 'Papa Pasta - Restauracja włoska - Pizza Wino Steki';
const papaPastaDescription =
  'Restauracja włoska Papa Pasta w Białymstoku to pizza, steki, dobre wino, ale i wspaniała atmosfera, która porwie nie tylko zakochanych.';

export const papaPastaMetadata = {
  metadataBase: new URL('https://papapasta.pl'),
  title: papaPastaTitle,
  description: papaPastaDescription,
  robots: { ...publicRobots, googleBot: publicRobots },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Papa Pasta',
    title: papaPastaTitle,
    description: papaPastaDescription,
  },
  twitter: {
    card: 'summary',
    title: papaPastaTitle,
    description: papaPastaDescription,
  },
} satisfies Metadata;

export function papaPastaPageMetadata(path: string, title: string, description: string): Metadata {
  return {
    ...papaPastaMetadata,
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...papaPastaMetadata.openGraph, title, description, url: path },
    twitter: { ...papaPastaMetadata.twitter, title, description },
  };
}

const centroTitle =
  'Papa Pasta Centro - Cocktail Bar i Restauracja włoska - Pizza Wino Steki';
const centroDescription =
  'Papa Pasta Centro Restauracja włoska i cocktail bar w Białymstoku. To miejsce dla tych, którzy kochają życie, dobre jedzenie i spotkania przy doskonałych koktajlach.';

export const centroMetadata = {
  metadataBase: new URL('https://centro.papapasta.pl'),
  title: centroTitle,
  description: centroDescription,
  robots: { ...publicRobots, googleBot: publicRobots },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'Papa Pasta Centro',
    title: centroTitle,
    description: centroDescription,
  },
  twitter: {
    card: 'summary',
    title: centroTitle,
    description: centroDescription,
  },
} satisfies Metadata;

// Apply only to the future admin layout, not to the public restaurant layouts.
export const adminMetadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
} satisfies Metadata;

export function centroPageMetadata(path: string, title: string, description: string): Metadata {
  return {
    ...centroMetadata, title, description,
    alternates: { canonical: path },
    openGraph: { ...centroMetadata.openGraph, title, description, url: path },
    twitter: { ...centroMetadata.twitter, title, description },
  };
}
