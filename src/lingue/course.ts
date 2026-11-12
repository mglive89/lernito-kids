import type { ChoiceTask, LearningModule, MemoryTask, Rng, SentenceTask, SpeakTask, StudyCard, Task } from '../learning/types';
import { getLang, L, type Lang } from '../i18n';
import { UNITS, type CourseLang, type Entry, type Unit } from './data';

/** Sprachkurse: kurze Einheiten mit Hören, Verstehen, Sätze bauen und Sprechen. */
export interface Course {
  id: CourseLang;
  flag: string;
  /** Sprache für Vorlesen und Spracherkennung */
  locale: string;
  name: () => string;
  /** Eigener Name der Sprache („English“, „Français“ …) */
  native: string;
}

export const COURSES: Course[] = [
  { id: 'en', flag: '🇬🇧', locale: 'en-GB', native: 'English', name: () => L('Englisch', 'Inglese') },
  { id: 'de', flag: '🇩🇪', locale: 'de-DE', native: 'Deutsch', name: () => L('Deutsch', 'Tedesco') },
  { id: 'it', flag: '🇮🇹', locale: 'it-IT', native: 'Italiano', name: () => L('Italienisch', 'Italiano') },
  { id: 'fr', flag: '🇫🇷', locale: 'fr-FR', native: 'Français', name: () => L('Französisch', 'Francese') },
  { id: 'es', flag: '🇪🇸', locale: 'es-ES', native: 'Español', name: () => L('Spanisch', 'Spagnolo') }
];

export const courseById = (id: string | undefined) => COURSES.find((c) => c.id === id);

/** Kurse, die zur App-Sprache passen (die eigene Sprache wird nicht angeboten). */
export const coursesFor = (lang: Lang) => COURSES.filter((c) => c.id !== lang);

export const courseSubject = (c: CourseLang) => `lingua-${c}`;
export const unitModuleId = (c: CourseLang, unit: string) => `lingua-${c}-${unit}`;

/** Kurs zu einer Modul-ID (z. B. „lingua-en-animali“ → en) */
export function courseOfModule(m: Pick<LearningModule, 'id' | 'area'>): Course | undefined {
  if (m.area !== 'lingue') return undefined;
  return courseById(m.id.split('-')[1]);
}

/* ---------- Hilfen ---------- */

function shuffle<T>(a: T[], rng: Rng): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [r[i], r[j]] = [r[j]!, r[i]!]; }
  return r;
}
const pickN = <T,>(a: T[], n: number, rng: Rng) => shuffle(a, rng).slice(0, n);

/** Wörter eines Satzes für die Wortkärtchen (ohne Satzzeichen). */
export function tokens(sentence: string): string[] {
  return sentence
    .split(/\s+/)
    .map((w) => w.replace(/^[¿¡«»"“„(]+|[.,!?;:«»"”)]+$/g, ''))
    .filter((w) => w.length > 0 && /[\p{L}\p{N}]/u.test(w));
}

const q = (s: string) => (getLang() === 'it' ? `«${s}»` : `„${s}“`);

/** Ablenker: andere Einträge mit anderem Text in beiden Sprachen */
function distractors(all: Entry[], right: Entry, t: CourseLang, n: Lang, count: number, rng: Rng): Entry[] {
  const seen = new Set([right[t].toLowerCase(), right[n].toLowerCase()]);
  const emojis = new Set([right.emoji]);
  const out: Entry[] = [];
  for (const e of shuffle(all, rng)) {
    if (out.length >= count) break;
    if (e === right || seen.has(e[t].toLowerCase()) || seen.has(e[n].toLowerCase()) || emojis.has(e.emoji)) continue;
    seen.add(e[t].toLowerCase()); seen.add(e[n].toLowerCase()); emojis.add(e.emoji);
    out.push(e);
  }
  return out;
}

/* ---------- Aufgaben ---------- */

interface Ctx { unit: Unit; course: Course; t: CourseLang; n: Lang; rng: Rng; k: number }
const id = (c: Ctx, kind: string) => `${c.unit.id}-${kind}-${c.k++}`;

