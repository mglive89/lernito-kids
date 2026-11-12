import type { CourseLang } from './data';

/**
 * Theorie der Sprachkurse – erklärt in der Sprache des Kindes ([Deutsch, Italienisch]).
 * Italienisch-Kurse gibt es nur für deutschsprachige Kinder, Deutsch-Kurse nur für italienischsprachige:
 * dort genügt ein Text (one()).
 */
export type P = [string, string];
const one = (s: string): P => [s, s];

export interface Note {
  /** Überschrift */
  title: P;
  /** Erklärung Schritt für Schritt (Zeilen) */
  steps: P[];
  /** Beispiel in der Zielsprache mit Übersetzung */
  example?: { text: string; meaning: P };
}

/** Aussprache-Tipps je Sprache */
export const PRONUNCIATION: Record<CourseLang, { sound: string; tip: P }[]> = {
  en: [
    { sound: 'th', tip: ['Zungenspitze leicht zwischen die Zähne, dann pusten: the, thank you, three.', 'Punta della lingua tra i denti e soffia: the, thank you, three.'] },
    { sound: 'w', tip: ['Lippen rund wie bei „u“ und schnell öffnen: water, white – nicht wie deutsches „w“.', 'Labbra tonde come per una «u» e aprile subito: water, white.'] },
    { sound: 'e', tip: ['Ein „e“ am Wortende ist meist stumm: five, white, horse.', 'La «e» in fondo alla parola di solito è muta: five, white, horse.'] },
    { sound: 'h', tip: ['Das „h“ wird gehaucht: hello, horse, happy.', 'La «h» si pronuncia con un soffio: hello, horse, happy.'] },
    { sound: 'r', tip: ['Das „r“ ist weich, die Zunge berührt den Gaumen nicht: red, brother.', 'La «r» è morbida, la lingua non tocca il palato: red, brother.'] }
  ],
  de: [
    { sound: 'ei / ie', tip: one('«ei» si legge «ai» (eins, nein, Ei); «ie» si legge «i» lunga (sieben, die, Familie).') },
    { sound: 'sch', tip: one('«sch» si legge come «sc» di «scena»: Schule, Schwester, schwarz.') },
    { sound: 'ch', tip: one('Dopo a/o/u è un suono rauco in gola (acht, Buch); dopo e/i è un soffio leggero (ich, Milch).') },
    { sound: 'ä ö ü', tip: one('Le vocali con i due puntini (Umlaut): ä ≈ «è», ö = «e» con le labbra a «o», ü = «i» con le labbra a «u» (grün, fünf, Käse).') },
    { sound: 'z / w / ß', tip: one('«z» = «ts» (zehn, zwei); «w» = «v» (Wasser, weiß); «ß» = «ss» (weiß, groß).') },
    { sound: 'h', tip: one('All’inizio della parola la «h» si sente con un soffio: Hallo, Hund, Hunger.') }
  ],
  it: [
    { sound: 'c / ch', tip: one('„c“ vor e/i klingt wie „tsch“ (ciao, cinque, dieci); „ch“ klingt wie „k“ (che, chiamo).') },
    { sound: 'g / gn / gli', tip: one('„g“ vor e/i wie „dsch“ (giallo, Buongiorno); „gn“ wie „nj“ (Buongiorno); „gli“ wie „lj“ (gli).') },
    { sound: 'z', tip: one('„z“ klingt wie „ts“ oder „ds“: grazie, pizza, zaino.') },
    { sound: 'tt / ll', tip: one('Doppelte Konsonanten werden länger gesprochen: gatto, latte, sorella, Buonanotte.') },
    { sound: 'r', tip: one('Das „r“ wird mit der Zungenspitze gerollt: rosso, ripetere, fratello.') },
    { sound: 'h', tip: one('Das „h“ ist immer stumm: ho fame, che, chiamo.') }
  ],
  fr: [
    { sound: 'fin', tip: ['Endbuchstaben sind oft stumm: chat, trois, grand. „chiens“ klingt wie „chien“.', 'Le lettere finali spesso sono mute: chat, trois, grand. «chiens» suona come «chien».'] },
    { sound: 'ou / oi', tip: ['„ou“ = „u“ (rouge, vous); „oi“ = „ua“ (trois, oiseau, noir).', '«ou» = «u» (rouge, vous); «oi» = «ua» (trois, oiseau, noir).'] },
    { sound: 'un / on / an', tip: ['Nasale: Luft auch durch die Nase, das „n“ wird nicht gesprochen: un, bon, maman.', 'Vocali nasali: l’aria passa anche dal naso, la «n» non si sente: un, bon, maman.'] },
    { sound: 'u', tip: ['„u“ ist wie deutsches „ü“: tu, une, bienvenue.', 'La «u» si dice con le labbra a «u» ma pensando «i»: tu, une.'] },
    { sound: 'r', tip: ['Das „r“ entsteht hinten im Hals: rouge, merci, frère.', 'La «r» si fa in fondo alla gola: rouge, merci, frère.'] },
    { sound: 'h', tip: ['Das „h“ ist stumm: huit, hôtel.', 'La «h» è muta: huit.'] }
  ],
  es: [
    { sound: '¿ ¡', tip: ['Fragen und Ausrufe beginnen mit einem umgedrehten Zeichen: ¿Cómo estás? ¡Hola!', 'Domande ed esclamazioni iniziano con un segno capovolto: ¿Cómo estás? ¡Hola!'] },
    { sound: 'h', tip: ['Das „h“ ist stumm: hola, hermano, huevo.', 'La «h» è muta: hola, hermano, huevo.'] },
    { sound: 'j / ge / gi', tip: ['„j“ ist ein kratzendes „ch“ wie in „Bach“: rojo, hijo, naranja.', '«j» è un suono rauco in gola, come una «h» forte: rojo, naranja.'] },
    { sound: 'll / ñ', tip: ['„ll“ klingt wie „j“ (me llamo, silla); „ñ“ wie „nj“ (años, España).', '«ll» suona come «gli» o «i» (me llamo, silla); «ñ» come «gn» (años, España).'] },
    { sound: 'z / ce / ci', tip: ['In Spanien wie englisches „th“: diez, cinco, gracias.', 'In Spagna si pronuncia come la «th» inglese: diez, cinco, gracias.'] },
    { sound: 'v / b', tip: ['„v“ und „b“ klingen gleich, fast wie „b“: vaca, verde, bien.', '«v» e «b» suonano uguali, quasi come una «b»: vaca, verde.'] }
  ]
};

