// Original image filenames and reading order are intentional (including Cyrillic с).
export const centroBookPages = [
  { file: 'mojito-promo.png', title: 'Okładka — Papa Pasta Centro' },
  { file: 'cocktail-collection.png', title: 'Koktajle 1–6' },
  { file: 'cocktail-presentation.png', title: 'Koktajle 7–12' },
  { file: 'signature-cocktails.png', title: 'Koktajle 13–18' },
  { file: 'сoffee-and-cocktails.png', title: 'Koktajle kawowe 19–24' },
  { file: 'whisky-selection.png', title: 'Whisky, whiskey i bourbon' },
  { file: 'gin-and-rum-selection.png', title: 'Wódka, tequila, gin i rum' },
  { file: 'spirits-and-cocktails.png', title: 'Wermut, porto, brandy i koniak' },
  { file: 'premium-spirits.png', title: 'Alkohole na butelki' },
  { file: 'wine-selection.png', title: 'Wina białe i czerwone' },
  { file: 'beer-selection.png', title: 'Piwa' },
  { file: 'coffee-and-drinks-menu.png', title: 'Napoje i mocktaile' },
  { file: 'coffee-menu.png', title: 'Kawy i herbaty' },
  { file: 'business-card.png', title: 'Kontakt — Papa Pasta Centro' },
].map((page, index) => ({ ...page, id: 'book-' + (index + 1), src: '/images/centro/' + page.file }));
