import { Star } from 'lucide-react';
import { useActiveProfile } from '../store/useApp';
import { Tile } from './ui';
import type { LearningModule } from '../learning/types';
import type { ModuleProgress } from '../learning/adaptive';
import { needsPractice } from '../learning/adaptive';
import { L, tr } from '../i18n';

const stufe = (l: number) => [L('', ''), L('Leicht', 'Facile'), L('Mittel', 'Medio'), L('Knifflig', 'Difficile')][l] ?? '';


function ModuleBadge({ p }: { p?: ModuleProgress }) {
  if (!p || p.rounds === 0) return <span className="chip bg-himmel-50 px-2 py-0.5 text-xs text-himmel-700">{L('Neu', 'Nuovo')}</span>;
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 shadow-weich" aria-label={L(`${p.bestStars} von 3 Sternen, Stufe ${stufe(p.level)}`, `${p.bestStars} stelle su 3, livello ${stufe(p.level)}`)}>
      {[1, 2, 3].map((i) => <Star key={i} size={14} className={i <= p.bestStars ? 'fill-sonne-500 text-sonne-500' : 'text-tinte/20'} />)}
    </span>
  );
}

/** Raster aus Spiel-/Themenkacheln (Kita, 3D-Welt, Lehrer-Aufgaben). */
export function ModuleGrid({ modules }: { modules: LearningModule[] }) {
  const { progress } = useActiveProfile();
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {modules.map((m) => (
        <Tile key={m.id} to={`/spiel/${m.id}`} emoji={m.emoji} title={tr(m.title)} subtitle={tr(m.subtitle)} color={m.color} badge={<ModuleBadge p={progress.modules[m.id]} />} testId={`modul-${m.id}`}>
          {progress.modules[m.id]?.rounds ? <span className="relative mt-auto text-xs font-bold text-tinte/55">{L('Stufe', 'Livello')}: {stufe(progress.modules[m.id]!.level)}{needsPractice(progress.modules[m.id]) ? L(' · Nochmal üben', ' · Da ripassare') : ''}</span> : null}
        </Tile>
      ))}
    </div>
  );
}

