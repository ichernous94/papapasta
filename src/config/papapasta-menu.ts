// Display-only menu data. Keep recommendation prices on /home independent.
export type MenuItem = {
  id: string;
  name: string;
  portion?: string;
  price?: string;
  description?: string[];
  isNew?: boolean;
};
export type MenuGroup = { id: string; title?: string; note?: string; items: readonly MenuItem[]; afterNote?: string };
export type MenuCategory = { id: string; label: string; columns?: 2; columnBreak?: number; note?: string; groups: readonly MenuGroup[] };

export const mainMenu: readonly MenuCategory[] = [
  { id: 'przystawki', label: 'PRZYSTAWKI', groups: [{ id: 'przystawki', items: [
    { id: 'carpaccio', name: 'Carpaccio di manzo', portion: '230g', price: '55', description: ['100g polędwica wołowa, rukola, parmezan, toskańska oliwa, sos balsamiczny, pieczywo z naszego pieca'] },
    { id: 'tartare', name: 'Tartare di manzo', portion: '350g', price: '55', description: ['150g siekana polędwica wołowa, majonez sezamowy z czosnkiem niedźwiedzim, kapar, cebula, chips z parmezanu i z kapara, pieczarka marynowana, pieczywo'] },
    { id: 'bruschette', name: 'Quattro stagioni di bruschette', portion: '400g', price: '39', description: ['cztery grzanki bruschetta: pomidory, czerwone pesto z mascarpone, wątróbka, gorgonzola i parmezan'] },
    { id: 'gamberetti-mela', name: 'Gamberetti con mela e guanciale', portion: '230g', price: '53', description: ['8 krewetek w sosie czosnkowym z pietruszką, guanciale, jabłko, wino białe, pieczywo z naszego pieca'] },
    { id: 'gamberetti-salsiccia', name: 'Gamberetti con salsiccia e peperoncino', portion: '260g', price: '53', description: ['8 krewetek w sosie na bazie białego wina i masła z dodatkiem pietruszki, czosnku i peperoncino, salsiccia, papryczka chill, skórka z cytryny, mięta'] },
    { id: 'tagliere', name: 'Tagliere di salumi e formaggi', portion: '2os / 300g', price: '43', description: ['kompozycja włoskich serów i wędlin'] },
    { id: 'guazetto', name: 'Guazetto di cozze e vongole', portion: '400g', price: '53', isNew: true, description: ['małże w sosie czosnkowym z pietruszką na białym winie, pieczywo z naszego pieca'] },
  ] }] },
  { id: 'zupy', label: 'ZUPY', groups: [{ id: 'zupy', items: [
    { id: 'zuppa-pesce', name: 'Zuppa di pesce', portion: '200ml', price: '57', description: ['zupa rybna, filet z ryby, vongole, małże, krewetki, wino białe, pieczywo z naszego pieca'] },
    { id: 'crema-pomodoro', name: 'Crema di pomodoro', portion: '250ml', price: '32', description: ['zupa krem z pomidorów z dodatkiem parmezanu, świeża bazylia'] },
    { id: 'brodo', name: 'Brodo con gniocchi', portion: '250g', price: '27', description: ['rosół z kluskami'] },
  ] }] },
  { id: 'makarony', label: 'MAKARONY', groups: [{ id: 'makarony', items: [
    { id: 'lasagne', name: 'Lasagne Papa Pasta', portion: '480g', price: '53', description: ['domowej roboty makaron, sos beszamel, ragu wołowo-wieprzowe, parmezan'] },
    { id: 'bolognese', name: 'Spaghetti a’la Bolognese', portion: '360g', price: '46', description: ['domowej roboty makaron spaghetti, ragu wołowo-wieprzowe, parmezan', 'z makaronem bezglutenowym na życzenie'] },
    { id: 'genovese', name: 'Tagliatelle a’la genovese', portion: '320g', price: '53', description: ['domowej roboty makaron tagliatelle, 80g polędwica wołowa, karmelizowana czerwona cebula, czerwone wino, parmezan', 'z makaronem bezglutenowym na życzenie'] },
    { id: 'carbonara', name: 'Spaghetti a’la Carbonara', portion: '280g', price: '49', description: ['domowej roboty makaron spaghetti, guanciale, jajko, parmezan', 'z makaronem bezglutenowym na życzenie'] },
    { id: 'aglio-olio', name: 'Spaghetti aglio olio peperoncino e gamberi / polpo', portion: '300g', price: '55', isNew: true, description: ['domowej roboty makaron spaghetti, toskańska oliwa, pietruszka, peperoncino, parmezan, papryczka chili, czosnek, do wyboru krewetki lub ośmiornica', 'z makaronem bezglutenowym na życzenie'] },
    { id: 'salmone', name: 'Tagliatelle Salmone al forno con gorgonzola', portion: '360g', price: '55', description: ['domowej roboty makaron tagliatelle, pieczony łosoś, serowy sos z gorgonzoli, groszek, szpinak'] },
    { id: 'funghi-porcini', name: 'Tagliatelle funghi porcini', portion: '350g', price: '55', description: ['domowej roboty makaron tagliatelle, borowiki w sosie śmietanowym, czosnek, pietruszka'] },
  ] }] },
  { id: 'dania-glowne', label: 'DANIA GŁÓWNE', groups: [{ id: 'dania-glowne', items: [
    { id: 'burger', name: 'Burger Papa Pasta', portion: '600g', price: '69', description: ['200g burger wołowy, bułka z sezamem z naszego pieca, blanszowany szpinak z czosnkiem, piklowana cebula, pomidor, sos mayo-demi glace, sos gorgonzolowo-orzechowy, frytki, chutney z boczku'] },
    { id: 'guancia', name: 'Guancia brasata con verdure', portion: '400g', price: '59', description: ['150g poliki wołowe w sosie warzywnym na bazie białego wina, puree z pietruszki i selera, marchewka i pietruszka karmelizowana, natka pietruszki'] },
    { id: 'peposo', name: 'Peposo', portion: '430g', price: '57', description: ['toskański gulasz wołowy na czerwonym winie i passacie pomidorowej, puree z pietruszki i selera, mix sałat'] },
    { id: 'filetto-pesce', name: 'Filetto di pesce', portion: '350g', price: '73', description: ['170g filet z sandacza, karmelizowane pomidorki cherry, grillowany por, puree z pietruszki i selera'] },
    { id: 'polpo', name: 'Polpo alla griglia', portion: '400g', price: '88', description: ['grillowana ośmiornica, salsa pomidorowo-paprykowa, sos winno-maślany z pietruszką i czosnkiem, ziemniaczki opiekane'] },
    { id: 'filetto-lardo', name: 'Filetto di manzo al lardo', price: '99', description: ['200g grillowana polędwica wołowa z włoską słoniną wieprzową'] },
    { id: 'filetto-manzo', name: 'Filetto di manzo', price: '94', description: ['200g grillowana polędwica wołowa'] },
    { id: 'entrecote', name: 'Entrecote di manzo', price: '99', description: ['300g grillowany antrykot wołowy'] },
    { id: 'steak-extras', name: 'Dodatki do steków', price: 'do wyboru', description: ['borowiki z patelni 100g – 19', 'puree z pietruszki i selera 180g – 14', 'ziemniaki w mundurkach 220g – 14', 'mix sałat 150g – 14', 'frytki 150g – 14'] },
    { id: 'steak-sauces', name: 'Dwa sosy do wyboru w cenie steka', price: 'w cenie steków', description: ['pieprzowy, grzybowy, demi glace (dodatkowy sos + 8zł)'] },
  ] }] },
  { id: 'salatki', label: 'SAŁATKI', groups: [{ id: 'salatki', items: [
    { id: 'speck-pera', name: 'Insalata con Speck e pera', portion: '290g', price: '46', description: ['60g szynka Speck, gruszka, piklowana cebula, granat, blue cheese. mix sałat, winegret, pieczywo z naszego pieca'] },
    { id: 'tachino-salmone', name: 'Insalata con tachino / salmone', portion: '370g', price: '48', description: ['150g grillowany indyk / 100g pieczony łosoś, mix sałat, papryka, ogórek, pomidorki cherry, cebula czerwona, sos jogurtowo-koperkowy, pieczywo z naszego pieca'] },
    { id: 'fegatini', name: 'Insalata di fegatini glassati', portion: '410g', price: '46', description: ['150g wątróbka glazurowana w occie balsamicznym i miodzie, mix sałat, cebula czerwona,pomidorki cherry, pomarańcza, prażone migdały, winegret, pieczywo z naszego pieca'] },
    { id: 'gamberi', name: 'Insalata di gamberi', portion: '340g', price: '55', description: ['6 krewetek z czosnkiem i chilli, mix sałat, czerwona cebula, ogórek, granat, truskawka, winegret, pieczywo z naszego pieca'] },
  ] }] },
  { id: 'pizza', label: 'PIZZA', columns: 2, note: 'pizza o średnicy 32 cm', groups: [
    { id: 'pizza-first', items: [
      { id: 'marinara', name: 'Marinara', price: '34', description: ['polpa pomidorowa, czosnek, oregano, bazylia'] },
      { id: 'margherita', name: 'Margherita', price: '37', description: ['polpa pomidorowa, mozzarella, bazylia'] },
      { id: 'capricciosa', name: 'Capricciosa', price: '52', description: ['polpa pomidorowa, mozzarella, szynka cotto, pieczarki, oliwki czarne, karczochy, bazylia'] },
      { id: 'pancetta', name: 'Pancetta', price: '46', description: ['polpa pomidorowa, mozzarella, boczek Pancetta, cebula, bazylia'] },
      { id: 'quattro-formaggi', name: 'Quattro formaggi', price: '52', description: ['mozzarella, scamorza, gorgonzola, parmezan'] },
      { id: 'salame-piccante', name: 'Salame Piccante', price: '48', description: ['polpa pomidorowa, mozzarella, Salami Piccante, sos balsamiczny, rukola'] },
      { id: 'cotto', name: 'Cotto', price: '46', description: ['polpa pomidorowa, mozzarella, szynka Cotto, bazylia'] },
      { id: 'parma', name: 'Parma', price: '52', description: ['polpa pomidorowa, mozzarella, Prosciutto Crudo, pomidorki cherry, parmezan, rukola'] },
      { id: 'vegetariano', name: 'Vegetariano', price: '50', description: ['polpa pomidorowa, mozzarella, cukinia, papryka, karczochy, bazylia'] },
    ] },
    { id: 'pizza-second', items: [
      { id: 'funghi', name: 'Funghi', price: '52', description: ['polpa śmietanowo-grzybowa, mozzarella, kurki, guanciale, cebula, koperek'] },
      { id: 'salame', name: 'Salame', price: '47', description: ['polpa pomidorowa, mozzarella, Salami, papryka, oregano'] },
      { id: 'speck', name: 'Speck', price: '52', description: ['polpa pomidorowa, mozzarella, speck, mascarpone, rukola'] },
      { id: 'cotto-spinaci', name: 'Cotto e spinaci', price: '51', description: ['śmietanka, mozzarella, szynka Cotto, szpinak, pieczarki, czarny pieprz'] },
      { id: 'gambero-piccante', name: 'Gambero piccante', price: '58', description: ['polpa pomidorowa, mozzarella, cukinia, krewetki, nduja, czosnek, pietruszka'] },
      { id: 'dolce-pancetta', name: 'Dolce Pancetta', price: '47', description: ['mozzarella, boczek pancetta, parmezan, żurawina, rukola'] },
      { id: 'pizza-extras', name: 'Dodatki do pizzy', price: 'do wyboru', description: ['dodatek warzywny – 6', 'dodatek mięsny – 9', 'dodatkowe krewetki – 13', 'dodatkowa burrata – 13', 'dodatkowa mozzarella – 9'] },
    ], afterNote: 'Masz ochotę na oliwę, oliwę czosnkową lub peperoncino? Poproś o nią obsługę.' },
  ] },
  { id: 'desery', label: 'DESERY', groups: [{ id: 'desery', items: [
    { id: 'tiramisu', name: 'Tiramisu', portion: '180g', price: '29', description: ['domowej roboty kremem, biszkopty, espresso, kakao'] },
    { id: 'fondant', name: 'Fondant czekoladowy', portion: '200g', price: '29/36', description: ['delikatna babeczka z płynnym, czekoladowym wnętrzem, podawana ze świeżymi owocami i musem wiśniowym / gałka lodów śmietankowych'] },
    { id: 'lody', name: 'Lody gałka / 3 gałki lodów ze świeżymi owocami', price: '9/26' },
    { id: 'crespelle', name: 'Crespelle dolce', portion: '200g', price: '29', description: ['2 naleśniki z serem ricotta i mascarpone, świeże owoce, mus wiśniowy'] },
    { id: 'crespelle-premium', name: 'Crespelle dolce Premium', portion: '280g', price: '39', description: ['2 naleśniki z serem ricotta, mascarpone i pastą pistacjową, palony cukier trzcinowy, polewa z białej czekolady i pistacji, świeże owoce'] },
    { id: 'deser-dnia', name: 'Deser dnia', description: ['informacje o dostępnym asortymencie uzyskasz u obsługi lokalu'] },
  ] }] },
  { id: 'napoje', label: 'NAPOJE', columns: 2, columnBreak: 2, groups: [
    { id: 'coffee', items: [
      { id: 'espresso', name: 'Espresso', price: '9' },
      { id: 'espresso-doppio', name: 'Espresso doppio', price: '12' },
      { id: 'americano', name: 'Americano', price: '14' },
      { id: 'cappuccino', name: 'Cappuccino', price: '14' },
      { id: 'latte', name: 'Latte', price: '16' },
      { id: 'flat-white', name: 'Flat white', price: '18' },
      { id: 'vanilla-latte', name: 'Waniliowa Iced Latte', price: '21', isNew: true },
      { id: 'strawberry-latte', name: 'Truskawkowe Iced Latte', price: '21', isNew: true },
      { id: 'espresso-tonic', name: 'Espresso Tonic', price: '21', isNew: true },
      { id: 'herbata', name: 'Herbata', price: '12', description: ['czarna / zielona / miętowa / owocowa'] },
    ], afterNote: 'Mleko: zwykłe, bez laktozy, owsiane +2 zł' },
    { id: 'craft', title: 'Kraftowe napoje gazowane z Browar Waszczukowe', items: [
      { id: 'lemoniada-puszcza', name: 'Lemoniada z puszczy z trawą żubrową', portion: '330ml', price: '15' },
      { id: 'cola-puszcza', name: 'Cola z puszczy z cynamonem', portion: '330ml', price: '15' },
      { id: 'dzin-dzer', name: 'Dżin-dżer z puszczy z imbirem', portion: '330ml', price: '15' },
      { id: 'kwas', name: 'Kwas chlebowy z puszczy z żytniego słodu', portion: '330ml', price: '15' },
    ] },
    { id: 'cold-drinks', items: [
      { id: 'lemoniada', name: 'Lemoniada', portion: '400ml / 1 litr', price: '19/33', description: ['klasyczna, truskawkowa, czarny bez, gruszka, hibiskus, marakuja'] },
      { id: 'soki', name: 'Soki świeżo wyciskane', portion: '300ml', price: '22', description: ['pomarańczowy / grejpfrutowy / mix pomarańczowo-grelpfrutowy'] },
      { id: 'woda-niegazowana', name: 'Kropla Beskidu woda niegazowana', portion: '330ml / 1 litr', price: '9/18' },
      { id: 'woda-gazowana', name: 'Kropla Beskidu woda gazowana', portion: '330ml / 1 litr', price: '9/18' },
      { id: 'coca-cola', name: 'Coca Cola', portion: '250ml', price: '9' },
      { id: 'coca-cola-zero', name: 'Coca Cola Zero', portion: '250ml', price: '9' },
      { id: 'sprite', name: 'Sprite', portion: '250ml', price: '9' },
      { id: 'fanta', name: 'Fanta', portion: '250ml', price: '9' },
      { id: 'kinley-tonic', name: 'Kinley Tonic Water', portion: '250ml', price: '9' },
      { id: 'kinley-rose', name: 'Kinley Bitter Rose', portion: '250ml', price: '9' },
      { id: 'fuze-lemon', name: 'Fuze Tea cytrynowy', portion: '250ml', price: '9' },
      { id: 'fuze-peach', name: 'Fuze Tea brzoskwiniowy', portion: '250ml', price: '9' },
      { id: 'cappy-apple', name: 'Cappy jabłkowy', portion: '250ml', price: '9' },
      { id: 'cappy-orange', name: 'Cappy pomarańczowy', portion: '250ml', price: '9' },
    ] },
  ] },
];

