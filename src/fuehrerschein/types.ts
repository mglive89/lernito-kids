import type { Txt } from '../i18n';

export type DrivingCountry = 'DE' | 'IT';

/** Eine Prüfungsfrage. DE: Mehrfachauswahl (eine oder mehrere richtig). IT: Aussage mit Vero/Falso. */
export interface DrivingQuestion {
  id: string;
  topic: string;
  /** DE: Fehlerpunkte (2–5). IT: immer 1. */
  points: number;
  q: Txt;
  sign?: string;
  options: { t: Txt; ok: boolean }[];
  expl: Txt;
  /** 'multi' = ankreuzen (DE), 'vf' = Vero/Falso (IT) */
  kind: 'multi' | 'vf';
}

export interface DrivingTopic { id: string; name: Txt; icon: string }

/** Kurzschreibweise beim Erfassen der Fragen */
export type RawMulti = [id: string, topic: string, points: number, q: Txt, options: [Txt, boolean][], expl: Txt, sign?: string];
export type RawVF = [id: string, topic: string, statement: Txt, ok: boolean, expl: Txt, sign?: string];
