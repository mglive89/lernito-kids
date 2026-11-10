import { Link } from 'react-router-dom';
import { useActiveProfile } from '../../store/useApp';
import { Notice, SectionTitle, TopBar } from '../../components/ui';
import { LinoSays } from '../../components/Lino';
import { ModuleGrid } from '../../components/ModuleGrid';
import { world3dModules } from '../../learning/registry';
import { L } from '../../i18n';
import { hasWebGL } from '../../lib/webgl';

export function World3DPage() {
  const { progress } = useActiveProfile();
  const webgl = hasWebGL();
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={L('3D-Lernwelt', 'Mondo 3D')} back="/entdecken" stars={progress.stars} />
      <main className="seite">
        <LinoSays text={L('Hier kannst du Dinge drehen, sammeln und entdecken!', 'Qui puoi girare, raccogliere e scoprire tante cose!')} size={80} />
        <div className="my-4">
          {webgl
            ? <Notice tone="ok">{L('3D läuft auf diesem Gerät. Ziehe mit dem Finger, um die Welt zu drehen.', 'Il 3D funziona su questo dispositivo. Trascina con il dito per girare il mondo.')}</Notice>
            : <Notice tone="warn">{L('Dein Gerät unterstützt kein 3D (WebGL). Alle Aufgaben funktionieren trotzdem – in einer 2D-Ansicht.', 'Il tuo dispositivo non supporta il 3D (WebGL). Tutti gli esercizi funzionano lo stesso, in una vista 2D.')}</Notice>}
        </div>
        <ModuleGrid modules={world3dModules()} />
        <SectionTitle>{L('Passt dazu', 'Ti potrebbe piacere')}</SectionTitle>
        <Link to="/spiel/m3-geometrie" className="font-bold text-himmel-700 underline">{L('Geometrie-Quiz mit 3D-Körpern', 'Quiz di geometria con i solidi 3D')}</Link>
      </main>
    </div>
  );
}
