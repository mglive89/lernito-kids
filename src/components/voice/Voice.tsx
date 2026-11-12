import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, ShieldCheck } from 'lucide-react';
import { useApp } from '../../store/useApp';
import { finishListening, listenOnce, recognitionSupported, stopListening, type ListenError } from '../../lib/listen';
import { stopSpeaking } from '../../lib/speech';
import { Modal, Notice } from '../ui';
import { PinLogin, PinSetup } from '../ParentAuth';
import { L } from '../../i18n';

/** Darf das Mikrofon genutzt werden? (Eltern-Einwilligung auf diesem Gerät) */
export function useVoiceAllowed(): boolean {
  return useApp((s) => !!s.parent.consentVoice);
}

export function errorText(e: ListenError): string {
  switch (e) {
    case 'denied': return L('Das Mikrofon ist blockiert. Erlaube es in den Browser-Einstellungen (Schloss-Symbol neben der Adresse).', 'Il microfono è bloccato. Consentilo nelle impostazioni del browser (lucchetto accanto all’indirizzo).');
    case 'no-speech': return L('Ich habe nichts gehört. Sprich etwas lauter und näher am Gerät.', 'Non ho sentito niente. Parla un po’ più forte e più vicino al dispositivo.');
    case 'no-mic': return L('Es wurde kein Mikrofon gefunden.', 'Non è stato trovato nessun microfono.');
    case 'network': return L('Die Spracherkennung braucht gerade Internet. Bitte später nochmal versuchen.', 'Il riconoscimento vocale ha bisogno di Internet. Riprova più tardi.');
    case 'unsupported': return L('Dieser Browser kann leider keine Sprache erkennen.', 'Questo browser non riesce a riconoscere la voce.');
    case 'aborted': return '';
    default: return L('Das hat nicht geklappt. Versuch es nochmal.', 'Non ha funzionato. Riprova.');
  }
}

/**
 * Einmal zuhören. Kümmert sich um Einwilligung (Eltern) und Fehler.
 * listen() liefert die erkannten Alternativen oder null.
 */
export function useListen() {
  const allowed = useVoiceAllowed();
  const [state, setState] = useState<'idle' | 'listening'>('idle');
  const [error, setError] = useState<string | null>(null);
  /** Was gerade gehört wird (live) */
  const [live, setLive] = useState('');
  const [consentOpen, setConsentOpen] = useState(false);
  const pendingLocale = useRef<string | null>(null);
  const resolver = useRef<((v: string[] | null) => void) | null>(null);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; stopListening(); }, []);

  const run = useCallback(async (locale: string): Promise<string[] | null> => {
    setError(null);
    setLive('');
    stopSpeaking();
    setState('listening');
    try {
      const r = await listenOnce(locale, { onInterim: (t) => { if (mounted.current) setLive(t); } });
      return r.alternatives;
    } catch (e) {
      if (mounted.current) setError(errorText(e as ListenError) || null);
      return null;
    } finally {
      if (mounted.current) { setState('idle'); setLive(''); }
    }
  }, []);

  const listen = useCallback((locale: string): Promise<string[] | null> => {
    if (!allowed) {
      pendingLocale.current = locale;
      setConsentOpen(true);
      return new Promise((res) => { resolver.current = res; });
    }
    return run(locale);
  }, [allowed, run]);

  const consentDone = useCallback((ok: boolean) => {
    setConsentOpen(false);
    const res = resolver.current;
    resolver.current = null;
    // Nach der Einwilligung nicht automatisch starten: das Kind tippt selbst (Browser verlangt eine Geste).
    res?.(null);
    if (ok) setError(L('Super! Tippe jetzt auf das Mikrofon und sprich.', 'Perfetto! Ora tocca il microfono e parla.'));
  }, []);

  const cancel = useCallback(() => { stopListening(); setState('idle'); setLive(''); }, []);
  /** Fertig gesprochen: Gehörtes sofort auswerten */
  const finish = useCallback(() => finishListening(), []);
  return { listen, cancel, finish, live, state, error, setError, allowed, consentOpen, consentDone };
}

