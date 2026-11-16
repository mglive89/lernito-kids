/**
 * Seiten der App „Lernito Sprachen“ – Aufbau nach „duolingo-clone“ (MIT, © 2024 Sanidhya Kumar Verma):
 * Kurse, Lernen (Pfad), Rangliste, Missionen, Laden. Daten lokal statt Server.
 */
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Gift, Heart, Languages as LanguagesIcon, Medal, ShoppingBag, Star, Target, Trophy } from 'lucide-react';
import { useApp, useActiveProfile } from '../store/useApp';
import { Avatar } from '../components/ui/Avatar';
import { pathDoneOf } from '../learning/adaptive';
import { PATH_STEPS } from '../learning/challenge';
import { PATH_LESSONS, lessonLabel } from '../learning/lessons';
import { courseById, courseModules, coursesFor } from '../lingue/course';
import { HEART_REGEN_MS, HEART_STARS, MAX_HEARTS, QUESTS, REFILL_STARS, settle, useLangPlay, useLangPlayOf } from '../lingue/play-state';
import { OutOfHeartsModal } from '../lingue/PlayExtras';
import { MicStatus } from '../pages/lingue/Languages';
import { sfx } from '../lib/sound';
import { getLang, L, tr } from '../i18n';
import { Button, CourseCard, Header, LessonButton, PageLayout, QuestsMini, UnitBanner, UserProgress } from './ui';

const KURS_KEY = 'lernito-sprachen-kurs';
export function activeCourseId(): string | null {
  // Auf der Kursseite gilt der Kurs aus der Adresse, sonst der zuletzt gewählte
  const m = /#\/lingue\/([a-z]{2})/.exec(typeof window !== 'undefined' ? window.location.hash : '');
  if (m) return m[1]!;
  try { return localStorage.getItem(KURS_KEY); } catch { return null; }
}
export function rememberCourse(id: string) {
  try { localStorage.setItem(KURS_KEY, id); } catch { /* ohne Speicher geht es auch */ }
}

/** Rechte Spalte wie im Original: Fortschritt und Missionen. */
function Side() {
  const { profile, progress } = useActiveProfile();
  const play = useLangPlayOf(profile?.id);
  const cid = activeCourseId();
  return (
    <>
      <UserProgress course={cid ? courseById(cid) : undefined} hearts={play.hearts} stars={progress.stars} />
      <QuestsMini play={play} />
    </>
  );
}

function PageTitle({ icon: Icon, title, text, color }: { icon: typeof Trophy; title: string; text: string; color: string }) {
  return (
    <>
      <Icon size={84} className={color} strokeWidth={1.6} />
      <h1 className="my-6 text-center font-display text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-center text-lg text-tinte/60">{text}</p>
    </>
  );
}

/* ---------- Kurse ---------- */
export function CoursesPage() {
  const { progress } = useActiveProfile();
  const nav = useNavigate();
  const active = activeCourseId();
  const courses = coursesFor(getLang());
  return (
    <div className="mx-auto h-full max-w-[912px] px-4 sm:px-6" data-testid="sprachen-seite">
      <h1 className="font-display text-2xl font-bold">{L('Sprachkurse', 'Corsi di lingua')}</h1>
      <p className="mb-6 text-tinte/60">{L('Wähle eine Sprache – du kannst jederzeit wechseln.', 'Scegli una lingua: puoi cambiarla quando vuoi.')}</p>
      <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
        {courses.map((c) => {
          const mods = courseModules(c.id);
          const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
          return (
            <CourseCard key={c.id} course={c} active={c.id === active} progress={`${done}/${mods.length * PATH_STEPS}`}
              onClick={() => { sfx.tap(); rememberCourse(c.id); nav(`/lingue/${c.id}`); }} />
          );
        })}
      </div>
      <div className="mt-8"><MicStatus /></div>
    </div>
  );
}

