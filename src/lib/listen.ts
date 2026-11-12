/**
 * Spracherkennung über die Web Speech API (SpeechRecognition).
 * - Chrome/Edge/Android: webkitSpeechRecognition (Audio wird vom Browser-Anbieter verarbeitet).
 * - Safari (iOS/macOS ab 14.5): webkitSpeechRecognition, in installierten Web-Apps teils unzuverlässig.
 * - Firefox: nicht verfügbar → die App bietet Ersatzwege an (selbst nachsprechen, tippen).
 */

export type ListenError = 'unsupported' | 'denied' | 'no-speech' | 'no-mic' | 'network' | 'aborted' | 'other';

export interface ListenResult {
  /** Erkannte Alternativen, beste zuerst */
  alternatives: string[];
}

/* Minimale Typen, weil SpeechRecognition (noch) nicht in lib.dom.d.ts steht */
interface RecAlternative { transcript: string; confidence: number }
interface RecResultList { length: number; [i: number]: { length: number; isFinal: boolean; [j: number]: RecAlternative } }
interface RecEvent { results: RecResultList }
interface RecErrorEvent { error: string }
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: RecEvent) => void) | null;
  onerror: ((e: RecErrorEvent) => void) | null;
  onend: (() => void) | null;
  onspeechend?: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => Recognition;

function ctor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Kann dieser Browser überhaupt Sprache erkennen? */
export function recognitionSupported(): boolean {
  return ctor() !== null;
}

let current: Recognition | null = null;

/** Laufende Erkennung abbrechen (z. B. beim Verlassen der Aufgabe). */
export function stopListening(): void {
  try { current?.abort(); } catch { /* egal */ }
  current = null;
}

/**
 * Einmal zuhören und die erkannten Sätze liefern.
 * Muss aus einem Tippen heraus gestartet werden (Mikrofon-Freigabe des Browsers).
 */
export function listenOnce(locale: string, opts: { timeoutMs?: number } = {}): Promise<ListenResult> {
  const C = ctor();
  if (!C) return Promise.reject<ListenResult>('unsupported' satisfies ListenError);
  stopListening();
  return new Promise<ListenResult>((resolve, reject) => {
    let rec: Recognition;
    try { rec = new C(); } catch { reject('unsupported' satisfies ListenError); return; }
    current = rec;
    rec.lang = locale;
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = 5;
    let settled = false;
    const alts: string[] = [];
    const finish = (err?: ListenError) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (current === rec) current = null;
      if (err) reject(err);
      else if (alts.length) resolve({ alternatives: alts });
      else reject('no-speech' satisfies ListenError);
    };
    const timer = setTimeout(() => { try { rec.stop(); } catch { /* egal */ } setTimeout(() => finish(), 600); }, opts.timeoutMs ?? 8000);
    rec.onresult = (e) => {
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]!;
        for (let j = 0; j < r.length; j++) {
          const t = r[j]?.transcript?.trim();
          if (t && !alts.includes(t)) alts.push(t);
        }
      }
    };
    rec.onerror = (e) => {
      const map: Record<string, ListenError> = {
        'not-allowed': 'denied', 'service-not-allowed': 'denied', 'no-speech': 'no-speech',
        'audio-capture': 'no-mic', network: 'network', aborted: 'aborted', 'language-not-supported': 'unsupported'
      };
      finish(map[e.error] ?? 'other');
    };
    rec.onend = () => finish();
    try { rec.start(); } catch { finish('other'); }
  });
}
