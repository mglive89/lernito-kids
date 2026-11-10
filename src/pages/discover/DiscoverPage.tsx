import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useActiveProfile } from '../../store/useApp';
import { colorSet, PageHero, StarCount } from '../../components/ui';
import { Lino } from '../../components/Lino';
import { L } from '../../i18n';
import { sfx } from '../../lib/sound';

/** Alles, was über die Fächer hinaus Spaß macht – eine Quelle für die Seite „Entdecken“ und die Startseite. */
export const DISCOVER_ITEMS = () => [
  { to: '/videos', emoji: '🎬', title: L('Lernvideos', 'Video lezioni'), text: L('Kurze Erklärvideos mit Quiz', 'Brevi video con quiz'), color: 'koralle' },
  { to: '/welt3d', emoji: '🧊', title: L('3D-Lernwelt', 'Mondo 3D'), text: L('Drehen, zählen und Körper entdecken', 'Gira, conta e scopri i solidi'), color: 'himmel' },
  { to: '/minispiele', emoji: '🫧', title: L('Mini-Spiele', 'Minigiochi'), text: L('Kleine Pausen-Spiele', 'Piccoli giochi per la pausa'), color: 'minze' },
  { to: '/abenteuer', emoji: '🗺️', title: L('Lernabenteuer', 'La mia avventura'), text: L('Deine Reise durch die Lernwelt', 'Il tuo viaggio nel mondo dello studio'), color: 'lila' }
];

/** Seite „Entdecken“: Videos, 3D-Welt, Mini-Spiele und Abenteuer. */
export function DiscoverPage() {
  const { progress } = useActiveProfile();
  return (
    <div style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 sm:px-6"><StarCount n={progress.stars} /></div>
      <main className="seite" data-testid="entdecken-seite">
        <PageHero color="koralle" eyebrow={L('Entdecken', 'Scopri')} title={L('Was willst du ausprobieren?', 'Cosa vuoi provare?')}
          subtitle={L('Videos, 3D-Welt und kleine Spiele für zwischendurch.', 'Video, mondo 3D e piccoli giochi per una pausa.')}
          art={<span className="-my-6 block"><Lino mood="jubel" size={104} /></span>} />
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DISCOVER_ITEMS().map((it) => {
            const c = colorSet(it.color);
            return (
              <Link key={it.to} to={it.to} onClick={() => sfx.tap()} data-testid={`entdecken-${it.to.slice(1)}`}
                className="karte-3d group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 sm:p-5">
                <span className={`emoji flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-5xl transition-transform group-hover:-rotate-6 group-hover:scale-105 ${c.soft}`} aria-hidden>{it.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xl font-bold leading-tight">{it.title}</span>
                  <span className="block text-tinte/60">{it.text}</span>
                </span>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${c.bg}`} aria-hidden><ChevronRight size={22} strokeWidth={3} /></span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