/** Grammatik und Besonderheiten je Einheit und Sprache */
export const NOTES: Record<string, Record<CourseLang, Note[]>> = {
  saluti: {
    en: [
      { title: ['Begrüßen und verabschieden', 'Salutare e congedarsi'], steps: [['„Hello“ passt immer. „Good morning“ sagst du bis zum Mittag.', '«Hello» va sempre bene. «Good morning» si dice fino a mezzogiorno.'], ['„Good night“ sagst du nur vor dem Schlafengehen.', '«Good night» si dice solo prima di andare a dormire.'], ['„Goodbye“ oder kurz „Bye“ heißt Tschüss.', '«Goodbye» o semplicemente «Bye» vuol dire ciao/arrivederci.']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['Frage: „How are you?“ – wörtlich „Wie bist du?“.', 'Domanda: «How are you?» – parola per parola «come sei tu?».'], ['Antwort: „I am fine, thank you.“ Kurz geht auch „I’m fine“ (I’m = I am).', 'Risposta: «I am fine, thank you.» Si può dire anche «I’m fine» (I’m = I am).'], ['„I“ (ich) schreibt man im Englischen immer groß.', '«I» (io) in inglese si scrive sempre maiuscolo.']], example: { text: 'How are you? – I am fine, thank you.', meaning: ['Wie geht es dir? – Mir geht es gut, danke.', 'Come stai? – Sto bene, grazie.'] } },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„My name is Anna.“ – wörtlich „Mein Name ist Anna“.', '«My name is Anna.» – parola per parola «il mio nome è Anna».'], ['Statt Anna setzt du deinen eigenen Namen ein.', 'Al posto di Anna metti il tuo nome.']] }
    ],
    de: [
      { title: one('Salutare in tedesco'), steps: [one('«Hallo» va sempre bene. «Guten Morgen» si dice la mattina, «Gute Nacht» prima di dormire.'), one('«Tschüss» è informale (con gli amici); con gli adulti si dice «Auf Wiedersehen».'), one('«Danke» = grazie, «Bitte» = per favore (e anche «prego»).')] },
      { title: one('Come stai?'), steps: [one('«Wie geht es dir?» – parola per parola «come va a te?».'), one('Risposta: «Mir geht es gut, danke.» = «a me va bene, grazie».'), one('In tedesco tutti i nomi si scrivono con la maiuscola, anche a metà frase.')], example: { text: 'Wie geht es dir? – Mir geht es gut, danke.', meaning: one('Come stai? – Sto bene, grazie.') } },
      { title: one('Presentarsi'), steps: [one('«Ich heiße Anna.» = Mi chiamo Anna.'), one('«ich» = io, «heiße» = mi chiamo (verbo «heißen»).')] }
    ],
    it: [
      { title: one('Begrüßen auf Italienisch'), steps: [one('„Ciao“ heißt Hallo UND Tschüss – unter Freunden.'), one('„Buongiorno“ sagst du tagsüber und zu Erwachsenen, „Buonanotte“ vor dem Schlafen.'), one('„Arrivederci“ ist das höfliche Auf Wiedersehen.')] },
      { title: one('Wie geht es dir?'), steps: [one('„Come stai?“ – wörtlich „Wie stehst du?“.'), one('Antwort: „Sto bene, grazie.“ = Mir geht es gut, danke.'), one('Im Italienischen lässt man „ich/du“ meist weg: „sto“ heißt schon „ich stehe/mir geht es“.')], example: { text: 'Come stai? – Sto bene, grazie.', meaning: one('Wie geht es dir? – Mir geht es gut, danke.') } },
      { title: one('Sich vorstellen'), steps: [one('„Mi chiamo Anna.“ – wörtlich „Ich nenne mich Anna“.'), one('„mi“ = mich, „chiamo“ = nenne.')] }
    ],
    fr: [
      { title: ['Begrüßen auf Französisch', 'Salutare in francese'], steps: [['„Bonjour“ ist höflich und passt tagsüber immer. „Salut“ sagst du unter Freunden.', '«Bonjour» è gentile e va bene tutto il giorno. «Salut» si dice tra amici.'], ['„Au revoir“ = Auf Wiedersehen, „Bonne nuit“ = Gute Nacht.', '«Au revoir» = arrivederci, «Bonne nuit» = buonanotte.'], ['„Merci“ = danke, „S’il te plaît“ = bitte.', '«Merci» = grazie, «S’il te plaît» = per favore.']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„Comment ça va ?“ – wörtlich „Wie geht das?“.', '«Comment ça va ?» – parola per parola «come va questo?».'], ['Antwort: „Je vais bien, merci.“', 'Risposta: «Je vais bien, merci.»'], ['Vor ? und ! steht im Französischen ein Leerzeichen.', 'In francese prima di ? e ! si mette uno spazio.']] },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„Je m’appelle Anna.“ = Ich heiße Anna.', '«Je m’appelle Anna.» = Mi chiamo Anna.'], ['Aus „me appelle“ wird „m’appelle“: Vor einem Vokal fällt das „e“ weg (Apostroph).', '«me appelle» diventa «m’appelle»: davanti a vocale la «e» cade (apostrofo), come in italiano.']] }
    ],
    es: [
      { title: ['Begrüßen auf Spanisch', 'Salutare in spagnolo'], steps: [['„Hola“ = Hallo (das h ist stumm). „Adiós“ = Tschüss.', '«Hola» = ciao (la h è muta). «Adiós» = arrivederci.'], ['„Buenos días“ am Morgen, „Buenas noches“ am Abend und zur Nacht.', '«Buenos días» la mattina, «Buenas noches» la sera e la notte.'], ['„Gracias“ = danke, „Por favor“ = bitte.', '«Gracias» = grazie, «Por favor» = per favore.']] },
      { title: ['Wie geht es dir?', 'Come stai?'], steps: [['„¿Cómo estás?“ – Fragen beginnen mit ¿ und enden mit ?.', '«¿Cómo estás?» – le domande iniziano con ¿ e finiscono con ?.'], ['Antwort: „Estoy bien, gracias.“', 'Risposta: «Estoy bien, gracias.»']] },
      { title: ['Sich vorstellen', 'Presentarsi'], steps: [['„Me llamo Anna.“ – wie im Italienischen: „ich nenne mich Anna“.', '«Me llamo Anna.» – proprio come in italiano «mi chiamo Anna».']] }
    ]
  },
  numeri: {
    en: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['Lerne sie in Paaren: one–two, three–four, five–six …', 'Imparali a coppie: one–two, three–four, five–six…'], ['Achtung bei „three“ (th!) und „eight“ (gesprochen „eit“).', 'Attenzione a «three» (th!) e «eight» (si dice «eit»).']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['Englisch benutzt „sein“: „I am seven years old.“ – wörtlich „ich bin sieben Jahre alt“.', 'L’inglese usa «essere»: «I am seven years old.» – parola per parola «sono sette anni vecchio».'], ['Nicht „I have seven years“ sagen – das ist ein typischer Fehler.', 'Non dire «I have seven years»: è un errore tipico degli italiani.']], example: { text: 'I am seven years old.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } },
      { title: ['Mehrzahl', 'Il plurale'], steps: [['Meist hängst du ein -s an: dog → dogs, apple → apples.', 'Di solito si aggiunge -s: dog → dogs, apple → apples.']], example: { text: 'I have two dogs.', meaning: ['Ich habe zwei Hunde.', 'Ho due cani.'] } }
    ],
    de: [
      { title: one('Numeri da 1 a 10'), steps: [one('Quando conti si dice «eins»; davanti a un nome diventa «ein/eine»: ein Hund, eine Katze.'), one('«zwei», «drei»: la «ei» si legge «ai». «sieben»: la «ie» si legge «i».')] },
      { title: one('Quanti anni hai?'), steps: [one('In tedesco si usa «essere»: «Ich bin sieben Jahre alt.» = «sono sette anni vecchio».'), one('Non «Ich habe sieben Jahre»: è l’errore tipico.')], example: { text: 'Ich bin sieben Jahre alt.', meaning: one('Ho sette anni.') } },
      { title: one('Il plurale'), steps: [one('Il plurale cambia: Hund → Hunde, Apfel → Äpfel (compare l’Umlaut).'), one('Imparalo insieme al nome: der Hund, die Hunde.')] }
    ],
    it: [
      { title: one('Zahlen von 1 bis 10'), steps: [one('„uno“ wird vor Nomen zu „un/una“: un gatto, una mela.'), one('„cinque“ und „dieci“: „c“ vor e/i spricht man „tsch“.')] },
      { title: one('Wie alt bist du?'), steps: [one('Italienisch benutzt „haben“: „Ho sette anni.“ = wörtlich „ich habe sieben Jahre“.'), one('„Ho“ = ich habe – das h ist stumm.')], example: { text: 'Ho sette anni.', meaning: one('Ich bin sieben Jahre alt.') } },
      { title: one('Mehrzahl'), steps: [one('-o wird zu -i (gatto → gatti), -a zu -e (mela → mele), -e zu -i (cane → cani).')], example: { text: 'Ho due cani.', meaning: one('Ich habe zwei Hunde.') } }
    ],
    fr: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['Viele Endbuchstaben sind stumm: deux, trois, huit (fast „üit“).', 'Molte lettere finali sono mute: deux, trois, huit.'], ['„un“ ist auch der Artikel „ein“: un chien.', '«un» è anche l’articolo: un chien.']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['Wie im Italienischen mit „haben“: „J’ai sept ans.“', 'Come in italiano con «avere»: «J’ai sept ans.»'], ['„J’ai“ = je + ai (ich habe).', '«J’ai» = je + ai (io ho).']], example: { text: 'J’ai sept ans.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } },
      { title: ['Mehrzahl', 'Il plurale'], steps: [['Man hängt -s an, hört es aber nicht: chien → chiens.', 'Si aggiunge -s ma non si sente: chien → chiens.']] }
    ],
    es: [
      { title: ['Zahlen von 1 bis 10', 'Numeri da 1 a 10'], steps: [['„uno“ wird vor männlichen Nomen zu „un“: un gato.', '«uno» davanti a un nome maschile diventa «un»: un gato.'], ['„diez“ und „cinco“: z und c (vor e/i) klingen in Spanien wie englisches „th“.', '«diez» e «cinco»: z e c (davanti a e/i) in Spagna suonano come «th» inglese.']] },
      { title: ['Wie alt bist du?', 'Quanti anni hai?'], steps: [['Spanisch benutzt „tener“ (haben): „Tengo siete años.“', 'Lo spagnolo usa «tener» (avere): «Tengo siete años.»']], example: { text: 'Tengo siete años.', meaning: ['Ich bin sieben Jahre alt.', 'Ho sette anni.'] } },
      { title: ['Mehrzahl', 'Il plurale'], steps: [['-s nach Vokal (perro → perros), -es nach Konsonant (color → colores).', '-s dopo vocale (perro → perros), -es dopo consonante (color → colores).']] }
    ]
  },
  colori: {
    en: [
      { title: ['Farben beschreiben', 'Descrivere i colori'], steps: [['Die Farbe steht VOR dem Nomen: a red apple, a blue car.', 'Il colore sta PRIMA del nome: a red apple (una mela rossa).'], ['Farben ändern sich nie: red apple, red apples.', 'I colori non cambiano mai: red apple, red apples.'], ['Mit „is“: „The sky is blue.“', 'Con «is»: «The sky is blue.»']], example: { text: 'The apple is red.', meaning: ['Der Apfel ist rot.', 'La mela è rossa.'] } },
      { title: ['Lieblingsfarbe', 'Il colore preferito'], steps: [['„My favourite colour is green.“ – favourite = Lieblings-.', '«My favourite colour is green.» – favourite = preferito.']] }
    ],
    de: [
      { title: one('Descrivere i colori'), steps: [one('Dopo «ist» il colore non cambia: Der Apfel ist rot. Der Himmel ist blau.'), one('Davanti al nome prende una desinenza: ein roter Apfel, einen roten Bleistift.'), one('Se il colore è un nome si scrive maiuscolo: Meine Lieblingsfarbe ist Grün.')], example: { text: 'Der Himmel ist blau.', meaning: one('Il cielo è blu.') } }
    ],
    it: [
      { title: one('Farben beschreiben'), steps: [one('Die Farbe steht NACH dem Nomen: la mela rossa, il cielo blu.'), one('Sie passt sich an: rosso (m) – rossa (f) – rossi – rosse. „blu“ und „rosa“ bleiben immer gleich.'), one('„è“ mit Akzent heißt „ist“; „e“ ohne Akzent heißt „und“.')], example: { text: 'La mela è rossa.', meaning: one('Der Apfel ist rot.') } }
    ],
    fr: [
      { title: ['Farben beschreiben', 'Descrivere i colori'], steps: [['Die Farbe steht NACH dem Nomen: la pomme rouge.', 'Il colore sta DOPO il nome, come in italiano: la pomme rouge.'], ['Weiblich bekommt oft ein -e: vert → verte, noir → noire.', 'Al femminile spesso si aggiunge -e: vert → verte.']], example: { text: 'Le ciel est bleu.', meaning: ['Der Himmel ist blau.', 'Il cielo è blu.'] } }
    ],
    es: [
      { title: ['Farben beschreiben', 'Descrivere i colori'], steps: [['Die Farbe steht NACH dem Nomen und passt sich an: la manzana roja (rojo → roja).', 'Il colore sta DOPO il nome e si accorda: la manzana roja (rojo → roja).'], ['„verde“ und „azul“ bleiben bei männlich und weiblich gleich.', '«verde» e «azul» sono uguali al maschile e al femminile.']], example: { text: 'El cielo es azul.', meaning: ['Der Himmel ist blau.', 'Il cielo è blu.'] } }
    ]
  },
  animali: {
    en: [
      { title: ['„the“ und „a“', '«the» e «a»'], steps: [['Englisch hat nur einen Artikel: „the“ für alles (der, die, das).', 'L’inglese ha un solo articolo determinativo: «the» per tutto (il, la, lo).'], ['„a“ = ein/eine; vor einem Vokal-Laut „an“: a cat, an apple.', '«a» = un/una; davanti a una vocale «an»: a cat, an apple.']] },
      { title: ['„can“ = können', '«can» = potere / sapere'], steps: [['Nach „can“ kommt das Verb ohne „to“: The bird can fly.', 'Dopo «can» il verbo va senza «to»: The bird can fly.']], example: { text: 'The bird can fly.', meaning: ['Der Vogel kann fliegen.', 'L’uccello sa volare.'] } }
    ],
    de: [
      { title: one('Tre generi: der, die, das'), steps: [one('Il tedesco ha tre articoli: der (maschile), die (femminile), das (neutro).'), one('Il genere spesso è diverso dall’italiano: das Pferd (il cavallo) è neutro, die Maus (il topo) è femminile.'), one('Trucco: impara sempre il nome con l’articolo e con un colore: der = blu, die = rosso, das = verde.')] },
      { title: one('«eine Katze», «einen Bruder»'), steps: [one('«un/una» = ein (der/das) oppure eine (die).'), one('Dopo «Ich habe…» il maschile diventa «einen»: Ich habe einen Hund. Femminile e neutro non cambiano: eine Katze, ein Pferd.')], example: { text: 'Ich habe eine Katze.', meaning: one('Ho un gatto.') } }
    ],
    it: [
      { title: one('Zwei Geschlechter'), steps: [one('Italienisch hat männlich (il, lo, l’) und weiblich (la, l’). Ein „das“ gibt es nicht.'), one('„l’“ steht vor Vokal: l’uccello (der Vogel), l’acqua (das Wasser).'), one('Tipp: Wörter auf -o sind meist männlich (il gatto), auf -a meist weiblich (la mucca).')] },
      { title: one('„un“ und „una“'), steps: [one('ein = un (männlich), eine = una (weiblich): un gatto, una mucca.'), one('„Ho un gatto.“ = Ich habe eine Katze. Achtung: „il gatto“ ist männlich!')], example: { text: 'Il cane è grande.', meaning: one('Der Hund ist groß.') } }
    ],
    fr: [
      { title: ['le, la, l’', 'le, la, l’'], steps: [['Männlich „le“ (le chien), weiblich „la“ (la vache), vor Vokal „l’“ (l’oiseau).', 'Maschile «le» (le chien), femminile «la» (la vache), davanti a vocale «l’» (l’oiseau).'], ['ein/eine = un/une.', 'un/una = un/une.']] },
      { title: ['Adjektive passen sich an', 'Gli aggettivi si accordano'], steps: [['Le chien est grand. – La vache est grande (weiblich +e).', 'Le chien est grand. – La vache est grande (femminile +e).']], example: { text: 'L’oiseau peut voler.', meaning: ['Der Vogel kann fliegen.', 'L’uccello sa volare.'] } }
    ],
    es: [
      { title: ['el und la', 'el e la'], steps: [['Männlich „el“ (el perro), weiblich „la“ (la vaca).', 'Maschile «el» (el perro), femminile «la» (la vaca).'], ['ein/eine = un/una: un gato, una vaca.', 'un/una come in italiano: un gato, una vaca.']] },
      { title: ['„puede“ = kann', '«puede» = può'], steps: [['„El pájaro puede volar.“ – nach „puede“ das Verb in der Grundform.', '«El pájaro puede volar.» – dopo «puede» il verbo all’infinito.']], example: { text: 'Tengo un gato.', meaning: ['Ich habe eine Katze.', 'Ho un gatto.'] } }
    ]
  },
  famiglia: {
    en: [
      { title: ['„my“ = mein/meine', '«my» = mio/mia'], steps: [['„my“ bleibt immer gleich: my mother, my father, my brothers.', '«my» non cambia mai e non vuole l’articolo: my mother, my father.'], ['„This is …“ = Das ist …', '«This is…» = Questo è / Questa è…']], example: { text: 'This is my mother.', meaning: ['Das ist meine Mutter.', 'Questa è mia mamma.'] } },
      { title: ['„I have a brother“', '«I have a brother»'], steps: [['„I have“ = ich habe. Danach „a“ für ein/eine.', '«I have» = io ho. Poi «a» per un/una.']] }
    ],
    de: [
      { title: one('mein e meine'), steps: [one('«mio/mia» cambia con il genere: mein Vater (der), meine Mutter (die), mein Baby (das).'), one('«Das ist…» vale sia per «questo è» sia per «questa è».')], example: { text: 'Das ist meine Mutter.', meaning: one('Questa è mia mamma.') } },
      { title: one('Ich habe einen Bruder'), steps: [one('Dopo «Ich habe» il maschile «ein» diventa «einen»: einen Bruder. Femminile resta «eine»: eine Schwester.')] }
    ],
    it: [
      { title: one('mio, mia'), steps: [one('Das Possessiv passt sich an: mio fratello (m), mia sorella (f).'), one('Bei Familienmitgliedern im Singular OHNE Artikel: mia mamma, mio papà. Sonst mit Artikel: il mio libro.'), one('„Questa è …“ für weiblich, „Questo è …“ für männlich.')], example: { text: 'Questa è mia mamma.', meaning: one('Das ist meine Mutter.') } },
      { title: one('„Voglio bene“'), steps: [one('Zur Familie sagt man „Voglio bene a …“ (ich hab … lieb); „Ti amo“ sagt man nur zum Partner.')] }
    ],
    fr: [
      { title: ['mon, ma, mes', 'mon, ma, mes'], steps: [['mon père (m), ma mère (f), mes parents (Mehrzahl).', 'mon père (m), ma mère (f), mes parents (plurale).'], ['„C’est …“ = Das ist … (ce + est).', '«C’est…» = Questo/questa è… (ce + est).']], example: { text: 'C’est ma mère.', meaning: ['Das ist meine Mutter.', 'Questa è mia madre.'] } }
    ],
    es: [
      { title: ['mi und mis', 'mi e mis'], steps: [['„mi“ bleibt bei männlich und weiblich gleich: mi padre, mi madre; Mehrzahl „mis“.', '«mi» è uguale al maschile e al femminile: mi padre, mi madre; plurale «mis».'], ['„Esta es …“ (weiblich), „Este es …“ (männlich).', '«Esta es…» (femminile), «Este es…» (maschile).']], example: { text: 'Esta es mi madre.', meaning: ['Das ist meine Mutter.', 'Questa è mia madre.'] } }
    ]
  },
  cibo: {
    en: [
      { title: ['Hunger haben', 'Avere fame'], steps: [['Englisch sagt „sein“: „I am hungry.“ (ich bin hungrig).', 'L’inglese usa «essere»: «I am hungry.» (sono affamato), non «I have hunger».']] },
      { title: ['Höflich bestellen', 'Chiedere con gentilezza'], steps: [['„I would like …, please.“ = Ich möchte …, bitte.', '«I would like…, please.» = Vorrei…, per favore.']], example: { text: 'I would like water, please.', meaning: ['Ich möchte Wasser, bitte.', 'Vorrei dell’acqua, per favore.'] } },
      { title: ['Mögen', 'Piacere'], steps: [['„I like apples.“ – im Allgemeinen ohne „the“ und in der Mehrzahl.', '«I like apples.» – in generale senza «the» e al plurale. Attenzione: «I like» = «a me piace».']] }
    ],
    de: [
      { title: one('Avere fame'), steps: [one('Come in italiano: «Ich habe Hunger.» = Ho fame.')] },
      { title: one('Chiedere con gentilezza'), steps: [one('«Ich möchte …, bitte.» = Vorrei…, per favore.'), one('In tedesco non serve «del/della»: Ich möchte Wasser.')], example: { text: 'Ich möchte Wasser, bitte.', meaning: one('Vorrei dell’acqua, per favore.') } },
      { title: one('Piacere'), steps: [one('«Ich mag Äpfel.» = Mi piacciono le mele. In tedesco la persona fa l’azione: «io amo-volentieri le mele».')] }
    ],
    it: [
      { title: one('Hunger haben'), steps: [one('Wie im Deutschen: „Ho fame.“ = Ich habe Hunger.')] },
      { title: one('Höflich bestellen'), steps: [one('„Vorrei …, per favore.“ = Ich möchte …, bitte.'), one('„dell’acqua“ = etwas Wasser (Teilungsartikel): del pane, dell’acqua, della torta.')], example: { text: 'Vorrei dell’acqua, per favore.', meaning: one('Ich möchte Wasser, bitte.') } },
      { title: one('„Mi piace“ / „Mi piacciono“'), steps: [one('Wörtlich „mir gefällt“: Die Sache ist das Subjekt.'), one('Eine Sache: „Mi piace la pizza.“ Mehrere: „Mi piacciono le mele.“')] }
    ],
    fr: [
      { title: ['Hunger haben', 'Avere fame'], steps: [['„J’ai faim.“ – mit „avoir“ (haben), wie im Italienischen.', '«J’ai faim.» – con «avoir» (avere), come in italiano.']] },
      { title: ['Bestellen', 'Ordinare'], steps: [['„Je voudrais …“ = Ich möchte … ; „de l’eau“ = etwas Wasser.', '«Je voudrais…» = Vorrei… ; «de l’eau» = dell’acqua.']], example: { text: 'Je voudrais de l’eau, s’il te plaît.', meaning: ['Ich möchte Wasser, bitte.', 'Vorrei dell’acqua, per favore.'] } },
      { title: ['Mögen', 'Piacere'], steps: [['„J’aime les pommes.“ – im Allgemeinen MIT Artikel „les“.', '«J’aime les pommes.» – in generale CON l’articolo «les».']] }
    ],
    es: [
      { title: ['Hunger haben', 'Avere fame'], steps: [['„Tengo hambre.“ – mit „tener“ (haben).', '«Tengo hambre.» – con «tener» (avere).']] },
      { title: ['Mögen', 'Piacere'], steps: [['„Me gusta“ funktioniert wie italienisch „mi piace“: „Me gustan las manzanas.“ (Mehrzahl → gustan).', '«Me gusta» funziona come «mi piace»: «Me gustan las manzanas.»']], example: { text: 'Me gustan las manzanas.', meaning: ['Ich mag Äpfel.', 'Mi piacciono le mele.'] } },
      { title: ['Bestellen', 'Ordinare'], steps: [['„Quiero agua, por favor.“ – „quiero“ = ich will/möchte.', '«Quiero agua, por favor.» – «quiero» = voglio/vorrei.']] }
    ]
  },
  scuola: {
    en: [
      { title: ['In die Schule gehen', 'Andare a scuola'], steps: [['„I go to school.“ – ohne „the“ vor school.', '«I go to school.» – senza «the» prima di school.']] },
      { title: ['Fragen mit „Where“', 'Domande con «Where»'], steps: [['Das Fragewort steht vorne: Where is my book?', 'La parola interrogativa va all’inizio: Where is my book?']], example: { text: 'Where is my book?', meaning: ['Wo ist mein Buch?', 'Dov’è il mio libro?'] } },
      { title: ['Farbe vor dem Nomen', 'Colore prima del nome'], steps: [['„a red pencil“ – erst die Farbe, dann das Ding.', '«a red pencil» – prima il colore, poi la cosa (al contrario dell’italiano).']] }
    ],
    de: [
      { title: one('Andare a scuola'), steps: [one('«Ich gehe in die Schule.» = Vado a scuola. In tedesco si usa l’articolo: «in die Schule».')] },
      { title: one('Domande con W'), steps: [one('Le parole interrogative iniziano con W: Wo (dove), Wie (come), Was (che cosa).'), one('Il verbo viene subito dopo: «Wo ist mein Buch?»')], example: { text: 'Wo ist mein Buch?', meaning: one('Dov’è il mio libro?') } },
      { title: one('Il colore davanti al nome'), steps: [one('«einen roten Bleistift»: il colore va prima del nome e prende la desinenza -en dopo «einen».')] }
    ],
    it: [
      { title: one('In die Schule gehen'), steps: [one('„Vado a scuola.“ – ohne Artikel. „vado“ = ich gehe.')] },
      { title: one('Fragen mit „Dove“'), steps: [one('„Dov’è …?“ = „Dove è …?“ – das „e“ fällt weg.'), one('„il mio libro“: Bei Dingen steht der Artikel vor dem Possessiv.')], example: { text: 'Dov’è il mio libro?', meaning: one('Wo ist mein Buch?') } },
      { title: one('Farbe nach dem Nomen'), steps: [one('„una matita rossa“ – erst das Ding, dann die Farbe. matita ist weiblich → rossa.')] }
    ],
    fr: [
      { title: ['Zur Schule', 'A scuola'], steps: [['„Je vais à l’école.“ – „à“ = zu/nach; „l’“ weil école mit Vokal beginnt.', '«Je vais à l’école.» – «à» = a; «l’» perché école inizia con vocale.']] },
      { title: ['Fragen mit „Où“', 'Domande con «Où»'], steps: [['„Où est mon livre ?“ – où = wo (mit Akzent!), ou = oder.', '«Où est mon livre ?» – où = dove (con accento!), ou = o/oppure.']] },
      { title: ['Farbe nach dem Nomen', 'Colore dopo il nome'], steps: [['„un crayon rouge“ – wie im Italienischen.', '«un crayon rouge» – come in italiano.']] }
    ],
    es: [
      { title: ['Zur Schule', 'A scuola'], steps: [['„Voy a la escuela.“ – „voy“ = ich gehe.', '«Voy a la escuela.» – «voy» = vado.']] },
      { title: ['Wo ist …?', 'Dov’è…?'], steps: [['„¿Dónde está …?“ – für Orte benutzt man „estar“.', '«¿Dónde está…?» – per i luoghi si usa «estar».']], example: { text: '¿Dónde está mi libro?', meaning: ['Wo ist mein Buch?', 'Dov’è il mio libro?'] } },
      { title: ['Farbe nach dem Nomen', 'Colore dopo il nome'], steps: [['„un lápiz rojo“ – Farbe danach, männlich → rojo.', '«un lápiz rojo» – colore dopo il nome, maschile → rojo.']] }
    ]
  },
  frasi: {
    en: [
      { title: ['Verneinen mit „don’t“', 'Negare con «don’t»'], steps: [['„I don’t know.“ – don’t = do not, kommt vor das Verb.', '«I don’t know.» – don’t = do not, va prima del verbo.'], ['„I don’t understand.“ = Ich verstehe nicht.', '«I don’t understand.» = Non capisco.']] },
      { title: ['Nett fragen', 'Chiedere con gentilezza'], steps: [['„Excuse me“ sagst du, um jemanden anzusprechen.', '«Excuse me» si dice per chiamare l’attenzione di qualcuno.'], ['„Can you repeat, please?“ = Kannst du das wiederholen, bitte?', '«Can you repeat, please?» = Puoi ripetere, per favore?']] },
      { title: ['Zusammen spielen', 'Giocare insieme'], steps: [['„Let’s play together!“ – „Let’s“ = lass uns.', '«Let’s play together!» – «Let’s…» = facciamo…!']] }
    ],
    de: [
      { title: one('La negazione con «nicht»'), steps: [one('«nicht» va DOPO il verbo: Ich weiß nicht. Ich verstehe nicht.'), one('In italiano «non» va prima: non so, non capisco.')], example: { text: 'Ich verstehe nicht.', meaning: one('Non capisco.') } },
      { title: one('Frasi gentili'), steps: [one('«Entschuldigung» = scusa / mi scusi.'), one('«Kannst du das bitte wiederholen?» = Puoi ripetere, per favore?')] },
      { title: one('Facciamo insieme'), steps: [one('«Lass uns zusammen spielen!» = Giochiamo insieme! («lass uns» = lasciaci).')] }
    ],
    it: [
      { title: one('Verneinung mit „non“'), steps: [one('„non“ steht VOR dem Verb: Non capisco. Non lo so.'), one('Im Deutschen steht „nicht“ danach – im Italienischen davor.')], example: { text: 'Non capisco.', meaning: one('Ich verstehe nicht.') } },
      { title: one('Höflich sein'), steps: [one('„Scusa“ zu Freunden, „Scusi“ zu Erwachsenen.'), one('„Puoi ripetere, per favore?“ = Kannst du das bitte wiederholen?')] },
      { title: one('Lass uns …'), steps: [one('„Giochiamo insieme!“ – die wir-Form (-iamo) heißt auch „lass uns …“.')] }
    ],
    fr: [
      { title: ['Verneinen mit „ne … pas“', 'Negare con «ne … pas»'], steps: [['Das Verb steht in der Mitte: Je ne comprends pas. Je ne sais pas.', 'Il verbo sta in mezzo: Je ne comprends pas. Je ne sais pas.']], example: { text: 'Je ne comprends pas.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Höflich sein', 'Essere gentili'], steps: [['„Pardon“ = Entschuldigung; „Tu peux répéter, s’il te plaît ?“', '«Pardon» = scusa; «Tu peux répéter, s’il te plaît ?»']] }
    ],
    es: [
      { title: ['Verneinen mit „no“', 'Negare con «no»'], steps: [['„no“ steht vor dem Verb, wie im Italienischen: No entiendo. No lo sé.', '«no» va prima del verbo, come in italiano: No entiendo. No lo sé.']], example: { text: 'No entiendo.', meaning: ['Ich verstehe nicht.', 'Non capisco.'] } },
      { title: ['Höflich sein', 'Essere gentili'], steps: [['„Perdón“ = Entschuldigung; „¿Puedes repetir, por favor?“', '«Perdón» = scusa; «¿Puedes repetir, por favor?»']] },
      { title: ['Lass uns …', 'Facciamo…'], steps: [['„¡Juguemos juntos!“ = Lass uns zusammen spielen!', '«¡Juguemos juntos!» = Giochiamo insieme!']] }
    ]
  }
};

/** Artikel am Wortanfang → Geschlecht (für die Wortliste) */
export function genderOf(word: string, lang: CourseLang): 'm' | 'f' | 'n' | null {
  const first = word.split(/\s+/)[0]!.toLowerCase();
  const map: Partial<Record<CourseLang, Record<string, 'm' | 'f' | 'n'>>> = {
    de: { der: 'm', die: 'f', das: 'n' },
    it: { il: 'm', lo: 'm', la: 'f' },
    fr: { le: 'm', la: 'f' },
    es: { el: 'm', la: 'f' }
  };
  if (word.split(/\s+/).length < 2) return null;
  return map[lang]?.[first] ?? null;
}
