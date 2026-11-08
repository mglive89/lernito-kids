import type { RoundResult, ModuleProgress } from './adaptive';

/** Erfahrungspunkte → Level. Kurve wird langsam steiler, aber ohne Druck. */
export const LEVEL_THRESHOLDS = [0, 50, 120, 220, 350, 520, 740, 1000, 1300, 1650, 2050, 2500];

export function levelFromXp(xp: number): { level: number; current: number; next: number | null; progress: number } {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) if (xp >= LEVEL_THRESHOLDS[i]!) level = i + 1;
  const current = LEVEL_THRESHOLDS[level - 1]!;
  const next = LEVEL_THRESHOLDS[level] ?? null;
  const progress = next === null ? 1 : (xp - current) / (next - current);
  return { level, current, next, progress };
}

/** Sterne einer Runde: 1 pro gelöster Aufgabe. */
export function starsForRound(r: RoundResult): number {
  return r.solved;
}

export function xpForRound(r: RoundResult): number {
  return r.solved * 10 + r.firstTry * 2 + 10;
}

export interface BadgeContext {
  stars: number;
  rounds: number;
  modules: Record<string, ModuleProgress>;
  lastRound?: RoundResult;
  activeDays: number;
  videosWatched: number;
  avatarCustomized: boolean;
  minigamesPlayed: number;
}

export interface BadgeDef { id: string; title: string; description: string; emoji: string; test: (c: BadgeContext) => boolean }

const played = (c: BadgeContext, prefix: string) => Object.entries(c.modules).filter(([id, p]) => id.startsWith(prefix) && p.rounds > 0).length;

export const BADGES: BadgeDef[] = [
  { id: 'erste-runde', title: 'Losgelegt!', description: 'Deine erste Lernrunde geschafft.', emoji: '🚀', test: (c) => c.rounds >= 1 },
  { id: 'sterne-10', title: 'Sternensammler', description: '10 Sterne gesammelt.', emoji: '⭐', test: (c) => c.stars >= 10 },
  { id: 'sterne-50', title: 'Sternenhimmel', description: '50 Sterne gesammelt.', emoji: '🌟', test: (c) => c.stars >= 50 },
  { id: 'sterne-150', title: 'Sternenregen', description: '150 Sterne gesammelt.', emoji: '💫', test: (c) => c.stars >= 150 },
  { id: 'perfekt', title: 'Volltreffer', description: 'Eine Runde komplett auf Anhieb gelöst.', emoji: '🎯', test: (c) => !!c.lastRound && c.lastRound.total > 0 && c.lastRound.firstTry === c.lastRound.total },
  { id: 'kita-entdecker', title: 'Kita-Entdecker', description: '5 verschiedene Kindergarten-Spiele gespielt.', emoji: '🧸', test: (c) => played(c, 'kita-') >= 5 },
  { id: 'rechenfuchs', title: 'Rechenprofi', description: '3 verschiedene Mathe-Übungen gespielt.', emoji: '🧮', test: (c) => played(c, 'm') >= 3 },
  { id: 'leseratte', title: 'Wortkünstler', description: '3 verschiedene Deutsch-Übungen gespielt.', emoji: '📚', test: (c) => played(c, 'd') >= 3 },
  { id: 'forscher', title: 'Weltforscher', description: 'Eine Runde Sachunterricht gespielt.', emoji: '🔬', test: (c) => played(c, 's') >= 1 },
  { id: 'hello', title: 'Hello!', description: 'Englisch ausprobiert.', emoji: '🇬🇧', test: (c) => played(c, 'e-') >= 1 },
  { id: '3d', title: '3D-Abenteurer', description: 'Die 3D-Lernwelt erkundet.', emoji: '🧊', test: (c) => played(c, '3d-') >= 1 },
  { id: 'aufsteiger', title: 'Aufsteiger', description: 'In einem Thema die höchste Stufe erreicht.', emoji: '🏔️', test: (c) => Object.values(c.modules).some((m) => m.level === 3) },
  { id: 'dranbleiber', title: 'Dranbleiber', description: 'An 3 verschiedenen Tagen gelernt.', emoji: '🌱', test: (c) => c.activeDays >= 3 },
  { id: 'kino', title: 'Lernkino', description: 'Ein Lernvideo angesehen.', emoji: '🎬', test: (c) => c.videosWatched >= 1 },
  { id: 'stylist', title: 'Ganz ich', description: 'Deinen Avatar gestaltet.', emoji: '🎨', test: (c) => c.avatarCustomized },
  { id: 'spielkind', title: 'Pausenprofi', description: 'Ein Mini-Spiel gespielt.', emoji: '🫧', test: (c) => c.minigamesPlayed >= 1 }
];

export function newBadges(c: BadgeContext, owned: string[]): BadgeDef[] {
  return BADGES.filter((b) => !owned.includes(b.id) && b.test(c));
}

/** Freischaltbare Mini-Spiele – über Sterne, nie über Käufe oder Zufall. */
export const MINIGAMES = [
  { id: 'seifenblasen', title: 'Seifenblasen', description: 'Blasen platzen lassen und mitzählen.', emoji: '🫧', starsNeeded: 5 },
  { id: 'ballons', title: 'Ballon-Reihe', description: 'Ballons der Reihe nach platzen lassen.', emoji: '🎈', starsNeeded: 25 },
  { id: 'malen', title: 'Lino ausmalen', description: 'Male Lino in deinen Lieblingsfarben an.', emoji: '🖍️', starsNeeded: 60 }
] as const;

/** Avatar-Teile, die mit Leveln freigeschaltet werden. */
export const AVATAR_TIERE = ['🦁', '🦊', '🐰', '🐻', '🐱', '🐼', '🐸', '🦉', '🐨', '🐯', '🐧', '🦄'];
export const AVATAR_FARBEN = ['#FFD166', '#8ED1FC', '#8EE3BF', '#FF9F8E', '#C3A6FF', '#FFB5D8'];
export const AVATAR_EXTRAS: { id: string; emoji: string; name: string; level: number }[] = [
  { id: 'keins', emoji: '', name: 'Nichts', level: 1 },
  { id: 'schleife', emoji: '🎀', name: 'Schleife', level: 1 },
  { id: 'kappe', emoji: '🧢', name: 'Kappe', level: 2 },
  { id: 'hut', emoji: '🎩', name: 'Zylinder', level: 3 },
  { id: 'brille', emoji: '🕶️', name: 'Sonnenbrille', level: 4 },
  { id: 'krone', emoji: '👑', name: 'Krone', level: 5 },
  { id: 'helm', emoji: '⛑️', name: 'Forscherhelm', level: 6 }
];
