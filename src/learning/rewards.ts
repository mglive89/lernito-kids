import type { RoundResult, ModuleProgress } from './adaptive';
import { tx, type Txt } from '../i18n';

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

export interface BadgeDef { id: string; title: Txt; description: Txt; emoji: string; test: (c: BadgeContext) => boolean }

const played = (c: BadgeContext, prefix: string) => Object.entries(c.modules).filter(([id, p]) => id.startsWith(prefix) && p.rounds > 0).length;

const playedAny = (c: BadgeContext, prefixes: string[]) => prefixes.reduce((n, p) => n + played(c, p), 0);

export const BADGES: BadgeDef[] = [
  { id: 'erste-runde', title: tx('Losgelegt!', 'Si parte!'), description: tx('Deine erste Lernrunde geschafft.', 'Hai completato il tuo primo turno.'), emoji: '🚀', test: (c) => c.rounds >= 1 },
  { id: 'sterne-10', title: tx('Sternensammler', 'Collezionista di stelle'), description: tx('10 Sterne gesammelt.', 'Hai raccolto 10 stelle.'), emoji: '⭐', test: (c) => c.stars >= 10 },
  { id: 'sterne-50', title: tx('Sternenhimmel', 'Cielo stellato'), description: tx('50 Sterne gesammelt.', 'Hai raccolto 50 stelle.'), emoji: '🌟', test: (c) => c.stars >= 50 },
  { id: 'sterne-150', title: tx('Sternenregen', 'Pioggia di stelle'), description: tx('150 Sterne gesammelt.', 'Hai raccolto 150 stelle.'), emoji: '💫', test: (c) => c.stars >= 150 },
  { id: 'perfekt', title: tx('Volltreffer', 'Centro perfetto'), description: tx('Eine Runde komplett auf Anhieb gelöst.', 'Un turno tutto giusto al primo colpo.'), emoji: '🎯', test: (c) => !!c.lastRound && c.lastRound.total > 0 && c.lastRound.firstTry === c.lastRound.total },
  { id: 'kita-entdecker', title: tx('Kita-Entdecker', 'Piccolo esploratore'), description: tx('5 verschiedene Kindergarten-Spiele gespielt.', 'Hai provato 5 giochi diversi dell’infanzia.'), emoji: '🧸', test: (c) => played(c, 'kita-') >= 5 },
  { id: 'rechenfuchs', title: tx('Rechenprofi', 'Asso dei numeri'), description: tx('3 verschiedene Mathe-Übungen gespielt.', 'Hai provato 3 esercizi di matematica diversi.'), emoji: '🧮', test: (c) => played(c, 'm') >= 3 },
  { id: 'leseratte', title: tx('Wortkünstler', 'Artista delle parole'), description: tx('3 verschiedene Sprach-Übungen gespielt.', 'Hai provato 3 esercizi di lingua diversi.'), emoji: '📚', test: (c) => playedAny(c, ['d', 'it']) >= 3 },
  { id: 'forscher', title: tx('Weltforscher', 'Esploratore del mondo'), description: tx('Eine Runde Sachkunde oder Naturwissenschaften gespielt.', 'Hai giocato un turno di scienze.'), emoji: '🔬', test: (c) => playedAny(c, ['s', 'bio-', 'phy-', 'che-']) >= 1 },
  { id: 'zeitreise', title: tx('Zeitreisender', 'Viaggiatore nel tempo'), description: tx('Geschichte oder Erdkunde ausprobiert.', 'Hai provato storia o geografia.'), emoji: '🏛️', test: (c) => playedAny(c, ['ge-', 'geo-']) >= 1 },
  { id: 'hello', title: tx('Hello!', 'Hello!'), description: tx('Englisch ausprobiert.', 'Hai provato l’inglese.'), emoji: '🇬🇧', test: (c) => playedAny(c, ['e-', 'en-']) >= 1 },
  { id: 'coder', title: tx('Junger Coder', 'Giovane programmatore'), description: tx('Eine Programmier-Übung gespielt.', 'Hai giocato un esercizio di programmazione.'), emoji: '🧑‍💻', test: (c) => playedAny(c, ['code-', 'info-']) >= 1 },
  { id: 'werte', title: tx('Weltoffen', 'Aperto al mondo'), description: tx('Religion & Ethik ausprobiert.', 'Hai provato religione ed etica.'), emoji: '🕊️', test: (c) => played(c, 'rel-') >= 1 },
  { id: '3d', title: tx('3D-Abenteurer', 'Avventuriero 3D'), description: tx('Die 3D-Lernwelt erkundet.', 'Hai esplorato il mondo 3D.'), emoji: '🧊', test: (c) => played(c, '3d-') >= 1 },
  { id: 'aufsteiger', title: tx('Aufsteiger', 'Scalatore'), description: tx('In einem Thema die höchste Stufe erreicht.', 'Hai raggiunto il livello più alto in un argomento.'), emoji: '🏔️', test: (c) => Object.values(c.modules).some((m) => m.level === 3) },
  { id: 'dranbleiber', title: tx('Dranbleiber', 'Costante'), description: tx('An 3 verschiedenen Tagen gelernt.', 'Hai studiato in 3 giorni diversi.'), emoji: '🌱', test: (c) => c.activeDays >= 3 },
  { id: 'kino', title: tx('Lernkino', 'Cinema del sapere'), description: tx('Ein Lernvideo angesehen.', 'Hai guardato una video lezione.'), emoji: '🎬', test: (c) => c.videosWatched >= 1 },
  { id: 'stylist', title: tx('Ganz ich', 'Proprio io'), description: tx('Deinen Avatar gestaltet.', 'Hai personalizzato il tuo avatar.'), emoji: '🎨', test: (c) => c.avatarCustomized },
  { id: 'spielkind', title: tx('Pausenprofi', 'Re della pausa'), description: tx('Ein Mini-Spiel gespielt.', 'Hai giocato a un minigioco.'), emoji: '🫧', test: (c) => c.minigamesPlayed >= 1 }
];

