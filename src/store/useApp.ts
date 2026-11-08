import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { idbStorage } from '../lib/db';
import { dateKey } from '../lib/date';
import { hashPin, randomSalt } from '../lib/hash';
import { applyRound, emptyModuleProgress, type ModuleProgress, type RoundResult } from '../learning/adaptive';
import { levelFromXp, newBadges, starsForRound, xpForRound, type BadgeDef } from '../learning/rewards';
import { DEFAULT_SUBJECTS, type CustomModule, type SubjectSetting } from '../learning/custom';
import type { Difficulty, Grade } from '../learning/types';

export type AgeGroup = 'kita' | Grade;

export interface AvatarConfig { animal: string; color: string; extra: string }

export interface Profile {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  avatar: AvatarConfig;
  avatarCustomized: boolean;
  createdAt: string;
}

export interface DayLog { seconds: number; rounds: number; stars: number }

export interface ProfileProgress {
  stars: number;
  xp: number;
  rounds: number;
  badges: Record<string, string>;
  modules: Record<string, ModuleProgress>;
  daily: Record<string, DayLog>;
  lastModuleId?: string;
  videos: Record<string, { progress: number; completed: boolean }>;
  minigamesPlayed: number;
}

export interface ChildSettings {
  dailyGoalRounds: number;
  /** Minuten pro Tag, null = kein Limit */
  timeLimitMin: number | null;
  assigned: string[];
  speech: boolean;
  sounds: boolean;
}

export interface ParentSettings {
  pinHash: string | null;
  salt: string | null;
  /** Einwilligungen – alle standardmäßig aus */
  consentOnlineSync: boolean;
  consentAiHelper: boolean;
  consentUpdatedAt: string | null;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  adminPinHash: string | null;
  adminSalt: string | null;
}

export interface CustomVideo {
  id: string;
  title: string;
  description: string;
  subject: string;
  topic: string;
  mediaId: string;
  subtitleMediaId?: string;
  quizModuleId?: string;
  published: boolean;
  updatedAt: string;
}

export interface RecordResult {
  stars: number;
  xp: number;
  levelBefore: number;
  levelAfter: number;
  difficultyBefore: Difficulty;
  difficultyAfter: Difficulty;
  badges: BadgeDef[];
}

interface AppState {
  profiles: Profile[];
  activeProfileId: string | null;
  progress: Record<string, ProfileProgress>;
  childSettings: Record<string, ChildSettings>;
  parent: ParentSettings;
  customModules: CustomModule[];
  customVideos: CustomVideo[];
  subjects: SubjectSetting[];
  /** Nicht persistiert */
  parentUnlockedUntil: number;
  adminUnlocked: boolean;
  hydrated: boolean;

  addProfile: (p: Omit<Profile, 'id' | 'createdAt' | 'avatarCustomized'>) => Profile;
  updateProfile: (id: string, patch: Partial<Omit<Profile, 'id'>>) => void;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string | null) => void;
  recordRound: (r: RoundResult) => RecordResult;
  addLearningSeconds: (sec: number) => void;
  markVideo: (lessonId: string, progress: number, completed: boolean) => void;
  markMinigame: () => BadgeDef[];
  checkBadges: () => BadgeDef[];
  setChildSettings: (id: string, patch: Partial<ChildSettings>) => void;
  setPin: (pin: string) => void;
  verifyPin: (pin: string) => boolean;
  unlockParent: (minutes?: number) => void;
  lockParent: () => void;
  setParent: (patch: Partial<ParentSettings>) => void;
  setAdminPin: (pin: string) => void;
  verifyAdminPin: (pin: string) => boolean;
  setAdminUnlocked: (v: boolean) => void;
  saveCustomModule: (m: CustomModule) => void;
  deleteCustomModule: (id: string) => void;
  saveCustomVideo: (v: CustomVideo) => void;
  deleteCustomVideo: (id: string) => void;
  setSubjects: (s: SubjectSetting[]) => void;
  resetProfileProgress: (id: string) => void;
  importData: (data: unknown) => void;
  wipeAll: () => void;
}

