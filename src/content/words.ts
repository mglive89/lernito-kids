/** Eigene, eingebettete Beispielinhalte für Lernito Kids. */

export const ZAHLWORTE = [
  'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn',
  'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn', 'zwanzig'
] as const;

export function zahlwort(n: number): string {
  return ZAHLWORTE[n] ?? String(n);
}

export interface ZaehlDing { emoji: string; einzahl: string; mehrzahl: string }
export const ZAEHLDINGE: ZaehlDing[] = [
  { emoji: '🍎', einzahl: 'Apfel', mehrzahl: 'Äpfel' },
  { emoji: '⚽', einzahl: 'Ball', mehrzahl: 'Bälle' },
  { emoji: '⭐', einzahl: 'Stern', mehrzahl: 'Sterne' },
  { emoji: '🐟', einzahl: 'Fisch', mehrzahl: 'Fische' },
  { emoji: '🌼', einzahl: 'Blume', mehrzahl: 'Blumen' },
  { emoji: '🦆', einzahl: 'Ente', mehrzahl: 'Enten' },
  { emoji: '🚗', einzahl: 'Auto', mehrzahl: 'Autos' },
  { emoji: '🍓', einzahl: 'Erdbeere', mehrzahl: 'Erdbeeren' },
  { emoji: '🐞', einzahl: 'Marienkäfer', mehrzahl: 'Marienkäfer' },
  { emoji: '🎈', einzahl: 'Ballon', mehrzahl: 'Ballons' }
];

export interface Farbe { id: string; name: string; hex: string }
export const FARBEN: Farbe[] = [
  { id: 'rot', name: 'Rot', hex: '#E63946' },
  { id: 'blau', name: 'Blau', hex: '#3A86FF' },
  { id: 'gelb', name: 'Gelb', hex: '#FFD60A' },
  { id: 'gruen', name: 'Grün', hex: '#38B000' },
  { id: 'orange', name: 'Orange', hex: '#FB8500' },
  { id: 'lila', name: 'Lila', hex: '#8E44AD' },
  { id: 'rosa', name: 'Rosa', hex: '#FF8FC7' },
  { id: 'braun', name: 'Braun', hex: '#8B5A2B' },
  { id: 'schwarz', name: 'Schwarz', hex: '#222222' },
  { id: 'weiss', name: 'Weiß', hex: '#FFFFFF' }
];

/** Dinge mit eindeutiger typischer Farbe */
export const FARB_DINGE: { emoji: string; name: string; artikel: string; farbe: string }[] = [
  { emoji: '🍌', name: 'Banane', artikel: 'die', farbe: 'gelb' },
  { emoji: '🍓', name: 'Erdbeere', artikel: 'die', farbe: 'rot' },
  { emoji: '🥦', name: 'Brokkoli', artikel: 'der', farbe: 'gruen' },
  { emoji: '🍊', name: 'Orange', artikel: 'die', farbe: 'orange' },
  { emoji: '🍆', name: 'Aubergine', artikel: 'die', farbe: 'lila' },
  { emoji: '🐸', name: 'Frosch', artikel: 'der', farbe: 'gruen' },
  { emoji: '🍅', name: 'Tomate', artikel: 'die', farbe: 'rot' },
  { emoji: '🐳', name: 'Wal', artikel: 'der', farbe: 'blau' },
  { emoji: '🐷', name: 'Schwein', artikel: 'das', farbe: 'rosa' },
  { emoji: '🌻', name: 'Sonnenblume', artikel: 'die', farbe: 'gelb' },
  { emoji: '🐻', name: 'Bär', artikel: 'der', farbe: 'braun' }
];

export interface Tier { emoji: string; name: string; artikel: 'der' | 'die' | 'das'; laut?: string; lautVerb?: string }
export const TIERE: Tier[] = [
  { emoji: '🐮', name: 'Kuh', artikel: 'die', laut: 'Muuuh!', lautVerb: 'muht' },
  { emoji: '🐶', name: 'Hund', artikel: 'der', laut: 'Wau wau!', lautVerb: 'bellt' },
  { emoji: '🐱', name: 'Katze', artikel: 'die', laut: 'Miau!', lautVerb: 'miaut' },
  { emoji: '🐷', name: 'Schwein', artikel: 'das', laut: 'Oink oink!', lautVerb: 'grunzt' },
  { emoji: '🐑', name: 'Schaf', artikel: 'das', laut: 'Mäh!', lautVerb: 'blökt' },
  { emoji: '🐔', name: 'Huhn', artikel: 'das', laut: 'Gack gack!', lautVerb: 'gackert' },
  { emoji: '🦆', name: 'Ente', artikel: 'die', laut: 'Quak quak!', lautVerb: 'quakt' },
  { emoji: '🐴', name: 'Pferd', artikel: 'das', laut: 'Wiehiehie!', lautVerb: 'wiehert' },
  { emoji: '🐸', name: 'Frosch', artikel: 'der', laut: 'Quaak!', lautVerb: 'quakt' },
  { emoji: '🦁', name: 'Löwe', artikel: 'der', laut: 'Roaaar!', lautVerb: 'brüllt' },
  { emoji: '🐘', name: 'Elefant', artikel: 'der', laut: 'Töröö!', lautVerb: 'trompetet' },
  { emoji: '🦉', name: 'Eule', artikel: 'die', laut: 'Huhu!', lautVerb: 'ruft' },
  { emoji: '🐰', name: 'Hase', artikel: 'der' },
  { emoji: '🐢', name: 'Schildkröte', artikel: 'die' },
  { emoji: '🦒', name: 'Giraffe', artikel: 'die' },
  { emoji: '🐧', name: 'Pinguin', artikel: 'der' },
  { emoji: '🦋', name: 'Schmetterling', artikel: 'der' },
  { emoji: '🐌', name: 'Schnecke', artikel: 'die' }
];