export function newBadges(c: BadgeContext, owned: string[]): BadgeDef[] {
  return BADGES.filter((b) => !owned.includes(b.id) && b.test(c));
}

/** Freischaltbare Mini-Spiele – über Sterne, nie über Käufe oder Zufall. */
export const MINIGAMES = [
  { id: 'seifenblasen', title: tx('Seifenblasen', 'Bolle di sapone'), description: tx('Blasen platzen lassen und mitzählen.', 'Fai scoppiare le bolle e contale.'), emoji: '🫧', starsNeeded: 5 },
  { id: 'ballons', title: tx('Ballon-Reihe', 'Fila di palloncini'), description: tx('Ballons der Reihe nach platzen lassen.', 'Fai scoppiare i palloncini in ordine.'), emoji: '🎈', starsNeeded: 25 },
  { id: 'malen', title: tx('Puppy ausmalen', 'Colora Puppy'), description: tx('Male Puppy in deinen Lieblingsfarben an.', 'Colora Puppy con i tuoi colori preferiti.'), emoji: '🖍️', starsNeeded: 60 }
] as const;

/** Avatar-Teile, die mit Leveln freigeschaltet werden. */
export const AVATAR_TIERE = ['🦁', '🦊', '🐰', '🐻', '🐱', '🐼', '🐸', '🦉', '🐨', '🐯', '🐧', '🦄'];
export const AVATAR_FARBEN = ['#FFD166', '#8ED1FC', '#8EE3BF', '#FF9F8E', '#C3A6FF', '#FFB5D8'];
export const AVATAR_EXTRAS: { id: string; emoji: string; name: Txt; level: number }[] = [
  { id: 'keins', emoji: '', name: tx('Nichts', 'Niente'), level: 1 },
  { id: 'schleife', emoji: '🎀', name: tx('Schleife', 'Fiocco'), level: 1 },
  { id: 'kappe', emoji: '🧢', name: tx('Kappe', 'Cappellino'), level: 2 },
  { id: 'hut', emoji: '🎩', name: tx('Zylinder', 'Cilindro'), level: 3 },
  { id: 'brille', emoji: '🕶️', name: tx('Sonnenbrille', 'Occhiali da sole'), level: 4 },
  { id: 'krone', emoji: '👑', name: tx('Krone', 'Corona'), level: 5 },
  { id: 'helm', emoji: '⛑️', name: tx('Forscherhelm', 'Casco da esploratore'), level: 6 }
];
