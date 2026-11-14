import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BookOpen, Car, CircleCheck, CircleX, Flag, Gauge, GraduationCap, Leaf, Lightbulb, ListChecks,
  RefreshCw, Signpost, Split, SquareParking, Timer, TriangleAlert, UserCheck, Wrench, type LucideIcon
} from 'lucide-react';
import { useActiveProfile } from '../../store/useApp';
import { Confetti, IconBadge, Notice, PageHero, ProgressBar, TopBar, AnimatedGrid, colorSet } from '../../components/ui';
import { Lino, LinoSays } from '../../components/Lino';
import { L, tr } from '../../i18n';
import { sfx } from '../../lib/sound';
import { createRng, shuffle } from '../../lib/random';
import {
  buildExam, drivingAvailable, EXAM_RULES, isCorrect, loadStats, prepare, questionsFor, questionsOfTopic, recordAnswer, saveStats,
  scoreExam, SIGN_TOPIC, topicsFor, type DrivingCountry, type DrivingQuestion, type DrivingStats, type ExamResult
} from '../../fuehrerschein/bank';
import { RoadSign, SIGN_GROUPS, SIGNS } from '../../fuehrerschein/signs';
import { QuestionCard } from './QuestionCard';

const TOPIC_ICONS: Record<string, LucideIcon> = {
  gefahr: TriangleAlert, auto: Car, vorfahrt: Split, schild: Signpost, person: UserCheck, technik: Wrench, umwelt: Leaf,
  tempo: Gauge, parken: SquareParking, licht: Lightbulb
};
const TOPIC_COLORS = ['himmel', 'minze', 'koralle', 'sonne', 'lila'];

const COUNTRY_KEY = 'lernito-fuehrerschein-land';
function readCountry(fallback: DrivingCountry): DrivingCountry {
  try { const v = localStorage.getItem(COUNTRY_KEY); return v === 'DE' || v === 'IT' ? v : fallback; } catch { return fallback; }
}

/** Profil, gewähltes Prüfungsland und Lernstand des Führerschein-Bereichs. */
function useDriving() {
  const { profile, progress, settings } = useActiveProfile();
  const [country, setCountryState] = useState<DrivingCountry>(() => readCountry(profile?.country ?? 'DE'));
  const profileId = profile?.id ?? 'gast';
  const [stats, setStats] = useState<DrivingStats>(() => loadStats(profileId, country));
  useEffect(() => { setStats(loadStats(profileId, country)); }, [profileId, country]);
  const setCountry = (c: DrivingCountry) => { try { localStorage.setItem(COUNTRY_KEY, c); } catch { /* egal */ } setCountryState(c); };
  const update = (f: (s: DrivingStats) => DrivingStats) => setStats((s) => { const n = f(s); saveStats(profileId, country, n); return n; });
  const allowed = drivingAvailable(profile?.year ?? 0, settings.drivingTheory);
  return { profile, progress, country, setCountry, stats, update, allowed };
}

const examName = (c: DrivingCountry) => (c === 'IT' ? L('Führerschein B (Italien)', 'Patente B (Italia)') : L('Führerschein Klasse B (Deutschland)', 'Patente classe B (Germania)'));

function NotAllowed() {
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Führerschein', 'Patente')} back="/entdecken" />
      <main className="seite flex flex-col items-center gap-4 pt-10" data-testid="fs-gesperrt">
        <LinoSays mood="denken" text={L('Die Führerschein-Theorie gibt es ab 18 Jahren (letzte Klasse). Eltern können sie im Elternbereich auch früher freischalten.', 'La teoria della patente è disponibile dai 18 anni (ultimo anno). I genitori possono attivarla prima nell’area genitori.')} />
      </main>
    </div>
  );
}

