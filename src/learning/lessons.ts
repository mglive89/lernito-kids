import { L } from '../i18n';
import type { LearningModule } from './types';

/** Die drei Lektionen jeder Einheit im Lernpfad (= Schwierigkeitsstufe 1–3). */
export const PATH_LESSONS = () => [
  { n: 1, name: L('Grundlagen', 'Le basi') },
  { n: 2, name: L('Üben', 'Esercizio') },
  { n: 3, name: L('Meistern', 'Sfida') }
];

export const lessonLabel = (n: number) => `${L('Lektion', 'Lezione')} ${n} · ${PATH_LESSONS()[n - 1]?.name ?? ''}`;

/** Link zur nächsten Lektion eines Themas (Lernpfad) bzw. zum Spiel. */
export function lessonLink(m: LearningModule, pathDone?: number): string {
  if (m.area !== 'schule' && m.area !== 'lingue') return `/spiel/${m.id}`;
  return `/spiel/${m.id}?lektion=${Math.min(3, (pathDone ?? 0) + 1)}`;
}
