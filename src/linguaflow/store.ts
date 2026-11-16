/**
 * Einstellungen und Fortschritt von LinguaFlow – lokal im Gerät (localStorage), ohne Konto.
 * Getrennt je Lernito-Profil (oder „ospite“ ohne Profil) und je Kurs: Wechseln verliert nichts.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useApp } from '../store/useApp';
import type { LangTag } from './types';

export interface LessonResult { score: number; total: number; at: number }
export interface Mistake { lesson: string; n: number; at: number }
export interface CourseProgress {
  done: Record<string, LessonResult>;
  /** Aufgaben-ID → Fehler (für den Ripasso) */
  mistakes: Record<string, Mistake>;
  startedAt: number;
}

export interface FlowOwner {
  /** Oberflächensprache */
  ui: LangTag | null;
  /** Ausgangssprache („Parlo…“) */
  known: LangTag | null;
  /** Lernsprache („Voglio imparare…“) */
  target: LangTag | null;
  /** aktiver Kurs */
  active: string | null;
  showTranslation: boolean;
  showTranslit: boolean;
  /** Töne und Animationen (fehlt bei alten Ständen = an) */
  effects?: boolean;
  courses: Record<string, CourseProgress>;
}

export const GUEST = 'ospite';
export const emptyOwner = (): FlowOwner => ({ ui: null, known: null, target: null, active: null, showTranslation: true, showTranslit: true, effects: true, courses: {} });
export const emptyCourse = (now = Date.now()): CourseProgress => ({ done: {}, mistakes: {}, startedAt: now });

interface State {
  byOwner: Record<string, FlowOwner>;
  patch: (owner: string, p: Partial<FlowOwner>) => void;
  startCourse: (owner: string, courseId: string, known: LangTag, target: LangTag) => void;
  finishLesson: (owner: string, courseId: string, lessonId: string, score: number, total: number) => void;
  addMistake: (owner: string, courseId: string, exId: string, lessonId: string) => void;
  clearMistake: (owner: string, courseId: string, exId: string) => void;
}

export const useFlowStore = create<State>()(
  persist(
    (set) => {
      const upd = (owner: string, fn: (o: FlowOwner) => FlowOwner) =>
        set((s) => ({ byOwner: { ...s.byOwner, [owner]: fn(s.byOwner[owner] ?? emptyOwner()) } }));
      const updCourse = (owner: string, courseId: string, fn: (c: CourseProgress) => CourseProgress) =>
        upd(owner, (o) => ({ ...o, courses: { ...o.courses, [courseId]: fn(o.courses[courseId] ?? emptyCourse()) } }));
      return {
        byOwner: {},
        patch: (owner, p) => upd(owner, (o) => ({ ...o, ...p })),
        startCourse: (owner, courseId, known, target) =>
          upd(owner, (o) => ({ ...o, known, target, active: courseId, courses: o.courses[courseId] ? o.courses : { ...o.courses, [courseId]: emptyCourse() } })),
        finishLesson: (owner, courseId, lessonId, score, total) => updCourse(owner, courseId, (c) => {
          const prev = c.done[lessonId];
          // bestes Ergebnis behalten
          const best = prev && prev.score / prev.total > score / total ? prev : { score, total, at: Date.now() };
          return { ...c, done: { ...c.done, [lessonId]: { ...best, at: Date.now() } } };
        }),
        addMistake: (owner, courseId, exId, lessonId) => updCourse(owner, courseId, (c) => ({
          ...c, mistakes: { ...c.mistakes, [exId]: { lesson: lessonId, n: (c.mistakes[exId]?.n ?? 0) + 1, at: Date.now() } }
        })),
        clearMistake: (owner, courseId, exId) => updCourse(owner, courseId, (c) => {
          if (!c.mistakes[exId]) return c;
          const { [exId]: _gone, ...rest } = c.mistakes;
          return { ...c, mistakes: rest };
        })
      };
    },
    { name: 'linguaflow-v1', version: 1, storage: createJSONStorage(() => localStorage), partialize: (s) => ({ byOwner: s.byOwner }) }
  )
);

/** Wem gehört der Fortschritt? Aktives Lernito-Profil, sonst Gast. */
export function useOwnerId(): string {
  return useApp((s) => s.activeProfileId) ?? GUEST;
}

const EMPTY = emptyOwner();
export function useOwner(): FlowOwner {
  const id = useOwnerId();
  return useFlowStore((s) => s.byOwner[id]) ?? EMPTY;
}

const EMPTY_COURSE = emptyCourse(0);
export function useCourseProgress(courseId: string | null | undefined): CourseProgress {
  const o = useOwner();
  return (courseId && o.courses[courseId]) || EMPTY_COURSE;
}
