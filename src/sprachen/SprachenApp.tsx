import { useEffect, useState, type ReactNode } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowLeft, Languages as LanguagesIcon, Route as RouteIcon, ShoppingBag, Star, Target, Trophy } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { primeSpeech, setSpeechEnabled, setSpeechLang } from '../lib/speech';
import { setSoundsEnabled, sfx } from '../lib/sound';
import { dateKey } from '../lib/date';
import { L, setLang } from '../i18n';
import { setCountry } from '../school/systems';
import { Lino } from '../components/Lino';
import { TimeUpOverlay } from '../components/TimeUpOverlay';
import { UpdatePrompt } from '../components/UpdatePrompt';
import { PageTransition } from '../components/ui';
import { HeartsPill } from '../lingue/PlayExtras';
import { courseById } from '../lingue/course';
import { GuidePage } from '../pages/learn/GuidePage';
import { PlayPage } from '../pages/learn/PlayPage';
import { activeCourseId, CoursesPage, LearnPage, LeaderboardPage, QuestsPage, ShopPage } from './pages';
import { Sidebar, type NavItem } from './ui';
import { APP_NAME } from '../linguaflow/brand';
import { FlowChoose, FlowHome, FlowSettings, FlowShell, FlowStart, FlowWelcome } from '../linguaflow/pages';
import { LessonPage, ReviewPage } from '../linguaflow/Lesson';
import { GUEST, useFlowStore } from '../linguaflow/store';

const BASE = import.meta.env.BASE_URL;

/** Zurück zur Haupt-App Lernito */
export const lernitoHome = () => `${BASE}home`;

function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3" role="status">
      <Lino size={110} />
      <p className="font-display text-xl">{L('Einen Moment …', 'Un momento …')}</p>
    </div>
  );
}

/** Ohne Profil: erst in Lernito ein Profil wählen. */
function NoProfile() {
  return (
    <main className="mx-auto flex min-h-[100dvh] max-w-md flex-col items-center justify-center gap-5 p-6 text-center" data-testid="sprachen-ohne-profil">
      <Lino mood="winken" size={120} />
      <h1 className="font-display text-2xl font-bold">Lernito Sprachen</h1>
      <p className="text-tinte/70">{L('Wähle zuerst in Lernito dein Profil, dann kannst du hier Sprachen lernen.', 'Scegli prima il tuo profilo in Lernito, poi qui puoi imparare le lingue.')}</p>
      <a href={BASE} className="knopf bg-sonne-500 px-6">{L('Lernito öffnen', 'Apri Lernito')}</a>
    </main>
  );
}

/** Weiterleitung aus Seiten, die auf die Haupt-App verweisen (z. B. „/home“). */
function ToLernito() {
  useEffect(() => { window.location.assign(lernitoHome()); }, []);
  return <Loading />;
}

/** Startseite: zuletzt gewählter Kurs, sonst Kurswahl. */
function Start() {
  const id = activeCourseId();
  return <Navigate to={id && courseById(id) ? `/lingue/${id}` : '/lingue'} replace />;
}

const NAV = (): NavItem[] => [
  { to: '/lernen', icon: RouteIcon, label: L('Lernen', 'Impara'), testId: 'sp-lernen', match: (p: string) => /^\/lingue\/[a-z]+$/.test(p) || p === '/lernen' },
  { to: '/lingue', icon: LanguagesIcon, label: L('Kurse', 'Corsi'), testId: 'sp-kurse', match: (p: string) => p === '/lingue' },
  { to: '/rangliste', icon: Trophy, label: L('Rangliste', 'Classifica'), testId: 'sp-rangliste', match: (p: string) => p === '/rangliste' },
  { to: '/missionen', icon: Target, label: L('Missionen', 'Missioni'), testId: 'sp-missionen', match: (p: string) => p === '/missionen' },
  { to: '/laden', icon: ShoppingBag, label: L('Laden', 'Negozio'), testId: 'sp-laden', match: (p: string) => p === '/laden' }
];

