import { L } from '../i18n';
import type { LearningModule } from './types';
import { PATH_STEPS } from './challenge';

/** Die Lektionen jeder Einheit im Lernpfad: Stufe 1–3 und zum Schluss die Profi-Lektion (Stufe 3, mehr Aufgaben, Ziel 80 %). */
export const PATH_LESSONS = () => [
  { n: 1, name: L('Grundlagen', 'Le basi') },
  { n: 2, name: L('Üben', 'Esercizio') },
  { n: 3, name: L('Meistern', 'Sfida') },
  { n: 4, name: L('Profi', 'Esperto') }
];

export const lessonLabel = (n: number) => `${L('Lektion', 'Lezione')} ${n} · ${PATH_LESSONS()[n - 1]?.name ?? ''}`;

/** Link zur nächsten Lektion eines Themas (Lernpfad) bzw. zum Spiel. */
export function lessonLink(m: LearningModule, pathDone?: number): string {
  if (m.area !== 'schule' && m.area !== 'lingue') return `/spiel/${m.id}`;
  return `/spiel/${m.id}?lektion=${Math.min(PATH_STEPS, (pathDone ?? 0) + 1)}`;
}
