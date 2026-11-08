import { Link, useNavigate } from 'react-router-dom';
import { Lock, Users } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Avatar, ProgressBar, SectionTitle, StarCount, Tile } from '../components/ui';
import { LinoSays } from '../components/Lino';
import { levelFromXp } from '../learning/rewards';
import { allModules, findModule } from '../learning/registry';
import { needsPractice } from '../learning/adaptive';
import { dateKey } from '../lib/date';
import { AGE_LABEL } from './Start';

export function ChildHome() {
  const { profile, progress, settings } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const setActive = useApp((s) => s.setActiveProfile);
  const nav = useNavigate();
  if (!profile) return null;
  const lvl = levelFromXp(progress.xp);
  const today = progress.daily[dateKey()] ?? { rounds: 0, seconds: 0, stars: 0 };
  const goal = Math.max(1, settings.dailyGoalRounds);
  const last = progress.lastModuleId ? findModule(progress.lastModuleId, custom) : undefined;
  const isKita = profile.ageGroup === 'kita';
  const assigned = settings.assigned.map((id) => findModule(id, custom)).filter((m): m is NonNullable<typeof m> => !!m);
  const practice = allModules(custom).filter((m) => needsPractice(progress.modules[m.id])).slice(0, 4);
  const hour = new Date().getHours();
  const hello = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';

  return (
    <div className="hintergrund-punkte min-h-[100dvh]" style={{ paddingTop: 'var(--safe-top)' }}>
      <header className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/avatar" aria-label="Avatar gestalten"><Avatar config={profile.avatar} size={64} /></Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-2xl font-bold">{hello}, {profile.name}!</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-lila-100 px-2 py-0.5 font-bold" data-testid="level">Level {lvl.level}</span>
            <span className="text-tinte/60">{AGE_LABEL[String(profile.ageGroup)]}</span>
          </div>
        </div>
        <StarCount n={progress.stars} />
      </header>

      <main className="seite">
        <LinoSays text={today.rounds >= goal ? 'Dein Tagesziel hast du geschafft! Du darfst gern weiterspielen.' : 'Was möchtest du heute lernen?'} mood={today.rounds >= goal ? 'jubel' : 'freude'} size={80} />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Tile to="/kita" emoji="🧸" title="Kindergarten" subtitle="Zählen, Farben, Tiere, Puzzle …" color="sonne" big testId="bereich-kita" badge={isKita ? <span className="rounded-full bg-sonne-500 px-3 py-1 text-sm font-bold">Für dich</span> : undefined} />
          <Tile to={`/schule${isKita ? '' : `?klasse=${profile.ageGroup}`}`} emoji="🎒" title="Grundschule" subtitle="Deutsch, Mathe, Sachunterricht, Englisch" color="himmel" big testId="bereich-schule" badge={!isKita ? <span className="rounded-full bg-himmel-500 px-3 py-1 text-sm font-bold text-white">Für dich</span> : undefined} />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {last ? (
            <Tile to={`/spiel/${last.id}`} emoji={last.emoji} title="Weiterlernen" subtitle={last.title} color="minze" testId="weiterlernen" />
          ) : (
            <Tile to={isKita ? '/spiel/kita-zaehlen' : `/spiel/${profile.ageGroup === 1 ? 'm1-plus' : profile.ageGroup === 2 ? 'm2-einmaleins' : profile.ageGroup === 3 ? 'm3-malgeteilt' : 'm4-brueche'}`} emoji="▶️" title="Weiterlernen" subtitle="Starte mit deiner ersten Übung" color="minze" testId="weiterlernen" />
          )}
          <div className="karte flex flex-col justify-center gap-2 p-5" aria-label="Tagesziel">
            <span className="font-display text-xl font-bold">🎯 Mein Tagesziel</span>
            <ProgressBar value={today.rounds / goal} label="Tagesziel" />
            <span className="text-base text-tinte/70">{Math.min(today.rounds, goal)} von {goal} Runden – ganz freiwillig</span>
          </div>
          <div className="karte flex flex-col justify-center gap-2 p-5" aria-label="Level-Fortschritt">
            <span className="font-display text-xl font-bold">⬆️ Level {lvl.level}</span>
            <ProgressBar value={lvl.progress} color="bg-lila-500" label="Fortschritt zum nächsten Level" />
            <span className="text-base text-tinte/70">{lvl.next ? `Noch ${lvl.next - progress.xp} Punkte bis Level ${lvl.level + 1}` : 'Höchstes Level erreicht!'}</span>
          </div>
        </div>

        {assigned.length > 0 && (
          <>
            <SectionTitle>📬 Aufgaben für dich</SectionTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {assigned.map((m) => (
                <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={m.title} color={m.color} badge={progress.modules[m.id]?.rounds ? <span className="emoji text-2xl">✅</span> : undefined} />
              ))}
            </div>
          </>
        )}

        {practice.length > 0 && (
          <>
            <SectionTitle>🔁 Nochmal üben</SectionTitle>
            <p className="-mt-2 mb-3 text-tinte/70">Diese Themen üben wir gemeinsam in kleinen Schritten.</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {practice.map((m) => <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={m.title} color={m.color} />)}
            </div>
          </>
        )}

        <SectionTitle>Entdecken</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Tile to="/abenteuer" emoji="🗺️" title="Mein Lernabenteuer" color="minze" testId="abenteuer" />
          <Tile to="/sterne" emoji="⭐" title="Meine Sterne" color="sonne" testId="sterne" />
          <Tile to="/erfolge" emoji="🏅" title="Meine Erfolge" color="koralle" testId="erfolge" />
          <Tile to="/welt3d" emoji="🧊" title="3D-Lernwelt" color="lila" testId="welt3d" />
          <Tile to="/videos" emoji="🎬" title="Lernvideos" color="himmel" testId="videos" />
          <Tile to="/minispiele" emoji="🫧" title="Mini-Spiele" color="minze" testId="minispiele" />
          <Tile to="/avatar" emoji="🎨" title="Mein Avatar" color="lila" testId="avatar" />
        </div>

        <nav className="mt-10 flex flex-wrap justify-center gap-3" aria-label="Weitere">
          <button className="knopf bg-white text-base" onClick={() => { setActive(null); nav('/'); }} data-testid="profil-wechseln"><Users size={20} /> Profil wechseln</button>
          <Link className="knopf bg-white text-base" to="/eltern"><Lock size={20} /> Elternbereich</Link>
        </nav>
      </main>
    </div>
  );
}
