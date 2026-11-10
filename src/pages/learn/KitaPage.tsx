import { useApp, useActiveProfile } from '../../store/useApp';
import { TopBar } from '../../components/ui';
import { LinoSays } from '../../components/Lino';
import { ModuleGrid } from '../../components/ModuleGrid';
import { kitaModules } from '../../learning/registry';
import { L, getLang, tr } from '../../i18n';
import { stageFor } from '../../school/systems';

export function KitaPage() {
  const custom = useApp((s) => s.customModules);
  const { profile, progress } = useActiveProfile();
  const mods = kitaModules(custom).filter((m) => !m.langs || m.langs.includes(getLang()));
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={tr(stageFor(profile?.country ?? 'DE', 0).name)} back="/home" stars={progress.stars} />
      <main className="seite">
        <LinoSays text={L('Such dir ein Spiel aus! Tippe auf ein Bild.', 'Scegli un gioco! Tocca un’immagine.')} size={80} />
        <div className="mt-6"><ModuleGrid modules={mods} /></div>
      </main>
    </div>
  );
}

