import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, ChefHat, CircleCheck, CircleX, Clock, Code2, Download, Hammer, Lightbulb, ListChecks, Minus, Play, Plus,
  RotateCcw, Scissors, Search, ShieldAlert, Users, WashingMachine, type LucideIcon
} from 'lucide-react';
import { AnimatedGrid, Confetti, IconBadge, Notice, ProgressBar, TopBar, colorSet } from '../../components/ui';
import { Lino, LinoSays } from '../../components/Lino';
import { Brand, WorldSwitch } from '../../components/WorldSwitch';
import { LanguageSwitch } from '../onboarding/Start';
import { useApp } from '../../store/useApp';
import { L, getLang, num, setLang, tr } from '../../i18n';
import { sfx } from '../../lib/sound';
import { CATS, GUIDES, catById, guideById, guidesOf } from '../../adult/guides';
import { AdultArt } from '../../adult/art';
import { markDone, setStep, setWorld, useAdultProgress } from '../../adult/progress';
import type { AdultCat, CodeTask, Guide, Ingredient, QuizQ } from '../../adult/types';

const CAT_ICON: Record<AdultCat, LucideIcon> = { lavoretti: Scissors, casa: WashingMachine, cucina: ChefHat, codice: Code2, faidate: Hammer };
const levelName = (l: 1 | 2 | 3) => [L('Leicht', 'Facile'), L('Mittel', 'Medio'), L('Fortgeschritten', 'Avanzato')][l - 1]!;

function Level({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1" title={levelName(level)}>
      {[1, 2, 3].map((i) => <span key={i} className={`h-1.5 w-3 rounded-full ${i <= level ? 'bg-minze-500' : 'bg-tinte/15'}`} />)}
      <span className="sr-only">{levelName(level)}</span>
    </span>
  );
}

