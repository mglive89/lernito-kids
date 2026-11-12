/**
 * Vorlesefunktion über die Web Speech API.
 * - Nutzt bevorzugt eine Stimme in der App-Sprache (Deutsch oder Italienisch).
 * - Kennzeichnet, ob eine lokale (offline nutzbare) Stimme vorhanden ist.
 * - Fallback: Text bleibt sichtbar, Status wird klar angezeigt.
 */
export type SpeechStatus = 'offline' | 'online' | 'keine';

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;
let speechLang: 'de' | 'it' = 'de';

/** Sprache der Vorlesestimme festlegen */
export function setSpeechLang(l: 'de' | 'it'): void {
  if (l === speechLang) return;
  speechLang = l;
  cachedVoice = null;
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) voicesLoaded = true;
  const match = voices.filter((v) => v.lang.toLowerCase().startsWith(speechLang));
  cachedVoice = match.find((v) => v.localService) ?? match[0] ?? null;
  return cachedVoice;
}

export function speechStatus(): SpeechStatus {
  if (!speechSupported()) return 'keine';
  const v = cachedVoice ?? pickVoice();
  // Ohne passende Stimme trotzdem versuchen: der Browser wählt dann anhand von lang selbst eine Stimme.
  if (!v) return voicesLoaded ? 'online' : 'offline';
  return v.localService ? 'offline' : 'online';
}

export function onVoicesChanged(cb: () => void): () => void {
  if (!speechSupported()) return () => undefined;
  const handler = () => { pickVoice(); cb(); };
  window.speechSynthesis.addEventListener('voiceschanged', handler);
  return () => window.speechSynthesis.removeEventListener('voiceschanged', handler);
}

let enabled = true;
export function setSpeechEnabled(v: boolean): void {
  enabled = v;
  if (!v) stopSpeaking();
}

// Laufende Äußerungen festhalten: Chrome verwirft sonst Utterances per Garbage Collection mitten im Satz.
const live = new Set<SpeechSynthesisUtterance>();
let pendingTimer: ReturnType<typeof setTimeout> | null = null;
let primed = false;

/** Längere Texte in Sätze teilen: Chrome bricht einzelne Äußerungen nach ca. 15 Sekunden ab. */
function chunks(text: string): string[] {
  const parts = text.match(/[^.!?;:]+[.!?;:]*\s*/g) ?? [text];
  const out: string[] = [];
  for (const p of parts) {
    const t = p.trim();
    if (!t) continue;
    const last = out[out.length - 1];
    if (last && last.length + t.length < 160) out[out.length - 1] = `${last} ${t}`;
    else out.push(t);
  }
  return out.length ? out : [text];
}

/** Stimme für eine andere Sprache (Sprachkurse), z. B. „en-GB“ oder „fr-FR“. */
const otherVoices = new Map<string, SpeechSynthesisVoice | null>();
function voiceFor(locale: string): SpeechSynthesisVoice | null {
  if (otherVoices.has(locale)) return otherVoices.get(locale)!;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const norm = (l: string) => l.toLowerCase().replace('_', '-');
  const exact = voices.filter((v) => norm(v.lang) === norm(locale));
  const base = voices.filter((v) => norm(v.lang).startsWith(norm(locale).slice(0, 2)));
  const pool = exact.length ? exact : base;
  const v = pool.find((x) => x.localService) ?? pool[0] ?? null;
  otherVoices.set(locale, v);
  return v;
}

/** Gibt es auf diesem Gerät eine Stimme für diese Sprache? (null = Stimmen noch nicht geladen) */
export function hasVoiceFor(locale: string): boolean | null {
  if (!speechSupported()) return false;
  if (!window.speechSynthesis.getVoices().length) return null;
  return voiceFor(locale) !== null;
}

function utter(text: string, rate: number, pitch: number, locale?: string): SpeechSynthesisUtterance {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = locale ?? (speechLang === 'it' ? 'it-IT' : 'de-DE');
  const v = locale ? voiceFor(locale) : cachedVoice ?? pickVoice();
  if (v) u.voice = v;
  u.rate = rate;
  u.pitch = pitch;
  u.volume = 1;
  live.add(u);
  const done = () => live.delete(u);
  u.onend = done;
  u.onerror = done;
  return u;
}

/**
 * Text vorlesen. Robust gegen bekannte Browserfehler:
 * - Chrome: speak() direkt nach cancel() wird oft verschluckt → kurz warten, wenn noch etwas läuft.
 * - Chrome/Android: Synthese hängt nach Tab-Wechsel „pausiert“ → resume().
 * - iOS: das erste Vorlesen muss direkt aus einem Tippen kommen → dann sofort sprechen.
 */
export function speak(text: string, opts: { rate?: number; pitch?: number; force?: boolean; /** andere Sprache, z. B. „en-GB“ */ lang?: string } = {}): boolean {
  if ((!enabled && !opts.force) || !speechSupported() || !text) return false;
  try {
    const synth = window.speechSynthesis;
    const clean = text.replace(/[„“”«»]/g, '').replace(/\s+/g, ' ').trim();
    if (!clean) return false;
    const rate = opts.rate ?? 0.92;
    const pitch = opts.pitch ?? 1.1;
    if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
    const run = () => {
      pendingTimer = null;
      if (synth.paused) synth.resume();
      for (const c of chunks(clean)) synth.speak(utter(c, rate, pitch, opts.lang));
    };
    const busy = synth.speaking || synth.pending;
    if (busy) {
      synth.cancel();
      pendingTimer = setTimeout(run, 120);
    } else {
      run();
    }
    return true;
  } catch {
    return false;
  }
}

/** Beim ersten Tippen die Sprachausgabe „freischalten“ (iOS/Safari erlaubt sie sonst nicht aus Timern). */
export function primeSpeech(): void {
  if (primed || !speechSupported()) return;
  primed = true;
  try {
    pickVoice();
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0;
    window.speechSynthesis.speak(u);
  } catch { /* egal */ }
}

export function stopSpeaking(): void {
  if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
  if (speechSupported()) window.speechSynthesis.cancel();
}

// Stimmen werden in Chrome erst asynchron geladen: Auswahl dann aktualisieren.
if (speechSupported()) {
  try {
    window.speechSynthesis.addEventListener('voiceschanged', () => { cachedVoice = null; otherVoices.clear(); pickVoice(); });
    pickVoice();
  } catch { /* ältere Browser */ }
}
