import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import { L } from '../../i18n';
import { sfx } from '../../lib/sound';

/** Kopfleiste mit Zurück-Knopf, Titel und Sternen. */
export function TopBar({ title, back, right, stars }: { title?: string; back?: string | number; right?: ReactNode; stars?: number }) {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-30 border-b border-tinte/[0.06] bg-flaeche/85 backdrop-blur-md" style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex h-16 max-w-6xl 2xl:max-w-7xl items-center gap-3 px-4 sm:px-6">
        {back !== undefined && (
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-tinte/70 ring-1 ring-tinte/10 transition hover:bg-tinte/[0.04] hover:text-tinte focus-visible:outline focus-visible:outline-4 focus-visible:outline-himmel-500"
            onClick={() => { sfx.tap(); typeof back === 'number' ? nav(back) : nav(back); }}
            aria-label={L('Zurück', 'Indietro')}
          >
            <ChevronLeft size={22} strokeWidth={2.4} />
          </button>
        )}
        {title && <h1 className="min-w-0 flex-1 truncate font-display text-lg font-bold tracking-tight sm:text-xl">{title}</h1>}
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
    <Link to="/sterne" className="flex h-10 items-center gap-1.5 rounded-full bg-sonne-50 px-3.5 font-display text-base font-bold text-sonne-700 ring-1 ring-sonne-300/70 transition hover:bg-sonne-100" aria-label={L(`${n} Sterne`, `${n} stelle`)}>
      <Star className="fill-sonne-500 text-sonne-500" size={18} aria-hidden />
      <span>{n}</span>
    </Link>
  );
}