function GuideCard({ g, done }: { g: Guide; done: boolean }) {
  const cat = catById(g.cat)!;
  const c = colorSet(cat.color);
  return (
    <Link to={`/adult/guida/${g.id}`} onClick={() => sfx.tap()} data-testid={`guida-${g.id}`}
      className="group block h-full rounded-blob focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-himmel-500">
      <div className="karte-3d flex h-full flex-col overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative p-3 pb-0">
          <AdultArt name={g.cover} className="aspect-[10/7]" />
          {done && <span className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-minze-500 text-white shadow-weich" aria-label={L('Erledigt', 'Completata')}><Check size={18} strokeWidth={3} /></span>}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <span className={`text-[11px] font-bold uppercase tracking-[0.1em] ${c.text}`}>{tr(cat.title)}</span>
          <span className="font-display text-lg font-bold leading-snug tracking-tight">{tr(g.title)}</span>
          <span className="text-sm leading-snug text-tinte/60">{tr(g.sub)}</span>
          <span className="mt-auto flex items-center gap-3 pt-2 text-xs font-semibold text-tinte/55">
            <span className="inline-flex items-center gap-1"><Clock size={14} aria-hidden />{g.minutes} min</span>
            <Level level={g.level} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function AdultHeader() {
  const uiLang = useApp((s) => s.uiLang);
  const setUiLang = useApp((s) => s.setUiLang);
  const lang = uiLang ?? getLang();
  return (
    <div className="mx-auto flex max-w-6xl 2xl:max-w-7xl flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
      <Brand tag="Adult" tone="minze" />
      <div className="flex flex-wrap items-center gap-2">
        <WorldSwitch value="adult" />
        <LanguageSwitch value={lang} onChange={(l) => { setLang(l); setUiLang(l); }} testPrefix="adult-sprache" compact />
      </div>
    </div>
  );
}

const PICKS = ['tovagliolo-ventaglio', 'vassoio-carta', 'lavatrice', 'pasta-pomodoro', 'web-1-html', 'quadro'];

// ---------------------------------------------------------------- Startseite
export function AdultHomePage() {
  const progress = useAdultProgress();
  const [q, setQ] = useState('');
  useEffect(() => { setWorld('adult'); }, []);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (s.length < 2) return null;
    return GUIDES.filter((g) => [g.title, g.sub, ...(g.materials ?? []), ...g.steps.map((x) => x.text)].some((t) => tr(t).toLowerCase().includes(s)));
  }, [q]);
  const last = progress.last ? guideById(progress.last) : undefined;
  const resume = last && !progress.done.includes(last.id) ? last : undefined;
  const doneCount = progress.done.filter((id) => guideById(id)).length;

  return (
    <div className="kinder-hintergrund min-h-[100dvh]" style={{ paddingTop: 'var(--safe-top)' }} data-testid="adult-home">
      <AdultHeader />
      <main className="seite flex flex-col gap-8 pt-4 sm:pt-6">
        <section className="relative flex w-full flex-col items-center gap-4 overflow-hidden rounded-blob bg-gradient-to-br from-minze-600 to-himmel-600 p-6 text-center text-white shadow-karte sm:flex-row sm:p-8 sm:text-left">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" aria-hidden />
          <div className="relative shrink-0"><Lino mood="freude" size={140} /></div>
          <div className="relative flex-1">
            <p className="eyebrow text-white/75">Lernito Adult</p>
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-5xl" data-testid="adult-titel">{L('Lerne Dinge, die du wirklich brauchst', 'Impara cose che ti servono davvero')}</h1>
            <p className="mt-3 text-lg text-white/90">{L('Basteln, Haushalt, Kochen, Websites bauen und Heimwerken – Schritt für Schritt mit Bildern.', 'Lavoretti, casa, cucina, siti web e fai da te: passo dopo passo, con le immagini.')}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="chip bg-white/15 text-white">{L(`${GUIDES.length} Anleitungen`, `${GUIDES.length} guide`)}</span>
              <span className="chip bg-white/15 text-white" data-testid="adult-erledigt">{L(`${doneCount} erledigt`, `${doneCount} completate`)}</span>
            </div>
          </div>
        </section>

        {resume && (
          <Link to={`/adult/guida/${resume.id}`} className="karte-3d flex items-center gap-4 p-4 transition hover:-translate-y-0.5" data-testid="adult-weiter" onClick={() => sfx.tap()}>
            <AdultArt name={resume.cover} className="h-16 w-24 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="eyebrow">{L('Weitermachen', 'Riprendi')}</span>
              <span className="block truncate font-display text-lg font-bold">{tr(resume.title)}</span>
            </span>
            <ArrowRight className="text-minze-600" aria-hidden />
          </Link>
        )}

        <label className="relative block">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-tinte/40" aria-hidden />
          <input className="feld pl-12 text-base" value={q} onChange={(e) => setQ(e.target.value)} placeholder={L('Suchen: Serviette, Waschmaschine, Pasta …', 'Cerca: tovagliolo, lavatrice, pasta …')} aria-label={L('Anleitung suchen', 'Cerca una guida')} data-testid="adult-suche" />
        </label>

        {results ? (
          <section aria-labelledby="treffer">
            <h2 id="treffer" className="mb-4 font-display text-2xl font-bold tracking-tight">{L(`${results.length} Treffer`, `${results.length} risultati`)}</h2>
            {results.length === 0 ? <p className="text-tinte/60">{L('Nichts gefunden. Probier ein anderes Wort.', 'Nessun risultato. Prova un’altra parola.')}</p> : (
              <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.map((g) => <GuideCard key={g.id} g={g} done={progress.done.includes(g.id)} />)}</AnimatedGrid>
            )}
          </section>
        ) : (
          <>
            <section aria-labelledby="bereiche">
              <h2 id="bereiche" className="mb-4 font-display text-2xl font-bold tracking-tight">{L('Was willst du lernen?', 'Cosa vuoi imparare?')}</h2>
              <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {CATS.map((c) => {
                  const list = guidesOf(c.id);
                  const d = list.filter((g) => progress.done.includes(g.id)).length;
                  return (
                    <Link key={c.id} to={`/adult/${c.id}`} onClick={() => sfx.tap()} data-testid={`bereich-${c.id}`} className="group block h-full rounded-blob">
                      <div className="karte-3d flex h-full items-center gap-4 p-5 transition-transform duration-200 group-hover:-translate-y-1">
                        <IconBadge icon={CAT_ICON[c.id]} color={c.color} size="xl" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-lg font-bold leading-snug">{tr(c.title)}</span>
                          <span className="block text-sm text-tinte/60">{tr(c.sub)}</span>
                          <span className="mt-2 block"><ProgressBar value={list.length ? d / list.length : 0} label={L(`${d} von ${list.length}`, `${d} di ${list.length}`)} /></span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </AnimatedGrid>
            </section>
            <section aria-labelledby="tipps">
              <h2 id="tipps" className="mb-4 font-display text-2xl font-bold tracking-tight">{L('Zum Ausprobieren', 'Da provare subito')}</h2>
              <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {PICKS.map((id) => guideById(id)!).map((g) => <GuideCard key={g.id} g={g} done={progress.done.includes(g.id)} />)}
              </AnimatedGrid>
            </section>
          </>
        )}
        <p className="mx-auto max-w-xl text-center text-sm text-tinte/55">{L('Lernito Adult braucht kein Konto. Dein Fortschritt bleibt nur auf diesem Gerät.', 'Lernito Adult non richiede un account. I tuoi progressi restano solo su questo dispositivo.')}</p>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------- Bereich
export function AdultCategoryPage() {
  const { cat } = useParams();
  const def = catById(cat ?? '');
  const progress = useAdultProgress();
  if (!def) return <Navigate to="/adult" replace />;
  const list = guidesOf(def.id);
  const tone = { lila: 'from-lila-600 to-lila-500', himmel: 'from-himmel-600 to-himmel-500', koralle: 'from-koralle-600 to-koralle-500', minze: 'from-minze-600 to-minze-500', sonne: 'from-sonne-300 to-sonne-500 text-nacht' }[def.color];
  return (
    <div className="min-h-[100dvh]" data-testid={`adult-bereich-${def.id}`}>
      <TopBar title={tr(def.title)} back="/adult" />
      <main className="seite flex flex-col gap-6">
        <section className={`relative mt-4 flex items-center gap-4 overflow-hidden rounded-blob bg-gradient-to-br p-5 text-white shadow-karte sm:p-7 ${tone}`}>
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">{(() => { const I = CAT_ICON[def.id]; return <I size={34} aria-hidden />; })()}</span>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{tr(def.title)}</h1>
            <p className="mt-1 opacity-90">{tr(def.sub)}</p>
          </div>
        </section>
        <AnimatedGrid className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => <GuideCard key={g.id} g={g} done={progress.done.includes(g.id)} />)}
        </AnimatedGrid>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------- Anleitung
function fmtQty(v: number) {
  if (v >= 50) return num(Math.round(v / 5) * 5);
  if (v >= 10) return num(Math.round(v));
  const r = Math.round(v * 2) / 2;
  return num(r === 0 ? 0.5 : r);
}

function Ingredients({ list, base }: { list: Ingredient[]; base: number }) {
  const [n, setN] = useState(base);
  const f = n / base;
  return (
    <section className="karte p-5" aria-labelledby="zutaten">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 id="zutaten" className="font-display text-xl font-bold">{L('Zutaten', 'Ingredienti')}</h2>
        <div className="flex items-center gap-2" role="group" aria-label={L('Portionen', 'Porzioni')}>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-tinte/[0.06]" onClick={() => setN(Math.max(1, n - 1))} aria-label={L('Weniger Portionen', 'Meno porzioni')} data-testid="porzioni-meno"><Minus size={18} /></button>
          <span className="inline-flex min-w-[6.5rem] items-center justify-center gap-1 font-bold" data-testid="porzioni"><Users size={16} aria-hidden />{L(`${n} Portionen`, `${n} porzioni`)}</span>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-tinte/[0.06]" onClick={() => setN(Math.min(12, n + 1))} aria-label={L('Mehr Portionen', 'Più porzioni')} data-testid="porzioni-piu"><Plus size={18} /></button>
        </div>
      </div>
      <ul className="divide-y divide-tinte/[0.06]">
        {list.map((i, k) => (
          <li key={k} className="flex items-baseline gap-3 py-2" data-testid={`ingrediente-${k}`}>
            <span className="w-20 shrink-0 text-right font-bold tabular-nums">{i.qty === null ? '' : `${fmtQty(i.qty * f)} ${tr(i.unit)}`}</span>
            <span>{tr(i.name)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Materials({ list }: { list: Guide['materials'] & object }) {
  const [have, setHave] = useState<number[]>([]);
  return (
    <section className="karte p-5" aria-labelledby="material">
      <h2 id="material" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><ListChecks size={22} className="text-minze-600" aria-hidden />{L('Das brauchst du', 'Cosa ti serve')}</h2>
      <ul className="flex flex-col gap-2">
        {list.map((m, i) => {
          const on = have.includes(i);
          return (
            <li key={i}>
              <button type="button" onClick={() => { sfx.tap(); setHave(on ? have.filter((x) => x !== i) : [...have, i]); }} aria-pressed={on}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition ${on ? 'bg-minze-50' : 'hover:bg-tinte/[0.03]'}`}>
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-minze-500 bg-minze-500 text-white' : 'border-tinte/25'}`}>{on && <Check size={16} strokeWidth={3} />}</span>
                <span className={on ? 'text-tinte/60 line-through' : ''}>{tr(m)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Safety({ list }: { list: Guide['safety'] & object }) {
  return (
    <div className="rounded-2xl border border-koralle-300 bg-koralle-50 px-4 py-3" role="note">
      <p className="mb-1 flex items-center gap-2 font-bold text-koralle-700"><ShieldAlert size={18} aria-hidden />{L('Sicherheit', 'Sicurezza')}</p>
      <ul className="list-disc space-y-1 pl-5">{list.map((s, i) => <li key={i}>{tr(s)}</li>)}</ul>
    </div>
  );
}

function CodeLab({ task, id }: { task: CodeTask; id: string }) {
  const [code, setCode] = useState(task.start);
  const [preview, setPreview] = useState(task.start);
  const [state, setState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const area = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { setCode(task.start); setPreview(task.start); setState('idle'); }, [task]);
  useEffect(() => { const t = setTimeout(() => setPreview(code), 400); return () => clearTimeout(t); }, [code]);
  const check = () => {
    const ok = task.check.test(code);
    setState(ok ? 'ok' : 'fail');
    if (ok) sfx.win(); else sfx.tap();
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/html' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'index.html'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.currentTarget; const s = el.selectionStart; const en = el.selectionEnd;
    const next = code.slice(0, s) + '  ' + code.slice(en);
    setCode(next);
    requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = s + 2; });
  };
  return (
    <section className="flex flex-col gap-3" data-testid="code-lab">
      <Notice><b>{L('Ziel', 'Obiettivo')}:</b> {tr(task.goal)}</Notice>
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-[#0F172A] ring-1 ring-black/10">
          <div className="flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400"><span>index.html</span><span>{L('Editor', 'Editor')}</span></div>
          <textarea ref={area} value={code} onChange={(e) => { setCode(e.target.value); setState('idle'); }} onKeyDown={onKey} spellCheck={false} wrap="off" autoCapitalize="off" autoCorrect="off" autoComplete="off"
            className="block h-72 w-full resize-y bg-transparent px-4 pb-4 font-mono text-[16px] leading-relaxed text-slate-100 outline-none sm:h-96" aria-label={L('Code-Editor', 'Editor del codice')} data-testid={`code-editor-${id}`} />
        </div>
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-tinte/10">
          <div className="flex items-center justify-between bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500"><span>{L('Vorschau', 'Anteprima')}</span><Play size={14} aria-hidden /></div>
          <iframe title={L('Vorschau', 'Anteprima')} sandbox="allow-scripts allow-modals" srcDoc={preview} className="h-72 w-full bg-white sm:h-96" data-testid="code-anteprima" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="knopf bg-minze-500 text-white" onClick={check} data-testid="code-controlla"><CircleCheck size={18} />{L('Prüfen', 'Controlla')}</button>
        <button type="button" className="knopf knopf-3d bg-flaeche" onClick={() => { setCode(task.start); setState('idle'); }}><RotateCcw size={18} />{L('Zurücksetzen', 'Ripristina')}</button>
        <button type="button" className="knopf knopf-3d bg-flaeche" onClick={download} data-testid="code-scarica"><Download size={18} />{L('Herunterladen', 'Scarica')}</button>
      </div>
      {state === 'ok' && <Notice tone="ok"><span data-testid="code-ok">{L('Super, Ziel erreicht! Du kannst weitermachen.', 'Ottimo, obiettivo raggiunto! Puoi andare avanti.')}</span></Notice>}
      {state === 'fail' && <Notice tone="warn"><span data-testid="code-ko">{L('Noch nicht ganz. Tipp: ', 'Non ancora. Suggerimento: ')}{tr(task.hint)}</span></Notice>}
    </section>
  );
}

function Quiz({ list }: { list: QuizQ[] }) {
  const [picked, setPicked] = useState<Record<number, number>>({});
  return (
    <section className="karte flex flex-col gap-5 p-5" aria-labelledby="quiz" data-testid="adult-quiz">
      <h2 id="quiz" className="font-display text-xl font-bold">{L('Kurzer Check', 'Verifica veloce')}</h2>
      {list.map((q, qi) => {
        const p = picked[qi];
        return (
          <div key={qi}>
            <p className="mb-2 font-bold">{tr(q.q)}</p>
            <div className="flex flex-col gap-2">
              {q.options.map((o, oi) => {
                const right = oi === q.answer;
                const cls = p === undefined ? 'bg-flaeche ring-1 ring-tinte/10 hover:bg-tinte/[0.03]' : right ? 'bg-minze-100 ring-2 ring-minze-500' : p === oi ? 'bg-koralle-100 ring-2 ring-koralle-500' : 'bg-flaeche ring-1 ring-tinte/10 opacity-60';
                return (
                  <button key={oi} type="button" disabled={p !== undefined} onClick={() => { setPicked({ ...picked, [qi]: oi }); right ? sfx.win() : sfx.tap(); }}
                    className={`flex items-center gap-2 rounded-xl px-4 py-3 text-left font-semibold transition ${cls}`} data-testid={`quiz-${qi}-${oi}`}>
                    {p !== undefined && right && <CircleCheck size={18} className="text-minze-700" aria-hidden />}
                    {p === oi && !right && <CircleX size={18} className="text-koralle-700" aria-hidden />}
                    {tr(o)}
                  </button>
                );
              })}
            </div>
            {p !== undefined && <p className="mt-2 text-sm text-tinte/70">{tr(q.why)}</p>}
          </div>
        );
      })}
    </section>
  );
}

export function AdultGuidePage() {
  const { id } = useParams();
  const g = guideById(id ?? '');
  const progress = useAdultProgress();
  const nav = useNavigate();
  const saved = g ? progress.step[g.id] : undefined;
  const [step, setStepState] = useState<number | 'intro' | 'end'>('intro');
  useEffect(() => { window.scrollTo(0, 0); }, [step]);
  if (!g) return <Navigate to="/adult" replace />;
  const cat = catById(g.cat)!;
  const total = g.steps.length;
  const go = (s: number | 'intro' | 'end') => {
    sfx.tap();
    if (typeof s === 'number') setStep(g.id, s);
    if (s === 'end') { markDone(g.id); setStep(g.id, 0); sfx.win(); }
    setStepState(s);
  };
  const done = progress.done.includes(g.id);

  if (step === 'intro') {
    return (
      <Shell title={tr(g.title)} back={`/adult/${g.cat}`}>
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <AdultArt name={g.cover} className="aspect-[10/7] w-full" label={tr(g.title)} />
          <div className="flex flex-col gap-3">
            <span className={`eyebrow ${colorSet(cat.color).text}`}>{tr(cat.title)}</span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight" data-testid="guida-titolo">{tr(g.title)}</h1>
            <p className="text-lg text-tinte/70">{tr(g.sub)}</p>
            <div className="flex flex-wrap gap-2">
              <span className="chip bg-tinte/[0.05] text-tinte/70"><Clock size={14} aria-hidden />{g.minutes} min</span>
              <span className="chip bg-tinte/[0.05] text-tinte/70">{levelName(g.level)}</span>
              <span className="chip bg-tinte/[0.05] text-tinte/70">{L(`${total} Schritte`, `${total} passi`)}</span>
              {done && <span className="chip bg-minze-100 text-minze-700"><Check size={14} aria-hidden />{L('Erledigt', 'Completata')}</span>}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="knopf bg-minze-500 px-6 py-4 text-lg text-white" onClick={() => go(0)} data-testid="guida-inizia"><Play size={20} />{L('Los geht’s', 'Inizia')}</button>
              {saved !== undefined && saved > 0 && saved < total && (
                <button type="button" className="knopf knopf-3d bg-flaeche px-5 py-4" onClick={() => go(saved)} data-testid="guida-riprendi">{L(`Weiter bei Schritt ${saved + 1}`, `Riprendi dal passo ${saved + 1}`)}</button>
              )}
            </div>
          </div>
        </div>
        {g.safety && <Safety list={g.safety} />}
        {g.ingredients && <Ingredients list={g.ingredients} base={g.servings ?? 2} />}
        {g.materials && <Materials list={g.materials} />}
        <section className="karte p-5" aria-labelledby="ueberblick">
          <h2 id="ueberblick" className="mb-3 font-display text-xl font-bold">{L('Die Schritte im Überblick', 'I passi in breve')}</h2>
          <ol className="flex flex-col gap-2">
            {g.steps.map((s, i) => (
              <li key={i}>
                <button type="button" onClick={() => go(i)} className="flex w-full items-start gap-3 rounded-xl px-2 py-2 text-left hover:bg-tinte/[0.03]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-minze-100 text-sm font-extrabold text-minze-700">{i + 1}</span>
                  <span className="line-clamp-2 text-tinte/80">{tr(s.text)}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      </Shell>
    );
  }

  if (step === 'end') {
    return (
      <Shell title={tr(g.title)} back={`/adult/${g.cat}`}>
        <Confetti show />
        <div className="pt-4" data-testid="guida-fine"><LinoSays mood="jubel" text={L('Geschafft! Gut gemacht.', 'Fatto! Bravissimo.')} /></div>
        {g.tips && (
          <section className="karte p-5" aria-labelledby="tipps-ende">
            <h2 id="tipps-ende" className="mb-3 flex items-center gap-2 font-display text-xl font-bold"><Lightbulb size={22} className="text-sonne-700" aria-hidden />{L('Profi-Tipps', 'Consigli da esperto')}</h2>
            <ul className="list-disc space-y-1 pl-5">{g.tips.map((t, i) => <li key={i}>{tr(t)}</li>)}</ul>
          </section>
        )}
        {g.quiz && <Quiz list={g.quiz} />}
        <div className="flex flex-wrap gap-2">
          <button type="button" className="knopf knopf-3d bg-flaeche" onClick={() => go(0)}><RotateCcw size={18} />{L('Schritte nochmal ansehen', 'Rivedi i passi')}</button>
          <button type="button" className="knopf bg-minze-500 text-white" onClick={() => nav(`/adult/${g.cat}`)} data-testid="guida-altre">{L('Weitere Anleitungen', 'Altre guide')}<ArrowRight size={18} /></button>
        </div>
      </Shell>
    );
  }

  const s = g.steps[step]!;
  return (
    <Shell title={tr(g.title)} back={`/adult/${g.cat}`}>
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between text-sm font-bold text-tinte/60"><span data-testid="passo-numero">{L(`Schritt ${step + 1} von ${total}`, `Passo ${step + 1} di ${total}`)}</span><button type="button" className="underline-offset-2 hover:underline" onClick={() => go('intro')}>{L('Übersicht', 'Panoramica')}</button></div>
        <ProgressBar value={(step + 1) / total} color="bg-minze-500" />
      </div>
      <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4">
        {s.art && !s.code && <AdultArt name={s.art} className="mx-auto aspect-[10/7] w-full max-w-2xl" label={L(`Bild zu Schritt ${step + 1}`, `Immagine del passo ${step + 1}`)} />}
        {s.art && s.code && <AdultArt name={s.art} className="mx-auto aspect-[10/7] w-full max-w-sm" />}
        <p className="text-xl leading-relaxed sm:text-2xl" data-testid="passo-testo">{tr(s.text)}</p>
        {s.tip && <Notice><b>{L('Tipp', 'Consiglio')}:</b> {tr(s.tip)}</Notice>}
        {s.code && <CodeLab task={s.code} id={`${g.id}-${step}`} />}
      </motion.div>
      <div className="sticky bottom-0 -mx-4 mt-2 flex gap-3 border-t border-tinte/[0.06] bg-flaeche/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border" style={{ paddingBottom: 'calc(0.75rem + var(--safe-bottom))' }}>
        <button type="button" className="knopf knopf-3d flex-1 bg-flaeche" onClick={() => go(step === 0 ? 'intro' : step - 1)} data-testid="passo-indietro"><ArrowLeft size={18} />{L('Zurück', 'Indietro')}</button>
        <button type="button" className="knopf flex-[2] bg-minze-500 text-white" onClick={() => go(step + 1 >= total ? 'end' : step + 1)} data-testid="passo-avanti">
          {step + 1 >= total ? L('Fertig!', 'Finito!') : L('Weiter', 'Avanti')}<ArrowRight size={18} />
        </button>
      </div>
    </Shell>
  );
}

function Shell({ title, back, children }: { title: string; back: string; children: ReactNode }) {
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={title} back={back} />
      <main className="seite flex max-w-5xl flex-col gap-5" data-testid="adult-guida">{children}</main>
    </div>
  );
}
