/**
 * Prüft LinguaFlow-Kurspakete.
 *   npm run packs:check                       → public/linguaflow
 *   npm run packs:check -- docs/linguaflow/example   → beliebiger Paketordner
 * Ausgabe: Fehler und Warnungen; Rückgabewert 1, wenn es Fehler gibt.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { validatePacks, type PackFiles } from '../src/linguaflow/validate';
import type { CourseIndex } from '../src/linguaflow/types';

function readJson<T>(file: string): T | undefined {
  if (!existsSync(file)) return undefined;
  try { return JSON.parse(readFileSync(file, 'utf8')) as T; } catch (e) {
    console.error(`✖ ${file}: kein gültiges JSON – ${(e as Error).message}`);
    process.exitCode = 1;
    return undefined;
  }
}

export function loadPackDir(dir: string): PackFiles {
  const index = readJson<CourseIndex>(join(dir, 'courses.json')) ?? ({ format: 1, courses: [] } as unknown as CourseIndex);
  const content: PackFiles['content'] = {};
  const translations: PackFiles['translations'] = {};
  for (const c of index.courses ?? []) {
    if (c.content) content[c.content] = readJson(join(dir, c.content));
    if (c.translations) translations[c.translations] = readJson(join(dir, c.translations));
  }
  return { index, content, translations, exists: (p) => existsSync(join(dir, p)) };
}

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('-'));
let errors = 0;
for (const d of dirs.length ? dirs : ['public/linguaflow']) {
  const dir = resolve(d);
  if (!existsSync(join(dir, 'courses.json'))) { console.error(`✖ ${d}: courses.json fehlt`); errors++; continue; }
  const files = loadPackDir(dir);
  const issues = validatePacks(files);
  const errs = issues.filter((i) => i.level === 'error');
  const warns = issues.filter((i) => i.level === 'warning');
  for (const i of errs) console.error(`✖ ${i.where}: ${i.message}`);
  for (const i of warns) console.warn(`⚠ ${i.where}: ${i.message}`);
  const lessons = files.index.courses.reduce((n, c) => n + (c.lessons?.length ?? 0), 0);
  console.log(`${errs.length ? '✖' : '✔'} ${d}: ${files.index.courses.length} Kurse, ${lessons} Lektionen – ${errs.length} Fehler, ${warns.length} Warnungen`);
  errors += errs.length;
}
if (errors) process.exitCode = 1;
