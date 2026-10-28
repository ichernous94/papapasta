export const papaPasta = {
  name: 'Papa Pasta Pizza Wino Steki',
  phone: '798 017 284',
  phoneHref: 'tel:+48798017284',
  email: 'kontakt@papapasta.pl',
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

export type RecommendationItem = {
  id: string;
  name: string;
  weight?: string;
  description: string;
  price: number;
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