export const autumnMenu: readonly MenuGroup[] = [
  { id: 'autumn-dishes', items: [
    { id: 'pasta-fagioli', name: 'Pasta e fagioli', portion: '250ml', price: '32', description: ['fasola, makaron, ziemniak, marchew, seler naciowy, cebula, pomidory, pepperoncino'] },
    { id: 'pizza-tartufo', name: 'Pizza al tartufo', price: '55', description: ['spód truflowo-śmietanowy, mozzarella, kiełbasa Salsiccia Veneta, cebulka karmelizowana, zapieczony świeży tymianek, rukola'] },
    { id: 'daquise', name: 'Mini Torcik Daquise', portion: '170g', price: '35', description: ['delikatna beza z kremem z mascarpone, śmietany i kajmaku, z orzechami włoskimi, daktylami oraz świeżymi borówkami, sosem marakujowym, oprószona kakao'] },
  ] },
  { id: 'hot-drinks', title: 'Gorące napoje', items: [
    { id: 'grzane-wino', name: 'Grzane wino', portion: '240ml', price: '29', description: ['wytrawne czerwone wino, autorski syrop korzenny, miód'] },
    { id: 'grzany-aperol', name: 'Grzany Aperol', portion: '300ml', price: '35', description: ['Aperol, wytrawne białe wino, herbata rooibos, sok grejpfrutowy, sok jabłkowy, miód, goździki'] },
    { id: 'herbata-zimowa', name: 'Herbata zimowa', portion: '450ml', price: '25', description: ['herbata czarna, autorski syrop korzenny, miód, owoce i przyprawy korzenne'] },
  ], afterNote: '*Nasz autorski syrop korzenny jest kompozycją świeżej dyni, wiśni, pomarańczy, goździków, imbiru, cynamonu i miodu.' },
];

