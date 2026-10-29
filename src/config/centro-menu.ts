import type { MenuCategory, MenuGroup } from '@/types/menu';

// Independent Centro display data. Home recommendations intentionally have separate prices.
export const centroMainMenu: readonly MenuCategory[] = [
  {
    "id": "przystawki",
    "label": "PRZYSTAWKI",
    "groups": [
      {
        "id": "przystawki",
        "items": [
          {
            "id": "carpaccio",
            "name": "Carpaccio di manzo",
            "portion": "230g",
            "price": "55",
            "description": [
              "100g polędwica wołowa, rukola, parmezan, toskańska oliwa, sos balsamiczny, pieczywo z naszego pieca"
            ]
          },
          {
            "id": "tartare",
            "name": "Tartare di manzo",
            "portion": "350g",
            "price": "55",
            "description": [
              "150g siekana polędwica wołowa, majonez sezamowy z czosnkiem niedźwiedzim, kapar, cebula, chips z parmezanu i z kapara, pieczarka marynowana, pieczywo"
            ]
          },
          {
            "id": "bruschette",
            "name": "Quattro stagioni di bruschette",
            "portion": "400g",
            "price": "39",
            "description": [
              "cztery grzanki bruschetta: pomidory, czerwone pesto z mascarpone, wątróbka, gorgonzola i parmezan"
            ]
          },
          {
            "id": "gamberetti-mela",
            "name": "Gamberetti con mela e guanciale",
            "portion": "230g",
            "price": "53",
            "description": [
              "8 krewetek w sosie czosnkowym z pietruszką, guanciale, jabłko, wino białe, pieczywo z naszego pieca"
            ]
          },
          {
            "id": "gamberetti-salsiccia",
            "name": "Gamberetti con salsiccia e peperoncino",
            "portion": "260g",
            "price": "53",
            "description": [
              "8 krewetek w sosie na bazie białego wina i masła z dodatkiem pietruszki, czosnku i peperoncino, salsiccia, papryczka chill, skórka z cytryny, mięta"
            ]
          },
          {
            "id": "tagliere",
            "name": "Tagliere di salumi e formaggi",
            "portion": "2os / 300g",
            "price": "43",
            "description": [
              "kompozycja włoskich serów i wędlin"
            ]
          },
          {
            "id": "guazetto",
            "name": "Guazetto di cozze e vongole",
            "portion": "400g",
            "price": "53",
            "description": [
              "małże w sosie czosnkowym z pietruszką na białym winie, pieczywo z naszego pieca"
            ]
          },
          {
            "id": "vitello",
            "name": "Vitello Tonnato",
            "portion": "270g",
            "price": "47",
            "description": [
              "cielęcina marynowana w winie, sos z tuńczyka, kapary, burak czerwony, borowik z cebulką, rukola, parmezan, toskańska oliwa, pieczywo Ciao Pane"
            ]
          },
          {
            "id": "gamberi-toscana",
            "name": "Gamberi alla Toscana",
            "portion": "280g",
            "price": "57",
            "description": [
              "krewetki, sos śmietanowy, szpinak, czosnek, parmezan, oregano, czerwone pesto, suszone pomidory, cytryna, pieczywo Ciao Pane"
            ]
          },
          {
            "id": "scatola",
            "name": "Scatola di frutti di mare",
            "portion": "350g",
            "price": "53",
            "description": [
              "szaszłyki z krewetek, ośmiornicy i kalmarów, chipsy z muli, oliwki, rukola, pomidorki cherry, granat, grillowana focaccia, sos majo-sweet chilli"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "zupy",
    "label": "ZUPY",
    "groups": [
      {
        "id": "zupy",
        "items": [
          {
            "id": "zuppa-pesce",
            "name": "Zuppa di pesce",
            "portion": "200ml",
            "price": "57",
            "description": [
              "zupa rybna, filet z ryby, vongole, małże, krewetki, wino białe, pieczywo z naszego pieca"
            ]
          },
          {
            "id": "crema-pomodoro",
            "name": "Crema di pomodoro",
            "portion": "250ml",
            "price": "32",
            "description": [
              "zupa krem z pomidorów z dodatkiem parmezanu, świeża bazylia"
            ]
          },
          {
            "id": "crema-porri",
            "name": "Crema di porri",
            "portion": "250ml",
            "price": "33",
            "description": [
              "krem z pora, selera, marchewki, pietruszki i ziemniaka, parmezan, czosnek, szczypiorek, chrupiąca grzanka z mozzarellą, chips parmezanowy, oliwa szczypiorkowa"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "makarony",
    "label": "MAKARONY",
    "groups": [
      {
        "id": "makarony",
        "items": [
          {
            "id": "lasagne",
            "name": "Lasagne Papa Pasta",
            "portion": "480g",
            "price": "53",
            "description": [
              "domowej roboty makaron, sos beszamel, ragu wołowo-wieprzowe, parmezan"
            ]
          },
          {
            "id": "bolognese",
            "name": "Spaghetti a’la Bolognese",
            "portion": "360g",
            "price": "46",
            "description": [
              "domowej roboty makaron spaghetti, ragu wołowo-wieprzowe, parmezan"
            ]
          },
          {
            "id": "genovese",
            "name": "Tagliatelle a’la genovese",
            "portion": "320g",
            "price": "53",
            "description": [
              "domowej roboty makaron tagliatelle, 80g polędwica wołowa, karmelizowana czerwona cebula, czerwone wino, parmezan"
            ]
          },
          {
            "id": "carbonara",
            "name": "Spaghetti a’la Carbonara",
            "portion": "280g",
            "price": "49",
            "description": [
              "domowej roboty makaron spaghetti, guanciale, jajko, parmezan"
            ]
          },
          {
            "id": "aglio-olio",
            "name": "Spaghetti aglio olio peperoncino e gamberi / polpo",
            "portion": "300g",
            "price": "55",
            "description": [
              "domowej roboty makaron spaghetti, toskańska oliwa, pietruszka, peperoncino, parmezan, papryczka chili, czosnek, do wyboru krewetki lub ośmiornica"
            ]
          },
          {
            "id": "salmone",
            "name": "Tagliatelle Salmone al forno con gorgonzola",
            "portion": "360g",
            "price": "55",
            "description": [
              "domowej roboty makaron tagliatelle, pieczony łosoś, serowy sos z gorgonzoli, groszek, szpinak"
            ]
          },
          {
            "id": "funghi-porcini",
            "name": "Tagliatelle funghi porcini",
            "portion": "350g",
            "price": "55",
            "description": [
              "domowej roboty makaron tagliatelle, borowiki w sosie śmietanowym, czosnek, pietruszka"
            ]
          },
          {
            "id": "gnocchi",
            "name": "Gnocchi con prosciutto crudo e pesto",
            "portion": "450g",
            "price": "54",
            "description": [
              "pesto, śmietanka, gnocchi ziemniaczane, szynka parmeńska, suszony pomidor, cukinia, rukola, pomidorki cherry, parmezan"
            ]
          },
          {
            "id": "tagliatelle-pesto",
            "name": "Tagliatelle pesto",
            "portion": "350g",
            "price": "47",
            "description": [
              "domowej roboty makaron tagliatelle, pesto, śmietanka, kruszone pistacje, pomidorki cherry, parmezan"
            ]
          },
          {
            "id": "tagiatelle-nduja",
            "name": "Tagiatelle 'Nduja",
            "portion": "350g",
            "price": "49",
            "description": [
              "domowej roboty makaron tagliatelle, śmietanka, nduja, salame piccante, jalapeno, gorgonzola, polpa pomidorowa."
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dania-glowne",
    "label": "DANIA GŁÓWNE",
    "groups": [
      {
        "id": "dania-glowne",
        "items": [
          {
            "id": "burger",
            "name": "Burger Papa Pasta",
            "portion": "600g",
            "price": "69",
            "description": [
              "200g burger wołowy, bułka z sezamem z naszego pieca, blanszowany szpinak z czosnkiem, piklowana cebula, pomidor, sos mayo-demi glace, sos gorgonzolowo-orzechowy, frytki, chutney z boczku"
            ]
          },
          {
            "id": "anatra",
            "name": "Anatra di cavolo rosso",
            "portion": "380g",
            "price": "72",
            "description": [
              "pierś z kaczki marynowana w ziołach, puree z czerwonej kapusty i buraka, sos cytrusowy, sos żurawinowy, granat, świeży tymianek"
            ]
          },
          {
            "id": "pollo",
            "name": "Pollo alla fiorentina",
            "portion": "400g",
            "price": "65",
            "description": [
              "udo z kurczaka w sosie śmietanowym, szpinak, suszone pomidory, szparagi, puree z selera i pietruszki, sos cebulowy, peperoncino, groszek czepny"
            ]
          },
          {
            "id": "salmone-risotto",
            "name": "Salmone con risotto al porro",
            "portion": "350g",
            "price": "73",
            "description": [
              "filet z łososia, risotto z porem i białym winem, mus z koperku, puree z czerwonej kapusty, sos cytrusowy, cytryna, świeże zioła"
            ]
          },
          {
            "id": "polpo",
            "name": "Polpo alla griglia",
            "portion": "400g",
            "price": "88",
            "description": [
              "grillowana ośmiornica, salsa pomidorowo-paprykowa, sos winno-maślany z pietruszką i czosnkiem, ziemniaczki opiekane"
            ]
          },
          {
            "id": "filetto-lardo",
            "name": "Filetto di manzo al lardo",
            "price": "99",
            "description": [
              "200g grillowana polędwica wołowa z włoską słoniną wieprzową"
            ]
          },
          {
            "id": "filetto-manzo",
            "name": "Filetto di manzo",
            "price": "94",
            "description": [
              "200g grillowana polędwica wołowa"
            ]
          },
          {
            "id": "entrecote",
            "name": "Entrecote di manzo",
            "price": "99",
            "description": [
              "300g grillowany antrykot wołowy"
            ]
          },
          {
            "id": "steak-extras",
            "name": "Dodatki do steków",
            "price": "do wyboru",
            "description": [
              "borowiki z patelni 100g – 19",
              "puree z pietruszki i selera 180g – 14",
              "ziemniaki w mundurkach 220g – 14",
              "warzywa grillowane 150g – 15",
              "mix sałat 150g – 14",
              "frytki 150g – 14"
            ]
          },
          {
            "id": "steak-sauces",
            "name": "Dwa sosy do wyboru w cenie steka",
            "price": "w cenie steków",
            "description": [
              "pieprzowy, grzybowy, demi glace (dodatkowy sos + 8zł)"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "salatki",
    "label": "SAŁATKI",
    "groups": [
      {
        "id": "salatki",
        "items": [
          {
            "id": "insalata-prosciutto",
            "name": "Insalata di prosciutto e pera",
            "portion": "320g",
            "price": "46",
            "description": [
              "mix sałat z rukolą, szynka parmeńska, gruszka, ser blue, orzech włoski, vinegret, pieczywo Ciao Pane"
            ]
          },
          {
            "id": "tachino-salmone",
            "name": "Insalata con tachino / salmone",
            "portion": "370g",
            "price": "48",
            "description": [
              "150g grillowany indyk / 100g pieczony łosoś, mix sałat, papryka, ogórek, pomidorki cherry, cebula czerwona, sos jogurtowo-koperkowy, pieczywo z naszego pieca"
            ]
          },
          {
            "id": "fegatini",
            "name": "Insalata di fegatini glassati",
            "portion": "410g",
            "price": "46",
            "description": [
              "150g wątróbka glazurowana w occie balsamicznym i miodzie, mix sałat, cebula czerwona,pomidorki cherry, pomarańcza, prażone migdały, winegret, pieczywo z naszego pieca"
            ]
          },
          {
            "id": "insalata-anatra",
            "name": "Insalata di anatra e frutta",
            "portion": "320g",
            "price": "53",
            "description": [
              "mix sałat, pierś z kaczki, granat, maliny, pomarańcza, sos vinegret żurawinowy, sos cytrusowy, pieczywo Ciao Pane"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "pizza",
    "label": "PIZZA",
    "columns": 2,
    "groups": [
      {
        "id": "pizza-first",
        "items": [
          {
            "id": "marinara",
            "name": "Marinara",
            "price": "34",
            "description": [
              "polpa pomidorowa, czosnek, oregano, bazylia"
            ]
          },
          {
            "id": "margherita",
            "name": "Margherita",
            "price": "37",
            "description": [
              "polpa pomidorowa, mozzarella, bazylia"
            ]
          },
          {
            "id": "capricciosa",
            "name": "Capricciosa",
            "price": "52",
            "description": [
              "polpa pomidorowa, mozzarella, szynka cotto, pieczarki, oliwki czarne, karczochy, bazylia"
            ]
          },
          {
            "id": "pancetta",
            "name": "Pancetta",
            "price": "46",
            "description": [
              "polpa pomidorowa, mozzarella, boczek Pancetta, cebula, bazylia"
            ]
          },
          {
            "id": "quattro-formaggi",
            "name": "Quattro formaggi",
            "price": "52",
            "description": [
              "mozzarella, scamorza, gorgonzola, parmezan"
            ]
          },
          {
            "id": "salame-piccante",
            "name": "Salame Piccante",
            "price": "48",
            "description": [
              "polpa pomidorowa, mozzarella, Salami Piccante, sos balsamiczny, rukola"
            ]
          },
          {
            "id": "cotto",
            "name": "Cotto",
            "price": "46",
            "description": [
              "polpa pomidorowa, mozzarella, szynka Cotto, bazylia"
            ]
          },
          {
            "id": "parma",
            "name": "Parma",
            "price": "52",
            "description": [
              "polpa pomidorowa, mozzarella, Prosciutto Crudo, pomidorki cherry, parmezan, rukola"
            ]
          },
          {
            "id": "vegetariano",
            "name": "Vegetariano",
            "price": "50",
            "description": [
              "polpa pomidorowa, mozzarella, cukinia, papryka, karczochy, bazylia"
            ]
          },
          {
            "id": "nduja",
            "name": "Nduja",
            "price": "50",
            "description": [
              "polpa pomidorowa, burrata, nduja, jalapeno, peperoncino, bazylia"
            ]
          }
        ]
      },
      {
        "id": "pizza-second",
        "items": [
          {
            "id": "funghi",
            "name": "Funghi",
            "price": "52",
            "description": [
              "polpa śmietanowo-grzybowa, mozzarella, kurki, guanciale, cebula, koperek"
            ]
          },
          {
            "id": "salame",
            "name": "Salame",
            "price": "47",
            "description": [
              "polpa pomidorowa, mozzarella, Salami, papryka, oregano"
            ]
          },
          {
            "id": "speck",
            "name": "Speck",
            "price": "52",
            "description": [
              "polpa pomidorowa, mozzarella, speck, mascarpone, rukola"
            ]
          },
          {
            "id": "cotto-spinaci",
            "name": "Cotto e spinaci",
            "price": "51",
            "description": [
              "śmietanka, mozzarella, szynka Cotto, szpinak, pieczarki, czarny pieprz"
            ]
          },
          {
            "id": "gambero-piccante",
            "name": "Gambero piccante",
            "price": "51",
            "description": [
              "polpa pomidorowa, mozzarella, cukinia, krewetki, nduja, czosnek, pietruszka"
            ]
          },
          {
            "id": "burrata-piccante",
            "name": "Burrata Piccante",
            "price": "58",
            "description": [
              "polpa pomidorowa, mozzarella, cukinia, krewetki, nduja, czosnek, pietruszka"
            ]
          },
          {
            "id": "dolce-pancetta",
            "name": "Dolce Pancetta",
            "price": "47",
            "description": [
              "mozzarella, boczek pancetta, parmezan, żurawina, rukola"
            ]
          },
          {
            "id": "pizza-extras",
            "name": "Dodatki do pizzy",
            "price": "do wyboru",
            "description": [
              "dodatek warzywny – 6",
              "dodatek mięsny – 9",
              "dodatkowe krewetki – 13",
              "dodatkowa burrata – 13",
              "dodatkowa mozzarella – 9"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "desery",
    "label": "DESERY",
    "groups": [
      {
        "id": "desery",
        "items": [
          {
            "id": "tiramisu",
            "name": "Tiramisu",
            "portion": "180g",
            "price": "29",
            "description": [
              "domowej roboty kremem, biszkopty, espresso, kakao"
            ]
          },
          {
            "id": "fondant",
            "name": "Fondant czekoladowy",
            "portion": "200g",
            "price": "29/36",
            "description": [
              "delikatna babeczka z płynnym, czekoladowym wnętrzem, podawana ze świeżymi owocami i musem wiśniowym / gałka lodów śmietankowych"
            ]
          },
          {
            "id": "crespelle-premium",
            "name": "Crespelle dolce Premium",
            "portion": "280g",
            "price": "39",
            "description": [
              "2 naleśniki z serem ricotta, mascarpone i pastą pistacjową, palony cukier trzcinowy, polewa z białej czekolady i pistacji, świeże owoce"
            ]
          },
          {
            "id": "daquise",
            "name": "Mini Torcik Daquise",
            "portion": "170g",
            "price": "35",
            "description": [
              "delikatna beza z kremem z mascarpone, śmietany i kajmaku, z orzechami włoskimi, daktylami oraz świeżymi borówkami, sosem marakujowym, oprószona kakao"
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "napoje",
    "label": "NAPOJE",
    "columns": 2,
    "columnBreak": 2,
    "groups": [
      {
        "id": "coffee",
        "items": [
          {
            "id": "espresso",
            "name": "Espresso",
            "price": "9"
          },
          {
            "id": "espresso-doppio",
            "name": "Espresso doppio",
            "price": "12"
          },
          {
            "id": "americano",
            "name": "Americano",
            "price": "13"
          },
          {
            "id": "cappuccino",
            "name": "Cappuccino",
            "price": "13"
          },
          {
            "id": "latte",
            "name": "Latte",
            "price": "15"
          },
          {
            "id": "flat-white",
            "name": "Flat white",
            "price": "17"
          },
          {
            "id": "vanilla-latte",
            "name": "Waniliowa Iced Latte",
            "price": "20"
          },
          {
            "id": "strawberry-latte",
            "name": "Truskawkowe Iced Latte",
            "price": "20"
          },
          {
            "id": "espresso-tonic",
            "name": "Espresso Tonic",
            "price": "20"
          },
          {
            "id": "herbata",
            "name": "Herbata",
            "price": "12",
            "description": [
              "czarna / zielona / miętowa / owocowa"
            ]
          }
        ],
        "afterNote": "Mleko: zwykłe, bez laktozy, owsiane +2 zł"
      },
      {
        "id": "craft",
        "title": "Kraftowe napoje gazowane z Browar Waszczukowe",
        "items": [
          {
            "id": "lemoniada-puszcza",
            "name": "Lemoniada z puszczy z trawą żubrową",
            "portion": "330ml",
            "price": "15"
          },
          {
            "id": "cola-puszcza",
            "name": "Cola z puszczy z cynamonem",
            "portion": "330ml",
            "price": "15"
          },
          {
            "id": "dzin-dzer",
            "name": "Dżin-dżer z puszczy z imbirem",
            "portion": "330ml",
            "price": "15"
          },
          {
            "id": "kwas",
            "name": "Kwas chlebowy z puszczy z żytniego słodu",
            "portion": "330ml",
            "price": "15"
          }
        ]
      },
      {
        "id": "cold-drinks",
        "items": [
          {
            "id": "lemoniada",
            "name": "Lemoniada",
            "portion": "400ml / 1 litr",
            "price": "19/33",
            "description": [
              "klasyczna, truskawkowa, czarny bez, gruszka, hibiskus, marakuja"
            ]
          },
          {
            "id": "soki",
            "name": "Soki świeżo wyciskane",
            "portion": "300ml",
            "price": "22",
            "description": [
              "pomarańczowy / grejpfrutowy / mix pomarańczowo-grelpfrutowy"
            ]
          },
          {
            "id": "woda-niegazowana",
            "name": "Kropla Beskidu woda niegazowana",
            "portion": "330ml / 1 litr",
            "price": "9/18"
          },
          {
            "id": "woda-gazowana",
            "name": "Kropla Beskidu woda gazowana",
            "portion": "330ml / 1 litr",
            "price": "9/18"
          },
          {
            "id": "coca-cola",
            "name": "Coca Cola",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "coca-cola-zero",
            "name": "Coca Cola Zero",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "sprite",
            "name": "Sprite",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "fanta",
            "name": "Fanta",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "kinley-tonic",
            "name": "Kinley Tonic Water",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "kinley-rose",
            "name": "Kinley Bitter Rose",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "fuze-lemon",
            "name": "Fuze Tea cytrynowy",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "fuze-peach",
            "name": "Fuze Tea brzoskwiniowy",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "cappy-apple",
            "name": "Cappy jabłkowy",
            "portion": "250ml",
            "price": "9"
          },
          {
            "id": "cappy-orange",
            "name": "Cappy pomarańczowy",
            "portion": "250ml",
            "price": "9"
          }
        ]
      }
    ]
  }
];

export const centroBreakfast: readonly MenuGroup[] = [
  {
    "id": "savory",
    "title": "Na słono:",
    "items": [
      {
        "id": "brioche-eggs",
        "name": "Brioche z jajecznicą",
        "price": "34",
        "description": [
          "brioche na maśle, jajecznica z 3 jaj, salami piccante, pomidory bruschetta, masło ziołowe, szczypiorek",
          "Dodatkowo: 3 białe kiełbaski + 8zł"
        ]
      },
      {
        "id": "focaccia-sandwich",
        "name": "Kanapki na focacci",
        "price": "37",
        "description": [
          "1. Z pesto, burratą, mortadelą, pistacjami i pomidorkami cherry",
          "2. Z pastą jajeczną, pomidorkami i szczypiorkiem"
        ]
      },
      {
        "id": "brioche-salmon",
        "name": "Brioche z łososiem i jajkiem poche",
        "price": "35",
        "description": [
          "Brioche z kremowym serkiem i koperkiem, wędzony łosoś, szpinak, jajko poche, sos musztardowo-miodowy"
        ]
      },
      {
        "id": "pancake-burger",
        "name": "Pancake burger",
        "price": "35",
        "description": [
          "Dwa placki pancake, sos musztardowo-miodowy, karmelizowana cebula, mortadela, sałata, pomidor, chipsy z pancetty"
        ]
      },
      {
        "id": "focaccia-hummus",
        "name": "Focaccia z hummusem z buraka i jajkiem poche",
        "price": "30",
        "description": [
          "Grillowana focaccia z kremowym hummusem z buraka, jajkiem poche i prażonym sezamem"
        ]
      },
      {
        "id": "omelette",
        "name": "Omlet z szynką i warzywami",
        "portion": "450g",
        "price": "37",
        "description": [
          "Puszysty omlet z szynką cotto, kolorową papryką, cebulą, rukolą, mortadelą i pomidorkami cherry, podawany z majonezem szczypiorkowym i grillowaną focaccią"
        ]
      },
      {
        "id": "panino",
        "name": "Panino z mascarpone i salami",
        "price": "39",
        "description": [
          "Pieczone bułeczki z ciasta pizzy, mascarpone, mozzarella, salami i świeże warzywa"
        ]
      }
    ]
  },
  {
    "id": "sweet",
    "title": "Na słodko:",
    "items": [
      {
        "id": "ricotta-crepes",
        "name": "Naleśniki z kremem z ricotty",
        "price": "29",
        "description": [
          "Cienkie naleśniki nadziewane słodkim krem ricotta-mascarpone z owocami sezonowymi i musem truskawkowym"
        ]
      },
      {
        "id": "croissant",
        "name": "Croissant na słodko",
        "price": "28",
        "description": [
          "Croissant z rzemieślniczej piekarni, świeże owoce sezonowe, krem czekoladowy i mus truskawkowy"
        ]
      },
      {
        "id": "pancakes",
        "name": "Pancake’s na słodko z musem owocowym",
        "price": "29",
        "description": [
          "Puszyste naleśniki z musem truskawkowym i świeżymi owocami sezonowymi"
        ]
      }
    ]
  }
];

export const centroAutumnMenu: readonly MenuGroup[] = [
  {
    "id": "autumn-dishes",
    "items": [
      {
        "id": "crema-zucca",
        "name": "Crema di zucca",
        "portion": "250ml",
        "price": "33",
        "description": [
          "dynia, marchew, ziemniak, cebula, pestki dyni, grzanka"
        ]
      },
      {
        "id": "pizza-tartufo",
        "name": "Pizza al tartufo",
        "price": "55",
        "description": [
          "spód truflowo-śmietanowy, mozzarella, kiełbasa Salsiccia Veneta, cebulka karmelizowana, zapieczony świeży tymianek, rukola"
        ]
      },
      {
        "id": "frutta-gelato",
        "name": "Dessert di frutta e gelato",
        "portion": "220g",
        "price": "33",
        "description": [
          "karmelizowane gruszki i śliwki w Jack Fire, podawane z kruszonką z migdałami i gałką lodów"
        ]
      }
    ]
  },
  {
    "id": "hot-drinks",
    "title": "Gorące napoje",
    "items": [
      {
        "id": "grzane-wino",
        "name": "Grzane wino",
        "portion": "240ml",
        "price": "29",
        "description": [
          "wytrawne czerwone wino, autorski syrop korzenny, miód"
        ]
      },
      {
        "id": "grzany-aperol",
        "name": "Grzany Aperol",
        "portion": "300ml",
        "price": "35",
        "description": [
          "Aperol, wytrawne białe wino, herbata rooibos, sok grejpfrutowy, sok jabłkowy, miód, goździki"
        ]
      },
      {
        "id": "herbata-zimowa",
        "name": "Herbata zimowa",
        "portion": "450ml",
        "price": "25",
        "description": [
          "herbata czarna, autorski syrop korzenny, miód, owoce i przyprawy korzenne"
        ]
      }
    ]
  }
];

export const centroKidsMenu: readonly MenuGroup[] = [
  {
    "id": "kids-pasta",
    "title": "Makarony",
    "items": [
      {
        "id": "al-pomodoro",
        "name": "Al pomodoro",
        "portion": "120g / 120g",
        "price": "25",
        "description": [
          "makaron spaghetti, do wyboru polpa pomidorowa/sos Bolognese"
        ]
      }
    ]
  },
  {
    "id": "kids-pizza",
    "title": "Pizza średnicy ok 23cm",
    "items": [
      {
        "id": "kids-margherita",
        "name": "Margherita",
        "portion": "120g",
        "price": "25",
        "description": [
          "polpa pomidorowa, mozzarella (+ bazylia 0zł)"
        ]
      },
      {
        "id": "kids-cotto",
        "name": "Cotto",
        "price": "27",
        "description": [
          "polpa pomidorowa, mozzarella, szynka Cotto (+ bazylia 0zł)"
        ]
      }
    ]
  },
  {
    "id": "kids-main",
    "title": "Dania główne",
    "items": [
      {
        "id": "kids-filetto",
        "name": "Filetto",
        "price": "28",
        "description": [
          "polędwiczki z kurczaka w panierce, frytki"
        ]
      },
      {
        "id": "kids-burger",
        "name": "Burger Bambini",
        "price": "35",
        "description": [
          "burger wołowy 80g, bułka z naszego pieca, mozzarella, ketchup, frytki"
        ]
      }
    ]
  }
];
