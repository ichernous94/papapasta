import { Lato, Noto_Sans, Open_Sans, Roboto } from 'next/font/google';

export const lato = Lato({
  weight: ['400', '700'],
  style: 'normal',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-lato',
  preload: true,
});

export const openSans = Open_Sans({
  weight: 'variable',
  style: 'normal',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-open-sans',
  preload: false,
});

export const roboto = Roboto({
  weight: 'variable',
  style: 'normal',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-roboto',
  preload: false,
});

export const notoSans = Noto_Sans({
  weight: 'variable',
  style: 'normal',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-noto-sans',
  preload: false,
});
