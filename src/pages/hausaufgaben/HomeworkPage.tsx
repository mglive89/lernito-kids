import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, ChevronRight, ImagePlus, Lightbulb, ListChecks, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { Confetti, Modal, Notice, SpeakButton, TopBar } from '../../components/ui';
import { Lino } from '../../components/Lino';
import { PinLogin, PinSetup } from '../../components/ParentAuth';
import { L } from '../../i18n';
import { sfx } from '../../lib/sound';
import { checkAnswer, solveTask, splitTasks } from '../../hausaufgaben/solve';
import type { Solution } from '../../hausaufgaben/types';
import { StepGrid } from './StepGrid';

type Mode = 'start' | 'reading' | 'found' | 'explain';

const EXAMPLES = ['345 + 278', '503 − 278', '457 : 3', '24 × 13', '2 + 3 × (4 − 1)', '1/2 + 1/3', '7 + ? = 15', '3x + 5 = 20'];

/** Hausaufgaben-Hilfe Mathe: Aufgabe fotografieren oder abtippen, Puppy erklärt den Lösungsweg. */
export function HomeworkPage() {
  const { progress, settings } = useActiveProfile();
  const cameraAllowed = useApp((s) => !!s.parent.consentCamera);
  const [mode, setMode] = useState<Mode>('start');
  const [typed, setTyped] = useState('');
  const [tasks, setTasks] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [cameFromPhoto, setCameFromPhoto] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const pending = useRef<'camera' | 'gallery' | null>(null);

  // Foto-Vorschau wieder freigeben
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);
  useEffect(() => () => { void import('../../hausaufgaben/ocr').then((m) => m.releaseOcr()); }, []);

  const openPicker = (which: 'camera' | 'gallery') => {
    setError(null);
    if (!cameraAllowed) { pending.current = which; setConsentOpen(true); return; }
    (which === 'camera' ? cameraRef : galleryRef).current?.click();
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null); setInfo(null);
    setPhoto((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file); });
    setMode('reading');
    setReadProgress(0);
    try {
      const { readPhoto } = await import('../../hausaufgaben/ocr');
      const text = await readPhoto(file, setReadProgress);
      const found = splitTasks(text);
      setTasks(found.length ? found : ['']);
      if (!found.length) setError(L('Ich habe auf dem Foto keine Rechenaufgabe gefunden. Tippe sie einfach unten ein oder versuche ein schärferes Foto.', 'Non ho trovato nessun esercizio nella foto. Scrivilo qui sotto oppure prova con una foto più nitida.'));
      setMode('found');
    } catch {
      setTasks(['']);
      setError(L('Das Foto konnte ich nicht lesen. Tippe die Aufgabe einfach ein.', 'Non sono riuscito a leggere la foto. Scrivi l’esercizio qui sotto.'));
      setMode('found');
    }
  };

  const explain = (raw: string, fromPhoto: boolean) => {
    const r = solveTask(raw);
    if (!r.ok) { setError(r.reason); return; }
    sfx.tap();
    setError(null);
    setSolution(r.solution);
    setCameFromPhoto(fromPhoto);
    setMode('explain');
    window.scrollTo({ top: 0 });
  };

  const submitTyped = (e: FormEvent) => { e.preventDefault(); if (typed.trim()) explain(typed, false); };

  const reset = () => {
    setMode('start'); setSolution(null); setTasks([]); setError(null); setInfo(null);
    setPhoto((old) => { if (old) URL.revokeObjectURL(old); return null; });
  };

  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Hausaufgaben-Hilfe', 'Aiuto compiti')} back={mode === 'explain' ? undefined : -1} stars={progress.stars}
        right={mode !== 'start' ? <button className="knopf knopf-3d bg-flaeche px-3 py-2 text-sm" onClick={mode === 'explain' && cameFromPhoto ? () => setMode('found') : reset} data-testid="hausaufgabe-zurueck">
          <RotateCcw size={18} /> {mode === 'explain' && cameFromPhoto ? L('Andere Aufgabe', 'Altro esercizio') : L('Neue Aufgabe', 'Nuovo esercizio')}
        </button> : undefined} />
      <main className="seite flex max-w-3xl flex-col gap-5 pt-4">
        {mode === 'start' && (
          <>
            <section className="relative overflow-hidden rounded-blob bg-gradient-to-br from-himmel-600 to-himmel-500 p-5 text-white shadow-karte sm:p-7">
              <span className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/[0.08]" aria-hidden />
              <div className="relative flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-75">{L('Mathematik', 'Matematica')}</p>
                  <h1 className="font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{L('Hilfe bei den Hausaufgaben', 'Aiuto per i compiti')}</h1>
                  <p className="mt-1 text-base opacity-90 sm:text-lg">{L('Fotografiere eine Aufgabe oder tippe sie ein. Puppy erklärt dir Schritt für Schritt, wie du sie löst.', 'Fotografa un esercizio o scrivilo. Puppy ti spiega passo dopo passo come risolverlo.')}</p>
                </div>
                <span className="hidden shrink-0 sm:block" aria-hidden><Lino mood="denken" size={110} /></span>
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <button className="karte-3d flex items-center gap-4 p-4 text-left" onClick={() => openPicker('camera')} data-testid="foto-machen">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-himmel-500 text-white"><Camera size={28} /></span>
                <span><span className="block font-display text-lg font-bold">{L('Foto machen', 'Scatta una foto')}</span><span className="block text-sm text-tinte/60">{L('Mit der Kamera', 'Con la fotocamera')}</span></span>
              </button>
              <button className="karte-3d flex items-center gap-4 p-4 text-left" onClick={() => openPicker('gallery')} data-testid="foto-waehlen">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lila-500 text-white"><ImagePlus size={28} /></span>
                <span><span className="block font-display text-lg font-bold">{L('Foto auswählen', 'Scegli una foto')}</span><span className="block text-sm text-tinte/60">{L('Aus der Galerie', 'Dalla galleria')}</span></span>
              </button>
            </div>
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} data-testid="foto-kamera-input" />
            <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => { void onFile(e.target.files?.[0]); e.target.value = ''; }} data-testid="foto-input" />
            {info && <Notice tone="ok">{info}</Notice>}

            <form className="karte-3d flex flex-col gap-3 p-4" onSubmit={submitTyped}>
              <label htmlFor="aufgabe-tippen" className="font-display text-lg font-bold">{L('Oder tippe die Aufgabe ein', 'Oppure scrivi l’esercizio')}</label>
              <div className="flex gap-2">
                <input id="aufgabe-tippen" value={typed} onChange={(e) => setTyped(e.target.value)} inputMode="text" autoComplete="off" spellCheck={false}
                  placeholder={L('z. B. 345 + 278', 'ad es. 345 + 278')} className="min-w-0 flex-1 rounded-2xl bg-creme px-4 py-3 font-display text-xl font-bold tracking-wide ring-1 ring-tinte/10 focus:outline-none focus:ring-2 focus:ring-himmel-500" data-testid="aufgabe-eingabe" />
                <button className="knopf kante-himmel bg-himmel-500 px-4 text-white" disabled={!typed.trim()} data-testid="aufgabe-erklaeren"><Sparkles size={20} /> <span className="hidden sm:inline">{L('Erklären', 'Spiega')}</span></button>
              </div>
              <div className="flex flex-wrap gap-2" aria-label={L('Beispiele', 'Esempi')}>
                {EXAMPLES.map((ex) => (
                  <button key={ex} type="button" className="rounded-xl bg-tinte/[0.05] px-3 py-1.5 text-sm font-bold text-tinte/70 transition hover:bg-tinte/10" onClick={() => setTyped(ex)}>{ex}</button>
                ))}
              </div>
              {error && <Notice tone="warn">{error}</Notice>}
            </form>

            <Notice>
              <span className="flex items-start gap-2"><Lightbulb size={20} className="mt-0.5 shrink-0" />
                <span>{L('Tipp: Fotografiere die Aufgabe gerade von oben und mit gutem Licht. Gedruckte Aufgaben klappen am besten. Prüfe danach, ob ich alles richtig gelesen habe.', 'Consiglio: fotografa l’esercizio dritto dall’alto e con buona luce. Gli esercizi stampati funzionano meglio. Poi controlla che io abbia letto tutto giusto.')}</span>
              </span>
            </Notice>
          </>
        )}

        {mode === 'reading' && (
          <div className="karte-3d flex flex-col items-center gap-4 p-6 text-center" role="status" data-testid="foto-lesen">
            {photo && <img src={photo} alt={L('Dein Foto', 'La tua foto')} className="max-h-56 rounded-2xl object-contain ring-1 ring-tinte/10" />}
            <Lino mood="denken" size={90} />
            <p className="font-display text-xl font-bold">{L('Puppy liest deine Aufgabe …', 'Puppy sta leggendo il tuo esercizio…')}</p>
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-tinte/[0.08]">
              <motion.div className="h-full rounded-full bg-himmel-500" animate={{ width: `${Math.round(readProgress * 100)}%` }} />
            </div>
            <p className="text-sm text-tinte/60">{L('Beim ersten Mal lädt Puppy die Texterkennung (etwa 7 MB). Danach geht es schneller, auch ohne Internet.', 'La prima volta Puppy scarica il lettore di testo (circa 7 MB). Poi è più veloce, anche senza Internet.')}</p>
          </div>
        )}

        {mode === 'found' && (
          <>
            <div className="flex items-start gap-4">
              {photo && <img src={photo} alt={L('Dein Foto', 'La tua foto')} className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-1 ring-tinte/10 sm:h-36 sm:w-36" />}
              <div>
                <p className="eyebrow">{L('Gelesen', 'Letto')}</p>
                <h1 className="font-display text-2xl font-bold tracking-tight">{tasks.filter(Boolean).length > 1 ? L('Diese Aufgaben habe ich gefunden', 'Ho trovato questi esercizi') : L('Stimmt die Aufgabe?', 'L’esercizio è giusto?')}</h1>
                <p className="text-tinte/70">{L('Vergleiche mit deinem Blatt und verbessere, wenn ich mich verlesen habe. Dann tippe auf „Erklären“.', 'Confronta con il tuo foglio e correggi se ho letto male. Poi tocca «Spiega».')}</p>
              </div>
            </div>
            {error && <Notice tone="warn">{error}</Notice>}
            <ul className="flex flex-col gap-3" data-testid="gefundene-aufgaben">
              {tasks.map((t, i) => (
                <li key={i} className="karte-3d flex items-center gap-2 p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-himmel-100 font-display font-bold text-himmel-700">{i + 1}</span>
                  <input value={t} onChange={(e) => setTasks((ts) => ts.map((x, k) => (k === i ? e.target.value : x)))} aria-label={L(`Aufgabe ${i + 1}`, `Esercizio ${i + 1}`)} spellCheck={false} autoComplete="off"
                    className="min-w-0 flex-1 rounded-xl bg-creme px-3 py-2.5 font-display text-lg font-bold tracking-wide ring-1 ring-tinte/10 focus:outline-none focus:ring-2 focus:ring-himmel-500" data-testid={`gefunden-${i}`}
                    placeholder={L('Aufgabe eintippen', 'Scrivi l’esercizio')} />
                  <button className="knopf kante-himmel bg-himmel-500 px-3 py-2.5 text-white" disabled={!t.trim()} onClick={() => explain(t, true)} data-testid={`erklaeren-${i}`} aria-label={L('Erklären', 'Spiega')}>
                    <span className="hidden sm:inline">{L('Erklären', 'Spiega')}</span> <ChevronRight size={20} />
                  </button>
                </li>
              ))}
            </ul>
            <button className="self-start text-base font-semibold text-himmel-700 underline" onClick={() => setTasks((ts) => [...ts, ''])}>{L('+ Aufgabe hinzufügen', '+ Aggiungi un esercizio')}</button>
          </>
        )}

        {mode === 'explain' && solution && <Explanation key={solution.task} sol={solution} speak={settings.speech} />}
      </main>

      <CameraConsentModal open={consentOpen} onDone={(ok) => {
        setConsentOpen(false);
        if (ok) setInfo(L('Super, die Kamera ist freigegeben! Tippe jetzt noch einmal auf „Foto machen“.', 'Perfetto, la fotocamera è attiva! Ora tocca di nuovo «Scatta una foto».'));
        pending.current = null;
      }} />
    </div>
  );
}

