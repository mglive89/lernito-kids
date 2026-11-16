import type { ChoiceTask, Difficulty, InputTask, Rng, Task } from '../../learning/types';
import { shuffle } from '../../lib/random';
import { L, getLang, num } from '../../i18n';
import { getCountry, type Country } from '../../school/systems';
import type { Pic } from '../types';

/**
 * Bildaufgabe: `lv` = Stufe 1–3 (0 = passt zu jeder Stufe, z. B. Zufallsaufgaben, die die Stufe selbst nutzen).
 * `make` erzeugt die Aufgabe beim Spielen (Sprache und Land sind dann gesetzt).
 */
export interface PicGen { lv: Difficulty | 0; c?: Country; make: (rng: Rng, level: Difficulty) => Task }
export type PicBank = Record<string, PicGen[]>;

let counter = 0;
const tid = (p: string) => `bild-${p}-${++counter}-${Math.floor(Math.random() * 1e9).toString(36)}`;

const ALT = () => L('Bild zur Aufgabe', 'Immagine dell’esercizio');
const HINT = () => L('Schau dir das Bild genau an.', 'Osserva bene l’immagine.');

/** Antworten ohne Doppelungen; die richtige steht nie unter den falschen. */
function uniq(right: string, wrong: string[]): string[] {
  const out: string[] = [];
  for (const w of wrong) if (w !== right && !out.includes(w)) out.push(w);
  return out;
}

/** Auswahlaufgabe mit Bild in der Frage und Text-Antworten */
export function choice(o: { prompt: string; pic: Pic; alt?: string; right: string; wrong: string[]; hint?: string; explain?: string[]; rng: Rng; big?: boolean; speak?: string }): ChoiceTask {
  const wrong = uniq(o.right, o.wrong).slice(0, 3);
  return {
    id: tid(o.pic.id), type: 'choice', prompt: o.prompt, speak: o.speak,
    visual: { kind: 'pic', pic: o.pic, alt: o.alt ?? ALT() },
    options: shuffle(o.rng, [o.right, ...wrong]).map((x) => ({ id: x, label: x })),
    correctId: o.right, optionStyle: o.big && [o.right, ...wrong].every((x) => x.length <= 4) ? 'big' : 'text',
    hint: o.hint ?? HINT(),
    explain: o.explain?.length ? o.explain : [L('Richtig ist: ', 'La risposta giusta è: ') + o.right]
  };
}

/** Auswahlaufgabe, deren Antworten Bilder sind (A–D) */
export function pickPicture(o: { prompt: string; right: { pic: Pic; name: string }; wrong: { pic: Pic; name: string }[]; visual?: Pic; alt?: string; hint?: string; explain?: string[]; rng: Rng; speak?: string }): ChoiceTask {
  const seen = new Set([o.right.name]);
  const wrong = o.wrong.filter((w) => (seen.has(w.name) ? false : (seen.add(w.name), true))).slice(0, 3);
  const all = shuffle(o.rng, [o.right, ...wrong]);
  const letters = 'ABCD';
  return {
    id: tid('wahl'), type: 'choice', prompt: o.prompt, speak: o.speak,
    visual: o.visual ? { kind: 'pic', pic: o.visual, alt: o.alt ?? ALT() } : undefined,
    options: all.map((x, i) => ({ id: x.name, label: letters[i], speak: x.name, pic: x.pic })),
    correctId: o.right.name, optionStyle: 'pic',
    hint: o.hint ?? HINT(),
    explain: o.explain?.length ? o.explain : [L('Richtig ist: ', 'La risposta giusta è: ') + o.right.name]
  };
}

/** Zahleneingabe mit Bild */
export function inputTask(o: { prompt: string; pic: Pic; alt?: string; answer: number; hint?: string; explain: string[]; signed?: boolean; speak?: string }): InputTask | ChoiceTask {
  // Das Zahlenfeld kennt kein Komma: Dezimalergebnisse werden zur Auswahl mit Nachbarwerten (aufsteigend sortiert).
  if (!Number.isInteger(o.answer)) {
    const a = o.answer;
    const cands = [a - 0.5, a + 0.5, a * 2, a + 1, a - 1].map((x) => Math.round(x * 1000) / 1000).filter((x) => x !== a && (o.signed || x >= 0));
    const opts = [...new Set([a, ...cands])].slice(0, 4).sort((x, y) => x - y);
    return {
      id: tid(o.pic.id), type: 'choice', prompt: o.prompt, speak: o.speak,
      visual: { kind: 'pic', pic: o.pic, alt: o.alt ?? ALT() },
      options: opts.map((x) => ({ id: String(x), label: num(x) })), correctId: String(a), optionStyle: 'big',
      hint: o.hint ?? HINT(), explain: o.explain
    };
  }
  return {
    id: tid(o.pic.id), type: 'input', prompt: o.prompt, speak: o.speak,
    visual: { kind: 'pic', pic: o.pic, alt: o.alt ?? ALT() },
    answer: o.answer, signed: o.signed, hint: o.hint ?? HINT(), explain: o.explain
  };
}

/**
 * Feste Bildfrage im Kurzformat wie die Fragenbanken:
 *   'Frage | richtig | falsch ; falsch ; falsch | Erklärung'
 * Ist `it` leer, gilt die deutsche Zeile (z. B. Englisch).
 */
export function q(lv: Difficulty, pic: Pic, de: string, it?: string, c?: Country): PicGen {
  return {
    lv, c,
    make: (rng) => {
      const line = getLang() === 'it' && it ? it : de;
      const [qq = '', a = '', w = '', ex] = line.split('|').map((x) => x.trim());
      const wrong = w.split(';').map((x) => x.trim()).filter(Boolean);
      return choice({
        prompt: qq, pic, right: a, wrong, rng,
        hint: ex && ex.length < 80 && !ex.includes(a) ? ex : undefined,
        explain: [L('Richtig ist: ', 'La risposta giusta è: ') + a, ...(ex ? [ex] : [])]
      });
    }
  };
}

/** Zufallsaufgabe für jede Stufe (die Stufe wird an `make` übergeben) */
export const gen = (make: PicGen['make'], lv: Difficulty | 0 = 0, c?: Country): PicGen => ({ lv, c, make });

/** Zweisprachiges Paar wählen */
export const tl = (p: readonly [string, string]) => (getLang() === 'it' ? p[1] : p[0]);

export const country = () => getCountry();
