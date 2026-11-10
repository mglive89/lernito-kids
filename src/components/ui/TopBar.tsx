import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { L } from '../../i18n';
import { sfx } from '../../lib/sound';

/** Kopfleiste mit Zurück-Knopf, Titel und Sternen. */
export function TopBar({ title, back, right, stars }: { title?: string; back?: string | number; right?: ReactNode; stars?: number }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 bg-creme/80 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {back !== undefined && (
          <button
            className="knopf knopf-3d h-12 w-12 shrink-0 rounded-full bg-white px-0"
            onClick={() => { sfx.tap(); typeof back === 'number' ? nav(back) : nav(back); }}
            aria-label={L('Zurück', 'Indietro')}
          >
            <ArrowLeft size={24} strokeWidth={2.6} />
          </button>
        )}
        {title && <h1 className="min-w-0 flex-1 truncate font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>}
        {!title && <div className="flex-1" />}
        {stars !== undefined && <StarCount n={stars} />}
        {right}
      </div>
    </header>
  );
}

/** Sterne-Zähler (führt zur Sterne-Seite). */
export function StarCount({ n }: { n: number }) {
  return (
    <Link to="/sterne" className="knopf-3d flex items-center gap-1.5 rounded-full bg-white px-4 py-2 font-display text-lg font-bold ring-2 ring-sonne-300" aria-label={L(`${n} Sterne`, `${n} stelle`)}>
      <Star className="fill-sonne-500 text-sonne-500" size={22} aria-hidden />
      <span>{n}</span>
    </Link>
  );
}