/* ---------- Lernen: Pfad eines Kurses ---------- */
export function LearnPage() {
  const { course: cid } = useParams();
  const course = courseById(cid);
  const { profile, progress } = useActiveProfile();
  const hearts = useLangPlayOf(profile?.id).hearts;
  const mods = useMemo(() => (course ? courseModules(course.id) : []), [course]);
  const [toast, setToast] = useState<string | null>(null);
  const [noHearts, setNoHearts] = useState(false);
  useEffect(() => { if (course) rememberCourse(course.id); }, [course]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2600); return () => clearTimeout(t); }, [toast]);
  if (!course || course.id === getLang()) return <Navigate to="/lingue" replace />;

  const total = mods.length * PATH_STEPS;
  const done = mods.reduce((a, m) => a + pathDoneOf(progress.modules[m.id]), 0);
  // Aktuelle Lektion: die erste offene der Lektionen 1–3 (die Profi-Lektion ist freiwillig und blockiert nichts)
  let current: { id: string; n: number } | null = null;
  for (const m of mods) {
    const pd = pathDoneOf(progress.modules[m.id]);
    if (pd < 3) { current = { id: m.id, n: pd + 1 }; break; }
  }
  const currentIdx = current ? mods.findIndex((m) => m.id === current!.id) : mods.length;

  return (
    <PageLayout side={<Side />}>
      <Header title={`${course.flag} ${course.name()}`} />
      <p className="-mt-2 mb-6 text-center text-sm font-semibold text-tinte/55" data-testid="kurs-fortschritt">{done}/{total} {L('Lektionen', 'lezioni')}</p>
      {mods.map((m, ui) => {
        const pd = pathDoneOf(progress.modules[m.id]);
        const lessons = PATH_LESSONS();
        return (
          <div key={m.id} className="mb-10" data-testid={`einheit-${m.id}`}>
            <UnitBanner title={tr(m.title)} description={tr(m.subtitle)} color={m.color} theoryTo={`/thema/${m.id}`} testId={`vokabeln-${m.id}`}
              continueTo={current?.id === m.id ? `/spiel/${m.id}?lektion=${current.n}` : undefined} />
            <div className="relative flex flex-col items-center">
              {lessons.map((les, i) => {
                const completed = pd >= les.n;
                const isCurrent = current?.id === m.id && current.n === les.n;
                // Profi-Lektion: offen, sobald die drei Lektionen der Einheit geschafft sind
                const profiOpen = les.n === PATH_STEPS && pd >= 3 && !completed;
                const locked = !completed && !isCurrent && !profiOpen;
                const blocked = !completed && hearts === 0;
                return (
                  <LessonButton key={les.n} index={i} totalCount={lessons.length - 1} locked={locked} current={isCurrent} completed={completed}
                    percentage={isCurrent ? pd / PATH_STEPS : 0} to={`/spiel/${m.id}?lektion=${les.n}`} label={`${lessonLabel(les.n)} · ${tr(m.title)}`}
                    icon={les.n === 3 ? 'mic' : les.n === PATH_STEPS ? 'flame' : undefined} testId={`lektion-${m.id}-${les.n}`}
                    onBlocked={blocked ? () => setNoHearts(true) : undefined}
                    onLocked={() => setToast(ui > currentIdx
                      ? L('Schließe zuerst die Lektionen davor ab.', 'Completa prima le lezioni precedenti.')
                      : L('Schließe zuerst die drei Lektionen dieser Einheit ab.', 'Completa prima le tre lezioni di questa unità.'))} />
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="mt-6 flex flex-col items-center gap-2 text-center text-tinte/60">
        <Trophy size={36} className={done === total ? 'text-sonne-500' : 'text-tinte/20'} />
        <p className="font-display font-bold">{done === total ? L('Kurs geschafft! Super gemacht.', 'Corso completato! Bravissimo.') : L('Ziel: alle Lektionen meistern', 'Obiettivo: completare tutte le lezioni')}</p>
      </div>
      <OutOfHeartsModal open={noHearts} onClose={() => setNoHearts(false)} courseLink={`/lingue/${course.id}`} />
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} role="status"
            className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-sm rounded-2xl bg-tinte-fest px-5 py-3 text-center font-semibold text-white shadow-karte lg:bottom-6">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

/* ---------- Rangliste ---------- */
export function LeaderboardPage() {
  const profiles = useApp((s) => s.profiles);
  const activeId = useApp((s) => s.activeProfileId);
  const byProfile = useLangPlay((s) => s.byProfile);
  const rows = profiles.map((p) => ({ p, xp: settle(byProfile[p.id]).xp })).sort((a, b) => b.xp - a.xp || a.p.name.localeCompare(b.p.name));
  return (
    <PageLayout side={<Side />}>
      <div className="flex w-full flex-col items-center" data-testid="classifica">
        <PageTitle icon={Trophy} color="text-sonne-500" title={L('Rangliste', 'Classifica')}
          text={L('So stehst du im Vergleich zu den anderen Profilen auf diesem Gerät.', 'Guarda come te la cavi rispetto agli altri profili su questo dispositivo.')} />
        <div className="mb-4 h-0.5 w-full rounded-full bg-tinte/10" />
        {rows.map(({ p, xp }, i) => (
          <div key={p.id} className={`flex w-full items-center rounded-xl p-2 px-4 hover:bg-tinte/[0.04] ${p.id === activeId ? 'bg-minze-50' : ''}`} data-testid="classifica-riga">
            <p className="mr-4 w-6 font-bold text-minze-700">{i < 3 ? <Medal size={20} className={['text-sonne-500', 'text-tinte/40', 'text-koralle-400'][i]} aria-label={`${i + 1}.`} /> : i + 1}</p>
            <span className="ml-3 mr-6"><Avatar config={p.avatar} size={48} /></span>
            <p className="flex-1 truncate font-bold">{p.name}</p>
            <p className="text-tinte/55">{xp} XP</p>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

/* ---------- Missionen ---------- */
export function QuestsPage() {
  const { profile } = useActiveProfile();
  const pid = profile?.id;
  const play = useLangPlayOf(pid);
  const claim = useLangPlay((s) => s.claim);
  return (
    <PageLayout side={<Side />}>
      <div className="flex w-full flex-col items-center" data-testid="missioni">
        <PageTitle icon={Target} color="text-himmel-600" title={L('Tagesmissionen', 'Missioni del giorno')}
          text={L('Erfülle Missionen beim Lernen – jede bringt ein Herz.', 'Completa le missioni mentre impari: ognuna ti regala un cuore.')} />
        <ul className="w-full">
          {QUESTS.map((q) => {
            const v = Math.min(q.goal, q.value(play));
            const ok = v >= q.goal;
            const claimed = play.claimed.includes(q.id);
            return (
              <li key={q.id} className="flex w-full items-center gap-x-4 border-t-2 border-tinte/[0.07] p-4" data-testid={`mission-${q.id}`} data-done={ok} data-claimed={claimed}>
                {claimed ? <Medal size={48} className="text-minze-600" /> : <Gift size={48} className={ok ? 'text-sonne-500' : 'text-tinte/25'} />}
                <div className="flex w-full flex-col gap-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-xl font-bold">{tr(q.title())}</p>
                    <p className="text-sm font-semibold text-tinte/50">{v}/{q.goal}</p>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-tinte/[0.08]"><div className="h-full rounded-full bg-sonne-500" style={{ width: `${(v / q.goal) * 100}%` }} /></div>
                </div>
                {ok && !claimed && (
                  <Button variant="super" size="sm" data-testid={`mission-${q.id}-premio`} onClick={() => { if (pid && claim(pid, q.id)) sfx.unlock(); }}>
                    +1 <Heart size={14} className="fill-current" />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </PageLayout>
  );
}

/* ---------- Laden ---------- */
export function ShopPage() {
  const { profile, progress } = useActiveProfile();
  const pid = profile?.id;
  const play = useLangPlayOf(pid);
  const refill = useLangPlay((s) => s.refillWithStars);
  const buy = useLangPlay((s) => s.buyHeart);
  const full = play.hearts >= MAX_HEARTS;
  const mins = play.nextAt ? Math.max(1, Math.ceil((play.nextAt - Date.now()) / 60_000)) : 0;
  return (
    <PageLayout side={<Side />}>
      <div className="flex w-full flex-col items-center" data-testid="laden">
        <PageTitle icon={ShoppingBag} color="text-minze-600" title={L('Laden', 'Negozio')}
          text={L('Tausche deine Sterne gegen Herzen.', 'Scambia le tue stelle con i cuori.')} />
        <div className="mb-4 flex items-center gap-1" data-testid="herzen-reihe" data-hearts={play.hearts}
          aria-label={L(`${play.hearts} von ${MAX_HEARTS} Herzen`, `${play.hearts} cuori su ${MAX_HEARTS}`)}>
          {Array.from({ length: MAX_HEARTS }, (_, i) => <Heart key={i} size={30} className={i < play.hearts ? 'fill-koralle-500 text-koralle-500' : 'text-tinte/20'} aria-hidden />)}
        </div>
        <p className="mb-6 text-center text-sm text-tinte/60">
          {full ? L('Alle Herzen voll!', 'Cuori al completo!') : L(`Nächstes Herz von selbst in ${mins} Min.`, `Il prossimo cuore torna da solo tra ${mins} min.`)}{' '}
          {L(`Alle ${HEART_REGEN_MS / 60_000} Minuten wächst ein Herz nach; Wiederholen einer geschafften Lektion bringt auch eins.`, `Ogni ${HEART_REGEN_MS / 60_000} minuti torna un cuore; anche ripassare una lezione già fatta te ne regala uno.`)}
        </p>
        <ul className="w-full">
          <li className="flex w-full items-center gap-x-4 border-t-2 border-tinte/[0.07] p-4">
            <Heart size={56} className="fill-koralle-500 text-koralle-500" />
            <p className="flex-1 text-base font-bold lg:text-xl">{L('Herzen auffüllen', 'Riempi i cuori')}</p>
            <Button data-testid="herzen-auffuellen" disabled={full || progress.stars < REFILL_STARS} onClick={() => { if (pid && refill(pid)) sfx.unlock(); }}>
              {full ? L('voll', 'pieno') : <><Star size={18} className="fill-sonne-500 text-sonne-500" /> {REFILL_STARS}</>}
            </Button>
          </li>
          <li className="flex w-full items-center gap-x-4 border-t-2 border-tinte/[0.07] p-4">
            <span className="relative"><Heart size={56} className="text-koralle-500" /><span className="absolute inset-0 flex items-center justify-center font-bold text-koralle-600">+1</span></span>
            <p className="flex-1 text-base font-bold lg:text-xl">{L('Ein Herz', 'Un cuore')}</p>
            <Button data-testid="herz-kaufen" disabled={full || progress.stars < HEART_STARS} onClick={() => { if (pid && buy(pid)) sfx.tap(); }}>
              {full ? L('voll', 'pieno') : <><Star size={18} className="fill-sonne-500 text-sonne-500" /> {HEART_STARS}</>}
            </Button>
          </li>
        </ul>
        <p className="mt-6 flex items-center gap-2 text-sm text-tinte/50"><LanguagesIcon size={16} /> {L('Sterne sammelst du in allen Lektionen von Lernito.', 'Le stelle le raccogli in tutte le lezioni di Lernito.')}</p>
      </div>
    </PageLayout>
  );
}
