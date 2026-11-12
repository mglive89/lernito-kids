import type { Lang } from '../i18n';

/**
 * Wörter und Hinweise für das Kreuzworträtsel – je Sprache eigene Wörter (keine Übersetzungen nötig).
 * Regeln: nur Großbuchstaben ohne Leerzeichen; im Italienischen keine Akzente, im Deutschen kein ß (Ä, Ö, Ü sind erlaubt).
 * Stufe 1: Bilderrätsel für die Kleinsten, Stufe 2: Grundschule, Stufe 3: ab Mittelstufe.
 */
export interface ClueWord { word: string; clue: string; emoji?: string }
export type CrossLevel = 1 | 2 | 3;

const IT: Record<CrossLevel, ClueWord[]> = {
  1: [
    { word: 'CANE', clue: 'Fa bau bau', emoji: '🐶' }, { word: 'GATTO', clue: 'Fa miao', emoji: '🐱' },
    { word: 'SOLE', clue: 'Splende di giorno', emoji: '☀️' }, { word: 'MELA', clue: 'Frutto rosso o verde', emoji: '🍎' },
    { word: 'LUNA', clue: 'Brilla di notte', emoji: '🌙' }, { word: 'PANE', clue: 'Lo fa il fornaio', emoji: '🍞' },
    { word: 'MARE', clue: 'Acqua salata e onde', emoji: '🌊' }, { word: 'NAVE', clue: 'Va sul mare', emoji: '🚢' },
    { word: 'TOPO', clue: 'Piccolo e ama il formaggio', emoji: '🐭' }, { word: 'RANA', clue: 'Salta e fa cra cra', emoji: '🐸' },
    { word: 'CASA', clue: 'Ci abiti', emoji: '🏠' }, { word: 'FIORE', clue: 'Cresce nel prato e profuma', emoji: '🌸' },
    { word: 'LIBRO', clue: 'Ha tante pagine', emoji: '📖' }, { word: 'PESCE', clue: 'Nuota nell’acqua', emoji: '🐟' },
    { word: 'TRENO', clue: 'Corre sui binari', emoji: '🚂' }, { word: 'NASO', clue: 'Serve per annusare', emoji: '👃' },
    { word: 'MANO', clue: 'Ha cinque dita', emoji: '✋' }, { word: 'UOVO', clue: 'Lo fa la gallina', emoji: '🥚' },
    { word: 'ORSO', clue: 'Grande, peloso, ama il miele', emoji: '🐻' }, { word: 'LATTE', clue: 'Bevanda bianca', emoji: '🥛' },
    { word: 'PERA', clue: 'Frutto a forma di goccia', emoji: '🍐' }, { word: 'UVA', clue: 'Frutto a grappoli', emoji: '🍇' },
    { word: 'APE', clue: 'Fa il miele', emoji: '🐝' }, { word: 'ALBERO', clue: 'Ha tronco e foglie', emoji: '🌳' },
    { word: 'STELLA', clue: 'Brilla in cielo di notte', emoji: '⭐' }, { word: 'PALLA', clue: 'Rotonda, per giocare', emoji: '⚽' },
    { word: 'TORTA', clue: 'Si mangia alla festa', emoji: '🎂' }, { word: 'CUORE', clue: 'Batte nel petto', emoji: '❤️' },
    { word: 'AUTO', clue: 'Ha quattro ruote', emoji: '🚗' }, { word: 'ANATRA', clue: 'Fa qua qua', emoji: '🦆' }
  ],
  2: [
    { word: 'SCUOLA', clue: 'Ci vai per imparare' }, { word: 'ZAINO', clue: 'Lo porti sulle spalle con i libri' },
    { word: 'MATITA', clue: 'Serve per scrivere e disegnare' }, { word: 'GOMMA', clue: 'Cancella i segni della matita' },
    { word: 'QUADERNO', clue: 'Ci scrivi gli esercizi' }, { word: 'LAVAGNA', clue: 'La maestra ci scrive col gesso' },
    { word: 'SOMMA', clue: 'Il risultato dell’addizione' }, { word: 'PIANETA', clue: 'La Terra è un …' },
    { word: 'INVERNO', clue: 'La stagione della neve' }, { word: 'ESTATE', clue: 'La stagione più calda' },
    { word: 'AUTUNNO', clue: 'Cadono le foglie' }, { word: 'FARFALLA', clue: 'Prima era un bruco' },
    { word: 'MONTAGNA', clue: 'Molto alta, con la cima' }, { word: 'FIUME', clue: 'Acqua che scorre verso il mare' },
    { word: 'ISOLA', clue: 'Terra circondata dal mare' }, { word: 'OROLOGIO', clue: 'Segna le ore' },
    { word: 'CERCHIO', clue: 'Figura rotonda' }, { word: 'DIECI', clue: 'Cinque più cinque' },
    { word: 'VERDE', clue: 'Il colore dell’erba' }, { word: 'ROSSO', clue: 'Il colore della fragola' },
    { word: 'NUVOLA', clue: 'Bianca o grigia, porta la pioggia' }, { word: 'VOCALE', clue: 'A, E, I, O, U' },
    { word: 'DOPPIA', clue: 'Due lettere uguali vicine, come in “palla”' }, { word: 'CALENDARIO', clue: 'Mostra giorni e mesi' },
    { word: 'MAESTRA', clue: 'Insegna a scuola' }, { word: 'RIGHELLO', clue: 'Serve per tracciare linee dritte' }
  ],
  3: [
    { word: 'DIVISIONE', clue: 'Operazione inversa della moltiplicazione' }, { word: 'FRAZIONE', clue: 'Numeratore su denominatore' },
    { word: 'VULCANO', clue: 'Montagna che erutta lava' }, { word: 'CAPITALE', clue: 'Roma è la … d’Italia' },
    { word: 'OSSIGENO', clue: 'Gas che respiriamo' }, { word: 'EQUATORE', clue: 'Linea che divide la Terra in due emisferi' },
    { word: 'PERIMETRO', clue: 'Somma dei lati di una figura' }, { word: 'VERBO', clue: 'Indica un’azione o uno stato' },
    { word: 'AGGETTIVO', clue: 'Dice com’è un nome' }, { word: 'SOGGETTO', clue: 'Chi compie l’azione nella frase' },
    { word: 'CELLULA', clue: 'Unità più piccola degli esseri viventi' }, { word: 'CONTINENTE', clue: 'L’Europa è un …' },
    { word: 'ATOMO', clue: 'Particella della materia' }, { word: 'MOLECOLA', clue: 'Gruppo di atomi legati' },
    { word: 'TRIANGOLO', clue: 'Poligono con tre lati' }, { word: 'IPOTENUSA', clue: 'Il lato più lungo del triangolo rettangolo' },
    { word: 'DEMOCRAZIA', clue: 'Governo del popolo' }, { word: 'ROMANI', clue: 'Fondarono un impero con capitale Roma' },
    { word: 'ENERGIA', clue: 'Si misura in joule' }, { word: 'GRAVITA', clue: 'Forza che fa cadere gli oggetti' },
    { word: 'PARALLELE', clue: 'Rette che non si incontrano mai' }, { word: 'PROPORZIONE', clue: 'Uguaglianza tra due rapporti' },
    { word: 'ALGORITMO', clue: 'Sequenza di istruzioni per risolvere un problema' }, { word: 'COSTITUZIONE', clue: 'Legge fondamentale dello Stato' }
  ]
};

