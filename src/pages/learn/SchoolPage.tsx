import { useSearchParams } from 'react-router-dom';
import { useApp, useActiveProfile } from '../../store/useApp';
import { SectionTitle, SubjectIcon, Tile, TopBar, AnimatedGrid } from '../../components/ui';
import { schoolModules } from '../../learning/registry';
import { L, tr } from '../../i18n';
import { stageFor, stagesOf, yearLabel, type SubjectId } from '../../school/systems';
import { subjectDef, subjectName } from '../../school/subjects';

/** Fächer, die die Eltern freigeschaltet haben. */
export function useSubjectFilter() {
  const enabled = useApp((s) => s.subjects);
  return (id: string) => {
    const on = (x: string) => enabled.find((s) => s.id === x)?.enabled ?? true;
    return on(id) || (subjectDef(id)?.includes ?? []).some(on);
  };
}

/** Fächerübersicht: Schulform, Klasse, Fächer. */
export function SchoolPage() {
  const [params, setParams] = useSearchParams();
  const { profile, progress } = useActiveProfile();
  const custom = useApp((s) => s.customModules);
  const allowed = useSubjectFilter();
  const customSubjects = useApp((s) => s.subjects).filter((x) => !x.builtin && x.enabled);
  const country = profile?.country ?? 'DE';
  const fromProfile = profile && profile.year > 0 ? profile.year : 1;
  const year = Math.min(13, Math.max(1, Number(params.get('jahr')) || fromProfile));
  const stage = stageFor(country, year);
  const stages = stagesOf(country).filter((s) => s.years[0]! > 0);
  const tile = (id: SubjectId, big = false) => {
    const d = subjectDef(id);
    const count = schoolModules(country, year, id, custom).length;
    return (
      <Tile key={id} to={`/schule/${year}/${id}`} icon={<SubjectIcon id={id} color={d?.color} size="lg" />} title={subjectName(id, country)}
        subtitle={count ? L(`${count} ${count === 1 ? 'Thema' : 'Themen'}`, `${count} ${count === 1 ? 'argomento' : 'argomenti'}`) : L('Bald verfügbar', 'Presto disponibile')}
        color={d?.color ?? 'himmel'} big={big} testId={`fach-${id}`} />
    );
  };
  return (
    <div className="min-h-[100dvh]">
      <TopBar title={tr(stage.name)} back="/home" stars={progress.stars} />
      <main className="seite">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label={L('Schulform', 'Tipo di scuola')}>
          {stages.map((s) => (
            <button key={s.id} role="tab" aria-selected={stage.id === s.id} onClick={() => setParams({ jahr: String(s.id === stage.id ? year : s.years[0]) })} data-testid={`stufe-${s.id}`}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${stage.id === s.id ? 'bg-tinte text-white' : 'bg-white text-tinte/70 ring-1 ring-tinte/10 hover:bg-tinte/[0.03]'}`}>
              {tr(s.name)}
            </button>
          ))}
        </div>
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-tinte/[0.05] p-1" role="tablist" aria-label={L('Klasse', 'Classe')}>
          {stage.years.map((y) => (
            <button key={y} role="tab" aria-selected={year === y} onClick={() => setParams({ jahr: String(y) })} data-testid={`klasse-${y}`}
              className={`shrink-0 grow whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition sm:text-base ${year === y ? 'bg-white text-tinte shadow-weich' : 'text-tinte/60 hover:text-tinte'}`}>
              {yearLabel(country, y).replace(/ · .*/, '')}
            </button>
          ))}
        </div>
        <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {stage.subjects.filter(allowed).map((id) => tile(id))}
        </AnimatedGrid>
        {customSubjects.length > 0 && (
          <>
            <SectionTitle>{L('Weitere Fächer', 'Altre materie')}</SectionTitle>
            <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {customSubjects.map((c) => <Tile key={c.id} to={`/schule/${year}/${c.id}`} emoji={c.emoji} title={c.name} subtitle={L(`${schoolModules(country, year, c.id, custom).length} Themen`, `${schoolModules(country, year, c.id, custom).length} argomenti`)} color="lila" testId={`fach-${c.id}`} />)}
            </AnimatedGrid>
          </>
        )}
        {stage.extras.some(allowed) && (
          <>
            <SectionTitle>{L('Zusatzfächer', 'Materie extra')}</SectionTitle>
            <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{stage.extras.filter(allowed).map((id) => tile(id))}</AnimatedGrid>
          </>
        )}
        <p className="mt-8 text-center text-sm text-tinte/55">
          {country === 'IT'
            ? L('Die Themen orientieren sich an den Indicazioni nazionali (Primaria, Secondaria di I grado) und den Lehrplänen der Oberschulen. Schulspezifische Schwerpunkte können abweichen.', 'Gli argomenti seguono le Indicazioni nazionali (primaria e secondaria di I grado) e i programmi delle superiori. Le scelte delle singole scuole possono variare.')
            : L('Die Themen orientieren sich an typischen Lehrplänen der Bundesländer (KMK-Bildungsstandards). Je nach Land und Schulform können Reihenfolge und Umfang abweichen.', 'Gli argomenti seguono i programmi tipici dei Länder tedeschi (standard KMK). Ordine e contenuti possono variare per Land e tipo di scuola.')}
        </p>
      </main>
    </div>
  );
}

