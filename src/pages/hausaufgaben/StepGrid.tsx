import type { Grid } from '../../hausaufgaben/types';
import { L } from '../../i18n';

/** Rechnung wie im karierten Heft: ein Kästchen pro Ziffer. */
export function StepGrid({ grid }: { grid: Grid }) {
  const cell = 'clamp(1.6rem, 8.5vw, 2.4rem)';
  return (
    <div className="overflow-x-auto" role="img" aria-label={L('Rechnung im Heft', 'Calcolo sul quaderno')} data-testid="kaestchen">
      <div className="inline-grid rounded-xl bg-creme p-2 ring-1 ring-tinte/[0.06]"
        style={{
          gridTemplateColumns: `repeat(${grid.width}, ${cell})`,
          backgroundImage: 'linear-gradient(rgb(var(--c-tinte) / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-tinte) / 0.06) 1px, transparent 1px)',
          backgroundSize: `${cell} ${cell}`, backgroundPosition: '0.5rem 0.5rem'
        }}>
        {grid.rows.flatMap((row, r) => row.cells.map((c, k) => {
          const hl = grid.hl === k;
          const carry = row.kind === 'carry';
          const cls = [
            'flex items-center justify-center font-display tabular-nums',
            carry ? 'text-sm font-bold text-koralle-600 self-end' : 'text-xl sm:text-2xl font-bold',
            row.kind === 'result' ? 'text-himmel-700' : row.kind === 'new' ? 'text-minze-700' : '',
            row.rule ? 'border-t-2 border-tinte/70' : '',
            hl ? 'bg-sonne-300/40' : ''
          ].join(' ');
          return <span key={`${r}-${k}`} className={cls} style={{ height: carry ? `calc(${cell} * 0.7)` : cell }}>{c}</span>;
        }))}
      </div>
    </div>
  );
}
