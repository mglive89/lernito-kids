/**
 * Audio für die Lernsprache: zuerst eine Audiodatei aus dem Paket, sonst eine Gerätestimme (Web Speech).
 * Gibt es keine passende Stimme, wird das ehrlich angezeigt und Hörübungen werden zu Leseübungen.
 * Keine vorgetäuschte Aussprachebewertung.
 */
import { useEffect, useState } from 'react';
import { hasVoiceFor, onVoicesChanged, speak, speechSupported } from '../lib/speech';
import { PACK_BASE } from './packs';
import type { Item, LangTag } from './types';

/** Übliche Region für die Stimmenwahl, falls die Kennung keine enthält */
const DEFAULT_REGION: Record<string, string> = {
  de: 'de-DE', it: 'it-IT', en: 'en-GB', fr: 'fr-FR', es: 'es-ES', pt: 'pt-PT', ar: 'ar-SA', ja: 'ja-JP', nl: 'nl-NL',
  zh: 'zh-CN', 'zh-Hans': 'zh-CN', 'zh-Hant': 'zh-TW', ko: 'ko-KR', ru: 'ru-RU', tr: 'tr-TR', pl: 'pl-PL', el: 'el-GR', sv: 'sv-SE'
};
export const speechLocale = (tag: LangTag) => DEFAULT_REGION[tag] ?? (tag.includes('-') ? tag : DEFAULT_REGION[tag] ?? tag);

export type VoiceState = 'checking' | 'yes' | 'no';

/** Gibt es eine Stimme für diese Sprache? Wartet kurz, bis der Browser die Stimmen geladen hat. */
const known = new Map<string, VoiceState>();
export function useVoice(tag: LangTag | undefined): VoiceState {
  const [state, setRaw] = useState<VoiceState>(() => (tag && known.get(tag)) || 'checking');
  const setState = (v: VoiceState) => { if (tag) known.set(tag, v); setRaw(v); };
  useEffect(() => {
    if (!tag) return;
    setRaw(known.get(tag) ?? 'checking');
    if (!speechSupported()) { setState('no'); return; }
    const check = () => {
      const v = hasVoiceFor(speechLocale(tag));
      if (v !== null) setState(v ? 'yes' : 'no');
      return v;
    };
    if (check() !== null) return;
    const off = onVoicesChanged(() => { check(); });
    // Manche Browser melden nie Stimmen: nach kurzer Zeit gilt „keine Stimme“
    const t = setTimeout(() => { if (check() === null) setState('no'); }, 1500);
    return () => { off(); clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);
  return state;
}

let current: HTMLAudioElement | null = null;
/** Text eines Elements abspielen: Audiodatei oder Gerätestimme */
export function playItem(item: Pick<Item, 'text' | 'audio'>, tag: LangTag, voice: VoiceState, rate = 0.9): boolean {
  if (item.audio) {
    try { current?.pause(); current = new Audio(PACK_BASE + item.audio); void current.play(); return true; } catch { /* weiter mit Stimme */ }
  }
  if (voice !== 'yes') return false;
  return speak(item.text, { lang: speechLocale(tag), force: true, rate });
}
