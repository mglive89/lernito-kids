import type { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { Confetti } from '../../components/ui';
import { LinoSays, type LinoMood } from '../../components/Lino';
import { L } from '../../i18n';

/** Rekord je Kind und Spiel – nur auf diesem Gerät, Fehler beim Speichern sind egal. */
export function getBest(profileId: string, game: string): number {
  try { return Number(localStorage.getItem(`lernito-rekord-${profileId}-${game}`) ?? 0) || 0; } catch { return 0; }
}
export function saveBest(profileId: string, game: string, value: number): boolean {
  if (value <= getBest(profileId, game)) return false;
  try { localStorage.setItem(`lernito-rekord-${profileId}-${game}`, String(value)); } catch { /* egal */ }
  return true;
}

/** Auswahl-Chips (Größe, Schwierigkeit). */
export function ChipGroup<T extends string | number>({ label, value, options, onChange, testid }: {
  label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; testid: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label={label}>
      <span className="eyebrow mr-1">{label}</span>
      {options.map((o) => (
        <button key={String(o.id)} type="button" role="radio" aria-checked={value === o.id} data-testid={`${testid}-${o.id}`}
          onClick={() => onChange(o.id)}
          className={`chip min-h-[2.5rem] px-4 ring-1 transition ${value === o.id ? 'bg-himmel-500 text-white ring-himmel-500' : 'bg-flaeche text-tinte/70 ring-tinte/10 hover:bg-tinte/[0.04]'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Kleiner Werte-Kasten (Punkte, Reihen, Rekord). */
export function Stat({ label, value, testid }: { label: string; value: ReactNode; testid?: string }) {
  return (
    <div className="karte-3d flex min-w-[4.5rem] flex-col items-center px-3 py-1.5">
      <span className="eyebrow">{label}</span>
      <span className="font-display text-xl font-extrabold tabular-nums" data-testid={testid}>{value}</span>
    </div>
  );
}

/** Abschluss: Puppy lobt, Knopf für ein neues Spiel. */
export function GameEnd({ text, mood = 'jubel', onAgain, confetti = true, children }: { text: string; mood?: LinoMood; onAgain: () => void; confetti?: boolean; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3" data-testid="spiel-ende">
      {confetti && <Confetti show />}
      <LinoSays text={text} mood={mood} size={80} />
      {children}
      <button type="button" className="knopf knopf-3d bg-sonne-500 text-nacht" onClick={onAgain} data-testid="neues-spiel">
        <RefreshCw size={20} aria-hidden /> {L('Neues Spiel', 'Nuova partita')}
      </button>
    </div>
  );
}
