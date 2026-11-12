import { Link } from 'react-router-dom';
import { ArrowRight, Clapperboard, Box, Gamepad2, Languages, Map as MapIcon } from 'lucide-react';
import { useActiveProfile } from '../../store/useApp';
import { colorSet, IconBadge, PageHero, StarCount } from '../../components/ui';
import { Lino } from '../../components/Lino';
import { L } from '../../i18n';
import { sfx } from '../../lib/sound';

/** Alles, was über die Fächer hinaus Spaß macht – eine Quelle für die Seite „Entdecken“ und die Startseite. */
export const DISCOVER_ITEMS = () => [
  { to: '/lingue', icon: Languages, title: L('Sprachen', 'Lingue'), text: L('Sprechen, hören und verstehen', 'Parla, ascolta e capisci'), color: 'sonne' },
  { to: '/videos', icon: Clapperboard, title: L('Lernvideos', 'Video lezioni'), text: L('Kurze Erklärvideos mit Quiz', 'Brevi video con quiz'), color: 'koralle' },
  { to: '/welt3d', icon: Box, title: L('3D-Lernwelt', 'Mondo 3D'), text: L('Drehen, zählen und Körper entdecken', 'Gira, conta e scopri i solidi'), color: 'himmel' },
  { to: '/minispiele', icon: Gamepad2, title: L('Mini-Spiele', 'Minigiochi'), text: L('Kleine Pausen-Spiele', 'Piccoli giochi per la pausa'), color: 'minze' },
  { to: '/abenteuer', icon: MapIcon, title: L('Lernabenteuer', 'La mia avventura'), text: L('Deine Reise durch die Lernwelt', 'Il tuo viaggio nel mondo dello studio'), color: 'lila' }
];

/** Seite „Entdecken“: Videos, 3D-Welt, Mini-Spiele und Abenteuer. */
export function DiscoverPage() {
  const { progress } = useActiveProfile();
  return (
    <div style={{ paddingTop: 'var(--safe-top)' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pt-5 sm:px-6">
        <h1 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">{L('Entdecken', 'Scopri')}</h1>
        <StarCount n={progress.stars} />
      </div>
      <main className="seite" data-testid="entdecken-seite">
        <PageHero color="himmel" title={L('Was willst du ausprobieren?', 'Cosa vuoi provare?')}
          subtitle={L('Videos, 3D-Welt und kleine Spiele für zwischendurch.', 'Video, mondo 3D e piccoli giochi per una pausa.')}
          art={<span className="-my-8 block"><Lino mood="jubel" size={104} /></span>} />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {DISCOVER_ITEMS().map((it) => {
            const c = colorSet(it.color);
            return (
              <Link key={it.to} to={it.to} onClick={() => sfx.tap()} data-testid={`entdecken-${it.to.slice(1)}`}
                className="karte-3d group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 sm:p-5">
                <IconBadge icon={it.icon} color={it.color} size="xl" />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-bold leading-tight">{it.title}</span>
                  <span className="block text-sm text-tinte/55">{it.text}</span>
                </span>
                <ArrowRight size={20} className={`shrink-0 ${c.text} transition group-hover:translate-x-0.5`} aria-hidden />
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
