import type { ExtraLang2 } from './data-extra2';
import type { Note, P } from './theory';

/**
 * Theorie für Arabisch, Russisch, Niederländisch und Griechisch – erklärt auf [Deutsch, Italienisch].
 */

export const PRONUNCIATION_EXTRA2: Record<ExtraLang2, { sound: string; tip: P }[]> = {
  ar: [
    { sound: '←', tip: ['Arabisch schreibt man von rechts nach links, die Buchstaben werden verbunden. Unter jedem Wort steht die Umschrift.', 'L’arabo si scrive da destra a sinistra e le lettere si uniscono. Sotto ogni parola trovi la trascrizione.'] },
    { sound: 'ح', tip: ['„ḥ“ ist ein kräftig gehauchtes „h“ tief im Hals: مرحبا (marhaban), حليب (halib).', '«ḥ» è una «h» soffiata forte, in fondo alla gola: مرحبا (marhaban), حليب (halib).'] },
    { sound: 'خ', tip: ['„kh“ klingt wie „ch“ in „Bach“: خبز (khubz), أخ (akh).', '«kh» è un suono rauco in gola, come la «j» spagnola: خبز (khubz), أخ (akh).'] },
    { sound: 'ع', tip: ['„ʿain“ ist ein gepresster Laut aus dem Hals: نعم (naʿam), عشرة (ʿashara).', '«ʿain» è un suono stretto che nasce in gola: نعم (naʿam), عشرة (ʿashara).'] },
    { sound: 'ث / ذ', tip: ['„th“ wie englisch „think“ (ثلاثة thalatha), „dh“ wie englisch „the“ (هذه hadhihi).', '«th» come l’inglese «think» (ثلاثة thalatha), «dh» come l’inglese «the» (هذه hadhihi).'] },
    { sound: 'ق', tip: ['„q“ ist ein sehr tiefes „k“ hinten im Hals: قطة (qitta).', '«q» è una «k» molto profonda, in fondo alla gola: قطة (qitta).'] }
  ],
  ru: [
    { sound: 'В Н Р С У Х', tip: ['Vorsicht, falsche Freunde: В = w, Н = n, Р = r, С = s, У = u, Х = ch.', 'Attenzione, lettere ingannevoli: В = v, Н = n, Р = r, С = s, У = u, Х = h aspirata.'] },
    { sound: 'о → а', tip: ['Ein unbetontes „о“ klingt wie „a“: молоко (malakó), спасибо (spasíba), собака (sabáka).', 'Una «о» senza accento suona come «a»: молоко (malakó), спасибо (spasíba), собака (sabáka).'] },
    { sound: 'ы', tip: ['„ы“ ist ein dumpfes „i“, die Zunge liegt hinten: рыба, мышь.', '«ы» è una «i» cupa, con la lingua indietro: рыба, мышь.'] },
    { sound: 'ь', tip: ['Das Weichheitszeichen „ь“ wird nicht gesprochen, es macht den Laut davor weich: пять, мышь.', 'Il segno molle «ь» non si pronuncia: rende morbido il suono prima: пять, мышь.'] },
    { sound: 'ж ш щ ч', tip: ['„ж“ wie „g“ in „Garage“, „ш“ = „sch“, „щ“ = weiches langes „sch“, „ч“ = „tsch“.', '«ж» come la «j» francese, «ш» = «sc» di «scena», «щ» = «sc» lunga e morbida, «ч» = «c» di «ciao».'] },
    { sound: 'р', tip: ['Das „р“ wird mit der Zungenspitze gerollt: рыба, привет.', 'La «р» si fa vibrare con la punta della lingua, come in italiano: рыба, привет.'] }
  ],
  nl: [
    { sound: 'g / ch', tip: ['„g“ und „ch“ sind ein rauhes „ch“ wie in „Bach“: goed, groen, acht.', '«g» e «ch» sono un suono rauco in gola, come la «j» spagnola: goed, groen, acht.'] },
    { sound: 'oe', tip: ['„oe“ klingt wie „u“: goed, broer, boek, koe.', '«oe» si legge «u»: goed, broer, boek, koe.'] },
    { sound: 'ij / ei', tip: ['„ij“ und „ei“ klingen gleich, etwa wie „äi“: vijf, mijn, ei.', '«ij» e «ei» suonano uguali, più o meno «ei» aperta: vijf, mijn, ei.'] },
    { sound: 'ui', tip: ['„ui“ ist ein Laut zwischen „au“ und „öi“: muis.', '«ui» è un suono tra «au» e «oi» con le labbra tonde: muis.'] },
    { sound: 'aa / ee / oo', tip: ['Doppelte Vokale sind lang: paard, twee, rood.', 'Le vocali doppie sono lunghe: paard, twee, rood.'] },
    { sound: 'v / w', tip: ['„v“ klingt fast wie „f“ (vier, vis), „w“ ist weicher als im Deutschen (wit, water).', '«v» suona quasi come «f» (vier, vis), «w» è una «v» leggera (wit, water).'] }
  ],
  el: [
    { sound: 'ά έ ό', tip: ['Der Akzent zeigt die betonte Silbe: Καλημέρα, Ευχαριστώ, όχι.', 'L’accento indica la sillaba da accentare: Καλημέρα, Ευχαριστώ, όχι.'] },
    { sound: ';', tip: ['Das griechische Fragezeichen sieht aus wie ein Strichpunkt: Τι κάνεις;', 'Il punto interrogativo greco sembra un punto e virgola: Τι κάνεις;'] },
    { sound: 'δ / θ', tip: ['„δ“ wie englisch „the“ (δύο, δέκα), „θ“ wie englisch „think“ (θέλω).', '«δ» come l’inglese «the» (δύο, δέκα), «θ» come l’inglese «think» (θέλω).'] },
    { sound: 'γ / χ', tip: ['„γ“ ist ein weiches „gh“, vor e/i fast „j“ (γάτα, γεια); „χ“ = „ch“ (όχι, χρώμα).', '«γ» è una «g» morbida, davanti a e/i quasi «i» (γάτα, γεια); «χ» = h aspirata forte (όχι, χρώμα).'] },
    { sound: 'μπ / ντ', tip: ['„μπ“ = „b“ (μπαμπάς, μπλε), „ντ“ = „d“ (Αντίο).', '«μπ» = «b» (μπαμπάς, μπλε), «ντ» = «d» (Αντίο).'] },
    { sound: 'ου / η / ει / οι', tip: ['„ου“ = „u“ (ουρανός, πουλί). „η“, „ι“, „υ“, „ει“, „οι“ klingen alle wie „i“.', '«ου» = «u» (ουρανός, πουλί). «η», «ι», «υ», «ει», «οι» si leggono tutte «i».'] }
  ]
};

