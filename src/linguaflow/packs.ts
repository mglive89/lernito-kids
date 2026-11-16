/**
 * Kurspakete laden (public/linguaflow/…). Die App kennt keine einzelnen Sprachen:
 * alles, was in courses.json steht, wird angeboten.
 */
import { useEffect, useState } from 'react';
import type { CourseEntry, CourseIndex, ContentFile, Item, LangTag, LoadedCourse, TranslationFile } from './types';
import { baseOf } from './catalog';

export const PACK_BASE = `${import.meta.env.BASE_URL}linguaflow/`;

async function getJson<T>(path: string): Promise<T> {
  const r = await fetch(PACK_BASE + path);
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return (await r.json()) as T;
}

let indexPromise: Promise<CourseIndex> | null = null;
export function loadIndex(): Promise<CourseIndex> {
  if (!indexPromise) indexPromise = getJson<CourseIndex>('courses.json').catch((e) => { indexPromise = null; throw e; });
  return indexPromise;
}

const courseCache = new Map<string, Promise<LoadedCourse>>();
export function loadCourse(entry: CourseEntry): Promise<LoadedCourse> {
  const key = `${entry.id}@${entry.version}`;
  let p = courseCache.get(key);
  if (!p) {
    p = Promise.all([getJson<ContentFile>(entry.content), getJson<TranslationFile>(entry.translations)]).then(([content, tr]) => {
      const byId = new Map(content.lessons.map((l) => [l.id, l]));
      const lessons = entry.lessons.map((id) => byId.get(id)).filter((l): l is NonNullable<typeof l> => !!l);
      const items = new Map<string, Item>();
      for (const l of content.lessons) for (const it of [...l.dialogue, ...l.vocabulary]) items.set(it.id, it);
      return { entry, content, tr, lessons, items };
    });
    p.catch(() => courseCache.delete(key));
    courseCache.set(key, p);
  }
  return p;
}

/** Nur veröffentlichte Kurse werden angeboten */
export const published = (index: CourseIndex | null | undefined) => (index?.courses ?? []).filter((c) => c.status === 'published');

export interface Availability {
  /** Kurse genau für dieses Paar */
  exact: CourseEntry[];
  /** Ausgangssprachen, für die es Kurse in dieser Lernsprache gibt */
  otherSources: LangTag[];
  /** Kurse für eine andere Variante derselben Sprache (z. B. „de“ statt „de-AT“) – nur als Hinweis */
  variants: CourseEntry[];
}

export function availability(index: CourseIndex | null | undefined, known: LangTag, target: LangTag): Availability {
  const list = published(index);
  const exact = list.filter((c) => c.source === known && c.target === target);
  const otherSources = [...new Set(list.filter((c) => c.target === target && c.source !== known).map((c) => c.source))];
  const variants = exact.length ? [] : list.filter((c) => c.source === known && c.target !== target && baseOf(c.target) === baseOf(target));
  return { exact, otherSources, variants };
}

/** Beste Art eines Kurses für eine Lernsprache (für die Liste) */
const RANK = { course: 0, intro: 1, demo: 2 } as const;
export function bestKind(index: CourseIndex | null | undefined, known: LangTag | null, target: LangTag): CourseEntry | undefined {
  return published(index).filter((c) => c.target === target && (!known || c.source === known)).sort((a, b) => RANK[a.kind] - RANK[b.kind])[0];
}

type Load<T> = { data: T | null; error: string | null };

export function useIndex(): Load<CourseIndex> {
  const [s, set] = useState<Load<CourseIndex>>({ data: null, error: null });
  useEffect(() => {
    let alive = true;
    loadIndex().then((data) => alive && set({ data, error: null }), (e: Error) => alive && set({ data: null, error: e.message }));
    return () => { alive = false; };
  }, []);
  return s;
}

export function useCourse(courseId: string | null | undefined): Load<LoadedCourse> & { missing: boolean } {
  const idx = useIndex();
  const [s, set] = useState<Load<LoadedCourse>>({ data: null, error: null });
  const entry = idx.data?.courses.find((c) => c.id === courseId);
  useEffect(() => {
    if (!entry) return;
    let alive = true;
    loadCourse(entry).then((data) => alive && set({ data, error: null }), (e: Error) => alive && set({ data: null, error: e.message }));
    return () => { alive = false; };
  }, [entry]);
  return { ...s, error: s.error ?? idx.error, missing: !!idx.data && !entry };
}
