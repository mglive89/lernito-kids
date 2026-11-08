export type Difficulty = 1 | 2 | 3;
export type Area = 'kita' | 'schule' | 'welt3d' | 'video';
export type Grade = 1 | 2 | 3 | 4;
export type SubjectId = 'deutsch' | 'mathe' | 'sachunterricht' | 'englisch' | string;
export type ShapeName = 'kreis' | 'quadrat' | 'dreieck' | 'rechteck' | 'stern' | 'herz' | 'oval' | 'raute';
export type SolidName = 'wuerfel' | 'kugel' | 'zylinder' | 'kegel' | 'pyramide' | 'quader';

export type Visual =
  | { kind: 'emojis'; items: string[] }
  | { kind: 'bigEmoji'; emoji: string; silhouette?: boolean; caption?: string }
  | { kind: 'text'; text: string; size?: 'xl' | 'lg' | 'md' }
  | { kind: 'story'; title?: string; text: string }
  | { kind: 'clock'; hours: number; minutes: number }
  | { kind: 'coins'; cents: number[] }
  | { kind: 'fraction'; parts: number; filled: number }
  | { kind: 'shape'; shape: ShapeName; color: string }
  | { kind: 'dots'; count: number }
  | { kind: 'column'; a: number; b: number; op: '+' | '-' }
  | { kind: 'pattern'; items: string[] }
  | { kind: 'solid3d'; solid: SolidName; color: string }
  | { kind: 'count3d'; count: number; item: 'apfel' | 'ball' | 'stern' }
  | { kind: 'image'; mediaId: string; alt: string };

export interface ChoiceOption {
  id: string;
  label?: string;
  emoji?: string;
  color?: string;
  shape?: ShapeName;
  /** Relative Größe 0.4–1.6 für Groß/Klein-Aufgaben */
  scale?: number;
  /** Bild als Schattenriss darstellen */
  silhouette?: boolean;
  /** Gesprochener Name (z. B. für Farben) */
  speak?: string;
}

interface TaskBase {
  id: string;
  prompt: string;
  /** Text für die Vorlesefunktion (Standard: prompt) */
  speak?: string;
  hint: string;
  /** Schritt-für-Schritt-Erklärung, nach zweitem Fehlversuch */
  explain: string[];
  visual?: Visual;
  /** Optionales Geräusch (wird gesprochen, z. B. Tierlaute) */
  sound?: string;
}

export interface ChoiceTask extends TaskBase {
  type: 'choice';
  options: ChoiceOption[];
  correctId: string;
  optionStyle?: 'big' | 'text' | 'color' | 'shape' | 'emoji';
}

export interface InputTask extends TaskBase {
  type: 'input';
  answer: number;
}

export interface WordBuildTask extends TaskBase {
  type: 'wordbuild';
  /** Lösung als Liste von Bausteinen (Buchstaben oder Silben) */
  solution: string[];
  /** Angebotene Bausteine (gemischt, evtl. mit Ablenkern) */
  tiles: string[];
}

export interface OrderTask extends TaskBase {
  type: 'order';
  items: { id: string; label: string }[];
  correctOrder: string[];
}

export interface MemoryTask extends TaskBase {
  type: 'memory';
  pairs: { id: string; a: string; b: string }[];
}

export interface DragPiece { id: string; emoji?: string; shape?: ShapeName; color?: string; label?: string }
export interface DragTarget { id: string; accepts: string; label?: string; shape?: ShapeName; emoji?: string; silhouette?: boolean }
export interface DragMatchTask extends TaskBase {
  type: 'dragmatch';
  pieces: DragPiece[];
  targets: DragTarget[];
}

export interface PuzzleTask extends TaskBase {
  type: 'puzzle';
  picture: PuzzlePicture;
  grid: 2 | 3;
}
export type PuzzlePicture = 'lino' | 'haus' | 'meer' | 'ballon';

export interface Pick3DTask extends TaskBase {
  type: 'pick3d';
  scene: 'zahlen' | 'wiese';
  items: { id: string; label: string }[];
  correctId: string;
}

export type Task = ChoiceTask | InputTask | WordBuildTask | OrderTask | MemoryTask | DragMatchTask | PuzzleTask | Pick3DTask;

export type Rng = () => number;

export interface LearningModule {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: 'sonne' | 'himmel' | 'minze' | 'koralle' | 'lila';
  area: Area;
  grade?: Grade;
  subject?: SubjectId;
  /** Themen-Schlüssel für Fortschritt nach Themen */
  topic: string;
  roundSize: number;
  /** Benötigt WebGL (mit 2D-Fallback) */
  uses3d?: boolean;
  /** Benutzerdefiniertes Modul aus dem Admin-Bereich */
  custom?: boolean;
  generate: (level: Difficulty, rng: Rng) => Task[];
}
