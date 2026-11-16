/**
 * Seiten von LinguaFlow: Start, Sprachwahl (erste Einrichtung und neuer Kurs), Kursseite, Einstellungen.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle2, ChevronRight, Dumbbell, Languages, Plus, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { Lino } from '../components/Lino';
import { useApp } from '../store/useApp';
import { APP_NAME } from './brand';
import { baseOf, deviceUiLang, dirOf, endonymOf, nameOf, UI_LANGS } from './catalog';
import { bigButton, cn, CourseFacts, KindBadge, LangName, LangPicker, Loading, LoadError, QualityNote } from './components';
import { useT } from './i18n';
import { availability, bestKind, published, useCourse, useIndex } from './packs';
import { useCourseProgress, useFlowStore, useOwner, useOwnerId } from './store';
import type { CourseEntry, CourseIndex, LangTag } from './types';

/** Schreibrichtung und Sprache der ganzen Oberfläche */
export function useDocumentLang() {
  const { ui } = useT();
  useEffect(() => {
    const el = document.documentElement;
    const prev = { lang: el.lang, dir: el.dir };
    el.lang = ui;
    el.dir = dirOf(ui);
    return () => { el.lang = prev.lang; el.dir = prev.dir; };
  }, [ui]);
}

/** Einstieg: erste Einrichtung oder aktueller Kurs */
export function FlowStart() {
  const o = useOwner();
  const idx = useIndex();
  if (!o.ui || !o.known || !o.target) return <Navigate to="/benvenuto" replace />;
  if (!idx.data && !idx.error) return <Loading />;
  if (o.active && idx.data?.courses.some((c) => c.id === o.active)) return <Navigate to="/corso" replace />;
  return <Navigate to="/scegli" replace />;
}

