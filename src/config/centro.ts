import type { RestaurantConfig, RecommendationItem } from '@/types/restaurant';

export const centro: RestaurantConfig = {
  id: 'centro', name: 'Papa Pasta Centro', homeHref: '/',
  logo: { src: '/icons/centro_logo_small.svg', width: 145, height: 92 },
  footerLogo: { src: '/icons/centro_logo_small.svg', width: 145, height: 92 },
  navigation: [
    { id: 'about', label: 'O NAS', href: '/' },
    { id: 'local', label: 'NASZ LOKAL', href: '/nasz-lokal' },
    { id: 'menu', label: 'MENU', href: '/menu' },
    { id: 'cocktails', label: 'COCKTAIL BAR', href: '/cocktail-bar' },
    { id: 'promotions', label: 'PROMOCJE', href: '/promocje' },
    { id: 'contact', label: 'KONTAKT', href: '/kontakt' },
  ],
  phone: '883 317 389', phoneHref: 'tel:+48883317389', phoneLabel: 'KONTAKT DO LOKALU',
  email: 'kontakt@papapasta.pl', street: 'Jurowiecka 11/1', postalAddress: '15-001 Białystok', address: 'Jurowiecka 11/1, Białystok',
  facebookUrl: 'https://www.facebook.com/papapasta.centro/',
  instagramUrl: 'https://www.instagram.com/papapasta.centro/',
  description: 'Papa Pasta Centro to miejsce dla tych, którzy cenią wysoką jakość, a wieczorne spotkania w dobrym towarzystwie są dla nich równie ważne, jak jedzenie. Jeśli szukasz oryginalnych smaków, dobrego wina oraz oryginalnych koktajli – jesteśmy tu dla Ciebie!',
  openingHours: [
    { day: 'Pon', hours: '09:00 - 20:00' },
    { day: 'Wt - Śr', hours: '09:00 - 21:00' },
    { day: 'Czw', hours: '09:00 - 22:00' },
    { day: 'Pt - Sob', hours: '09:00 - 24:00' },
    { day: 'Niedziela', hours: '09:00 - 20:00' },
  ],
};

export const centroMapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2393.4749336173!2d23.1612644!3d53.137570499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ffc1a2debf773%3A0x1fb698122c02e759!2sJurowiecka%2011%2Fu1%2C%2015-001%20Bia%C5%82ystok!5e0!3m2!1sru!2spl!4v1793833461481!5m2!1sru!2spl';

export const centroCopy = {
  about: 'Papa Pasta Centro to wyjątkowy adres na kulinarnej mapie Białegostoku, gdzie możesz poczuć klimat nocnej Italii bez opuszczania miasta. Tworzyliśmy to miejsce z myślą o ludziach, którzy kochają życie, dobre jedzenie i inspirujące spotkania przy doskonałych koktajlach. Nasze motto „Vivi Bene, Carpe Diem” towarzyszy nam każdego wieczoru, zapraszając Cię do celebrowania chwili i poznania oryginalnej włoskiej kuchni w zupełnie nowej odsłonie.',
  cocktails: 'Nasz Cocktail Bar to miejsce, gdzie tradycja spotyka nowoczesność. Nasz miksolog skomponował autorską kartę koktajli, których nie znajdziesz nigdzie indziej – od klasycznych włoskich spritzów, przez kolorowe drinki z sokami własnej produkcji, po autorskie propozycje na bazie kawy i alkoholi premium. Proponujemy również szeroki wybór wyselekcjonowanych win rodem z toskańskiego gospodarstwa „Fattoria Il Lago” i szeroką propozycję mocniejszych alkoholi.',
  dishes: 'Kuchnia w Papa Pasta Centro to autentyczne, włoskie smaki inspirowane Toskanią. Nasz szef kuchni zabierze Cię do Florencji, serwując wykwintne makarony, pizze i steki, które są esencją włoskiej tradycji. Skosztujesz tu carpaccio, tatara z wołowiny, wyborne owoce morza – z przystawkami, których nie ma nigdzie indziej. Każde danie komponowane jest z najwyższą starannością, a naszą chlubą są również wyborne wina, jak Chianti z toskańskiej Fattoria Il Lago.',
  location: 'Do lokalu z łatwością dotrzesz zarówno samochodem, jak i komunikacją miejską. Dla zmotoryzowanych przygotowano dogodne opcje parkowania – możesz skorzystać z miejsc postojowych wzdłuż ulicy Jurowieckiej oraz z parkingu w sąsiedniej Galerii Jurowiecka. Dzięki centralnej lokalizacji Papa Pasta Centro to idealne miejsce na spotkanie po pracy, kolację czy wieczorne wyjście na autorskie koktajle.',
  interior: 'Nowoczesne, designerskie wnętrza przepełnione nastrojowym światłem, wygodne sofy i długi, elegancki bar – tak właśnie wygląda Papa Pasta Centro. Przestrzeń zaprojektowana została na spotkania z przyjaciółmi, wieczory z cocktajlami, a także spokojne włoskie kolacje. Wchodząc do nas, przeniesiesz się w atmosferę włoskiego „dolce vita”, gdzie liczy się dobra zabawa i wyjątkowe smaki.',
  menu: 'Kuchnia toskańska to prawdziwa fantazja smaków! Ta jedna z najstarszych kuchni regionalnych Włoch to m.in. domowej roboty makarony, klasyczna włoska pizza z delikatnym rantem, steki, dziczyzna oraz inne mięsa, to istna uczta dla podniebienia! Ich wyjątkowy, autentyczny smak tkwi we włoskich produktach, jakich używamy. Prawdziwa włoska mąka, sos pomidorowy, sery, wędliny oraz wysokiej jakości oliwa extra virgin importowana bezpośrednio od toskańskiego plantatora– to podstawowe składniki dań, które wychodzą z naszej kuchni. Ponadto goście restauracji mogą liczyć na smaczne śniadania – serwowane na słodko i słono oraz aromatyczną kawę, która powstaje w lokalnej palarni.',
  promotions: 'Benvenuti w świecie okazji Papa Pasta Centro! Tutaj znajdziesz aktualne promocje – pyszne zestawy w lepszej cenie, rabaty dla grup i sezonowe niespodzianki. Wpadnij po smak Italii bez nadwyrężania portfela: sprawdź, wybierz i odwiedzaj nas regularnie – dorzucamy nowe powody, by wpaść. Buon appetito!',
};

