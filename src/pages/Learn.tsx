import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BookOpen, Check, Crown, Lock, Star, Trophy } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { COLOR_CLASSES, Notice, ProgressBar, SectionTitle, Tile, TopBar } from '../components/ui';
import { sfx } from '../lib/sound';
import { Lino, LinoSays } from '../components/Lino';
import { findModule, kitaModules, moduleYears, schoolModules, world3dModules } from '../learning/registry';
import type { LearningModule } from '../learning/types';
import { L, getLang, tr } from '../i18n';
import { stageFor, stagesOf, yearLabel, type Country, type SubjectId } from '../school/systems';
import { subjectDef, subjectName } from '../school/subjects';
import type { ModuleProgress } from '../learning/adaptive';
import { needsPractice, pathDoneOf } from '../learning/adaptive';
import { GameRunner } from '../games/GameRunner';
import { hasWebGL } from '../lib/webgl';

const stufe = (l: number) => [L('', ''), L('Leicht', 'Facile'), L('Mittel', 'Medio'), L('Knifflig', 'Difficile')][l] ?? '';

function ModuleBadge({ p }: { p?: ModuleProgress }) {
  if (!p || p.rounds === 0) return <span className="chip bg-himmel-50 px-2 py-0.5 text-xs text-himmel-700">{L('Neu', 'Nuovo')}</span>;
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 shadow-weich" aria-label={L(`${p.bestStars} von 3 Sternen, Stufe ${stufe(p.level)}`, `${p.bestStars} stelle su 3, livello ${stufe(p.level)}`)}>
      {[1, 2, 3].map((i) => <Star key={i} size={14} className={i <= p.bestStars ? 'fill-sonne-500 text-sonne-500' : 'text-tinte/20'} />)}
    </span>
  );
}

export function ModuleGrid({ modules }: { modules: LearningModule[] }) {
  const { progress } = useActiveProfile();
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {modules.map((m) => (
        <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={tr(m.title)} subtitle={tr(m.subtitle)} color={m.color} badge={<ModuleBadge p={progress.modules[m.id]} />} testId={`modul-${m.id}`}>
          {progress.modules[m.id]?.rounds ? <span className="relative mt-auto text-xs font-bold text-tinte/55">{L('Stufe', 'Livello')}: {stufe(progress.modules[m.id]!.level)}{needsPractice(progress.modules[m.id]) ? L(' · Nochmal üben', ' · Da ripassare') : ''}</span> : null}
        </Tile>
      ))}
    </div>
  );
}

export function KitaPage() {
  const custom = useApp((s) => s.customModules);
  const { profile, progress } = useActiveProfile();
  const mods = kitaModules(custom).filter((m) => !m.langs || m.langs.includes(getLang()));
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={tr(stageFor(profile?.country ?? 'DE', 0).name)} back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text={L('Such dir ein Spiel aus! Tippe auf ein Bild.', 'Scegli un gioco! Tocca un’immagine.')} size={80} />
        <div className="mt-6"><ModuleGrid modules={mods} /></div>
      </main>
    </div>
  );
}

function useSubjectFilter() {
  const enabled = useApp((s) => s.subjects);
  return (id: string) => {
    const on = (x: string) => enabled.find((s) => s.id === x)?.enabled ?? true;
    return on(id) || (subjectDef(id)?.includes ?? []).some(on);
  };
}

