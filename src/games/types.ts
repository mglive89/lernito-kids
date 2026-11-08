import type { Task } from '../learning/types';

export interface TaskViewProps<T extends Task = Task> {
  task: T;
  onCorrect: () => void;
  onWrong: () => void;
  /** Hilfe/Lösung anzeigen (nach zwei Fehlversuchen) */
  reveal: boolean;
  /** Aufgabe abgeschlossen – keine Eingaben mehr */
  done: boolean;
  /**
   * Prüfen-Modus: Antwort erst auswählen, dann mit „Prüfen“ bestätigen.
   * Die Ansicht meldet die Prüf-Funktion (oder null, wenn nichts gewählt ist).
   */
  onPending?: (check: (() => void) | null) => void;
}

/** Aufgabentypen, bei denen Fehler weiche Hinweise sind und das Kind die Aufgabe selbst zu Ende bringt. */
export const MULTI_STEP: Task['type'][] = ['memory', 'dragmatch', 'puzzle', 'order', 'wordbuild'];
