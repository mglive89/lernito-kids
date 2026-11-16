/**
 * MathLens (Arbeitsname): Aufgabe fotografieren, Formel prüfen und korrigieren, Lösungsweg ansehen.
 * Aufbau: capture/ (Kamera, Zuschnitt) → recognize (Texterkennung auf dem Gerät) → analyze (Prüfen)
 * → hausaufgaben/parse + solve (Rechenmotor, exakte Brüche) → SolutionView / formula/ (Darstellung).
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Camera, Clock, ImagePlus, Keyboard, Moon, ScanLine, ShieldCheck, Sun, Trash2, X } from 'lucide-react';
import { L, getLang, type Lang } from '../i18n';
import { useApp } from '../store/useApp';
import { applyTheme, getTheme, isDark, setTheme } from '../lib/theme';
import { Modal, Notice } from '../components/ui';
import { PinLogin, PinSetup } from '../components/ParentAuth';
import { solveTask } from '../hausaufgaben/solve';
import type { Solution } from '../hausaufgaben/types';
import { hasUnresolvedSymbols, type ReadAnalysis } from './analyze';
import { addHistory, clearHistory, loadHistory, removeHistory, type HistoryEntry } from './history';
import { chooseLang } from './lang';
import { canParse, FormulaView } from './formula/FormulaView';
import { applyKey, MathKeyboard, type KeyAction } from './formula/MathKeyboard';
import { SolutionView } from './SolutionView';
import { Cropper } from './capture/Cropper';
import { FRAME, cropToBlob, grabFrame, openCamera, stopCamera, type CameraError, type Rect } from './capture/camera';
import { LensLogo } from './Logo';

const BASE = import.meta.env.BASE_URL;

interface Shot { url: string; w: number; h: number; img: HTMLImageElement | HTMLCanvasElement }

/** Gemeinsamer Zustand der Ansichten */
interface Work {
  shot: Shot | null;
  rect: Rect;
  cropUrl: string | null;
  formula: string;
  read: ReadAnalysis | null;
  solution: Solution | null;
  unsupported: string | null;
}
const EMPTY: Work = { shot: null, rect: FRAME, cropUrl: null, formula: '', read: null, solution: null, unsupported: null };

