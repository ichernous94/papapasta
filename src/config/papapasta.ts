import type { RecommendationItem, RestaurantConfig } from '@/types/restaurant';
export type { RecommendationItem } from '@/types/restaurant';

export const papaPasta = {
  name: 'Papa Pasta Pizza Wino Steki',
  phone: '798 017 284',
  phoneHref: 'tel:+48798017284',
  email: 'kontakt@papapasta.pl',
  street: 'Rzemieślnicza 40/1U',
  postalAddress: '15-773 Białystok',
  mapsUrl: 'https://maps.app.goo.gl/7k9DgkNbieJqvPiw8',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2393.1851617585457!2d23.110980499999997!3d53.1427714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ffdac8a1d6643%3A0x9913a5c291001280!2sPapa%20Pasta%20Restauracja!5e0!3m2!1sru!2spl!4v1793220841487!5m2!1sru!2spl',
  address: 'Rzemieślnicza 40/1U, Białystok',
  orderUrl: 'https://www.pyszne.pl/menu/papa-pasta',
  facebookUrl: 'https://www.facebook.com/PapaPasta.Bialystok',
  instagramUrl: 'https://instagram.com/papapasta.bialystok',
  description:
    'Papa Pasta to pełne smaku przepisy, świeże produkty oraz bogactwo przypraw. To miejsce, w którym króluje włoska kuchnia oraz miła domowa atmosfera.',
  openingHours: [
    { day: 'Pon', hours: '12:00 - 20:00' },
    { day: 'Wt - Czw', hours: '12:00 - 22:00' },
    { day: 'Piątek', hours: '12:00 - 23:00' },
    { day: 'Sobota', hours: '12:00 - 23:00' },
    { day: 'Niedziela', hours: '12:00 - 20:00' },
  ],
};

export const papaPastaNavigation = [
  { id: 'about', label: 'O NAS', href: '/home' },
  { id: 'restaurant', label: 'NASZ LOKAL', href: '/nasz-lokal' },
  { id: 'menu', label: 'MENU', href: '/menu' },
  { id: 'order', label: 'ZAMÓW ONLINE', href: papaPasta.orderUrl },
  { id: 'contact', label: 'KONTAKT', href: '/kontakt' },
];

export const papaPastaCopy = {
  local: 'Restauracja Papa Pasta to nie tylko przepyszna kuchnia toskańska, ale i wyjątkowa atmosfera. Lokal w stylu industrialnym przyciąga detalami takimi jak drewno, ręcznie wypalana cegła i duże przeszklenia. Dopełnieniem wystroju jest przestronna sala z antresolą, z której roztacza się widok na bar. To właśnie tam pod okiem naszych miksologów powstają wyjątkowe drinki. Coś dla siebie znajdą również fani dobrego, kraftowego piwa, wermutu oraz whisky. Na gości restauracji czeka także sporo zieleni, 20 stolików (z możliwością ich łączenia i dowolnej aranżacji) oraz bezpłatny parking.',
  delivery: 'Dania z naszego menu zamów online, wygodnie, nie wychodząc z domu.',

  about:
    'Restauracja włoska Papa Pasta w Białymstoku powstała z miłości do dobrego jedzenia oraz… Toskanii! Kuchnia toskańska to nie tylko pizza, steki oraz wyśmienite wino, ale i wspaniała atmosfera, która porwie nie tylko zakochanych. Industrialne wnętrze oraz swobodna atmosfera sprawiają, że Papa Pasta to miejsce idealne zarówno na śniadanie, spotkania biznesowe, jak i wypad ze znajomymi. Zapraszamy do naszego lokalu przy ul. Rzemieślniczej 40 oraz do składania zamówień na dowóz!',
  dishes: [
    'Kuchnia toskańska to prawdziwa fantazja smaków! Ta jedna z najstarszych kuchni regionalnych Włoch to m.in. domowej roboty makarony, klasyczna włoska pizza z delikatnym rantem, steki, dziczyzna oraz inne mięsa, to istna uczta dla podniebienia! Ich wyjątkowy, autentyczny smak tkwi we włoskich produktach, jakich używamy.',
    'Prawdziwa włoska mąka, sos pomidorowy, sery, wędliny oraz wysokiej jakości oliwa extra virgin importowana bezpośrednio od toskańskiego plantatora– to podstawowe składniki dań, które wychodzą z naszej kuchni. Ponadto goście restauracji mogą liczyć na smaczne śniadania – serwowane na słodko i słono oraz aromatyczną kawę, która powstaje w lokalnej palarni.',
  ],
  wine: [
    'Kuchnia włoska to nie tylko wyśmienite dania, ale i… wino! Starannie wyselekcjonowane wina toskańskie, które osobiście ściągamy z regionu Chianti i Chianti Rufina to prawdziwa gratka dla fanów szczepu Sangiovese. Poza nimi oferujemy również wina z innych regionów Włoch.',
    'W naszej karcie nie mogło zabraknąć weneckiego musującego wina Prosseco! W Papa Pasta posiadamy również vin santo – nasz toskański specjał, czyli słodkie wino deserowe, które według włoskiego zwyczaju jest podawane z ciasteczkami migdałowymi po zakończonym posiłku.',
  ],
  reservation:
    'Stolik będzie czekał na Ciebie 15 minut. Po tym czasie nie gwarantujemy ważności rezerwacji. Jeśli Twoje plany uległy zmianie, poinformuj nas o tym. Rezerwacja powyżej 6 osób w dni: piątek, sobota, niedziela, wymaga wpłacenia zadatku w wysokości 50 zł od osoby. Zadatek zostanie odliczony od rachunku i nie podlega zwrotowi. Zadatek należy wpłacić w lokalu min. 1 dzień przed planowaną rezerwacją.',
};

