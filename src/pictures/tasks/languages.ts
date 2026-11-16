import type { Difficulty, Rng } from '../../learning/types';
import { pick, sample, shuffle, randInt } from '../../lib/random';
import { L, getLang } from '../../i18n';
import type { Pic } from '../types';
import { choice, gen, pickPicture, type PicBank, type PicGen } from './helpers';
import { REGULAR, WORDS, word, type Word } from './words';

/* Bildaufgaben für Deutsch, Italienisch und Englisch */

const obj = (name: string): Pic => ({ id: 'obj', name });
const opt = (x: Word, label: (w: Word) => string) => ({ pic: obj(x.name), name: label(x) });
const others = (rng: Rng, not: Word, n: number, filter: (w: Word) => boolean = () => true) => sample(rng, WORDS.filter((x) => x !== not && filter(x)), n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- Rechtschreib-Varianten ---------- */
function deTypos(wd: string): string[] {
  const v = new Set<string>();
  const rules: [RegExp, string][] = [[/tz/, 'z'], [/ck/, 'k'], [/ie/, 'i'], [/ss/, 's'], [/ll/, 'l'], [/nn/, 'n'], [/tt/, 't'], [/mm/, 'm'], [/rr/, 'r'], [/hr/, 'r'], [/uh/, 'u'], [/äu/, 'eu'], [/ä/, 'e'], [/ü/, 'u'], [/ö/, 'o'], [/d$/, 't'], [/g$/, 'k'], [/b$/, 'p'], [/sch/, 'sh'], [/ei/, 'ai'], [/V/, 'F'], [/v/, 'f'], [/St/, 'Scht'], [/Sp/, 'Schp']];
  for (const [re, to] of rules) if (re.test(wd)) v.add(wd.replace(re, to));
  // einfachen Konsonanten verdoppeln (nach kurzem Vokal falsch)
  const m = wd.match(/^([A-ZÄÖÜa-zäöü]*?[aeiou])([fklmnprt])([aeiou]|$)/);
  if (m) v.add(wd.replace(m[0], m[1]! + m[2]! + m[2]! + (m[3] ?? '')));
  v.add(wd.toLowerCase());
  v.delete(wd);
  return [...v];
}
function itTypos(wd: string): string[] {
  const v = new Set<string>();
  const rules: [RegExp, string][] = [[/ll/, 'l'], [/tt/, 't'], [/pp/, 'p'], [/cc/, 'c'], [/zz/, 'z'], [/rr/, 'r'], [/gn/, 'ni'], [/gli/, 'li'], [/chi/, 'ci'], [/che/, 'ce'], [/sce/, 'scie'], [/qu/, 'cu'], [/ch/, 'c']];
  for (const [re, to] of rules) if (re.test(wd)) v.add(wd.replace(re, to));
  const m = wd.match(/^([a-z]*?[aeiou])([bcdfglmnprstvz])([aeiou])/);
  if (m) v.add(wd.replace(m[0], m[1]! + m[2]! + m[2]! + m[3]!));
  const m2 = wd.match(/([bcdfglmnprstvz])\1/);
  if (!m2) { const m3 = wd.match(/[aeiou]([lrt])[aeiou]/); if (m3) v.add(wd.replace(m3[1]!, m3[1]! + m3[1]!)); }
  v.delete(wd);
  return [...v];
}

/** Richtige Schreibweise zum Bild wählen */
const spelling = (lv: Difficulty, lang: 'de' | 'it', pool: (w: Word) => boolean): PicGen => gen((rng) => {
  const cands = WORDS.filter((x) => pool(x) && (lang === 'de' ? deTypos(x.de.w) : itTypos(x.it.w)).length >= 2);
  const x = pick(rng, cands);
  const right = lang === 'de' ? x.de.w : x.it.w;
  const wrong = shuffle(rng, lang === 'de' ? deTypos(right) : itTypos(right)).slice(0, 3);
  return choice({ prompt: lang === 'de' ? L('Wie schreibt man das Wort zum Bild richtig?', 'Come si scrive correttamente in tedesco la parola dell’immagine?') : L('Wie schreibt man das italienische Wort zum Bild richtig?', 'Come si scrive correttamente la parola dell’immagine?'), pic: obj(x.name), right, wrong, rng, hint: L('Sprich das Wort langsam und deutlich. Achte auf kurze und lange Vokale.', 'Pronuncia la parola lentamente. Ascolta bene le doppie e i suoni difficili.'), explain: [L(`Das Bild zeigt: ${right}.`, `L’immagine mostra: ${right}.`)] });
}, lv);

/* ---------- Deutsch Grundschule ---------- */
const anlautOk = (x: Word) => !/^(Sch|St|Sp|Ei|Au|V|Eu|Qu|Ch)/.test(x.de.w);
const first = (s: string) => s.charAt(0).toUpperCase();
const LETTERS = 'ABDEFGHIKLMNOPRSTUWZ'.split('');

const D1_ANLAUTE: PicGen[] = [
  gen((rng) => {
    const x = pick(rng, WORDS.filter(anlautOk));
    const a = first(x.de.w);
    return choice({ prompt: L('Mit welchem Buchstaben beginnt das Wort?', 'Con quale lettera inizia la parola (in tedesco)?'), pic: obj(x.name), right: a, wrong: sample(rng, LETTERS.filter((l) => l !== a), 3), rng, big: true, hint: L('Sprich das Wort langsam. Was hörst du ganz am Anfang?', 'Pronuncia la parola lentamente. Che suono senti all’inizio?'), explain: [`${x.de.w} – ${a}`] });
  }, 1),
  gen((rng) => {
    const x = pick(rng, WORDS.filter(anlautOk));
    const a = first(x.de.w);
    const wrong = others(rng, x, 3, (y) => anlautOk(y) && first(y.de.w) !== a);
    return pickPicture({ prompt: L(`Welches Bild beginnt mit ${a}?`, `Quale immagine inizia con ${a} (in tedesco)?`), right: opt(x, (y) => y.de.w), wrong: wrong.map((y) => opt(y, (z) => z.de.w)), rng, hint: L('Sag jedes Bild laut und hör auf den ersten Laut.', 'Di’ ogni immagine ad alta voce e ascolta il primo suono.'), explain: [`${x.de.w} – ${a}`] });
  }, 2),
  gen((rng) => {
    const x = pick(rng, WORDS.filter((y) => !/e$/.test(y.de.w)));
    const a = x.de.w.slice(-1).toUpperCase();
    return choice({ prompt: L('Mit welchem Buchstaben endet das Wort?', 'Con quale lettera finisce la parola (in tedesco)?'), pic: obj(x.name), right: a, wrong: sample(rng, LETTERS.filter((l) => l !== a), 3), rng, big: true, hint: L('Hör genau auf den letzten Laut.', 'Ascolta bene l’ultimo suono.'), explain: [`${x.de.w} – ${a}`] });
  }, 3)
];

const sylCount = (rng: Rng, lang: 'de' | 'it', lv: Difficulty) => {
  const pool = WORDS.filter((x) => (lang === 'de' ? x.de.syl.length : x.it.syl.length) <= (lv === 1 ? 2 : 4));
  const x = pick(rng, pool);
  const syl = lang === 'de' ? x.de.syl : x.it.syl;
  const n = syl.length;
  return choice({ prompt: lang === 'de' ? L('Wie viele Silben hat das Wort?', 'Quante sillabe ha la parola (in tedesco)?') : L('Wie viele Silben hat das Wort (auf Italienisch)?', 'Quante sillabe ha la parola?'), pic: obj(x.name), right: String(n), wrong: ['1', '2', '3', '4'].filter((s) => s !== String(n)), rng, big: true, hint: L('Klatsche bei jeder Silbe einmal.', 'Batti le mani a ogni sillaba.'), explain: [syl.join(' - '), L(`Das sind ${n} Silben.`, `Sono ${n} sillabe.`)] });
};
const SYL_DE = ['', 'nur eine Silbe', 'zwei Silben', 'drei Silben', 'vier Silben'];
const SYL_IT = ['', 'una sola sillaba', 'due sillabe', 'tre sillabe', 'quattro sillabe'];
const sylPick = (rng: Rng, lang: 'de' | 'it') => {
  const n = pick(rng, lang === 'de' ? [1, 3] : [2, 4]);
  const len = (x: Word) => (lang === 'de' ? x.de.syl.length : x.it.syl.length);
  const x = pick(rng, WORDS.filter((y) => len(y) === n));
  const name = (y: Word) => (lang === 'de' ? y.de.w : y.it.w);
  const prompt = lang === 'de'
    ? L(`Welches Wort hat ${SYL_DE[n]}?`, `Quale parola tedesca ha ${SYL_IT[n]}?`)
    : L(`Welches italienische Wort hat ${SYL_DE[n]}?`, `Quale parola ha ${SYL_IT[n]}?`);
  return pickPicture({ prompt, right: opt(x, name), wrong: others(rng, x, 3, (y) => len(y) !== n).map((y) => opt(y, name)), rng, hint: L('Klatsche jedes Wort.', 'Batti le mani per ogni parola.'), explain: [(lang === 'de' ? x.de.syl : x.it.syl).join(' - ')] });
};

const D1_SILBEN: PicGen[] = [gen((rng) => sylCount(rng, 'de', 1), 1), gen((rng) => sylCount(rng, 'de', 2), 2), gen((rng) => sylPick(rng, 'de'), 3)];

const wordForPicture = (lang: 'de' | 'it' | 'en') => (rng: Rng, level: Difficulty) => {
  const x = pick(rng, WORDS);
  const name = (y: Word) => (lang === 'de' ? y.de.w : lang === 'it' ? y.it.w : y.en);
  const similar = level >= 2 ? WORDS.filter((y) => y !== x && name(y).charAt(0) === name(x).charAt(0)) : [];
  const wrong = [...shuffle(rng, similar), ...others(rng, x, 3)].map(name);
  return choice({ prompt: lang === 'en' ? 'What is this?' : lang === 'de' ? L('Welches Wort passt zum Bild?', 'Quale parola tedesca corrisponde all’immagine?') : L('Welches italienische Wort passt zum Bild?', 'Quale parola corrisponde all’immagine?'), pic: obj(x.name), right: name(x), wrong, rng, hint: L('Sag das Bild laut und lies dann die Wörter.', 'Di’ ad alta voce che cosa vedi, poi leggi le parole.'), explain: [name(x)] });
};
const readAndPick = (lang: 'de' | 'it' | 'en') => (rng: Rng) => {
  const x = pick(rng, WORDS);
  const name = (y: Word) => (lang === 'de' ? `${cap(y.de.art)} ${y.de.w}` : lang === 'it' ? (y.it.art === 'l’' ? `l’${y.it.w}` : `${y.it.art} ${y.it.w}`) : `the ${y.en}`);
  return pickPicture({ prompt: lang === 'en' ? `Find: ${name(x)}` : L(`Lies: ${name(x)}. Welches Bild passt?`, `Leggi: ${name(x)}. Quale immagine corrisponde?`), right: opt(x, name), wrong: others(rng, x, 3).map((y) => opt(y, name)), rng, explain: [name(x)] });
};

const D1_WOERTER: PicGen[] = [gen(wordForPicture('de'), 1), gen(wordForPicture('de'), 2), spelling(3, 'de', (x) => x.de.syl.length >= 2)];
const D1_LESEN: PicGen[] = [gen(readAndPick('de'), 1), gen(readAndPick('de'), 2), gen((rng) => {
  const x = pick(rng, REGULAR);
  return pickPicture({ prompt: L(`Lies: viele ${x.de.pl}. Welches Bild passt?`, `Leggi: viele ${x.de.pl}. Quale immagine corrisponde?`), right: { pic: { id: 'viele', name: x.name, n: 4 }, name: x.de.pl }, wrong: others(rng, x, 3).map((y) => ({ pic: { id: 'viele', name: y.name, n: 4 }, name: y.de.pl })), rng, explain: [x.de.pl] });
}, 3)];

const abc = (lang: 'de' | 'it', mode: 'first' | 'second' | 'last') => (rng: Rng) => {
  const name = (y: Word) => (lang === 'de' ? y.de.w : y.it.w);
  let set: Word[];
  if (mode === 'second') {
    const groups = new Map<string, Word[]>();
    for (const x of WORDS) { const k = name(x).charAt(0).toLowerCase(); groups.set(k, [...(groups.get(k) ?? []), x]); }
    const big = [...groups.values()].filter((g) => g.length >= 3);
    set = sample(rng, pick(rng, big), 3);
  } else set = sample(rng, WORDS.filter((x, i, a) => a.findIndex((y) => name(y).charAt(0) === name(x).charAt(0)) === i), 4);
  const sorted = [...set].sort((a, b) => name(a).localeCompare(name(b), lang));
  const right = mode === 'last' ? sorted[sorted.length - 1]! : sorted[0]!;
  return choice({
    prompt: mode === 'last' ? L('Welches Wort kommt im ABC zuletzt?', 'Quale parola viene per ultima in ordine alfabetico?') : L('Welches Wort kommt im ABC zuerst?', 'Quale parola viene per prima in ordine alfabetico?'),
    pic: { id: 'objreihe', names: set.map((x) => x.name), labels: set.map(name) }, right: name(right), wrong: set.filter((x) => x !== right).map(name), rng,
    hint: mode === 'second' ? L('Der erste Buchstabe ist gleich. Vergleiche den zweiten!', 'La prima lettera è uguale: confronta la seconda!') : L('Vergleiche die ersten Buchstaben mit dem ABC.', 'Confronta le prime lettere con l’alfabeto.'),
    explain: [sorted.map(name).join(' → ')]
  });
};
const D2_ABC: PicGen[] = [gen(abc('de', 'first'), 1), gen(abc('de', 'last'), 2), gen(abc('de', 'second'), 3)];

const PREP_DE: Record<string, string> = { auf: 'auf der Kiste', unter: 'unter dem Tisch', in: 'in der Kiste', neben: 'neben der Kiste', hinter: 'hinter der Kiste', vor: 'vor der Kiste', zwischen: 'zwischen den Kisten' };
const PREP_IT: Record<string, string> = { auf: 'sulla scatola', unter: 'sotto il tavolo', in: 'nella scatola', neben: 'accanto alla scatola', hinter: 'dietro la scatola', vor: 'davanti alla scatola', zwischen: 'tra le scatole' };
const PREP_EN: Record<string, string> = { auf: 'on', unter: 'under', in: 'in', neben: 'next to', hinter: 'behind', vor: 'in front of', zwischen: 'between' };
const prepRead = (lang: 'de' | 'it') => (rng: Rng, level: Difficulty) => {
  const keys = level === 1 ? ['auf', 'unter', 'in', 'neben'] : Object.keys(PREP_DE);
  const k = pick(rng, keys);
  const s = lang === 'de' ? `Die Katze ist ${PREP_DE[k]}.` : `Il gatto è ${PREP_IT[k]}.`;
  return pickPicture({ prompt: L(`Lies: „${s}“ Welches Bild passt?`, `Leggi: «${s}» Quale immagine corrisponde?`), right: { pic: { id: 'praeposition', pos: k }, name: s }, wrong: sample(rng, keys.filter((x) => x !== k), 3).map((x) => ({ pic: { id: 'praeposition', pos: x }, name: lang === 'de' ? `Die Katze ist ${PREP_DE[x]}.` : `Il gatto è ${PREP_IT[x]}.` })), rng, hint: L('Wo ist die Katze genau?', 'Dove si trova esattamente il gatto?'), explain: [s] });
};
const D2_LESEN: PicGen[] = [gen(readAndPick('de'), 1), gen(prepRead('de'), 2), gen(prepRead('de'), 3)];

const D2_NOMEN: PicGen[] = [
  gen((rng) => {
    const x = pick(rng, REGULAR);
    return choice({ prompt: L('Welcher Artikel passt zum Bild?', 'Quale articolo tedesco va bene con l’immagine?'), pic: obj(x.name), right: x.de.art, wrong: ['der', 'die', 'das'], rng, big: true, hint: L('Sag das Wort mit „der“, „die“ und „das“. Was klingt richtig?', 'Prova a dire la parola con «der», «die» e «das».'), explain: [`${x.de.art} ${x.de.w}`] });
  }, 1),
  gen((rng) => {
    const art = pick(rng, ['der', 'die', 'das'] as const);
    const x = pick(rng, REGULAR.filter((y) => y.de.art === art));
    return pickPicture({ prompt: L(`Welches Nomen hat den Artikel „${art}“?`, `Quale nome tedesco ha l’articolo «${art}»?`), right: opt(x, (y) => `${y.de.art} ${y.de.w}`), wrong: others(rng, x, 3, (y) => y.de.art !== art && y.name !== 'brille').map((y) => opt(y, (z) => `${z.de.art} ${z.de.w}`)), rng, explain: [`${x.de.art} ${x.de.w}`] });
  }, 2),
  gen((rng) => {
    const x = pick(rng, REGULAR);
    return choice({ prompt: L('Nomen schreibt man groß. Welches Wort ist richtig geschrieben?', 'In tedesco i nomi si scrivono con la maiuscola. Quale parola è scritta bene?'), pic: obj(x.name), right: `${x.de.art} ${x.de.w}`, wrong: [`${x.de.art} ${x.de.w.toLowerCase()}`, `${cap(x.de.art)} ${x.de.w.toLowerCase()}`, `${x.de.art.toUpperCase()} ${x.de.w.toUpperCase()}`], rng, hint: L('Nur das Nomen beginnt mit einem großen Buchstaben.', 'Solo il nome inizia con la lettera maiuscola.'), explain: [`${x.de.art} ${x.de.w}`] });
  }, 3)
];

const D2_RECHT: PicGen[] = [spelling(1, 'de', (x) => x.de.syl.length <= 2), spelling(2, 'de', () => true), spelling(3, 'de', (x) => x.de.syl.length >= 2)];

const pluralDe = (rng: Rng, level: Difficulty) => {
  const x = pick(rng, REGULAR.filter((y) => y.de.pl !== y.de.w));
  const n = level === 1 ? 2 : randInt(rng, 2, 5);
  const nums = ['', '', 'zwei', 'drei', 'vier', 'fünf'];
  const right = `${nums[n]} ${x.de.pl}`;
  const variants = [x.de.w, x.de.w + 's', x.de.w + 'en', x.de.w + 'e', x.de.pl + 'n', x.de.pl.replace(/[äöü]/, (c) => ({ ä: 'a', ö: 'o', ü: 'u' })[c] ?? c)].filter((v) => v !== x.de.pl);
  return choice({ prompt: L('Was siehst du auf dem Bild?', 'Che cosa vedi (in tedesco)?'), pic: { id: 'viele', name: x.name, n }, right, wrong: shuffle(rng, [...new Set(variants)]).map((v) => `${nums[n]} ${v}`), rng, hint: L(`Einzahl: ${x.de.art} ${x.de.w}. Wie heißt die Mehrzahl?`, `Singolare: ${x.de.art} ${x.de.w}. Come si dice il plurale?`), explain: [`${x.de.art} ${x.de.w} → die ${x.de.pl}`] });
};
const D3_MEHRZAHL: PicGen[] = [gen(pluralDe, 1), gen(pluralDe, 2), gen((rng) => {
  const x = pick(rng, REGULAR.filter((y) => /[äöü]/.test(y.de.pl) && !/[äöü]/.test(y.de.w)));
  return pickPicture({ prompt: L(`Welche Mehrzahl bekommt einen Umlaut (ä, ö, ü)?`, `Quale plurale tedesco prende l’Umlaut (ä, ö, ü)?`), right: { pic: { id: 'viele', name: x.name, n: 3 }, name: `die ${x.de.pl}` }, wrong: others(rng, x, 3, (y) => !/[äöü]/.test(y.de.pl) && y.name !== 'brille').map((y) => ({ pic: { id: 'viele', name: y.name, n: 3 }, name: `die ${y.de.pl}` })), rng, explain: [`${x.de.w} → ${x.de.pl}`] });
}, 3)];

/* Wortarten / Satzglieder: Satzstreifen mit markiertem Teil */
type Tagged = [string[], string[]];
const stripTask = (data: Tagged[], allowed: string[], promptDe: string, promptIt: string, options: string[]) => (rng: Rng) => {
  const cands: [Tagged, number][] = [];
  data.forEach((d) => d[1].forEach((t, i) => { if (allowed.includes(t)) cands.push([d, i]); }));
  const [[words, tags], i] = pick(rng, cands);
  const right = tags[i]!;
  return choice({ prompt: L(promptDe, promptIt), pic: { id: 'satz', words, mark: [i, i] }, right, wrong: shuffle(rng, options.filter((o) => o !== right)), rng, hint: L('Lies den ganzen Satz und frage nach dem markierten Teil.', 'Leggi tutta la frase e fai la domanda giusta sulla parte evidenziata.'), explain: [`„${words[i]}“ → ${right}`] });
};

const DE_WA: Tagged[] = [
  [['Die', 'kleine', 'Katze', 'schläft', 'unter', 'dem', 'Tisch.'], ['Artikel', 'Adjektiv', 'Nomen', 'Verb', 'Präposition', 'Artikel', 'Nomen']],
  [['Wir', 'essen', 'einen', 'roten', 'Apfel.'], ['Pronomen', 'Verb', 'Artikel', 'Adjektiv', 'Nomen']],
  [['Tim', 'liest', 'ein', 'spannendes', 'Buch.'], ['Nomen', 'Verb', 'Artikel', 'Adjektiv', 'Nomen']],
  [['Der', 'große', 'Hund', 'rennt', 'über', 'die', 'Wiese.'], ['Artikel', 'Adjektiv', 'Nomen', 'Verb', 'Präposition', 'Artikel', 'Nomen']],
  [['Sie', 'trinkt', 'warmen', 'Tee.'], ['Pronomen', 'Verb', 'Adjektiv', 'Nomen']],
  [['Die', 'Kinder', 'malen', 'bunte', 'Bilder.'], ['Artikel', 'Nomen', 'Verb', 'Adjektiv', 'Nomen']]
];
const DE_WA_SEK: Tagged[] = [
  ...DE_WA,
  [['Gestern', 'haben', 'wir', 'mit', 'unseren', 'Freunden', 'gespielt.'], ['Adverb', 'Verb', 'Pronomen', 'Präposition', 'Artikelwort', 'Nomen', 'Verb']],
  [['Obwohl', 'es', 'regnet,', 'gehen', 'wir', 'spazieren.'], ['Konjunktion', 'Pronomen', 'Verb', 'Verb', 'Pronomen', 'Verb']],
  [['Das', 'sehr', 'alte', 'Haus', 'steht', 'neben', 'der', 'Kirche.'], ['Artikel', 'Adverb', 'Adjektiv', 'Nomen', 'Verb', 'Präposition', 'Artikel', 'Nomen']],
  [['Lena', 'kommt', 'heute', 'nicht,', 'weil', 'sie', 'krank', 'ist.'], ['Nomen', 'Verb', 'Adverb', 'Partikel', 'Konjunktion', 'Pronomen', 'Adjektiv', 'Verb']]
];
const WA_BASE = ['Nomen', 'Verb', 'Adjektiv', 'Artikel'];
const WA_ALL = ['Nomen', 'Verb', 'Adjektiv', 'Artikel', 'Pronomen', 'Präposition', 'Adverb', 'Konjunktion'];
const waPrompt = ['Welche Wortart ist das markierte Wort?', 'Che parte del discorso (in tedesco: Wortart) è la parola evidenziata?'] as const;

const D3_WORTARTEN: PicGen[] = [
  gen(stripTask(DE_WA, ['Nomen', 'Verb'], ...waPrompt, WA_BASE), 1),
  gen(stripTask(DE_WA, ['Adjektiv', 'Artikel', 'Nomen', 'Verb'], ...waPrompt, WA_BASE), 2),
  gen(stripTask(DE_WA, ['Pronomen', 'Präposition', 'Adjektiv'], ...waPrompt, ['Nomen', 'Verb', 'Adjektiv', 'Pronomen', 'Präposition']), 3)
];
const D_WORTARTEN_SEK: PicGen[] = [
  gen(stripTask(DE_WA_SEK, ['Pronomen', 'Präposition', 'Adjektiv'], ...waPrompt, WA_ALL), 1),
  gen(stripTask(DE_WA_SEK, ['Adverb', 'Pronomen', 'Präposition'], ...waPrompt, WA_ALL), 2),
  gen(stripTask(DE_WA_SEK, ['Konjunktion', 'Adverb'], ...waPrompt, WA_ALL), 3)
];

const DE_SG: Tagged[] = [
  [['Der Hund', 'frisst', 'einen Knochen.'], ['Subjekt', 'Prädikat', 'Akkusativobjekt']],
  [['Lena', 'schenkt', 'ihrer Oma', 'eine Blume.'], ['Subjekt', 'Prädikat', 'Dativobjekt', 'Akkusativobjekt']],
  [['Die Kinder', 'spielen', 'im Park.'], ['Subjekt', 'Prädikat', 'Ortsangabe']],
  [['Morgen', 'besuchen', 'wir', 'den Zoo.'], ['Zeitangabe', 'Prädikat', 'Subjekt', 'Akkusativobjekt']],
  [['Der Lehrer', 'erklärt', 'den Schülern', 'die Aufgabe.'], ['Subjekt', 'Prädikat', 'Dativobjekt', 'Akkusativobjekt']],
  [['Im Sommer', 'schwimmen', 'die Enten', 'auf dem See.'], ['Zeitangabe', 'Prädikat', 'Subjekt', 'Ortsangabe']]
];
const DE_SG_SEK: Tagged[] = [
  [['Die Polizei', 'beschuldigt', 'den Mann', 'des Diebstahls.'], ['Subjekt', 'Prädikat', 'Akkusativobjekt', 'Genitivobjekt']],
  [['Mein Bruder', 'ist', 'ein guter Koch.'], ['Subjekt', 'Prädikat', 'Prädikativ']],
  [['Wir', 'warten', 'auf den Bus.'], ['Subjekt', 'Prädikat', 'Präpositionalobjekt']],
  [['Mit großer Vorsicht', 'öffnete', 'sie', 'die alte Kiste.'], ['Adverbial der Art und Weise', 'Prädikat', 'Subjekt', 'Akkusativobjekt']],
  [['Gestern Abend', 'gab', 'der Trainer', 'den Spielern', 'neue Trikots.'], ['Adverbial der Zeit', 'Prädikat', 'Subjekt', 'Dativobjekt', 'Akkusativobjekt']],
  [['Die Großeltern', 'wohnen', 'in einem kleinen Dorf.'], ['Subjekt', 'Prädikat', 'Adverbial des Ortes']],
  [['Wegen des Regens', 'blieben', 'die Kinder', 'zu Hause.'], ['Adverbial des Grundes', 'Prädikat', 'Subjekt', 'Adverbial des Ortes']],
  [['Ich', 'erinnere mich', 'an den Urlaub.'], ['Subjekt', 'Prädikat', 'Präpositionalobjekt']]
];
const sgPrompt = ['Welches Satzglied ist markiert?', 'Quale complemento (in tedesco: Satzglied) è evidenziato?'] as const;
const SG_BASE = ['Subjekt', 'Prädikat', 'Akkusativobjekt', 'Dativobjekt', 'Ortsangabe', 'Zeitangabe'];
const SG_SEK = ['Subjekt', 'Prädikat', 'Akkusativobjekt', 'Dativobjekt', 'Genitivobjekt', 'Präpositionalobjekt', 'Prädikativ', 'Adverbial der Zeit', 'Adverbial des Ortes', 'Adverbial des Grundes', 'Adverbial der Art und Weise'];
const D4_SATZGLIEDER: PicGen[] = [
  gen(stripTask(DE_SG, ['Subjekt', 'Prädikat'], ...sgPrompt, SG_BASE), 1),
  gen(stripTask(DE_SG, ['Akkusativobjekt', 'Ortsangabe', 'Zeitangabe'], ...sgPrompt, SG_BASE), 2),
  gen(stripTask(DE_SG, ['Dativobjekt', 'Akkusativobjekt'], ...sgPrompt, SG_BASE), 3)
];
const D_SATZGLIEDER: PicGen[] = [
  gen(stripTask([...DE_SG.slice(0, 3), ...DE_SG_SEK], ['Subjekt', 'Akkusativobjekt', 'Dativobjekt'], ...sgPrompt, SG_SEK), 1),
  gen(stripTask(DE_SG_SEK, ['Genitivobjekt', 'Präpositionalobjekt', 'Prädikativ'], ...sgPrompt, SG_SEK), 2),
  gen(stripTask(DE_SG_SEK, ['Adverbial der Zeit', 'Adverbial des Ortes', 'Adverbial des Grundes', 'Adverbial der Art und Weise'], ...sgPrompt, SG_SEK), 3)
];

/* Zeitformen */
const DE_VERBS = [
  { pr: 'Ich spiele Fußball.', pt: 'Ich spielte Fußball.', pf: 'Ich habe Fußball gespielt.', fu: 'Ich werde Fußball spielen.', pq: 'Ich hatte Fußball gespielt.' },
  { pr: 'Sie liest ein Buch.', pt: 'Sie las ein Buch.', pf: 'Sie hat ein Buch gelesen.', fu: 'Sie wird ein Buch lesen.', pq: 'Sie hatte ein Buch gelesen.' },
  { pr: 'Wir schwimmen im See.', pt: 'Wir schwammen im See.', pf: 'Wir sind im See geschwommen.', fu: 'Wir werden im See schwimmen.', pq: 'Wir waren im See geschwommen.' },
  { pr: 'Er malt ein Bild.', pt: 'Er malte ein Bild.', pf: 'Er hat ein Bild gemalt.', fu: 'Er wird ein Bild malen.', pq: 'Er hatte ein Bild gemalt.' }
];
const TL_DE: [string, string, string] = ['Vergangenheit', 'jetzt', 'Zukunft'];
const TL_IT: [string, string, string] = ['passato', 'adesso', 'futuro'];
const tenseDe = (rng: Rng, level: Difficulty) => {
  const v = pick(rng, DE_VERBS);
  const when = level === 3 ? pick(rng, ['past', 'now', 'future', 'before-past'] as const) : pick(rng, ['past', 'now', 'future'] as const);
  const right = when === 'now' ? v.pr : when === 'future' ? v.fu : when === 'before-past' ? v.pq : level === 1 ? v.pt : pick(rng, [v.pt, v.pf]);
  const all = [v.pr, v.fu, v.pt, v.pf, v.pq].filter((s) => s !== right && !(when === 'past' && (s === v.pt || s === v.pf)));
  return choice({ prompt: L('Wann passiert es? Welcher Satz passt zum Zeitstrahl?', 'Quando succede? Quale frase tedesca va bene con la linea del tempo?'), pic: { id: 'zeitformen', when, labels: getLang() === 'it' ? TL_IT : TL_DE }, right, wrong: shuffle(rng, all), rng, hint: L('Die rote Linie ist „jetzt“. Liegt die Raute davor oder danach?', 'La linea rossa è «adesso». Il rombo è prima o dopo?'), explain: [right] });
};
const tenseName = (rng: Rng) => {
  const v = pick(rng, DE_VERBS);
  const k = pick(rng, ['pr', 'pt', 'pf', 'fu', 'pq'] as const);
  const names = { pr: 'Präsens', pt: 'Präteritum', pf: 'Perfekt', fu: 'Futur I', pq: 'Plusquamperfekt' };
  return choice({ prompt: L('In welcher Zeitform steht der Satz?', 'In quale tempo (tedesco) è la frase?'), pic: { id: 'satz', words: v[k].split(' ') }, right: names[k], wrong: Object.values(names), rng, hint: L('Schau auf das Verb und ein mögliches Hilfsverb (haben, sein, werden).', 'Guarda il verbo e l’eventuale ausiliare (haben, sein, werden).'), explain: [`${v[k]} → ${names[k]}`] });
};
const D4_ZEIT: PicGen[] = [gen(tenseDe, 1), gen(tenseDe, 2), gen(tenseName, 2), gen(tenseDe, 3), gen(tenseName, 3)];

/* Texte: Spannungskurve und wörtliche Rede */
const ARC_DE = ['Einleitung', 'Hauptteil', 'Höhepunkt', 'Schluss'];
const ARC_IT = ['introduzione', 'sviluppo', 'momento culminante', 'conclusione'];
const arc = (rng: Rng) => {
  const m = randInt(rng, 0, 3);
  const de = getLang() !== 'it';
  const lab = de ? ARC_DE : ARC_IT;
  return choice({ prompt: L('Welcher Teil einer Erzählung ist markiert?', 'Quale parte del racconto è segnata?'), pic: { id: 'spannung', mark: m, labels: lab }, right: lab[m]!, wrong: lab, rng, hint: L('Die Spannung steigt bis zum Höhepunkt und fällt dann ab.', 'La tensione sale fino al momento culminante e poi scende.'), explain: [L('Einleitung → Hauptteil → Höhepunkt → Schluss', 'introduzione → sviluppo → momento culminante → conclusione')] });
};
const SPEECH = [['Tim', 'Ich habe Hunger.'], ['Mia', 'Kommst du mit?'], ['Ben', 'Das ist toll!'], ['Lea', 'Wir gehen ins Kino.'], ['Opa', 'Es regnet schon wieder.']] as const;
const directSpeech = (rng: Rng) => {
  const [n, s] = pick(rng, SPEECH);
  const bare = s.replace(/[.!?]$/, '');
  const end = s.slice(-1);
  return choice({ prompt: L('Wie schreibt man die wörtliche Rede richtig?', 'Come si scrive correttamente il discorso diretto (in tedesco)?'), pic: { id: 'comic', text: s, name: n }, right: `${n} sagt: „${s}“`, wrong: [`${n} sagt: ${s}`, `${n} sagt „${bare}“${end}`, `${n} sagt: „${s.charAt(0).toLowerCase()}${s.slice(1)}“`], rng, hint: L('Doppelpunkt, Anführungszeichen unten und oben, Großschreibung am Anfang.', 'Due punti, virgolette in basso e in alto, maiuscola all’inizio.'), explain: [`${n} sagt: „${s}“`] });
};
const D_TEXTE_PRIM: PicGen[] = [gen(arc, 1), gen(directSpeech, 2), gen(arc, 2), gen(directSpeech, 3)];

/* Konjunktiv: indirekte Rede */
const KONJ: [string, string, string, string[], Difficulty][] = [
  ['Lena', 'Ich habe keine Zeit.', 'Lena sagt, sie habe keine Zeit.', ['Lena sagt, ich habe keine Zeit.', 'Lena sagt: sie hat keine Zeit.', 'Lena sagt, sie haben keine Zeit.'], 1],
  ['Jonas', 'Ich komme morgen.', 'Jonas sagt, er komme morgen.', ['Jonas sagt, ich komme morgen.', 'Jonas sagt, er kam morgen.', 'Jonas sagt, er kommen morgen.'], 1],
  ['Sara', 'Ich bin müde.', 'Sara sagt, sie sei müde.', ['Sara sagt, sie ist gewesen müde.', 'Sara sagt, ich bin müde.', 'Sara sagt, sie wäre gewesen.'], 2],
  ['Paul', 'Ich kann nicht schwimmen.', 'Paul sagt, er könne nicht schwimmen.', ['Paul sagt, er kann nicht schwimmen konnte.', 'Paul sagt, ich könne nicht schwimmen.', 'Paul sagt, er konnte nicht schwimmen.'], 2],
  ['Emma', 'Ich weiß es nicht.', 'Emma sagt, sie wisse es nicht.', ['Emma sagt, sie wusste es nicht.', 'Emma sagt, ich weiß es nicht.', 'Emma sagt, sie wissen es nicht.'], 2],
  ['Die Spieler', 'Wir haben gewonnen.', 'Die Spieler sagen, sie hätten gewonnen.', ['Die Spieler sagen, sie haben gewonnen hätten.', 'Die Spieler sagen, wir hätten gewonnen.', 'Die Spieler sagen, sie gewannen haben.'], 3],
  ['Die Kinder', 'Wir gehen ins Kino.', 'Die Kinder sagen, sie gingen ins Kino.', ['Die Kinder sagen, wir gingen ins Kino.', 'Die Kinder sagen, sie gegangen ins Kino.', 'Die Kinder sagen, sie gehe ins Kino.'], 3]
];
const D_KONJ: PicGen[] = KONJ.map(([n, s, r, w, lv]) => gen((rng) => choice({ prompt: L('Wie lautet der Satz in indirekter Rede (Konjunktiv)?', 'Come si trasforma la frase nel discorso indiretto tedesco (congiuntivo)?'), pic: { id: 'comic', text: s, name: n }, right: r, wrong: w, rng, hint: L('Pronomen anpassen und Konjunktiv I verwenden. Ist er gleich dem Indikativ, nimm Konjunktiv II.', 'Cambia il pronome e usa il congiuntivo I; se coincide con l’indicativo, usa il congiuntivo II.'), explain: [r] }), lv));

/* Gedichte: Reimschema */
const POEMS_DE: [string[], string][] = [
  [['Der Morgen kommt mit hellem Licht,', 'die Sonne zeigt ihr Gesicht.', 'Die Vögel singen laut im Baum,', 'vorbei ist nun der lange Traum.'], 'Paarreim (aabb)'],
  [['Im Garten blüht die Rose rot,', 'der Wind spielt leise mit dem Laub,', 'der Bäcker backt das frische Brot,', 'die Straße liegt im Sommerstaub.'], 'Kreuzreim (abab)'],
  [['Am Abend wird es still im Haus,', 'die Kerze flackert sacht,', 'es kommt die stille Nacht,', 'das Licht geht langsam aus.'], 'umarmender Reim (abba)']
];
const POEMS_IT: [string[], string][] = [
  [['Il sole scende piano sul mare,', 'le barche tornano a riposare.', 'Il vento canta una canzone,', 'e si accende ogni lampione.'], 'rima baciata (AABB)'],
  [['Nel prato corre il vento leggero,', 'il sole scalda la collina,', 'il cielo è limpido e sincero,', 'profuma l’aria di mattina.'], 'rima alternata (ABAB)'],
  [['Si spegne piano la città,', 'la luna guarda dal balcone,', 'risuona un’ultima canzone,', 'e il sonno arriva, chissà.'], 'rima incrociata (ABBA)']
];
const poem = (lang: 'de' | 'it') => (rng: Rng) => {
  const set = lang === 'de' ? POEMS_DE : POEMS_IT;
  const [lines, right] = pick(rng, set);
  return choice({ prompt: lang === 'de' ? L('Welches Reimschema hat die Strophe?', 'Quale schema di rime ha la strofa (tedesca)?') : L('Welches Reimschema hat die Strophe?', 'Quale schema di rime ha la strofa?'), pic: { id: 'gedicht', lines }, right, wrong: set.map((p) => p[1]), rng, hint: L('Vergleiche die letzten Wörter der Verse. Welche klingen gleich?', 'Confronta le ultime parole dei versi: quali suonano uguali?'), explain: [right] });
};
const FIG_DE: [Pic, string, string][] = [
  [obj('sonne'), 'Die Sonne lacht.', 'Personifikation'],
  [obj('zug'), 'Er ist schnell wie ein Zug.', 'Vergleich'],
  [obj('fuchs'), 'Max ist ein schlauer Fuchs.', 'Metapher'],
  [{ id: 'wetter', kind: 'wind' }, 'Der Wind flüstert in den Bäumen.', 'Personifikation'],
  [{ id: 'comic', text: 'Das habe ich dir schon tausendmal gesagt!', name: 'Mama' }, 'Das habe ich dir schon tausendmal gesagt!', 'Hyperbel (Übertreibung)']
];
const FIG_IT: [Pic, string, string][] = [
  [obj('sonne'), 'Il sole sorride.', 'personificazione'],
  [obj('zug'), 'È veloce come un treno.', 'similitudine'],
  [obj('fuchs'), 'Marco è una volpe.', 'metafora'],
  [{ id: 'wetter', kind: 'wind' }, 'Il vento sussurra tra gli alberi.', 'personificazione'],
  [{ id: 'comic', text: 'Te l’ho detto mille volte!', name: 'Mamma' }, 'Te l’ho detto mille volte!', 'iperbole']
];
const figure = (lang: 'de' | 'it') => (rng: Rng) => {
  const set = lang === 'de' ? FIG_DE : FIG_IT;
  const [pic, s, right] = pick(rng, set);
  const names = lang === 'de' ? ['Personifikation', 'Vergleich', 'Metapher', 'Hyperbel (Übertreibung)', 'Anapher'] : ['personificazione', 'similitudine', 'metafora', 'iperbole', 'anafora'];
  return choice({ prompt: lang === 'de' ? L(`„${s}“ – welches Stilmittel ist das?`, `«${s}» – quale figura retorica (tedesca) è?`) : L(`„${s}“ – welches Stilmittel ist das?`, `«${s}» – quale figura retorica è?`), pic, right, wrong: shuffle(rng, names), rng, hint: L('Wird etwas verglichen (wie), übertragen oder vermenschlicht?', 'C’è un paragone (come), un trasferimento di significato o qualcosa che diventa umano?'), explain: [right] });
};
const D_STIL: PicGen[] = [gen(figure('de'), 1), gen(poem('de'), 2), gen(figure('de'), 2), gen(poem('de'), 3)];

/* Literaturepochen */
const EPOCHS_DE: [number, number, string, string][] = [[1600, 1720, 'Barock', 'Andreas Gryphius'], [1720, 1785, 'Aufklärung', 'Gotthold Ephraim Lessing'], [1765, 1785, 'Sturm und Drang', 'der junge Goethe („Die Leiden des jungen Werthers“)'], [1786, 1832, 'Weimarer Klassik', 'Friedrich Schiller („Wilhelm Tell“)'], [1795, 1835, 'Romantik', 'Joseph von Eichendorff'], [1848, 1890, 'Realismus', 'Theodor Fontane'], [1880, 1900, 'Naturalismus', 'Gerhart Hauptmann'], [1905, 1925, 'Expressionismus', 'Georg Heym'], [1945, 1967, 'Nachkriegsliteratur', 'Wolfgang Borchert']];
const EPOCHS_IT: [number, number, string, string][] = [[1270, 1310, 'Dolce stil novo', 'Guido Guinizzelli'], [1400, 1490, 'Umanesimo', 'Angelo Poliziano'], [1490, 1600, 'Rinascimento', 'Ludovico Ariosto'], [1600, 1690, 'Barocco', 'Giambattista Marino'], [1715, 1790, 'Illuminismo', 'Carlo Goldoni'], [1815, 1860, 'Romanticismo', 'Alessandro Manzoni'], [1870, 1900, 'Verismo', 'Giovanni Verga'], [1885, 1920, 'Decadentismo', 'Giovanni Pascoli'], [1943, 1955, 'Neorealismo', 'Elio Vittorini']];
const epoch = (set: [number, number, string, string][], from: number, to: number, author: boolean) => (rng: Rng) => {
  const i = randInt(rng, 0, set.length - 1);
  const [a, b, name, who] = set[i]!;
  const pic: Pic = { id: 'zeitleiste', from, to, bands: [{ from: a, to: b, label: name }], markBand: 0 };
  return author
    ? choice({ prompt: L('Welcher Autor gehört zur markierten Epoche?', 'Quale autore appartiene al periodo evidenziato?'), pic, right: who, wrong: shuffle(rng, set.filter((x) => x[2] !== name).map((x) => x[3])), rng, hint: L('Bestimme zuerst die Epoche über die Jahreszahlen.', 'Prima individua il periodo dagli anni.'), explain: [`${name} (${a}–${b}): ${who}`] })
    : choice({ prompt: L(`Welche Epoche liegt etwa zwischen ${a} und ${b}?`, `Quale periodo si colloca circa tra il ${a} e il ${b}?`), pic, right: name, wrong: shuffle(rng, set.filter((x) => x[2] !== name).map((x) => x[2])), rng, hint: L('Lies die Jahreszahlen auf dem Zeitstrahl.', 'Leggi gli anni sulla linea del tempo.'), explain: [`${name}: ${a}–${b}`] });
};
const D_EPOCHEN: PicGen[] = [gen(epoch(EPOCHS_DE, 1580, 1980, false), 1), gen(epoch(EPOCHS_DE, 1580, 1980, false), 2), gen(epoch(EPOCHS_DE, 1580, 1980, true), 3)];

const dasDass = (rng: Rng) => {
  const items: [string, string, string][] = [
    ['Ich hoffe, ___ du morgen kommst.', 'dass', 'Konjunktion: Man kann „das“ nicht durch „dieses/welches“ ersetzen.'],
    ['Das Buch, ___ auf dem Tisch liegt, gehört mir.', 'das', 'Relativpronomen: Man kann „welches“ einsetzen.'],
    ['___ Fahrrad ist neu.', 'Das', 'Artikel vor einem Nomen.'],
    ['Er sagt, ___ es regnet.', 'dass', 'Konjunktion nach einem Verb des Sagens.'],
    ['Weißt du, ___ ich dich mag?', 'dass', 'Konjunktion: leitet einen Nebensatz ein.']
  ];
  const [s, a, ex] = pick(rng, items);
  return choice({ prompt: L('Welches Wort fehlt?', 'Quale parola manca (tedesco)?'), pic: { id: 'comic', text: s, name: 'Lara' }, right: a, wrong: a === 'Das' ? ['Dass', 'Daß'] : a === 'das' ? ['dass', 'daß'] : ['das', 'daß'], rng, hint: L('Kannst du „dieses“ oder „welches“ einsetzen? Dann „das“.', 'Puoi sostituire con «dieses» o «welches»? Allora «das».'), explain: [s.replace('___', a), ex] });
};
const D_RECHT_SEK: PicGen[] = [spelling(1, 'de', () => true), gen(dasDass, 2), gen(dasDass, 3), spelling(2, 'de', (x) => x.de.syl.length >= 2)];

/* ---------- Italiano primaria e medie ---------- */
const itName = (y: Word) => y.it.w;
const itArt = (y: Word) => (y.it.art === 'l’' ? `l’${y.it.w}` : `${y.it.art} ${y.it.w}`);
const IT1_LETTERE: PicGen[] = [
  gen((rng) => {
    const x = pick(rng, WORDS);
    const a = x.it.w.charAt(0).toUpperCase();
    return choice({ prompt: L('Mit welchem Buchstaben beginnt das italienische Wort?', 'Con quale lettera inizia la parola?'), pic: obj(x.name), right: a, wrong: sample(rng, 'ABCDEFGLMNOPRSTUV'.split('').filter((l) => l !== a), 3), rng, big: true, hint: L('Sprich das Wort langsam.', 'Pronuncia la parola lentamente: che suono senti all’inizio?'), explain: [`${x.it.w} – ${a}`] });
  }, 1),
  gen((rng) => {
    const x = pick(rng, WORDS);
    const a = x.it.w.charAt(0).toUpperCase();
    return pickPicture({ prompt: L(`Welches Bild beginnt auf Italienisch mit ${a}?`, `Quale immagine inizia con ${a}?`), right: opt(x, itName), wrong: others(rng, x, 3, (y) => y.it.w.charAt(0).toUpperCase() !== a).map((y) => opt(y, itName)), rng, explain: [`${x.it.w} – ${a}`] });
  }, 2),
  gen((rng) => {
    const x = pick(rng, WORDS.filter((y) => y.it.syl.length >= 2));
    const s = x.it.syl[0]!;
    const wrong = shuffle(rng, WORDS.map((y) => y.it.syl[0]!).filter((z) => z !== s && z.charAt(0) !== s.charAt(0)));
    return choice({ prompt: L('Mit welcher Silbe beginnt das italienische Wort?', 'Con quale sillaba inizia la parola?'), pic: obj(x.name), right: s.toUpperCase(), wrong: [...new Set(wrong.map((z) => z.toUpperCase()))], rng, big: true, explain: [x.it.syl.join(' - ')] });
  }, 3)
];
const IT1_SILLABE: PicGen[] = [gen((rng) => sylCount(rng, 'it', 1), 1), gen((rng) => sylCount(rng, 'it', 2), 2), gen((rng) => sylPick(rng, 'it'), 3)];
const IT2_ORTO: PicGen[] = [spelling(1, 'it', (x) => x.it.syl.length <= 2), spelling(2, 'it', () => true), spelling(3, 'it', (x) => x.it.syl.length >= 3)];

const ACCA: [Pic, string, string, string[], Difficulty][] = [
  [obj('hund'), 'Luca ___ un cane.', 'ha', ['a'], 1],
  [obj('buch'), 'Regalo un libro ___ Sara.', 'a', ['ha'], 1],
  [obj('ball'), 'Io ___ una palla rossa.', 'ho', ['o'], 1],
  [obj('apfel'), 'Vuoi una mela ___ una banana?', 'o', ['ho'], 2],
  [{ id: 'viele', name: 'katze', n: 2 }, 'I bambini ___ due gatti.', 'hanno', ['anno'], 2],
  [obj('kuchen'), 'Oggi Anna compie un ___ in più.', 'anno', ['hanno'], 2],
  [obj('fahrrad'), 'Tu ___ una bicicletta nuova?', 'hai', ['ai'], 2],
  [obj('baum'), 'Andiamo ___ giardini.', 'ai', ['hai'], 3],
  [obj('katze'), 'Il gatto ___ sul divano.', 'è', ['e'], 3],
  [{ id: 'objreihe', names: ['hund', 'katze'] }, 'Il cane ___ il gatto giocano.', 'e', ['è'], 3],
  [obj('uhr'), 'Sbrigati, ___ tardi!', 'è', ['e'], 3]
];
const IT2_ACCA: PicGen[] = ACCA.map(([pic, s, a, w, lv]) => gen((rng) => choice({ prompt: L(`Welches Wort fehlt? „${s}“`, `Quale parola manca? «${s}»`), pic, right: a, wrong: w, rng, big: true, hint: L('Verb „avere“ mit h, sonst ohne h. „è“ = ist.', 'Se puoi sostituire con «aveva/avevo», ci vuole l’h. «È» con l’accento è il verbo essere.'), explain: [s.replace('___', a)] }), lv));

const IT_TENSE = [
  { pr: 'Io gioco a calcio.', pa: 'Io ho giocato a calcio.', fu: 'Io giocherò a calcio.' },
  { pr: 'Marta legge un libro.', pa: 'Marta ha letto un libro.', fu: 'Marta leggerà un libro.' },
  { pr: 'Noi nuotiamo nel lago.', pa: 'Noi abbiamo nuotato nel lago.', fu: 'Noi nuoteremo nel lago.' }
];
const IT3_GRAM: PicGen[] = [
  gen((rng) => {
    const x = pick(rng, REGULAR);
    return choice({ prompt: L('Welcher italienische Artikel passt?', 'Quale articolo va bene?'), pic: obj(x.name), right: x.it.art, wrong: ['il', 'lo', 'la', 'l’'], rng, big: true, hint: L('Männlich oder weiblich? Beginnt das Wort mit einem Vokal?', 'Maschile o femminile? La parola inizia con una vocale?'), explain: [itArt(x)] });
  }, 1),
  gen((rng) => {
    const x = pick(rng, REGULAR);
    const pl = x.it.pl;
    const variants = [x.it.w, pl.replace(/i$/, 'e'), pl.replace(/e$/, 'i'), x.it.w + 's', pl.replace(/he$/, 'e').replace(/hi$/, 'i')].filter((v) => v !== pl);
    return choice({ prompt: L('Wie heißt die Mehrzahl auf Italienisch?', 'Come si dice al plurale?'), pic: { id: 'viele', name: x.name, n: 3 }, right: `tre ${pl}`, wrong: shuffle(rng, [...new Set(variants)]).map((v) => `tre ${v}`), rng, hint: L(`Einzahl: ${itArt(x)}`, `Singolare: ${itArt(x)}`), explain: [`${itArt(x)} → ${pl}`] });
  }, 2),
  gen((rng) => {
    const v = pick(rng, IT_TENSE);
    const when = pick(rng, ['past', 'now', 'future'] as const);
    const right = when === 'past' ? v.pa : when === 'now' ? v.pr : v.fu;
    return choice({ prompt: L('Welcher Satz passt zum Zeitstrahl?', 'Quale frase va bene con la linea del tempo?'), pic: { id: 'zeitformen', when, labels: getLang() === 'it' ? TL_IT : TL_DE }, right, wrong: [v.pa, v.pr, v.fu], rng, hint: L('Rot ist „jetzt“.', 'La linea rossa è «adesso»: il rombo è prima o dopo?'), explain: [right] });
  }, 3)
];

const IT_GRAM_DATA: Tagged[] = [
  [['Il', 'piccolo', 'gatto', 'dorme', 'sotto', 'il', 'tavolo.'], ['articolo', 'aggettivo', 'nome', 'verbo', 'preposizione', 'articolo', 'nome']],
  [['Noi', 'mangiamo', 'sempre', 'la', 'pizza', 'e', 'la', 'frutta.'], ['pronome', 'verbo', 'avverbio', 'articolo', 'nome', 'congiunzione', 'articolo', 'nome']],
  [['Marco', 'legge', 'un', 'libro', 'molto', 'bello.'], ['nome', 'verbo', 'articolo', 'nome', 'avverbio', 'aggettivo']],
  [['Lei', 'corre', 'velocemente', 'nel', 'parco.'], ['pronome', 'verbo', 'avverbio', 'preposizione', 'nome']],
  [['Quella', 'casa', 'rossa', 'ha', 'un', 'giardino', 'ma', 'non', 'ha', 'il', 'garage.'], ['aggettivo', 'nome', 'aggettivo', 'verbo', 'articolo', 'nome', 'congiunzione', 'avverbio', 'verbo', 'articolo', 'nome']]
];
const IT_PARTS = ['nome', 'articolo', 'aggettivo', 'verbo', 'avverbio', 'preposizione', 'congiunzione', 'pronome'];
const itgPrompt = ['Welche Wortart ist markiert (analisi grammaticale)?', 'Analisi grammaticale: che parte del discorso è la parola evidenziata?'] as const;
const IT6_GRAM: PicGen[] = [
  gen(stripTask(IT_GRAM_DATA, ['nome', 'verbo', 'articolo'], ...itgPrompt, IT_PARTS), 1),
  gen(stripTask(IT_GRAM_DATA, ['aggettivo', 'pronome', 'preposizione'], ...itgPrompt, IT_PARTS), 2),
  gen(stripTask(IT_GRAM_DATA, ['avverbio', 'congiunzione', 'preposizione'], ...itgPrompt, IT_PARTS), 3)
];
const IT_LOG_DATA: Tagged[] = [
  [['Il gatto', 'dorme', 'sul divano.'], ['soggetto', 'predicato verbale', 'complemento di stato in luogo']],
  [['Marta', 'regala', 'un libro', 'a suo fratello.'], ['soggetto', 'predicato verbale', 'complemento oggetto', 'complemento di termine']],
  [['Il libro', 'di Luca', 'è interessante.'], ['soggetto', 'complemento di specificazione', 'predicato nominale']],
  [['Domani', 'partiremo', 'per Roma.'], ['complemento di tempo', 'predicato verbale', 'complemento di moto a luogo']],
  [['Gli studenti', 'ascoltano', 'la lezione', 'con attenzione.'], ['soggetto', 'predicato verbale', 'complemento oggetto', 'complemento di modo']],
  [['La finestra', 'è stata rotta', 'dal vento.'], ['soggetto', 'predicato verbale', 'complemento di causa efficiente']],
  [['Paolo', 'è un bravo medico.'], ['soggetto', 'predicato nominale']],
  [['Esco', 'con gli amici.'], ['predicato verbale', 'complemento di compagnia']],
  [['La casa', 'dei nonni', 'è', 'in montagna.'], ['soggetto', 'complemento di specificazione', 'predicato verbale', 'complemento di stato in luogo']]
];
const IT_LOG = ['soggetto', 'predicato verbale', 'predicato nominale', 'complemento oggetto', 'complemento di termine', 'complemento di specificazione', 'complemento di stato in luogo', 'complemento di moto a luogo', 'complemento di tempo', 'complemento di modo', 'complemento di compagnia', 'complemento di causa efficiente'];
const itlPrompt = ['Welches Satzglied ist markiert (analisi logica)?', 'Analisi logica: che cosa è la parte evidenziata?'] as const;
const IT7_LOG: PicGen[] = [
  gen(stripTask(IT_LOG_DATA, ['soggetto', 'predicato verbale', 'complemento oggetto'], ...itlPrompt, IT_LOG), 1),
  gen(stripTask(IT_LOG_DATA, ['complemento di termine', 'complemento di specificazione', 'predicato nominale', 'complemento di stato in luogo'], ...itlPrompt, IT_LOG), 2),
  gen(stripTask(IT_LOG_DATA, ['complemento di moto a luogo', 'complemento di tempo', 'complemento di modo', 'complemento di compagnia', 'complemento di causa efficiente'], ...itlPrompt, IT_LOG), 3)
];
const IT9_RET: PicGen[] = [gen(figure('it'), 1), gen(poem('it'), 2), gen(figure('it'), 2), gen(poem('it'), 3)];
const IT10_LETT: PicGen[] = [gen(epoch(EPOCHS_IT, 1250, 1970, false), 1), gen(epoch(EPOCHS_IT, 1250, 1970, false), 2), gen(epoch(EPOCHS_IT, 1250, 1970, true), 3)];

/* ---------- English ---------- */
const NUM_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];
const enPlural = (w: string) => (w === 'fish' ? 'fish' : /(sh|ch|x|s)$/.test(w) ? w + 'es' : /[^aeiou]y$/.test(w) ? w.slice(0, -1) + 'ies' : w === 'tomato' ? 'tomatoes' : w + 's');
const howMany = (rng: Rng, level: Difficulty) => {
  const x = pick(rng, WORDS.filter((y) => y.name !== 'brille' && y.en !== 'fish'));
  const n = randInt(rng, 2, level === 1 ? 4 : 6);
  const right = `${NUM_EN[n]} ${enPlural(x.en)}`;
  const wrong = [`${NUM_EN[n]} ${x.en}`, `${NUM_EN[n === 2 ? 3 : n - 1]} ${enPlural(x.en)}`, `${NUM_EN[Math.min(6, n + 1)]} ${enPlural(x.en)}`];
  return choice({ prompt: 'How many can you see?', pic: { id: 'viele', name: x.name, n }, right, wrong, rng, hint: L('Zähle genau. Ab zwei: Mehrzahl mit -s.', 'Conta bene. Da due in su: plurale con -s.'), explain: [right] });
};
const WEATHER: [string, string][] = [['sonnig', 'It’s sunny.'], ['regen', 'It’s rainy.'], ['schnee', 'It’s snowy.'], ['wolkig', 'It’s cloudy.'], ['gewitter', 'It’s stormy.'], ['wind', 'It’s windy.'], ['nebel', 'It’s foggy.']];
const weatherEn = (rng: Rng) => {
  const [k, s] = pick(rng, WEATHER);
  return choice({ prompt: 'What’s the weather like?', pic: { id: 'wetter', kind: k }, right: s, wrong: shuffle(rng, WEATHER.map((x) => x[1])), rng, hint: L('sun = Sonne, rain = Regen, snow = Schnee, cloud = Wolke, wind = Wind, fog = Nebel', 'sun = sole, rain = pioggia, snow = neve, cloud = nuvola, wind = vento, fog = nebbia'), explain: [s] });
};
const FEEL: [string, string][] = [['froh', 'happy'], ['traurig', 'sad'], ['wuetend', 'angry'], ['ueberrascht', 'surprised'], ['aengstlich', 'scared'], ['muede', 'tired']];
const feelEn = (rng: Rng) => {
  const [k, s] = pick(rng, FEEL);
  return choice({ prompt: 'How does he feel?', pic: { id: 'gesicht', mood: k }, right: `He is ${s}.`, wrong: shuffle(rng, FEEL.map((x) => `He is ${x[1]}.`)), rng, hint: L('Schau auf Augen, Augenbrauen und Mund.', 'Guarda occhi, sopracciglia e bocca.'), explain: [`He is ${s}.`] });
};
const prepEn = (rng: Rng, level: Difficulty) => {
  const keys = level <= 2 ? ['auf', 'unter', 'in', 'neben'] : Object.keys(PREP_EN);
  const k = pick(rng, keys);
  const obj2 = k === 'unter' ? 'the table' : k === 'zwischen' ? 'the boxes' : 'the box';
  return choice({ prompt: 'Where is the cat?', pic: { id: 'praeposition', pos: k }, right: `The cat is ${PREP_EN[k]} ${obj2}.`, wrong: shuffle(rng, keys.filter((x) => x !== k)).map((x) => `The cat is ${PREP_EN[x]} ${obj2}.`), rng, hint: L('on = auf, under = unter, in = in, next to = neben, behind = hinter, in front of = vor, between = zwischen', 'on = sopra, under = sotto, in = dentro, next to = accanto, behind = dietro, in front of = davanti, between = tra'), explain: [`The cat is ${PREP_EN[k]} ${obj2}.`] });
};
const clockEn = (rng: Rng) => {
  const h = randInt(rng, 1, 11);
  const m = pick(rng, [0, 15, 30, 45]);
  const say = (hh: number, mm: number) => (mm === 0 ? `It’s ${NUM_WORD[hh]} o’clock.` : mm === 30 ? `It’s half past ${NUM_WORD[hh]}.` : mm === 15 ? `It’s quarter past ${NUM_WORD[hh]}.` : `It’s quarter to ${NUM_WORD[hh % 12 + 1]}.`);
  const right = say(h, m);
  const wrong = [say(h, (m + 30) % 60), say(h % 12 + 1, m), say(h, m === 15 ? 45 : m === 45 ? 15 : m === 0 ? 30 : 0)];
  return { ...choice({ prompt: 'What time is it?', pic: { id: 'obj', name: 'uhr' }, right, wrong, rng, hint: L('half past = halb nach, quarter past = Viertel nach, quarter to = Viertel vor', 'half past = e mezza, quarter past = e un quarto, quarter to = meno un quarto'), explain: [right] }), visual: { kind: 'clock' as const, hours: h, minutes: m } };
};
const NUM_WORD = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const E_BASIS: PicGen[] = [gen(wordForPicture('en'), 1), gen(howMany, 1), gen(weatherEn, 2), gen(feelEn, 2), gen(howMany, 2), gen(prepEn, 3), gen(clockEn, 3)];
const EN_VOCAB: PicGen[] = [
  gen(readAndPick('en'), 1),
  gen(wordForPicture('en'), 2),
  gen(weatherEn, 2),
  gen((rng) => {
    const groups = [['katze', 'hund', 'kuh', 'hase', 'fuchs'], ['apfel', 'banane', 'tomate', 'kuchen'], ['auto', 'zug', 'boot', 'fahrrad'], ['tisch', 'stuhl', 'lampe', 'uhr']];
    const gi = randInt(rng, 0, groups.length - 1);
    const three = sample(rng, groups[gi]!, 3);
    const odd = pick(rng, groups.filter((_, i) => i !== gi).flat());
    const names = shuffle(rng, [...three, odd]);
    const en = (n: string) => word(n).en;
    return choice({ prompt: 'Which word does not belong?', pic: { id: 'objreihe', names, labels: names.map(en) }, right: en(odd), wrong: three.map(en), rng, hint: L('Drei Dinge gehören zu einer Gruppe (Tiere, Essen, Fahrzeuge, Möbel).', 'Tre cose appartengono a un gruppo (animali, cibo, veicoli, mobili).'), explain: [`${en(odd)} ≠ ${three.map(en).join(', ')}`] });
  }, 3),
  gen(feelEn, 3)
];
const EN_TENSE = [
  { v: 'play', s: 'I play football.', pa: 'I played football.', fu: 'I will play football.', pc: 'I am playing football.', pac: 'I was playing football.', pp: 'I had played football.' },
  { v: 'read', s: 'She reads a book.', pa: 'She read a book.', fu: 'She will read a book.', pc: 'She is reading a book.', pac: 'She was reading a book.', pp: 'She had read a book.' },
  { v: 'swim', s: 'We swim in the lake.', pa: 'We swam in the lake.', fu: 'We will swim in the lake.', pc: 'We are swimming in the lake.', pac: 'We were swimming in the lake.', pp: 'We had swum in the lake.' },
  { v: 'cook', s: 'He cooks dinner.', pa: 'He cooked dinner.', fu: 'He will cook dinner.', pc: 'He is cooking dinner.', pac: 'He was cooking dinner.', pp: 'He had cooked dinner.' }
];
const TL_EN: [string, string, string] = ['past', 'now', 'future'];
const tenseEn = (rng: Rng, level: Difficulty) => {
  const v = pick(rng, EN_TENSE);
  const opts = level === 1 ? (['pa', 'pc', 'fu'] as const) : level === 2 ? (['pa', 'pc', 'fu', 'pac'] as const) : (['pa', 'pc', 'fu', 'pac', 'pp'] as const);
  const k = pick(rng, opts);
  const when = k === 'pa' ? 'past' : k === 'pac' ? 'past' : k === 'pp' ? 'before-past' : k === 'fu' ? 'future' : 'now';
  const span = k === 'pc' || k === 'pac';
  const right = v[k];
  const all = (['s', 'pa', 'fu', 'pc', 'pac', 'pp'] as const).filter((x) => x !== k && !(k === 'pc' && x === 's')).map((x) => v[x]);
  return choice({ prompt: 'Which sentence matches the timeline?', pic: { id: 'zeitformen', when, span, labels: TL_EN }, right, wrong: shuffle(rng, all), rng, hint: L('Ein langer Balken bedeutet: Die Handlung dauert gerade an (-ing).', 'Una barra lunga significa: l’azione è in corso (-ing).'), explain: [right] });
};
const EN_TENSES: PicGen[] = [gen(tenseEn, 1), gen(tenseEn, 2), gen(tenseEn, 3)];

