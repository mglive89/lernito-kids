import type { R } from './rational';

/** Ein Kästchen-Bild wie auf kariertem Papier. */
export interface GridRow {
  cells: string[];
  /** carry = kleine Überträge, result = Ergebnis, new = gerade neu geschrieben */
  kind?: 'carry' | 'num' | 'result' | 'new';
  /** Strich über dieser Zeile */
  rule?: boolean;
}
export interface Grid {
  width: number;
  rows: GridRow[];
  /** Hervorgehobene Spalte (von links gezählt) */
  hl?: number;
}

export interface Step {
  title: string;
  text?: string;
  /** Rechenausdruck nach diesem Schritt */
  expr?: string;
  grid?: Grid;
  /** Hinweis, was als Nächstes zu tun ist (ohne das Ergebnis zu verraten) */
  hint?: string;
  /** Gleichung nach diesem Schritt, getrennt in linke und rechte Seite */
  eq?: { left: string; right: string };
  /** Rechenschritt, der auf beiden Seiten gemacht wird, z. B. „− 4“ oder „: 3“ */
  both?: string;
}

export interface Solution {
  /** Art der Aufgabe, z. B. „Schriftliche Addition“ */
  kind: string;
  /** Aufgabe schön geschrieben */
  task: string;
  steps: Step[];
  /** Ergebnis als Text, z. B. „623“ oder „x = 5“ */
  answer: string;
  /** Richtiger Wert (für „Prüfe dein Ergebnis“) */
  value?: R;
  /** Rest bei Division mit Rest */
  rest?: number;
  /** Ergebnis ist kein einzelner Wert (z. B. jede Zahl löst die Gleichung) */
  noValue?: boolean;
  /** Hinweis, wenn auf dem Blatt schon ein Ergebnis stand */
  check?: { written: string; correct: boolean };
}

export type SolveResult = { ok: true; solution: Solution } | { ok: false; reason: string; unsupported?: boolean };
