import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Play } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { Avatar, colorSet, ProgressBar, ProgressRing, SectionTitle, StarCount, Tile } from '../../components/ui';
import { sfx } from '../../lib/sound';
import { lessonLabel, lessonLink } from '../../learning/lessons';
import { Lino } from '../../components/Lino';
import { DISCOVER_ITEMS } from '../discover/DiscoverPage';
import { levelFromXp } from '../../learning/rewards';
import { allModules, findModule, fitsCountry, schoolModules } from '../../learning/registry';
import { needsPractice, pathDoneOf } from '../../learning/adaptive';
import { dateKey } from '../../lib/date';
import { L, tr } from '../../i18n';
import { stageFor } from '../../school/systems';
import { subjectDef, subjectName } from '../../school/subjects';
import { profileLabel } from '../../school/systems';

export function ChildHome() {
  const { profile, progress, settings } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const enabled = useApp((s) => s.subjects);
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
  const learnDays = Object.values(progress.daily).filter((d) => d.rounds > 0).length;
  const contStep = Math.min(3, pathDoneOf(progress.modules[cont.id]) + 1);
  const goalReached = today.rounds >= goal;
  const hello = hour < 11 ? L('Guten Morgen', 'Buongiorno') : hour < 18 ? L('Hallo', 'Ciao') : L('Guten Abend', 'Buonasera');

  return (
    <div style={{ paddingTop: 'var(--safe-top)' }}>
      <header className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-4 sm:px-6">
        <Link to="/avatar" aria-label={L('Avatar gestalten', 'Personalizza l’avatar')}><Avatar config={profile.avatar} size={52} /></Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl">{hello}, {profile.name}!</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm">
            <span className="chip bg-lila-100 py-0.5 text-lila-700" data-testid="level">Level {lvl.level}</span>
            <span className="truncate text-tinte/60">{profileLabel(profile)}</span>
          </div>
        </div>
        <StarCount n={progress.stars} />
      </header>

      <main className="seite">
        {/* Puppy und Weiterlernen */}
        <section className="relative mt-5 overflow-hidden rounded-blob bg-gradient-to-br from-himmel-500 via-himmel-500 to-lila-500 p-5 text-white shadow-karte sm:p-7" aria-label={L('Weiterlernen', 'Continua')}>
          <span className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10" aria-hidden />
          <span className="pointer-events-none absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-sonne-300/20" aria-hidden />
          <div className="relative flex items-end gap-2 sm:gap-6">
            <div className="min-w-0 flex-1">
              <p className="inline-block rounded-2xl rounded-bl-md bg-white/95 px-4 py-2 font-display text-base font-semibold text-tinte shadow-weich sm:text-lg" aria-live="polite">
                {goalReached ? L('Tagesziel geschafft! Du darfst gern weiterspielen.', 'Obiettivo raggiunto! Puoi continuare, se ti va.') : L('Was möchtest du heute lernen?', 'Che cosa vuoi imparare oggi?')}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="emoji flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl ring-2 ring-white/30" aria-hidden>{cont.emoji}</span>
                <span className="min-w-0">
                  <span className="block text-xs font-extrabold uppercase tracking-wider text-white/80">{L('Weiterlernen', 'Continua')}{cont.area === 'schule' ? ` · ${lessonLabel(contStep)}` : ''}</span>
                  <span className="line-clamp-2 block font-display text-2xl font-bold leading-tight sm:text-3xl">{tr(cont.title)}</span>
                  <span className="block truncate text-sm text-white/85 sm:text-base">{tr(cont.subtitle)}</span>
                </span>
              </div>
              <Link to={lessonLink(cont, pathDoneOf(progress.modules[cont.id]))} onClick={() => sfx.tap()} data-testid="weiterlernen"
                className="knopf kante-sonne mt-5 w-full bg-sonne-500 text-tinte hover:bg-sonne-300 sm:w-auto sm:px-8">
                <Play size={22} className="fill-tinte" /> {L('Los geht’s', 'Iniziamo')}
              </Link>
            </div>
            <div className="-mb-6 -mr-3 hidden shrink-0 min-[380px]:block sm:hidden"><Lino mood={goalReached ? 'jubel' : 'winken'} size={118} /></div>
            <div className="-mb-8 mr-4 hidden shrink-0 sm:block"><Lino mood={goalReached ? 'jubel' : 'winken'} size={190} /></div>
          </div>
        </section>

        {/* Tagesziel, Level, Lerntage */}
        <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="karte-3d flex flex-col items-center gap-1.5 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left" aria-label={L('Tagesziel', 'Obiettivo del giorno')}>
            <ProgressRing value={today.rounds / goal} size={58} label={L('Tagesziel', 'Obiettivo del giorno')}>
              <span className="font-display text-base font-bold">{Math.min(today.rounds, goal)}/{goal}</span>
            </ProgressRing>
            <span><span className="eyebrow block">{L('Tagesziel', 'Obiettivo')}</span><span className="hidden text-xs text-tinte/55 sm:block">{L('Lektionen, freiwillig', 'lezioni, senza obbligo')}</span></span>
          </div>
          <div className="karte-3d flex flex-col items-center justify-center gap-1.5 p-3 text-center sm:items-start sm:p-4 sm:text-left" aria-label={L('Level-Fortschritt', 'Progresso di livello')}>
            <span className="eyebrow">Level {lvl.level}</span>
            <span className="font-display text-xl font-bold sm:text-2xl">{progress.xp} XP</span>
            <ProgressBar value={lvl.progress} color="bg-lila-500" label={L('Fortschritt zum nächsten Level', 'Progresso verso il prossimo livello')} />
            <span className="hidden text-xs text-tinte/55 sm:block">{lvl.next ? L(`Noch ${lvl.next - progress.xp} bis Level ${lvl.level + 1}`, `Ancora ${lvl.next - progress.xp} per il livello ${lvl.level + 1}`) : L('Höchstes Level!', 'Livello massimo!')}</span>
          </div>
          <div className="karte-3d flex flex-col items-center justify-center gap-1 p-3 text-center sm:flex-row sm:justify-start sm:gap-4 sm:p-4 sm:text-left" aria-label={L('Lerntage', 'Giorni di studio')}>
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-koralle-100 text-koralle-500"><Flame size={28} className="fill-koralle-300" /></span>
            <span><span className="block font-display text-xl font-bold sm:text-2xl">{learnDays}</span><span className="eyebrow">{L('Lerntage', 'Giorni')}</span></span>
          </div>
        </div>

        <SectionTitle action={!isKita && (
          <Link to={`/schule?jahr=${year}`} className="flex items-center gap-1 text-sm font-bold text-himmel-700 hover:underline" data-testid="bereich-schule">{L('Alle Fächer', 'Tutte le materie')} <ChevronRight size={16} /></Link>
        )}>{isKita ? L('Spielen und lernen', 'Gioca e impara') : L('Deine Fächer', 'Le tue materie')}</SectionTitle>
        {isKita ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Tile to="/kita" emoji="🧸" title={tr(stage.name)} subtitle={L('Zählen, Farben, Tiere, Puzzle …', 'Contare, colori, animali, puzzle …')} color="sonne" big testId="bereich-kita" />
            <Tile to="/schule?jahr=1" emoji="🎒" title={L('Schon mal in die Schule schauen', 'Dai un’occhiata alla scuola')} subtitle={L('Aufgaben der 1. Klasse', 'Esercizi della prima classe')} color="himmel" big testId="bereich-schule" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {subjects.map((id) => {
              const d = subjectDef(id);
              const mods = schoolModules(country, year, id, custom);
              const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
              const total = mods.length * 3;
              const c = colorSet(d?.color);
              return (
                <Link key={id} to={`/schule/${year}/${id}`} onClick={() => sfx.tap()} data-testid={`home-fach-${id}`}
                  className={`group relative flex min-h-[9.5rem] flex-col justify-between gap-3 overflow-hidden rounded-blob p-4 transition hover:-translate-y-0.5 active:translate-y-1 ${c.grad} ${c.on} ${c.edge}`}>
                  <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20" aria-hidden />
                  <span className="emoji relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-3xl shadow-weich transition-transform group-hover:-rotate-6 group-hover:scale-105" aria-hidden>{d?.emoji ?? '📘'}</span>
                  <span className="relative">
                    <span className="block truncate font-display text-lg font-bold leading-tight sm:text-xl">{subjectName(id, country)}</span>
                    <span className="mb-2 block text-xs font-bold opacity-80">{done}/{total} {L('Lektionen', 'lezioni')}</span>
                    <ProgressBar value={total ? done / total : 0} color="bg-white" track="bg-black/15" label={L(`${done} von ${total} Lektionen`, `${done} di ${total} lezioni`)} />
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {assigned.length > 0 && (
          <>
            <SectionTitle>📬 {L('Aufgaben für dich', 'Compiti per te')}</SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {practice.map((m) => <Tile key={m.id} to={lessonLink(m, Math.max(0, pathDoneOf(progress.modules[m.id]) - 1))} emoji={m.emoji} title={tr(m.title)} color={m.color} />)}
            </div>
          </>
        )}

        <SectionTitle action={<Link to="/entdecken" className="flex items-center gap-1 text-sm font-bold text-koralle-700 hover:underline">{L('Mehr', 'Altro')} <ChevronRight size={16} /></Link>}>
          ✨ {L('Entdecken', 'Scopri')}
        </SectionTitle>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-0">
          {DISCOVER_ITEMS().map((it) => (
            <div key={it.to} className="w-40 shrink-0 snap-start sm:w-auto"><Tile to={it.to} emoji={it.emoji} title={it.title} color={it.color} /></div>
          ))}
        </div>
      </main>
    </div>
  );
}