export const NOTES_EXTRA2: Record<string, Record<ExtraLang2, Note[]>> = {
  saluti: {
    ar: [
      { title: ['Begrüßen auf Arabisch', 'Salutare in arabo'], steps: [['„مرحبا“ (marhaban) = Hallo. „صباح الخير“ (sabah al-khayr) = Guten Morgen – wörtlich „Morgen des Guten“.', '«مرحبا» (marhaban) = ciao. «صباح الخير» (sabah al-khayr) = buongiorno, parola per parola «mattina del bene».'], ['„مع السلامة“ (maʿa as-salama) = Tschüss – wörtlich „mit der Sicherheit“.', '«مع السلامة» (maʿa as-salama) = arrivederci, parola per parola «con la salvezza».'], ['„شكرا“ (shukran) = danke, „من فضلك“ (min fadlik) = bitte.', '«شكرا» (shukran) = grazie, «من فضلك» (min fadlik) = per favore.']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„كيف حالك؟“ (kayfa haluk?) – das Fragezeichen ist gespiegelt: ؟', '«كيف حالك؟» (kayfa haluk?) – il punto interrogativo è girato: ؟'], ['Antwort: „أنا بخير“ (ana bikhayr) = Mir geht es gut.', 'Risposta: «أنا بخير» (ana bikhayr) = sto bene.']] },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„اسمي آنا“ (ismi Anna): „ism“ = Name, die Endung „-i“ heißt „mein“.', '«اسمي آنا» (ismi Anna): «ism» = nome, la terminazione «-i» vuol dire «mio».']], example: { text: 'اسمي آنا.', meaning: ['Ich heiße Anna.', 'Mi chiamo Anna.'] } }
    ],
    ru: [
      { title: ['Begrüßen auf Russisch', 'Salutare in russo'], steps: [['„Привет“ (priwjet) unter Freunden; zu Erwachsenen sagt man „Здравствуйте“.', '«Привет» (privet) tra amici; agli adulti si dice «Здравствуйте».'], ['„До свидания“ = Auf Wiedersehen, „Спокойной ночи“ = Gute Nacht.', '«До свидания» = arrivederci, «Спокойной ночи» = buonanotte.'], ['„Спасибо“ = danke, „Пожалуйста“ = bitte (und auch „gern geschehen“).', '«Спасибо» = grazie, «Пожалуйста» = per favore (e anche «prego»).']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Как дела?“ – wörtlich „Wie (sind die) Sachen?“.', '«Как дела?» – parola per parola «come (vanno le) cose?».'], ['Antwort: „Хорошо, спасибо.“ = Gut, danke.', 'Risposta: «Хорошо, спасибо.» = bene, grazie.']] },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„Меня зовут Анна.“ – wörtlich „Mich ruft man Anna“.', '«Меня зовут Анна.» – parola per parola «mi chiamano Anna».']], example: { text: 'Меня зовут Анна.', meaning: ['Ich heiße Anna.', 'Mi chiamo Anna.'] } }
    ],
    nl: [
      { title: ['Begrüßen auf Niederländisch', 'Salutare in olandese'], steps: [['„Hallo“, „Goedemorgen“ und „Goedenacht“ ähneln dem Deutschen.', '«Hallo» = ciao, «Goedemorgen» = buongiorno, «Goedenacht» = buonanotte.'], ['„Dag“ heißt Hallo und Tschüss.', '«Dag» vuol dire sia ciao sia arrivederci.'], ['„Dank je“ = danke, „Alsjeblieft“ = bitte (und „hier, bitte“).', '«Dank je» = grazie, «Alsjeblieft» = per favore (e «ecco a te»).']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Hoe gaat het?“ = Wie geht es? – Antwort: „Goed, dank je.“', '«Hoe gaat het?» = come va? – risposta: «Goed, dank je.»'], ['„Ik heet Anna.“ = Ich heiße Anna – fast wie im Deutschen.', '«Ik heet Anna.» = mi chiamo Anna.']], example: { text: 'Hoe gaat het? – Goed, dank je.', meaning: ['Wie geht es dir? – Gut, danke.', 'Come stai? – Bene, grazie.'] } }
    ],
    el: [
      { title: ['Begrüßen auf Griechisch', 'Salutare in greco'], steps: [['„Γεια σου“ (ja su) heißt Hallo und Tschüss unter Freunden.', '«Γεια σου» (ja su) vuol dire ciao, sia quando arrivi sia quando vai via.'], ['„Καλημέρα“ = Guten Morgen, „Καληνύχτα“ = Gute Nacht („καλή“ = gut).', '«Καλημέρα» = buongiorno, «Καληνύχτα» = buonanotte («καλή» = buona).'], ['„Ευχαριστώ“ = danke, „Παρακαλώ“ = bitte und gern geschehen.', '«Ευχαριστώ» = grazie, «Παρακαλώ» = per favore e prego.']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Τι κάνεις;“ – wörtlich „Was machst du?“. Antwort: „Είμαι καλά“ = Mir geht es gut.', '«Τι κάνεις;» – parola per parola «che fai?». Risposta: «Είμαι καλά» = sto bene.'], ['„Με λένε Άννα.“ – wörtlich „Mich nennt man Anna“.', '«Με λένε Άννα.» – parola per parola «mi chiamano Anna».']], example: { text: 'Τι κάνεις; – Είμαι καλά, ευχαριστώ.', meaning: ['Wie geht es dir? – Gut, danke.', 'Come stai? – Bene, grazie.'] } }
    ]
  },
  numeri: {
    ar: [
      { title: ['Arabische Ziffern', 'Le cifre arabe'], steps: [['In arabischen Ländern schreibt man oft diese Ziffern: ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ١٠.', 'Nei paesi arabi si scrivono spesso queste cifre: ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩ ١٠.'], ['Zahlen liest man trotzdem von links nach rechts.', 'I numeri però si leggono da sinistra a destra.']] },
      { title: ['Genau zwei', 'Esattamente due'], steps: [['Für zwei Dinge gibt es eine eigene Form (Dual): كلب (kalb) = Hund, كلبان (kalban) = zwei Hunde.', 'Per due cose c’è una forma speciale (il duale): كلب (kalb) = cane, كلبان (kalban) = due cani.'], ['„عمري سبع سنوات“ (ʿumri sabʿ sanawat) – wörtlich „mein Alter sieben Jahre“.', '«عمري سبع سنوات» (ʿumri sabʿ sanawat) – parola per parola «la mia età sette anni».']], example: { text: 'عندي كلبان.', meaning: ['Ich habe zwei Hunde.', 'Ho due cani.'] } }
    ],
    ru: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['„один“ und „два“ ändern sich mit dem Geschlecht: один кролик, одна кошка; два кролика, две собаки.', '«один» e «два» cambiano con il genere: один кролик, одна кошка; два кролика, две собаки.']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['„Мне семь лет.“ – wörtlich „Mir sieben Jahre“.', '«Мне семь лет.» – parola per parola «a me sette anni».'], ['Nach 2, 3, 4 steht eine besondere Form (три яблока), ab 5 eine andere (пять яблок).', 'Dopo 2, 3, 4 si usa una forma speciale (три яблока), da 5 in su un’altra (пять яблок).']], example: { text: 'Мне семь лет.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } }
    ],
    nl: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['„één“ (eins) hat Striche, damit man es nicht mit „een“ (ein) verwechselt.', '«één» (uno) ha gli accenti per non confonderlo con «een» (un).']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['Wie im Deutschen mit „sein“: „Ik ben zeven jaar.“', 'Si usa «essere»: «Ik ben zeven jaar.» = «sono sette anni».'], ['Mehrzahl mit -en oder -s: hond → honden, appel → appels.', 'Plurale con -en o -s: hond → honden, appel → appels.']], example: { text: 'Ik heb twee honden.', meaning: ['Ich habe zwei Hunde.', 'Ho due cani.'] } }
    ],
    el: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['„ένα“ ändert sich mit dem Geschlecht: ένας σκύλος, μία γάτα, ένα πουλί.', '«ένα» cambia con il genere: ένας σκύλος, μία γάτα, ένα πουλί.'], ['„επτά“ und „εννέα“ sagt man auch kurz „εφτά“ und „εννιά“.', '«επτά» e «εννέα» si dicono anche «εφτά» e «εννιά».']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['„Είμαι επτά χρονών.“ – wie im Deutschen mit „sein“.', '«Είμαι επτά χρονών.» – si usa «essere»: «sono di sette anni».']], example: { text: 'Είμαι επτά χρονών.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } }
    ]
  },
  colori: {
    ar: [
      { title: ['Farbe nach dem Nomen', 'Il colore dopo il nome'], steps: [['Die Farbe steht hinter dem Nomen und passt sich an: أحمر (ahmar) männlich, حمراء (hamraʾ) weiblich.', 'Il colore va dopo il nome e si accorda: أحمر (ahmar) maschile, حمراء (hamraʾ) femminile.'], ['Ein „ist“ braucht man nicht: „التفاحة حمراء“ = „der Apfel rot“.', 'Non serve «è»: «التفاحة حمراء» = «la mela rossa».']], example: { text: 'السماء زرقاء.', meaning: ['Der Himmel ist blau.', 'Il cielo è azzurro.'] } }
    ],
    ru: [
      { title: ['Farben passen sich an', 'I colori si accordano'], steps: [['Endungen: красный (männlich), красная (weiblich), красное (sächlich): яблоко красное.', 'Terminazioni: красный (maschile), красная (femminile), красное (neutro): яблоко красное.'], ['Ein „ist“ braucht man nicht: „Небо голубое.“ = „Himmel blau“.', 'Non serve «è»: «Небо голубое.» = «cielo azzurro».']], example: { text: 'Яблоко красное.', meaning: ['Der Apfel ist rot.', 'La mela è rossa.'] } },
      { title: ['Zwei Blau', 'Due blu'], steps: [['Russisch hat zwei Wörter: синий = dunkelblau, голубой = hellblau (wie der Himmel).', 'Il russo ha due parole: синий = blu scuro, голубой = azzurro (come il cielo).']] }
    ],
    nl: [
      { title: ['Farbe vor dem Nomen', 'Il colore prima del nome'], steps: [['Vor dem Nomen bekommt die Farbe meist ein -e: de rode appel.', 'Davanti al nome il colore di solito prende una -e: de rode appel.'], ['Bei „het“-Wörtern mit „een“ bleibt sie ohne -e: een rood potlood.', 'Con le parole «het» e «een» resta senza -e: een rood potlood.']], example: { text: 'De appel is rood.', meaning: ['Der Apfel ist rot.', 'La mela è rossa.'] } }
    ],
    el: [
      { title: ['Farben passen sich an', 'I colori si accordano'], steps: [['Die Farbe steht vor dem Nomen und passt sich an: κόκκινος, κόκκινη, κόκκινο.', 'Il colore va prima del nome e si accorda: κόκκινος, κόκκινη, κόκκινο.'], ['„μπλε“ und „ροζ“ bleiben immer gleich.', '«μπλε» e «ροζ» non cambiano mai.']], example: { text: 'Το μήλο είναι κόκκινο.', meaning: ['Der Apfel ist rot.', 'La mela è rossa.'] } },
      { title: ['Mein …', 'Il mio …'], steps: [['„μου“ (mein) steht hinter dem Nomen: το χρώμα μου = meine Farbe.', '«μου» (mio) va dopo il nome: το χρώμα μου = il mio colore.']] }
    ]
  },
  animali: {
    ar: [
      { title: ['Der Artikel ال', 'L’articolo ال'], steps: [['„ال“ (al-) heißt „der/die/das“ und wird vorne angehängt: كلب (kalb) = Hund, الكلب (al-kalb) = der Hund.', '«ال» (al-) vuol dire «il/la» e si attacca davanti: كلب (kalb) = cane, الكلب (al-kalb) = il cane.'], ['Wörter auf ة (-a) sind meist weiblich: قطة, بقرة, سمكة.', 'Le parole che finiscono in ة (-a) di solito sono femminili: قطة, بقرة, سمكة.']], example: { text: 'الكلب كبير.', meaning: ['Der Hund ist groß.', 'Il cane è grande.'] } },
      { title: ['Ich habe …', 'Io ho …'], steps: [['„عندي“ (ʿindi) = ich habe – wörtlich „bei mir“.', '«عندي» (ʿindi) = io ho – parola per parola «presso di me».']] }
    ],
    ru: [
      { title: ['Keine Artikel', 'Niente articoli'], steps: [['Russisch hat keine Artikel: собака = Hund oder der Hund.', 'Il russo non ha articoli: собака = cane o il cane.'], ['Das Geschlecht zeigt die Endung: Konsonant männlich (кролик), -а weiblich (кошка, корова), -о sächlich. Wörter auf -ь muss man lernen (лошадь, мышь sind weiblich).', 'Il genere si vede dalla fine: consonante maschile (кролик), -а femminile (кошка, корова), -о neutro. Le parole in -ь vanno imparate (лошадь, мышь sono femminili).']] },
      { title: ['Ich habe …', 'Io ho …'], steps: [['„У меня есть кошка.“ – wörtlich „Bei mir gibt es eine Katze“.', '«У меня есть кошка.» – parola per parola «presso di me c’è un gatto».']], example: { text: 'У меня есть кошка.', meaning: ['Ich habe eine Katze.', 'Ho un gatto.'] } }
    ],
    nl: [
      { title: ['Zwei Artikel: de und het', 'Due articoli: de e het'], steps: [['Die meisten Wörter haben „de“ (de hond, de kat), manche „het“ (het paard, het konijn).', 'La maggior parte delle parole ha «de» (de hond, de kat), alcune «het» (het paard, het konijn).'], ['In der Mehrzahl immer „de“: de paarden.', 'Al plurale sempre «de»: de paarden.']], example: { text: 'De hond is groot.', meaning: ['Der Hund ist groß.', 'Il cane è grande.'] } }
    ],
    el: [
      { title: ['Drei Artikel', 'Tre articoli'], steps: [['„ο“ männlich (ο σκύλος), „η“ weiblich (η γάτα), „το“ sächlich (το πουλί).', '«ο» maschile (ο σκύλος), «η» femminile (η γάτα), «το» neutro (το πουλί).'], ['Die Endung hilft: -ος meist männlich, -α/-η weiblich, -ο/-ι sächlich.', 'La terminazione aiuta: -ος di solito maschile, -α/-η femminile, -ο/-ι neutro.']], example: { text: 'Ο σκύλος είναι μεγάλος.', meaning: ['Der Hund ist groß.', 'Il cane è grande.'] } }
    ]
  },
  famiglia: {
    ar: [
      { title: ['Mein mit -i', '«Mio» con -i'], steps: [['„أم“ (umm) = Mutter, „أمي“ (ummi) = meine Mutter.', '«أم» (umm) = mamma, «أمي» (ummi) = la mia mamma.'], ['Bei Wörtern auf ة wird daraus ت: عائلة → عائلتي (ʿaʾilati, meine Familie).', 'Nelle parole in ة diventa ت: عائلة → عائلتي (ʿaʾilati, la mia famiglia).']], example: { text: 'هذه أمي.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } },
      { title: ['Das ist …', 'Questo è …'], steps: [['„هذا“ (hadha) für männliche, „هذه“ (hadhihi) für weibliche Wörter.', '«هذا» (hadha) per i maschili, «هذه» (hadhihi) per i femminili.']] }
    ],
    ru: [
      { title: ['Mein, meine', 'Mio, mia'], steps: [['„мой“ für männliche (мой брат), „моя“ für weibliche Wörter (моя мама).', '«мой» per i maschili (мой брат), «моя» per i femminili (моя мама).'], ['„Это …“ = Das ist …', '«Это …» = questo è …']], example: { text: 'Это моя мама.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } },
      { title: ['Endungen ändern sich', 'Le terminazioni cambiano'], steps: [['„Я люблю свою семью.“ – aus „семья“ wird „семью“.', '«Я люблю свою семью.» – «семья» diventa «семью».']] }
    ],
    nl: [
      { title: ['Mein', 'Mio'], steps: [['„mijn“ bleibt immer gleich: mijn moeder, mijn broer.', '«mijn» non cambia mai: mijn moeder, mijn broer.'], ['„Ik hou van …“ = Ich liebe … / Ich mag …', '«Ik hou van …» = voglio bene a … / mi piace …']], example: { text: 'Dit is mijn moeder.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } }
    ],
    el: [
      { title: ['Mein kommt hinterher', '«Mio» va dopo'], steps: [['„η μαμά μου“ = meine Mutter – „μου“ steht hinter dem Nomen, der Artikel bleibt.', '«η μαμά μου» = la mia mamma – «μου» va dopo il nome e l’articolo resta.'], ['„Αυτή είναι …“ = Das ist … (weiblich).', '«Αυτή είναι …» = questa è …']], example: { text: 'Αυτή είναι η μαμά μου.', meaning: ['Das ist meine Mutter.', 'Questa è la mia mamma.'] } },
      { title: ['Artikel ändern sich', 'Gli articoli cambiano'], steps: [['„Αγαπώ την οικογένειά μου.“ – nach dem Verb wird aus „η“ → „την“.', '«Αγαπώ την οικογένειά μου.» – dopo il verbo «η» diventa «την».']] }
    ]
  },
  cibo: {
    ar: [
      { title: ['Hunger', 'La fame'], steps: [['„أنا جائع“ (ana jaʾiʿ) sagt ein Junge, „أنا جائعة“ (ana jaʾiʿa) ein Mädchen.', '«أنا جائع» (ana jaʾiʿ) lo dice un maschio, «أنا جائعة» (ana jaʾiʿa) una femmina.']], example: { text: 'أنا جائع.', meaning: ['Ich habe Hunger.', 'Ho fame.'] } },
      { title: ['Wollen und mögen', 'Volere e amare'], steps: [['„أريد“ (urid) = ich möchte, „أحب“ (uhibbu) = ich mag / ich liebe.', '«أريد» (urid) = voglio, «أحب» (uhibbu) = mi piace / amo.']] }
    ],
    ru: [
      { title: ['Hunger', 'La fame'], steps: [['„Я голоден.“ sagt ein Junge, „Я голодна.“ ein Mädchen.', '«Я голоден.» lo dice un maschio, «Я голодна.» una femmina.']], example: { text: 'Я голоден.', meaning: ['Ich habe Hunger.', 'Ho fame.'] } },
      { title: ['Ich möchte …', 'Vorrei …'], steps: [['„Я хочу воды.“ = Ich möchte Wasser – aus „вода“ wird „воды“.', '«Я хочу воды.» = voglio dell’acqua – «вода» diventa «воды».'], ['„Я люблю яблоки.“ = Ich mag Äpfel.', '«Я люблю яблоки.» = mi piacciono le mele.']] }
    ],
    nl: [
      { title: ['Hunger haben', 'Avere fame'], steps: [['„Ik heb honger.“ – wie im Deutschen.', '«Ik heb honger.» – parola per parola «ho fame».']], example: { text: 'Ik heb honger.', meaning: ['Ich habe Hunger.', 'Ho fame.'] } },
      { title: ['Höflich bitten', 'Chiedere con gentilezza'], steps: [['„Ik wil graag water.“ – „graag“ (gern) macht es höflich.', '«Ik wil graag water.» – «graag» (volentieri) lo rende gentile.']] }
    ],
    el: [
      { title: ['Hunger', 'La fame'], steps: [['„Έχω πείνα.“ = Ich habe Hunger. Man sagt auch einfach „Πεινάω“.', '«Έχω πείνα.» = ho fame. Si dice anche solo «Πεινάω».']], example: { text: 'Έχω πείνα.', meaning: ['Ich habe Hunger.', 'Ho fame.'] } },
      { title: ['Mögen', 'Piacere'], steps: [['„Μου αρέσουν τα μήλα.“ – wie im Italienischen „mi piacciono le mele“.', '«Μου αρέσουν τα μήλα.» – proprio come «mi piacciono le mele».'], ['„Θέλω“ = ich möchte.', '«Θέλω» = voglio.']] }
    ]
  },
  scuola: {
    ar: [
      { title: ['Wohin und wo?', 'Dove vai, dov’è?'], steps: [['„إلى“ (ila) = zu/nach: أذهب إلى المدرسة = Ich gehe zur Schule.', '«إلى» (ila) = a/verso: أذهب إلى المدرسة = vado a scuola.'], ['„أين“ (ayna) = wo: أين كتابي؟ = Wo ist mein Buch?', '«أين» (ayna) = dove: أين كتابي؟ = dov’è il mio libro?']], example: { text: 'أذهب إلى المدرسة.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } }
    ],
    ru: [
      { title: ['Zur Schule', 'A scuola'], steps: [['„Я иду в школу.“ – nach „в“ (in) wird aus „школа“ → „школу“.', '«Я иду в школу.» – dopo «в» (a) «школа» diventa «школу».'], ['„Где“ = wo: Где моя книга?', '«Где» = dove: Где моя книга?']], example: { text: 'Я иду в школу.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } }
    ],
    nl: [
      { title: ['Zur Schule', 'A scuola'], steps: [['„Ik ga naar school.“ – „naar“ = nach/zu, ohne Artikel.', '«Ik ga naar school.» – «naar» = a/verso, senza articolo.'], ['„Waar“ = wo: Waar is mijn boek?', '«Waar» = dove: Waar is mijn boek?']], example: { text: 'Ik ga naar school.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } }
    ],
    el: [
      { title: ['Zur Schule', 'A scuola'], steps: [['„στο“ = „σε“ (zu) + „το“: Πηγαίνω στο σχολείο.', '«στο» = «σε» (a) + «το»: Πηγαίνω στο σχολείο.'], ['„Πού“ = wo: Πού είναι το βιβλίο μου;', '«Πού» = dove: Πού είναι το βιβλίο μου;']], example: { text: 'Πηγαίνω στο σχολείο.', meaning: ['Ich gehe zur Schule.', 'Vado a scuola.'] } }
    ]
  },
  frasi: {
    ar: [
      { title: ['Nein sagen', 'Dire di no'], steps: [['„لا“ (la) steht vor dem Verb: لا أعرف (la aʿrif) = Ich weiß nicht, لا أفهم (la afham) = Ich verstehe nicht.', '«لا» (la) va prima del verbo: لا أعرف (la aʿrif) = non lo so, لا أفهم (la afham) = non capisco.']], example: { text: 'لا أفهم.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„عيد ميلاد سعيد!“ = Alles Gute zum Geburtstag! „هيا نلعب!“ = Komm, lass uns spielen!', '«عيد ميلاد سعيد!» = buon compleanno! «هيا نلعب!» = dai, giochiamo!']] }
    ],
    ru: [
      { title: ['Nein sagen', 'Dire di no'], steps: [['„не“ steht vor dem Verb: Я не знаю, Я не понимаю.', '«не» va prima del verbo, come «non»: Я не знаю, Я не понимаю.']], example: { text: 'Я не понимаю.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„С днём рождения!“ = Alles Gute zum Geburtstag! „Приятного аппетита!“ = Guten Appetit!', '«С днём рождения!» = buon compleanno! «Приятного аппетита!» = buon appetito!'], ['„Давай …“ = Lass uns …: Давай играть вместе!', '«Давай …» = dai, …: Давай играть вместе!']] }
    ],
    nl: [
      { title: ['Nein sagen', 'Dire di no'], steps: [['„niet“ steht am Ende: Ik weet het niet, Ik begrijp het niet.', '«niet» (non) va alla fine: Ik weet het niet, Ik begrijp het niet.']], example: { text: 'Ik begrijp het niet.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„Gefeliciteerd!“ = Herzlichen Glückwunsch! „Eet smakelijk!“ = Guten Appetit!', '«Gefeliciteerd!» = auguri! «Eet smakelijk!» = buon appetito!'], ['„Laten we …“ = Lass uns …: Laten we samen spelen!', '«Laten we …» = facciamo …: Laten we samen spelen!']] }
    ],
    el: [
      { title: ['Nein sagen', 'Dire di no'], steps: [['„Δεν“ steht vor dem Verb: Δεν ξέρω, Δεν καταλαβαίνω.', '«Δεν» va prima del verbo, come «non»: Δεν ξέρω, Δεν καταλαβαίνω.']], example: { text: 'Δεν καταλαβαίνω.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Feste Ausdrücke', 'Espressioni fisse'], steps: [['„Χρόνια πολλά!“ = „Viele Jahre!“ – zum Geburtstag und an Festtagen. „Καλή όρεξη!“ = Guten Appetit!', '«Χρόνια πολλά!» = «tanti anni!» – per il compleanno e le feste. «Καλή όρεξη!» = buon appetito!'], ['„Ας παίξουμε μαζί!“ = Lass uns zusammen spielen!', '«Ας παίξουμε μαζί!» = giochiamo insieme!']] }
    ]
  }
};
