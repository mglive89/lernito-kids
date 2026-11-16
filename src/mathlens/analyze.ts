/**
 * Prüft den von der Texterkennung gelesenen Text, bevor gerechnet wird:
 * mehrdeutige Zeichen (x oder ×, 1 oder l …) und Brüche übereinander werden gemeldet, nicht erraten.
 */
import { L } from '../i18n';

export interface Ambiguity { id: string; message: string }
export interface ReadAnalysis {
  /** Vorschlag für das Eingabefeld (eine Zeile) */
  formula: string;
  /** Mehrere Zeilen erkannt: vermutlich ein Bruch übereinander oder mehrere Aufgaben */
  multiline: boolean;
  ambiguities: Ambiguity[];
  /** Kaum etwas erkannt */
  empty: boolean;
}

export function analyzeRead(text: string, confidence = 100): ReadAnalysis {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter((l) => /[0-9xX]/.test(l));
  const formula = lines.join(' ').replace(/\s+/g, ' ').trim();
  // „di“ / „von“ bei Prozentaufgaben sind Wörter, keine verwechselten Ziffern
  const symbols = formula.replace(/(%\s*)(di|von)\b/gi, '$1');
  const amb: Ambiguity[] = [];
  if (/[\d)\]}]\s*[xX]\s*[\d([{]/.test(formula)) {
    amb.push({ id: 'x', message: L('Zwischen zwei Zahlen steht ein x. Ist es die Unbekannte x oder das Malzeichen ×?', 'Tra due numeri c’è una x. È l’incognita x o il segno per ×?') });
  }
  if (/[lI|i!]/.test(symbols)) {
    amb.push({ id: 'one', message: L('Ich sehe ein l, I oder |. Meistens ist es eine 1: bitte kontrollieren.', 'Vedo una l, una I o una |. Di solito è un 1: controlla per favore.') });
  }
  if (/[oO]/.test(symbols)) {
    amb.push({ id: 'zero', message: L('Ich sehe ein O. Ist es eine 0?', 'Vedo una O. È uno 0?') });
  }
  if (/[sS]|[zZ]|[bB]|[gqdvn]/.test(symbols)) {
    amb.push({ id: 'letters', message: L('Ich sehe Buchstaben (S, Z, B, g …). Oft sind es 5, 2, 8 oder 9: bitte kontrollieren.', 'Vedo delle lettere (S, Z, B, g …). Spesso sono 5, 2, 8 o 9: controlla per favore.') });
  }
  if (lines.length > 1) {
    amb.push({ id: 'lines', message: L('Ich habe mehrere Zeilen gelesen. Steht ein Bruch übereinander? Dann schreib ihn bitte mit / neu, z. B. (x + 1)/2. Bei mehreren Aufgaben: schneide nur eine aus.', 'Ho letto più righe. C’è una frazione scritta su due righe? Allora riscrivila con /, ad es. (x + 1)/2. Se ci sono più esercizi, ritagliane uno solo.') });
  }
  if (formula && confidence < 60) {
    amb.push({ id: 'unsure', message: L('Ich bin mir beim Lesen nicht sicher. Vergleiche die Formel genau mit dem Foto.', 'Non sono sicuro della lettura. Confronta bene la formula con la foto.') });
  }
  return { formula, multiline: lines.length > 1, ambiguities: amb, empty: !formula };
}

/** Zeichen, die das Rechnen nicht kennt, aber mehrdeutig sind: blockiert die Berechnung, bis korrigiert. */
export function hasUnresolvedSymbols(formula: string): boolean {
  return /[lI|i!oOsSzZbBgqdvn]/.test(formula.replace(/(%\s*)(di|von)\b/gi, '$1'));
}
