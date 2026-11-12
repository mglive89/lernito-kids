import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import type { DayLog } from '../store/useApp';
import { dateKey, lastNDays, wochentagKurz } from '../lib/date';
import { L } from '../i18n';

/** Kleine Wochenübersicht: gelernte Runden der letzten 7 Tage als Balken. */
export function WeekActivity({ daily, goal }: { daily: Record<string, DayLog>; goal: number }) {
  const days = lastNDays(7);
  const today = dateKey();
  const values = days.map((k) => daily[k]?.rounds ?? 0);
  const max = Math.max(goal, ...values, 1);
  const total = values.reduce((a, b) => a + b, 0);
  const minutes = Math.round(days.reduce((a, k) => a + (daily[k]?.seconds ?? 0), 0) / 60);
  return (
    <section className="karte-3d p-4 sm:p-5" aria-labelledby="woche-titel" data-testid="wochen-aktivitaet">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 id="woche-titel" className="flex items-center gap-2 font-display text-base font-bold sm:text-lg"><Activity size={18} className="text-himmel-600" aria-hidden /> {L('Deine Woche', 'La tua settimana')}</h2>
          <p className="text-xs font-medium text-tinte/55">{L(`${total} Runden · ${minutes} Min.`, `${total} turni · ${minutes} min`)}</p>
        </div>
        <span className="chip bg-minze-50 text-xs text-minze-700">{L('Ziel', 'Obiettivo')}: {goal}/{L('Tag', 'giorno')}</span>
      </div>
      <div role="img" aria-label={L(`Runden der letzten 7 Tage: ${values.join(', ')}`, `Turni degli ultimi 7 giorni: ${values.join(', ')}`)}>
        <div className="relative flex h-24 items-end gap-2 sm:gap-3">
          <span className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-minze-500/35" style={{ bottom: `${(goal / max) * 100}%` }} aria-hidden />
          {days.map((k, i) => {
            const v = values[i]!;
            const h = v ? Math.max(8, (v / max) * 100) : 4;
            return (
              <div key={k} className="flex h-full flex-1 items-end justify-center">
                <motion.span
                  className={`block w-full max-w-[2.25rem] rounded-lg ${v === 0 ? 'bg-tinte/[0.08]' : v >= goal ? 'bg-minze-500' : 'bg-himmel-500'} ${k === today ? 'ring-2 ring-himmel-300 ring-offset-2 ring-offset-flaeche' : ''}`}
                  initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ type: 'spring', stiffness: 160, damping: 22, delay: 0.05 * i }} />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex gap-2 sm:gap-3" aria-hidden>
          {days.map((k) => (
            <span key={k} className={`flex-1 text-center text-[11px] font-bold ${k === today ? 'text-himmel-700' : 'text-tinte/45'}`}>{wochentagKurz(new Date(k + 'T12:00').getDay())}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