/** Rahmen wie im Original: Seitenleiste (Desktop), Kopfzeile und Tab-Leiste (Smartphone). */
function Shell() {
  const { pathname } = useLocation();
  const { profile, progress } = useActiveProfile();
  const items = NAV();
  const cid = activeCourseId();
  const course = cid ? courseById(cid) : undefined;
  return (
    <div className="min-h-[100dvh]" data-testid="sprachen-app">
      <Sidebar items={items} footer={
        <><NavLink to="/corso" className="mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-minze-700 hover:bg-minze-50" data-testid="zu-linguaflow-desktop"><LanguagesIcon size={18} /> {APP_NAME}</NavLink>
        <a href={lernitoHome()} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-tinte/55 hover:bg-tinte/[0.04]" data-testid="zurueck-zu-lernito">
          <ArrowLeft size={18} /> {L('Zurück zu Lernito', 'Torna a Lernito')}
        </a></>} />
      <header className="fixed inset-x-0 top-0 z-30 flex h-[58px] items-center gap-2 border-b border-minze-700/20 bg-minze-600 px-3 text-white lg:hidden" style={{ paddingTop: 'var(--safe-top)', height: 'calc(58px + var(--safe-top))' }}>
        <a href={lernitoHome()} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/10" aria-label={L('Zurück zu Lernito', 'Torna a Lernito')} data-testid="zurueck-zu-lernito-mobil"><ArrowLeft size={22} /></a>
        <span className="font-display text-lg font-extrabold">{L('Sprachen', 'Lingue')}</span>
        <NavLink to="/corso" className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold" data-testid="zu-linguaflow">{APP_NAME}</NavLink>
        <span className="flex-1" />
        <NavLink to="/lingue" className="emoji flex h-10 items-center px-1 text-2xl" aria-label={L('Kurs wechseln', 'Cambia corso')}>{course?.flag ?? '🌍'}</NavLink>
        <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-sm font-bold"><Star size={16} className="fill-sonne-300 text-sonne-300" /> {progress.stars}</span>
        <HeartsPill pid={profile?.id} />
      </header>
      <main className="h-full pb-24 pt-[calc(58px+var(--safe-top))] lg:pb-0 lg:pl-[256px] lg:pt-0">
        <div className="mx-auto h-full max-w-[1056px] pt-6"><PageTransition id={pathname}><Outlet /></PageTransition></div>
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur lg:hidden" style={{ paddingBottom: 'var(--safe-bottom)' }} aria-label={L('Navigation', 'Navigazione')}>
        <div className="mx-auto grid max-w-xl grid-cols-5 px-1">
          {items.map((it) => {
            const on = it.match(pathname);
            return (
              <NavLink key={it.testId} to={it.to} onClick={() => sfx.tap()} data-testid={it.testId} aria-current={on ? 'page' : undefined}
                className={`relative flex min-w-0 flex-col items-center gap-1 pb-2 pt-2.5 text-[11px] font-bold uppercase transition ${on ? 'text-minze-700' : 'text-tinte/50'}`}>
                {on && <motion.span layoutId="sp-tab" className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-minze-500" aria-hidden />}
                <it.icon size={22} strokeWidth={on ? 2.5 : 2} />
                <span className="max-w-full truncate">{it.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function RequireProfile({ children }: { children: ReactNode }) {
  const active = useApp((s) => s.profiles.some((p) => p.id === s.activeProfileId));
  return active ? <>{children}</> : <NoProfile />;
}

export function SprachenApp() {
  const hydrated = useApp((s) => s.hydrated);
  const parent = useApp((s) => s.parent);
  const add = useApp((s) => s.addLearningSeconds);
  const { profile, progress, settings } = useActiveProfile();
  const uiLang = useApp((s) => s.uiLang);
  const location = useLocation();

  // Ohne Profil folgen Lernito-Hinweise (z. B. Update) der Sprache, die in LinguaFlow gewählt wurde
  const flowUi = useFlowStore((s) => s.byOwner[profile?.id ?? GUEST]?.ui);
  const lang = profile?.lang ?? (flowUi === 'it' || flowUi === 'de' ? flowUi : uiLang ?? 'de');
  setLang(lang);
  setSpeechLang(lang);
  setCountry(profile?.country ?? 'DE');

  useEffect(() => {
    if (!hydrated) return;
    const splash = document.getElementById('splash');
    if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 400); }
  }, [hydrated]);
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add('kinderbereich');
    el.classList.toggle('kontrast', parent.highContrast);
    el.classList.toggle('gross-text', parent.largeText);
    el.classList.toggle('wenig-bewegung', parent.reduceMotion);
  }, [parent.highContrast, parent.largeText, parent.reduceMotion]);
  useEffect(() => { setSpeechEnabled(settings.speech); setSoundsEnabled(settings.sounds); }, [settings.speech, settings.sounds]);
  useEffect(() => {
    const h = () => primeSpeech();
    window.addEventListener('pointerdown', h, { once: true });
    return () => window.removeEventListener('pointerdown', h);
  }, []);
  // Lernzeit zählt wie in Lernito (Zeitlimit der Eltern gilt auch hier)
  const activeId = profile?.id;
  useEffect(() => {
    if (!activeId) return;
    const id = setInterval(() => { if (document.visibilityState === 'visible') add(10); }, 10_000);
    return () => clearInterval(id);
  }, [activeId, add]);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const [timeUpDismissed, setTimeUpDismissed] = useState<string | null>(null);
  const todaySec = progress.daily[dateKey()]?.seconds ?? 0;
  const timeUp = !!profile && settings.timeLimitMin !== null && todaySec >= settings.timeLimitMin * 60 && timeUpDismissed !== `${profile.id}-${dateKey()}`;

  if (!hydrated) return <Loading />;
  return (
    <MotionConfig reducedMotion={parent.reduceMotion ? 'always' : 'user'}>
      <Routes>
        {/* LinguaFlow: Kurse aus Paketen, ohne Konto – auch ohne Lernito-Profil nutzbar */}
        <Route path="/benvenuto" element={<FlowWelcome />} />
        <Route path="/lezione/:courseId/:lessonId" element={<LessonPage />} />
        <Route element={<FlowShell />}>
          <Route path="/corso" element={<FlowHome />} />
          <Route path="/scegli" element={<FlowChoose />} />
          <Route path="/ripasso/:courseId" element={<ReviewPage />} />
          <Route path="/impostazioni" element={<FlowSettings />} />
        </Route>
        {/* Üben mit Puppy (Herzen, Missionen, Rangliste) – braucht ein Lernito-Profil */}
        <Route element={<RequireProfile><Shell /></RequireProfile>}>
          <Route path="/lingue" element={<CoursesPage />} />
          <Route path="/lingue/:course" element={<LearnPage />} />
          <Route path="/rangliste" element={<LeaderboardPage />} />
          <Route path="/missionen" element={<QuestsPage />} />
          <Route path="/laden" element={<ShopPage />} />
        </Route>
        <Route path="/lernen" element={<RequireProfile><Start /></RequireProfile>} />
        <Route path="/thema/:moduleId" element={<RequireProfile><GuidePage /></RequireProfile>} />
        <Route path="/spiel/:moduleId" element={<RequireProfile><PlayPage /></RequireProfile>} />
        <Route path="/home" element={<ToLernito />} />
        <Route path="*" element={<FlowStart />} />
      </Routes>
      {timeUp && profile && <TimeUpOverlay onUnlocked={() => setTimeUpDismissed(`${profile.id}-${dateKey()}`)} />}
      <UpdatePrompt />
    </MotionConfig>
  );
}

