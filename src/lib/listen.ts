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
/** Beendet die laufende Sitzung und wertet aus, was bis jetzt gehört wurde */
let finishCurrent: (() => void) | null = null;

/** Laufende Erkennung abbrechen (z. B. beim Verlassen der Aufgabe). */
export function stopListening(): void {
  finishCurrent = null;
  try { current?.abort(); } catch { /* egal */ }
  current = null;
}

/** Zuhören jetzt beenden und das Gehörte auswerten (Kind tippt nochmal aufs Mikrofon). */
export function finishListening(): void {
  finishCurrent?.();
}

export interface ListenOptions {
  /** Höchstdauer insgesamt (ms) */
  timeoutMs?: number;
  /** So lange Stille nach dem Sprechen, dann ist das Kind fertig (ms) */
  silenceMs?: number;
  /** Zwischenergebnis während des Sprechens (für die Anzeige „Ich höre: …“) */
  onInterim?: (text: string) => void;
}

/**
 * Einmal zuhören und die erkannten Sätze liefern.
 * Großzügig für Kinder:
 * - hört weiter, auch wenn das Kind kurz Pause macht (erst nach längerer Stille ist Schluss),
 * - startet automatisch neu, wenn der Browser zu früh aufhört oder nichts gehört hat,
 * - nimmt notfalls das Zwischenergebnis, wenn der Browser kein Endergebnis liefert.
 * Muss aus einem Tippen heraus gestartet werden (Mikrofon-Freigabe des Browsers).
 */
export function listenOnce(locale: string, opts: ListenOptions = {}): Promise<ListenResult> {
  const C = ctor();
  if (!C) return Promise.reject<ListenResult>('unsupported' satisfies ListenError);
  stopListening();
  const timeoutMs = opts.timeoutMs ?? 12000;
  const silenceMs = opts.silenceMs ?? 1600;
  return new Promise<ListenResult>((resolve, reject) => {
    const started = Date.now();
    const finals: string[] = [];
    let interim = '';
    let settled = false;
    let restarts = 0;
    let rec: Recognition | null = null;
    let silenceTimer: ReturnType<typeof setTimeout> | undefined;
    let wantStop = false;

    const heardSomething = () => finals.length > 0 || interim.trim().length > 0;
    const finish = (err?: ListenError) => {
      if (settled) return;
      settled = true;
      clearTimeout(totalTimer);
      clearTimeout(silenceTimer);
      finishCurrent = null;
      if (rec && current === rec) current = null;
      try { rec?.abort(); } catch { /* egal */ }
      const alts = [...finals];
      if (interim.trim() && !alts.includes(interim.trim())) alts.push(interim.trim());
      if (alts.length) resolve({ alternatives: alts });
      else reject(err ?? ('no-speech' satisfies ListenError));
    };
    // Sanft beenden: Browser liefert noch das Endergebnis, danach onend → finish
    const stopSoft = () => {
      wantStop = true;
      try { rec?.stop(); } catch { /* egal */ }
      setTimeout(() => finish(), 900);
    };
    finishCurrent = stopSoft;
    const totalTimer = setTimeout(stopSoft, timeoutMs);

    const start = () => {
      let r: Recognition;
      try { r = new C(); } catch { finish('unsupported'); return; }
      rec = r;
      current = r;
      r.lang = locale;
      r.continuous = true;
      r.interimResults = true;
      r.maxAlternatives = 5;
      r.onresult = (e) => {
        let live = '';
        for (let i = 0; i < e.results.length; i++) {
          const res = e.results[i]!;
          if (res.isFinal === false) { live += `${res[0]?.transcript ?? ''} `; continue; }
          for (let j = 0; j < res.length; j++) {
            const t = res[j]?.transcript?.trim();
            if (t && !finals.includes(t)) finals.push(t);
          }
        }
        // Mehrere Endergebnisse (Pausen im Satz) zusätzlich als ganzen Satz anbieten
        const finalParts: string[] = [];
        for (let i = 0; i < e.results.length; i++) { const res = e.results[i]!; if (res.isFinal !== false && res[0]) finalParts.push(res[0].transcript.trim()); }
        const joined = finalParts.join(' ').trim();
        if (finalParts.length > 1 && joined && !finals.includes(joined)) finals.unshift(joined);
        interim = live.trim() ? `${joined} ${live}`.trim() : interim;
        if (live.trim() || joined) opts.onInterim?.((live.trim() ? `${joined} ${live}` : joined).trim());
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(stopSoft, silenceMs);
      };
      r.onerror = (e) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return; // onend entscheidet
        const map: Record<string, ListenError> = {
          'not-allowed': 'denied', 'service-not-allowed': 'denied', 'audio-capture': 'no-mic',
          network: 'network', 'language-not-supported': 'unsupported'
        };
        finish(map[e.error] ?? 'other');
      };
      r.onend = () => {
        if (settled) return;
        // Noch nichts gehört (Stille am Anfang, Browser hört zu früh auf)? Weiter zuhören, solange Zeit ist.
        if (!wantStop && !heardSomething() && Date.now() - started < timeoutMs - 1500 && restarts < 6) {
          restarts++;
          setTimeout(() => { if (!settled) start(); }, 150);
          return;
        }
        finish();
      };
      try { r.start(); } catch { finish('other'); }
    };
    start();
  });
}
