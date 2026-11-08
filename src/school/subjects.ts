import { tx, tr, type Txt } from '../i18n';
import type { Country, SubjectId } from './systems';

export interface SubjectDef {
  id: SubjectId;
  name: Txt;
  /** Abweichender Name je Land */
  nameIn?: Partial<Record<Country, Txt>>;
  emoji: string;
  /** Sammelfach: zeigt Module dieser Fächer (z. B. Scienze an der Mittelschule) */
  includes?: SubjectId[];
  extra?: boolean;
  /** Farbton für Kacheln */
  color: 'sonne' | 'himmel' | 'minze' | 'koralle' | 'lila';
}

export const SUBJECTS: SubjectDef[] = [
  { id: 'mathe', name: tx('Mathematik', 'Matematica'), emoji: '🔢', color: 'himmel' },
  { id: 'deutsch', name: tx('Deutsch', 'Tedesco'), emoji: '📖', color: 'koralle' },
  { id: 'italiano', name: tx('Italienisch', 'Italiano'), emoji: '📖', color: 'koralle' },
  { id: 'englisch', name: tx('Englisch', 'Inglese'), emoji: '🇬🇧', color: 'lila' },
  { id: 'sachkunde', name: tx('Sachunterricht', 'Scienze e ambiente'), nameIn: { IT: tx('Naturwissenschaften', 'Scienze') }, emoji: '🌍', color: 'minze' },
  { id: 'scienze', name: tx('Naturwissenschaften', 'Scienze'), emoji: '🔬', color: 'minze', includes: ['biologie', 'physik', 'chemie', 'sachkunde'] },
  { id: 'biologie', name: tx('Biologie', 'Biologia'), emoji: '🧬', color: 'minze' },
  { id: 'physik', name: tx('Physik', 'Fisica'), emoji: '⚛️', color: 'himmel' },
  { id: 'chemie', name: tx('Chemie', 'Chimica'), emoji: '⚗️', color: 'lila' },
  { id: 'geschichte', name: tx('Geschichte', 'Storia'), emoji: '🏛️', color: 'sonne' },
  { id: 'geographie', name: tx('Erdkunde', 'Geografia'), emoji: '🗺️', color: 'minze' },
  { id: 'religion', name: tx('Religion & Ethik', 'Religione ed etica'), emoji: '🕊️', color: 'sonne', extra: true },
  { id: 'informatik', name: tx('Informatik', 'Informatica'), emoji: '💻', color: 'himmel', extra: true },
  { id: 'programmieren', name: tx('Programmieren', 'Programmazione'), emoji: '🧑‍💻', color: 'lila', extra: true }
];

export function subjectDef(id: string): SubjectDef | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

/** Namen eigener Fächer (aus dem Admin-Bereich) */
let customSubjectName: ((id: string) => string | undefined) | undefined;
export function setCustomSubjectNames(fn: (id: string) => string | undefined) { customSubjectName = fn; }

export function subjectName(id: string, country: Country): string {
  const d = subjectDef(id);
  if (!d) return customSubjectName?.(id) ?? id;
  return tr(d.nameIn?.[country] ?? d.name);
}