// ---------- Übersicht ----------
export function DrivingHomePage() {
  const { progress, country, setCountry, stats, allowed } = useDriving();
  if (!allowed) return <NotAllowed />;
  const rules = EXAM_RULES[country];
  const topics = topicsFor(country);
  const last = stats.exams[stats.exams.length - 1];
  const passedCount = stats.exams.filter((e) => e.passed).length;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Führerschein', 'Patente')} back="/entdecken" stars={progress.stars} />
      <main className="seite flex flex-col gap-6" data-testid="fuehrerschein-seite" data-land={country}>
        <PageHero color="himmel" eyebrow={L('Ab 18', 'Dai 18 anni')} title={L('Führerschein-Theorie', 'Teoria della patente')}
          subtitle={country === 'IT'
            ? L('Patente B: Schilder lernen, Vero/Falso üben und die Prüfung mit 30 Fragen simulieren.', 'Patente B: impara i segnali, allenati con i quiz vero/falso e simula l’esame da 30 domande.')
            : L('Klasse B: Verkehrszeichen lernen, Fragen nach Themen üben und die Prüfung simulieren.', 'Classe B: impara i segnali, allenati per argomento e simula l’esame.')}
          art={<span className="-my-8 block"><Lino mood="freude" size={104} /></span>} />

        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={L('Prüfung für', 'Esame per')}>
          <span className="eyebrow mr-1">{L('Prüfung für', 'Esame per')}</span>
          {(['DE', 'IT'] as DrivingCountry[]).map((c) => (
            <button key={c} type="button" role="radio" aria-checked={country === c} data-testid={`fs-land-${c}`}
              onClick={() => { sfx.tap(); setCountry(c); }}
              className={`chip min-h-[2.5rem] px-4 ring-1 transition ${country === c ? 'bg-himmel-500 text-white ring-himmel-500' : 'bg-flaeche text-tinte/70 ring-tinte/10 hover:bg-tinte/[0.04]'}`}>
              {c === 'DE' ? L('Deutschland', 'Germania') : L('Italien', 'Italia')}
            </button>
          ))}
        </div>

        <AnimatedGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <Link to="/fuehrerschein/pruefung" onClick={() => sfx.tap()} data-testid="fs-pruefung-oeffnen"
            className="karte-3d group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 sm:p-5">
            <IconBadge icon={GraduationCap} color="koralle" size="xl" />
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-bold leading-tight">{L('Prüfung simulieren', 'Simulazione d’esame')}</span>
              <span className="block text-sm text-tinte/55">
                {country === 'IT'
                  ? L(`${rules.questions} Fragen, ${rules.minutes} Minuten, höchstens ${rules.maxErrors} Fehler`, `${rules.questions} domande, ${rules.minutes} minuti, massimo ${rules.maxErrors} errori`)
                  : L(`${rules.questions} Fragen, ${rules.minutes} Minuten, höchstens ${rules.maxErrors} Fehlerpunkte`, `${rules.questions} domande, ${rules.minutes} minuti, massimo ${rules.maxErrors} punti di errore`)}
              </span>
              {last && (
                <span className={`chip mt-1.5 px-2.5 py-0.5 text-xs ${last.passed ? 'bg-minze-100 text-minze-700' : 'bg-koralle-100 text-koralle-700'}`} data-testid="fs-letzte-pruefung">
                  {last.passed ? L('Zuletzt bestanden', 'Ultima: superato') : L('Zuletzt nicht bestanden', 'Ultima: non superato')} · {L(`${passedCount} von ${stats.exams.length} bestanden`, `${passedCount} su ${stats.exams.length} superati`)}
                </span>
              )}
            </span>
            <ArrowRight size={20} className="shrink-0 text-koralle-600 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <Link to="/fuehrerschein/schilder" onClick={() => sfx.tap()} data-testid="fs-schilder-oeffnen"
            className="karte-3d group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 sm:p-5">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center"><RoadSign id="vorfahrtstrasse" size={60} title="" /></span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-bold leading-tight">{L('Verkehrszeichen', 'Segnali stradali')}</span>
              <span className="block text-sm text-tinte/55">{L(`${SIGNS.length} Zeichen mit Bedeutung, dann üben`, `${SIGNS.length} segnali con significato, poi allenati`)}</span>
              <span className="chip mt-1.5 bg-himmel-100 px-2.5 py-0.5 text-xs text-himmel-700">{L(`${stats.signsKnown.length} sicher erkannt`, `${stats.signsKnown.length} riconosciuti`)}</span>
            </span>
            <ArrowRight size={20} className="shrink-0 text-himmel-600 transition group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </AnimatedGrid>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold">{L('Nach Themen üben', 'Allenati per argomento')}</h2>
            <Link to="/fuehrerschein/ueben/alle" className="chip bg-flaeche px-3 ring-1 ring-tinte/10" data-testid="fs-thema-alle"><RefreshCw size={14} aria-hidden /> {L('Gemischt', 'Misto')}</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => {
              const s = stats.topics[t.id];
              const n = questionsOfTopic(country, t.id).length;
              const quote = s && s.total ? Math.round((s.right / s.total) * 100) : 0;
              const color = TOPIC_COLORS[i % TOPIC_COLORS.length]!;
              return (
                <Link key={t.id} to={`/fuehrerschein/ueben/${t.id}`} onClick={() => sfx.tap()} data-testid={`fs-thema-${t.id}`}
                  className="karte-3d flex items-center gap-3 p-4 transition hover:-translate-y-0.5">
                  <IconBadge icon={TOPIC_ICONS[t.icon] ?? BookOpen} color={color} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold leading-tight">{tr(t.name)}</span>
                    <span className="block text-xs text-tinte/55">{L(`${n} Fragen`, `${n} domande`)}{s ? ` · ${quote} % ${L('richtig', 'corrette')}` : ''}</span>
                    <span className="mt-1.5 block"><ProgressBar value={quote / 100} color={colorSet(color).bg} label={tr(t.name)} /></span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <Notice>
          {L('Alle Fragen und Zeichnungen sind selbst erstellt und im Stil der Prüfung geschrieben, es ist nicht der amtliche Fragenkatalog. Für die echte Prüfung zusätzlich mit der Fahrschule und den offiziellen Lernmaterialien üben.',
            'Domande e disegni sono originali e scritti nello stile dell’esame, non è il database ufficiale. Per l’esame vero allenati anche con l’autoscuola e i materiali ufficiali.')}
        </Notice>
      </main>
    </div>
  );
}

// ---------- Schilder ----------
export function DrivingSignsPage() {
  const { country, allowed } = useDriving();
  if (!allowed) return <NotAllowed />;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Verkehrszeichen', 'Segnali stradali')} back="/fuehrerschein" />
      <main className="seite flex flex-col gap-6" data-testid="fs-schilder-seite">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-tinte/65">{L('Form und Farbe verraten schon viel: Dreieck = Gefahr, rund mit rotem Rand = Verbot, rund und blau = Gebot.', 'Forma e colore dicono già molto: triangolo = pericolo, tondo con bordo rosso = divieto, tondo blu = obbligo.')}</p>
          <Link to={`/fuehrerschein/ueben/${SIGN_TOPIC[country]}`} className="knopf knopf-3d bg-sonne-500 text-nacht" data-testid="fs-schilder-ueben"><ListChecks size={20} aria-hidden /> {L('Schilder üben', 'Allenati sui segnali')}</Link>
        </div>
        {SIGN_GROUPS.map((g) => (
          <section key={g.id} className="flex flex-col gap-3">
            <div>
              <h2 className="font-display text-lg font-bold">{tr(g.name)}</h2>
              <p className="text-sm text-tinte/55">{tr(g.text)}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SIGNS.filter((s) => s.group === g.id).map((s) => (
                <div key={s.id} className="karte-3d flex items-center gap-3 p-3" data-testid={`fs-schild-${s.id}`}>
                  <span className="rounded-xl bg-white p-1.5 ring-1 ring-black/5"><RoadSign id={s.id} size={68} title={tr(s.name)} /></span>
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight">{tr(s.name)}</span>
                    <span className="block text-sm text-tinte/60">{tr(s.meaning)}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

// ---------- Üben ----------
const ROUND = 10;

export function DrivingPracticePage() {
  const { topic = 'alle' } = useParams();
  const { country, stats, update, allowed } = useDriving();
  const [seed, setSeed] = useState(() => Date.now());
  const qs = useMemo(() => {
    const rng = createRng(seed);
    const pool = topic === 'alle' ? questionsFor(country) : questionsOfTopic(country, topic);
    // Schwächere Fragen zuerst: neue und falsch beantwortete Themen kommen ohnehin gemischt dran
    return shuffle(rng, pool).slice(0, ROUND).map((q) => prepare(q, rng));
  }, [country, topic, seed]);
  const [i, setI] = useState(0);
  const [chosen, setChosen] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [right, setRight] = useState(0);
  useEffect(() => { setI(0); setChosen([]); setRevealed(false); setRight(0); }, [qs]);
  if (!allowed) return <NotAllowed />;
  const name = topic === 'alle' ? L('Gemischt', 'Misto') : tr(topicsFor(country).find((t) => t.id === topic)?.name) || L('Üben', 'Allenamento');
  const q = qs[i];
  const done = i >= qs.length;
  const ok = q ? isCorrect(q, chosen) : false;

  const check = () => {
    if (!q || !chosen.length) return;
    setRevealed(true);
    if (ok) { sfx.correct(); setRight((r) => r + 1); } else sfx.tryAgain();
    update((s) => recordAnswer(s, q, ok));
  };
  const next = () => { sfx.tap(); setI((x) => x + 1); setChosen([]); setRevealed(false); };

  return (
    <div className="min-h-[100dvh]">
      <TopBar title={name} back="/fuehrerschein" />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 sm:px-6" style={{ paddingBottom: 'calc(7rem + var(--safe-bottom))' }} data-testid="fs-ueben" data-land={country}>
        {qs.length === 0 && <LinoSays mood="denken" text={L('Zu diesem Thema gibt es noch keine Fragen.', 'Per questo argomento non ci sono ancora domande.')} />}
        {!done && q && (
          <>
            <ProgressBar value={i / qs.length} label={L('Fortschritt', 'Avanzamento')} />
            <QuestionCard q={q} chosen={chosen} onChange={(c) => { sfx.select(); setChosen(c); }} reveal={revealed} index={i} total={qs.length} />
            {revealed && (
              <div className={`rounded-2xl p-4 ${ok ? 'bg-minze-50 text-minze-700' : 'bg-koralle-50 text-koralle-700'}`} role="status" data-testid="fs-rueckmeldung" data-ok={ok ? 'true' : 'false'}>
                <p className="font-display font-bold">{ok ? L('Richtig!', 'Giusto!') : L('Nicht ganz.', 'Non proprio.')}</p>
                <p className="text-tinte/80">{tr(q.expl)}</p>
              </div>
            )}
          </>
        )}
        {done && qs.length > 0 && (
          <div className="flex flex-col items-center gap-4 pt-6 text-center" data-testid="fs-runde-ende">
            {right >= qs.length * 0.8 && <Confetti show />}
            <LinoSays mood={right >= qs.length * 0.8 ? 'jubel' : 'freude'} text={L(`${right} von ${qs.length} richtig. ${right === qs.length ? 'Perfekt!' : 'Weiter so, jede Runde macht dich sicherer.'}`, `${right} su ${qs.length} corrette. ${right === qs.length ? 'Perfetto!' : 'Continua così, ogni giro ti rende più sicuro.'}`)} />
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className="knopf knopf-3d bg-sonne-500 text-nacht" onClick={() => setSeed(Date.now())} data-testid="fs-nochmal"><RefreshCw size={20} aria-hidden /> {L('Neue Runde', 'Nuovo giro')}</button>
              <Link to="/fuehrerschein" className="knopf bg-flaeche ring-1 ring-tinte/10">{L('Zur Übersicht', 'Alla panoramica')}</Link>
            </div>
            <p className="text-sm text-tinte/55">{L('Bisher in diesem Thema:', 'Finora in questo argomento:')} {stats.topics[topic]?.right ?? right} / {stats.topics[topic]?.total ?? qs.length}</p>
          </div>
        )}
      </main>
      {!done && q && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur" style={{ paddingBottom: 'var(--safe-bottom)' }}>
          <div className="mx-auto flex max-w-3xl px-4 py-3">
            {!revealed
              ? <button type="button" className="knopf w-full bg-himmel-500 text-white disabled:opacity-50" disabled={!chosen.length} onClick={check} data-testid="fs-pruefen">{L('Prüfen', 'Controlla')}</button>
              : <button type="button" className="knopf w-full bg-sonne-500 text-nacht" onClick={next} data-testid="fs-weiter">{L('Weiter', 'Avanti')} <ArrowRight size={20} aria-hidden /></button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Prüfung ----------
const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

export function DrivingExamPage() {
  const { country, update, allowed } = useDriving();
  const nav = useNavigate();
  const rules = EXAM_RULES[country];
  const [phase, setPhase] = useState<'start' | 'laeuft' | 'ergebnis'>('start');
  const [qs, setQs] = useState<DrivingQuestion[]>([]);
  const [answers, setAnswers] = useState<(number[] | undefined)[]>([]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(rules.minutes * 60);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const start = () => {
    sfx.tap();
    const list = buildExam(country, createRng());
    setQs(list); setAnswers(list.map(() => undefined)); setI(0); setLeft(rules.minutes * 60); setConfirm(false); setResult(null); setPhase('laeuft');
  };
  const finish = () => {
    const r = scoreExam(country, qs, answersRef.current);
    setResult(r); setPhase('ergebnis'); setConfirm(false);
    if (r.passed) sfx.win(); else sfx.tryAgain();
    update((s) => {
      let n = s;
      qs.forEach((q, k) => { n = recordAnswer(n, q, isCorrect(q, answersRef.current[k] ?? [])); });
      return { ...n, exams: [...n.exams, { at: new Date().toISOString(), passed: r.passed, errors: r.errors }] };
    });
    window.scrollTo({ top: 0 });
  };
  const finishRef = useRef(finish);
  finishRef.current = finish;

  useEffect(() => {
    if (phase !== 'laeuft') return;
    const t = window.setInterval(() => setLeft((x) => {
      if (x <= 1) { window.clearInterval(t); window.setTimeout(() => finishRef.current(), 0); return 0; }
      return x - 1;
    }), 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  if (!allowed) return <NotAllowed />;
  const answered = answers.filter((a) => a && a.length).length;

  if (phase === 'start') {
    return (
      <div className="min-h-[100dvh]">
        <TopBar title={L('Prüfung', 'Esame')} back="/fuehrerschein" />
        <main className="seite flex max-w-3xl flex-col gap-5" data-testid="fs-pruefung-start" data-land={country}>
          <PageHero color="koralle" eyebrow={examName(country)} title={L('Bereit für die Prüfung?', 'Pronto per l’esame?')}
            subtitle={L('Wie in der echten Prüfung: Antworten erst am Ende sehen.', 'Come all’esame vero: le soluzioni si vedono solo alla fine.')}
            art={<span className="-my-8 block"><Lino mood="denken" size={96} /></span>} />
          <ul className="karte-3d flex flex-col gap-3 p-5">
            <li className="flex items-center gap-3"><ListChecks size={20} className="text-himmel-600" aria-hidden /> {L(`${rules.questions} Fragen aus allen Themen`, `${rules.questions} domande su tutti gli argomenti`)}</li>
            <li className="flex items-center gap-3"><Timer size={20} className="text-himmel-600" aria-hidden /> {L(`${rules.minutes} Minuten Zeit`, `${rules.minutes} minuti di tempo`)}</li>
            <li className="flex items-center gap-3"><Flag size={20} className="text-himmel-600" aria-hidden />
              {country === 'IT'
                ? L(`Bestanden mit höchstens ${rules.maxErrors} Fehlern (Vero/Falso)`, `Superato con al massimo ${rules.maxErrors} errori (vero/falso)`)
                : L(`Bestanden mit höchstens ${rules.maxErrors} Fehlerpunkten. Zwei falsche Fragen mit 5 Punkten bedeuten: nicht bestanden.`, `Superato con al massimo ${rules.maxErrors} punti di errore. Due errori su domande da 5 punti: non superato.`)}
            </li>
          </ul>
          <button type="button" className="knopf knopf-3d bg-koralle-500 text-white" onClick={start} data-testid="fs-pruefung-start-knopf"><GraduationCap size={20} aria-hidden /> {L('Prüfung starten', 'Inizia l’esame')}</button>
        </main>
      </div>
    );
  }

  if (phase === 'ergebnis' && result) {
    const wrong = qs.map((q, k) => ({ q, a: answers[k] ?? [] })).filter(({ q, a }) => !isCorrect(q, a));
    return (
      <div className="min-h-[100dvh]">
        <TopBar title={L('Ergebnis', 'Risultato')} back="/fuehrerschein" />
        <main className="seite flex max-w-3xl flex-col gap-5" data-testid="fs-ergebnis" data-bestanden={result.passed ? 'ja' : 'nein'}>
          {result.passed && <Confetti show />}
          <div className={`flex items-center gap-4 rounded-blob p-5 ${result.passed ? 'bg-minze-50' : 'bg-koralle-50'}`}>
            {result.passed ? <CircleCheck size={48} className="shrink-0 text-minze-600" aria-hidden /> : <CircleX size={48} className="shrink-0 text-koralle-600" aria-hidden />}
            <div>
              <h1 className="font-display text-2xl font-extrabold">{result.passed ? L('Bestanden!', 'Superato!') : L('Leider nicht bestanden', 'Non superato')}</h1>
              <p className="text-tinte/70" data-testid="fs-fehler">
                {country === 'IT'
                  ? L(`${result.errors} Fehler (erlaubt: ${rules.maxErrors}) · ${result.correct} von ${result.total} richtig`, `${result.errors} errori (consentiti: ${rules.maxErrors}) · ${result.correct} su ${result.total} corrette`)
                  : L(`${result.errors} Fehlerpunkte (erlaubt: ${rules.maxErrors}) · ${result.correct} von ${result.total} richtig`, `${result.errors} punti di errore (consentiti: ${rules.maxErrors}) · ${result.correct} su ${result.total} corrette`)}
              </p>
              {result.failedByFives && <p className="text-sm text-koralle-700">{L('Zwei 5-Punkte-Fragen waren falsch.', 'Due domande da 5 punti erano sbagliate.')}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="knopf knopf-3d bg-sonne-500 text-nacht" onClick={start} data-testid="fs-neue-pruefung"><RefreshCw size={20} aria-hidden /> {L('Neue Prüfung', 'Nuovo esame')}</button>
            <button type="button" className="knopf bg-flaeche ring-1 ring-tinte/10" onClick={() => nav('/fuehrerschein')}>{L('Zur Übersicht', 'Alla panoramica')}</button>
          </div>
          {wrong.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="font-display text-lg font-bold">{L('Das solltest du dir nochmal ansehen', 'Da ripassare')}</h2>
              {wrong.map(({ q, a }) => (
                <div key={q.id} className="flex flex-col gap-2" data-testid="fs-falsch">
                  <QuestionCard q={q} chosen={a} onChange={() => undefined} reveal />
                  <p className="rounded-xl bg-himmel-50 p-3 text-sm text-tinte/80">{tr(q.expl)}</p>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    );
  }

  const q = qs[i]!;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Prüfung', 'Esame')} back="/fuehrerschein"
        right={<span className={`chip px-3 tabular-nums ${left < 120 ? 'bg-koralle-100 text-koralle-700' : 'bg-flaeche ring-1 ring-tinte/10'}`} data-testid="fs-zeit"><Timer size={16} aria-hidden /> {fmt(left)}</span>} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 pt-4 sm:px-6" style={{ paddingBottom: 'calc(7rem + var(--safe-bottom))' }} data-testid="fs-pruefung" data-land={country}>
        <nav className="flex flex-wrap gap-1.5" aria-label={L('Fragen', 'Domande')}>
          {qs.map((_, k) => {
            const has = !!answers[k]?.length;
            return (
              <button key={k} type="button" onClick={() => setI(k)} aria-current={k === i ? 'step' : undefined} data-testid={`fs-nr-${k + 1}`}
                className={`h-9 w-9 rounded-lg text-sm font-bold tabular-nums transition ${k === i ? 'bg-himmel-500 text-white' : has ? 'bg-himmel-100 text-himmel-700' : 'bg-flaeche ring-1 ring-tinte/10 text-tinte/60'}`}>
                {k + 1}
              </button>
            );
          })}
        </nav>
        <QuestionCard q={q} chosen={answers[i] ?? []} index={i} total={qs.length}
          onChange={(c) => { sfx.select(); setAnswers((a) => a.map((x, k) => (k === i ? c : x))); }} />
        {confirm && (
          <div className="rounded-2xl bg-sonne-50 p-4" role="alertdialog" aria-label={L('Abgeben?', 'Consegnare?')} data-testid="fs-abgeben-frage">
            <p className="font-bold">{answered < qs.length ? L(`${qs.length - answered} Fragen sind noch offen. Trotzdem abgeben?`, `Ci sono ancora ${qs.length - answered} domande senza risposta. Consegnare comunque?`) : L('Alle Fragen beantwortet. Jetzt abgeben?', 'Hai risposto a tutte le domande. Consegnare ora?')}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="knopf bg-koralle-500 text-white" onClick={finish} data-testid="fs-abgeben-ja">{L('Abgeben', 'Consegna')}</button>
              <button type="button" className="knopf bg-flaeche ring-1 ring-tinte/10" onClick={() => setConfirm(false)}>{L('Weiter prüfen', 'Continua')}</button>
            </div>
          </div>
        )}
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] bg-flaeche/95 backdrop-blur" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className="mx-auto flex max-w-3xl gap-2 px-4 py-3">
          <button type="button" className="knopf bg-flaeche px-4 ring-1 ring-tinte/10" disabled={i === 0} onClick={() => setI((x) => x - 1)} aria-label={L('Vorherige Frage', 'Domanda precedente')}><ArrowLeft size={20} /></button>
          {i < qs.length - 1
            ? <button type="button" className="knopf flex-1 bg-himmel-500 text-white" onClick={() => { sfx.tap(); setI((x) => x + 1); }} data-testid="fs-naechste">{L('Nächste Frage', 'Prossima domanda')} <ArrowRight size={20} aria-hidden /></button>
            : <span className="flex-1" />}
          <button type="button" className="knopf bg-koralle-500 text-white" onClick={() => setConfirm(true)} data-testid="fs-abgeben">{L('Abgeben', 'Consegna')}</button>
        </div>
      </div>
    </div>
  );
}
