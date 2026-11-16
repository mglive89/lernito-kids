import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, Car, CircleCheck, CircleX, Flag, Gauge, GraduationCap, HeartPulse, Images, Languages, Leaf,
  ListChecks, RefreshCw, RotateCcw, Signpost, Split, SquareParking, Timer, TriangleAlert, UserCheck, Users, Wrench, type LucideIcon
} from 'lucide-react';
import { AnimatedGrid, Confetti, IconBadge, Notice, ProgressBar, TopBar, colorSet } from '../../components/ui';
import { LinoSays } from '../../components/Lino';
import { sfx } from '../../lib/sound';
import { createRng, shuffle } from '../../lib/random';
import {
  buildExam, examPool, isCorrect, lessonsFor, optionOrder, practicePool, practiceQuestions, recordAnswer, scoreExam,
  type BuiltExam, type ExamResult
} from '../../fuehrerschein/bank';
import { CHAPTERS, COVERAGE, EXAM_LANGUAGES, OFFICIAL_SOURCES, chapterById } from '../../fuehrerschein/chapters';
import { profileFor } from '../../fuehrerschein/profiles';
import { missingLangs, pickText, type DrivingCountry, type Question, type StudyLang } from '../../fuehrerschein/schema';
import { RoadSign, SIGN_GROUPS, SIGNS } from '../../fuehrerschein/signs';
import { TrafficDiagram } from '../../fuehrerschein/diagrams';
import { Explanation, MissingBadge, QuestionCard } from './QuestionCard';
import { useFahrschule, type FahrschuleCtx } from './context';

const BASE = import.meta.env.BASE_URL;
const ICONS: Record<string, LucideIcon> = {
  schild: Signpost, vorfahrt: Split, tempo: Gauge, auto: Car, parken: SquareParking, autobahn: Car, 'person-walk': Users,
  gefahr: TriangleAlert, technik: Wrench, hilfe: HeartPulse, person: UserCheck, umwelt: Leaf
};
const COLORS = ['himmel', 'minze', 'koralle', 'sonne', 'lila'];
const countryName = (c: DrivingCountry, t: FahrschuleCtx['t']) => (c === 'DE' ? t('Deutschland', 'Germania') : t('Italien', 'Italia'));
const langName = (l: StudyLang) => (l === 'it' ? 'Italiano' : 'Deutsch');

function Page({ title, back, children, testid, lang }: { title: string; back: string; children: ReactNode; testid: string; lang?: StudyLang }) {
  return (
    <div className="min-h-[100dvh]" lang={lang}>
      <TopBar title={title} back={back} />
      <main className="seite flex max-w-4xl flex-col gap-5" data-testid={testid}>{children}</main>
    </div>
  );
}

function NotAllowed() {
  const { t } = useFahrschule();
  return (
    <Page title={t('Fahrschule', 'Scuola guida')} back="/entdecken" testid="fs-gesperrt">
      <div className="pt-8"><LinoSays mood="denken" text={t('Die Fahrschule gibt es ab 18 Jahren (letzte Klasse). Eltern können sie im Elternbereich auch früher freischalten.', 'La scuola guida è disponibile dai 18 anni (ultimo anno). I genitori possono attivarla prima nell’area genitori.')} /></div>
    </Page>
  );
}

/** Umschalter der Lernsprache – ändert nur die Anzeige, nicht Frage oder Antwort. */
function LangSwitch({ ctx }: { ctx: FahrschuleCtx }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-flaeche p-1 ring-1 ring-tinte/10" role="radiogroup" aria-label={ctx.t('Lernsprache', 'Lingua di studio')}>
      <Languages size={16} className="ml-1.5 text-tinte/50" aria-hidden />
      {(['it', 'de'] as StudyLang[]).map((l) => (
        <button key={l} type="button" role="radio" aria-checked={ctx.lang === l} data-testid={`fs-sprache-wechsel-${l}`}
          onClick={() => { sfx.tap(); ctx.setSetup({ lang: l }); }}
          className={`rounded-full px-3 py-1 text-sm font-bold ${ctx.lang === l ? 'bg-himmel-500 text-white' : 'text-tinte/60'}`}>{l.toUpperCase()}</button>
      ))}
    </div>
  );
}

function SelectionChips({ ctx }: { ctx: FahrschuleCtx }) {
  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="fs-auswahl">
      <span className="chip bg-himmel-100 text-himmel-700" data-testid="fs-land-anzeige">{ctx.t('Prüfung', 'Esame')}: {countryName(ctx.country!, ctx.t)}</span>
      <span className="chip bg-minze-100 text-minze-700" data-testid="fs-sprache-anzeige">{ctx.t('Sprache', 'Lingua')}: {langName(ctx.lang)}</span>
      <Link to="/fuehrerschein?schritt=land" className="chip bg-flaeche ring-1 ring-tinte/10" data-testid="fs-aendern">{ctx.t('Ändern', 'Cambia')}</Link>
    </div>
  );
}

function ChoiceButton({ onClick, testid, title, sub, icon }: { onClick: () => void; testid: string; title: string; sub?: string; icon: ReactNode }) {
  return (
    <button type="button" onClick={() => { sfx.tap(); onClick(); }} data-testid={testid}
      className="karte-3d flex w-full items-center gap-4 p-5 text-left transition hover:-translate-y-0.5">
      {icon}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl font-bold">{title}</span>
        {sub && <span className="block text-sm text-tinte/60">{sub}</span>}
      </span>
      <ArrowRight size={20} className="text-himmel-600" aria-hidden />
    </button>
  );
}

const Flag3 = ({ colors }: { colors: [string, string, string] }) => (
  <svg viewBox="0 0 30 20" width="52" height="36" aria-hidden className="shrink-0 rounded-md ring-1 ring-black/10">
    {colors.map((c, i) => (colors[0] === '#000000' ? <rect key={i} x="0" y={i * 6.67} width="30" height="6.7" fill={c} /> : <rect key={i} x={i * 10} y="0" width="10.05" height="20" fill={c} />))}
  </svg>
);
const FLAG: Record<DrivingCountry, ReactNode> = { DE: <Flag3 colors={['#000000', '#DD0000', '#FFCE00']} />, IT: <Flag3 colors={['#009246', '#FFFFFF', '#CE2B37']} /> };

