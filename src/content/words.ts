import { getLang } from '../i18n';
/** Eigene, eingebettete Beispielinhalte für Lernito Kids. */

export const ZAHLWORTE = [
  'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn',
  'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn', 'zwanzig'
] as const;

export const NUMERI = [
  'zero', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci',
  'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove', 'venti'
] as const;

export function zahlwort(n: number): string {
  return (getLang() === 'it' ? NUMERI[n] : ZAHLWORTE[n]) ?? String(n);
}

export interface ZaehlDing { emoji: string; einzahl: string; mehrzahl: string; it: [string, string] }
export const ZAEHLDINGE: ZaehlDing[] = [
  { emoji: '🍎', einzahl: 'Apfel', mehrzahl: 'Äpfel', it: ['mela', 'mele'] },
  { emoji: '⚽', einzahl: 'Ball', mehrzahl: 'Bälle', it: ['palla', 'palle'] },
  { emoji: '⭐', einzahl: 'Stern', mehrzahl: 'Sterne', it: ['stella', 'stelle'] },
  { emoji: '🐟', einzahl: 'Fisch', mehrzahl: 'Fische', it: ['pesce', 'pesci'] },
  { emoji: '🌼', einzahl: 'Blume', mehrzahl: 'Blumen', it: ['fiore', 'fiori'] },
  { emoji: '🦆', einzahl: 'Ente', mehrzahl: 'Enten', it: ['papera', 'papere'] },
  { emoji: '🚗', einzahl: 'Auto', mehrzahl: 'Autos', it: ['macchina', 'macchine'] },
  { emoji: '🍓', einzahl: 'Erdbeere', mehrzahl: 'Erdbeeren', it: ['fragola', 'fragole'] },
  { emoji: '🐞', einzahl: 'Marienkäfer', mehrzahl: 'Marienkäfer', it: ['coccinella', 'coccinelle'] },
  { emoji: '🎈', einzahl: 'Ballon', mehrzahl: 'Ballons', it: ['palloncino', 'palloncini'] }
];

export interface Farbe { id: string; name: string; hex: string; it: string }
export const FARBEN: Farbe[] = [
  { id: 'rot', name: 'Rot', hex: '#E63946', it: 'Rosso' },
  { id: 'blau', name: 'Blau', hex: '#3A86FF', it: 'Blu' },
  { id: 'gelb', name: 'Gelb', hex: '#FFD60A', it: 'Giallo' },
  { id: 'gruen', name: 'Grün', hex: '#38B000', it: 'Verde' },
  { id: 'orange', name: 'Orange', hex: '#FB8500', it: 'Arancione' },
  { id: 'lila', name: 'Lila', hex: '#8E44AD', it: 'Viola' },
  { id: 'rosa', name: 'Rosa', hex: '#FF8FC7', it: 'Rosa' },
  { id: 'braun', name: 'Braun', hex: '#8B5A2B', it: 'Marrone' },
  { id: 'schwarz', name: 'Schwarz', hex: '#222222', it: 'Nero' },
  { id: 'weiss', name: 'Weiß', hex: '#FFFFFF', it: 'Bianco' }
];

/** Dinge mit eindeutiger typischer Farbe */
export const FARB_DINGE: { emoji: string; name: string; artikel: string; farbe: string; it: string }[] = [
  { emoji: '🍌', name: 'Banane', artikel: 'die', farbe: 'gelb', it: "la banana" },
  { emoji: '🍓', name: 'Erdbeere', artikel: 'die', farbe: 'rot', it: "la fragola" },
  { emoji: '🥦', name: 'Brokkoli', artikel: 'der', farbe: 'gruen', it: "il broccolo" },
  { emoji: '🍊', name: 'Orange', artikel: 'die', farbe: 'orange', it: "l’arancia" },
  { emoji: '🍆', name: 'Aubergine', artikel: 'die', farbe: 'lila', it: "la melanzana" },
  { emoji: '🐸', name: 'Frosch', artikel: 'der', farbe: 'gruen', it: "la rana" },
  { emoji: '🍅', name: 'Tomate', artikel: 'die', farbe: 'rot', it: "il pomodoro" },
  { emoji: '🐳', name: 'Wal', artikel: 'der', farbe: 'blau', it: "la balena" },
  { emoji: '🐷', name: 'Schwein', artikel: 'das', farbe: 'rosa', it: "il maiale" },
  { emoji: '🌻', name: 'Sonnenblume', artikel: 'die', farbe: 'gelb', it: "il girasole" },
  { emoji: '🐻', name: 'Bär', artikel: 'der', farbe: 'braun', it: "l’orso" }
];

