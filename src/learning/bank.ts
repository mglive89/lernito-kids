import type { StudyCard, ChoiceTask, Difficulty, LearningModule, Rng, Task, Visual } from './types';
import { sample, shuffle } from '../lib/random';
import { L, getLang, tx } from '../i18n';
import { getCountry, type Country, type SubjectId } from '../school/systems';

/**
 * Fragenbank im Kurzformat. Eine Zeile pro Sprache:
 *   'Frage | richtige Antwort | falsch 1 ; falsch 2 ; falsch 3 | Erklärung (optional)'
 * Code-Beispiele: Text nach „§“ in der Frage wird als Codeblock gezeigt (\n für Zeilenumbrüche).
 * Ist nur eine Sprache angegeben, gilt sie für beide (z. B. Fremdsprachen, Deutsch-Grammatik).
 */
export interface BankItem {
  de: string;
  it?: string;
  /** Bild zur Frage */
  e?: string;
  /** Schwierigkeit 1–3 (Standard 1) */
  lv?: Difficulty;
  /** Nur für dieses Land */
  c?: Country;
}

export type B = BankItem;
/** Kurzschreibweise: b('de-Zeile', 'it-Zeile', '🙂', 2, 'DE') */
export const b = (de: string, it?: string, e?: string, lv?: Difficulty, c?: Country): BankItem => ({ de, it, e, lv, c });

interface Parsed { q: string; code?: string; a: string; w: string[]; ex?: string }

export function parseLine(line: string): Parsed {
  const parts = line.split('|').map((p) => p.trim());
  const [qRaw = '', a = '', w = '', ex] = parts;
  const [q, code] = qRaw.split('§').map((x) => x.trim());
  return { q: q ?? '', code: code ? code.replace(/\\n/g, '\n') : undefined, a, w: w.split(';').map((x) => x.trim()).filter(Boolean), ex: ex || undefined };
}

const tid = (p: string, i: number) => `${p}-${i}-${Math.floor(Math.random() * 1e9).toString(36)}`;

export interface BankOptions { codeLang?: string; emojiAnswers?: boolean; n?: number }

export function bankGenerator(items: BankItem[], prefix: string, opts: BankOptions = {}) {
  return (level: Difficulty, rng: Rng, n = opts.n ?? 6): Task[] => {
    const country = getCountry();
    const usable = items.filter((x) => !x.c || x.c === country);
    let pool = usable.filter((x) => (x.lv ?? 1) <= level);
    if (level === 3) {
      const hard = usable.filter((x) => (x.lv ?? 1) >= 2);
      if (hard.length >= n) pool = hard;
    }
    if (pool.length < n) pool = usable;
    const it = getLang() === 'it';
    return sample(rng, pool, Math.min(n, pool.length)).map((item, i): ChoiceTask => {
      const p = parseLine(it && item.it ? item.it : item.de);
      const visual: Visual | undefined = p.code ? { kind: 'code', code: p.code, lang: opts.codeLang } : item.e ? { kind: 'bigEmoji', emoji: item.e } : undefined;
      return {
        id: tid(prefix, i), type: 'choice', prompt: p.q, visual,
        options: shuffle(rng, [p.a, ...p.w]).map((x) => (opts.emojiAnswers ? { id: x, emoji: x } : { id: x, label: x })),
        correctId: p.a, optionStyle: opts.emojiAnswers ? 'emoji' : 'text',
        hint: p.ex && p.ex.length < 70 && !p.ex.includes(p.a) ? p.ex : L('Lies die Frage genau und schließe zuerst die Antworten aus, die sicher falsch sind.', 'Leggi bene la domanda ed escludi prima le risposte sicuramente sbagliate.'),
        explain: [L('Richtig ist: ', 'La risposta giusta è: ') + p.a, ...(p.ex ? [p.ex] : [])]
      };
    });
  };
}

/** Modul aus einer Fragenbank */
export function bankModule(def: {
  id: string; subject: SubjectId; years: [number, number]; title: [string, string]; subtitle: [string, string];
  emoji: string; color: LearningModule['color']; items: BankItem[]; countries?: Country[]; codeLang?: string; roundSize?: number;
}): LearningModule {
  const n = def.roundSize ?? 6;
  return {
    id: def.id, area: 'schule', subject: def.subject, years: def.years, countries: def.countries,
    title: tx(def.title[0], def.title[1]), subtitle: tx(def.subtitle[0], def.subtitle[1]), topic: tx(def.title[0], def.title[1]),
    emoji: def.emoji, color: def.color, roundSize: n,
    generate: bankGenerator(def.items, def.id, { codeLang: def.codeLang, n }),
    cards: () => bankCards(def.items)
  };
}

/** Alle Fragen einer Bank als Lernkarten (Land und Sprache wie im Spiel). */
export function bankCards(items: BankItem[]): StudyCard[] {
  const country = getCountry();
  const it = getLang() === 'it';
  return items.filter((x) => !x.c || x.c === country).map((item) => {
    const p = parseLine(it && item.it ? item.it : item.de);
    return { q: p.q, a: p.a, ex: p.ex, code: p.code, level: item.lv ?? 1 };
  }).sort((a, b) => a.level - b.level);
}