export interface BildWort { emoji: string; wort: string; silben: string[] }
export const BILDWOERTER: BildWort[] = [
  { emoji: '🍎', wort: 'Apfel', silben: ['Ap', 'fel'] },
  { emoji: '⚽', wort: 'Ball', silben: ['Ball'] },
  { emoji: '🍌', wort: 'Banane', silben: ['Ba', 'na', 'ne'] },
  { emoji: '🐭', wort: 'Maus', silben: ['Maus'] },
  { emoji: '☀️', wort: 'Sonne', silben: ['Son', 'ne'] },
  { emoji: '🦔', wort: 'Igel', silben: ['I', 'gel'] },
  { emoji: '🦆', wort: 'Ente', silben: ['En', 'te'] },
  { emoji: '🐟', wort: 'Fisch', silben: ['Fisch'] },
  { emoji: '🏠', wort: 'Haus', silben: ['Haus'] },
  { emoji: '🐱', wort: 'Katze', silben: ['Kat', 'ze'] },
  { emoji: '🌙', wort: 'Mond', silben: ['Mond'] },
  { emoji: '👃', wort: 'Nase', silben: ['Na', 'se'] },
  { emoji: '🚗', wort: 'Auto', silben: ['Au', 'to'] },
  { emoji: '⌚', wort: 'Uhr', silben: ['Uhr'] },
  { emoji: '🌹', wort: 'Rose', silben: ['Ro', 'se'] },
  { emoji: '🍅', wort: 'Tomate', silben: ['To', 'ma', 'te'] },
  { emoji: '🦓', wort: 'Zebra', silben: ['Ze', 'bra'] },
  { emoji: '🦁', wort: 'Löwe', silben: ['Lö', 'we'] },
  { emoji: '👵', wort: 'Oma', silben: ['O', 'ma'] },
  { emoji: '🌳', wort: 'Baum', silben: ['Baum'] },
  { emoji: '🐶', wort: 'Hund', silben: ['Hund'] },
  { emoji: '🍄', wort: 'Pilz', silben: ['Pilz'] },
  { emoji: '🐳', wort: 'Wal', silben: ['Wal'] },
  { emoji: '🍰', wort: 'Kuchen', silben: ['Ku', 'chen'] },
  { emoji: '🎈', wort: 'Ballon', silben: ['Bal', 'lon'] },
  { emoji: '🐘', wort: 'Elefant', silben: ['E', 'le', 'fant'] },
  { emoji: '🦋', wort: 'Schmetterling', silben: ['Schmet', 'ter', 'ling'] },
  { emoji: '🥕', wort: 'Möhre', silben: ['Möh', 're'] },
  { emoji: '🍉', wort: 'Melone', silben: ['Me', 'lo', 'ne'] },
  { emoji: '🎁', wort: 'Geschenk', silben: ['Ge', 'schenk'] },
  { emoji: '📚', wort: 'Buch', silben: ['Buch'] },
  { emoji: '🚲', wort: 'Fahrrad', silben: ['Fahr', 'rad'] },
  { emoji: '🐞', wort: 'Käfer', silben: ['Kä', 'fer'] },
  { emoji: '🧸', wort: 'Teddy', silben: ['Ted', 'dy'] }
];

/** Einfache, lautgetreue Wörter zum Bauen (Klasse 1) */
export const LESEWOERTER: { emoji: string; wort: string }[] = [
  { emoji: '🐭', wort: 'MAUS' }, { emoji: '🌙', wort: 'MOND' }, { emoji: '🏠', wort: 'HAUS' },
  { emoji: '👵', wort: 'OMA' }, { emoji: '🌹', wort: 'ROSE' }, { emoji: '👃', wort: 'NASE' },
  { emoji: '🐳', wort: 'WAL' }, { emoji: '🚗', wort: 'AUTO' }, { emoji: '🦔', wort: 'IGEL' },
  { emoji: '🍄', wort: 'PILZ' }, { emoji: '🐶', wort: 'HUND' }, { emoji: '🌳', wort: 'BAUM' },
  { emoji: '🦓', wort: 'ZEBRA' }, { emoji: '🍅', wort: 'TOMATE' }, { emoji: '🍌', wort: 'BANANE' }
];

export const REIME: [BildWortLite, BildWortLite][] = [
  [{ emoji: '🐭', wort: 'Maus' }, { emoji: '🏠', wort: 'Haus' }],
  [{ emoji: '🐶', wort: 'Hund' }, { emoji: '👄', wort: 'Mund' }],
  [{ emoji: '🐮', wort: 'Kuh' }, { emoji: '👟', wort: 'Schuh' }],
  [{ emoji: '🐻', wort: 'Bär' }, { emoji: '🌊', wort: 'Meer' }],
  [{ emoji: '🌹', wort: 'Rose' }, { emoji: '👖', wort: 'Hose' }],
  [{ emoji: '🐱', wort: 'Katze' }, { emoji: '🐾', wort: 'Tatze' }],
  [{ emoji: '🐰', wort: 'Hase' }, { emoji: '👃', wort: 'Nase' }]
];
export interface BildWortLite { emoji: string; wort: string }