/* ---------------- Rahmen ---------------- */
export function FlowShell() {
  const { t, ui } = useT();
  useDocumentLang();
  const o = useOwner();
  const { pathname } = useLocation();
  const hasProfile = useApp((s) => s.profiles.some((p) => p.id === s.activeProfileId));
  const items = [
    { to: '/corso', icon: BookOpen, label: t('nav.lessons'), id: 'lf-nav-lezioni', on: pathname === '/corso' },
    { to: o.active ? `/ripasso/${o.active}` : '/corso', icon: RotateCcw, label: t('nav.review'), id: 'lf-nav-ripasso', on: pathname.startsWith('/ripasso') },
    { to: '/scegli', icon: Languages, label: t('nav.courses'), id: 'lf-nav-corsi', on: pathname === '/scegli' },
    { to: '/impostazioni', icon: SettingsIcon, label: t('nav.settings'), id: 'lf-nav-impostazioni', on: pathname === '/impostazioni' }
  ];
  return (
    <div className="min-h-[100dvh] bg-creme" data-testid="linguaflow" lang={ui} dir={dirOf(ui)}>
      <header className="sticky top-0 z-30 border-b border-tinte/[0.07] bg-flaeche/95 backdrop-blur" style={{ paddingTop: 'var(--safe-top)' }}>
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4">
          <Link to="/corso" className="flex items-center gap-1.5" aria-label={APP_NAME}>
            <span className="-my-2 h-12 overflow-hidden"><Lino size={44} still /></span>
            <span className="font-display text-xl font-extrabold text-minze-700" data-testid="nome-app">{APP_NAME}</span>
          </Link>
          <span className="flex-1" />
          {o.target && (
            <Link to="/scegli" className="max-w-[45%] truncate rounded-full bg-minze-50 px-3 py-1 text-sm font-bold text-minze-700 ring-1 ring-minze-300" data-testid="lingua-attiva">
              {nameOf(o.target, ui)}
            </Link>
          )}
          {hasProfile && (
            <Link to="/lingue" className="hidden items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold text-tinte/60 hover:bg-tinte/[0.05] sm:flex" data-testid="lf-pratica">
              <Dumbbell size={16} /> {t('nav.practice')}
            </Link>
          )}
        </div>
        <nav className="mx-auto hidden max-w-3xl gap-1 px-3 pb-2 sm:flex" aria-label={APP_NAME}>
          {items.map((it) => (
            <NavLink key={it.id} to={it.to} data-testid={it.id} aria-current={it.on ? 'page' : undefined}
              className={cn('flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold', it.on ? 'bg-minze-50 text-minze-700' : 'text-tinte/60 hover:bg-tinte/[0.04]')}>
              <it.icon size={16} /> {it.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-5 sm:pb-10"><Outlet /></main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur sm:hidden" style={{ paddingBottom: 'var(--safe-bottom)' }} aria-label={APP_NAME}>
        <div className="grid grid-cols-4">
          {items.map((it) => (
            <NavLink key={it.id} to={it.to} data-testid={`${it.id}-mobile`} aria-current={it.on ? 'page' : undefined}
              className={cn('flex min-w-0 flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-bold', it.on ? 'text-minze-700' : 'text-tinte/50')}>
              <it.icon size={22} strokeWidth={it.on ? 2.5 : 2} /><span className="max-w-full truncate px-1">{it.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

/* ---------------- Sprachwahl ---------------- */
function courseTags(index: CourseIndex | null) {
  return [...new Set(published(index).flatMap((c) => [c.source, c.target]))];
}

/** Erste Einrichtung: Oberflächensprache → Parlo… → Voglio imparare… */
export function FlowWelcome() {
  const { t, ui } = useT();
  useDocumentLang();
  const o = useOwner();
  const owner = useOwnerId();
  const patch = useFlowStore((s) => s.patch);
  const [step, setStep] = useState<'ui' | 'pair'>(o.ui ? 'pair' : 'ui');
  const [uiPick, setUiPick] = useState<LangTag>(o.ui ?? deviceUiLang('it'));
  if (step === 'ui') {
    return (
      <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col gap-5 px-4 py-8" data-testid="lf-benvenuto" lang={ui} dir={dirOf(ui)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <Lino mood="winken" size={120} />
          <h1 className="font-display text-3xl font-extrabold">{t('welcome.title', { app: APP_NAME })}</h1>
          <p className="text-tinte/70">{t('welcome.text')}</p>
        </div>
        <section className="karte-3d p-4">
          <h2 className="font-display text-lg font-bold">{t('welcome.ui')}</h2>
          <p className="mb-3 text-sm text-tinte/60">{t('welcome.uiHint')}</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {UI_LANGS.map((l) => (
              <button key={l} type="button" onClick={() => { setUiPick(l); patch(owner, { ui: l }); }} data-testid={`ui-${l}`} aria-pressed={uiPick === l}
                className={cn('rounded-xl border-2 px-3 py-3 text-start', uiPick === l ? 'border-minze-500 bg-minze-50' : 'border-tinte/10 hover:bg-tinte/[0.03]')}>
                <span className="block font-bold" lang={l}>{endonymOf(l)}</span>
                <span className="text-sm text-tinte/55">{nameOf(l, uiPick)}</span>
              </button>
            ))}
          </div>
        </section>
        <button type="button" className={bigButton('primary', 'w-full')} data-testid="ui-avanti" onClick={() => { patch(owner, { ui: uiPick }); setStep('pair'); }}>{t('next')}</button>
      </div>
    );
  }
  return (
    <div className="mx-auto min-h-[100dvh] max-w-xl px-4 py-6" lang={ui} dir={dirOf(ui)}>
      <ChoosePair first />
    </div>
  );
}

/** Seite „Corsi“ im Rahmen */
export function FlowChoose() {
  return <ChoosePair first={false} />;
}

/**
 * Wahl „Parlo…“ und „Voglio imparare…“. Die Auswahl wird gespeichert, aber nie automatisch geändert:
 * gibt es keinen Kurs, sieht man das und die Ausgangssprachen, für die es Lektionen gibt.
 */
function ChoosePair({ first }: { first: boolean }) {
  const { t, ui } = useT();
  const o = useOwner();
  const owner = useOwnerId();
  const patch = useFlowStore((s) => s.patch);
  const startCourse = useFlowStore((s) => s.startCourse);
  const idx = useIndex();
  const nav = useNavigate();
  const [known, setKnown] = useState<LangTag | null>(o.known);
  const [target, setTarget] = useState<LangTag | null>(o.target);
  const [editKnown, setEditKnown] = useState(!o.known);
  const extra = useMemo(() => courseTags(idx.data), [idx.data]);
  const deviceBase = typeof navigator !== 'undefined' ? baseOf(navigator.language || ui) : ui;

  if (idx.error) return <LoadError />;
  if (!idx.data) return <Loading />;
  const index = idx.data;

  const pickKnown = (tag: LangTag) => { setKnown(tag); setEditKnown(false); patch(owner, { known: tag }); if (target === tag) setTarget(null); };
  const pickTarget = (tag: LangTag) => { setTarget(tag); patch(owner, { target: tag }); };
  const sourcesWithCourses = [...new Set(published(index).map((c) => c.source))];
  const targetsForKnown = known ? [...new Set(published(index).filter((c) => c.source === known).map((c) => c.target))] : [];

  return (
    <div className="flex flex-col gap-5" data-testid="lf-scegli">
      {first && (
        <div className="flex items-center gap-3">
          <Lino mood="freude" size={70} still />
          <h1 className="font-display text-2xl font-extrabold">{APP_NAME}</h1>
        </div>
      )}
      {!first && <MyCourses index={index} />}

      <section className="karte-3d p-4" data-testid="sezione-parlo">
        <h2 className="font-display text-xl font-bold">{t('pick.known')}</h2>
        {known && !editKnown ? (
          <div className="mt-2 flex items-center gap-3">
            <LangName tag={known} ui={ui} className="flex-1" />
            <button type="button" className={bigButton('ghost', 'min-h-0 py-1.5 text-sm')} onClick={() => setEditKnown(true)} data-testid="cambia-parlo">{t('pick.change')}</button>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-tinte/60">{t('pick.knownHint')}</p>
            <LangPicker value={known} onPick={pickKnown} extraTags={extra} testId="picker-parlo"
              top={{ title: t('pick.withCourses'), tags: [...new Set([deviceBase, ...sourcesWithCourses])] }} />
          </>
        )}
      </section>

      {known && !editKnown && (
        <section className="karte-3d p-4" data-testid="sezione-imparo">
          <h2 className="font-display text-xl font-bold">{t('pick.target')}</h2>
          <p className="mb-3 text-sm text-tinte/60">{t('pick.targetHint')}</p>
          <LangPicker value={target} onPick={pickTarget} exclude={known} extraTags={extra} testId="picker-imparo"
            top={targetsForKnown.length ? { title: t('pick.withCourses'), tags: targetsForKnown } : undefined}
            badge={(tag) => { const best = bestKind(index, known, tag); return <KindBadge kind={best?.kind ?? 'none'} />; }} />
        </section>
      )}

      {known && target && !editKnown && (
        <Availability index={index} known={known} target={target}
          onStart={(c) => { startCourse(owner, c.id, known, target); nav('/corso'); }}
          onUseSource={(s) => pickKnown(s)} />
      )}
    </div>
  );
}

function Availability({ index, known, target, onStart, onUseSource }: {
  index: CourseIndex; known: LangTag; target: LangTag; onStart: (c: CourseEntry) => void; onUseSource: (s: LangTag) => void;
}) {
  const { t, ui } = useT();
  const o = useOwner();
  const a = availability(index, known, target);
  const kn = nameOf(known, ui);
  const tg = nameOf(target, ui);
  if (a.exact.length) {
    return (
      <section className="flex flex-col gap-3" data-testid="disponibile">
        {a.exact.map((c) => (
          <div key={c.id} className="karte-3d flex flex-col gap-3 p-4" data-testid={`corso-${c.id}`}>
            <p className="font-display text-lg font-bold">{kn} → {tg}</p>
            <CourseFacts entry={c} />
            <button type="button" className={bigButton('primary', 'w-full')} onClick={() => onStart(c)} data-testid="inizia-corso">
              {o.courses[c.id] ? t('avail.continue') : t('avail.start')}
            </button>
          </div>
        ))}
      </section>
    );
  }
  return (
    <section className="rounded-2xl bg-sonne-50 p-4 ring-1 ring-sonne-300/70" data-testid="non-disponibile" role="status">
      <p className="font-display text-lg font-bold">{t('avail.none')}</p>
      <p className="mt-1 text-tinte/75">{t('avail.noneText', { known: kn, target: tg })}</p>
      {a.otherSources.length > 0 ? (
        <>
          <p className="mt-3 font-semibold">{t('avail.otherSources', { target: tg })}</p>
          <ul className="mt-2 flex flex-wrap gap-2" data-testid="altre-lingue-partenza">
            {a.otherSources.map((s) => (
              <li key={s}>
                <button type="button" onClick={() => onUseSource(s)} className="rounded-full bg-flaeche px-3 py-1.5 text-sm font-semibold ring-1 ring-tinte/15 hover:bg-tinte/[0.03]"
                  data-testid={`usa-partenza-${s}`} title={t('avail.useSource', { lang: nameOf(s, ui) })}>
                  {nameOf(s, ui)} <span lang={s} className="text-tinte/50">({endonymOf(s)})</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : <p className="mt-3 text-sm text-tinte/60">{t('avail.noOther', { target: tg })}</p>}
      {a.variants.length > 0 && (
        <p className="mt-3 text-sm text-tinte/70">{t('avail.variants')} {a.variants.map((v) => nameOf(v.target, ui)).join(', ')}</p>
      )}
    </section>
  );
}

/** Liste der eigenen Kurse mit Wechsel – der Fortschritt jedes Kurses bleibt erhalten */
function MyCourses({ index }: { index: CourseIndex }) {
  const { t, ui } = useT();
  const o = useOwner();
  const owner = useOwnerId();
  const startCourse = useFlowStore((s) => s.startCourse);
  const nav = useNavigate();
  const mine = index.courses.filter((c) => o.courses[c.id]);
  if (!mine.length) return null;
  return (
    <section data-testid="miei-corsi">
      <h2 className="mb-2 font-display text-xl font-bold">{t('home.myCourses')}</h2>
      <ul className="flex flex-col gap-2">
        {mine.map((c) => {
          const p = o.courses[c.id]!;
          const done = c.lessons.filter((l) => p.done[l]).length;
          const active = o.active === c.id;
          return (
            <li key={c.id}>
              <button type="button" onClick={() => { startCourse(owner, c.id, c.source, c.target); nav('/corso'); }} data-testid={`mio-corso-${c.id}`} data-active={active ? 'true' : undefined}
                className={cn('karte-3d flex w-full items-center gap-3 p-3 text-start', active && 'ring-2 ring-minze-400')}>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold">{nameOf(c.source, ui)} → {nameOf(c.target, ui)}</span>
                  <span className="text-sm text-tinte/60">{t('home.progress', { done, n: c.lessons.length })}</span>
                </span>
                <KindBadge kind={c.kind} />
                {active ? <span className="text-xs font-bold text-minze-700">{t('home.active')}</span> : <ChevronRight size={18} className="text-tinte/40 rtl:rotate-180" />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------- Kursseite ---------------- */
export function FlowHome() {
  const { t, ui } = useT();
  const o = useOwner();
  const course = useCourse(o.active);
  const prog = useCourseProgress(o.active);
  if (!o.active) return <Navigate to="/scegli" replace />;
  if (course.missing) return <Navigate to="/scegli" replace />;
  if (course.error) return <LoadError />;
  if (!course.data) return <Loading />;
  const { entry, tr, lessons } = course.data;
  const done = lessons.filter((l) => prog.done[l.id]).length;
  const mistakes = Object.keys(prog.mistakes).length;
  const next = lessons.find((l) => !prog.done[l.id]);
  return (
    <div className="flex flex-col gap-5" data-testid="lf-corso" data-course={entry.id}>
      <section className="karte-3d flex flex-col gap-2 p-4">
        <p className="text-sm font-semibold text-tinte/55">{nameOf(entry.source, ui)} → {nameOf(entry.target, ui)} · <span lang={entry.target}>{endonymOf(entry.target)}</span></p>
        <h1 className="font-display text-2xl font-extrabold" lang={entry.source} dir={dirOf(entry.source)} data-testid="titolo-corso">{tr.course.title}</h1>
        <p className="text-tinte/70" lang={entry.source} dir={dirOf(entry.source)}>{tr.course.description}</p>
        <CourseFacts entry={entry} />
        {entry.kind !== 'course' && <p className="text-sm text-tinte/65" data-testid="corso-breve">{t('home.short', { kind: t(`kind.${entry.kind}`), lessons: entry.lessons.length === 1 ? t('lessons.1') : t('lessons.n', { n: entry.lessons.length }) })}</p>}
        <QualityNote quality={tr.quality} />
        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-tinte/[0.08]" aria-hidden><div className="h-full rounded-full bg-minze-500 transition-all" style={{ width: `${(done / Math.max(1, lessons.length)) * 100}%` }} /></div>
        <p className="text-sm font-semibold text-tinte/65" data-testid="progresso-corso" data-done={done}>{t('home.progress', { done, n: lessons.length })}</p>
      </section>

      <Link to={`/ripasso/${entry.id}`} className={cn('flex items-center gap-3 rounded-2xl p-4 ring-1', mistakes ? 'bg-koralle-50 ring-koralle-300' : 'bg-flaeche ring-tinte/[0.07]')} data-testid="vai-ripasso" data-n={mistakes}>
        <RotateCcw className={mistakes ? 'text-koralle-600' : 'text-tinte/40'} />
        <span className="flex-1">
          <span className="block font-bold">{t('home.review')}</span>
          <span className="text-sm text-tinte/65">{mistakes ? t('home.reviewN', { n: mistakes }) : t('home.reviewNone')}</span>
        </span>
        <ChevronRight size={18} className="text-tinte/40 rtl:rotate-180" />
      </Link>

      <ol className="flex flex-col gap-2.5" data-testid="lista-lezioni">
        {lessons.map((l, i) => {
          const r = prog.done[l.id];
          const lt = tr.lessons[l.id];
          const isNext = next?.id === l.id;
          return (
            <li key={l.id}>
              <Link to={`/lezione/${entry.id}/${l.id}`} data-testid={`lezione-${l.id}`} data-done={r ? 'true' : undefined}
                className={cn('karte-3d flex items-center gap-3 p-3.5', isNext && 'ring-2 ring-minze-400')}>
                <span className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold', r ? 'bg-minze-500 text-white' : 'bg-tinte/[0.06] text-tinte/60')}>
                  {r ? <CheckCircle2 size={22} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1" lang={entry.source} dir={dirOf(entry.source)}>
                  <span className="block font-bold">{lt?.title}</span>
                  <span className="block text-sm text-tinte/60">{lt?.goal}</span>
                </span>
                <span className="shrink-0 text-end text-xs text-tinte/55">
                  {t('home.minutes', { n: l.minutes })}
                  {r && <span className="block font-bold text-minze-700">{r.score}/{r.total}</span>}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      <Link to="/scegli" className={bigButton('outline', 'w-full')} data-testid="aggiungi-corso"><Plus size={18} /> {t('home.addCourse')}</Link>
    </div>
  );
}

/* ---------------- Einstellungen ---------------- */
export function FlowSettings() {
  const { t, ui } = useT();
  const o = useOwner();
  const owner = useOwnerId();
  const patch = useFlowStore((s) => s.patch);
  const toggle = (k: 'showTranslation' | 'showTranslit' | 'effects', label: string) => (
    <label className="flex items-center gap-3 py-2">
      <input type="checkbox" className="h-5 w-5 accent-minze-600" checked={o[k] !== false} onChange={(e) => patch(owner, { [k]: e.target.checked })} data-testid={`opz-${k}`} />
      <span>{label}</span>
    </label>
  );
  return (
    <div className="flex flex-col gap-5" data-testid="lf-impostazioni">
      <h1 className="font-display text-2xl font-extrabold">{t('settings.title')}</h1>
      <section className="karte-3d p-4">
        <h2 className="mb-2 font-display text-lg font-bold">{t('settings.ui')}</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {UI_LANGS.map((l) => (
            <button key={l} type="button" onClick={() => patch(owner, { ui: l })} data-testid={`ui-${l}`} aria-pressed={ui === l}
              className={cn('rounded-xl border-2 px-3 py-2.5 text-start font-bold', ui === l ? 'border-minze-500 bg-minze-50' : 'border-tinte/10')}>
              <span lang={l}>{endonymOf(l)}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="karte-3d p-4">
        <h2 className="mb-1 font-display text-lg font-bold">{t('settings.pair')}</h2>
        <p className="mb-3 text-tinte/70">{o.known ? nameOf(o.known, ui) : '–'} → {o.target ? nameOf(o.target, ui) : '–'}</p>
        <Link to="/scegli" className={bigButton('outline')}>{t('pick.change')}</Link>
      </section>
      <section className="karte-3d p-4">
        {toggle('showTranslation', t('settings.translation'))}
        {toggle('showTranslit', t('settings.translit'))}
        {toggle('effects', t('settings.effects'))}
      </section>
      <p className="text-sm text-tinte/60">{t('settings.data')}</p>
    </div>
  );
}