export const emptyProgress = (): ProfileProgress => ({ stars: 0, xp: 0, rounds: 0, badges: {}, modules: {}, daily: {}, videos: {}, minigamesPlayed: 0 });
export const defaultChildSettings = (): ChildSettings => ({ dailyGoalRounds: 3, timeLimitMin: null, assigned: [], speech: true, sounds: true });
const defaultParent = (): ParentSettings => ({
  pinHash: null, salt: null, consentOnlineSync: false, consentAiHelper: false, consentUpdatedAt: null,
  highContrast: false, largeText: false, reduceMotion: false, adminPinHash: null, adminSalt: null
});

const newId = () => `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

function badgeContext(p: ProfileProgress, profile: Profile | undefined, lastRound?: RoundResult) {
  return {
    stars: p.stars, rounds: p.rounds, modules: p.modules, lastRound,
    activeDays: Object.values(p.daily).filter((d) => d.rounds > 0).length,
    videosWatched: Object.values(p.videos).filter((v) => v.completed).length,
    avatarCustomized: profile?.avatarCustomized ?? false,
    minigamesPlayed: p.minigamesPlayed
  };
}

const PERSIST_KEYS = ['profiles', 'activeProfileId', 'progress', 'childSettings', 'parent', 'customModules', 'customVideos', 'subjects'] as const;

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      progress: {},
      childSettings: {},
      parent: defaultParent(),
      customModules: [],
      customVideos: [],
      subjects: DEFAULT_SUBJECTS,
      parentUnlockedUntil: 0,
      adminUnlocked: false,
      hydrated: false,

      addProfile: (p) => {
        const profile: Profile = { ...p, id: newId(), createdAt: new Date().toISOString(), avatarCustomized: false };
        set((s) => ({
          profiles: [...s.profiles, profile],
          progress: { ...s.progress, [profile.id]: emptyProgress() },
          childSettings: { ...s.childSettings, [profile.id]: defaultChildSettings() }
        }));
        return profile;
      },
      updateProfile: (id, patch) => set((s) => ({ profiles: s.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)) })),
      deleteProfile: (id) =>
        set((s) => {
          const progress = { ...s.progress }; delete progress[id];
          const childSettings = { ...s.childSettings }; delete childSettings[id];
          return { profiles: s.profiles.filter((p) => p.id !== id), progress, childSettings, activeProfileId: s.activeProfileId === id ? null : s.activeProfileId };
        }),
      setActiveProfile: (id) => set({ activeProfileId: id }),

      recordRound: (r) => {
        const s = get();
        const pid = s.activeProfileId;
        const empty: RecordResult = { stars: 0, xp: 0, levelBefore: 1, levelAfter: 1, difficultyBefore: 1, difficultyAfter: 1, badges: [] };
        if (!pid) return empty;
        const prev = s.progress[pid] ?? emptyProgress();
        const mp = prev.modules[r.moduleId] ?? emptyModuleProgress();
        const updatedModule = applyRound(mp, r);
        const stars = starsForRound(r);
        const xp = xpForRound(r);
        const today = dateKey();
        const day = prev.daily[today] ?? { seconds: 0, rounds: 0, stars: 0 };
        const next: ProfileProgress = {
          ...prev,
          stars: prev.stars + stars,
          xp: prev.xp + xp,
          rounds: prev.rounds + 1,
          modules: { ...prev.modules, [r.moduleId]: updatedModule },
          daily: { ...prev.daily, [today]: { ...day, rounds: day.rounds + 1, stars: day.stars + stars } },
          lastModuleId: r.moduleId
        };
        const profile = s.profiles.find((p) => p.id === pid);
        const earned = newBadges(badgeContext(next, profile, r), Object.keys(prev.badges));
        const now = new Date().toISOString();
        for (const b of earned) next.badges = { ...next.badges, [b.id]: now };
        set({ progress: { ...s.progress, [pid]: next } });
        return {
          stars, xp,
          levelBefore: levelFromXp(prev.xp).level, levelAfter: levelFromXp(next.xp).level,
          difficultyBefore: mp.level, difficultyAfter: updatedModule.level, badges: earned
        };
      },

      addLearningSeconds: (sec) => {
        const s = get();
        const pid = s.activeProfileId;
        if (!pid) return;
        const prev = s.progress[pid] ?? emptyProgress();
        const today = dateKey();
        const day = prev.daily[today] ?? { seconds: 0, rounds: 0, stars: 0 };
        set({ progress: { ...s.progress, [pid]: { ...prev, daily: { ...prev.daily, [today]: { ...day, seconds: day.seconds + sec } } } } });
      },

      markVideo: (lessonId, progress, completed) => {
        const s = get();
        const pid = s.activeProfileId;
        if (!pid) return;
        const prev = s.progress[pid] ?? emptyProgress();
        const old = prev.videos[lessonId] ?? { progress: 0, completed: false };
        const next: ProfileProgress = { ...prev, videos: { ...prev.videos, [lessonId]: { progress: Math.max(old.progress, progress), completed: old.completed || completed } } };
        const earned = newBadges(badgeContext(next, s.profiles.find((p) => p.id === pid)), Object.keys(prev.badges));
        for (const b of earned) next.badges = { ...next.badges, [b.id]: new Date().toISOString() };
        set({ progress: { ...s.progress, [pid]: next } });
      },

      markMinigame: () => {
        const s = get();
        const pid = s.activeProfileId;
        if (!pid) return [];
        const prev = s.progress[pid] ?? emptyProgress();
        const next: ProfileProgress = { ...prev, minigamesPlayed: prev.minigamesPlayed + 1 };
        const earned = newBadges(badgeContext(next, s.profiles.find((p) => p.id === pid)), Object.keys(prev.badges));
        for (const b of earned) next.badges = { ...next.badges, [b.id]: new Date().toISOString() };
        set({ progress: { ...s.progress, [pid]: next } });
        return earned;
      },

      checkBadges: () => {
        const s = get();
        const pid = s.activeProfileId;
        if (!pid) return [];
        const prev = s.progress[pid] ?? emptyProgress();
        const earned = newBadges(badgeContext(prev, s.profiles.find((p) => p.id === pid)), Object.keys(prev.badges));
        if (!earned.length) return [];
        const badges = { ...prev.badges };
        for (const b of earned) badges[b.id] = new Date().toISOString();
        set({ progress: { ...s.progress, [pid]: { ...prev, badges } } });
        return earned;
      },

      setChildSettings: (id, patch) =>
        set((s) => ({ childSettings: { ...s.childSettings, [id]: { ...(s.childSettings[id] ?? defaultChildSettings()), ...patch } } })),

      setPin: (pin) => {
        const salt = randomSalt();
        set((s) => ({ parent: { ...s.parent, salt, pinHash: hashPin(pin, salt) } }));
      },
      verifyPin: (pin) => {
        const { parent } = get();
        if (!parent.pinHash || !parent.salt) return false;
        return hashPin(pin, parent.salt) === parent.pinHash;
      },
      unlockParent: (minutes = 15) => set({ parentUnlockedUntil: Date.now() + minutes * 60_000 }),
      lockParent: () => set({ parentUnlockedUntil: 0 }),
      setParent: (patch) => set((s) => ({ parent: { ...s.parent, ...patch } })),
      setAdminPin: (pin) => {
        const salt = randomSalt();
        set((s) => ({ parent: { ...s.parent, adminSalt: salt, adminPinHash: hashPin(pin, salt) } }));
      },
      verifyAdminPin: (pin) => {
        const { parent } = get();
        if (!parent.adminPinHash || !parent.adminSalt) return false;
        return hashPin(pin, parent.adminSalt) === parent.adminPinHash;
      },
      setAdminUnlocked: (v) => set({ adminUnlocked: v }),

      saveCustomModule: (m) =>
        set((s) => {
          const exists = s.customModules.some((c) => c.id === m.id);
          const updated = { ...m, updatedAt: new Date().toISOString() };
          return { customModules: exists ? s.customModules.map((c) => (c.id === m.id ? updated : c)) : [...s.customModules, updated] };
        }),
      deleteCustomModule: (id) => set((s) => ({ customModules: s.customModules.filter((c) => c.id !== id) })),
      saveCustomVideo: (v) =>
        set((s) => {
          const updated = { ...v, updatedAt: new Date().toISOString() };
          return { customVideos: s.customVideos.some((c) => c.id === v.id) ? s.customVideos.map((c) => (c.id === v.id ? updated : c)) : [...s.customVideos, updated] };
        }),
      deleteCustomVideo: (id) => set((s) => ({ customVideos: s.customVideos.filter((c) => c.id !== id) })),
      setSubjects: (subjects) => set({ subjects }),

      resetProfileProgress: (id) => set((s) => ({ progress: { ...s.progress, [id]: emptyProgress() } })),

      importData: (data) => {
        if (!data || typeof data !== 'object') throw new Error('Ungültige Datei');
        const d = data as Partial<Record<(typeof PERSIST_KEYS)[number], unknown>> & { app?: string };
        if (d.app !== 'lernito-kids' || !Array.isArray(d.profiles)) throw new Error('Diese Datei stammt nicht aus Lernito Kids.');
        set({
          profiles: d.profiles as Profile[],
          progress: (d.progress as Record<string, ProfileProgress>) ?? {},
          childSettings: (d.childSettings as Record<string, ChildSettings>) ?? {},
          customModules: (d.customModules as CustomModule[]) ?? get().customModules,
          activeProfileId: null
        });
      },

      wipeAll: () =>
        set({
          profiles: [], activeProfileId: null, progress: {}, childSettings: {}, parent: defaultParent(),
          customModules: [], customVideos: [], subjects: DEFAULT_SUBJECTS, parentUnlockedUntil: 0, adminUnlocked: false
        })
    }),
    {
      name: 'lernito-state',
      version: 1,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => Object.fromEntries(PERSIST_KEYS.map((k) => [k, s[k]])) as Pick<AppState, (typeof PERSIST_KEYS)[number]>,
      onRehydrateStorage: () => () => {
        useApp.setState({ hydrated: true });
      }
    }
  )
);

/** Export aller lokal gespeicherten Daten (DSGVO Art. 15/20). */
export function exportAllData(): string {
  const s = useApp.getState();
  return JSON.stringify(
    {
      app: 'lernito-kids', exportedAt: new Date().toISOString(), version: 1,
      profiles: s.profiles, progress: s.progress, childSettings: s.childSettings, customModules: s.customModules,
      parent: { consentOnlineSync: s.parent.consentOnlineSync, consentAiHelper: s.parent.consentAiHelper, consentUpdatedAt: s.parent.consentUpdatedAt }
    },
    null, 2
  );
}

export function useActiveProfile(): { profile: Profile | undefined; progress: ProfileProgress; settings: ChildSettings } {
  const profile = useApp((s) => s.profiles.find((p) => p.id === s.activeProfileId));
  const progress = useApp((s) => (s.activeProfileId ? s.progress[s.activeProfileId] : undefined)) ?? EMPTY_PROGRESS;
  const settings = useApp((s) => (s.activeProfileId ? s.childSettings[s.activeProfileId] : undefined)) ?? DEFAULT_SETTINGS;
  return { profile, progress, settings };
}
const EMPTY_PROGRESS = emptyProgress();
const DEFAULT_SETTINGS = defaultChildSettings();
