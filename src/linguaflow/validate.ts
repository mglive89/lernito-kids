/**
 * Prüfung der Kurspakete: doppelte IDs, unvollständige Aufgaben, fehlende Übersetzungen, ungültige Audio-Verweise.
 * Wird vom Befehl `npm run packs:check` und von den Unit-Tests benutzt.
 */
import { joinSegments, normalizeAnswer } from './answer';
import type { ContentFile, CourseIndex, Exercise, Item, TranslationFile } from './types';

export interface Issue { level: 'error' | 'warning'; where: string; message: string }

export interface PackFiles {
  index: CourseIndex;
  /** Inhalt je Pfad (wie in index.courses[].content) */
  content: Record<string, ContentFile | undefined>;
  translations: Record<string, TranslationFile | undefined>;
  /** gibt es diese Datei im Paketordner? (für Audio) */
  exists: (path: string) => boolean;
}

const EXERCISE_TYPES = ['listen', 'choice', 'cloze', 'order', 'write', 'situation'];
const MIN_EXERCISES = 6;

export function validatePacks(files: PackFiles): Issue[] {
  const issues: Issue[] = [];
  const err = (where: string, message: string) => issues.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ level: 'warning', where, message });

  if (files.index?.format !== 1) err('courses.json', 'format muss 1 sein');
  const courseIds = new Set<string>();
  const checkedContent = new Set<string>();
  const checkedTr = new Set<string>();

  for (const c of files.index?.courses ?? []) {
    const where = `Kurs ${c.id ?? '?'}`;
    for (const f of ['id', 'source', 'target', 'level', 'kind', 'status', 'version', 'content', 'translations'] as const) {
      if (!c[f]) err(where, `Feld „${f}“ fehlt`);
    }
    if (courseIds.has(c.id)) err(where, 'doppelte Kurs-ID');
    courseIds.add(c.id);
    if (!['course', 'intro', 'demo'].includes(c.kind)) err(where, `kind „${c.kind}“ ist ungültig (course, intro, demo)`);
    if (!Array.isArray(c.lessons) || !c.lessons.length) err(where, 'keine Lektionen angegeben');
    if (c.source === c.target) err(where, 'Ausgangs- und Lernsprache sind gleich');

    const content = files.content[c.content];
    const tr = files.translations[c.translations];
    if (!content) { err(where, `Inhaltsdatei fehlt: ${c.content}`); continue; }
    if (!tr) { err(where, `Übersetzungsdatei fehlt: ${c.translations}`); continue; }
    if (content.language !== c.target) err(where, `Inhalt ist „${content.language}“, Kurs lernt „${c.target}“`);
    if (tr.source !== c.source || tr.target !== c.target) err(where, `Übersetzung ${tr.source}→${tr.target} passt nicht zu ${c.source}→${c.target}`);
    if (tr.content !== content.id) err(where, `Übersetzung gehört zu „${tr.content}“, nicht zu „${content.id}“`);
    if (!['reviewed', 'unreviewed', 'machine'].includes(tr.quality)) err(where, 'quality muss reviewed, unreviewed oder machine sein');

    const lessonIds = new Set(content.lessons.map((l) => l.id));
    for (const id of c.lessons ?? []) if (!lessonIds.has(id)) err(where, `Lektion „${id}“ gibt es im Inhalt nicht`);
    if (c.kind === 'course' && (c.lessons?.length ?? 0) < 5) warn(where, 'ein vollständiges Modul hat meist mindestens 5 Lektionen – sonst „intro“ oder „demo“ verwenden');

    if (!checkedContent.has(c.content)) { checkedContent.add(c.content); checkContent(content, c.content, files.exists, err, warn); }
    if (!checkedTr.has(c.translations)) { checkedTr.add(c.translations); }
    checkTranslations(content, tr, c.lessons ?? [], `${where} (${c.translations})`, err);
  }
  return issues;
}

