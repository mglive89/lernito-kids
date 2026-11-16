import type { Difficulty, LearningModule, Rng, Task } from '../learning/types';
import { shuffle } from '../lib/random';
import { getCountry } from '../school/systems';
import type { PicGen } from './tasks/helpers';
import { PICTURE_TASKS } from './tasks';

/** Bildaufgaben passend zur Stufe: zuerst genau diese Stufe (und Zufallsaufgaben), dann die Nachbarstufen. */
export function pictureTasks(gens: PicGen[], level: Difficulty, k: number, rng: Rng): Task[] {
  const country = getCountry();
  const usable = gens.filter((g) => !g.c || g.c === country);
  const near = (d: number) => shuffle(rng, usable.filter((g) => g.lv !== 0 && Math.abs(g.lv - level) === d));
  const exact = shuffle(rng, usable.filter((g) => g.lv === level || g.lv === 0));
  const chosen = [...exact, ...near(1), ...near(2)].slice(0, k);
  const out: Task[] = [];
  for (const g of chosen) {
    try { out.push(g.make(rng, level)); } catch (e) { console.error('Bildaufgabe', e); }
  }
  return out;
}

/** Wie viele Aufgaben einer Runde Bildaufgaben werden */
export const pictureShare = (n: number) => (n >= 8 ? 3 : n >= 5 ? 2 : n >= 2 ? 1 : 0);

/** Mischt Bildaufgaben gleichmäßig verteilt in eine Runde (Rundengröße bleibt gleich). */
export function mixIn(base: Task[], pics: Task[]): Task[] {
  if (!pics.length || !base.length) return base;
  const out = [...base];
  const k = Math.min(pics.length, out.length);
  for (let j = 0; j < k; j++) {
    out[Math.floor(((j + 0.5) * out.length) / k)] = pics[j]!;
  }
  return out;
}

/** Schulmodul um Bildaufgaben erweitern (Lektionen, Profi-Lektion und Endrunde nutzen generate). */
export function withPictures(m: LearningModule): LearningModule {
  const gens = PICTURE_TASKS[m.id];
  if (!gens?.length || m.area !== 'schule') return m;
  const base = m.generate;
  return {
    ...m,
    generate: (level, rng) => {
      const tasks = base(level, rng);
      return mixIn(tasks, pictureTasks(gens, level, pictureShare(tasks.length), rng));
    }
  };
}