export const kidsMenu: readonly MenuGroup[] = [
  { id: 'kids-pasta', title: 'Makarony', items: [
    { id: 'al-pomodoro', name: 'Al pomodoro', portion: '120g / 120g', price: '25', description: ['makaron spaghetti, do wyboru polpa pomidorowa/sos Bolognese'] },
  ] },
  { id: 'kids-pizza', title: 'Pizza średnicy ok 23cm', items: [
    { id: 'kids-margherita', name: 'Margherita', portion: '120g', price: '25', description: ['polpa pomidorowa, mozzarella (+ bazylia 0zł)'] },
    { id: 'kids-cotto', name: 'Cotto', price: '27', description: ['polpa pomidorowa, mozzarella, szynka Cotto (+ bazylia 0zł)'] },
  ] },
  { id: 'kids-main', title: 'Dania główne', items: [
    { id: 'kids-filetto', name: 'Filetto', price: '28', description: ['polędwiczki z kurczaka w panierce, frytki'] },
    { id: 'kids-burger', name: 'Burger Bambini', price: '35', description: ['burger wołowy 80g, bułka z naszego pieca, mozzarella, ketchup, frytki'] },
  ] },
];

export const wineMenu: readonly MenuCategory[] = [
  { id: 'wina-czerwone', label: 'WINA CZERWONE', groups: [{ id: 'red-wines', items: [
    { id: 'il-lago-chianti', name: 'Il Lago Chianti Rufina DOCG', price: '23/111', description: ['(sangiovese)'] },
    { id: 'il-lago-riserva', name: 'Il Lago Chianti Rufina Riserva DOCG', price: '30/171', description: ['(sangiovese)'] },
    { id: 'il-lago-pinot', name: 'Il Lago Chianti Rufina Pinot Nero IGT', price: '40/231', description: ['(pinot nero)'] },
    { id: 'altiero-classico', name: 'Altiero Chianti Classico DOCG', price: '29/161', description: ['(sangiovese)'] },
    { id: 'altiero-riserva', name: 'Altiero Chianti Classico Riserva DOCG', price: '45/261', description: ['(sangiovese)'] },
    { id: 'altiero-gran', name: 'Altiero Chianti Classico Gran Selezione DOCG', price: '391', description: ['(sangiovese)'] },
    { id: 'canneta', name: 'Canneta Brunello di Montalcino DOCG', price: '421', description: ['(sangiovese grosso)'] },
    { id: 'capitoni-orcia', name: 'Capitoni Orcia Riserva DOC', price: '27/151', description: ['(sangiovese)'] },
    { id: 'capitoni-frasi', name: 'Capitoni Frasi Orcia Sangiovese Riserva (sangiovese)', price: '40/231', description: ['(sangiovese)'] },
    { id: 'vin-santo', name: 'Il Lago Vin Santo del Chianti Rufina', portion: '50ml/500ml', price: '30/291' },
  ] }] },
  { id: 'wina-biale', label: 'WINA BIAŁE', groups: [{ id: 'white-wines', items: [
    { id: 'wine-zero', name: 'wino bezalkoholowe', price: '20/111' },
    { id: 'matteraia-bianco', name: 'La Matteraia Vino Bianco Toscana IGT', price: '27/151', description: ['(wino musujące)'] },
    { id: 'matteraia-rocco', name: 'La Matteraia San Rocco IGT', price: '24/136' },
    { id: 'terre-allegre', name: 'Terre Allegre Bianco Semi-Sweet IGP Puglia', price: '20/96', description: ['(sangiovese)'] },
  ] }] },
  { id: 'piwa', label: 'PIWA', groups: [{ id: 'beers', items: [
    { id: 'waszczukowe-draft', name: 'Waszczukowe z beczki', price: '13/16', description: ['Janusz Moczywąs, Pszeniczne 0,33/0,5'] },
    { id: 'waszczukowe-dark', name: 'Waszczukowe Sprężyna Grażyna (ciemne)', price: '17', description: ['Ciemne, 0,5 L'] },
    { id: 'waszczukowe-zero', name: 'Waszczukowe bezalkoholowe', price: '17', description: ['0,5 L'] },
    { id: 'beer-syrup', name: 'syrop do piwa', price: '1' },
  ], afterNote: 'O inne piwa regionalne zapytaj obsługę.' }] },
];
