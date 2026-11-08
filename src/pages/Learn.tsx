import { useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Notice, SectionTitle, Tile, TopBar } from '../components/ui';
import { LinoSays } from '../components/Lino';
import { findModule, kitaModules, moduleYears, schoolModules, world3dModules } from '../learning/registry';
import type { LearningModule } from '../learning/types';
import { L, getLang, tr } from '../i18n';
import { stageFor, stagesOf, yearLabel, type Country, type SubjectId } from '../school/systems';
import { subjectDef, subjectName } from '../school/subjects';
import type { ModuleProgress } from '../learning/adaptive';
import { needsPractice } from '../learning/adaptive';
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

export function SubjectPage() {
  const { year, subject } = useParams();
  const { profile, progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const country = profile?.country ?? 'DE';
  const y = Number(year) || 1;
  const mods = useMemo(() => schoolModules(country, y, subject ?? '', custom), [country, y, subject, custom]);
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={`${subjectName(subject ?? '', country)} · ${yearLabel(country, y).replace(/ · .*/, '')}`} back={`/schule?jahr=${y}`} stars={progress.stars} />
      <main className="seite">
        {mods.length === 0 ? (
          <LinoSays text={L('Hier gibt es noch keine Übungen. Schau bald wieder vorbei!', 'Qui non ci sono ancora esercizi. Torna presto!')} mood="denken" />
        ) : (
          <ModuleGrid modules={mods} />
        )}
      </main>
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
  const mod = moduleId ? findModule(moduleId, custom) : undefined;
  if (!mod) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6">
        <LinoSays text={L('Dieses Spiel gibt es nicht (mehr).', 'Questo gioco non esiste (più).')} mood="denken" />
        <button className="knopf bg-sonne-500" onClick={() => nav('/home')}>{L('Zur Übersicht', 'Alla pagina iniziale')}</button>
      </div>
    );
  }
  const backTo = backFor(mod, profile?.country ?? 'DE', profile?.year ?? 1);
  const level = progress.modules[mod.id]?.level ?? 1;
  return <GameRunner key={mod.id} module={mod} level={level} speechOn={settings.speech} onFinish={record} backTo={backTo} />;
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