/** Eltern geben das Mikrofon frei (PIN). */
export function VoiceConsentModal({ open, onDone }: { open: boolean; onDone: (ok: boolean) => void }) {
  const hasPin = useApp((s) => !!s.parent.pinHash);
  const setParent = useApp((s) => s.setParent);
  const [step, setStep] = useState<'info' | 'pin'>('info');
  useEffect(() => { if (open) setStep('info'); }, [open]);
  const grant = () => {
    setParent({ consentVoice: true, consentUpdatedAt: new Date().toISOString() });
    onDone(true);
  };
  return (
    <Modal open={open} onClose={() => onDone(false)} title={L('Mikrofon einschalten', 'Attiva il microfono')} labelledBy="mikro-titel">
      {step === 'info' ? (
        <div className="flex flex-col gap-4" data-testid="mikro-einwilligung">
          <p className="text-lg">{L('Mit dem Mikrofon kannst du Wörter nachsprechen und Antworten sagen. Puppy hört zu und sagt dir, ob es gut klingt.', 'Con il microfono puoi ripetere le parole e dire le risposte. Puppy ascolta e ti dice se suona bene.')}</p>
          <Notice>
            <span className="flex items-start gap-2"><ShieldCheck size={20} className="mt-0.5 shrink-0" />
              <span>{L('Für Erwachsene: Die Spracherkennung läuft über den Browser. Je nach Gerät wird die Aufnahme dafür an den Anbieter des Browsers (z. B. Google oder Apple) gesendet. Lernito speichert keine Aufnahmen. Sie können das jederzeit im Elternbereich wieder ausschalten.', 'Per gli adulti: il riconoscimento vocale è fornito dal browser. A seconda del dispositivo, l’audio può essere inviato al fornitore del browser (ad es. Google o Apple). Lernito non salva registrazioni. Potete disattivarlo in qualsiasi momento nell’area genitori.')}</span>
            </span>
          </Notice>
          <button className="knopf kante-himmel bg-himmel-500 text-white" onClick={() => setStep('pin')} data-testid="mikro-eltern">
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

/** Runder Mikrofon-Knopf mit Zuhör-Animation. */
export function MicButton({ listening, onClick, disabled, size = 'md', label, testId = 'mikrofon' }: {
  listening: boolean; onClick: () => void; disabled?: boolean; size?: 'md' | 'lg'; label: string; testId?: string;
}) {
  const dim = size === 'lg' ? 'h-24 w-24' : 'h-14 w-14';
  return (
    <button type="button" onClick={onClick} disabled={disabled} data-testid={testId} data-listening={listening ? 'true' : undefined}
      aria-label={listening ? L('Ich höre zu … tippe, wenn du fertig bist', 'Ti ascolto… tocca quando hai finito') : label}
      className={`relative flex ${dim} shrink-0 items-center justify-center rounded-full text-white transition active:scale-95 disabled:opacity-40 ${listening ? 'bg-koralle-500' : 'kante-himmel bg-himmel-500 hover:bg-himmel-600'}`}>
      <AnimatePresence>
        {listening && [0, 1].map((i) => (
          <motion.span key={i} className="absolute inset-0 rounded-full bg-koralle-500" aria-hidden
            initial={{ scale: 1, opacity: 0.35 }} animate={{ scale: 1.7, opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.7 }} />
        ))}
      </AnimatePresence>
      <Mic size={size === 'lg' ? 44 : 26} className="relative" />
    </button>
  );
}

/**
 * Antwort per Sprache (für Quiz-Aufgaben): kleiner Knopf „Sag es“.
 * Unterstützt der Browser keine Spracherkennung, wird nichts angezeigt.
 */
export function VoiceAnswer({ locale, onHeard, disabled, prompt }: {
  locale: string;
  /** Liefert eine Meldung, wenn nichts passte (sonst null) */
  onHeard: (alternatives: string[]) => string | null;
  disabled?: boolean;
  prompt?: string;
}) {
  const v = useListen();
  const [note, setNote] = useState<string | null>(null);
  if (!recognitionSupported()) return null;
  const click = async () => {
    if (v.state === 'listening') { v.finish(); return; }
    setNote(null);
    const alts = await v.listen(locale);
    if (alts) setNote(onHeard(alts));
  };
  const msg = note ?? v.error;
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-2" data-testid="sprachantwort">
      <div className="flex items-center gap-3">
        <MicButton listening={v.state === 'listening'} onClick={click} disabled={disabled} label={prompt ?? L('Antwort sagen', 'Di’ la risposta')} testId="mikrofon-antwort" />
        <span className="text-sm font-semibold text-tinte/60">
          {v.state === 'listening' ? (v.live ? L(`Ich höre: „${v.live}“`, `Ti sento: «${v.live}»`) : L('Ich höre zu … sprich jetzt', 'Ti ascolto… parla adesso')) : prompt ?? L('Oder sag die Antwort', 'Oppure di’ la risposta')}
        </span>
      </div>
      {msg && <p className="text-center text-base text-tinte/75" role="status" data-testid="sprach-hinweis">{msg}</p>}
      <VoiceConsentModal open={v.consentOpen} onDone={v.consentDone} />
    </div>
  );
}

