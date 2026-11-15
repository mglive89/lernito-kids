/**
 * Datenmodell des Moduls „Fahrschule / Scuola guida“.
 * Nationale Regeln (Land, Kapitel, richtige Antworten, Gewicht) sind von den Übersetzungen getrennt:
 * Optionen haben feste IDs, Texte liegen pro Sprache daneben. Fehlt eine Sprache, wird das gemeldet
 * (siehe pickText), nie still ersetzt.
 */
export type DrivingCountry = 'DE' | 'IT';
export type StudyLang = 'de' | 'it';
export const STUDY_LANGS: StudyLang[] = ['de', 'it'];

/** Text je Sprache – eine Sprache darf fehlen (wird dann als fehlend angezeigt). */
export type I18n = Partial<Record<StudyLang, string>>;

export type ChapterId =
  | 'segnali' | 'precedenza' | 'velocita' | 'manovre' | 'sosta' | 'autostrada'
  | 'vulnerabili' | 'meteo' | 'veicolo' | 'incidente' | 'persona' | 'ambiente';

export type ReviewStatus = 'demo' | 'draft' | 'reviewed';
export type SourceKind = 'original' | 'official';

export interface SourceRef {
  kind: SourceKind;
  /** z. B. „Lernito, eigene Frage“ oder Bezeichnung im amtlichen Katalog */
  ref: string;
  /** Lizenz bzw. Nutzungsbedingung (Pflicht bei kind = 'official') */
  license?: string;
}

export type QuestionImage =
  | { type: 'sign'; id: string; alt: I18n }
  | { type: 'diagram'; id: string; alt: I18n };

export interface Question {
  id: string;
  country: DrivingCountry;
  chapter: ChapterId;
  /** 'multi' = eine oder mehrere richtig (DE), 'vf' = vero/falso (IT) */
  format: 'multi' | 'vf';
  text: I18n;
  options: { id: string; text: I18n }[];
  correct: string[];
  explanation: I18n;
  /** Trabocchetto: was in die Irre führt (beide Sprachen, gleiche Logik) */
  trap?: I18n;
  /** DE: Fehlerpunkte 2–5 */
  weight?: number;
  image?: QuestionImage;
  source: SourceRef;
  version: number;
  status: ReviewStatus;
}

export interface LessonSection {
  heading: I18n;
  body: I18n;
  image?: QuestionImage;
}
export interface Lesson {
  id: string;
  country: DrivingCountry;
  chapter: ChapterId;
  title: I18n;
  intro: I18n;
  sections: LessonSection[];
  source: SourceRef;
  version: number;
  status: ReviewStatus;
}

/** Text in der Lernsprache; fehlt er, kommt die andere Sprache mit Kennzeichnung zurück. */
export function pickText(t: I18n | undefined, lang: StudyLang): { text: string; missing: boolean; shownLang: StudyLang } {
  const own = t?.[lang];
  if (own && own.trim()) return { text: own, missing: false, shownLang: lang };
  const other: StudyLang = lang === 'de' ? 'it' : 'de';
  return { text: t?.[other] ?? '', missing: true, shownLang: other };
}

/** Alle Texte einer Frage, die in einer Sprache fehlen. */
export function missingLangs(q: Question): StudyLang[] {
  const texts: (I18n | undefined)[] = [q.text, q.explanation, ...q.options.map((o) => o.text), q.trap, q.image?.alt];
  return STUDY_LANGS.filter((l) => texts.some((t) => t !== undefined && !(t[l] && t[l]!.trim())));
}
export const isComplete = (q: Question, lang: StudyLang) => !missingLangs(q).includes(lang);

/** Fehler bei der Prüfung einer Frage (leer = gültig). */
export function validateQuestion(q: Question): string[] {
  const e: string[] = [];
  const p = `${q.id || '(ohne ID)'}:`;
  if (!/^[a-z0-9][a-z0-9-]{2,60}$/.test(q.id)) e.push(`${p} ungültige ID`);
  if (q.country !== 'DE' && q.country !== 'IT') e.push(`${p} unbekanntes Land`);
  if (!q.text.de && !q.text.it) e.push(`${p} kein Fragetext`);
  if (q.options.length < 2) e.push(`${p} weniger als 2 Antworten`);
  const ids = q.options.map((o) => o.id);
  if (new Set(ids).size !== ids.length) e.push(`${p} doppelte Antwort-IDs`);
  if (!q.correct.length) e.push(`${p} keine richtige Antwort`);
  for (const c of q.correct) if (!ids.includes(c)) e.push(`${p} richtige Antwort ${c} existiert nicht`);
  if (q.format === 'vf' && (q.options.length !== 2 || q.correct.length !== 1)) e.push(`${p} vero/falso braucht 2 Optionen und 1 richtige`);
  if (q.country === 'DE' && (q.weight === undefined || q.weight < 2 || q.weight > 5)) e.push(`${p} DE-Fragen brauchen Gewicht 2–5`);
  if (q.country === 'IT' && q.format !== 'vf') e.push(`${p} IT-Fragen sind vero/falso`);
  if (q.image && !q.image.alt.de && !q.image.alt.it) e.push(`${p} Bild ohne Alternativtext`);
  if (!q.source?.ref) e.push(`${p} Quelle fehlt`);
  if (q.source?.kind === 'official' && !q.source.license) e.push(`${p} amtlicher Inhalt ohne Lizenz/Nutzungsbedingung`);
  if (!Number.isInteger(q.version) || q.version < 1) e.push(`${p} Version fehlt`);
  return e;
}
