import { lazy, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from '../store/useApp';
import { ChildShell } from '../components/ChildShell';
// Start und Einrichtung (Eltern)
import { StartPage, CreateProfilePage } from '../pages/onboarding/Start';
import { SetupPage } from '../pages/onboarding/Setup';
// Kinderbereich
import { ChildHome } from '../pages/home/ChildHome';
import { KitaPage } from '../pages/learn/KitaPage';
import { SchoolPage } from '../pages/learn/SchoolPage';
import { SubjectPage } from '../pages/learn/SubjectPathPage';
import { PlayPage } from '../pages/learn/PlayPage';
import { FinalPage } from '../pages/learn/FinalPage';
import { GuidePage } from '../pages/learn/GuidePage';
import { DiscoverPage } from '../pages/discover/DiscoverPage';
import { World3DPage } from '../pages/discover/World3DPage';
import { MiniGamesPage, MiniGamePlayPage } from '../pages/discover/MiniGames';
import { VideosPage, VideoPlayerPage } from '../pages/discover/Videos';
import { StarsPage, BadgesPage, AdventurePage, AvatarPage } from '../pages/rewards/Rewards';
import { ProfilePage } from '../pages/profile/Profile';
import { PrivacyPage } from '../pages/info/Privacy';
import { OpenLanguageApp } from '../pages/lingue/OpenLanguageApp';
import { BrainGamesPage, BrainGamePlayPage } from '../pages/denkspiele/BrainGames';
import { HomeworkPage } from '../pages/hausaufgaben/HomeworkPage';

// Erwachsenenbereiche werden erst bei Bedarf geladen
const ParentArea = lazy(() => import('../pages/parents/ParentArea'));
const AdminArea = lazy(() => import('../pages/admin/AdminArea'));
// Fahrschule / Scuola guida (ab 18): eigener Chunk
const fs = () => import('../pages/fuehrerschein/Fahrschule');
const FahrschuleHomePage = lazy(() => fs().then((m) => ({ default: m.FahrschuleHomePage })));
const FahrschuleTheoryPage = lazy(() => fs().then((m) => ({ default: m.FahrschuleTheoryPage })));
const FahrschuleLessonPage = lazy(() => fs().then((m) => ({ default: m.FahrschuleLessonPage })));
const FahrschuleSignsPage = lazy(() => fs().then((m) => ({ default: m.FahrschuleSignsPage })));
const FahrschuleQuizRoute = lazy(() => fs().then((m) => ({ default: m.FahrschuleQuizRoute })));
const FahrschuleExamPage = lazy(() => fs().then((m) => ({ default: m.FahrschuleExamPage })));
const FahrschuleCoveragePage = lazy(() => fs().then((m) => ({ default: m.FahrschuleCoveragePage })));
// Lernito Adult: eigener Chunk, ohne Profil
const adult = () => import('../pages/adult/Adult');
const AdultHomePage = lazy(() => adult().then((m) => ({ default: m.AdultHomePage })));
const AdultCategoryPage = lazy(() => adult().then((m) => ({ default: m.AdultCategoryPage })));
const AdultGuidePage = lazy(() => adult().then((m) => ({ default: m.AdultGuidePage })));

/** Pfade für Erwachsene: ohne Lernzeit-Zähler und in der Gerätesprache. */
export const ADULT_ROUTES = ['/eltern', '/admin', '/datenschutz', '/einrichtung', '/adult'];

export const isAdultRoute = (path: string) => ADULT_ROUTES.some((r) => path.startsWith(r));

function RequireProfile({ children }: { children: ReactNode }) {
  const active = useApp((s) => s.profiles.some((p) => p.id === s.activeProfileId));
  return active ? <>{children}</> : <Navigate to="/" replace />;
}

/**
 * Alle Routen der App.
 * - Mit Rahmen (Tab-Leiste/Seitenleiste): Übersichten des Kinderbereichs.
 * - Ohne Rahmen (voller Fokus): Lektionen, Theorie, Videos, Mini-Spiele.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/profil/neu" element={<CreateProfilePage />} />
      <Route path="/einrichtung" element={<SetupPage />} />

      <Route element={<RequireProfile><ChildShell /></RequireProfile>}>
        <Route path="/home" element={<ChildHome />} />
        <Route path="/kita" element={<KitaPage />} />
        <Route path="/schule" element={<SchoolPage />} />
        <Route path="/schule/:year/:subject" element={<SubjectPage />} />
        <Route path="/entdecken" element={<DiscoverPage />} />
        <Route path="/welt3d" element={<World3DPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/minispiele" element={<MiniGamesPage />} />
        <Route path="/denkspiele" element={<BrainGamesPage />} />
        <Route path="/sterne" element={<StarsPage />} />
        <Route path="/erfolge" element={<BadgesPage />} />
        <Route path="/abenteuer" element={<AdventurePage />} />
        <Route path="/avatar" element={<AvatarPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/lingue" element={<OpenLanguageApp />} />
        <Route path="/lingue/:course" element={<OpenLanguageApp />} />
      </Route>

      <Route path="/thema/:moduleId" element={<RequireProfile><GuidePage /></RequireProfile>} />
      <Route path="/spiel/:moduleId" element={<RequireProfile><PlayPage /></RequireProfile>} />
      <Route path="/finale/:year/:subject" element={<RequireProfile><FinalPage /></RequireProfile>} />
      <Route path="/videos/:lessonId" element={<RequireProfile><VideoPlayerPage /></RequireProfile>} />
      <Route path="/minispiele/:gameId" element={<RequireProfile><MiniGamePlayPage /></RequireProfile>} />
      <Route path="/denkspiele/:gameId" element={<RequireProfile><BrainGamePlayPage /></RequireProfile>} />
      <Route path="/hausaufgaben" element={<RequireProfile><HomeworkPage /></RequireProfile>} />
      <Route path="/fuehrerschein" element={<RequireProfile><FahrschuleHomePage /></RequireProfile>} />
      <Route path="/fuehrerschein/teoria" element={<RequireProfile><FahrschuleTheoryPage /></RequireProfile>} />
      <Route path="/fuehrerschein/lezione/:id" element={<RequireProfile><FahrschuleLessonPage /></RequireProfile>} />
      <Route path="/fuehrerschein/segnali" element={<RequireProfile><FahrschuleSignsPage /></RequireProfile>} />
      <Route path="/fuehrerschein/quiz/:mode" element={<RequireProfile><FahrschuleQuizRoute /></RequireProfile>} />
      <Route path="/fuehrerschein/esame" element={<RequireProfile><FahrschuleExamPage /></RequireProfile>} />
      <Route path="/fuehrerschein/copertura" element={<RequireProfile><FahrschuleCoveragePage /></RequireProfile>} />

      <Route path="/adult" element={<AdultHomePage />} />
      <Route path="/adult/guida/:id" element={<AdultGuidePage />} />
      <Route path="/adult/:cat" element={<AdultCategoryPage />} />

      <Route path="/eltern/*" element={<ParentArea />} />
      <Route path="/admin/*" element={<AdminArea />} />
      <Route path="/datenschutz" element={<PrivacyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
