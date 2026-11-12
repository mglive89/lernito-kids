import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { getTheme, onThemeChange, setTheme, type ThemeChoice } from '../../lib/theme';
import { L } from '../../i18n';

/** Auswahl Hell / Dunkel / Automatisch als Segment-Schalter. */
export function ThemePicker({ id = 'thema' }: { id?: string }) {
  const [choice, setChoice] = useState<ThemeChoice>(getTheme);
  useEffect(() => onThemeChange(() => setChoice(getTheme())), []);
  const options: { id: ThemeChoice; label: string; icon: typeof Sun }[] = [
    { id: 'hell', label: L('Hell', 'Chiaro'), icon: Sun },
    { id: 'dunkel', label: L('Dunkel', 'Scuro'), icon: Moon },
    { id: 'auto', label: L('Automatisch', 'Automatico'), icon: Monitor }
  ];
  return (
    <div className="flex gap-1 rounded-2xl bg-tinte/[0.05] p-1" role="radiogroup" aria-label={L('Erscheinungsbild', 'Aspetto')} data-testid="thema-wahl">
      {options.map((o) => {
        const on = choice === o.id;
        const Icon = o.icon;
        return (
          <button key={o.id} type="button" role="radio" aria-checked={on} data-testid={`thema-${o.id}`}
            onClick={() => setTheme(o.id)}
            className={`relative isolate flex min-h-[2.75rem] flex-1 items-center justify-center gap-2 rounded-xl px-2 text-sm font-bold transition ${on ? 'text-himmel-700' : 'text-tinte/60 hover:text-tinte'}`}>
            {on && <motion.span layoutId={`${id}-aktiv`} className="absolute inset-0 -z-10 rounded-xl bg-flaeche shadow-weich ring-1 ring-tinte/[0.06]" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <Icon size={17} aria-hidden /> <span className="truncate">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