export interface Tier { emoji: string; name: string; artikel: 'der' | 'die' | 'das'; laut?: string; lautVerb?: string; it: string; itLaut?: string; itVerb?: string; itHint: string; deHint: string }
export const TIERE: Tier[] = [
  { emoji: '🐮', name: 'Kuh', artikel: 'die', laut: 'Muuuh!', lautVerb: 'muht', it: "la mucca", itLaut: 'Muuu!', itVerb: 'muggisce', itHint: "La mucca ci dà il latte e ha le macchie.", deHint: "Die Kuh gibt Milch und hat Flecken." },
  { emoji: '🐶', name: 'Hund', artikel: 'der', laut: 'Wau wau!', lautVerb: 'bellt', it: "il cane", itLaut: 'Bau bau!', itVerb: 'abbaia', itHint: "Il cane abbaia e scodinzola.", deHint: "Der Hund bellt und wedelt mit dem Schwanz." },
  { emoji: '🐱', name: 'Katze', artikel: 'die', laut: 'Miau!', lautVerb: 'miaut', it: "il gatto", itLaut: 'Miao!', itVerb: 'miagola', itHint: "Il gatto ha i baffi lunghi.", deHint: "Die Katze hat Schnurrhaare." },
  { emoji: '🐷', name: 'Schwein', artikel: 'das', laut: 'Oink oink!', lautVerb: 'grunzt', it: "il maiale", itLaut: 'Oink oink!', itVerb: 'grugnisce', itHint: "Il maiale è rosa e ha il naso tondo.", deHint: "Das Schwein ist rosa und hat eine runde Nase." },
  { emoji: '🐑', name: 'Schaf', artikel: 'das', laut: 'Mäh!', lautVerb: 'blökt', it: "la pecora", itLaut: 'Beee!', itVerb: 'bela', itHint: "La pecora ha la lana morbida.", deHint: "Das Schaf hat weiche Wolle." },
  { emoji: '🐔', name: 'Huhn', artikel: 'das', laut: 'Gack gack!', lautVerb: 'gackert', it: "la gallina", itLaut: 'Coccodè!', itVerb: 'chioccia', itHint: "La gallina fa le uova.", deHint: "Das Huhn legt Eier." },
  { emoji: '🦆', name: 'Ente', artikel: 'die', laut: 'Quak quak!', lautVerb: 'quakt', it: "la papera", itLaut: 'Qua qua!', itVerb: 'starnazza', itHint: "La papera nuota nello stagno.", deHint: "Die Ente schwimmt gern auf dem Teich." },
  { emoji: '🐴', name: 'Pferd', artikel: 'das', laut: 'Wiehiehie!', lautVerb: 'wiehert', it: "il cavallo", itLaut: 'Hiii!', itVerb: 'nitrisce', itHint: "Si può andare a cavallo.", deHint: "Auf dem Pferd kann man reiten." },
  { emoji: '🐸', name: 'Frosch', artikel: 'der', laut: 'Quaak!', lautVerb: 'quakt', it: "la rana", itLaut: 'Cra cra!', itVerb: 'gracida', itHint: "La rana è verde e salta.", deHint: "Der Frosch ist grün und springt." },
  { emoji: '🦁', name: 'Löwe', artikel: 'der', laut: 'Roaaar!', lautVerb: 'brüllt', it: "il leone", itLaut: 'Roaaar!', itVerb: 'ruggisce', itHint: "Il leone ha una grande criniera, come un re!", deHint: "Der Löwe hat eine große Mähne – wie ein König!" },
  { emoji: '🐘', name: 'Elefant', artikel: 'der', laut: 'Töröö!', lautVerb: 'trompetet', it: "l’elefante", itLaut: 'Pruuu!', itVerb: 'barrisce', itHint: "L’elefante ha una proboscide lunga.", deHint: "Der Elefant hat einen langen Rüssel." },
  { emoji: '🦉', name: 'Eule', artikel: 'die', laut: 'Huhu!', lautVerb: 'ruft', it: "il gufo", itLaut: 'Uh uh!', itVerb: 'bubola', itHint: "Il gufo è sveglio di notte.", deHint: "Die Eule ist nachts wach." },
  { emoji: '🐰', name: 'Hase', artikel: 'der', it: "il coniglio", itHint: "Il coniglio ha le orecchie lunghe.", deHint: "Der Hase hat lange Ohren." },
  { emoji: '🐢', name: 'Schildkröte', artikel: 'die', it: "la tartaruga", itHint: "La tartaruga porta la casa sulla schiena.", deHint: "Die Schildkröte trägt ihr Haus auf dem Rücken." },
  { emoji: '🦒', name: 'Giraffe', artikel: 'die', it: "la giraffa", itHint: "La giraffa ha il collo lunghissimo.", deHint: "Die Giraffe hat einen sehr langen Hals." },
  { emoji: '🐧', name: 'Pinguin', artikel: 'der', it: "il pinguino", itHint: "Il pinguino vive tra i ghiacci e non vola.", deHint: "Der Pinguin lebt im Eis und kann nicht fliegen." },
  { emoji: '🦋', name: 'Schmetterling', artikel: 'der', it: "la farfalla", itHint: "La farfalla ha le ali colorate.", deHint: "Der Schmetterling hat bunte Flügel." },
  { emoji: '🐌', name: 'Schnecke', artikel: 'die', it: "la lumaca", itHint: "La lumaca è lentissima.", deHint: "Die Schnecke ist ganz langsam." }
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

/** Italienische Bildwörter mit Silben */
export const PAROLE: BildWort[] = [
  { emoji: '🍎', wort: 'Mela', silben: ['Me', 'la'] },
  { emoji: '⚽', wort: 'Palla', silben: ['Pal', 'la'] },
  { emoji: '🍌', wort: 'Banana', silben: ['Ba', 'na', 'na'] },
  { emoji: '🐭', wort: 'Topo', silben: ['To', 'po'] },
  { emoji: '☀️', wort: 'Sole', silben: ['So', 'le'] },
  { emoji: '🦆', wort: 'Papera', silben: ['Pa', 'pe', 'ra'] },
  { emoji: '🐟', wort: 'Pesce', silben: ['Pe', 'sce'] },
  { emoji: '🏠', wort: 'Casa', silben: ['Ca', 'sa'] },
  { emoji: '🐱', wort: 'Gatto', silben: ['Gat', 'to'] },
  { emoji: '🌙', wort: 'Luna', silben: ['Lu', 'na'] },
  { emoji: '👃', wort: 'Naso', silben: ['Na', 'so'] },
  { emoji: '🚗', wort: 'Auto', silben: ['Au', 'to'] },
  { emoji: '🌹', wort: 'Rosa', silben: ['Ro', 'sa'] },
  { emoji: '🍅', wort: 'Pomodoro', silben: ['Po', 'mo', 'do', 'ro'] },
  { emoji: '🦓', wort: 'Zebra', silben: ['Ze', 'bra'] },
  { emoji: '🦁', wort: 'Leone', silben: ['Le', 'o', 'ne'] },
  { emoji: '👵', wort: 'Nonna', silben: ['Non', 'na'] },
  { emoji: '🌳', wort: 'Albero', silben: ['Al', 'be', 'ro'] },
  { emoji: '🐶', wort: 'Cane', silben: ['Ca', 'ne'] },
  { emoji: '🍄', wort: 'Fungo', silben: ['Fun', 'go'] },
  { emoji: '🐳', wort: 'Balena', silben: ['Ba', 'le', 'na'] },
  { emoji: '🍰', wort: 'Torta', silben: ['Tor', 'ta'] },
  { emoji: '🎈', wort: 'Palloncino', silben: ['Pal', 'lon', 'ci', 'no'] },
  { emoji: '🐘', wort: 'Elefante', silben: ['E', 'le', 'fan', 'te'] },
  { emoji: '🦋', wort: 'Farfalla', silben: ['Far', 'fal', 'la'] },
  { emoji: '🥕', wort: 'Carota', silben: ['Ca', 'ro', 'ta'] },
  { emoji: '🍉', wort: 'Anguria', silben: ['An', 'gu', 'ria'] },
  { emoji: '🎁', wort: 'Regalo', silben: ['Re', 'ga', 'lo'] },
  { emoji: '📚', wort: 'Libro', silben: ['Li', 'bro'] },
  { emoji: '🚲', wort: 'Bici', silben: ['Bi', 'ci'] },
  { emoji: '🐞', wort: 'Coccinella', silben: ['Coc', 'ci', 'nel', 'la'] },
  { emoji: '🧸', wort: 'Orsetto', silben: ['Or', 'set', 'to'] },
  { emoji: '🦊', wort: 'Volpe', silben: ['Vol', 'pe'] },
  { emoji: '🍇', wort: 'Uva', silben: ['U', 'va'] },
  { emoji: '🦉', wort: 'Gufo', silben: ['Gu', 'fo'] },
  { emoji: '🐸', wort: 'Rana', silben: ['Ra', 'na'] },
  { emoji: '🍋', wort: 'Limone', silben: ['Li', 'mo', 'ne'] },
  { emoji: '⭐', wort: 'Stella', silben: ['Stel', 'la'] }
];

/** Einfache Wörter zum Bauen (italienisch, 1. Klasse) */
export const PAROLE_FACILI: { emoji: string; wort: string }[] = [
  { emoji: '🏠', wort: 'CASA' }, { emoji: '🌙', wort: 'LUNA' }, { emoji: '☀️', wort: 'SOLE' },
  { emoji: '🐶', wort: 'CANE' }, { emoji: '🐭', wort: 'TOPO' }, { emoji: '🍎', wort: 'MELA' },
  { emoji: '👃', wort: 'NASO' }, { emoji: '🌹', wort: 'ROSA' }, { emoji: '🐸', wort: 'RANA' },
  { emoji: '🍇', wort: 'UVA' }, { emoji: '🦉', wort: 'GUFO' }, { emoji: '📚', wort: 'LIBRO' },
  { emoji: '🍰', wort: 'TORTA' }, { emoji: '🦊', wort: 'VOLPE' }, { emoji: '🍌', wort: 'BANANA' }
];

export const RIME: [BildWortLite, BildWortLite][] = [
  [{ emoji: '🐱', wort: 'Gatto' }, { emoji: '🍽️', wort: 'Piatto' }],
  [{ emoji: '🐭', wort: 'Topo' }, { emoji: '⏰', wort: 'Dopo' }],
  [{ emoji: '🌙', wort: 'Luna' }, { emoji: '🏝️', wort: 'Duna' }],
  [{ emoji: '🐶', wort: 'Cane' }, { emoji: '🍞', wort: 'Pane' }],
  [{ emoji: '🌹', wort: 'Rosa' }, { emoji: '👰', wort: 'Sposa' }],
  [{ emoji: '🦁', wort: 'Leone' }, { emoji: '🔘', wort: 'Bottone' }],
  [{ emoji: '🍰', wort: 'Torta' }, { emoji: '🚪', wort: 'Porta' }],
  [{ emoji: '🐸', wort: 'Rana' }, { emoji: '⛲', wort: 'Fontana' }]
];

/** Bildwörter in der aktuellen Sprache */
export function bildwoerter(): BildWort[] { return getLang() === 'it' ? PAROLE : BILDWOERTER; }
export function reime(): [BildWortLite, BildWortLite][] { return getLang() === 'it' ? RIME : REIME; }
export const countName = (d: ZaehlDing, n: number) => getLang() === 'it' ? (n === 1 ? d.it[0] : d.it[1]) : (n === 1 ? d.einzahl : d.mehrzahl);
export const farbName = (f: Farbe) => getLang() === 'it' ? f.it : f.name;