// ---------- Einstieg: Land, Sprache, Übersicht ----------
export function FahrschuleHomePage() {
  const ctx = useFahrschule();
  const [params, setParams] = useSearchParams();
  const step = params.get('schritt');
  if (!ctx.allowed) return <NotAllowed />;
  const { t } = ctx;

  if (!ctx.country || step === 'land') {
    return (
      <Page title={t('Fahrschule', 'Scuola guida')} back="/entdecken" testid="fs-schritt-land" lang={ctx.lang}>
        <h1 className="pt-2 font-display text-2xl font-extrabold">{t('Wo willst du die Prüfung machen?', 'Dove vuoi fare l’esame?')}</h1>
        {(['DE', 'IT'] as DrivingCountry[]).map((c) => (
          <ChoiceButton key={c} testid={`fs-land-${c}`} icon={FLAG[c]} title={countryName(c, t)}
            sub={c === 'DE' ? t('Führerschein Klasse B', 'Patente classe B') : t('Patente B', 'Patente B')}
            onClick={() => { ctx.setSetup({ country: c, lang: undefined }); setParams({ schritt: 'sprache' }); }} />
        ))}
      </Page>
    );
  }
  if (!ctx.setup.lang || step === 'sprache') {
    return (
      <Page title={t('Fahrschule', 'Scuola guida')} back="/fuehrerschein?schritt=land" testid="fs-schritt-sprache">
        <h1 className="pt-2 font-display text-2xl font-extrabold">{ctx.lang === 'it' ? 'In che lingua vuoi studiare?' : 'In welcher Sprache willst du lernen?'}</h1>
        <p className="text-tinte/60">{t(`Prüfung: ${countryName(ctx.country, t)}. Alle Kombinationen sind möglich.`, `Esame: ${countryName(ctx.country, t)}. Tutte le combinazioni sono possibili.`)}</p>
        {(['it', 'de'] as StudyLang[]).map((l) => (
          <ChoiceButton key={l} testid={`fs-sprache-${l}`} icon={<IconBadge icon={Languages} color={l === 'it' ? 'minze' : 'himmel'} size="lg" />} title={langName(l)}
            onClick={() => { ctx.setSetup({ lang: l }); setParams({}); }} />
        ))}
      </Page>
    );
  }
  return <Dashboard ctx={ctx} />;
}

function Dashboard({ ctx }: { ctx: FahrschuleCtx }) {
  const { t, country, stats } = ctx;
  const c = country!;
  const profile = profileFor(c);
  const last = stats.exams[stats.exams.length - 1];
  const langs = EXAM_LANGUAGES[c];
  const actions = [
    { to: '/fuehrerschein/teoria', icon: BookOpen, color: 'himmel', title: t('Theorie lernen', 'Studia la teoria'), text: t('Lektionen, Verkehrszeichen, Üben nach Kapitel', 'Lezioni, segnali, esercizi per capitolo'), testid: 'fs-azione-teoria' },
    { to: '/fuehrerschein/quiz/quiz-illustrati', icon: Images, color: 'lila', title: t('Bildfragen und Fangfragen', 'Quiz illustrati e trabocchetti'), text: t('Kreuzungen mit Bildern, Skizzen und typische Fallen', 'Incroci con immagini, schemi e tranelli tipici'), testid: 'fs-azione-quiz' },
    { to: '/fuehrerschein/esame', icon: GraduationCap, color: 'koralle', title: t('Prüfung simulieren', 'Simula l’esame'), text: profile.scoring.type === 'errors' ? t(`${profile.questions} Fragen, ${profile.minutes} Min., max. ${profile.scoring.maxErrors} Fehler`, `${profile.questions} quesiti, ${profile.minutes} min, max ${profile.scoring.maxErrors} errori`) : t(`${profile.questions} Fragen, max. ${profile.scoring.maxPoints} Fehlerpunkte`, `${profile.questions} domande, max ${profile.scoring.maxPoints} punti di errore`), testid: 'fs-azione-esame' }
  ];
  return (
    <div className="min-h-[100dvh]" lang={ctx.lang}>
      <TopBar title={t('Fahrschule', 'Scuola guida')} back="/entdecken" right={<LangSwitch ctx={ctx} />} />
      <main className="seite flex max-w-4xl flex-col gap-5" data-testid="fs-dashboard" data-land={c} data-sprache={ctx.lang}>
        <section className="relative overflow-hidden rounded-blob bg-gradient-to-br from-himmel-500 to-himmel-600 text-white">
          <div className="flex flex-col gap-2 p-5 pb-0 sm:max-w-[55%] sm:pb-5">
            <span className="eyebrow text-white/70">{c === 'DE' ? t('Führerschein Klasse B', 'Patente classe B') : t('Patente B', 'Patente B')}</span>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{t('Fahrschule', 'Scuola guida')}</h1>
            <p className="text-white/85">{t('Lernen, üben und die Prüfung simulieren – mit Puppy am Steuer.', 'Studia, esercitati e simula l’esame, con Puppy al volante.')}</p>
          </div>
          <img src={`${BASE}puppy/patente.webp`} alt={t('Puppy im roten Cabrio mit Führerschein B', 'Puppy in una cabriolet rossa con la patente B')} className="mx-auto block w-full max-w-sm sm:absolute sm:bottom-0 sm:right-0 sm:w-[46%]" />
        </section>
        <SelectionChips ctx={ctx} />
        <AnimatedGrid className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {actions.map((a) => (
            <Link key={a.to} to={a.to} onClick={() => sfx.tap()} data-testid={a.testid} className="karte-3d group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 sm:flex-col sm:items-start sm:p-5">
              <IconBadge icon={a.icon} color={a.color} size="xl" />
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold leading-tight">{a.title}</span>
                <span className="block text-sm text-tinte/55">{a.text}</span>
              </span>
            </Link>
          ))}
        </AnimatedGrid>
        {stats.wrong.length > 0 && (
          <Link to="/fuehrerschein/quiz/errori" className="karte-3d flex items-center gap-3 p-4" data-testid="fs-errori">
            <IconBadge icon={RotateCcw} color="koralle" size="lg" />
            <span className="flex-1"><span className="block font-bold">{t('Fehler wiederholen', 'Rifai gli errori')}</span><span className="text-sm text-tinte/55" data-testid="fs-errori-anzahl">{t(`${stats.wrong.length} Fragen zum Wiederholen`, `${stats.wrong.length} domande da rifare`)}</span></span>
            <ArrowRight size={20} className="text-koralle-600" aria-hidden />
          </Link>
        )}
        {last && <p className="text-sm text-tinte/60" data-testid="fs-letzte-pruefung">{t('Letzte Simulation', 'Ultima simulazione')}: {last.mini ? t('Mini-Test', 'mini-test') : last.passed ? t('bestanden', 'superata') : t('nicht bestanden', 'non superata')} ({last.errors} {profile.scoring.type === 'errors' ? t('Fehler', 'errori') : t('Fehlerpunkte', 'punti di errore')})</p>}
        <Notice tone="warn">
          <span data-testid="fs-demo-hinweis"><b>{t('Demo-Inhalt', 'Contenuto demo')}.</b> {t('Eigene Lektionen und Fragen im Stil der Prüfung – keine vollständige Theorie und nicht der amtliche Fragenkatalog. Für die Prüfung auch mit Fahrschule und offiziellen Materialien lernen.', 'Lezioni e domande originali nello stile dell’esame: non è la teoria completa né il database ufficiale. Per l’esame studia anche con l’autoscuola e i materiali ufficiali.')}</span>
        </Notice>
        <div className="karte-3d flex flex-col gap-2 p-4 text-sm" data-testid="fs-lingue">
          <p className="font-bold">{t('Sprachen', 'Lingue')}</p>
          <p><b>{t('In dieser App', 'In questa app')}:</b> Italiano, Deutsch</p>
          <p><b>{t('Bei der Prüfung buchbar', 'Prenotabili all’esame')}:</b> {pickText(langs.bookable, ctx.lang).text} <span className="text-tinte/55">{pickText(langs.note, ctx.lang).text}</span></p>
        </div>
        <Link to="/fuehrerschein/copertura" className="text-sm font-semibold text-himmel-600" data-testid="fs-copertura-link">{t('Abdeckung des Prüfungsstoffs ansehen', 'Vedi la copertura del programma')} →</Link>
      </main>
    </div>
  );
}