/** Bild wählen: „Was heißt dog?“ (mit Vorlesen in der Zielsprache) */
function pickImage(c: Ctx, e: Entry): ChoiceTask {
  const opts = shuffle([e, ...distractors(c.unit.words, e, c.t, c.n, 3, c.rng)], c.rng);
  return {
    id: id(c, 'bild'), type: 'choice', optionStyle: 'emoji',
    prompt: L(`Was bedeutet ${q(e[c.t])}?`, `Che cosa significa ${q(e[c.t])}?`),
    speak: L('Was bedeutet das?', 'Che cosa significa?'),
    visual: { kind: 'audio', text: e[c.t], lang: c.course.locale, showText: true },
    options: opts.map((o) => ({ id: o.emoji, emoji: o.emoji, label: o[c.n] })),
    correctId: e.emoji,
    hint: L('Tippe auf den Lautsprecher und hör dir das Wort noch einmal an.', 'Tocca l’altoparlante e ascolta di nuovo la parola.'),
    explain: [`${e[c.t]} = ${e[c.n]} ${e.emoji}`]
  };
}

/** Hören und verstehen: Wort/Satz wird vorgelesen, Bedeutung wählen */
function listenChoose(c: Ctx, e: Entry, pool: Entry[]): ChoiceTask {
  const opts = shuffle([e, ...distractors(pool, e, c.t, c.n, 3, c.rng)], c.rng);
  return {
    id: id(c, 'hoeren'), type: 'choice', optionStyle: 'text',
    prompt: L('Hör gut zu: Was bedeutet das?', 'Ascolta bene: che cosa significa?'),
    visual: { kind: 'audio', text: e[c.t], lang: c.course.locale },
    options: opts.map((o) => ({ id: o.emoji, label: o[c.n] })),
    correctId: e.emoji,
    hint: L('Tippe auf die Schnecke: Dann wird es langsam vorgelesen.', 'Tocca la lumaca: la frase viene letta piano.'),
    explain: [`${e[c.t]} = ${e[c.n]}`]
  };
}

/** Übersetzen in die Zielsprache: „Wie sagt man Hund auf Englisch?“ */
function translateTo(c: Ctx, e: Entry, pool: Entry[]): ChoiceTask {
  const opts = shuffle([e, ...distractors(pool, e, c.t, c.n, 3, c.rng)], c.rng);
  const lang = c.course.name();
  return {
    id: id(c, 'uebersetzen'), type: 'choice', optionStyle: 'text',
    prompt: L(`Wie sagt man ${q(e[c.n])} auf ${lang}?`, `Come si dice ${q(e[c.n])} in ${lang.toLowerCase()}?`),
    visual: { kind: 'bigEmoji', emoji: e.emoji },
    options: opts.map((o) => ({ id: o.emoji, label: o[c.t], speak: o[c.t], speakLang: c.course.locale })),
    correctId: e.emoji,
    hint: L('Tippe die Antworten an, um sie zu hören.', 'Tocca le risposte per ascoltarle.'),
    explain: [`${e[c.n]} = ${e[c.t]}`]
  };
}

/** Aussprache: anhören und nachsprechen (Mikrofon) */
function speakTask(c: Ctx, e: Entry): SpeakTask {
  return {
    id: id(c, 'sprechen'), type: 'speak',
    prompt: L('Sprich nach!', 'Ripeti ad alta voce!'),
    phrase: e[c.t], lang: c.course.locale, meaning: e[c.n], emoji: e.emoji,
    hint: L('Hör es dir noch einmal langsam an und sprich ruhig und deutlich.', 'Riascoltalo piano e parla con calma e in modo chiaro.'),
    explain: [L(`So klingt es: ${e[c.t]}`, `Si pronuncia così: ${e[c.t]}`), L(`Das bedeutet: ${e[c.n]}`, `Significa: ${e[c.n]}`)]
  };
}

/** Satz aus Wortkärtchen bauen (Übersetzung oder Diktat) */
function buildSentence(c: Ctx, e: Entry, listen: boolean): SentenceTask {
  const words = tokens(e[c.t]);
  const lower = new Set(words.map((w) => w.toLowerCase()));
  const others = [...c.unit.sentences, ...c.unit.words].filter((x) => x !== e).flatMap((x) => tokens(x[c.t]));
  const extra: string[] = [];
  for (const w of shuffle(others, c.rng)) {
    if (extra.length >= Math.min(3, Math.max(2, 7 - words.length))) break;
    if (!lower.has(w.toLowerCase())) { lower.add(w.toLowerCase()); extra.push(w); }
  }
  return {
    id: id(c, listen ? 'diktat' : 'satz'), type: 'sentence', lang: c.course.locale,
    prompt: listen ? L('Bau den Satz, den du hörst.', 'Componi la frase che senti.') : L(`Übersetze: ${q(e[c.n])}`, `Traduci: ${q(e[c.n])}`),
    speak: listen ? L('Bau den Satz, den du hörst.', 'Componi la frase che senti.') : L('Übersetze den Satz.', 'Traduci la frase.'),
    visual: listen ? { kind: 'audio', text: e[c.t], lang: c.course.locale } : undefined,
    words, tiles: shuffle([...words, ...extra], c.rng),
    hint: L(`Der Satz beginnt mit ${q(words[0]!)}.`, `La frase inizia con ${q(words[0]!)}.`),
    explain: [e[c.t], L(`Das bedeutet: ${e[c.n]}`, `Significa: ${e[c.n]}`)]
  };
}

