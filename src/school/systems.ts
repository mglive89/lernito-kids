import { L, tx, tr, type Txt } from '../i18n';

/** Länder mit eigenem Schulsystem. Weitere Länder: hier ergänzen. */
export type Country = 'DE' | 'IT';
export const COUNTRIES: { id: Country; name: Txt; flag: string; defaultLang: 'de' | 'it' }[] = [
  { id: 'DE', name: tx('Deutschland', 'Germania'), flag: '🇩🇪', defaultLang: 'de' },
  { id: 'IT', name: tx('Italien', 'Italia'), flag: '🇮🇹', defaultLang: 'it' }
];

/** Schuljahr: 0 = Kindergarten / Scuola dell'infanzia, 1–13 = Schuljahre ab Einschulung. */
export type SchoolYear = number;

export type StageId = 'kita' | 'grundschule' | 'sek1' | 'sek2' | 'infanzia' | 'primaria' | 'medie' | 'superiori';

export type SubjectId =
  | 'mathe' | 'deutsch' | 'italiano' | 'englisch' | 'sachkunde' | 'geschichte' | 'geographie'
  | 'biologie' | 'physik' | 'chemie' | 'scienze' | 'religion' | 'informatik' | 'programmieren';

export interface StageDef {
  id: StageId;
  country: Country;
  years: SchoolYear[];
  name: Txt;
  emoji: string;
  /** Pflicht- und Zusatzfächer dieser Schulstufe */
  subjects: SubjectId[];
  extras: SubjectId[];
  /** Darstellung: verspielt (jüngere Kinder) oder sachlich (Jugendliche) */
  look: 'kids' | 'teen';
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const EXTRAS: SubjectId[] = ['religion', 'informatik', 'programmieren'];

export const STAGES: StageDef[] = [
  { id: 'kita', country: 'DE', years: [0], name: tx('Kindergarten', 'Scuola dell’infanzia (Kindergarten)'), emoji: '🧸', subjects: [], extras: [], look: 'kids' },
  { id: 'grundschule', country: 'DE', years: range(1, 4), name: tx('Grundschule', 'Scuola primaria (Grundschule)'), emoji: '🎒', subjects: ['deutsch', 'mathe', 'sachkunde', 'englisch'], extras: EXTRAS, look: 'kids' },
  { id: 'sek1', country: 'DE', years: range(5, 10), name: tx('Sekundarstufe I', 'Secondaria – Sekundarstufe I'), emoji: '📘', subjects: ['deutsch', 'mathe', 'englisch', 'biologie', 'physik', 'chemie', 'geschichte', 'geographie'], extras: EXTRAS, look: 'teen' },
  { id: 'sek2', country: 'DE', years: range(11, 13), name: tx('Oberstufe (Sekundarstufe II)', 'Secondaria superiore – Oberstufe'), emoji: '🎓', subjects: ['deutsch', 'mathe', 'englisch', 'biologie', 'physik', 'chemie', 'geschichte', 'geographie'], extras: EXTRAS, look: 'teen' },
  { id: 'infanzia', country: 'IT', years: [0], name: tx('Kindergarten (Scuola dell’infanzia)', 'Scuola dell’infanzia'), emoji: '🧸', subjects: [], extras: [], look: 'kids' },
  { id: 'primaria', country: 'IT', years: range(1, 5), name: tx('Grundschule (Scuola primaria)', 'Scuola primaria (elementari)'), emoji: '🎒', subjects: ['italiano', 'mathe', 'englisch', 'sachkunde', 'geschichte', 'geographie'], extras: EXTRAS, look: 'kids' },
  { id: 'medie', country: 'IT', years: range(6, 8), name: tx('Mittelschule (Secondaria di I grado)', 'Scuola secondaria di I grado (medie)'), emoji: '📘', subjects: ['italiano', 'mathe', 'englisch', 'scienze', 'geschichte', 'geographie'], extras: EXTRAS, look: 'teen' },
  { id: 'superiori', country: 'IT', years: range(9, 13), name: tx('Oberschule (Secondaria di II grado)', 'Scuola secondaria di II grado (superiori)'), emoji: '🎓', subjects: ['italiano', 'mathe', 'englisch', 'biologie', 'physik', 'chemie', 'geschichte', 'geographie'], extras: EXTRAS, look: 'teen' }
];

export function stagesOf(country: Country): StageDef[] {
  return STAGES.filter((s) => s.country === country);
}

export function stageFor(country: Country, year: SchoolYear): StageDef {
  return STAGES.find((s) => s.country === country && s.years.includes(year)) ?? STAGES.find((s) => s.country === country)!;
}

/** Jahr innerhalb der Stufe (z. B. 2. Klasse der Mittelschule = 2). */
export function yearInStage(country: Country, year: SchoolYear): number {
  const s = stageFor(country, year);
  return year - (s.years[0] ?? 0) + 1;
}

/** Bezeichnung der Klasse im jeweiligen Land, in der aktuellen Sprache. */
export function yearLabel(country: Country, year: SchoolYear): string {
  if (year === 0) return tr(stageFor(country, 0).name);
  const s = stageFor(country, year);
  const n = yearInStage(country, year);
  if (country === 'IT') {
    if (s.id === 'primaria') return L(`${n}. Klasse Grundschule`, `${n}ª elementare`);
    if (s.id === 'medie') return L(`${n}. Klasse Mittelschule`, `${n}ª media`);
    return L(`${n}. Klasse Oberschule`, `${n}ª superiore`);
  }
  if (s.id === 'sek2') return L(`${year}. Klasse · Oberstufe`, `${year}ª classe · Oberstufe`);
  return L(`${year}. Klasse`, `${year}ª classe`);
}

/** Kurzform für Reiter, z. B. „5.“ / „1ª“. */
export function yearShort(country: Country, year: SchoolYear): string {
  if (country === 'IT') return `${yearInStage(country, year)}ª`;
  return L(`${year}.`, `${year}ª`);
}

export function isTeen(country: Country, year: SchoolYear): boolean {
  return stageFor(country, year).look === 'teen';
}

/** Ungefähres Alter zur Orientierung bei der Profilerstellung. */
export function typicalAge(country: Country, year: SchoolYear): string {
  if (year === 0) return '3–6';
  const start = country === 'IT' ? 6 : 6;
  return `${start + year - 1}–${start + year}`;
}

let currentCountry: Country = 'DE';
/** Land des aktiven Profils (für länderspezifische Fragen). */
export function getCountry(): Country { return currentCountry; }
export function setCountry(c: Country) { currentCountry = c; }

/** Kurzbeschreibung eines Profils, z. B. „🇮🇹 3ª elementare“. */
export function profileLabel(p: { country: Country; year: number }): string {
  const flag = COUNTRIES.find((c) => c.id === p.country)?.flag ?? '';
  return `${flag} ${yearLabel(p.country, p.year)}`;
}
