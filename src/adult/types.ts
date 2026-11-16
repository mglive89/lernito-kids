import type { Txt } from '../i18n';

/** Bereiche von Lernito Adult. */
export type AdultCat = 'lavoretti' | 'casa' | 'cucina' | 'codice' | 'faidate';

/** Kleine Programmieraufgabe mit Live-Vorschau. */
export interface CodeTask {
  /** Startcode im Editor */
  start: string;
  /** Prüft, ob das Ziel erreicht ist (auf den Code angewendet) */
  check: RegExp;
  /** Was zu tun ist */
  goal: Txt;
  /** Hilfe, wenn die Prüfung fehlschlägt */
  hint: Txt;
}

export interface GuideStep {
  text: Txt;
  /** Schlüssel einer eigenen SVG-Illustration (src/adult/art.tsx) */
  art?: string;
  tip?: Txt;
  code?: CodeTask;
}

export interface Ingredient {
  /** Menge für `servings` Portionen; null = nach Geschmack */
  qty: number | null;
  unit: Txt;
  name: Txt;
}

export interface QuizQ {
  q: Txt;
  options: Txt[];
  /** Index der richtigen Antwort */
  answer: number;
  why: Txt;
}

export interface Guide {
  id: string;
  cat: AdultCat;
  title: Txt;
  sub: Txt;
  minutes: number;
  level: 1 | 2 | 3;
  /** Titelbild (Art-Schlüssel) */
  cover: string;
  materials?: Txt[];
  ingredients?: Ingredient[];
  servings?: number;
  safety?: Txt[];
  steps: GuideStep[];
  tips?: Txt[];
  quiz?: QuizQ[];
}