export const papaPastaRecommendations: RecommendationItem[] = [
  {
    id: 'gnocchi-prosciutto',
    name: 'Gniocchi con Prosciutto Crudo e pesto',
    price: 53,
    description: 'pesto, śmietanka, gnocchi ziemniaczane, szynka parmeńska, suszony pomidor, cukinia, rukola, pomidorki cherry, parmezan',
  },
  {
    id: 'tagliatelle-pesto',
    name: 'Tagliatelle pesto',
    price: 47,
    description: 'domowej roboty makaron tagliatelle, pesto, śmietanka, kruszone pistacje, pomidorki cherry, parmezan',
  },
  {
    id: 'insalata-burrata',
    name: 'Insalata con burrata e pesto',
    price: 48,
    description: 'mix sałat, karmelizowane pomidorki, burrata, awokado, grejpfrut, orzech włoski, dressing z pesto, pieczywo z naszego pieca',
  },
  {
    id: 'pizza-mortadela',
    name: 'Pizza Mortadela',
    price: 49,
    description: 'spód pesto-śmietanowy, mortadela, karmelizowane pomidorki cherry, burrata, wierzch polany płynnym pesto',
  },
  {
    id: 'polpo-griglia',
    name: 'Polpo alla griglia',
    weight: '400g',
    price: 79,
    description: 'grillowana ośmiornica, salsa pomidorowo-paprykowa, sos winno-maślany z pietruszką i czosnkiem, ziemniaczki opiekane',
  },
  {
    id: 'spaghetti-gamberi',
    name: 'Spaghetti aglio olio peperoncino e gamberi / polpo',
    weight: '300g',
    price: 55,
    description: 'domowej roboty makaron spaghetti, toskańska oliwa, pietruszka, peperoncino, parmezan, papryczka chili, czosnek, do wyboru krewetki lub ośmiornica',
  },
  {
    id: 'guazzetto-cozze',
    name: 'Guazzetto di cozze e vongole',
    weight: '400g',
    price: 53,
    description: 'małże w sosie czosnkowym z pietruszką na białym winie, pieczywo z naszego pieca',
  },
  {
    id: 'burger-papa-pasta',
    name: 'Burger Papa Pasta',
    weight: '480g',
    price: 58,
    description: '200g burger wołowy, bułka z sezamem z naszego pieca, blanszowany szpinak z czosnkiem, piklowana cebula, pomidor, sos mayo-demi glace, sos gorgonzolowo-orzechowy, frytki, chutney z boczku',
  },
  {
    id: 'guancia-brasata',
    name: 'Guancia brasata con verdure',
    weight: '400g',
    price: 59,
    description: '150g poliki wołowe w sosie warzywnym na bazie białego wina, puree z pietruszki i selera, marchewka i pietruszka karmelizowana, natka pietruszki',
  },
];

export const papaPastaSite: RestaurantConfig = {
  ...papaPasta,
  id: 'papapasta',
  homeHref: '/home',
  logo: { src: '/icons/logo.svg', width: 481, height: 51 },
  footerLogo: { src: '/icons/logo_papapasta_dark.svg', width: 319, height: 72 },
  navigation: papaPastaNavigation,
  phoneLabel: 'ZAMÓW Z DOSTAWĄ',
  showTripadvisor: true,
};

// The legacy shared pages retain the light-surface defaults above.
export const papaPastaDarkSite: RestaurantConfig = {
  ...papaPastaSite,
  logo: { ...papaPastaSite.logo, src: '/icons/logo_light.svg' },
  footerLogo: { ...papaPastaSite.footerLogo, src: '/icons/logo_papapasta.svg' },
};
