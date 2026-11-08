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
  if (!v) return voicesLoaded ? 'keine' : 'offline';
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

export function speak(text: string, opts: { rate?: number; pitch?: number; force?: boolean } = {}): boolean {
  if ((!enabled && !opts.force) || !speechSupported() || !text) return false;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[„“]/g, ''));
    u.lang = speechLang === 'it' ? 'it-IT' : 'de-DE';
    const v = cachedVoice ?? pickVoice();
    if (v) u.voice = v;
    u.rate = opts.rate ?? 0.92;
    u.pitch = opts.pitch ?? 1.1;
    synth.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}