function checkContent(content: ContentFile, file: string, exists: (p: string) => boolean,
  err: (w: string, m: string) => void, warn: (w: string, m: string) => void) {
  if (content.format !== 1) err(file, 'format muss 1 sein');
  const ids = new Set<string>();
  const unique = (id: string, where: string) => {
    if (!id) err(where, 'ID fehlt');
    else if (ids.has(id)) err(where, `doppelte ID „${id}“`);
    ids.add(id);
  };
  for (const lesson of content.lessons) {
    const lw = `${file} › ${lesson.id}`;
    unique(lesson.id, lw);
    if (!lesson.dialogue?.length) err(lw, 'kein Dialog');
    if (!lesson.vocabulary?.length) err(lw, 'keine Wörter und Sätze');
    if (!(lesson.minutes >= 5 && lesson.minutes <= 10)) warn(lw, `Dauer ${lesson.minutes} Min. – vorgesehen sind 5–10 Minuten`);
    const items = new Map<string, Item>();
    for (const it of [...(lesson.dialogue ?? []), ...(lesson.vocabulary ?? [])]) {
      unique(it.id, lw);
      if (!it.text?.trim()) err(`${lw} › ${it.id}`, 'Text fehlt');
      if (it.audio && !exists(it.audio)) err(`${lw} › ${it.id}`, `Audiodatei fehlt: ${it.audio}`);
      items.set(it.id, it);
    }
    const exs = lesson.exercises ?? [];
    if (exs.length < MIN_EXERCISES) err(lw, `nur ${exs.length} Aufgaben – mindestens ${MIN_EXERCISES}`);
    if (exs[exs.length - 1]?.type !== 'situation') err(lw, 'die letzte Aufgabe muss eine Situation (type: situation) sein');
    const types = new Set(exs.map((e) => e.type));
    for (const t of ['listen', 'choice', 'cloze', 'order', 'write']) if (!types.has(t as Exercise['type'])) warn(lw, `keine Aufgabe vom Typ „${t}“`);
    for (const ex of exs) {
      unique(ex.id, lw);
      checkExercise(ex, items, content.language, `${lw} › ${ex.id}`, err);
    }
  }
}

function checkExercise(ex: Exercise, items: Map<string, Item>, lang: string, where: string, err: (w: string, m: string) => void) {
  if (!EXERCISE_TYPES.includes(ex.type)) { err(where, `unbekannter Typ „${(ex as { type: string }).type}“`); return; }
  const needItem = (id: string | undefined) => { if (!id || !items.has(id)) err(where, `Verweis auf unbekanntes Element „${id}“`); };
  switch (ex.type) {
    case 'listen':
    case 'choice': {
      needItem(ex.item);
      if (ex.type === 'choice' && !['toSource', 'toTarget'].includes(ex.direction)) err(where, 'direction muss toSource oder toTarget sein');
      if (!Array.isArray(ex.options) || ex.options.length < 2) err(where, 'mindestens 2 Antwortmöglichkeiten');
      else {
        ex.options.forEach(needItem);
        if (!ex.options.includes(ex.item)) err(where, 'die richtige Antwort fehlt unter den Möglichkeiten');
        if (new Set(ex.options).size !== ex.options.length) err(where, 'doppelte Antwortmöglichkeit');
      }
      break;
    }
    case 'cloze': {
      needItem(ex.item);
      const text = items.get(ex.item)?.text ?? '';
      if (!ex.gap || !text.includes(ex.gap)) err(where, `Lücke „${ex.gap}“ kommt im Text nicht vor`);
      if (!ex.options?.includes(ex.gap)) err(where, 'die Lücke fehlt unter den Möglichkeiten');
      if (new Set(ex.options ?? []).size !== (ex.options ?? []).length) err(where, 'doppelte Antwortmöglichkeit');
      break;
    }
    case 'order': {
      needItem(ex.item);
      const text = items.get(ex.item)?.text ?? '';
      if (!ex.segments?.length || ex.segments.length < 2) err(where, 'mindestens 2 Segmente');
      else if (normalizeAnswer(joinSegments(ex.segments, lang), lang).replace(/\s/g, '') !== normalizeAnswer(text, lang).replace(/\s/g, '')) {
        err(where, 'die Segmente ergeben nicht den Text des Elements');
      }
      break;
    }
    case 'write':
      needItem(ex.item);
      break;
    case 'situation':
      if (!['write', 'choice'].includes(ex.mode)) err(where, 'mode muss write oder choice sein');
      if (!ex.answers?.length) err(where, 'keine richtigen Antworten (answers)');
      if (ex.mode === 'choice' && (!ex.options?.length || !ex.answers.some((a) => ex.options!.includes(a)))) err(where, 'bei mode choice muss eine Antwort unter den options sein');
      break;
  }
}

function checkTranslations(content: ContentFile, tr: TranslationFile, lessons: string[], where: string, err: (w: string, m: string) => void) {
  if (!tr.course?.title) err(where, 'Kurstitel fehlt');
  for (const lesson of content.lessons.filter((l) => lessons.includes(l.id))) {
    const lt = tr.lessons?.[lesson.id];
    if (!lt?.title || !lt?.goal) err(where, `Titel oder Ziel der Lektion „${lesson.id}“ fehlt`);
    for (const it of [...lesson.dialogue, ...lesson.vocabulary]) {
      if (!tr.items?.[it.id]?.trim()) err(where, `Übersetzung fehlt: ${it.id}`);
    }
    for (const ex of lesson.exercises) {
      const e = tr.exercises?.[ex.id];
      if (!e?.explain?.trim()) err(where, `Erklärung fehlt: ${ex.id}`);
      if (ex.type === 'situation' && !e?.prompt?.trim()) err(where, `Aufgabenstellung der Situation fehlt: ${ex.id}`);
    }
  }
}
