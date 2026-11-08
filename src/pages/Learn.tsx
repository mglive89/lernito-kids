import { useMemo } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Notice, SectionTitle, Tile, TopBar } from '../components/ui';
import { LinoSays } from '../components/Lino';
import { findModule, kitaModules, schoolModules, world3dModules } from '../learning/registry';
import type { Grade, LearningModule } from '../learning/types';
import type { ModuleProgress } from '../learning/adaptive';
import { needsPractice } from '../learning/adaptive';
import { GameRunner } from '../games/GameRunner';
import { hasWebGL } from '../lib/webgl';

const STUFE = ['', 'Leicht', 'Mittel', 'Knifflig'];

function ModuleBadge({ p }: { p?: ModuleProgress }) {
  if (!p || p.rounds === 0) return <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold shadow">Neu</span>;
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-white/90 px-2 py-0.5 shadow" aria-label={`${p.bestStars} von 3 Sternen, Stufe ${STUFE[p.level]}`}>
      {[1, 2, 3].map((i) => <Star key={i} size={14} className={i <= p.bestStars ? 'fill-sonne-500 text-sonne-500' : 'text-tinte/20'} />)}
    </span>
  );
}

export function ModuleGrid({ modules }: { modules: LearningModule[] }) {
  const { progress } = useActiveProfile();
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {modules.map((m) => (
        <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={m.title} subtitle={m.subtitle} color={m.color} badge={<ModuleBadge p={progress.modules[m.id]} />} testId={`modul-${m.id}`}>
          {progress.modules[m.id]?.rounds ? <span className="relative mt-auto text-xs font-bold text-tinte/60">Stufe: {STUFE[progress.modules[m.id]!.level]}{needsPractice(progress.modules[m.id]) ? ' · Nochmal üben' : ''}</span> : null}
        </Tile>
      ))}
    </div>
  );
}

export function KitaPage() {
  const custom = useApp((s) => s.customModules);
  const { progress } = useActiveProfile();
  const mods = kitaModules(custom);
  return (
    <div className="min-h-[100dvh]">
      <TopBar title="Kindergarten" back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text="Such dir ein Spiel aus! Tippe auf ein Bild." size={80} />
        <div className="mt-6"><ModuleGrid modules={mods} /></div>
      </main>
    </div>
  );
}

export function SchoolPage() {
  const [params, setParams] = useSearchParams();
  const { profile, progress } = useActiveProfile();
  const subjects = useApp((s) => s.subjects).filter((x) => x.enabled);
  const custom = useApp((s) => s.customModules);
  const fromProfile = typeof profile?.ageGroup === 'number' ? profile.ageGroup : 1;
  const grade = (Number(params.get('klasse')) || fromProfile) as Grade;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title="Grundschule" back="/home" stars={progress.stars} />
      <main className="seite">
        <div className="mb-6 grid grid-cols-4 gap-2 rounded-3xl bg-white p-2" role="tablist" aria-label="Klassenstufe">
          {([1, 2, 3, 4] as Grade[]).map((g) => (
            <button key={g} role="tab" aria-selected={grade === g} onClick={() => setParams({ klasse: String(g) })} data-testid={`klasse-${g}`} className={`rounded-2xl py-3 font-display text-lg font-bold sm:text-2xl ${grade === g ? 'bg-himmel-500 text-white shadow-knopf' : ''}`}>
              {g}. Klasse
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {subjects.map((s, i) => {
            const count = schoolModules(grade, s.id, custom).length;
            return (
              <Tile key={s.id} to={`/schule/${grade}/${s.id}`} emoji={s.emoji} title={s.name} subtitle={`${count} ${count === 1 ? 'Übung' : 'Übungen'}${s.id === 'englisch' ? ' · Einsteigerfach' : ''}`} color={(['koralle', 'himmel', 'minze', 'lila', 'sonne'] as const)[i % 5] ?? 'sonne'} big testId={`fach-${s.id}`} />
            );
          })}
        </div>
        <p className="mt-6 text-center text-sm text-tinte/60">Die Inhalte orientieren sich an typischen Grundschulthemen. Eine Anpassung an die Lehrpläne einzelner Bundesländer ist vorbereitet.</p>
      </main>
    </div>
  );
}

export function SubjectPage() {
  const { grade, subject } = useParams();
  const { progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const subj = useApp((s) => s.subjects.find((x) => x.id === subject));
  const g = Number(grade) as Grade;
  const mods = useMemo(() => schoolModules(g, subject ?? '', custom), [g, subject, custom]);
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={`${subj?.name ?? 'Fach'} · Klasse ${g}`} back={`/schule?klasse=${g}`} stars={progress.stars} />
      <main className="seite">
        {mods.length === 0 ? (
          <LinoSays text="Hier gibt es noch keine Übungen. Schau bald wieder vorbei!" mood="denken" />
        ) : (
          <ModuleGrid modules={mods} />
        )}
      </main>
    </div>
  );
}

export function PlayPage() {
  const { moduleId } = useParams();
  const custom = useApp((s) => s.customModules);
  const record = useApp((s) => s.recordRound);
  const { progress, settings } = useActiveProfile();
  const nav = useNavigate();
  const mod = moduleId ? findModule(moduleId, custom) : undefined;
  if (!mod) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6">
        <LinoSays text="Dieses Spiel gibt es nicht (mehr)." mood="denken" />
        <button className="knopf bg-sonne-500" onClick={() => nav('/home')}>Zur Übersicht</button>
      </div>
    );
  }
  const backTo = mod.area === 'kita' ? '/kita' : mod.area === 'welt3d' ? '/welt3d' : mod.area === 'video' ? '/videos' : mod.grade ? `/schule/${mod.grade}/${mod.subject}` : '/schule';
  const level = progress.modules[mod.id]?.level ?? 1;
  return <GameRunner key={mod.id} module={mod} level={level} speechOn={settings.speech} onFinish={record} backTo={backTo} />;
}

export function World3DPage() {
  const { progress } = useActiveProfile();
  const webgl = hasWebGL();
  return (
    <div className="min-h-[100dvh]">
      <TopBar title="3D-Lernwelt" back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text="Hier kannst du Dinge drehen, sammeln und entdecken!" size={80} />
        <div className="my-4">
          {webgl
            ? <Notice tone="ok">3D läuft auf diesem Gerät. Ziehe mit dem Finger, um die Welt zu drehen.</Notice>
            : <Notice tone="warn">Dein Gerät unterstützt kein 3D (WebGL). Alle Aufgaben funktionieren trotzdem – in einer 2D-Ansicht.</Notice>}
        </div>
        <ModuleGrid modules={world3dModules()} />
        <SectionTitle>Passt dazu</SectionTitle>
        <Link to="/spiel/m3-geometrie" className="underline">Geometrie-Quiz (Klasse 3) mit 3D-Körpern</Link>
      </main>
    </div>
  );
}
