import type { Theory } from './types';
import { MATH_PRIMARY } from './mathPrimary';
import { MATH_SEK } from './mathSek';
import { LANGUAGES } from './languages';
import { SCIENCE } from './science';
import { SOCIETY } from './society';
import { COMPUTING } from './computing';

export type { Theory, TheorySection } from './types';

/** Ausführliche Theorie aller Schulthemen (wird bei Bedarf nachgeladen). */
export const THEORY: Record<string, Theory> = {
  ...MATH_PRIMARY, ...MATH_SEK, ...LANGUAGES, ...SCIENCE, ...SOCIETY, ...COMPUTING
};

export function theoryFor(moduleId: string): Theory | undefined {
  return THEORY[moduleId];
}
