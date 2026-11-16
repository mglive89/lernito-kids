import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useApp } from '../store/useApp';

/**
 * Spielstand der Sprachkurse je Profil: Herzen, Sprach-XP und Tagesmissionen.
 * Eigener kleiner Speicher, damit der Hauptspeicher unverändert bleibt.
 */
export const MAX_HEARTS = 5;
/** Ein Herz kommt nach dieser Zeit von selbst zurück */
export const HEART_REGEN_MS = 30 * 60_000;
/** Alle Herzen auffüllen kostet so viele Sterne */
export const REFILL_STARS = 10;
/** Ein einzelnes Herz kostet so viele Sterne */
export const HEART_STARS = 3;

export interface LangPlay {
  hearts: number;
  /** Zeitpunkt, ab dem das nächste Herz zurückkommt (null = volle Herzen) */
  nextAt: number | null;
  /** Sprach-XP insgesamt */
  xp: number;
  day: string;
  dayXp: number;
  dayLessons: number;
  daySpoken: number;
  /** heute abgeholte Missionen */
  claimed: string[];
}

export interface Quest {
  id: string;
  title: () => { de: string; it: string };
  goal: number;
  value: (p: LangPlay) => number;
}

export const QUESTS: Quest[] = [
  { id: 'xp20', title: () => ({ de: 'Sammle heute 20 XP', it: 'Guadagna 20 XP oggi' }), goal: 20, value: (p) => p.dayXp },
  { id: 'lektionen2', title: () => ({ de: 'Schließe 2 Lektionen ab', it: 'Completa 2 lezioni' }), goal: 2, value: (p) => p.dayLessons },
  { id: 'sprechen5', title: () => ({ de: 'Sprich 5 Sätze richtig aus', it: 'Pronuncia bene 5 frasi' }), goal: 5, value: (p) => p.daySpoken },
  { id: 'xp50', title: () => ({ de: 'Sammle heute 50 XP', it: 'Guadagna 50 XP oggi' }), goal: 50, value: (p) => p.dayXp }
];

const today = (now = Date.now()) => {
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const freshPlay = (now = Date.now()): LangPlay => ({
  hearts: MAX_HEARTS, nextAt: null, xp: 0, day: today(now), dayXp: 0, dayLessons: 0, daySpoken: 0, claimed: []
});

/** Zeit und Tageswechsel anwenden: Herzen nachwachsen lassen, Tageszähler zurücksetzen. */
export function settle(p: LangPlay | undefined, now = Date.now()): LangPlay {
  let s = p ? { ...p } : freshPlay(now);
  if (s.hearts < MAX_HEARTS && s.nextAt !== null && now >= s.nextAt) {
    const gained = 1 + Math.floor((now - s.nextAt) / HEART_REGEN_MS);
    const hearts = Math.min(MAX_HEARTS, s.hearts + gained);
    s = { ...s, hearts, nextAt: hearts >= MAX_HEARTS ? null : s.nextAt + gained * HEART_REGEN_MS };
  }
  if (s.hearts >= MAX_HEARTS) s.nextAt = null;
  const d = today(now);
  if (s.day !== d) s = { ...s, day: d, dayXp: 0, dayLessons: 0, daySpoken: 0, claimed: [] };
  return s;
}

interface State {
  byProfile: Record<string, LangPlay>;
  loseHeart: (pid: string, now?: number) => number;
  gainHearts: (pid: string, n: number, now?: number) => void;
  refillWithStars: (pid: string, now?: number) => boolean;
  buyHeart: (pid: string, now?: number) => boolean;
  lessonDone: (pid: string, xp: number, now?: number) => void;
  spoken: (pid: string, now?: number) => void;
  claim: (pid: string, questId: string, now?: number) => boolean;
}

export const useLangPlay = create<State>()(
  persist(
    (set, get) => {
      const update = (pid: string, now: number, fn: (p: LangPlay) => LangPlay) => {
        const next = fn(settle(get().byProfile[pid], now));
        set((s) => ({ byProfile: { ...s.byProfile, [pid]: next } }));
        return next;
      };
      return {
        byProfile: {},
        loseHeart: (pid, now = Date.now()) => update(pid, now, (p) => {
          if (p.hearts <= 0) return p;
          return { ...p, hearts: p.hearts - 1, nextAt: p.nextAt ?? now + HEART_REGEN_MS };
        }).hearts,
        gainHearts: (pid, n, now = Date.now()) => { update(pid, now, (p) => {
          const hearts = Math.min(MAX_HEARTS, p.hearts + n);
          return { ...p, hearts, nextAt: hearts >= MAX_HEARTS ? null : p.nextAt };
        }); },
        refillWithStars: (pid, now = Date.now()) => {
          const prog = useApp.getState().progress[pid];
          const p = settle(get().byProfile[pid], now);
          if (!prog || prog.stars < REFILL_STARS || p.hearts >= MAX_HEARTS) return false;
          useApp.setState((s) => ({ progress: { ...s.progress, [pid]: { ...s.progress[pid]!, stars: s.progress[pid]!.stars - REFILL_STARS } } }));
          update(pid, now, (q) => ({ ...q, hearts: MAX_HEARTS, nextAt: null }));
          return true;
        },
        buyHeart: (pid, now = Date.now()) => {
          const prog = useApp.getState().progress[pid];
          const p = settle(get().byProfile[pid], now);
          if (!prog || prog.stars < HEART_STARS || p.hearts >= MAX_HEARTS) return false;
          useApp.setState((s) => ({ progress: { ...s.progress, [pid]: { ...s.progress[pid]!, stars: s.progress[pid]!.stars - HEART_STARS } } }));
          update(pid, now, (q) => ({ ...q, hearts: q.hearts + 1, nextAt: q.hearts + 1 >= MAX_HEARTS ? null : q.nextAt }));
          return true;
        },
        lessonDone: (pid, xp, now = Date.now()) => { update(pid, now, (p) => ({ ...p, xp: p.xp + xp, dayXp: p.dayXp + xp, dayLessons: p.dayLessons + 1 })); },
        spoken: (pid, now = Date.now()) => { update(pid, now, (p) => ({ ...p, daySpoken: p.daySpoken + 1 })); },
        claim: (pid, questId, now = Date.now()) => {
          const q = QUESTS.find((x) => x.id === questId);
          const p = settle(get().byProfile[pid], now);
          if (!q || p.claimed.includes(questId) || q.value(p) < q.goal) return false;
          update(pid, now, (x) => ({ ...x, claimed: [...x.claimed, questId], hearts: Math.min(MAX_HEARTS, x.hearts + 1), nextAt: x.hearts + 1 >= MAX_HEARTS ? null : x.nextAt }));
          return true;
        }
      };
    },
    { name: 'lernito-lingue-spiel', version: 1, storage: createJSONStorage(() => localStorage), partialize: (s) => ({ byProfile: s.byProfile }) }
  )
);

/** Aktueller Spielstand eines Profils (mit nachgewachsenen Herzen). */
export function useLangPlayOf(pid: string | undefined): LangPlay {
  const raw = useLangPlay((s) => (pid ? s.byProfile[pid] : undefined));
  return settle(raw);
}
