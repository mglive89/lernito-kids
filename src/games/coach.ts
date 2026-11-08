import type { Task } from '../learning/types';
import { L } from '../i18n';

/** Wie man diese Art von Aufgabe löst – Puppy erklärt es dem Kind. */
export function howTo(task: Task, check: boolean): string {
  if (task.visual?.kind === 'robot') return L('Fahr den Weg des Roboters mit dem Finger nach: Feld für Feld bis zur Fahne. Welche Pfeile braucht er dafür?', 'Segui con il dito la strada del robot: casella per casella fino alla bandiera. Quali frecce gli servono?');
  if (task.visual?.kind === 'code') return L('Lies das Programm Zeile für Zeile von oben nach unten. Schreib dir auf, welchen Wert jede Variable gerade hat.', 'Leggi il programma riga per riga, dall’alto in basso. Annota il valore di ogni variabile.');
  switch (task.type) {
    case 'choice': return check
      ? L('Lies die Frage in Ruhe. Tippe auf die Antwort, die du für richtig hältst, und drücke dann „Prüfen“.', 'Leggi la domanda con calma. Tocca la risposta che ti sembra giusta e poi premi «Controlla».')
      : L('Hör gut zu und tippe auf das richtige Bild.', 'Ascolta bene e tocca l’immagine giusta.');
    case 'input': return L('Rechne in Ruhe, auch mit Fingern oder auf Papier. Tippe dann die Zahl ein und drücke OK.', 'Calcola con calma, anche con le dita o su un foglio. Poi scrivi il numero e premi OK.');
    case 'wordbuild': return L('Sprich das Wort langsam. Tippe die Bausteine in der Reihenfolge an, in der du sie hörst.', 'Pronuncia la parola piano. Tocca i pezzi nell’ordine in cui li senti.');
    case 'order': return L('Überleg, was zuerst passiert und was danach. Bring die Karten in die richtige Reihenfolge.', 'Pensa a che cosa succede prima e che cosa dopo. Metti le carte nell’ordine giusto.');
    case 'memory': return L('Deck zwei Karten auf. Passen sie zusammen, bleiben sie offen. Merk dir, wo die anderen liegen.', 'Gira due carte. Se vanno insieme restano aperte. Ricorda dove sono le altre.');
    case 'dragmatch': return L('Zieh jedes Teil auf das passende Feld. Du kannst auch zuerst das Teil und dann das Feld antippen.', 'Trascina ogni pezzo nel posto giusto. Puoi anche toccare prima il pezzo e poi il posto.');
    case 'puzzle': return L('Schau dir das Bild an und setz jedes Teil an seine Stelle.', 'Guarda l’immagine e metti ogni pezzo al suo posto.');
    case 'pick3d': return L('Dreh die Welt mit dem Finger und tippe auf das Richtige.', 'Gira il mondo con il dito e tocca quello giusto.');
  }
}

/** Hilfe-Schritte zu einer Aufgabe: erst die Anleitung mit Tipp, dann die Erklärung Schritt für Schritt (ohne „Richtig ist: …“). */
export function helpSteps(task: Task, check: boolean): string[] {
  const steps = task.explain.filter((s) => !/^(Richtig ist|La risposta giusta è)/.test(s));
  return [`${howTo(task, check)} ${L('Tipp:', 'Suggerimento:')} ${task.hint}`, ...steps];
}
