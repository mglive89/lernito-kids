import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Blocks, Combine, Grid3x3, LetterText, type LucideIcon } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { AnimatedGrid, colorSet, IconBadge, PageHero, TopBar } from '../../components/ui';
import { Lino, LinoSays } from '../../components/Lino';
import { sfx } from '../../lib/sound';
import { L } from '../../i18n';
import { sudokuDefaults } from '../../denkspiele/sudoku';
import { twinGoal } from '../../denkspiele/twins';

const SudokuGame = lazy(() => import('./SudokuGame'));
const CrosswordGame = lazy(() => import('./CrosswordGame'));
const TwinsGame = lazy(() => import('./TwinsGame'));
const BlockRainGame = lazy(() => import('./BlockRainGame'));

interface BrainGame { id: string; icon: LucideIcon; color: string; title: string; text: string; forYou: (year: number) => string }

/** Denkspiele: frei spielbar, ohne Sterne-Sperre. */
export const BRAIN_GAMES = (): BrainGame[] => [
  { id: 'sudoku', icon: Grid3x3, color: 'himmel', title: 'Sudoku',
    text: L('Jede Zahl nur einmal in Reihe, Spalte und Kästchen.', 'Ogni numero una sola volta in riga, colonna e riquadro.'),
    forYou: (y) => { const d = sudokuDefaults(y); return d.pictures ? L('4×4 mit Bildern', '4×4 con immagini') : `${d.size}×${d.size}`; } },
  { id: 'kreuzwort', icon: LetterText, color: 'lila', title: L('Kreuzworträtsel', 'Cruciverba'),
    text: L('Rate die Wörter und trage sie ins Gitter ein.', 'Indovina le parole e scrivile nello schema.'),
    forYou: (y) => (y <= 2 ? L('mit Bildern', 'con immagini') : y <= 6 ? L('Wörter aus der Schule', 'parole della scuola') : L('Fachbegriffe', 'termini delle materie')) },
  { id: 'zwillinge', icon: Combine, color: 'sonne', title: L('Zahlen-Zwillinge', 'Numeri gemelli'),
    text: L('Schiebe gleiche Zahlen zusammen – sie werden zur Summe.', 'Fai scorrere numeri uguali: si uniscono nella loro somma.'),
    forYou: (y) => L(`Ziel: ${twinGoal(y)}`, `Obiettivo: ${twinGoal(y)}`) },
  { id: 'blockregen', icon: Blocks, color: 'minze', title: L('Blockregen', 'Pioggia di blocchi'),
    text: L('Drehe die fallenden Formen und fülle ganze Reihen.', 'Ruota i blocchi che cadono e completa le righe.'),
    forYou: (y) => (y <= 2 ? L('kleine Formen, langsam', 'blocchi piccoli, lento') : L('klassische Formen', 'forme classiche')) }
];

export function BrainGamesPage() {
  const profile = useApp((s) => s.profiles.find((p) => p.id === s.activeProfileId));
  const { progress } = useActiveProfile();
  const year = profile?.year ?? 3;
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Denkspiele', 'Giochi di logica')} back="/entdecken" stars={progress.stars} />
      <main className="seite" data-testid="denkspiele-seite">
        <PageHero color="lila" title={L('Trainiere deinen Kopf', 'Allena la mente')}
          subtitle={L('Rätsel und Knobelspiele – passend zu deinem Alter.', 'Rompicapi e giochi di logica, adatti alla tua età.')}
          art={<span className="-my-8 block"><Lino mood="denken" size={104} /></span>} />
        <AnimatedGrid className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {BRAIN_GAMES().map((g) => {
            const c = colorSet(g.color);
            return (
              <Link key={g.id} to={`/denkspiele/${g.id}`} onClick={() => sfx.tap()} data-testid={`denkspiel-${g.id}`}
                className="karte-3d group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 sm:p-5">
                <IconBadge icon={g.icon} color={g.color} size="xl" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold leading-tight">{g.title}</span>
                  <span className="block text-sm text-tinte/55">{g.text}</span>
                  <span className={`chip mt-1.5 ${c.soft} ${c.text} px-2.5 py-0.5 text-xs`}>{L('Für dich', 'Per te')}: {g.forYou(year)}</span>
                </span>
                <ArrowRight size={20} className={`shrink-0 ${c.text} transition group-hover:translate-x-0.5`} aria-hidden />
              </Link>
            );
          })}
        </AnimatedGrid>
        <p className="mt-6 text-center text-sm text-tinte/60">{L('Ohne Zeitdruck, ohne Werbung: Du kannst jederzeit neu anfangen.', 'Senza fretta e senza pubblicità: puoi ricominciare quando vuoi.')}</p>
      </main>
    </div>
  );
}

export function BrainGamePlayPage() {
  const { gameId } = useParams();
  const markMinigame = useApp((s) => s.markMinigame);
  const profile = useApp((s) => s.profiles.find((p) => p.id === s.activeProfileId));
  const game = BRAIN_GAMES().find((g) => g.id === gameId);
  const marked = useRef(false);
  useEffect(() => {
    if (game && !marked.current) { marked.current = true; markMinigame(); }
  }, [game, markMinigame]);
  if (!game || !profile) {
    return (
      <div className="min-h-[100dvh]">
        <TopBar title={L('Denkspiele', 'Giochi di logica')} back="/denkspiele" />
        <main className="seite"><LinoSays text={L('Dieses Spiel gibt es nicht.', 'Questo gioco non esiste.')} mood="denken" /></main>
      </div>
    );
  }
  const props = { year: profile.year, profileId: profile.id };
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={game.title} back="/denkspiele" />
      <main className="mx-auto w-full max-w-5xl px-3 pt-3 sm:px-6 sm:pt-5" style={{ paddingBottom: 'calc(2rem + var(--safe-bottom))' }} data-testid={`spiel-${game.id}`}>
        <Suspense fallback={<div className="py-20 text-center text-tinte/60">{L('Lädt …', 'Caricamento …')}</div>}>
          {game.id === 'sudoku' && <SudokuGame {...props} />}
          {game.id === 'kreuzwort' && <CrosswordGame {...props} />}
          {game.id === 'zwillinge' && <TwinsGame {...props} />}
          {game.id === 'blockregen' && <BlockRainGame {...props} />}
        </Suspense>
      </main>
    </div>
  );
}

export interface GameProps { year: number; profileId: string }