const COMP: [string, string, string, string][] = [['baum', 'tall', 'taller', 'the tallest'], ['haus', 'big', 'bigger', 'the biggest'], ['hund', 'small', 'smaller', 'the smallest'], ['kuchen', 'big', 'bigger', 'the biggest']];
const compare = (rng: Rng, level: Difficulty) => {
  const [n, pos, cmp, sup] = pick(rng, COMP);
  const sizes = [0.55, 0.78, 1];
  const small = pos === 'small';
  if (level === 1) return choice({ prompt: small ? 'Which one is the smallest?' : `Which one is ${sup}?`, pic: { id: 'groessen', name: n, sizes }, right: small ? 'A' : 'C', wrong: ['A', 'B', 'C'], rng, big: true, hint: L('Vergleiche die Größen.', 'Confronta le grandezze.'), explain: [small ? 'A' : 'C'] });
  if (level === 2) return choice({ prompt: small ? 'A is ___ than B.' : `C is ___ than B.`, pic: { id: 'groessen', name: n, sizes }, right: cmp, wrong: [pos, sup, `more ${pos}`], rng, hint: L('Vergleich von zwei Dingen: -er + than.', 'Confronto tra due cose: -er + than.'), explain: [`${small ? 'A' : 'C'} is ${cmp} than B.`] });
  return choice({ prompt: small ? 'A is ___ of all.' : 'C is ___ of all.', pic: { id: 'groessen', name: n, sizes }, right: sup, wrong: [cmp, `the most ${pos}`, `${sup.replace('the ', '')}er`], rng, hint: L('Superlativ: the + -est.', 'Superlativo: the + -est.'), explain: [`${small ? 'A' : 'C'} is ${sup} of all.`] });
};
const aAn = (rng: Rng) => {
  const x = pick(rng, WORDS.filter((y) => y.name !== 'brille'));
  const a = /^[aeiou]/.test(x.en) ? 'an' : 'a';
  return choice({ prompt: `This is ___ ${x.en}.`, pic: obj(x.name), right: a, wrong: [a === 'a' ? 'an' : 'a', 'the a'], rng, big: true, hint: L('„an“ vor einem Vokal-Laut (a, e, i, o, u).', '«an» davanti a un suono vocalico (a, e, i, o, u).'), explain: [`This is ${a} ${x.en}.`] });
};
const EN_GRAMMAR: PicGen[] = [gen(aAn, 1), gen(compare, 1), gen(compare, 2), gen(prepEn, 2), gen(compare, 3), gen(prepEn, 3)];

