import type { LearningModule } from './types';
import { KITA_MODULES } from './modules/kita';
import { MATH_MODULES } from './modules/math';
import { MATH_SEK_MODULES } from './modules/mathSek';
import { GERMAN_MODULES } from './modules/german';
import { GERMAN_SEK_MODULES } from './modules/germanSek';
import { ITALIAN_MODULES } from './modules/italiano';
import { SACH_MODULES, WORLD3D_MODULES } from './modules/sach';
import { SCIENCE_MODULES } from './modules/science';
import { HUMANITIES_MODULES } from './modules/humanities';
import { ENGLISH_MODULES } from './modules/english';
import { EXTRA_MODULES } from './modules/extras';
import { CODING_MODULES } from './modules/coding';
import { LESSONS, lessonQuizModule } from '../video/lessons';
import { customToModule, type CustomModule } from './custom';
import { subjectDef } from '../school/subjects';
import type { Country } from '../school/systems';

export const BUILTIN_MODULES: LearningModule[] = [
  ...KITA_MODULES, ...MATH_MODULES, ...MATH_SEK_MODULES, ...GERMAN_MODULES, ...GERMAN_SEK_MODULES, ...ITALIAN_MODULES,
  ...SACH_MODULES, ...SCIENCE_MODULES, ...HUMANITIES_MODULES, ...ENGLISH_MODULES, ...EXTRA_MODULES, ...CODING_MODULES,
  ...WORLD3D_MODULES, ...LESSONS.map(lessonQuizModule)
];

export function allModules(custom: CustomModule[] = [], includeDrafts = false): LearningModule[] {
  return [...BUILTIN_MODULES, ...custom.filter((c) => includeDrafts || c.published).map(customToModule)];
}

export function findModule(id: string, custom: CustomModule[] = []): LearningModule | undefined {
  return allModules(custom, true).find((m) => m.id === id);
}

/** Schuljahre, für die ein Modul gilt */
export function moduleYears(m: LearningModule): [number, number] | undefined {
  if (m.years) return m.years;
  if (m.grade) return [m.grade, m.grade];
  return undefined;
}

export function fitsCountry(m: LearningModule, country: Country): boolean {
  return !m.countries || m.countries.includes(country);
}

export function kitaModules(custom: CustomModule[] = []): LearningModule[] {
  return allModules(custom).filter((m) => m.area === 'kita');
}

/** Module eines Fachs für Land und Schuljahr. Sammelfächer (z. B. Scienze) enthalten mehrere Fächer. */
export function schoolModules(country: Country, year: number, subject: string, custom: CustomModule[] = []): LearningModule[] {
  const ids = new Set([subject, ...(subjectDef(subject)?.includes ?? [])]);
  return allModules(custom).filter((m) => {
    if (m.area !== 'schule' || !m.subject || !ids.has(m.subject) || !fitsCountry(m, country)) return false;
    const y = moduleYears(m);
    return !y || (year >= y[0] && year <= y[1]);
  });
}

export function world3dModules(): LearningModule[] {
  return BUILTIN_MODULES.filter((m) => m.area === 'welt3d');
}
