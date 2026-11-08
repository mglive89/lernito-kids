import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp, useActiveProfile } from './store/useApp';
import { setSpeechEnabled } from './lib/speech';
import { setSoundsEnabled } from './lib/sound';
import { dateKey } from './lib/date';
import { StartPage, CreateProfilePage } from './pages/Start';
import { ChildHome } from './pages/ChildHome';
import { KitaPage, SchoolPage, SubjectPage, PlayPage, World3DPage } from './pages/Learn';
import { StarsPage, BadgesPage, AdventurePage, AvatarPage } from './pages/Rewards';
import { MiniGamesPage, MiniGamePlayPage } from './pages/MiniGames';
import { VideosPage, VideoPlayerPage } from './pages/Videos';
import { PrivacyPage } from './pages/Privacy';
import { TimeUpOverlay } from './components/TimeUpOverlay';
import { UpdatePrompt } from './components/UpdatePrompt';
import { Lino } from './components/Lino';

const ParentArea = lazy(() => import('./pages/parents/ParentArea'));
const AdminArea = lazy(() => import('./pages/admin/AdminArea'));

function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3" role="status">
      <Lino size={110} />
      <p className="font-display text-xl">Einen Moment …</p>
    </div>
  );
}

function RequireProfile({ children }: { children: ReactNode }) {
  const active = useApp((s) => s.profiles.some((p) => p.id === s.activeProfileId));
  return active ? <>{children}</> : <Navigate to="/" replace />;
}

const ADULT_ROUTES = ['/eltern', '/admin', '/datenschutz'];

/** Zählt aktive Lernzeit (nur sichtbarer Tab, nur Kinderbereich). */
function useLearningTimer(path: string) {
  const activeId = useApp((s) => s.activeProfileId);
  const add = useApp((s) => s.addLearningSeconds);
  useEffect(() => {
    if (!activeId || path === '/' || ADULT_ROUTES.some((r) => path.startsWith(r))) return;
    const id = setInterval(() => { if (document.visibilityState === 'visible') add(10); }, 10_000);
    return () => clearInterval(id);
  }, [activeId, add, path]);
}

export default function App() {
  const hydrated = useApp((s) => s.hydrated);
  const parent = useApp((s) => s.parent);
  const { profile, progress, settings } = useActiveProfile();
  const location = useLocation();
  useLearningTimer(location.pathname);

  useEffect(() => {
    if (!hydrated) return;
    const splash = document.getElementById('splash');
    if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 400); }
  }, [hydrated]);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle('kontrast', parent.highContrast);
    el.classList.toggle('gross-text', parent.largeText);
    el.classList.toggle('wenig-bewegung', parent.reduceMotion);
  }, [parent.highContrast, parent.largeText, parent.reduceMotion]);

  useEffect(() => {
    setSpeechEnabled(settings.speech);
    setSoundsEnabled(settings.sounds);
  }, [settings.speech, settings.sounds]);

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const [timeUpDismissed, setTimeUpDismissed] = useState<string | null>(null);
  const todaySec = progress.daily[dateKey()]?.seconds ?? 0;
  const isChildArea = !!profile && location.pathname !== '/' && !ADULT_ROUTES.some((r) => location.pathname.startsWith(r));
  const timeUp = isChildArea && settings.timeLimitMin !== null && todaySec >= settings.timeLimitMin * 60 && timeUpDismissed !== `${profile?.id}-${dateKey()}`;

  if (!hydrated) return <Loading />;

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/profil/neu" element={<CreateProfilePage />} />
          <Route path="/home" element={<RequireProfile><ChildHome /></RequireProfile>} />
          <Route path="/kita" element={<RequireProfile><KitaPage /></RequireProfile>} />
          <Route path="/schule" element={<RequireProfile><SchoolPage /></RequireProfile>} />
          <Route path="/schule/:grade/:subject" element={<RequireProfile><SubjectPage /></RequireProfile>} />
          <Route path="/spiel/:moduleId" element={<RequireProfile><PlayPage /></RequireProfile>} />
          <Route path="/welt3d" element={<RequireProfile><World3DPage /></RequireProfile>} />
          <Route path="/videos" element={<RequireProfile><VideosPage /></RequireProfile>} />
          <Route path="/videos/:lessonId" element={<RequireProfile><VideoPlayerPage /></RequireProfile>} />
          <Route path="/sterne" element={<RequireProfile><StarsPage /></RequireProfile>} />
          <Route path="/erfolge" element={<RequireProfile><BadgesPage /></RequireProfile>} />
          <Route path="/abenteuer" element={<RequireProfile><AdventurePage /></RequireProfile>} />
          <Route path="/avatar" element={<RequireProfile><AvatarPage /></RequireProfile>} />
          <Route path="/minispiele" element={<RequireProfile><MiniGamesPage /></RequireProfile>} />
          <Route path="/minispiele/:gameId" element={<RequireProfile><MiniGamePlayPage /></RequireProfile>} />
          <Route path="/eltern/*" element={<ParentArea />} />
          <Route path="/admin/*" element={<AdminArea />} />
          <Route path="/datenschutz" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {timeUp && profile && <TimeUpOverlay onUnlocked={() => setTimeUpDismissed(`${profile.id}-${dateKey()}`)} />}
      <UpdatePrompt />
    </>
  );
}
