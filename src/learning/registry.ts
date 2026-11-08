import type { Grade, LearningModule, SubjectId } from './types';
import { KITA_MODULES } from './modules/kita';
import { MATH_MODULES } from './modules/math';
import { GERMAN_MODULES } from './modules/german';
import { SACH_MODULES, WORLD3D_MODULES } from './modules/sach';
import { LESSONS, lessonQuizModule } from '../video/lessons';
import { customToModule, type CustomModule } from './custom';

export const BUILTIN_MODULES: LearningModule[] = [
  ...KITA_MODULES, ...MATH_MODULES, ...GERMAN_MODULES, ...SACH_MODULES, ...WORLD3D_MODULES, ...LESSONS.map(lessonQuizModule)
];

export function allModules(custom: CustomModule[] = [], includeDrafts = false): LearningModule[] {
  return [...BUILTIN_MODULES, ...custom.filter((c) => includeDrafts || c.published).map(customToModule)];
}

export function findModule(id: string, custom: CustomModule[] = []): LearningModule | undefined {
  return allModules(custom, true).find((m) => m.id === id);
}

export function kitaModules(custom: CustomModule[] = []): LearningModule[] {
  return allModules(custom).filter((m) => m.area === 'kita');
}

export function schoolModules(grade: Grade, subject: SubjectId, custom: CustomModule[] = []): LearningModule[] {
  return allModules(custom).filter((m) => m.area === 'schule' && m.subject === subject && (m.grade === grade || m.grade === undefined));
}

export function world3dModules(): LearningModule[] {
  return BUILTIN_MODULES.filter((m) => m.area === 'welt3d');
}
