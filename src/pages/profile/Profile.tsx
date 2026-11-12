import { Link, useNavigate } from 'react-router-dom';
import { Award, ChevronRight, Clock, Compass, Flame, Lock, Palette, Star, Users, Zap, BookOpenCheck } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { Avatar, COLOR_CLASSES, IconBadge, ProgressBar, SubjectIcon, AnimatedGrid, CountUp, ThemePicker } from '../../components/ui';
import { levelFromXp, BADGES } from '../../learning/rewards';
import { pathDoneOf } from '../../learning/adaptive';
import { schoolModules } from '../../learning/registry';
import { stageFor } from '../../school/systems';
import { subjectDef, subjectName } from '../../school/subjects';
import { profileLabel } from '../../school/systems';
import { L } from '../../i18n';

/** Profil des Kindes: Statistik, Fortschritt pro Fach und Menü. */
export function ProfilePage() {
  const { profile, progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const setActive = useApp((s) => s.setActiveProfile);
  const nav = useNavigate();
  if (!profile) return null;
  const lvl = levelFromXp(progress.xp);
  const days = Object.values(progress.daily).filter((d) => d.rounds > 0).length;
  const minutes = Math.round(Object.values(progress.daily).reduce((a, d) => a + d.seconds, 0) / 60);
  const lessons = Object.values(progress.modules).reduce((a, m) => a + pathDoneOf(m), 0);
  const stage = stageFor(profile.country, profile.year);
  const subjects = profile.year === 0 ? [] : [...stage.subjects, ...stage.extras];
  const stats = [
    { icon: <Zap size={20} />, tone: 'bg-sonne-50 text-sonne-700', value: progress.xp, label: 'XP' },
    { icon: <Star size={20} />, tone: 'bg-sonne-50 text-sonne-700', value: progress.stars, label: L('Sterne', 'Stelle') },
    { icon: <BookOpenCheck size={20} />, tone: 'bg-minze-50 text-minze-700', value: lessons, label: L('Lektionen', 'Lezioni') },
    { icon: <Flame size={20} />, tone: 'bg-koralle-50 text-koralle-700', value: days, label: L('Lerntage', 'Giorni di studio') },
    { icon: <Clock size={20} />, tone: 'bg-himmel-50 text-himmel-700', value: minutes, label: L('Minuten', 'Minuti') },
    { icon: <Award size={20} />, tone: 'bg-lila-50 text-lila-700', value: `${Object.keys(progress.badges).length}/${BADGES.length}`, label: L('Abzeichen', 'Distintivi') }
  ];
  const menu = [
    { to: '/avatar', icon: Palette, color: 'koralle', label: L('Avatar gestalten', 'Personalizza l’avatar') },
    { to: '/sterne', icon: Star, color: 'sonne', label: L('Meine Sterne', 'Le mie stelle') },
    { to: '/erfolge', icon: Award, color: 'lila', label: L('Meine Abzeichen', 'I miei distintivi') },
    { to: '/entdecken', icon: Compass, color: 'himmel', label: L('Videos, 3D-Welt und Mini-Spiele', 'Video, mondo 3D e minigiochi') }
  ];
  return (
    <main className="seite flex max-w-3xl flex-col gap-6" style={{ paddingTop: 'calc(var(--safe-top) + 1.5rem)' }} data-testid="profil-seite">
      <section className="relative overflow-hidden rounded-blob bg-gradient-to-br from-himmel-600 to-himmel-500 p-6 text-white shadow-karte">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15" aria-hidden />
        <div className="relative flex items-center gap-5">
          <Link to="/avatar" aria-label={L('Avatar gestalten', 'Personalizza l’avatar')}><Avatar config={profile.avatar} size={96} /></Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-3xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-white/85">{profileLabel(profile)}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="chip bg-flaeche text-lila-700">Level {lvl.level}</span>
              <div className="flex-1"><ProgressBar value={lvl.progress} color="bg-sonne-300" track="bg-white/25" label={L('Fortschritt zum nächsten Level', 'Progresso verso il prossimo livello')} /></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="stat-titel">
        <h2 id="stat-titel" className="mb-3 font-display text-lg font-bold">{L('Statistik', 'Statistiche')}</h2>
        <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="karte-3d flex items-center gap-3 p-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</span>
              <span><span className="block font-display text-2xl font-bold leading-none">{typeof s.value === 'number' ? <CountUp value={s.value} /> : s.value}</span><span className="text-sm text-tinte/55">{s.label}</span></span>
            </div>
          ))}
        </AnimatedGrid>
      </section>

      {subjects.length > 0 && (
        <section aria-labelledby="faecher-titel">
          <h2 id="faecher-titel" className="mb-3 font-display text-lg font-bold">{L('Fortschritt in den Fächern', 'Progressi nelle materie')}</h2>
          <ul className="karte-3d flex flex-col gap-2 p-3">
            {subjects.map((id) => {
              const mods = schoolModules(profile.country, profile.year, id, custom);
              if (!mods.length) return null;
              const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
              const d = subjectDef(id);
              const c = COLOR_CLASSES[d?.color ?? 'himmel'] ?? COLOR_CLASSES.himmel!;
              return (
                <li key={id}>
                  <Link to={`/schule/${profile.year}/${id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-tinte/[0.03]">
                    <SubjectIcon id={id} color={d?.color} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex justify-between gap-2 text-sm font-bold"><span className="truncate">{subjectName(id, profile.country)}</span><span className="text-tinte/50">{done}/{mods.length * 3}</span></span>
                      <ProgressBar value={done / (mods.length * 3)} color={c.bg} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section aria-labelledby="menu-titel">
        <h2 id="menu-titel" className="mb-3 font-display text-lg font-bold">{L('Mehr für dich', 'Altro per te')}</h2>
        <ul className="karte-3d divide-y-2 divide-tinte/[0.05] overflow-hidden">
          {menu.map((m) => (
            <li key={m.to}>
              <Link to={m.to} className="flex items-center gap-4 px-5 py-4 font-semibold hover:bg-tinte/[0.03]">
                <IconBadge icon={m.icon} color={m.color} size="sm" /><span className="flex-1">{m.label}</span><ChevronRight size={20} className="text-tinte/30" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="aussehen-titel">
        <h2 id="aussehen-titel" className="mb-3 font-display text-lg font-bold">{L('Aussehen der App', 'Aspetto dell’app')}</h2>
        <div className="karte-3d p-3"><ThemePicker /></div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="knopf knopf-3d flex-1 bg-flaeche text-base" onClick={() => { setActive(null); nav('/'); }} data-testid="profil-wechseln"><Users size={18} /> {L('Profil wechseln', 'Cambia profilo')}</button>
        <Link className="knopf knopf-3d flex-1 bg-flaeche text-base" to="/eltern" data-testid="profil-eltern"><Lock size={18} /> {L('Elternbereich', 'Area genitori')}</Link>
      </div>
    </main>
  );
}