export function MathLensApp({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  const [work, setWork] = useState<Work>(EMPTY);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  const nav = useNavigate();
  const loc = useLocation();
  const hydrated = useApp((s) => s.hydrated);

  useEffect(() => {
    const splash = document.getElementById('splash');
    if (splash) { splash.style.opacity = '0'; setTimeout(() => splash.remove(), 400); }
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [loc.pathname]);
  // Sprache gewechselt: Lösung in der neuen Sprache neu erklären
  useEffect(() => {
    document.documentElement.lang = lang;
    setWork((w) => {
      if (!w.solution) return w;
      const r = solveTask(w.formula);
      return r.ok ? { ...w, solution: r.solution } : w;
    });
  }, [lang]);

  const update = (p: Partial<Work>) => setWork((w) => ({ ...w, ...p }));
  const reset = useCallback(() => {
    setWork((w) => { if (w.shot) URL.revokeObjectURL(w.shot.url); if (w.cropUrl) URL.revokeObjectURL(w.cropUrl); return EMPTY; });
  }, []);

  /** Foto aus Kamera oder Datei übernehmen → Zuschnitt */
  const takeShot = (shot: Shot, rect: Rect) => {
    setWork((w) => { if (w.shot) URL.revokeObjectURL(w.shot.url); return { ...EMPTY, shot, rect }; });
    nav('/ritaglia');
  };

  const solve = (formula: string) => {
    const r = solveTask(formula);
    if (!r.ok) { update({ unsupported: r.reason, solution: null }); return; }
    update({ solution: r.solution, unsupported: null, formula });
    setHistory(addHistory({ task: formula, answer: r.solution.answer, kind: r.solution.kind }));
    nav('/soluzione');
  };

  return (
    <div className="min-h-[100dvh]" data-testid="mathlens-app">
      <Header lang={lang} onLang={onLang} />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 pb-16 pt-4 sm:px-6" style={{ paddingBottom: 'calc(4rem + var(--safe-bottom))' }}>
        <Routes>
          <Route path="/" element={<Home history={history} onWrite={() => { reset(); nav('/controlla'); }} onPick={takeShot} onOpen={(e) => { update({ ...EMPTY, formula: e.task }); nav('/controlla'); }} />} />
          <Route path="/scansiona" element={hydrated ? <ScanGate><Scan onShot={takeShot} /></ScanGate> : null} />
          <Route path="/ritaglia" element={work.shot ? <Crop work={work} onRect={(rect) => update({ rect })} onDone={(cropUrl, read) => { update({ cropUrl, read, formula: read.formula }); nav('/controlla'); }} /> : <Navigate to="/" replace />} />
          <Route path="/controlla" element={<Review work={work} onFormula={(formula) => update({ formula, unsupported: null })} onSolve={solve} />} />
          <Route path="/soluzione" element={work.solution ? <><SolutionView key={work.formula} sol={work.solution} /><button className="knopf knopf-3d bg-flaeche" onClick={() => { reset(); nav('/'); }} data-testid="nuovo-esercizio">{L('Neue Aufgabe', 'Nuovo esercizio')}</button></> : <Navigate to="/" replace />} />
          <Route path="/cronologia" element={<HistoryPage history={history} setHistory={setHistory} onOpen={(e) => { update({ ...EMPTY, formula: e.task }); nav('/controlla'); }} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// ───────────── Kopfzeile ─────────────

function Header({ lang, onLang }: { lang: Lang; onLang: (l: Lang) => void }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [dark, setDark] = useState(() => isDark());
  const toggleTheme = () => { const next = isDark() ? 'hell' : 'dunkel'; setTheme(next); applyTheme(next); setDark(next === 'dunkel'); };
  useEffect(() => { applyTheme(getTheme()); }, []);
  return (
    <header className="sticky top-0 z-30 border-b border-tinte/[0.06] bg-flaeche/90 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-4 sm:px-6">
        {pathname !== '/' ? (
          <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-tinte/[0.05]" onClick={() => (window.history.length > 1 ? nav(-1) : nav('/'))} aria-label={L('Zurück', 'Indietro')} data-testid="ml-zurueck"><ArrowLeft /></button>
        ) : (
          <a href={BASE} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-tinte/[0.05]" aria-label={L('Zurück zu Lernito', 'Torna a Lernito')}><ArrowLeft /></a>
        )}
        <button className="flex items-center gap-2" onClick={() => nav('/')} aria-label="MathLens">
          <LensLogo size={28} /><span className="font-display text-lg font-extrabold tracking-tight">MathLens</span>
        </button>
        <span className="flex-1" />
        <div className="flex rounded-xl bg-tinte/[0.05] p-0.5 text-sm font-bold" role="group" aria-label={L('Sprache', 'Lingua')}>
          {(['it', 'de'] as Lang[]).map((l) => (
            <button key={l} className={`rounded-lg px-2.5 py-1.5 ${lang === l ? 'bg-flaeche shadow-sm' : 'text-tinte/50'}`} aria-pressed={lang === l} onClick={() => onLang(l)} data-testid={`lingua-${l}`}>{l.toUpperCase()}</button>
          ))}
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-tinte/[0.05]" onClick={toggleTheme} aria-label={dark ? L('Helles Design', 'Tema chiaro') : L('Dunkles Design', 'Tema scuro')} data-testid="tema">{dark ? <Sun size={20} /> : <Moon size={20} />}</button>
        <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-tinte/[0.05]" onClick={() => nav('/cronologia')} aria-label={L('Verlauf', 'Cronologia')} data-testid="apri-cronologia"><Clock size={20} /></button>
      </div>
    </header>
  );
}

// ───────────── Start ─────────────

function useFilePicker(onShot: (s: Shot, r: Rect) => void) {
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const onFile = async (f?: File) => {
    if (!f) return;
    setError(null);
    try {
      const url = URL.createObjectURL(f);
      const img = new Image();
      img.src = url;
      await img.decode();
      onShot({ url, w: img.naturalWidth, h: img.naturalHeight, img }, { x: 0.04, y: 0.04, w: 0.92, h: 0.92 });
    } catch {
      setError(L('Dieses Bild kann ich nicht öffnen.', 'Non riesco ad aprire questa immagine.'));
    }
  };
  const input = <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} data-testid="ml-foto-input" />;
  return { open: () => ref.current?.click(), input, error };
}

function BigAction({ icon, title, sub, onClick, tone, testId }: { icon: ReactNode; title: string; sub: string; onClick: () => void; tone: string; testId: string }) {
  return (
    <button className="karte-3d flex items-center gap-4 p-4 text-left active:scale-[0.99]" onClick={onClick} data-testid={testId}>
      <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white ${tone}`}>{icon}</span>
      <span><span className="block font-display text-xl font-bold">{title}</span><span className="block text-tinte/60">{sub}</span></span>
    </button>
  );
}

function Home({ history, onWrite, onPick, onOpen }: { history: HistoryEntry[]; onWrite: () => void; onPick: (s: Shot, r: Rect) => void; onOpen: (e: HistoryEntry) => void }) {
  const nav = useNavigate();
  const picker = useFilePicker(onPick);
  return (
    <>
      <section className="relative overflow-hidden rounded-blob bg-gradient-to-br from-[#1E3A8A] to-[#0E7490] p-6 text-white shadow-karte">
        <span className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full border-[18px] border-white/10" aria-hidden />
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-75">{L('Hilf mir bei den Hausaufgaben', 'Aiutami con i compiti')}</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight tracking-tight">{L('Foto machen, prüfen, verstehen.', 'Scatta, controlla, capisci.')}</h1>
        <p className="mt-2 max-w-md opacity-90">{L('Fotografiere eine Matheaufgabe. Du kontrollierst die erkannte Formel und siehst Schritt für Schritt, wie man sie löst.', 'Fotografa un esercizio di matematica. Controlli la formula riconosciuta e vedi passo dopo passo come si risolve.')}</p>
      </section>
      <div className="flex flex-col gap-3">
        <BigAction icon={<ScanLine size={32} />} title={L('Scannen', 'Scansiona')} sub={L('Mit der Kamera', 'Con la fotocamera')} tone="bg-[#1E3A8A]" onClick={() => nav('/scansiona')} testId="azione-scansiona" />
        <BigAction icon={<ImagePlus size={32} />} title={L('Foto hochladen', 'Carica una foto')} sub={L('Aus der Galerie', 'Dalla galleria')} tone="bg-[#0E7490]" onClick={picker.open} testId="azione-carica" />
        <BigAction icon={<Keyboard size={32} />} title={L('Aufgabe eintippen', 'Scrivi l’esercizio')} sub={L('Mit der Mathe-Tastatur', 'Con la tastiera matematica')} tone="bg-lila-500" onClick={onWrite} testId="azione-scrivi" />
      </div>
      {picker.input}
      {picker.error && <Notice tone="warn">{picker.error}</Notice>}
      {history.length > 0 && (
        <section>
          <div className="mb-2 flex items-end justify-between"><h2 className="font-display text-lg font-bold">{L('Zuletzt', 'Recenti')}</h2><button className="text-sm font-bold text-himmel-700" onClick={() => nav('/cronologia')}>{L('Alle', 'Tutti')}</button></div>
          <ul className="flex flex-col gap-2">
            {history.slice(0, 3).map((e) => (
              <li key={e.id}><button className="karte-3d flex w-full items-center justify-between gap-3 px-4 py-3 text-left" onClick={() => onOpen(e)}>
                <FormulaView text={e.task} className="text-lg" /><span className="shrink-0 text-sm font-bold text-minze-700">{e.answer}</span>
              </button></li>
            ))}
          </ul>
        </section>
      )}
      <p className="flex items-start gap-2 text-sm text-tinte/55"><ShieldCheck size={18} className="mt-0.5 shrink-0" />{L('Fotos bleiben auf deinem Gerät: Sie werden nicht hochgeladen und nicht gespeichert. Der Verlauf speichert nur Aufgabe, Ergebnis und Datum.', 'Le foto restano sul tuo dispositivo: non vengono caricate né salvate. La cronologia salva solo esercizio, risultato e data.')}</p>
    </>
  );
}

// ───────────── Kamera ─────────────

/** Kinder in Lernito: Kamera erst nach Freigabe mit Eltern-PIN. Ohne Kinderprofil keine Sperre. */
function ScanGate({ children }: { children: ReactNode }) {
  const child = useApp((s) => s.profiles.some((p) => p.id === s.activeProfileId));
  const allowed = useApp((s) => !!s.parent.consentCamera);
  const hasPin = useApp((s) => !!s.parent.pinHash);
  const setParent = useApp((s) => s.setParent);
  const nav = useNavigate();
  const [step, setStep] = useState<'info' | 'pin'>('info');
  if (!child || allowed) return <>{children}</>;
  const grant = () => setParent({ consentCamera: true, consentUpdatedAt: new Date().toISOString() });
  return (
    <Modal open onClose={() => nav('/')} title={L('Kamera einschalten', 'Attiva la fotocamera')} labelledBy="ml-kamera-titel">
      {step === 'info' ? (
        <div className="flex flex-col gap-4" data-testid="ml-kamera-einwilligung">
          <p>{L('Für Kinderprofile in Lernito gibt ein Erwachsener die Kamera frei. Das Foto wird nur auf diesem Gerät gelesen, nicht hochgeladen und nicht gespeichert.', 'Per i profili dei bambini in Lernito la fotocamera la attiva un adulto. La foto viene letta solo su questo dispositivo: non viene caricata né salvata.')}</p>
          <button className="knopf kante-himmel bg-himmel-500 text-white" onClick={() => setStep('pin')} data-testid="ml-kamera-eltern">{L('Ein Erwachsener erlaubt es', 'Un adulto lo consente')}</button>
          <button className="text-base font-semibold text-tinte/60 underline" onClick={() => nav('/')}>{L('Jetzt nicht', 'Non ora')}</button>
        </div>
      ) : hasPin ? <PinLogin onDone={grant} /> : <PinSetup onDone={grant} showIntro={false} />}
    </Modal>
  );
}

function Scan({ onShot }: { onShot: (s: Shot, r: Rect) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [state, setState] = useState<'starting' | 'live' | CameraError>('starting');
  const nav = useNavigate();
  const picker = useFilePicker(onShot);
  useEffect(() => {
    let alive = true;
    openCamera().then((s) => {
      if (!alive) { stopCamera(s); return; }
      stream.current = s;
      if (video.current) { video.current.srcObject = s; void video.current.play().catch(() => {}); }
      setState('live');
    }).catch((e: CameraError) => alive && setState(e));
    return () => { alive = false; stopCamera(stream.current); };
  }, []);
  const capture = () => {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const c = grabFrame(v);
    c.toBlob((b) => {
      if (!b) return;
      stopCamera(stream.current);
      onShot({ url: URL.createObjectURL(b), w: c.width, h: c.height, img: c }, FRAME);
    }, 'image/jpeg', 0.92);
  };
  if (state !== 'starting' && state !== 'live') {
    return (
      <div className="flex flex-col gap-4" data-testid="kamera-fehler">
        <Notice tone="warn"><span className="flex items-start gap-2"><AlertTriangle size={20} className="mt-0.5 shrink-0" />
          {state === 'denied' ? L('Der Zugriff auf die Kamera wurde nicht erlaubt. Du kannst ihn in den Einstellungen des Browsers erlauben oder einfach ein Foto hochladen oder die Aufgabe eintippen.', 'L’accesso alla fotocamera non è stato consentito. Puoi abilitarlo nelle impostazioni del browser, oppure caricare una foto o scrivere l’esercizio.')
            : L('Hier ist keine Kamera verfügbar. Lade ein Foto hoch oder tippe die Aufgabe ein.', 'Qui non c’è una fotocamera disponibile. Carica una foto o scrivi l’esercizio.')}
        </span></Notice>
        <BigAction icon={<ImagePlus size={32} />} title={L('Foto hochladen', 'Carica una foto')} sub={L('Aus der Galerie', 'Dalla galleria')} tone="bg-[#0E7490]" onClick={picker.open} testId="fallback-carica" />
        <BigAction icon={<Keyboard size={32} />} title={L('Aufgabe eintippen', 'Scrivi l’esercizio')} sub={L('Mit der Mathe-Tastatur', 'Con la tastiera matematica')} tone="bg-lila-500" onClick={() => nav('/controlla', { replace: true })} testId="fallback-scrivi" />
        {picker.input}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: '3 / 4' }}>
        <video ref={video} playsInline muted className="absolute inset-0 h-full w-full object-cover" data-testid="kamera-video" />
        <div className="pointer-events-none absolute rounded-xl border-[3px] border-white" style={{ left: `${FRAME.x * 100}%`, top: `${FRAME.y * 100}%`, width: `${FRAME.w * 100}%`, height: `${FRAME.h * 100}%`, boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} />
        <p className="absolute inset-x-0 top-4 text-center text-sm font-bold text-white drop-shadow">{L('Nur eine Aufgabe in den Rahmen', 'Inquadra un solo esercizio nel riquadro')}</p>
      </div>
      <button className="knopf kante-himmel mx-auto h-16 w-16 rounded-full bg-himmel-500 p-0 text-white" onClick={capture} disabled={state !== 'live'} aria-label={L('Foto aufnehmen', 'Scatta')} data-testid="scatta"><Camera size={28} /></button>
    </div>
  );
}

// ───────────── Zuschnitt + Texterkennung ─────────────

function Crop({ work, onRect, onDone }: { work: Work; onRect: (r: Rect) => void; onDone: (cropUrl: string, read: ReadAnalysis) => void }) {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const shot = work.shot!;
  const run = async () => {
    setBusy(true); setError(null);
    try {
      const blob = await cropToBlob(shot.img, work.rect, shot.w, shot.h);
      const { recognize } = await import('./recognize');
      const r = await recognize(blob, setProgress);
      onDone(URL.createObjectURL(blob), r);
    } catch {
      setError(L('Die Texterkennung hat nicht geklappt. Du kannst die Aufgabe eintippen.', 'Il riconoscimento non ha funzionato. Puoi scrivere l’esercizio a mano.'));
      setBusy(false);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div><h1 className="font-display text-2xl font-bold">{L('Ausschnitt wählen', 'Ritaglia l’esercizio')}</h1><p className="text-tinte/65">{L('Zieh den Rahmen so, dass nur eine Aufgabe darin ist.', 'Sposta il riquadro in modo che contenga un solo esercizio.')}</p></div>
      <Cropper src={shot.url} rect={work.rect} onChange={onRect} />
      {busy ? (
        <div className="flex flex-col items-center gap-2" role="status" data-testid="riconoscimento">
          <p className="font-bold">{L('Ich lese die Formel …', 'Sto leggendo la formula…')}</p>
          <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-tinte/[0.08]"><div className="h-full rounded-full bg-himmel-500 transition-all" style={{ width: `${Math.round(progress * 100)}%` }} /></div>
          <p className="text-center text-sm text-tinte/55">{L('Beim ersten Mal wird die Texterkennung geladen (ca. 7 MB). Danach klappt es auch offline.', 'La prima volta si scarica il riconoscimento (circa 7 MB). Dopo funziona anche offline.')}</p>
        </div>
      ) : (
        <button className="knopf kante-himmel bg-himmel-500 text-white" onClick={run} data-testid="riconosci"><ScanLine size={20} /> {L('Formel erkennen', 'Riconosci la formula')}</button>
      )}
      {error && <Notice tone="warn">{error}</Notice>}
    </div>
  );
}

// ───────────── Formel prüfen ─────────────

function Review({ work, onFormula, onSolve }: { work: Work; onFormula: (f: string) => void; onSolve: (f: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const caret = useRef(work.formula.length);
  const [system, setSystem] = useState(false);
  const f = work.formula;
  const parsable = f.trim() !== '' && canParse(f);
  const unresolved = hasUnresolvedSymbols(f);
  const key = (a: KeyAction) => {
    const el = input.current;
    const pos = el ? el.selectionStart ?? f.length : caret.current;
    const r = applyKey(f, pos, a);
    onFormula(r.text);
    caret.current = r.caret;
    requestAnimationFrame(() => { if (el) { el.focus({ preventScroll: true }); el.setSelectionRange(r.caret, r.caret); } });
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold">{work.cropUrl ? L('Stimmt die Formel?', 'La formula è giusta?') : L('Aufgabe eintippen', 'Scrivi l’esercizio')}</h1>
        {work.cropUrl && <p className="text-tinte/65">{L('Vergleiche mit dem Foto und korrigiere, bevor gerechnet wird.', 'Confrontala con la foto e correggila prima del calcolo.')}</p>}
      </div>
      {work.cropUrl && <img src={work.cropUrl} alt={L('Ausschnitt', 'Ritaglio')} className="max-h-40 self-start rounded-xl object-contain ring-1 ring-tinte/10" data-testid="ritaglio" />}
      {work.read?.empty && <Notice tone="warn">{L('Auf dem Ausschnitt habe ich keine Formel gefunden. Tippe sie unten ein oder versuche ein schärferes Foto.', 'Nel ritaglio non ho trovato una formula. Scrivila qui sotto o prova con una foto più nitida.')}</Notice>}
      {work.read && work.read.ambiguities.length > 0 && (
        <div className="flex flex-col gap-2" data-testid="ambiguita">
          {work.read.ambiguities.map((a) => <Notice key={a.id} tone="warn"><span className="flex items-start gap-2"><AlertTriangle size={18} className="mt-0.5 shrink-0" />{a.message}</span></Notice>)}
        </div>
      )}
      <div className="karte-3d flex flex-col gap-3 p-4">
        <div className="flex gap-2">
          <input ref={input} value={f} onChange={(e) => { onFormula(e.target.value); caret.current = e.target.selectionStart ?? e.target.value.length; }}
            onSelect={(e) => { caret.current = (e.target as HTMLInputElement).selectionStart ?? f.length; }}
            inputMode={system ? 'text' : 'none'} autoComplete="off" spellCheck={false} aria-label={L('Formel', 'Formula')}
            placeholder={L('z. B. 3(2x − 4) = 18', 'ad es. 3(2x − 4) = 18')}
            className="min-w-0 flex-1 rounded-xl bg-creme px-3 py-3 font-display text-xl font-bold tracking-wide ring-1 ring-tinte/10 focus:outline-none focus:ring-2 focus:ring-himmel-500" data-testid="formula" />
          <button className={`flex w-12 shrink-0 items-center justify-center rounded-xl ${system ? 'bg-himmel-500 text-white' : 'bg-tinte/[0.05]'}`} onClick={() => { setSystem((s) => !s); input.current?.focus(); }} aria-pressed={system} aria-label={L('Gerätetastatur', 'Tastiera del dispositivo')}><Keyboard size={20} /></button>
          {f && <button className="flex w-12 shrink-0 items-center justify-center rounded-xl bg-tinte/[0.05]" onClick={() => key({ action: 'clear' })} aria-label={L('Alles löschen', 'Cancella tutto')}><X size={20} /></button>}
        </div>
        <div className="flex min-h-[3.5rem] items-center justify-center rounded-xl bg-tinte/[0.03] px-3 py-2 text-2xl" aria-live="polite">
          {f.trim() === '' ? <span className="text-base text-tinte/40">{L('Hier erscheint die Formel', 'Qui compare la formula')}</span>
            : parsable ? <FormulaView text={f} /> : <span className="text-base text-koralle-700" data-testid="formula-errore">{unresolved ? L('Bitte die markierten Zeichen korrigieren.', 'Correggi i simboli segnalati.') : /[a-wyz]/i.test(f) ? L('Hier stehen Buchstaben außer x: das kann ich noch nicht lösen.', 'Ci sono lettere diverse da x: questo non lo so ancora risolvere.') : L('Die Formel ist noch nicht vollständig.', 'La formula non è ancora completa.')}</span>}
        </div>
        <MathKeyboard onKey={key} />
      </div>
      {work.unsupported && (
        <Notice tone="warn"><span className="flex items-start gap-2" data-testid="non-supportato"><AlertTriangle size={18} className="mt-0.5 shrink-0" /><span><b>{L('Das kann ich noch nicht lösen.', 'Questo non lo so ancora risolvere.')}</b> {work.unsupported}</span></span></Notice>
      )}
      <button className="knopf kante-himmel bg-himmel-500 text-white" disabled={!f.trim()} onClick={() => onSolve(f)} data-testid="conferma">
        {L('Formel bestätigen und lösen', 'Conferma e risolvi')}
      </button>
    </div>
  );
}

// ───────────── Verlauf ─────────────

function HistoryPage({ history, setHistory, onOpen }: { history: HistoryEntry[]; setHistory: (h: HistoryEntry[]) => void; onOpen: (e: HistoryEntry) => void }) {
  const [confirm, setConfirm] = useState(false);
  const fmt = new Intl.DateTimeFormat(getLang() === 'it' ? 'it-IT' : 'de-DE', { dateStyle: 'medium', timeStyle: 'short' });
  return (
    <div className="flex flex-col gap-4" data-testid="cronologia">
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-display text-2xl font-bold">{L('Verlauf', 'Cronologia')}</h1>
        {history.length > 0 && <button className="knopf knopf-3d bg-flaeche px-3 py-2 text-sm text-koralle-700" onClick={() => setConfirm(true)} data-testid="cancella-tutto"><Trash2 size={16} /> {L('Alles löschen', 'Cancella tutto')}</button>}
      </div>
      {history.length === 0 ? <p className="text-tinte/60">{L('Noch keine Aufgaben. Gelöste Aufgaben erscheinen hier, nur auf diesem Gerät.', 'Ancora nessun esercizio. Quelli risolti compaiono qui, solo su questo dispositivo.')}</p> : (
        <ul className="flex flex-col gap-2">
          {history.map((e) => (
            <li key={e.id} className="karte-3d flex items-center gap-2 p-2 pl-4" data-testid="voce-cronologia">
              <button className="flex min-w-0 flex-1 flex-col items-start gap-0.5 py-1 text-left" onClick={() => onOpen(e)}>
                <FormulaView text={e.task} className="text-lg" />
                <span className="text-sm text-tinte/55">{e.kind} · {fmt.format(new Date(e.date))}</span>
                <span className="font-bold text-minze-700">{e.answer}</span>
              </button>
              <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-tinte/50 hover:bg-koralle-100 hover:text-koralle-700" onClick={() => setHistory(removeHistory(e.id))} aria-label={L('Eintrag löschen', 'Elimina voce')} data-testid="elimina-voce"><Trash2 size={18} /></button>
            </li>
          ))}
        </ul>
      )}
      <Modal open={confirm} onClose={() => setConfirm(false)} title={L('Ganzen Verlauf löschen?', 'Cancellare tutta la cronologia?')}>
        <div className="flex flex-col gap-3">
          <p>{L('Alle gespeicherten Aufgaben werden von diesem Gerät gelöscht.', 'Tutti gli esercizi salvati verranno cancellati da questo dispositivo.')}</p>
          <button className="knopf bg-koralle-500 text-white" onClick={() => { setHistory(clearHistory()); setConfirm(false); }} data-testid="conferma-cancella">{L('Löschen', 'Cancella')}</button>
        </div>
      </Modal>
    </div>
  );
}

export { chooseLang };
