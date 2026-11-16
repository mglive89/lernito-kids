/**
 * LinguaFlow – Datenformat der Kurspakete (Format 1).
 * Ausführliche Beschreibung: docs/linguaflow/README.md, JSON-Schema: docs/linguaflow/pack.schema.json
 *
 * Ein Kurs = Inhalt in der Lernsprache (content/…) + Übersetzungen/Erklärungen in der Ausgangssprache (translations/…).
 * So lässt sich derselbe Dialog für Lernende mit verschiedenen Ausgangssprachen wiederverwenden.
 */

/** BCP-47-Sprachkennung, z. B. "de", "pt-BR", "zh-Hans" */
export type LangTag = string;

export type CourseKind = 'course' | 'intro' | 'demo';
export type CourseStatus = 'published' | 'draft';

export interface CourseEntry {
  id: string;
  source: LangTag;
  target: LangTag;
  /** GER-Niveau, z. B. "A1" */
  level: string;
  /** course = vollständiges Modul, intro = Einführung, demo = Demo */
  kind: CourseKind;
  status: CourseStatus;
  version: string;
  /** Pfad (relativ zum Paketordner) zur Inhaltsdatei */
  content: string;
  /** Pfad zur Übersetzungsdatei */
  translations: string;
  /** Lektionen dieses Kurses in Reihenfolge (IDs aus der Inhaltsdatei) */
  lessons: string[];
}

export interface CourseIndex {
  format: 1;
  courses: CourseEntry[];
}

/** Ein Text in der Lernsprache */
export interface Item {
  id: string;
  text: string;
  /** Umschrift (z. B. Rōmaji, lateinische Umschrift des Arabischen) – optionale Hilfe */
  translit?: string;
  /** Sprecher im Dialog (Name in der Lernsprache) */
  speaker?: string;
  /** weitere richtige Schreibweisen für Schreibaufgaben */
  accept?: string[];
  /** optionale Audiodatei (relativ zum Paketordner) */
  audio?: string;
}

interface ExerciseBase { id: string }
/** Hören: Text der Lernsprache wird vorgelesen, Bedeutung wählen (ohne Stimme: lesen) */
export interface ListenExercise extends ExerciseBase { type: 'listen'; item: string; options: string[] }
/** Auswahl: toSource = Text zeigen, Übersetzung wählen; toTarget = Übersetzung zeigen, Text wählen */
export interface ChoiceExercise extends ExerciseBase { type: 'choice'; item: string; direction: 'toSource' | 'toTarget'; options: string[] }
/** Lückentext: "gap" ist ein Teil von item.text, der fehlt */
export interface ClozeExercise extends ExerciseBase { type: 'cloze'; item: string; gap: string; options: string[] }
/** Satz ordnen: Segmente in der richtigen Reihenfolge; extra = Ablenker */
export interface OrderExercise extends ExerciseBase { type: 'order'; item: string; segments: string[]; extra?: string[] }
/** Schreiben: Übersetzung zeigen, Text der Lernsprache tippen */
export interface WriteExercise extends ExerciseBase { type: 'write'; item: string; accept?: string[] }
/** Abschluss-Situation: Beschreibung in der Ausgangssprache, Antwort in der Lernsprache (schreiben oder wählen) */
export interface SituationExercise extends ExerciseBase { type: 'situation'; mode: 'write' | 'choice'; answers: string[]; options?: string[]; translit?: string }

export type Exercise = ListenExercise | ChoiceExercise | ClozeExercise | OrderExercise | WriteExercise | SituationExercise;
export type ExerciseType = Exercise['type'];

export interface Lesson {
  id: string;
  /** geschätzte Dauer in Minuten (5–10) */
  minutes: number;
  dialogue: Item[];
  vocabulary: Item[];
  exercises: Exercise[];
}

export interface ContentFile {
  format: 1;
  id: string;
  language: LangTag;
  version: string;
  lessons: Lesson[];
}

export interface TranslationFile {
  format: 1;
  id: string;
  content: string;
  source: LangTag;
  target: LangTag;
  version: string;
  /**
   * reviewed = von einer Muttersprachlerin/einem Muttersprachler geprüft,
   * unreviewed = von Hand geschrieben, aber noch nicht geprüft,
   * machine = maschinell übersetzt (wird in der App deutlich gekennzeichnet).
   */
  quality: 'reviewed' | 'unreviewed' | 'machine';
  course: { title: string; description: string };
  lessons: Record<string, { title: string; goal: string }>;
  /** Übersetzung jedes Textes (Item-ID → Text in der Ausgangssprache) */
  items: Record<string, string>;
  /** kurze Hinweise zu Wörtern/Sätzen (optional) */
  notes?: Record<string, string>;
  /** je Aufgabe: Erklärung nach einem Fehler; bei Situationen zusätzlich die Aufgabenstellung */
  exercises: Record<string, { explain: string; prompt?: string }>;
}

/** Fertig zusammengesetzter Kurs zum Abspielen */
export interface LoadedCourse {
  entry: CourseEntry;
  content: ContentFile;
  tr: TranslationFile;
  lessons: Lesson[];
  items: Map<string, Item>;
}
