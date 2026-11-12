import { Link, useNavigate, useParams } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useApp, useActiveProfile } from '../../store/useApp';
import { TopBar, COLOR_CLASSES } from '../../components/ui';
import { LinoSays } from '../../components/Lino';
import { GuideContent } from '../../components/GuideContent';
import { findModule } from '../../learning/registry';
import { pathDoneOf } from '../../learning/adaptive';
import { L, tr } from '../../i18n';

/** Theorie-Seite eines Themas mit „Jetzt üben“. */
export function GuidePage() {
  const { moduleId } = useParams();
  const custom = useApp((s) => s.customModules);
  const { progress } = useActiveProfile();
  const nav = useNavigate();
  const mod = moduleId ? findModule(moduleId, custom) : undefined;
  if (!mod) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 p-6">
        <LinoSays text={L('Dieses Thema gibt es nicht (mehr).', 'Questo argomento non esiste (più).')} mood="denken" />
        <button className="knopf bg-sonne-500" onClick={() => nav('/home')}>{L('Zur Übersicht', 'Alla pagina iniziale')}</button>
      </div>
    );
  }
  const c = COLOR_CLASSES[mod.color] ?? COLOR_CLASSES.himmel!;
  const done = pathDoneOf(progress.modules[mod.id]);
  const step = Math.min(3, done + 1);
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('Theorie', 'Teoria')} back={-1} stars={progress.stars} />
      <main className="seite flex max-w-3xl flex-col gap-6 pb-32">
        <header className={`flex items-center gap-4 rounded-blob p-5 ${c.soft}`}>
          <span className="emoji flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-4xl shadow-weich" aria-hidden>{mod.emoji}</span>
          <div className="min-w-0">
            <p className={`eyebrow ${c.text}`}>{L('Thema', 'Argomento')}</p>
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{tr(mod.title)}</h1>
            <p className="text-tinte/70">{tr(mod.subtitle)}</p>
          </div>
        </header>
        <GuideContent module={mod} />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-tinte/[0.07] bg-white/95 backdrop-blur" style={{ paddingBottom: 'var(--safe-bottom)' }}>
        <div className="mx-auto flex max-w-3xl px-4 py-3">
          <Link to={`/spiel/${mod.id}${(mod.area === 'schule' || mod.area === 'lingue') ? `?lektion=${step}` : ''}`} className="knopf w-full bg-himmel-500 text-white" data-testid="theorie-ueben">
            <Play size={20} /> {done > 0 ? L('Weiter üben', 'Continua a esercitarti') : L('Jetzt üben', 'Inizia gli esercizi')}
          </Link>
        </div>
      </div>
    </div>
  );
}