const DE: Record<CrossLevel, ClueWord[]> = {
  1: [
    { word: 'HUND', clue: 'Macht wau wau', emoji: '🐶' }, { word: 'KATZE', clue: 'Macht miau', emoji: '🐱' },
    { word: 'SONNE', clue: 'Scheint am Tag', emoji: '☀️' }, { word: 'APFEL', clue: 'Rotes oder grünes Obst', emoji: '🍎' },
    { word: 'MOND', clue: 'Leuchtet in der Nacht', emoji: '🌙' }, { word: 'BROT', clue: 'Backt der Bäcker', emoji: '🍞' },
    { word: 'MEER', clue: 'Salzwasser mit Wellen', emoji: '🌊' }, { word: 'MAUS', clue: 'Klein und mag Käse', emoji: '🐭' },
    { word: 'HAUS', clue: 'Darin wohnst du', emoji: '🏠' }, { word: 'BLUME', clue: 'Wächst auf der Wiese und duftet', emoji: '🌸' },
    { word: 'BUCH', clue: 'Hat viele Seiten', emoji: '📖' }, { word: 'FISCH', clue: 'Schwimmt im Wasser', emoji: '🐟' },
    { word: 'ZUG', clue: 'Fährt auf Schienen', emoji: '🚂' }, { word: 'NASE', clue: 'Damit riechst du', emoji: '👃' },
    { word: 'HAND', clue: 'Hat fünf Finger', emoji: '✋' }, { word: 'BAUM', clue: 'Hat Stamm und Blätter', emoji: '🌳' },
    { word: 'STERN', clue: 'Funkelt nachts am Himmel', emoji: '⭐' }, { word: 'BALL', clue: 'Rund, zum Spielen', emoji: '⚽' },
    { word: 'KUCHEN', clue: 'Gibt es beim Geburtstag', emoji: '🎂' }, { word: 'HERZ', clue: 'Schlägt in der Brust', emoji: '❤️' },
    { word: 'MILCH', clue: 'Weißes Getränk', emoji: '🥛' }, { word: 'BIRNE', clue: 'Obst in Tropfenform', emoji: '🍐' },
    { word: 'BIENE', clue: 'Macht Honig', emoji: '🐝' }, { word: 'AUTO', clue: 'Hat vier Räder', emoji: '🚗' },
    { word: 'ENTE', clue: 'Macht quak quak', emoji: '🦆' }, { word: 'FROSCH', clue: 'Hüpft und quakt am Teich', emoji: '🐸' },
    { word: 'BÄR', clue: 'Groß, pelzig, liebt Honig', emoji: '🐻' }, { word: 'WOLKE', clue: 'Weiß oder grau am Himmel', emoji: '☁️' },
    { word: 'SCHIFF', clue: 'Fährt über das Meer', emoji: '🚢' }, { word: 'TRAUBE', clue: 'Obst, das in Rispen wächst', emoji: '🍇' }
  ],
  2: [
    { word: 'SCHULE', clue: 'Dort lernst du' }, { word: 'RANZEN', clue: 'Trägst du mit Büchern auf dem Rücken' },
    { word: 'BLEISTIFT', clue: 'Damit schreibst und malst du' }, { word: 'RADIERGUMMI', clue: 'Entfernt Bleistiftstriche' },
    { word: 'HEFT', clue: 'Hier schreibst du die Aufgaben hinein' }, { word: 'TAFEL', clue: 'Darauf schreibt die Lehrerin mit Kreide' },
    { word: 'SUMME', clue: 'Ergebnis der Plusaufgabe' }, { word: 'PLANET', clue: 'Die Erde ist ein …' },
    { word: 'WINTER', clue: 'Jahreszeit mit Schnee' }, { word: 'SOMMER', clue: 'Die wärmste Jahreszeit' },
    { word: 'HERBST', clue: 'Die Blätter fallen' }, { word: 'FRÜHLING', clue: 'Die Blumen beginnen zu blühen' },
    { word: 'SCHMETTERLING', clue: 'War vorher eine Raupe' }, { word: 'BERG', clue: 'Sehr hoch, mit Gipfel' },
    { word: 'FLUSS', clue: 'Wasser, das ins Meer fließt' }, { word: 'INSEL', clue: 'Land mitten im Wasser' },
    { word: 'UHR', clue: 'Zeigt die Zeit' }, { word: 'KREIS', clue: 'Runde Form' },
    { word: 'ZEHN', clue: 'Fünf plus fünf' }, { word: 'GRÜN', clue: 'Die Farbe von Gras' },
    { word: 'DREIECK', clue: 'Form mit drei Ecken' }, { word: 'VOKAL', clue: 'A, E, I, O, U' },
    { word: 'KALENDER', clue: 'Zeigt Tage und Monate' }, { word: 'LINEAL', clue: 'Damit ziehst du gerade Linien' },
    { word: 'NOMEN', clue: 'Wort, das man großschreibt' }, { word: 'REGENBOGEN', clue: 'Bunter Bogen nach dem Regen' }
  ],
  3: [
    { word: 'DIVISION', clue: 'Umkehrung der Multiplikation' }, { word: 'BRUCH', clue: 'Zähler über Nenner' },
    { word: 'VULKAN', clue: 'Berg, aus dem Lava kommt' }, { word: 'HAUPTSTADT', clue: 'Berlin ist die … Deutschlands' },
    { word: 'SAUERSTOFF', clue: 'Gas, das wir einatmen' }, { word: 'ÄQUATOR', clue: 'Teilt die Erde in Nord- und Südhalbkugel' },
    { word: 'UMFANG', clue: 'Summe aller Seitenlängen' }, { word: 'VERB', clue: 'Tuwort' },
    { word: 'ADJEKTIV', clue: 'Wiewort' }, { word: 'SUBJEKT', clue: 'Wer oder was handelt im Satz' },
    { word: 'ZELLE', clue: 'Kleinste Einheit des Lebens' }, { word: 'KONTINENT', clue: 'Europa ist ein …' },
    { word: 'ATOM', clue: 'Winziger Baustein der Materie' }, { word: 'MOLEKÜL', clue: 'Verbundene Atome' },
    { word: 'HYPOTENUSE', clue: 'Längste Seite im rechtwinkligen Dreieck' }, { word: 'DEMOKRATIE', clue: 'Herrschaft des Volkes' },
    { word: 'RÖMER', clue: 'Volk mit Hauptstadt Rom' }, { word: 'ENERGIE', clue: 'Wird in Joule gemessen' },
    { word: 'SCHWERKRAFT', clue: 'Lässt Dinge zu Boden fallen' }, { word: 'PARALLELEN', clue: 'Geraden, die sich nie schneiden' },
    { word: 'FOTOSYNTHESE', clue: 'So machen Pflanzen aus Licht Zucker' }, { word: 'ALGORITHMUS', clue: 'Schrittfolge zur Lösung eines Problems' },
    { word: 'GRUNDGESETZ', clue: 'Verfassung Deutschlands' }, { word: 'PROZENT', clue: 'Hundertstel' }
  ]
};

export const CROSS_WORDS: Record<Lang, Record<CrossLevel, ClueWord[]>> = { de: DE, it: IT };

export function crossLevel(year: number): CrossLevel {
  if (year <= 2) return 1;
  if (year <= 6) return 2;
  return 3;
}

export const LETTERS: Record<Lang, string[]> = {
  it: 'QWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
  de: 'QWERTZUIOPÜASDFGHJKLÖÄYXCVBNM'.split('')
};
