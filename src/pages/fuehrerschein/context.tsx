import { useEffect, useState } from 'react';
import { useActiveProfile } from '../../store/useApp';
import { drivingAvailable } from '../../fuehrerschein/access';
import { loadSetup, loadStats, saveSetup, saveStats, type DrivingStats, type DrivingSetup } from '../../fuehrerschein/bank';
import { pickText, type DrivingCountry, type I18n, type StudyLang } from '../../fuehrerschein/schema';

/** Zustand des Moduls: Prüfungsland, Lernsprache (unabhängig von der App-Sprache) und Lernstand je Land. */
export function useFahrschule() {
  const { profile, progress, settings } = useActiveProfile();
  const profileId = profile?.id ?? 'gast';
  const [setup, setSetupState] = useState<Partial<DrivingSetup>>(() => loadSetup(profileId));
  const country = setup.country;
  const lang: StudyLang = setup.lang ?? (profile?.lang === 'it' ? 'it' : 'de');
  const [stats, setStats] = useState<DrivingStats>(() => loadStats(profileId, country ?? 'DE'));
  useEffect(() => { setStats(loadStats(profileId, country ?? 'DE')); }, [profileId, country]);

  const setSetup = (patch: Partial<DrivingSetup>) => setSetupState((s) => { const n = { ...s, ...patch }; saveSetup(profileId, n); return n; });
  const update = (f: (s: DrivingStats) => DrivingStats) => {
    if (!country) return;
    setStats((s) => { const n = f(s); saveStats(profileId, country, n); return n; });
  };
  /** Text in der Lernsprache */
  const t = (de: string, it: string) => (lang === 'it' ? it : de);
  const txt = (v: I18n | undefined) => pickText(v, lang);
  const allowed = drivingAvailable(profile?.year ?? 0, settings.drivingTheory);
  return { profile, progress, profileId, country: country as DrivingCountry | undefined, lang, setup, setSetup, stats, update, t, txt, allowed };
}
export type FahrschuleCtx = ReturnType<typeof useFahrschule>;