/** Lösungsweg: Schritte nacheinander aufdecken, am Ende das Ergebnis. */
function Explanation({ sol, speak }: { sol: Solution; speak: boolean }) {
  const [shown, setShown] = useState(1);
  const [guess, setGuess] = useState('');
  const [guessResult, setGuessResult] = useState<boolean | null>(null);
  const all = shown >= sol.steps.length;
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (shown > 1) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [shown]);

  const tryGuess = (e: FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;
    const ok = checkAnswer(sol, guess);
    setGuessResult(ok);
    if (ok) { sfx.correct(); setShown(sol.steps.length); } else sfx.tryAgain();
  };

  return (
    <div className="flex flex-col gap-4" data-testid="erklaerung">
      <header className="rounded-blob bg-himmel-100 p-5">
        <p className="eyebrow text-himmel-700">{sol.kind}</p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl" data-testid="erklaerung-aufgabe">{sol.task}</h1>
        {sol.check && (
          <p className={`mt-2 flex items-center gap-2 font-semibold ${sol.check.correct ? 'text-minze-700' : 'text-koralle-700'}`} data-testid="blatt-kontrolle">
            {sol.check.correct ? <Check size={20} /> : <X size={20} />}
            {sol.check.correct
              ? L(`Auf dem Blatt steht ${sol.check.written}: das ist richtig!`, `Sul foglio c’è scritto ${sol.check.written}: è giusto!`)
              : L(`Auf dem Blatt steht ${sol.check.written}. Das stimmt noch nicht – schau dir den Lösungsweg an.`, `Sul foglio c’è scritto ${sol.check.written}. Non è ancora giusto: guarda come si risolve.`)}
          </p>
        )}
      </header>

      {!sol.noValue && !all && (
        <form className="karte-3d flex flex-col gap-2 p-4" onSubmit={tryGuess}>
          <label htmlFor="eigenes-ergebnis" className="font-bold">{L('Hast du schon ein Ergebnis? Prüfe es!', 'Hai già un risultato? Controllalo!')}</label>
          <div className="flex gap-2">
            <input id="eigenes-ergebnis" value={guess} onChange={(e) => { setGuess(e.target.value); setGuessResult(null); }} autoComplete="off" inputMode="text"
              className="min-w-0 flex-1 rounded-xl bg-creme px-3 py-2.5 font-display text-lg font-bold ring-1 ring-tinte/10 focus:outline-none focus:ring-2 focus:ring-himmel-500" data-testid="eigenes-ergebnis" />
            <button className="knopf bg-flaeche knopf-3d px-4" data-testid="ergebnis-pruefen"><ListChecks size={20} /> {L('Prüfen', 'Controlla')}</button>
          </div>
          {guessResult === false && <Notice tone="warn">{L('Noch nicht ganz. Schau dir Schritt für Schritt an, wie es geht.', 'Non ancora. Guarda passo dopo passo come si fa.')}</Notice>}
        </form>
      )}

      <ol className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {sol.steps.slice(0, shown).map((s, i) => (
            <motion.li key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="karte-3d flex flex-col gap-3 p-4 sm:p-5" data-testid={`schritt-${i}`}>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-himmel-500 font-display font-bold text-white">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-lg font-bold leading-snug sm:text-xl">{s.title}</h2>
                  {s.text && <p className="mt-1 text-base text-tinte/80 sm:text-lg">{s.text}</p>}
                </div>
                {speak && <SpeakButton text={[s.title, s.text].filter(Boolean).join('. ')} />}
              </div>
              {s.grid && <StepGrid grid={s.grid} />}
              {s.expr && <p className="self-start rounded-xl bg-creme px-4 py-2 font-display text-xl font-bold tracking-wide ring-1 ring-tinte/[0.06]">{s.expr}</p>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      <div ref={endRef} />

      {!all ? (
        <div className="sticky bottom-3 z-10 flex gap-2" style={{ marginBottom: 'var(--safe-bottom)' }}>
          <button className="knopf kante-himmel flex-1 bg-himmel-500 text-white" onClick={() => setShown((n) => n + 1)} data-testid="naechster-schritt">
            {L('Nächster Schritt', 'Passo successivo')} <ChevronRight size={20} />
          </button>
          <button className="knopf knopf-3d bg-flaeche" onClick={() => setShown(sol.steps.length)} data-testid="alle-schritte">{L('Alle zeigen', 'Mostra tutti')}</button>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative flex items-center gap-4 overflow-hidden rounded-blob bg-minze-500 p-5 text-white shadow-karte" data-testid="ergebnis">
          <Confetti show={guessResult === true} />
          <span className="shrink-0" aria-hidden><Lino mood="freude" size={80} /></span>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] opacity-80">{guessResult === true ? L('Richtig gerechnet!', 'Hai fatto giusto!') : L('Ergebnis', 'Risultato')}</p>
            <p className="font-display text-3xl font-extrabold" data-testid="ergebnis-wert">{sol.answer}</p>
            <p className="opacity-90">{L('Jetzt schreib den Lösungsweg in dein Heft – du schaffst das!', 'Ora scrivi i passaggi sul quaderno: ce la fai!')}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/** Eltern geben die Kamera frei (PIN). */
function CameraConsentModal({ open, onDone }: { open: boolean; onDone: (ok: boolean) => void }) {
  const hasPin = useApp((s) => !!s.parent.pinHash);
  const setParent = useApp((s) => s.setParent);
  const [step, setStep] = useState<'info' | 'pin'>('info');
  useEffect(() => { if (open) setStep('info'); }, [open]);
  const grant = () => {
    setParent({ consentCamera: true, consentUpdatedAt: new Date().toISOString() });
    onDone(true);
  };
  return (
    <Modal open={open} onClose={() => onDone(false)} title={L('Kamera einschalten', 'Attiva la fotocamera')} labelledBy="kamera-titel">
      {step === 'info' ? (
        <div className="flex flex-col gap-4" data-testid="kamera-einwilligung">
          <p className="text-lg">{L('Mit der Kamera kannst du eine Mathe-Aufgabe fotografieren. Puppy liest sie und erklärt dir, wie du sie löst.', 'Con la fotocamera puoi fotografare un esercizio di matematica. Puppy lo legge e ti spiega come risolverlo.')}</p>
          <Notice>
            <span className="flex items-start gap-2"><ShieldCheck size={20} className="mt-0.5 shrink-0" />
              <span>{L('Für Erwachsene: Das Foto wird nur auf diesem Gerät gelesen. Es wird nicht hochgeladen und nicht gespeichert. Sie können die Kamera im Elternbereich jederzeit wieder ausschalten.', 'Per gli adulti: la foto viene letta solo su questo dispositivo. Non viene caricata né salvata. Potete disattivare la fotocamera in qualsiasi momento nell’area genitori.')}</span>
            </span>
          </Notice>
          <button className="knopf kante-himmel bg-himmel-500 text-white" onClick={() => setStep('pin')} data-testid="kamera-eltern">
            {L('Ein Erwachsener erlaubt es', 'Un adulto lo consente')}
          </button>
          <button className="text-base font-semibold text-tinte/60 underline" onClick={() => onDone(false)}>{L('Jetzt nicht', 'Non ora')}</button>
        </div>
      ) : hasPin ? (
        <PinLogin onDone={grant} />
      ) : (
        <PinSetup onDone={grant} showIntro={false} />
      )}
    </Modal>
  );
}
