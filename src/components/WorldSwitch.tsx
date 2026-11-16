import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lightbulb } from 'lucide-react';
import { L } from '../i18n';
import { sfx } from '../lib/sound';
import { setWorld, type World } from '../adult/progress';

/** Umschalter zwischen den beiden Welten: Lernito School (Kids + Teen) und Lernito Adult. */
export function WorldSwitch({ value }: { value: World }) {
  const nav = useNavigate();
  const items: { id: World; label: string; icon: typeof GraduationCap; to: string }[] = [
    { id: 'school', label: 'School', icon: GraduationCap, to: '/' },
    { id: 'adult', label: 'Adult', icon: Lightbulb, to: '/adult' }
  ];
  return (
    <div className="inline-flex rounded-full bg-flaeche p-1 shadow-weich ring-1 ring-tinte/5" role="radiogroup" aria-label={L('Bereich wählen', 'Scegli l’area')}>
      {items.map((it) => (
        <button key={it.id} type="button" role="radio" aria-checked={value === it.id} data-testid={`welt-${it.id}`}
          onClick={() => { sfx.tap(); setWorld(it.id); if (value !== it.id) nav(it.to); }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition ${value === it.id ? (it.id === 'adult' ? 'bg-minze-600 text-white' : 'bg-himmel-600 text-white') : 'text-tinte/70 hover:bg-tinte/5'}`}>
          <it.icon size={16} strokeWidth={2.4} aria-hidden />{it.label}
        </button>
      ))}
    </div>
  );
}

/** Logo „Lernito“ mit Bereichs-Etikett (School, Kids, Teen, Adult). */
export function Brand({ tag, tone = 'sonne' }: { tag: string; tone?: 'sonne' | 'minze' | 'himmel' | 'lila' }) {
  const chip = { sonne: 'bg-sonne-100 text-sonne-700', minze: 'bg-minze-100 text-minze-700', himmel: 'bg-himmel-100 text-himmel-700', lila: 'bg-lila-100 text-lila-700' }[tone];
  return (
    <span className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
      <img src={`${import.meta.env.BASE_URL}puppy/kopf.png`} alt="" className="h-10 w-10 rounded-xl bg-sonne-100 ring-2 ring-sonne-300" />
      <span>Lernito<span className={`ml-1 rounded-md px-1.5 py-0.5 align-middle text-xs font-bold ${chip}`} data-testid="marke">{tag}</span></span>
    </span>
  );
}