function useNeedsSetup(ctx: FahrschuleCtx) {
  const nav = useNavigate();
  const missing = !ctx.country || !ctx.setup.lang;
  useEffect(() => { if (ctx.allowed && missing) nav('/fuehrerschein', { replace: true }); }, [ctx.allowed, missing, nav]);
  return missing;
}

// ---------- Theorie ----------
export function FahrschuleTheoryPage() {
  const ctx = useFahrschule();
  const needs = useNeedsSetup(ctx);
  if (!ctx.allowed) return <NotAllowed />;
  if (needs) return null;
  const { t, country, stats } = ctx;
  const lessons = lessonsFor(country!);
  const pool = practicePool(country!);
  return (
    <div className="min-h-[100dvh]" lang={ctx.lang}>
      <TopBar title={t('Theorie', 'Teoria')} back="/fuehrerschein" right={<LangSwitch ctx={ctx} />} />
      <main className="seite flex max-w-4xl flex-col gap-6" data-testid="fs-teoria">
        <SelectionChips ctx={ctx} />
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-lg font-bold">{t('Lektionen', 'Lezioni')} <span className="chip ml-1 bg-sonne-100 px-2 py-0.5 text-xs text-sonne-700">{t('Demo', 'Demo')}</span></h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lessons.map((l, i) => {
              const read = stats.lessonsRead.includes(l.id);
              return (
                <Link key={l.id} to={`/fuehrerschein/lezione/${l.id}`} data-testid={`fs-lezione-${l.id}`} className="karte-3d flex items-center gap-3 p-4">
                  <IconBadge icon={ICONS[chapterById(l.chapter)?.icon ?? ''] ?? BookOpen} color={COLORS[i % COLORS.length]} size="lg" />
                  <span className="flex-1"><span className="block font-bold leading-tight">{pickText(l.title, ctx.lang).text}</span><span className="text-sm text-tinte/55">{pickText(chapterById(l.chapter)?.name, ctx.lang).text}</span></span>
                  {read && <CircleCheck size={20} className="text-minze-600" aria-label={t('gelesen', 'letta')} />}
                </Link>
              );
            })}
            <Link to="/fuehrerschein/quiz/incroci" data-testid="fs-incroci-link" className="karte-3d flex items-center gap-3 p-4">
              <IconBadge icon={Split} color="minze" size="lg" />
              <span className="flex-1"><span className="block font-bold leading-tight">{t('Kreuzungen mit Bildern', 'Incroci con immagini')}</span><span className="text-sm text-tinte/55">{t(`${pool.filter((q) => q.image?.type === 'diagram' && q.image.id.startsWith('k-')).length} Aufgaben: Wer fährt zuerst?`, `${pool.filter((q) => q.image?.type === 'diagram' && q.image.id.startsWith('k-')).length} esercizi: chi passa per primo?`)}</span></span>
            </Link>
            <Link to="/fuehrerschein/segnali" data-testid="fs-segnali-link" className="karte-3d flex items-center gap-3 p-4">
              <span className="flex h-14 w-14 items-center justify-center"><RoadSign id="vorfahrtstrasse" size={52} title="" /></span>
              <span className="flex-1"><span className="block font-bold leading-tight">{t('Verkehrszeichen', 'Segnaletica')}</span><span className="text-sm text-tinte/55">{t(`${SIGNS.length} Zeichen · ${stats.signsKnown.length} sicher erkannt`, `${SIGNS.length} segnali · ${stats.signsKnown.length} riconosciuti`)}</span></span>
            </Link>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">{t('Nach Kapitel üben', 'Esercitati per capitolo')}</h2>
            <Link to="/fuehrerschein/quiz/misto" className="chip bg-flaeche ring-1 ring-tinte/10" data-testid="fs-quiz-misto"><RefreshCw size={14} aria-hidden /> {t('Gemischt', 'Misto')}</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHAPTERS.map((ch, i) => {
              const n = pool.filter((q) => q.chapter === ch.id).length;
              const s = stats.chapters[ch.id];
              const quote = s?.total ? s.right / s.total : 0;
              const color = COLORS[i % COLORS.length]!;
              return (
                <Link key={ch.id} to={`/fuehrerschein/quiz/${ch.id}`} data-testid={`fs-capitolo-${ch.id}`} className={`karte-3d flex items-center gap-3 p-4 ${n ? '' : 'pointer-events-none opacity-50'}`}>
                  <IconBadge icon={ICONS[ch.icon] ?? BookOpen} color={color} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-tight">{pickText(ch.name, ctx.lang).text}</span>
                    <span className="block text-xs text-tinte/55">{t(`${n} Fragen`, `${n} domande`)}{s ? ` · ${Math.round(quote * 100)} % ${t('richtig', 'corrette')}` : ''}</span>
                    <span className="mt-1.5 block"><ProgressBar value={quote} color={colorSet(color).bg} label={pickText(ch.name, ctx.lang).text} /></span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

export function FahrschuleLessonPage() {
  const { id } = useParams();
  const ctx = useFahrschule();
  const needs = useNeedsSetup(ctx);
  const lesson = ctx.country ? lessonsFor(ctx.country).find((l) => l.id === id) : undefined;
  useEffect(() => { if (lesson) ctx.update((s) => (s.lessonsRead.includes(lesson.id) ? s : { ...s, lessonsRead: [...s.lessonsRead, lesson.id] })); }, [lesson?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!ctx.allowed) return <NotAllowed />;
  if (needs) return null;
  const { t, lang } = ctx;
  if (!lesson) return <Page title={t('Lektion', 'Lezione')} back="/fuehrerschein/teoria" testid="fs-lezione-fehlt"><LinoSays mood="denken" text={t('Diese Lektion gibt es nicht.', 'Questa lezione non esiste.')} /></Page>;
  const title = pickText(lesson.title, lang);
  return (
    <div className="min-h-[100dvh]" lang={lang}>
      <TopBar title={t('Lektion', 'Lezione')} back="/fuehrerschein/teoria" right={<LangSwitch ctx={ctx} />} />
      <main className="seite flex max-w-3xl flex-col gap-5" data-testid="fs-lezione" data-id={lesson.id}>
        <header className="flex flex-col gap-1">
          <span className="eyebrow">{pickText(chapterById(lesson.chapter)?.name, lang).text} · {t('Demo-Inhalt', 'Contenuto demo')}</span>
          <h1 className="font-display text-2xl font-extrabold" data-testid="fs-lezione-titel">{title.text}</h1>
          {title.missing && <MissingBadge shown={title.shownLang} lang={lang} />}
          <p className="text-tinte/70">{pickText(lesson.intro, lang).text}</p>
        </header>
        {lesson.sections.map((s, i) => {
          const body = pickText(s.body, lang);
          return (
            <section key={i} className="karte-3d flex flex-col gap-3 p-5">
              <h2 className="font-display text-lg font-bold">{pickText(s.heading, lang).text}</h2>
              {s.image?.type === 'diagram' && <TrafficDiagram id={s.image.id} reveal title={pickText(s.image.alt, lang).text} />}
              {s.image?.type === 'sign' && <RoadSign id={s.image.id} size={110} title={pickText(s.image.alt, lang).text} />}
              <p className="text-tinte/80">{body.text}</p>
              {body.missing && <MissingBadge shown={body.shownLang} lang={lang} />}
            </section>
          );
        })}
        <Link to={`/fuehrerschein/quiz/${lesson.chapter}`} className="knopf knopf-3d bg-sonne-500 text-nacht" data-testid="fs-lezione-ueben"><ListChecks size={20} aria-hidden /> {t('Jetzt dazu üben', 'Esercitati ora')}</Link>
      </main>
    </div>
  );
}

export function FahrschuleSignsPage() {
  const ctx = useFahrschule();
  const needs = useNeedsSetup(ctx);
  if (!ctx.allowed) return <NotAllowed />;
  if (needs) return null;
  const { t, lang } = ctx;
  return (
    <div className="min-h-[100dvh]" lang={lang}>
      <TopBar title={t('Verkehrszeichen', 'Segnaletica')} back="/fuehrerschein/teoria" right={<LangSwitch ctx={ctx} />} />
      <main className="seite flex max-w-4xl flex-col gap-6" data-testid="fs-schilder-seite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-tinte/65">{t('Dreieck = Gefahr, rund mit rotem Rand = Verbot, rund und blau = Gebot, eckig und blau = Hinweis.', 'Triangolo = pericolo, tondo con bordo rosso = divieto, tondo blu = obbligo, quadrato blu = indicazione.')}</p>
          <Link to="/fuehrerschein/quiz/segnali" className="knopf knopf-3d bg-sonne-500 text-nacht" data-testid="fs-schilder-ueben"><ListChecks size={20} aria-hidden /> {t('Zeichen üben', 'Allenati sui segnali')}</Link>
        </div>
        {SIGN_GROUPS.map((g) => (
          <section key={g.id} className="flex flex-col gap-3">
            <h2 className="font-display text-lg font-bold">{typeof g.name === 'string' ? g.name : g.name[lang]}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SIGNS.filter((s) => s.group === g.id).map((s) => {
                const name = typeof s.name === 'string' ? s.name : s.name[lang];
                return (
                  <div key={s.id} className="karte-3d flex items-center gap-3 p-3" data-testid={`fs-schild-${s.id}`}>
                    <span className="rounded-xl bg-white p-1.5 ring-1 ring-black/5"><RoadSign id={s.id} size={68} title={name} /></span>
                    <span className="min-w-0"><span className="block font-bold leading-tight">{name}</span><span className="block text-sm text-tinte/60">{typeof s.meaning === 'string' ? s.meaning : s.meaning[lang]}</span></span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

// ---------- Üben (Kapitel, Bildfragen, Fangfragen, Fehler) ----------
const ROUND = 10;

/** Neuer Zustand bei jedem Moduswechsel */
export function FahrschuleQuizRoute() {
  const { mode = 'misto' } = useParams();
  return <FahrschuleQuizPage key={mode} />;
}

function FahrschuleQuizPage() {
  const { mode = 'misto' } = useParams();
  const ctx = useFahrschule();
  const needs = useNeedsSetup(ctx);
  const { t, lang, country } = ctx;
  const [seed, setSeed] = useState(() => Date.now());
  // Fehlerliste beim Start festhalten, damit die Runde nicht schrumpft
  const [wrongAtStart, setWrongAtStart] = useState(() => ctx.stats.wrong);
  const round = useMemo(() => {
    if (!country) return [] as { q: Question; order: string[] }[];
    const rng = createRng(seed);
    const pool = practiceQuestions(country, mode, wrongAtStart);
    const list = mode === 'errori' ? pool.slice(0, ROUND) : shuffle(rng, pool).slice(0, ROUND);
    return list.map((q) => ({ q, order: optionOrder(q, rng) }));
  }, [country, mode, seed, wrongAtStart]);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [right, setRight] = useState(0);
  const [missed, setMissed] = useState<Question[]>([]);
  useEffect(() => { setI(0); setChosen([]); setRevealed(false); setRight(0); setMissed([]); }, [round]);
  if (!ctx.allowed) return <NotAllowed />;
  if (needs) return null;

  const titles: Record<string, string> = {
    misto: t('Gemischt', 'Misto'), illustrati: t('Bildfragen', 'Quiz illustrati'), trabocchetti: t('Fangfragen', 'Trabocchetti'),
    'quiz-illustrati': t('Bild- und Fangfragen', 'Quiz illustrati e trabocchetti'), incroci: t('Kreuzungen', 'Incroci'), errori: t('Fehler wiederholen', 'Rifai gli errori')
  };
  const title = titles[mode] ?? (pickText(chapterById(mode)?.name, lang).text || t('Üben', 'Esercizi'));
  const cur = round[i];
  const done = i >= round.length;
  const ok = cur ? isCorrect(cur.q, chosen) : false;
  const check = () => {
    if (!cur || !chosen.length) return;
    setRevealed(true);
    if (ok) { sfx.correct(); setRight((r) => r + 1); } else { sfx.tryAgain(); setMissed((m) => [...m, cur.q]); }
    ctx.update((s) => recordAnswer(s, cur.q, ok));
  };
  const next = () => { sfx.tap(); setI((x) => x + 1); setChosen([]); setRevealed(false); };

  return (
    <div className="min-h-[100dvh]" lang={lang}>
      <TopBar title={title} back="/fuehrerschein" right={<LangSwitch ctx={ctx} />} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 sm:px-6" style={{ paddingBottom: 'calc(7rem + var(--safe-bottom))' }} data-testid="fs-ueben" data-land={country} data-modus={mode}>
        {mode === 'quiz-illustrati' && i === 0 && !revealed && (
          <div className="flex flex-wrap gap-2">
            <Link to="/fuehrerschein/quiz/illustrati" className="chip bg-flaeche ring-1 ring-tinte/10">{t('Nur Bildfragen', 'Solo illustrati')}</Link>
            <Link to="/fuehrerschein/quiz/trabocchetti" className="chip bg-flaeche ring-1 ring-tinte/10" data-testid="fs-solo-trabocchetti">{t('Nur Fangfragen', 'Solo trabocchetti')}</Link>
            <Link to="/fuehrerschein/quiz/incroci" className="chip bg-flaeche ring-1 ring-tinte/10" data-testid="fs-solo-incroci">{t('Nur Kreuzungen', 'Solo incroci')}</Link>
          </div>
        )}
        {round.length === 0 && <LinoSays mood="freude" text={mode === 'errori' ? t('Keine Fehler zum Wiederholen. Super!', 'Nessun errore da rifare. Ottimo!') : t('Hier gibt es noch keine Fragen.', 'Qui non ci sono ancora domande.')} />}
        {!done && cur && (
          <>
            <ProgressBar value={i / round.length} label={t('Fortschritt', 'Avanzamento')} />
            <QuestionCard q={cur.q} order={cur.order} chosen={chosen} onChange={(c) => { sfx.select(); setChosen(c); }} reveal={revealed} lang={lang} index={i} total={round.length} />
            {revealed && <Explanation q={cur.q} lang={lang} ok={ok} />}
          </>
        )}
        {done && round.length > 0 && (
          <div className="flex flex-col gap-4 pt-4" data-testid="fs-runde-ende">
            {right === round.length && <Confetti show />}
            <LinoSays mood={right === round.length ? 'jubel' : 'freude'} text={t(`${right} von ${round.length} richtig.`, `${right} su ${round.length} corrette.`)} />
            {missed.length > 0 && (
              <section className="flex flex-col gap-2" data-testid="fs-riepilogo-errori">
                <h2 className="font-display text-lg font-bold">{t('Deine Fehler', 'I tuoi errori')}</h2>
                {missed.map((q) => <p key={q.id} className="karte-3d p-3 text-sm">{pickText(q.text, lang).text}</p>)}
                {mode === 'errori'
                  ? <button type="button" className="knopf knopf-3d bg-koralle-500 text-white" onClick={() => { setWrongAtStart(ctx.stats.wrong); setSeed(Date.now()); }} data-testid="fs-rifai-errori"><RotateCcw size={20} aria-hidden /> {t('Fehler nochmal machen', 'Rifai gli errori')}</button>
                  : <Link to="/fuehrerschein/quiz/errori" className="knopf knopf-3d bg-koralle-500 text-white" data-testid="fs-rifai-errori"><RotateCcw size={20} aria-hidden /> {t('Fehler nochmal machen', 'Rifai gli errori')}</Link>}
              </section>
            )}
            <div className="flex flex-wrap gap-2">
              {mode !== 'errori' && <button type="button" className="knopf knopf-3d bg-sonne-500 text-nacht" onClick={() => setSeed(Date.now())} data-testid="fs-nochmal"><RefreshCw size={20} aria-hidden /> {t('Neue Runde', 'Nuovo giro')}</button>}
              <Link to="/fuehrerschein" className="knopf bg-flaeche ring-1 ring-tinte/10">{t('Zur Übersicht', 'Alla panoramica')}</Link>
            </div>
          </div>
        )}
      </main>
      {!done && cur && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur" style={{ paddingBottom: 'var(--safe-bottom)' }}>
          <div className="mx-auto flex max-w-3xl px-4 py-3">
            {!revealed
              ? <button type="button" className="knopf w-full bg-himmel-500 text-white disabled:opacity-50" disabled={!chosen.length} onClick={check} data-testid="fs-pruefen">{t('Prüfen', 'Controlla')}</button>
              : <button type="button" className="knopf w-full bg-sonne-500 text-nacht" onClick={next} data-testid="fs-weiter">{t('Weiter', 'Avanti')} <ArrowRight size={20} aria-hidden /></button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Prüfungssimulation ----------
const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

export function FahrschuleExamPage() {
  const ctx = useFahrschule();
  const needs = useNeedsSetup(ctx);
  const nav = useNavigate();
  const [phase, setPhase] = useState<'start' | 'laeuft' | 'ergebnis'>('start');
  const [exam, setExam] = useState<(BuiltExam & { lang: StudyLang; country: DrivingCountry; orders: Record<string, string[]> }) | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const country = ctx.country;
  const profile = country ? profileFor(country) : undefined;

  const start = () => {
    if (!country || !profile) return;
    sfx.tap();
    const rng = createRng();
    const built = buildExam(profile, examPool(country, ctx.lang), rng);
    const orders = Object.fromEntries(built.questions.map((q) => [q.id, optionOrder(q, rng)]));
    // Land und Sprache sind bis zur Abgabe fest
    setExam({ ...built, lang: ctx.lang, country, orders });
    setAnswers({}); setI(0); setLeft(profile.minutes * 60); setConfirm(false); setResult(null); setPhase('laeuft');
  };
  const finish = () => {
    if (!exam || !profile) return;
    const r = scoreExam(profile, exam.questions, answersRef.current);
    setResult(r); setPhase('ergebnis'); setConfirm(false);
    if (r.passed && !exam.mini) sfx.win(); else sfx.tryAgain();
    ctx.update((s) => {
      let n = s;
      for (const q of exam.questions) n = recordAnswer(n, q, isCorrect(q, answersRef.current[q.id] ?? []));
      return { ...n, exams: [...n.exams, { at: new Date().toISOString(), passed: r.passed && !exam.mini, errors: r.errors, mini: exam.mini }] };
    });
    window.scrollTo({ top: 0 });
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;
  useEffect(() => {
    if (phase !== 'laeuft') return;
    const id = window.setInterval(() => setLeft((x) => {
      if (x <= 1) { window.clearInterval(id); window.setTimeout(() => finishRef.current(), 0); return 0; }
      return x - 1;
    }), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  if (!ctx.allowed) return <NotAllowed />;
  if (needs || !profile || !country) return null;
  const lang = exam?.lang ?? ctx.lang;
  const t = (de: string, it: string) => (lang === 'it' ? it : de);
  const pt = (v: Parameters<typeof pickText>[0]) => pickText(v, lang).text;
  const rules = profile.scoring.type === 'errors'
    ? t(`Bestanden mit höchstens ${profile.scoring.maxErrors} Fehlern (Richtig/Falsch).`, `Superato con al massimo ${profile.scoring.maxErrors} errori (vero/falso).`)
    : t(`Bestanden mit höchstens ${profile.scoring.maxPoints} Fehlerpunkten. Zwei falsche Fragen mit 5 Punkten bedeuten: nicht bestanden – auch bei insgesamt 10 Punkten.`, `Superato con al massimo ${profile.scoring.maxPoints} punti di errore. Due errori su domande da 5 punti fanno fallire la prova, anche con un totale di 10.`);

  if (phase === 'start') {
    const poolSize = examPool(country, ctx.lang).length;
    return (
      <div className="min-h-[100dvh]" lang={lang}>
        <TopBar title={t('Prüfung', 'Esame')} back="/fuehrerschein" />
        <main className="seite flex max-w-3xl flex-col gap-4" data-testid="fs-pruefung-start" data-land={country} data-sprache={ctx.lang}>
          <SelectionChips ctx={ctx} />
          <h1 className="font-display text-2xl font-extrabold">{pt(profile.name)}</h1>
          <p className="text-tinte/65">{pt(profile.scope)}</p>
          <ul className="karte-3d flex flex-col gap-3 p-5">
            <li className="flex items-center gap-3"><ListChecks size={20} className="text-himmel-600" aria-hidden /> {profile.format === 'vf' ? t(`${profile.questions} Aussagen: richtig oder falsch`, `${profile.questions} quesiti vero/falso`) : t(`${profile.questions} Fragen, eine oder mehrere Antworten richtig, 2–5 Punkte`, `${profile.questions} domande, una o più risposte, da 2 a 5 punti`)}</li>
            <li className="flex items-center gap-3"><Timer size={20} className="text-himmel-600" aria-hidden /> {t(`${profile.minutes} Minuten`, `${profile.minutes} minuti`)}</li>
            <li className="flex items-center gap-3"><Flag size={20} className="text-himmel-600" aria-hidden /> {rules}</li>
          </ul>
          <p className="text-xs text-tinte/55" data-testid="fs-profil-version">{t('Prüfungsprofil', 'Profilo d’esame')}: {profile.id} · {t('Version', 'versione')} {profile.version} · {t('Quelle', 'fonte')}: {pt(profile.source)}{profile.note ? ` · ${pt(profile.note)}` : ''}</p>
          <p className="text-sm text-tinte/60">{t(`Land und Sprache bleiben bis zur Abgabe fest. Verfügbare geprüfte Fragen: ${poolSize}.`, `Paese e lingua restano fissi fino alla consegna. Domande validate disponibili: ${poolSize}.`)}</p>
          <button type="button" className="knopf knopf-3d bg-koralle-500 text-white" onClick={start} data-testid="fs-pruefung-start-knopf"><GraduationCap size={20} aria-hidden /> {t('Prüfung starten', 'Inizia l’esame')}</button>
        </main>
      </div>
    );
  }

  if (!exam) return null;
  if (phase === 'ergebnis' && result) {
    const wrong = exam.questions.filter((q) => !isCorrect(q, answers[q.id] ?? []));
    return (
      <div className="min-h-[100dvh]" lang={lang}>
        <TopBar title={t('Ergebnis', 'Risultato')} back="/fuehrerschein" />
        <main className="seite flex max-w-3xl flex-col gap-5" data-testid="fs-ergebnis" data-bestanden={exam.mini ? 'mini' : result.passed ? 'ja' : 'nein'}>
          {result.passed && !exam.mini && <Confetti show />}
          <div className={`flex items-center gap-4 rounded-blob p-5 ${exam.mini ? 'bg-sonne-50' : result.passed ? 'bg-minze-50' : 'bg-koralle-50'}`}>
            {result.passed ? <CircleCheck size={48} className="shrink-0 text-minze-600" aria-hidden /> : <CircleX size={48} className="shrink-0 text-koralle-600" aria-hidden />}
            <div>
              <h1 className="font-display text-2xl font-extrabold">{exam.mini ? t('Mini-Test beendet', 'Mini-test concluso') : result.passed ? t('Bestanden!', 'Superato!') : t('Nicht bestanden', 'Non superato')}</h1>
              <p className="text-tinte/70" data-testid="fs-fehler">
                {profile.scoring.type === 'errors'
                  ? t(`${result.errors} Fehler (erlaubt: ${profile.scoring.maxErrors})`, `${result.errors} errori (consentiti: ${profile.scoring.maxErrors})`)
                  : t(`${result.errors} Fehlerpunkte (erlaubt: ${profile.scoring.maxPoints})`, `${result.errors} punti di errore (consentiti: ${profile.scoring.maxPoints})`)} · {t(`${result.correct} von ${result.total} richtig`, `${result.correct} su ${result.total} corrette`)}
              </p>
              {result.failedByFives && <p className="text-sm text-koralle-700">{t(`${result.wrongFives} falsche 5-Punkte-Fragen.`, `${result.wrongFives} errori su domande da 5 punti.`)}</p>}
              {exam.mini && <p className="text-sm text-sonne-700">{t('Kein vollständiger Prüfungsbogen: Das Ergebnis zählt nicht als Simulation.', 'Non è una prova completa: il risultato non vale come simulazione.')}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="knopf knopf-3d bg-sonne-500 text-nacht" onClick={() => setPhase('start')} data-testid="fs-neue-pruefung"><RefreshCw size={20} aria-hidden /> {t('Neue Prüfung', 'Nuovo esame')}</button>
            {wrong.length > 0 && <Link to="/fuehrerschein/quiz/errori" className="knopf bg-koralle-500 text-white" data-testid="fs-rifai-errori"><RotateCcw size={20} aria-hidden /> {t('Fehler wiederholen', 'Rifai gli errori')}</Link>}
            <button type="button" className="knopf bg-flaeche ring-1 ring-tinte/10" onClick={() => nav('/fuehrerschein')}>{t('Zur Übersicht', 'Alla panoramica')}</button>
          </div>
          {wrong.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg font-bold">{t('Korrektur: deine Fehler', 'Correzione: i tuoi errori')}</h2>
              {wrong.map((q) => (
                <div key={q.id} className="flex flex-col gap-2" data-testid="fs-falsch">
                  <QuestionCard q={q} order={exam.orders[q.id]!} chosen={answers[q.id] ?? []} onChange={() => undefined} reveal lang={lang} />
                  <Explanation q={q} lang={lang} />
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    );
  }

  const q = exam.questions[i]!;
  const answered = exam.questions.filter((x) => answers[x.id]?.length).length;
  return (
    <div className="min-h-[100dvh]" lang={lang}>
      <TopBar title={exam.mini ? t('Mini-Test', 'Mini-test') : t('Prüfung', 'Esame')} back="/fuehrerschein"
        right={<span className={`chip px-3 tabular-nums ${left < 120 ? 'bg-koralle-100 text-koralle-700' : 'bg-flaeche ring-1 ring-tinte/10'}`} data-testid="fs-zeit"><Timer size={16} aria-hidden /> {fmt(left)}</span>} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 sm:px-6" style={{ paddingBottom: 'calc(7rem + var(--safe-bottom))' }} data-testid="fs-pruefung" data-land={exam.country} data-sprache={lang} data-mini={exam.mini ? 'ja' : 'nein'}>
        {exam.mini && <Notice tone="warn"><span data-testid="fs-mini-hinweis">{t(`Mini-Test: Es gibt nur ${exam.questions.length} geprüfte Fragen in dieser Sprache, zu wenig für einen vollständigen Bogen. Es werden keine Fragen doppelt verwendet.`, `Mini-test: ci sono solo ${exam.questions.length} domande validate in questa lingua, non abbastanza per una prova completa. Nessuna domanda viene ripetuta.`)}</span></Notice>}
        <nav className="flex flex-wrap gap-1.5" aria-label={t('Fragen', 'Domande')}>
          {exam.questions.map((x, k) => (
            <button key={x.id} type="button" onClick={() => setI(k)} aria-current={k === i ? 'step' : undefined} data-testid={`fs-nr-${k + 1}`}
              className={`h-9 w-9 rounded-lg text-sm font-bold tabular-nums ${k === i ? 'bg-himmel-500 text-white' : answers[x.id]?.length ? 'bg-himmel-100 text-himmel-700' : 'bg-flaeche text-tinte/60 ring-1 ring-tinte/10'}`}>{k + 1}</button>
          ))}
        </nav>
        <QuestionCard q={q} order={exam.orders[q.id]!} chosen={answers[q.id] ?? []} lang={lang} index={i} total={exam.questions.length}
          onChange={(c) => { sfx.select(); setAnswers((a) => ({ ...a, [q.id]: c })); }} />
        {confirm && (
          <div className="rounded-2xl bg-sonne-50 p-4" role="alertdialog" aria-label={t('Abgeben?', 'Consegnare?')} data-testid="fs-abgeben-frage">
            <p className="font-bold">{answered < exam.questions.length ? t(`${exam.questions.length - answered} Fragen sind noch offen. Trotzdem abgeben?`, `Ci sono ancora ${exam.questions.length - answered} domande senza risposta. Consegnare comunque?`) : t('Alle Fragen beantwortet. Jetzt abgeben?', 'Hai risposto a tutto. Consegnare ora?')}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="knopf bg-koralle-500 text-white" onClick={finish} data-testid="fs-abgeben-ja">{t('Abgeben', 'Consegna')}</button>
              <button type="button" className="knopf bg-flaeche ring-1 ring-tinte/10" onClick={() => setConfirm(false)}>{t('Weiter prüfen', 'Continua')}</button>
            </div>
          </div>
        )}
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className="mx-auto flex max-w-3xl gap-2 px-4 py-3">
          <button type="button" className="knopf bg-flaeche px-4 ring-1 ring-tinte/10" disabled={i === 0} onClick={() => setI((x) => x - 1)} aria-label={t('Vorherige Frage', 'Domanda precedente')}><ArrowLeft size={20} /></button>
          {i < exam.questions.length - 1
            ? <button type="button" className="knopf flex-1 bg-himmel-500 text-white" onClick={() => { sfx.tap(); setI((x) => x + 1); }} data-testid="fs-naechste">{t('Nächste', 'Avanti')} <ArrowRight size={20} aria-hidden /></button>
            : <span className="flex-1" />}
          <button type="button" className="knopf bg-koralle-500 text-white" onClick={() => setConfirm(true)} data-testid="fs-abgeben">{t('Abgeben', 'Consegna')}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Abdeckung ----------
export function FahrschuleCoveragePage() {
  const ctx = useFahrschule();
  const needs = useNeedsSetup(ctx);
  if (!ctx.allowed) return <NotAllowed />;
  if (needs) return null;
  const { t, lang, country } = ctx;
  const c = country!;
  const pool = practicePool(c);
  const lessons = lessonsFor(c);
  return (
    <div className="min-h-[100dvh]" lang={lang}>
      <TopBar title={t('Abdeckung', 'Copertura')} back="/fuehrerschein" right={<LangSwitch ctx={ctx} />} />
      <main className="seite flex max-w-4xl flex-col gap-4" data-testid="fs-copertura">
        <p className="text-tinte/70">{t(`Prüfungsstoff ${countryName(c, t)}: was es in der App gibt, was geprüft ist und was fehlt.`, `Programma ${countryName(c, t)}: cosa c’è nell’app, cosa è verificato e cosa manca.`)}</p>
        <div className="overflow-x-auto rounded-blob ring-1 ring-tinte/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-tinte/[0.04]"><tr>
              <th className="p-3">{t('Kapitel', 'Capitolo')}</th><th className="p-3">{t('Amtlicher Bezug', 'Riferimento ufficiale')}</th>
              <th className="p-3">{t('Inhalt', 'Contenuto')}</th><th className="p-3">{t('Geprüft', 'Verificato')}</th><th className="p-3">{t('Fehlt noch', 'Manca')}</th>
            </tr></thead>
            <tbody>
              {COVERAGE[c].map((row) => {
                const qs = pool.filter((q) => q.chapter === row.chapter);
                const ls = lessons.filter((l) => l.chapter === row.chapter).length;
                const miss = qs.filter((q) => missingLangs(q).length).length;
                return (
                  <tr key={row.chapter} className="border-t border-tinte/[0.07] align-top" data-testid={`fs-copertura-${row.chapter}`}>
                    <td className="p-3 font-bold">{pickText(chapterById(row.chapter)?.name, lang).text}</td>
                    <td className="p-3">{pickText(row.official, lang).text}</td>
                    <td className="p-3 whitespace-nowrap">{t(`${qs.length} Fragen`, `${qs.length} domande`)}<br />{t(`${ls} Lektionen`, `${ls} lezioni`)}{miss ? <><br /><span className="text-koralle-700">{t(`${miss} ohne Übersetzung`, `${miss} senza traduzione`)}</span></> : null}</td>
                    <td className="p-3">{pickText(row.verified, lang).text}</td>
                    <td className="p-3">{pickText(row.missing, lang).text}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <section className="karte-3d flex flex-col gap-1 p-4 text-sm">
          <p className="font-bold">{t('Amtliche Quellen', 'Fonti ufficiali')}</p>
          {OFFICIAL_SOURCES[c].map((s, k) => <p key={k}>{pickText(s.name, lang).text}: <span className="text-tinte/60">{pickText(s.what, lang).text}</span></p>)}
          <p className="mt-2 text-tinte/60">{t('Amtliche Fragen, Bilder oder Videos werden erst nach Prüfung der Nutzungsbedingungen als eigenes Paket importiert.', 'Domande, immagini o video ufficiali vengono importati come pacchetto separato solo dopo aver verificato le condizioni di riuso.')}</p>
        </section>
      </main>
    </div>
  );
}