export const centroRecommendations: readonly RecommendationItem[] = [
  { id: 'vitello', name: 'Vitello Tonnato', price: 47, description: 'cielęcina marynowana w winie, sos z tuńczyka, kapary, burak czerwony, borowik z cebulką, rukola, parmezan, toskańska oliwa, pieczywo Ciao Pane' },
  { id: 'gamberi-toscana', name: 'Gamberi alla Toscana', price: 57, description: 'krewetki, sos śmietanowy, szpinak, czosnek, parmezan, oregano, czerwone pesto, suszone pomidory, cytryna, pieczywo Ciao Pane' },
  { id: 'scatola', name: 'Scatola di frutti di mare', price: 53, description: 'szaszłyki z krewetek, ośmiornicy i kalmarów, chipsy z muli, oliwki, rukola, pomidorki cherry, granat, grillowana focaccia, sos majo-sweet chilli' },
  { id: 'gnocchi', name: 'Gniocchi con Prosciutto Crudo e pesto', price: 53, description: 'pesto, śmietanka, gnocchi ziemniaczane, szynka parmeńska, suszony pomidor, cukinia, rukola, pomidorki cherry, parmezan' },
  { id: 'tagliatelle-pesto', name: 'Tagliatelle pesto', price: 47, description: 'domowej roboty makaron tagliatelle, pesto, śmietanka, kruszone pistacje, pomidorki cherry, parmezan' },
  { id: 'insalata-prosciutto', name: 'Insalata di prosciutto e pera', price: 46, description: 'mix sałat z rukolą, szynka parmeńska, gruszka, ser blue, orzech włoski, vinegret, pieczywo Ciao Pane' },
  { id: 'insalata-anatra', name: 'Insalata di anatra e frutta', price: 53, description: 'mix sałat, pierś z kaczki, granat, maliny, pomarańcza, sos vinegret żurawinowy, sos cytrusowy, pieczywo Ciao Pane' },
  { id: 'crema-porri', name: 'Crema di porri', price: 33, description: 'krem z pora, selera, marchewki, pietruszki i ziemniaka, parmezan, czosnek, szczypiorek, chrupiąca grzanka z mozzarellą, chips parmezanowy, oliwa szczypiorkowa' },
  { id: 'anatra', name: 'Anatra di cavolo rosso', price: 72, description: 'pierś z kaczki marynowana w ziołach, puree z czerwonej kapusty i buraka, sos cytrusowy, sos żurawinowy, granat, świeży tymianek' },
  { id: 'pollo', name: 'Pollo alla fiorentina', price: 65, description: 'udo z kurczaka w sosie śmietanowym, szpinak, suszone pomidory, szparagi, puree z selera i pietruszki, sos cebulowy, peperoncino, groszek czepny' },
];
