/**
 * Wortschatz der Sprachkurse (eigene Inhalte von Lernito).
 * Jede Zeile: Emoji | Englisch | Deutsch | Italienisch | Französisch | Spanisch.
 * Nomen mit Artikel (außer im Englischen), damit Kinder den Artikel gleich mitlernen.
 */
export type CourseLang = 'en' | 'de' | 'it' | 'fr' | 'es';
export const COURSE_LANGS: CourseLang[] = ['en', 'de', 'it', 'fr', 'es'];

export type Entry = { emoji: string } & Record<CourseLang, string>;

export interface Unit {
  id: string;
  emoji: string;
  color: 'sonne' | 'himmel' | 'minze' | 'koralle' | 'lila';
  title: { de: string; it: string };
  subtitle: { de: string; it: string };
  words: Entry[];
  sentences: Entry[];
}

const row = (s: string): Entry => {
  const [emoji, en, de, it, fr, es] = s.split('|').map((x) => x.trim());
  return { emoji: emoji!, en: en!, de: de!, it: it!, fr: fr!, es: es! };
};
const rows = (lines: string[]) => lines.map(row);

export const UNITS: Unit[] = [
  {
    id: 'saluti', emoji: '👋', color: 'sonne',
    title: { de: 'Hallo sagen', it: 'Salutare' },
    subtitle: { de: 'Begrüßen, danken, bitten', it: 'Salutare, ringraziare, chiedere' },
    words: rows([
      '👋 | Hello | Hallo | Ciao | Salut | Hola',
      '🌅 | Good morning | Guten Morgen | Buongiorno | Bonjour | Buenos días',
      '🌙 | Good night | Gute Nacht | Buonanotte | Bonne nuit | Buenas noches',
      '🚶 | Goodbye | Tschüss | Arrivederci | Au revoir | Adiós',
      '🙏 | Thank you | Danke | Grazie | Merci | Gracias',
      '🤲 | Please | Bitte | Per favore | S’il te plaît | Por favor',
      '✅ | Yes | Ja | Sì | Oui | Sí',
      '❌ | No | Nein | No | Non | No'
    ]),
    sentences: rows([
      '🙂 | How are you? | Wie geht es dir? | Come stai? | Comment ça va ? | ¿Cómo estás?',
      '😊 | I am fine, thank you. | Mir geht es gut, danke. | Sto bene, grazie. | Je vais bien, merci. | Estoy bien, gracias.',
      '🧒 | My name is Anna. | Ich heiße Anna. | Mi chiamo Anna. | Je m’appelle Anna. | Me llamo Anna.'
    ])
  },
  {
    id: 'numeri', emoji: '🔢', color: 'himmel',
    title: { de: 'Zahlen bis 10', it: 'Numeri fino a 10' },
    subtitle: { de: 'Zählen und Alter sagen', it: 'Contare e dire l’età' },
    words: rows([
      '1️⃣ | one | eins | uno | un | uno',
      '2️⃣ | two | zwei | due | deux | dos',
      '3️⃣ | three | drei | tre | trois | tres',
      '4️⃣ | four | vier | quattro | quatre | cuatro',
      '5️⃣ | five | fünf | cinque | cinq | cinco',
      '6️⃣ | six | sechs | sei | six | seis',
      '7️⃣ | seven | sieben | sette | sept | siete',
      '8️⃣ | eight | acht | otto | huit | ocho',
      '9️⃣ | nine | neun | nove | neuf | nueve',
      '🔟 | ten | zehn | dieci | dix | diez'
    ]),
    sentences: rows([
      '🎂 | I am seven years old. | Ich bin sieben Jahre alt. | Ho sette anni. | J’ai sept ans. | Tengo siete años.',
      '🐶 | I have two dogs. | Ich habe zwei Hunde. | Ho due cani. | J’ai deux chiens. | Tengo dos perros.',
      '🍎 | Three apples, please. | Drei Äpfel, bitte. | Tre mele, per favore. | Trois pommes, s’il te plaît. | Tres manzanas, por favor.'
    ])
  },
  {
    id: 'colori', emoji: '🎨', color: 'koralle',
    title: { de: 'Farben', it: 'Colori' },
    subtitle: { de: 'Die Welt ist bunt', it: 'Il mondo è colorato' },
    words: rows([
      '🔴 | red | rot | rosso | rouge | rojo',
      '🔵 | blue | blau | blu | bleu | azul',
      '🟢 | green | grün | verde | vert | verde',
      '🟡 | yellow | gelb | giallo | jaune | amarillo',
      '⚫ | black | schwarz | nero | noir | negro',
      '⚪ | white | weiß | bianco | blanc | blanco',
      '🟠 | orange | orange | arancione | orange | naranja',
      '🌸 | pink | rosa | rosa | rose | rosa'
    ]),
    sentences: rows([
      '🌤️ | The sky is blue. | Der Himmel ist blau. | Il cielo è blu. | Le ciel est bleu. | El cielo es azul.',
      '🍎 | The apple is red. | Der Apfel ist rot. | La mela è rossa. | La pomme est rouge. | La manzana es roja.',
      '💚 | My favourite colour is green. | Meine Lieblingsfarbe ist Grün. | Il mio colore preferito è il verde. | Ma couleur préférée est le vert. | Mi color favorito es el verde.'
    ])
  },
  {
    id: 'animali', emoji: '🐶', color: 'minze',
    title: { de: 'Tiere', it: 'Animali' },
    subtitle: { de: 'Haustiere und Bauernhof', it: 'Animali domestici e della fattoria' },
    words: rows([
      '🐶 | dog | der Hund | il cane | le chien | el perro',
      '🐱 | cat | die Katze | il gatto | le chat | el gato',
      '🐦 | bird | der Vogel | l’uccello | l’oiseau | el pájaro',
      '🐟 | fish | der Fisch | il pesce | le poisson | el pez',
      '🐴 | horse | das Pferd | il cavallo | le cheval | el caballo',
      '🐮 | cow | die Kuh | la mucca | la vache | la vaca',
      '🐰 | rabbit | das Kaninchen | il coniglio | le lapin | el conejo',
      '🐭 | mouse | die Maus | il topo | la souris | el ratón'
    ]),
    sentences: rows([
      '🐱 | I have a cat. | Ich habe eine Katze. | Ho un gatto. | J’ai un chat. | Tengo un gato.',
      '🐕 | The dog is big. | Der Hund ist groß. | Il cane è grande. | Le chien est grand. | El perro es grande.',
      '🕊️ | The bird can fly. | Der Vogel kann fliegen. | L’uccello sa volare. | L’oiseau peut voler. | El pájaro puede volar.'
    ])
  },
  {
    id: 'famiglia', emoji: '👨‍👩‍👧', color: 'lila',
    title: { de: 'Familie', it: 'Famiglia' },
    subtitle: { de: 'Mama, Papa und Geschwister', it: 'Mamma, papà, fratelli e sorelle' },
    words: rows([
      '👩 | mother | die Mutter | la mamma | la mère | la madre',
      '👨 | father | der Vater | il papà | le père | el padre',
      '👦 | brother | der Bruder | il fratello | le frère | el hermano',
      '👧 | sister | die Schwester | la sorella | la sœur | la hermana',
      '👵 | grandmother | die Oma | la nonna | la grand-mère | la abuela',
      '👴 | grandfather | der Opa | il nonno | le grand-père | el abuelo',
      '👶 | baby | das Baby | il neonato | le bébé | el bebé',
      '🏠 | family | die Familie | la famiglia | la famille | la familia'
    ]),
    sentences: rows([
      '👩 | This is my mother. | Das ist meine Mutter. | Questa è mia mamma. | C’est ma mère. | Esta es mi madre.',
      '👦 | I have a brother. | Ich habe einen Bruder. | Ho un fratello. | J’ai un frère. | Tengo un hermano.',
      '❤️ | I love my family. | Ich liebe meine Familie. | Voglio bene alla mia famiglia. | J’aime ma famille. | Quiero a mi familia.'
    ])
  },
  {
    id: 'cibo', emoji: '🍎', color: 'koralle',
    title: { de: 'Essen und Trinken', it: 'Cibo e bevande' },
    subtitle: { de: 'Frühstück, Obst und mehr', it: 'Colazione, frutta e altro' },
    words: rows([
      '🍎 | apple | der Apfel | la mela | la pomme | la manzana',
      '🍞 | bread | das Brot | il pane | le pain | el pan',
      '🥛 | milk | die Milch | il latte | le lait | la leche',
      '💧 | water | das Wasser | l’acqua | l’eau | el agua',
      '🧀 | cheese | der Käse | il formaggio | le fromage | el queso',
      '🍌 | banana | die Banane | la banana | la banane | el plátano',
      '🥚 | egg | das Ei | l’uovo | l’œuf | el huevo',
      '🍰 | cake | der Kuchen | la torta | le gâteau | el pastel'
    ]),
    sentences: rows([
      '😋 | I am hungry. | Ich habe Hunger. | Ho fame. | J’ai faim. | Tengo hambre.',
      '💧 | I would like water, please. | Ich möchte Wasser, bitte. | Vorrei dell’acqua, per favore. | Je voudrais de l’eau, s’il te plaît. | Quiero agua, por favor.',
      '🍏 | I like apples. | Ich mag Äpfel. | Mi piacciono le mele. | J’aime les pommes. | Me gustan las manzanas.'
    ])
  },
  {
    id: 'scuola', emoji: '🎒', color: 'himmel',
    title: { de: 'In der Schule', it: 'A scuola' },
    subtitle: { de: 'Schulsachen und Klassenzimmer', it: 'Materiale scolastico e classe' },
    words: rows([
      '📖 | book | das Buch | il libro | le livre | el libro',
      '🖊️ | pen | der Kuli | la penna | le stylo | el bolígrafo',
      '✏️ | pencil | der Bleistift | la matita | le crayon | el lápiz',
      '🎒 | schoolbag | die Schultasche | lo zaino | le cartable | la mochila',
      '🏫 | school | die Schule | la scuola | l’école | la escuela',
      '🧑‍🏫 | teacher | die Lehrerin | la maestra | la maîtresse | la maestra',
      '🪑 | chair | der Stuhl | la sedia | la chaise | la silla',
      '📏 | ruler | das Lineal | il righello | la règle | la regla'
    ]),
    sentences: rows([
      '🏫 | I go to school. | Ich gehe in die Schule. | Vado a scuola. | Je vais à l’école. | Voy a la escuela.',
      '📖 | Where is my book? | Wo ist mein Buch? | Dov’è il mio libro? | Où est mon livre ? | ¿Dónde está mi libro?',
      '✏️ | I have a red pencil. | Ich habe einen roten Bleistift. | Ho una matita rossa. | J’ai un crayon rouge. | Tengo un lápiz rojo.'
    ])
  },
  {
    id: 'frasi', emoji: '💬', color: 'minze',
    title: { de: 'Nützliche Sätze', it: 'Frasi utili' },
    subtitle: { de: 'Für den Alltag und im Urlaub', it: 'Per ogni giorno e in vacanza' },
    words: rows([
      '🙇 | Excuse me | Entschuldigung | Scusa | Pardon | Perdón',
      '🤷 | I don’t know. | Ich weiß nicht. | Non lo so. | Je ne sais pas. | No lo sé.',
      '🆘 | Help! | Hilfe! | Aiuto! | Au secours ! | ¡Ayuda!',
      '🎂 | Happy birthday! | Alles Gute zum Geburtstag! | Buon compleanno! | Joyeux anniversaire ! | ¡Feliz cumpleaños!',
      '🍽️ | Enjoy your meal! | Guten Appetit! | Buon appetito! | Bon appétit ! | ¡Buen provecho!',
      '🤝 | Nice to meet you. | Freut mich. | Piacere. | Enchanté. | Mucho gusto.',
      '👍 | Great! | Super! | Benissimo! | Génial ! | ¡Genial!',
      '🔁 | Can you repeat, please? | Kannst du das bitte wiederholen? | Puoi ripetere, per favore? | Tu peux répéter, s’il te plaît ? | ¿Puedes repetir, por favor?'
    ]),
    sentences: rows([
      '🚻 | Where is the bathroom? | Wo ist die Toilette? | Dov’è il bagno? | Où sont les toilettes ? | ¿Dónde está el baño?',
      '🤔 | I don’t understand. | Ich verstehe nicht. | Non capisco. | Je ne comprends pas. | No entiendo.',
      '⚽ | Let’s play together! | Lass uns zusammen spielen! | Giochiamo insieme! | Jouons ensemble ! | ¡Juguemos juntos!'
    ])
  }
];
