import { Link, useNavigate } from 'react-router-dom';
import { Lock, Play, Users } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Avatar, COLOR_CLASSES, ProgressBar, SectionTitle, StarCount, Tile } from '../components/ui';
import { sfx } from '../lib/sound';
import { lessonLabel } from './Learn';
import type { LearningModule } from '../learning/types';
import { LinoSays } from '../components/Lino';
import { levelFromXp } from '../learning/rewards';
import { allModules, findModule, fitsCountry, schoolModules } from '../learning/registry';
import { needsPractice, pathDoneOf } from '../learning/adaptive';
import { dateKey } from '../lib/date';
import { L, tr } from '../i18n';
import { stageFor } from '../school/systems';
import { subjectDef, subjectName } from '../school/subjects';
import { profileLabel } from './Start';

/** Link zur nächsten Lektion eines Themas (Lernpfad) bzw. zum Spiel. */
export function lessonLink(m: LearningModule, pathDone?: number): string {
  if (m.area !== 'schule') return `/spiel/${m.id}`;
  return `/spiel/${m.id}?lektion=${Math.min(3, (pathDone ?? 0) + 1)}`;
}

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
  // Weiterlernen: zuletzt gespieltes Thema, sonst das erste Mathe-Thema der Klasse
  const cont = last ?? findModule(first, custom)!;
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

        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Link to={lessonLink(cont, pathDoneOf(progress.modules[cont.id]))} onClick={() => sfx.tap()} data-testid="weiterlernen"
            className="group relative flex items-center gap-4 overflow-hidden rounded-blob bg-himmel-500 p-5 text-white shadow-karte transition hover:bg-himmel-700 lg:col-span-2 sm:p-6">
            <span className="emoji flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-4xl" aria-hidden>{cont.emoji}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-wider text-white/80">{L('Weiterlernen', 'Continua')}{cont.area === 'schule' ? ` · ${lessonLabel(Math.min(3, pathDoneOf(progress.modules[cont.id]) + 1))}` : ''}</span>
              <span className="block truncate font-display text-2xl font-bold">{tr(cont.title)}</span>
              <span className="block truncate text-white/85">{tr(cont.subtitle)}</span>
            </span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-himmel-700 transition group-hover:scale-105" aria-hidden><Play size={22} className="fill-himmel-700" /></span>
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <div className="karte flex flex-col justify-center gap-2 p-4" aria-label={L('Tagesziel', 'Obiettivo del giorno')}>
              <span className="eyebrow">{L('Tagesziel', 'Obiettivo')}</span>
              <span className="font-display text-2xl font-bold">{Math.min(today.rounds, goal)}/{goal}</span>
              <ProgressBar value={today.rounds / goal} label={L('Tagesziel', 'Obiettivo del giorno')} />
              <span className="text-xs text-tinte/55">{L('Lektionen, freiwillig', 'lezioni, senza obbligo')}</span>
            </div>
            <div className="karte flex flex-col justify-center gap-2 p-4" aria-label={L('Level-Fortschritt', 'Progresso di livello')}>
              <span className="eyebrow">Level {lvl.level}</span>
              <span className="font-display text-2xl font-bold">{progress.xp} XP</span>
              <ProgressBar value={lvl.progress} color="bg-lila-500" label={L('Fortschritt zum nächsten Level', 'Progresso verso il prossimo livello')} />
              <span className="text-xs text-tinte/55">{lvl.next ? L(`Noch ${lvl.next - progress.xp} bis Level ${lvl.level + 1}`, `Ancora ${lvl.next - progress.xp} per il livello ${lvl.level + 1}`) : L('Höchstes Level!', 'Livello massimo!')}</span>
            </div>
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
                const mods = schoolModules(country, year, id, custom);
                const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
                const c = COLOR_CLASSES[d?.color ?? 'himmel'] ?? COLOR_CLASSES.himmel!;
                return (
                  <Link key={id} to={`/schule/${year}/${id}`} onClick={() => sfx.tap()} data-testid={`home-fach-${id}`}
                    className="flex flex-col gap-3 rounded-blob bg-white p-4 shadow-weich ring-1 ring-tinte/5 transition hover:-translate-y-0.5 hover:shadow-karte">
                    <span className="flex items-center gap-3">
                      <span className={`emoji flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl ${c.soft}`} aria-hidden>{d?.emoji ?? '📘'}</span>
                      <span className="min-w-0">
                        <span className="block truncate font-display text-lg font-bold leading-tight">{subjectName(id, country)}</span>
                        <span className="block text-xs font-semibold text-tinte/55">{mods.length} {mods.length === 1 ? L('Einheit', 'unità') : L('Einheiten', 'unità')}</span>
                      </span>
                    </span>
                    <ProgressBar value={mods.length ? done / (mods.length * 3) : 0} color={c.bg} label={L(`${done} von ${mods.length * 3} Lektionen`, `${done} di ${mods.length * 3} lezioni`)} />
                  </Link>
                );
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
              {practice.map((m) => <Tile key={m.id} to={lessonLink(m, Math.max(0, pathDoneOf(progress.modules[m.id]) - 1))} emoji={m.emoji} title={tr(m.title)} color={m.color} />)}
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