export function SchoolPage() {
  const [params, setParams] = useSearchParams();
  const { profile, progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const allowed = useSubjectFilter();
  const customSubjects = useApp((s) => s.subjects).filter((x) => !x.builtin && x.enabled);
  const country = profile?.country ?? 'DE';
  const fromProfile = profile && profile.year > 0 ? profile.year : 1;
  const year = Math.min(13, Math.max(1, Number(params.get('jahr')) || fromProfile));
  const stage = stageFor(country, year);
  const stages = stagesOf(country).filter((s) => s.years[0]! > 0);
  const tile = (id: SubjectId, big = false) => {
    const d = subjectDef(id);
    const count = schoolModules(country, year, id, custom).length;
    return (
      <Tile key={id} to={`/schule/${year}/${id}`} emoji={d?.emoji ?? '📘'} title={subjectName(id, country)}
        subtitle={count ? L(`${count} ${count === 1 ? 'Thema' : 'Themen'}`, `${count} ${count === 1 ? 'argomento' : 'argomenti'}`) : L('Bald verfügbar', 'Presto disponibile')}
        color={d?.color ?? 'himmel'} big={big} testId={`fach-${id}`} />
    );
  };
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={tr(stage.name)} back="/home" stars={progress.stars} />
      <main className="seite">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={L('Schulform', 'Tipo di scuola')}>
          {stages.map((s) => (
            <button key={s.id} role="tab" aria-selected={stage.id === s.id} onClick={() => setParams({ jahr: String(s.id === stage.id ? year : s.years[0]) })} data-testid={`stufe-${s.id}`}
              className={`chip shrink-0 whitespace-nowrap px-4 py-2 ${stage.id === s.id ? 'bg-tinte text-white' : 'bg-white text-tinte/70 ring-1 ring-tinte/10'}`}>
              <span className="emoji" aria-hidden>{s.emoji}</span> {tr(s.name)}
            </button>
          ))}
        </div>
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-weich ring-1 ring-tinte/5" role="tablist" aria-label={L('Klasse', 'Classe')}>
          {stage.years.map((y) => (
            <button key={y} role="tab" aria-selected={year === y} onClick={() => setParams({ jahr: String(y) })} data-testid={`klasse-${y}`}
              className={`min-w-[4.5rem] flex-1 whitespace-nowrap rounded-xl px-3 py-2.5 font-display text-base font-bold transition sm:text-lg ${year === y ? 'bg-himmel-500 text-white shadow-weich' : 'text-tinte/70 hover:bg-tinte/5'}`}>
              {yearLabel(country, y).replace(/ · .*/, '')}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stage.subjects.filter(allowed).map((id) => tile(id, true))}
        </div>
        {customSubjects.length > 0 && (
          <>
            <SectionTitle>{L('Weitere Fächer', 'Altre materie')}</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {customSubjects.map((c) => <Tile key={c.id} to={`/schule/${year}/${c.id}`} emoji={c.emoji} title={c.name} subtitle={L(`${schoolModules(country, year, c.id, custom).length} Themen`, `${schoolModules(country, year, c.id, custom).length} argomenti`)} color="lila" testId={`fach-${c.id}`} />)}
            </div>
          </>
        )}
        {stage.extras.some(allowed) && (
          <>
            <SectionTitle>{L('Zusatzfächer', 'Materie extra')}</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">{stage.extras.filter(allowed).map((id) => tile(id))}</div>
          </>
        )}
        <p className="mt-8 text-center text-sm text-tinte/55">
          {country === 'IT'
            ? L('Die Themen orientieren sich an den Indicazioni nazionali (Primaria, Secondaria di I grado) und den Lehrplänen der Oberschulen. Schulspezifische Schwerpunkte können abweichen.', 'Gli argomenti seguono le Indicazioni nazionali (primaria e secondaria di I grado) e i programmi delle superiori. Le scelte delle singole scuole possono variare.')
            : L('Die Themen orientieren sich an typischen Lehrplänen der Bundesländer (KMK-Bildungsstandards). Je nach Land und Schulform können Reihenfolge und Umfang abweichen.', 'Gli argomenti seguono i programmi tipici dei Länder tedeschi (standard KMK). Ordine e contenuti possono variare per Land e tipo di scuola.')}
        </p>
      </main>
    </div>
  );
}

export const LESSONS = () => [
  { n: 1, name: L('Grundlagen', 'Le basi') },
  { n: 2, name: L('Üben', 'Esercizio') },
  { n: 3, name: L('Meistern', 'Sfida') }
];
export const lessonLabel = (n: number) => `${L('Lektion', 'Lezione')} ${n} · ${LESSONS()[n - 1]?.name ?? ''}`;

/** Versatz der Knoten im Pfad (Schlangenlinie) */
const OFFSETS = [0, 52, 78, 52, 0, -52, -78, -52];

export function SubjectPage() {
  const { year, subject } = useParams();
  const { profile, progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const country = profile?.country ?? 'DE';
  const y = Number(year) || 1;
  const mods = useMemo(() => schoolModules(country, y, subject ?? '', custom), [country, y, subject, custom]);
  const total = mods.length * 3;
  const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
  // Aktueller Knoten: erste offene Lektion im ganzen Pfad
  const currentId = mods.find((m) => pathDoneOf(progress.modules[m.id]) < 3)?.id;
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);
  const def = subjectDef(subject ?? '');
  const c = COLOR_CLASSES[def?.color ?? 'himmel'] ?? COLOR_CLASSES.himmel!;
  let k = 0;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={`${subjectName(subject ?? '', country)} · ${yearLabel(country, y).replace(/ · .*/, '')}`} back={`/schule?jahr=${y}`} stars={progress.stars} />
      <main className="seite max-w-2xl">
        {mods.length === 0 ? (
          <LinoSays text={L('Hier gibt es noch keine Übungen. Schau bald wieder vorbei!', 'Qui non ci sono ancora esercizi. Torna presto!')} mood="denken" />
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4 rounded-blob bg-white p-4 shadow-weich ring-1 ring-tinte/5">
              <span className={`emoji flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl ${c.soft}`} aria-hidden>{def?.emoji ?? '📘'}</span>
              <div className="flex-1">
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <p className="font-display font-bold">{L('Dein Lernpfad', 'Il tuo percorso')}</p>
                  <p className="text-sm font-semibold text-tinte/60" data-testid="pfad-fortschritt">{done}/{total} {L('Lektionen', 'lezioni')}</p>
                </div>
                <ProgressBar value={total ? done / total : 0} color={c.bg} />
              </div>
            </div>
            <ol className="flex flex-col gap-4" aria-label={L('Lernpfad', 'Percorso')}>
              {mods.map((m, ui) => {
                const pd = pathDoneOf(progress.modules[m.id]);
                return (
                  <li key={m.id} className="flex flex-col items-center gap-4" data-testid={`einheit-${m.id}`}>
                    <UnitHeader m={m} index={ui} done={pd} />
                    <div className="flex flex-col items-center gap-4 py-2">
                      {LESSONS().map((les) => {
                        const off = OFFSETS[k++ % OFFSETS.length]!;
                        const state = pd >= les.n ? 'done' : pd + 1 === les.n ? 'open' : 'locked';
                        const isCurrent = m.id === currentId && state === 'open';
                        return (
                          <PathNode key={les.n} m={m} n={les.n} name={les.name} state={state} current={isCurrent} offset={off}
                            testId={state === 'open' || (pd >= 3 && les.n === 3) ? `modul-${m.id}` : undefined}
                            onLocked={() => setToast(L(`Schließe zuerst Lektion ${les.n - 1} ab.`, `Completa prima la lezione ${les.n - 1}.`))} />
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-10 flex flex-col items-center gap-2 text-center text-tinte/60">
              <Trophy size={36} className={done === total ? 'text-sonne-500' : 'text-tinte/20'} />
              <p className="font-display font-bold">{done === total ? L('Alles gemeistert! Super gemacht.', 'Tutto completato! Bravissimo.') : L('Ziel: alle Lektionen meistern', 'Obiettivo: completare tutte le lezioni')}</p>
            </div>
          </>
        )}
      </main>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} role="status"
            className="fixed inset-x-4 bottom-6 z-40 mx-auto max-w-sm rounded-2xl bg-tinte px-5 py-3 text-center font-semibold text-white shadow-karte" style={{ marginBottom: 'var(--safe-bottom)' }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function UnitHeader({ m, index, done }: { m: LearningModule; index: number; done: number }) {
  const c = COLOR_CLASSES[m.color] ?? COLOR_CLASSES.himmel!;
  // Gelb ist zu hell für weiße Schrift
  const light = m.color === 'sonne';
  return (
    <div className={`w-full rounded-blob p-4 shadow-karte sm:p-5 ${c.bg} ${light ? 'text-tinte [&_.u-sub]:text-tinte/75' : 'text-white [&_.u-sub]:text-white/85'}`}>
      <div className="flex items-start gap-3">
        <span className="emoji flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/25 text-2xl" aria-hidden>{m.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="u-sub text-xs font-bold uppercase tracking-wider">{L('Einheit', 'Unità')} {index + 1}{done >= 3 ? ` · ${L('gemeistert', 'completata')}` : ''}</p>
          <h2 className="font-display text-xl font-bold leading-tight sm:text-2xl">{tr(m.title)}</h2>
          <p className="u-sub text-sm sm:text-base">{tr(m.subtitle)}</p>
        </div>
        <Link to={`/thema/${m.id}`} className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-bold text-tinte shadow-weich transition hover:bg-white/90" data-testid={`theorie-${m.id}`}>
          <BookOpen size={18} /> <span className="hidden sm:inline">{L('Theorie', 'Teoria')}</span>
        </Link>
      </div>
    </div>
  );
}

function PathNode({ m, n, name, state, current, offset, testId, onLocked }: {
  m: LearningModule; n: number; name: string; state: 'done' | 'open' | 'locked'; current: boolean; offset: number; testId?: string; onLocked: () => void;
}) {
  const c = COLOR_CLASSES[m.color] ?? COLOR_CLASSES.himmel!;
  const label = `${lessonLabel(n)}${state === 'done' ? L(' (erledigt)', ' (completata)') : state === 'locked' ? L(' (gesperrt)', ' (bloccata)') : ''}`;
  const circle = `relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full transition active:translate-y-1 ${
    state === 'locked' ? 'bg-tinte/[0.08] text-tinte/30 shadow-[0_5px_0_rgba(31,35,64,0.10)]' : `${c.bg} text-white shadow-[0_5px_0_rgba(31,35,64,0.22)]`}`;
  const icon = state === 'done' ? (n === 3 ? <Crown size={30} /> : <Check size={32} strokeWidth={3} />) : state === 'locked' ? <Lock size={26} /> : <Star size={30} className="fill-white" />;
  const inner = (
    <span className="flex flex-col items-center gap-1.5">
      <span className={circle}>
        {current && <span className={`absolute -inset-2 animate-ping rounded-full opacity-20 ${c.bg}`} aria-hidden />}
        {current && <span className={`absolute -inset-1.5 rounded-full ring-4 ${c.ring} ring-offset-2 ring-offset-creme`} aria-hidden />}
        <span className="relative">{icon}</span>
      </span>
      <span className={`text-sm font-bold ${state === 'locked' ? 'text-tinte/35' : 'text-tinte/75'}`}>{name}</span>
    </span>
  );
  return (
    <div className="relative" style={{ transform: `translateX(${offset}px)` }}>
      {current && (
        <motion.span initial={{ y: 0 }} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
          className={`absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-1 text-sm font-extrabold uppercase tracking-wide shadow-weich ring-1 ring-tinte/10 ${c.text}`}>
          {L('Start', 'Inizia')}
        </motion.span>
      )}
      {current && <span className={`absolute top-0 ${offset > 0 ? '-left-24' : '-right-24'} hidden sm:block`} aria-hidden><Lino mood="winken" size={78} /></span>}
      {state === 'locked'
        ? <button type="button" onClick={onLocked} aria-label={label} data-testid={`lektion-${m.id}-${n}`}>{inner}</button>
        : <Link to={`/spiel/${m.id}?lektion=${n}`} aria-label={label} data-testid={testId ?? `lektion-${m.id}-${n}`} onClick={() => sfx.tap()}>{inner}</Link>}
    </div>
  );
}

/** Zurück-Ziel eines Moduls: das passende Fach der aktuellen Klasse. */
function backFor(mod: LearningModule, country: Country, profileYear: number): string {
  if (mod.area === 'kita') return '/kita';
  if (mod.area === 'welt3d') return '/welt3d';
  if (mod.area === 'video') return '/videos';
  const yrs = moduleYears(mod);
  const y = yrs && (profileYear < yrs[0] || profileYear > yrs[1]) ? yrs[0] : Math.max(1, profileYear);
  const st = stageFor(country, y);
  const subj = ([...st.subjects, ...st.extras] as string[]).find((s) => s === mod.subject || ((subjectDef(s)?.includes ?? []) as string[]).includes(mod.subject ?? ''));
  return subj ? `/schule/${y}/${subj}` : `/schule?jahr=${y}`;
}

export function PlayPage() {
  const { moduleId } = useParams();
  const custom = useApp((s) => s.customModules);
  const record = useApp((s) => s.recordRound);
  const { profile, progress, settings } = useActiveProfile();
  const nav = useNavigate();
  const [search] = useSearchParams();
  const mod = moduleId ? findModule(moduleId, custom) : undefined;
  // Lernpfad: Lektion n spielt Stufe n (nur freigeschaltete Lektionen). Einmal beim Start festlegen.
  const [step] = useState(() => {
    const asked = Number(search.get('lektion'));
    const done = mod ? pathDoneOf(progress.modules[mod.id]) : 0;
    return mod?.area === 'schule' && asked >= 1 ? Math.min(asked, done + 1, 3) : 0;
  });
  if (!mod) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6">
        <LinoSays text={L('Dieses Spiel gibt es nicht (mehr).', 'Questo gioco non esiste (più).')} mood="denken" />
        <button className="knopf bg-sonne-500" onClick={() => nav('/home')}>{L('Zur Übersicht', 'Alla pagina iniziale')}</button>
      </div>
    );
  }
  const backTo = backFor(mod, profile?.country ?? 'DE', profile?.year ?? 1);
  const level = (step || progress.modules[mod.id]?.level || 1) as 1 | 2 | 3;
  const kids = mod.area === 'kita' || (profile?.year ?? 0) === 0;
  return (
    <GameRunner key={`${mod.id}-${step}`} module={mod} level={level} speechOn={settings.speech} backTo={backTo}
      onFinish={(r) => record(step ? { ...r, pathStep: step } : r)}
      mode={kids ? 'auto' : 'check'} lessonLabel={step ? lessonLabel(step) : undefined} />
  );
}

export function World3DPage() {
  const { progress } = useActiveProfile();
  const webgl = hasWebGL();
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('3D-Lernwelt', 'Mondo 3D')} back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text={L('Hier kannst du Dinge drehen, sammeln und entdecken!', 'Qui puoi girare, raccogliere e scoprire tante cose!')} size={80} />
        <div className="my-4">
          {webgl
            ? <Notice tone="ok">{L('3D läuft auf diesem Gerät. Ziehe mit dem Finger, um die Welt zu drehen.', 'Il 3D funziona su questo dispositivo. Trascina con il dito per girare il mondo.')}</Notice>
            : <Notice tone="warn">{L('Dein Gerät unterstützt kein 3D (WebGL). Alle Aufgaben funktionieren trotzdem – in einer 2D-Ansicht.', 'Il tuo dispositivo non supporta il 3D (WebGL). Tutti gli esercizi funzionano lo stesso, in una vista 2D.')}</Notice>}
        </div>
        <ModuleGrid modules={world3dModules()} />
        <SectionTitle>{L('Passt dazu', 'Ti potrebbe piacere')}</SectionTitle>
        <Link to="/spiel/m3-geometrie" className="font-bold text-himmel-700 underline">{L('Geometrie-Quiz mit 3D-Körpern', 'Quiz di geometria con i solidi 3D')}</Link>
      </main>
    </div>
  );
}
