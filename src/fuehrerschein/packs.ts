import { DEMO_DE, DEMO_IT } from './content/demo';
import { validateQuestion, type DrivingCountry, type Question, type SourceKind } from './schema';

/**
 * Versionierte Inhaltspakete. Eigene Demo-Fragen und amtliche Inhalte bleiben getrennte Pakete.
 * Amtliche Pakete dürfen nur mit geklärter Nutzungsbedingung (license) aufgenommen werden.
 */
export const PACK_FORMAT = 'lernito-fahrschule';
export const SCHEMA_VERSION = 1;

export interface ContentPack {
  format: typeof PACK_FORMAT;
  schemaVersion: number;
  id: string;
  /** Version des Pakets, z. B. Datum des Katalogstands */
  packVersion: string;
  country: DrivingCountry;
  kind: SourceKind;
  /** Pflicht bei amtlichen Paketen: Nutzungsbedingung / Erlaubnis */
  license?: string;
  questions: Question[];
}

export interface ImportResult { ok: boolean; errors: string[]; warnings: string[]; pack?: ContentPack }

/** Prüft ein Paket (z. B. aus einer JSON-Datei), bevor es aufgenommen wird. */
export function validatePack(input: unknown, existingIds: Set<string> = new Set()): ImportResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const p = input as Partial<ContentPack> | null;
  if (!p || typeof p !== 'object') return { ok: false, errors: ['Kein Objekt'], warnings };
  if (p.format !== PACK_FORMAT) errors.push(`format muss „${PACK_FORMAT}“ sein`);
  if (p.schemaVersion !== SCHEMA_VERSION) errors.push(`schemaVersion ${String(p.schemaVersion)} wird nicht unterstützt (erwartet ${SCHEMA_VERSION})`);
  if (!p.id) errors.push('id fehlt');
  if (!p.packVersion) errors.push('packVersion fehlt');
  if (p.country !== 'DE' && p.country !== 'IT') errors.push('country muss DE oder IT sein');
  if (p.kind !== 'original' && p.kind !== 'official') errors.push('kind muss original oder official sein');
  if (p.kind === 'official' && !p.license) errors.push('Amtliches Paket ohne geklärte Nutzungsbedingung (license) wird nicht importiert');
  if (!Array.isArray(p.questions) || !p.questions.length) errors.push('questions fehlt oder ist leer');
  const seen = new Set<string>();
  for (const q of p.questions ?? []) {
    errors.push(...validateQuestion(q));
    if (q.country !== p.country) errors.push(`${q.id}: Land passt nicht zum Paket`);
    if (q.source?.kind !== p.kind) errors.push(`${q.id}: Quellenart passt nicht zum Paket (eigene und amtliche Inhalte getrennt halten)`);
    if (seen.has(q.id) || existingIds.has(q.id)) errors.push(`${q.id}: ID ist schon vergeben`);
    seen.add(q.id);
    for (const l of (['de', 'it'] as const)) if (!q.text[l]) warnings.push(`${q.id}: Übersetzung ${l.toUpperCase()} fehlt`);
  }
  return { ok: errors.length === 0, errors, warnings, pack: errors.length ? undefined : (p as ContentPack) };
}

export const DEMO_PACKS: ContentPack[] = [
  { format: PACK_FORMAT, schemaVersion: SCHEMA_VERSION, id: 'lernito-demo-de', packVersion: '2026-11-15', country: 'DE', kind: 'original', questions: DEMO_DE },
  { format: PACK_FORMAT, schemaVersion: SCHEMA_VERSION, id: 'lernito-demo-it', packVersion: '2026-11-15', country: 'IT', kind: 'original', questions: DEMO_IT }
];

/** Hier werden weitere geprüfte Pakete registriert (z. B. amtliche Inhalte mit Erlaubnis). */
export const PACKS: ContentPack[] = [...DEMO_PACKS];
