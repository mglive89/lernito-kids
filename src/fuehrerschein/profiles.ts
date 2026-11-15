import type { DrivingCountry, I18n } from './schema';

/**
 * Prüfungsprofile – konfigurierbar und versioniert.
 * Quellen: DE FeV Anlage 7 (Ersterwerb Klasse B), IT Avviso MIT 15.12.2021.
 */
export interface ExamProfile {
  id: string;
  country: DrivingCountry;
  version: string;
  name: I18n;
  scope: I18n;
  format: 'multi' | 'vf';
  questions: number;
  minutes: number;
  scoring: { type: 'errors'; maxErrors: number } | { type: 'points'; maxPoints: number; failOnFives: number };
  /** Mindestanteil Verkehrszeichen-Fragen */
  signQuestions: number;
  source: I18n;
  note?: I18n;
}

export const EXAM_PROFILES: ExamProfile[] = [
  {
    id: 'it-b', country: 'IT', version: '2021-12-15',
    name: { de: 'Patente B (Italien)', it: 'Patente B (Italia)' },
    scope: { de: 'Theorieprüfung Führerschein B', it: 'Prova di teoria per la patente B' },
    format: 'vf', questions: 30, minutes: 20, scoring: { type: 'errors', maxErrors: 3 }, signQuestions: 8,
    source: { de: 'Mitteilung des Ministeriums vom 15.12.2021', it: 'Avviso del Ministero del 15 dicembre 2021' }
  },
  {
    id: 'de-b-ersterwerb', country: 'DE', version: 'FeV-Anl7',
    name: { de: 'Klasse B, Ersterwerb (Deutschland)', it: 'Classe B, primo conseguimento (Germania)' },
    scope: { de: 'Nur für den ersten Führerschein der Klasse B – nicht für Erweiterungen.', it: 'Solo per il primo conseguimento della classe B, non per l’estensione di una patente già posseduta.' },
    format: 'multi', questions: 30, minutes: 45, scoring: { type: 'points', maxPoints: 10, failOnFives: 2 }, signQuestions: 6,
    source: { de: 'FeV, Anlage 7', it: 'FeV, allegato 7' },
    note: { de: 'Die Zeitvorgabe vor der Prüfung bei TÜV/DEKRA bestätigen lassen.', it: 'Il tempo disponibile va confermato presso TÜV/DEKRA.' }
  }
];

export const profileFor = (c: DrivingCountry): ExamProfile => EXAM_PROFILES.find((p) => p.country === c)!;
