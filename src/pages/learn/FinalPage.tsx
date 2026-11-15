import { useMemo, useState } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp, useActiveProfile } from '../../store/useApp';
import { schoolModules } from '../../learning/registry';
import { L } from '../../i18n';
import { subjectDef, subjectName } from '../../school/subjects';
import { pathDoneOf } from '../../learning/adaptive';
import { FINAL_TIERS, challengePassed, finalId, finalModule, finalUnlocked } from '../../learning/challenge';
import { GameRunner } from '../../games/GameRunner';

/** Endrunde eines Fachs: gemischte Aufgaben aus allen Einheiten, Stufe Bronze, Silber oder Gold. */
export function FinalPage() {
  const { year, subject = '' } = useParams();
  const [search] = useSearchParams();
  const custom = useApp((s) => s.customModules);
  const record = useApp((s) => s.recordRound);
  const { profile, progress, settings } = useActiveProfile();
  const country = profile?.country ?? 'DE';
  const y = Number(year) || 1;
  const backTo = `/schule/${y}/${subject}`;
  const mods = useMemo(() => schoolModules(country, y, subject, custom), [country, y, subject, custom]);
  // Stufe einmal beim Start festlegen: nur freigeschaltete Stufen
  const [tier] = useState(() => {
    const done = pathDoneOf(progress.modules[finalId(subject, y)]);
    const asked = Number(search.get('stufe')) || done + 1;
    return FINAL_TIERS[Math.min(asked, done + 1, FINAL_TIERS.length) - 1]!;
  });
  const [open] = useState(() => finalUnlocked(mods, progress.modules));
  const module = useMemo(() => finalModule(mods, subject, y, subjectName(subject, country), tier, subjectDef(subject)?.color),
    [mods, subject, y, country, tier]);
  const challenge = useMemo(() => ({ goal: tier.goal, name: `${L('Endrunde', 'Sfida finale')} ${tier.name()}` }), [tier]);
  if (!open) return <Navigate to={backTo} replace />;
  return (
    <GameRunner key={`${module.id}-${tier.n}`} module={module} level={tier.level} speechOn={settings.speech} backTo={backTo} challenge={challenge}
      onFinish={(r) => record(challengePassed(r, tier.goal) ? { ...r, pathStep: tier.n } : r)}
      mode="check" coachIntro={(profile?.year ?? 0) <= 4} lessonLabel={`${L('Endrunde', 'Sfida finale')} · ${tier.name()}`} />
  );
}