function memory(c: Ctx, list: Entry[]): MemoryTask {
  return {
    id: id(c, 'memory'), type: 'memory',
    prompt: L('Finde die Paare!', 'Trova le coppie!'),
    pairs: list.map((e) => ({ id: e.emoji, a: e[c.t], b: e[c.n] })),
    hint: L('Merk dir, wo die Karten liegen.', 'Ricorda dove sono le carte.'),
    explain: list.map((e) => `${e[c.t]} = ${e[c.n]}`)
  };
}

/** Aufgaben einer Lektion: 1 = neue Wörter, 2 = üben, 3 = Sätze und Sprechen */
export function generateLesson(unit: Unit, course: Course, level: 1 | 2 | 3, rng: Rng, nativeLang: Lang = getLang()): Task[] {
  const c: Ctx = { unit, course, t: course.id, n: nativeLang, rng, k: 0 };
  const w = shuffle(unit.words, rng);
  const s = shuffle(unit.sentences, rng);
  const all = [...unit.words, ...unit.sentences];
  const at = (i: number) => w[i % w.length]!;
  if (level === 1) {
    return [
      pickImage(c, at(0)), listenChoose(c, at(1), unit.words), speakTask(c, at(0)), pickImage(c, at(2)),
      memory(c, pickN(unit.words, 4, rng)), listenChoose(c, at(3), unit.words), speakTask(c, at(2)), pickImage(c, at(4))
    ];
  }
  if (level === 2) {
    return [
      translateTo(c, at(0), unit.words), listenChoose(c, at(1), unit.words), buildSentence(c, s[0]!, false), speakTask(c, at(2)),
      translateTo(c, at(3), unit.words), buildSentence(c, s[1]!, false), pickImage(c, at(4)), speakTask(c, s[0]!)
    ];
  }
  return [
    buildSentence(c, s[0]!, false), listenChoose(c, s[1]!, all), speakTask(c, s[2] ?? s[0]!), buildSentence(c, s[1]!, true),
    translateTo(c, at(0), unit.words), memory(c, pickN(unit.words, 4, rng)), buildSentence(c, s[2] ?? s[1]!, false), speakTask(c, s[1]!)
  ];
}

/** Vokabelliste als Lernkarten (Theorie-Seite) */
function cardsOf(unit: Unit, course: Course): () => StudyCard[] {
  return () => {
    const n = getLang();
    return [...unit.words, ...unit.sentences].map((e, i) => ({
      q: `${e.emoji} ${e[course.id]}`, a: e[n], level: (i < unit.words.length ? 1 : 2) as 1 | 2
    }));
  };
}

/** Alle Kurs-Einheiten als Lernmodule (Fortschritt, Sterne und Lernpfad wie in den Fächern). */
export const LANGUAGE_MODULES: LearningModule[] = COURSES.flatMap((course) =>
  UNITS.map((unit) => ({
    id: unitModuleId(course.id, unit.id),
    title: { de: unit.title.de, it: unit.title.it },
    subtitle: { de: unit.subtitle.de, it: unit.subtitle.it },
    emoji: unit.emoji,
    color: unit.color,
    area: 'lingue' as const,
    subject: courseSubject(course.id),
    // Die eigene Sprache wird nicht als Kurs angeboten
    langs: course.id === 'de' ? (['it'] as Lang[]) : course.id === 'it' ? (['de'] as Lang[]) : undefined,
    topic: { de: `${course.native}: ${unit.title.de}`, it: `${course.native}: ${unit.title.it}` },
    roundSize: 8,
    generate: (level: 1 | 2 | 3, rng: Rng) => generateLesson(unit, course, level, rng),
    cards: cardsOf(unit, course)
  }))
);

export function courseModules(c: CourseLang): LearningModule[] {
  return LANGUAGE_MODULES.filter((m) => m.subject === courseSubject(c));
}
