import { Link } from 'react-router-dom';
import { ArrowRight, CalendarCheck, ChevronRight, Play, Target, Zap } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { Avatar, colorSet, CountUp, IconBadge, Reveal, Stagger, StaggerItem, ProgressBar, ProgressRing, SectionTitle, StarCount, SubjectIcon, subjectIcon, Tile } from '../../components/ui';
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
  const ContIcon = subjectIcon(cont.subject ?? '');
  const hello = hour < 11 ? L('Guten Morgen', 'Buongiorno') : hour < 18 ? L('Hallo', 'Ciao') : L('Guten Abend', 'Buonasera');

  return (
    <div style={{ paddingTop: 'var(--safe-top)' }}>
      <header className="mx-auto flex max-w-6xl 2xl:max-w-7xl items-center gap-3 px-4 pt-5 sm:px-6">
        <Link to="/avatar" aria-label={L('Avatar gestalten', 'Personalizza l’avatar')}><Avatar config={profile.avatar} size={48} /></Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-xl font-extrabold tracking-tight sm:text-2xl">{hello}, {profile.name}!</p>
          <p className="truncate text-sm text-tinte/55"><span className="font-semibold text-lila-600" data-testid="level">Level {lvl.level}</span> · {profileLabel(profile)}</p>
        </div>
        <StarCount n={progress.stars} />
      </header>

      <main className="seite">
        {/* Weiterlernen mit Puppy */}
        <section className="relative mt-5 overflow-hidden rounded-blob hero-lebendig text-white shadow-karte" aria-label={L('Weiterlernen', 'Continua')}>
          <span className="schwebe pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/[0.08]" aria-hidden />
          <span className="schwebe-langsam pointer-events-none absolute -bottom-32 right-32 h-64 w-64 rounded-full bg-white/[0.06]" aria-hidden />
          <span className="schwebe pointer-events-none absolute left-1/2 top-6 h-3 w-3 rounded-full bg-sonne-300/80" aria-hidden />
          <span className="schwebe-langsam pointer-events-none absolute right-1/3 bottom-10 h-2 w-2 rounded-full bg-white/70" aria-hidden />
          <div className="relative flex items-end gap-2 p-5 sm:gap-6 sm:p-7">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/80" aria-live="polite">
                {goalReached ? L('Tagesziel geschafft! Du darfst gern weiterspielen.', 'Obiettivo raggiunto! Puoi continuare, se ti va.') : L('Was möchtest du heute lernen?', 'Che cosa vuoi imparare oggi?')}
              </p>
              <div className="mt-4 flex items-center gap-3.5">
                <span className="emoji flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 text-2xl ring-1 ring-white/20 sm:h-14 sm:w-14 sm:text-3xl" aria-hidden>
                  {cont.subject ? <ContIcon size={26} strokeWidth={2.2} /> : cont.emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">{L('Weiterlernen', 'Continua')}{cont.area === 'schule' ? ` · ${lessonLabel(contStep)}` : ''}</span>
                  <span className="line-clamp-2 block font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{tr(cont.title)}</span>
                  <span className="block truncate text-sm text-white/80 sm:text-base">{tr(cont.subtitle)}</span>
                </span>
              </div>
              <Link to={lessonLink(cont, pathDoneOf(progress.modules[cont.id]))} onClick={() => sfx.tap()} data-testid="weiterlernen"
                className="knopf glanz puls mt-5 w-full bg-white text-himmel-700 ring-0 hover:bg-himmel-50 sm:w-auto sm:px-7">
                <Play size={18} className="fill-himmel-700" /> {L('Los geht’s', 'Iniziamo')}
              </Link>
            </div>
            <div className="-mb-7 -mr-3 hidden shrink-0 min-[380px]:block sm:hidden"><Lino mood={goalReached ? 'jubel' : 'winken'} size={112} /></div>
            <div className="-mb-9 mr-2 hidden shrink-0 sm:block"><Lino mood={goalReached ? 'jubel' : 'winken'} size={180} /></div>
          </div>
        </section>

        {/* Tagesziel, Level, Lerntage */}
        <Stagger className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
          <StaggerItem className="karte-3d flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left" aria-label={L('Tagesziel', 'Obiettivo del giorno')}>
            <ProgressRing value={today.rounds / goal} size={52} stroke={6} color="#12B886" label={L('Tagesziel', 'Obiettivo del giorno')}>
              <Target size={20} className="text-minze-600" />
            </ProgressRing>
            <span><span className="block font-display text-lg font-extrabold leading-none sm:text-xl">{Math.min(today.rounds, goal)}/{goal}</span><span className="text-xs font-medium text-tinte/55">{L('Tagesziel', 'Obiettivo')}</span></span>
          </StaggerItem>
          <StaggerItem className="karte-3d flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left" aria-label={L('Level-Fortschritt', 'Progresso di livello')}>
            <IconBadge icon={Zap} color="lila" size="lg" />
            <span className="w-full min-w-0">
              <span className="block font-display text-lg font-extrabold leading-none sm:text-xl"><CountUp value={progress.xp} /> XP</span>
              <span className="text-xs font-medium text-tinte/55">{lvl.next ? L(`noch ${lvl.next - progress.xp} bis Level ${lvl.level + 1}`, `${lvl.next - progress.xp} al livello ${lvl.level + 1}`) : L('Höchstes Level!', 'Livello massimo!')}</span>
              <span className="mt-1.5 hidden sm:block"><ProgressBar value={lvl.progress} color="bg-lila-500" label={L('Fortschritt zum nächsten Level', 'Progresso verso il prossimo livello')} /></span>
            </span>
          </StaggerItem>
          <StaggerItem className="karte-3d flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left" aria-label={L('Lerntage', 'Giorni di studio')}>
            <IconBadge icon={CalendarCheck} color="koralle" size="lg" />
            <span><span className="block font-display text-lg font-extrabold leading-none sm:text-xl"><CountUp value={learnDays} /></span><span className="text-xs font-medium text-tinte/55">{L('Lerntage', 'Giorni di studio')}</span></span>
          </StaggerItem>
        </Stagger>

        <SectionTitle action={!isKita && (
          <Link to={`/schule?jahr=${year}`} className="flex items-center gap-1 text-sm font-semibold text-himmel-600 hover:text-himmel-700" data-testid="bereich-schule">{L('Alle Fächer', 'Tutte le materie')} <ChevronRight size={16} /></Link>
        )}>{isKita ? L('Spielen und lernen', 'Gioca e impara') : L('Deine Fächer', 'Le tue materie')}</SectionTitle>
        {isKita ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Tile to="/kita" emoji="🧸" title={tr(stage.name)} subtitle={L('Zählen, Farben, Tiere, Puzzle …', 'Contare, colori, animali, puzzle …')} color="sonne" big testId="bereich-kita" />
            <Tile to="/schule?jahr=1" emoji="🎒" title={L('Schon mal in die Schule schauen', 'Dai un’occhiata alla scuola')} subtitle={L('Aufgaben der 1. Klasse', 'Esercizi della prima classe')} color="himmel" big testId="bereich-schule" />
          </div>
        ) : (
          <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {subjects.map((id) => {
              const d = subjectDef(id);
              const mods = schoolModules(country, year, id, custom);
              const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
              const total = mods.length * 3;
              const c = colorSet(d?.color);
              return (
                <StaggerItem key={id}>
                <Link to={`/schule/${year}/${id}`} onClick={() => sfx.tap()} data-testid={`home-fach-${id}`}
                  className="karte-3d group flex h-full flex-col gap-4 p-4 hover:-translate-y-1 sm:p-5">
                  <span className="flex items-start justify-between">
                    <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"><SubjectIcon id={id} color={d?.color} size="lg" /></span>
                    <ArrowRight size={18} className={`${c.text} opacity-0 transition group-hover:opacity-100`} aria-hidden />
                  </span>
                  <span>
                    <span className="block truncate font-display text-base font-bold leading-tight sm:text-lg">{subjectName(id, country)}</span>
                    <span className="mb-2.5 mt-0.5 block text-xs font-medium text-tinte/55">{done}/{total} {L('Lektionen', 'lezioni')}</span>
                    <ProgressBar value={total ? done / total : 0} color={c.bg} label={L(`${done} von ${total} Lektionen`, `${done} di ${total} lezioni`)} />
                  </span>
                </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        {assigned.length > 0 && (
          <>
            <SectionTitle>{L('Aufgaben für dich', 'Compiti per te')}</SectionTitle>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {assigned.map((m) => (
                <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={tr(m.title)} color={m.color} badge={progress.modules[m.id]?.rounds ? <span className="chip bg-minze-50 px-2 py-0.5 text-xs text-minze-700">✓</span> : undefined} />
              ))}
            </div>
          </>
        )}

        {practice.length > 0 && (
          <>
            <SectionTitle>{L('Nochmal üben', 'Ripassiamo')}</SectionTitle>
            <p className="-mt-2 mb-3 text-sm text-tinte/55">{L('Diese Themen üben wir gemeinsam in kleinen Schritten.', 'Ripassiamo insieme questi argomenti, a piccoli passi.')}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {practice.map((m) => <Tile key={m.id} to={lessonLink(m, Math.max(0, pathDoneOf(progress.modules[m.id]) - 1))} emoji={m.emoji} title={tr(m.title)} color={m.color} />)}
            </div>
          </>
        )}

        <Reveal>
        <SectionTitle action={<Link to="/entdecken" className="flex items-center gap-1 text-sm font-semibold text-himmel-600 hover:text-himmel-700">{L('Alle', 'Tutto')} <ChevronRight size={16} /></Link>}>
          {L('Entdecken', 'Scopri')}
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {DISCOVER_ITEMS().slice(0, 4).map((it) => (
            <Tile key={it.to} to={it.to} icon={<IconBadge icon={it.icon} color={it.color} size="lg" />} title={it.title} subtitle={it.text} color={it.color} />
          ))}
        </div>
        </Reveal>
      </main>
    </div>
  );
}