const SIGNS: [string, 'info' | 'warn' | 'stop', string, string[], Difficulty][] = [
  ['NO SWIMMING', 'stop', 'You must not swim here.', ['You can swim here.', 'The pool is open.', 'Swimming lessons today.'], 1],
  ['EXIT', 'info', 'This is the way out.', ['This is the way in.', 'The door is broken.', 'Please wait here.'], 1],
  ['WET PAINT', 'warn', 'Don’t touch, the paint is not dry.', ['The paint is for sale.', 'Please paint here.', 'The floor is wet.'], 2],
  ['KEEP OFF\nTHE GRASS', 'warn', 'Don’t walk on the grass.', ['Cut the grass.', 'Sit on the grass.', 'The grass is new.'], 2],
  ['CLOSED\nON MONDAYS', 'info', 'The shop is not open on Mondays.', ['The shop opens on Mondays.', 'The shop is closed today only.', 'Mondays are free.'], 2],
  ['PLEASE KNOCK\nBEFORE ENTERING', 'info', 'Knock on the door before you go in.', ['Do not enter.', 'Ring the bell twice.', 'The door is always open.'], 3],
  ['STAFF ONLY', 'stop', 'Only people who work here can go in.', ['Everyone is welcome.', 'Staff must leave.', 'This is a staff party.'], 3]
];
const ticket = (rng: Rng, level: Difficulty) => {
  const h = randInt(rng, 7, 18), m = pick(rng, [5, 10, 15, 20, 25, 35, 40, 45, 50]);
  const dur = level === 3 ? randInt(rng, 65, 140) : 60;
  const arrMin = h * 60 + m + dur;
  const t = (x: number) => `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
  const platform = randInt(rng, 1, 9);
  const pic: Pic = { id: 'fahrkarte', title: 'TRAIN TICKET', rows: [['From', 'Brighton'], ['To', 'Oxford'], ['Departure', t(h * 60 + m)], ['Arrival', t(arrMin)], ['Platform', String(platform)]] };
  if (level === 1) return choice({ prompt: 'Which platform does the train leave from?', pic, right: `Platform ${platform}`, wrong: [`Platform ${platform % 9 + 1}`, `Platform ${(platform + 3) % 9 + 1}`, `Platform ${(platform + 5) % 9 + 1}`], rng, hint: L('Suche das Wort „Platform“ (Gleis).', 'Cerca la parola «Platform» (binario).'), explain: [`Platform ${platform}`] });
  if (level === 2) return choice({ prompt: 'When does the train arrive in Oxford?', pic, right: t(arrMin), wrong: [t(h * 60 + m), t(arrMin + 30), t(arrMin - 15)], rng, hint: L('„Arrival“ heißt Ankunft.', '«Arrival» significa arrivo.'), explain: [`Arrival: ${t(arrMin)}`] });
  const hh = Math.floor(dur / 60), mm = dur % 60;
  const say = (a: number, b: number) => `${a} hour${a === 1 ? '' : 's'}${b ? ` and ${b} minutes` : ''}`;
  return choice({ prompt: 'How long is the journey?', pic, right: say(hh, mm), wrong: [say(hh, (mm + 10) % 60), say(hh + 1, mm), say(Math.max(1, hh - 1) === hh ? hh + 2 : Math.max(1, hh - 1), mm)], rng, hint: L('Rechne von der Abfahrt bis zur Ankunft.', 'Calcola dalla partenza all’arrivo.'), explain: [`${t(h * 60 + m)} → ${t(arrMin)} = ${say(hh, mm)}`] });
};
const EN_READING: PicGen[] = [
  ...SIGNS.map(([text, kind, right, wrong, lv]) => gen((rng) => choice({ prompt: 'What does the sign mean?', pic: { id: 'schild', text, kind }, right, wrong, rng, hint: L('Lies das Schild Wort für Wort.', 'Leggi il cartello parola per parola.'), explain: [right] }), lv)),
  gen(ticket, 1), gen(ticket, 2), gen(ticket, 3)
];

/* Nach Modul-ID */
export const LANGUAGE_PICS: PicBank = {
  'd1-anlaute': D1_ANLAUTE, 'd1-silben': D1_SILBEN, 'd1-woerter': D1_WOERTER, 'd1-lesen': D1_LESEN,
  'd2-abc': D2_ABC, 'd2-lesen': D2_LESEN, 'd2-nomen': D2_NOMEN, 'd2-rechtschreibung': D2_RECHT,
  'd3-mehrzahl': D3_MEHRZAHL, 'd3-texte': D_TEXTE_PRIM, 'd3-wortarten': D3_WORTARTEN,
  'd4-satzglieder': D4_SATZGLIEDER, 'd4-texte': D_TEXTE_PRIM, 'd4-zeitformen': D4_ZEIT,
  'd-wortarten-sek': D_WORTARTEN_SEK, 'd-satzglieder': D_SATZGLIEDER, 'd-rechtschreibung-sek': D_RECHT_SEK,
  'd-konjunktiv': D_KONJ, 'd-texte': [gen(arc, 1), gen(directSpeech, 1), gen(arc, 2), gen(figure('de'), 3), gen(arc, 3)], 'd-stilmittel': D_STIL, 'd-epochen': D_EPOCHEN,
  'it1-lettere': IT1_LETTERE, 'it1-sillabe': IT1_SILLABE, 'it2-ortografia': IT2_ORTO, 'it2-acca': IT2_ACCA, 'it3-grammatica': IT3_GRAM,
  'it6-grammaticale': IT6_GRAM, 'it7-logica': IT7_LOG, 'it9-retorica': IT9_RET, 'it10-letteratura': IT10_LETT,
  'e-basis': E_BASIS, 'en-vocab': EN_VOCAB, 'en-tenses': EN_TENSES, 'en-grammar': EN_GRAMMAR, 'en-reading': EN_READING
};
