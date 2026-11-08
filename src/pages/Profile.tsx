import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Flame, Lock, Star, Users, Zap, BookOpenCheck } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Avatar, COLOR_CLASSES, ProgressBar } from '../components/ui';
import { levelFromXp, BADGES } from '../learning/rewards';
import { pathDoneOf } from '../learning/adaptive';
import { schoolModules } from '../learning/registry';
import { stageFor } from '../school/systems';
import { subjectDef, subjectName } from '../school/subjects';
import { profileLabel } from './Start';
import { L } from '../i18n';

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
    { icon: <span className="emoji text-lg">🏅</span>, tone: 'bg-lila-50', value: `${Object.keys(progress.badges).length}/${BADGES.length}`, label: L('Abzeichen', 'Distintivi') }
  ];
  const menu = [
    { to: '/avatar', emoji: '🎨', label: L('Avatar gestalten', 'Personalizza l’avatar') },
    { to: '/sterne', emoji: '⭐', label: L('Meine Sterne', 'Le mie stelle') },
    { to: '/abenteuer', emoji: '🗺️', label: L('Mein Lernabenteuer', 'La mia avventura') },
    { to: '/videos', emoji: '🎬', label: L('Lernvideos', 'Video lezioni') },
    { to: '/welt3d', emoji: '🧊', label: L('3D-Lernwelt', 'Mondo 3D') },
    { to: '/minispiele', emoji: '🫧', label: L('Mini-Spiele', 'Minigiochi') }
  ];
  return (
    <main className="seite flex max-w-3xl flex-col gap-6" style={{ paddingTop: 'calc(var(--safe-top) + 1.5rem)' }} data-testid="profil-seite">
      <section className="karte relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-himmel-50" aria-hidden />
        <div className="relative flex items-center gap-5">
          <Link to="/avatar" aria-label={L('Avatar gestalten', 'Personalizza l’avatar')}><Avatar config={profile.avatar} size={96} /></Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-3xl font-bold tracking-tight">{profile.name}</h1>
            <p className="text-tinte/60">{profileLabel(profile)}</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="chip bg-lila-100 text-lila-700">Level {lvl.level}</span>
              <div className="flex-1"><ProgressBar value={lvl.progress} color="bg-lila-500" label={L('Fortschritt zum nächsten Level', 'Progresso verso il prossimo livello')} /></div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="stat-titel">
        <h2 id="stat-titel" className="mb-3 font-display text-xl font-bold">{L('Statistik', 'Statistiche')}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-weich ring-1 ring-tinte/5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>{s.icon}</span>
              <span><span className="block font-display text-2xl font-bold leading-none">{s.value}</span><span className="text-sm text-tinte/55">{s.label}</span></span>
            </div>
          ))}
        </div>
      </section>

      {subjects.length > 0 && (
        <section aria-labelledby="faecher-titel">
          <h2 id="faecher-titel" className="mb-3 font-display text-xl font-bold">{L('Fortschritt in den Fächern', 'Progressi nelle materie')}</h2>
          <ul className="flex flex-col gap-2 rounded-blob bg-white p-3 shadow-weich ring-1 ring-tinte/5">
            {subjects.map((id) => {
              const mods = schoolModules(profile.country, profile.year, id, custom);
              if (!mods.length) return null;
              const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
              const d = subjectDef(id);
              const c = COLOR_CLASSES[d?.color ?? 'himmel'] ?? COLOR_CLASSES.himmel!;
              return (
                <li key={id}>
                  <Link to={`/schule/${profile.year}/${id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-tinte/[0.03]">
                    <span className={`emoji flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${c.soft}`} aria-hidden>{d?.emoji ?? '📘'}</span>
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
        <h2 id="menu-titel" className="mb-3 font-display text-xl font-bold">{L('Mehr entdecken', 'Scopri di più')}</h2>
        <ul className="divide-y divide-tinte/[0.06] overflow-hidden rounded-blob bg-white shadow-weich ring-1 ring-tinte/5">
          {menu.map((m) => (
            <li key={m.to}>
              <Link to={m.to} className="flex items-center gap-4 px-5 py-4 font-semibold hover:bg-tinte/[0.03]">
                <span className="emoji text-2xl" aria-hidden>{m.emoji}</span><span className="flex-1">{m.label}</span><ChevronRight size={20} className="text-tinte/30" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="knopf flex-1 bg-white text-base" onClick={() => { setActive(null); nav('/'); }} data-testid="profil-wechseln"><Users size={18} /> {L('Profil wechseln', 'Cambia profilo')}</button>
        <Link className="knopf flex-1 bg-white text-base" to="/eltern" data-testid="profil-eltern"><Lock size={18} /> {L('Elternbereich', 'Area genitori')}</Link>
      </div>
    </main>
  );
}
