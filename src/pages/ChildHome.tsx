import { Link, useNavigate } from 'react-router-dom';
import { Lock, Users } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Avatar, ProgressBar, SectionTitle, StarCount, Tile } from '../components/ui';
import { LinoSays } from '../components/Lino';
import { levelFromXp } from '../learning/rewards';
import { allModules, findModule, fitsCountry, schoolModules } from '../learning/registry';
import { needsPractice } from '../learning/adaptive';
import { dateKey } from '../lib/date';
import { L, tr } from '../i18n';
import { stageFor } from '../school/systems';
import { subjectDef, subjectName } from '../school/subjects';
import { profileLabel } from './Start';

export function ChildHome() {
  const { profile, progress, settings } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const enabled = useApp((s) => s.subjects);
  const setActive = useApp((s) => s.setActiveProfile);
  const nav = useNavigate();
  if (!profile) return null;
  const { country, year } = profile;
  const lvl = levelFromXp(progress.xp);
  const today = progress.daily[dateKey()] ?? { rounds: 0, seconds: 0, stars: 0 };
  const goal = Math.max(1, settings.dailyGoalRounds);
  const last = progress.lastModuleId ? findModule(progress.lastModuleId, custom) : undefined;
  const isKita = year === 0;
  const stage = stageFor(country, year);
  const isOn = (id: string) => enabled.find((s) => s.id === id)?.enabled ?? true;
  const subjects = stage.subjects.filter((id) => isOn(id) || (subjectDef(id)?.includes ?? []).some(isOn));
  const assigned = settings.assigned.map((id) => findModule(id, custom)).filter((m): m is NonNullable<typeof m> => !!m);
  const practice = allModules(custom).filter((m) => fitsCountry(m, country) && needsPractice(progress.modules[m.id])).slice(0, 4);
  const first = isKita ? 'kita-zaehlen' : schoolModules(country, year, 'mathe', custom)[0]?.id ?? 'kita-zaehlen';
  const hour = new Date().getHours();
  const hello = hour < 11 ? L('Guten Morgen', 'Buongiorno') : hour < 18 ? L('Hallo', 'Ciao') : L('Guten Abend', 'Buonasera');

  return (
    <div className="hintergrund-punkte min-h-[100dvh]" style={{ paddingTop: 'var(--safe-top)' }}>
      <header className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/avatar" aria-label={L('Avatar gestalten', 'Personalizza l’avatar')}><Avatar config={profile.avatar} size={56} /></Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl">{hello}, {profile.name}!</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm">
            <span className="chip bg-lila-100 py-0.5 text-lila-700" data-testid="level">Level {lvl.level}</span>
            <span className="text-tinte/60">{profileLabel(profile)}</span>
          </div>
        </div>
        <StarCount n={progress.stars} />
      </header>

      <main className="seite">
        <LinoSays text={today.rounds >= goal ? L('Dein Tagesziel hast du geschafft! Du darfst gern weiterspielen.', 'Hai raggiunto l’obiettivo di oggi! Puoi continuare, se ti va.') : L('Was möchtest du heute lernen?', 'Che cosa vuoi imparare oggi?')} mood={today.rounds >= goal ? 'jubel' : 'freude'} size={80} />

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          {last ? (
            <Tile to={`/spiel/${last.id}`} emoji={last.emoji} title={L('Weiterlernen', 'Continua')} subtitle={tr(last.title)} color="minze" testId="weiterlernen" />
          ) : (
            <Tile to={`/spiel/${first}`} emoji="▶️" title={L('Weiterlernen', 'Continua')} subtitle={L('Starte mit deiner ersten Übung', 'Inizia con il primo esercizio')} color="minze" testId="weiterlernen" />
          )}
          <div className="karte flex flex-col justify-center gap-2 p-5" aria-label={L('Tagesziel', 'Obiettivo del giorno')}>
            <span className="eyebrow">{L('Mein Tagesziel', 'Obiettivo di oggi')}</span>
            <span className="font-display text-2xl font-bold">{Math.min(today.rounds, goal)} / {goal}</span>
            <ProgressBar value={today.rounds / goal} label={L('Tagesziel', 'Obiettivo del giorno')} />
            <span className="text-sm text-tinte/60">{L('Runden – ganz freiwillig', 'turni – senza obbligo')}</span>
          </div>
          <div className="karte flex flex-col justify-center gap-2 p-5" aria-label={L('Level-Fortschritt', 'Progresso di livello')}>
            <span className="eyebrow">Level</span>
            <span className="font-display text-2xl font-bold">{lvl.level}</span>
            <ProgressBar value={lvl.progress} color="bg-lila-500" label={L('Fortschritt zum nächsten Level', 'Progresso verso il prossimo livello')} />
            <span className="text-sm text-tinte/60">{lvl.next ? L(`Noch ${lvl.next - progress.xp} Punkte bis Level ${lvl.level + 1}`, `Ancora ${lvl.next - progress.xp} punti per il livello ${lvl.level + 1}`) : L('Höchstes Level erreicht!', 'Livello massimo raggiunto!')}</span>
          </div>
        </div>

        <SectionTitle>{isKita ? L('Spielen und lernen', 'Gioca e impara') : tr(stage.name)}</SectionTitle>
        {isKita ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Tile to="/kita" emoji="🧸" title={tr(stage.name)} subtitle={L('Zählen, Farben, Tiere, Puzzle …', 'Contare, colori, animali, puzzle …')} color="sonne" big testId="bereich-kita" />
            <Tile to="/schule?jahr=1" emoji="🎒" title={L('Schon mal in die Schule schauen', 'Dai un’occhiata alla scuola')} subtitle={L('Aufgaben der 1. Klasse', 'Esercizi della prima classe')} color="himmel" big testId="bereich-schule" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {subjects.map((id) => {
                const d = subjectDef(id);
                const n = schoolModules(country, year, id, custom).length;
                return <Tile key={id} to={`/schule/${year}/${id}`} emoji={d?.emoji ?? '📘'} title={subjectName(id, country)} subtitle={L(`${n} ${n === 1 ? 'Thema' : 'Themen'}`, `${n} ${n === 1 ? 'argomento' : 'argomenti'}`)} color={d?.color ?? 'himmel'} testId={`home-fach-${id}`} />;
              })}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Tile to={`/schule?jahr=${year}`} emoji={stage.emoji} title={L('Alle Fächer und Klassen', 'Tutte le materie e le classi')} subtitle={L('Auch Religion, Informatik und Programmieren', 'Anche religione, informatica e programmazione')} color="himmel" testId="bereich-schule" />
              <Tile to="/kita" emoji="🧸" title={L('Kindergarten-Spiele', 'Giochi dell’infanzia')} subtitle={L('Für kleine Geschwister', 'Per i fratellini più piccoli')} color="sonne" testId="bereich-kita" />
            </div>
          </>
        )}

        {assigned.length > 0 && (
          <>
            <SectionTitle>📬 {L('Aufgaben für dich', 'Compiti per te')}</SectionTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {assigned.map((m) => (
                <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={tr(m.title)} color={m.color} badge={progress.modules[m.id]?.rounds ? <span className="emoji text-2xl">✅</span> : undefined} />
              ))}
            </div>
          </>
        )}

        {practice.length > 0 && (
          <>
            <SectionTitle>🔁 {L('Nochmal üben', 'Ripassiamo')}</SectionTitle>
            <p className="-mt-2 mb-3 text-tinte/60">{L('Diese Themen üben wir gemeinsam in kleinen Schritten.', 'Ripassiamo insieme questi argomenti, a piccoli passi.')}</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {practice.map((m) => <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={tr(m.title)} color={m.color} />)}
            </div>
          </>
        )}

        <SectionTitle>{L('Entdecken', 'Scopri')}</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Tile to="/abenteuer" emoji="🗺️" title={L('Mein Lernabenteuer', 'La mia avventura')} color="minze" testId="abenteuer" />
          <Tile to="/sterne" emoji="⭐" title={L('Meine Sterne', 'Le mie stelle')} color="sonne" testId="sterne" />
          <Tile to="/erfolge" emoji="🏅" title={L('Meine Erfolge', 'I miei traguardi')} color="koralle" testId="erfolge" />
          <Tile to="/welt3d" emoji="🧊" title={L('3D-Lernwelt', 'Mondo 3D')} color="lila" testId="welt3d" />
          <Tile to="/videos" emoji="🎬" title={L('Lernvideos', 'Video lezioni')} color="himmel" testId="videos" />
          <Tile to="/minispiele" emoji="🫧" title={L('Mini-Spiele', 'Minigiochi')} color="minze" testId="minispiele" />
          <Tile to="/avatar" emoji="🎨" title={L('Mein Avatar', 'Il mio avatar')} color="lila" testId="avatar" />
        </div>

        <nav className="mt-10 flex flex-wrap justify-center gap-3" aria-label={L('Weitere', 'Altro')}>
          <button className="knopf bg-white text-base" onClick={() => { setActive(null); nav('/'); }} data-testid="profil-wechseln"><Users size={18} /> {L('Profil wechseln', 'Cambia profilo')}</button>
          <Link className="knopf bg-white text-base" to="/eltern"><Lock size={18} /> {L('Elternbereich', 'Area genitori')}</Link>
        </nav>
      </main>
    </div>
  );
}
