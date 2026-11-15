import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp, useActiveProfile } from '../../store/useApp';
import { LinoSays } from '../../components/Lino';
import { findModule, moduleYears } from '../../learning/registry';
import type { LearningModule } from '../../learning/types';
import { L } from '../../i18n';
import { stageFor, type Country } from '../../school/systems';
import { subjectDef } from '../../school/subjects';
import { pathDoneOf } from '../../learning/adaptive';
import { lessonLabel } from '../../learning/lessons';
import { PATH_STEPS, PROFI_STEP, challengePassed, profiChallenge, profiModule } from '../../learning/challenge';
import { GameRunner } from '../../games/GameRunner';
import { guideFor } from '../../learning/guides';
import { TheoryIntro } from './TheoryIntro';

/** Zurück-Ziel eines Moduls: das passende Fach der aktuellen Klasse. */
function backFor(mod: LearningModule, country: Country, profileYear: number): string {
  if (mod.area === 'kita') return '/kita';
  if (mod.area === 'welt3d') return '/welt3d';
  if (mod.area === 'video') return '/videos';
  if (mod.area === 'lingue') return `/lingue/${mod.id.split('-')[1]}`;
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
  // Lernpfad: Lektion n spielt Stufe n, Lektion 4 ist die Profi-Lektion (nur freigeschaltete Lektionen). Einmal beim Start festlegen.
  const [step] = useState(() => {
    const asked = Number(search.get('lektion'));
    const done = mod ? pathDoneOf(progress.modules[mod.id]) : 0;
    return (mod?.area === 'schule' || mod?.area === 'lingue') && asked >= 1 ? Math.min(asked, done + 1, PATH_STEPS) : 0;
  });
  // Theorie vor der Übung (Schulthemen und Sprachkurse); ?theorie=0, wenn sie gerade schon gelesen wurde
  const [intro, setIntro] = useState(() => !!mod && search.get('theorie') !== '0'
    && ((mod.area === 'schule' && !!guideFor(mod.id)) || mod.area === 'lingue'));
  // Profi-Lektion: höchste Stufe, mehr Aufgaben; zählt erst als geschafft, wenn das Ziel erreicht ist
  const profi = step === PROFI_STEP;
  const playMod = useMemo(() => (mod && profi ? profiModule(mod) : mod), // eslint-disable-line react-hooks/exhaustive-deps
    [mod?.id, profi]);
  const challenge = useMemo(() => (profi ? profiChallenge() : undefined), [profi]);
  if (!mod || !playMod) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6">
        <LinoSays text={L('Dieses Spiel gibt es nicht (mehr).', 'Questo gioco non esiste (più).')} mood="denken" />
        <button className="knopf bg-sonne-500" onClick={() => nav('/home')}>{L('Zur Übersicht', 'Alla pagina iniziale')}</button>
      </div>
    );
  }
  const backTo = backFor(mod, profile?.country ?? 'DE', profile?.year ?? 1);
  const level = (step ? Math.min(step, 3) : progress.modules[mod.id]?.level || 1) as 1 | 2 | 3;
  const kids = mod.area === 'kita' || (profile?.year ?? 0) === 0;
  if (intro) {
    return <TheoryIntro module={mod} firstTime={!progress.modules[mod.id]?.rounds} backTo={backTo} stars={progress.stars}
      lessonLabel={step ? lessonLabel(step) : undefined} onStart={() => { setIntro(false); window.scrollTo(0, 0); }} />;
  }
  return (
    <GameRunner key={`${mod.id}-${step}`} module={playMod} level={level} speechOn={settings.speech} backTo={backTo} challenge={challenge}
      onFinish={(r) => record(step && (!challenge || challengePassed(r, challenge.goal)) ? { ...r, pathStep: step } : r)}
      mode={kids ? 'auto' : 'check'} coachIntro={kids || (profile?.year ?? 0) <= 4} lessonLabel={step ? lessonLabel(step) : undefined} />
  );
}

