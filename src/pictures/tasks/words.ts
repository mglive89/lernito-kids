/**
 * Wörter zu den Bildern in art/objects.tsx (Deutsch, Italienisch, Englisch).
 * Silben nach Schulregel getrennt. it.pl = null, wenn es keinen sinnvollen Plural gibt.
 */
export interface Word {
  name: string;
  de: { w: string; art: 'der' | 'die' | 'das'; pl: string; syl: string[] };
  it: { w: string; art: 'il' | 'lo' | 'la' | 'l’' | 'gli'; pl: string; syl: string[] };
  en: string;
}

const w = (name: string, de: string, art: Word['de']['art'], pl: string, it: string, iart: Word['it']['art'], ipl: string, en: string): Word => ({
  name,
  de: { w: de.replace(/-/g, ''), art, pl, syl: de.split('-') },
  it: { w: it.replace(/-/g, ''), art: iart, pl: ipl, syl: it.split('-') },
  en
});

export const WORDS: Word[] = [
  w('apfel', 'Ap-fel', 'der', 'Äpfel', 'me-la', 'la', 'mele', 'apple'),
  w('banane', 'Ba-na-ne', 'die', 'Bananen', 'ba-na-na', 'la', 'banane', 'banana'),
  w('haus', 'Haus', 'das', 'Häuser', 'ca-sa', 'la', 'case', 'house'),
  w('ball', 'Ball', 'der', 'Bälle', 'pal-la', 'la', 'palle', 'ball'),
  w('katze', 'Kat-ze', 'die', 'Katzen', 'gat-to', 'il', 'gatti', 'cat'),
  w('hund', 'Hund', 'der', 'Hunde', 'ca-ne', 'il', 'cani', 'dog'),
  w('fisch', 'Fisch', 'der', 'Fische', 'pe-sce', 'il', 'pesci', 'fish'),
  w('vogel', 'Vo-gel', 'der', 'Vögel', 'uc-cel-lo', 'l’', 'uccelli', 'bird'),
  w('sonne', 'Son-ne', 'die', 'Sonnen', 'so-le', 'il', 'soli', 'sun'),
  w('mond', 'Mond', 'der', 'Monde', 'lu-na', 'la', 'lune', 'moon'),
  w('stern', 'Stern', 'der', 'Sterne', 'stel-la', 'la', 'stelle', 'star'),
  w('baum', 'Baum', 'der', 'Bäume', 'al-be-ro', 'l’', 'alberi', 'tree'),
  w('blume', 'Blu-me', 'die', 'Blumen', 'fio-re', 'il', 'fiori', 'flower'),
  w('auto', 'Au-to', 'das', 'Autos', 'mac-chi-na', 'la', 'macchine', 'car'),
  w('fahrrad', 'Fahr-rad', 'das', 'Fahrräder', 'bi-ci-clet-ta', 'la', 'biciclette', 'bike'),
  w('buch', 'Buch', 'das', 'Bücher', 'li-bro', 'il', 'libri', 'book'),
  w('hut', 'Hut', 'der', 'Hüte', 'cap-pel-lo', 'il', 'cappelli', 'hat'),
  w('schluessel', 'Schlüs-sel', 'der', 'Schlüssel', 'chia-ve', 'la', 'chiavi', 'key'),
  w('tasse', 'Tas-se', 'die', 'Tassen', 'taz-za', 'la', 'tazze', 'cup'),
  w('stuhl', 'Stuhl', 'der', 'Stühle', 'se-dia', 'la', 'sedie', 'chair'),
  w('schirm', 'Re-gen-schirm', 'der', 'Regenschirme', 'om-brel-lo', 'l’', 'ombrelli', 'umbrella'),
  w('kuchen', 'Ku-chen', 'der', 'Kuchen', 'tor-ta', 'la', 'torte', 'cake'),
  w('schuh', 'Schuh', 'der', 'Schuhe', 'scar-pa', 'la', 'scarpe', 'shoe'),
  w('uhr', 'Uhr', 'die', 'Uhren', 'o-ro-lo-gio', 'l’', 'orologi', 'clock'),
  w('lampe', 'Lam-pe', 'die', 'Lampen', 'lam-pa-da', 'la', 'lampade', 'lamp'),
  w('tisch', 'Tisch', 'der', 'Tische', 'ta-vo-lo', 'il', 'tavoli', 'table'),
  w('boot', 'Boot', 'das', 'Boote', 'bar-ca', 'la', 'barche', 'boat'),
  w('zug', 'Zug', 'der', 'Züge', 'tre-no', 'il', 'treni', 'train'),
  w('schmetterling', 'Schmet-ter-ling', 'der', 'Schmetterlinge', 'far-fal-la', 'la', 'farfalle', 'butterfly'),
  w('frosch', 'Frosch', 'der', 'Frösche', 'ra-na', 'la', 'rane', 'frog'),
  w('biene', 'Bie-ne', 'die', 'Bienen', 'a-pe', 'l’', 'api', 'bee'),
  w('schnecke', 'Schne-cke', 'die', 'Schnecken', 'lu-ma-ca', 'la', 'lumache', 'snail'),
  w('spinne', 'Spin-ne', 'die', 'Spinnen', 'ra-gno', 'il', 'ragni', 'spider'),
  w('kuh', 'Kuh', 'die', 'Kühe', 'muc-ca', 'la', 'mucche', 'cow'),
  w('eidechse', 'Ei-dech-se', 'die', 'Eidechsen', 'lu-cer-to-la', 'la', 'lucertole', 'lizard'),
  w('wal', 'Wal', 'der', 'Wale', 'ba-le-na', 'la', 'balene', 'whale'),
  w('tomate', 'To-ma-te', 'die', 'Tomaten', 'po-mo-do-ro', 'il', 'pomodori', 'tomato'),
  w('kerze', 'Ker-ze', 'die', 'Kerzen', 'can-de-la', 'la', 'candele', 'candle'),
  w('hase', 'Ha-se', 'der', 'Hasen', 'co-ni-glio', 'il', 'conigli', 'rabbit'),
  w('fuchs', 'Fuchs', 'der', 'Füchse', 'vol-pe', 'la', 'volpi', 'fox'),
  w('brille', 'Bril-le', 'die', 'Brillen', 'oc-chia-li', 'gli', 'occhiali', 'glasses')
];

/** Wörter ohne Sonderfälle (für Artikel- und Pluralaufgaben) */
export const REGULAR = WORDS.filter((x) => x.name !== 'brille');
export const word = (name: string) => WORDS.find((x) => x.name === name)!;
