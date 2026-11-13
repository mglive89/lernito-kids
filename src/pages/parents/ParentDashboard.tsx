import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, ClipboardList, Download, FileText, Settings2, Shield, Trash2, Upload, Users, Accessibility, Wrench } from 'lucide-react';
import { defaultChildSettings, exportAllData, useApp, type Profile, type ProfileProgress } from '../../store/useApp';
import { Avatar, Modal, Notice, ProgressBar, Toggle, ThemePicker } from '../../components/ui';
import { allModules } from '../../learning/registry';
import { needsPractice } from '../../learning/adaptive';
import { levelFromXp, BADGES } from '../../learning/rewards';
import { dateKey, formatMinutes, lastNDays, wochentagKurz } from '../../lib/date';
import { clearAllData } from '../../lib/db';
import { profileLabel } from '../../school/systems';
import { L, LANGS, locale, tr, type Lang } from '../../i18n';
import { COUNTRIES, STAGES, yearLabel, type Country } from '../../school/systems';
import { subjectName } from '../../school/subjects';
import type { LearningModule } from '../../learning/types';
import { AVATAR_FARBEN, AVATAR_TIERE } from '../../learning/rewards';

type Tab = 'uebersicht' | 'kinder' | 'ziele' | 'aufgaben' | 'bericht' | 'datenschutz' | 'barrierefrei';
const tabs = (): { id: Tab; label: string; icon: typeof BarChart3 }[] => [
  { id: 'uebersicht', label: L('Fortschritt', 'Progressi'), icon: BarChart3 },
  { id: 'kinder', label: L('Kinderprofile', 'Profili dei bambini'), icon: Users },
  { id: 'ziele', label: L('Ziele & Zeit', 'Obiettivi e tempo'), icon: Settings2 },
  { id: 'aufgaben', label: L('Aufgaben zuweisen', 'Assegna esercizi'), icon: ClipboardList },
  { id: 'bericht', label: L('Bericht', 'Resoconto'), icon: FileText },
  { id: 'datenschutz', label: L('Datenschutz & Daten', 'Privacy e dati'), icon: Shield },
  { id: 'barrierefrei', label: L('Barrierefreiheit', 'Accessibilità'), icon: Accessibility }
];

const areaLabel = (a: string) => ({ kita: L('Kindergarten', 'Scuola dell’infanzia'), schule: L('Schule', 'Scuola'), welt3d: L('3D-Lernwelt', 'Mondo 3D'), video: L('Video-Quiz', 'Quiz video'), lingue: L('Sprachkurse', 'Corsi di lingua') } as Record<string, string>)[a] ?? a;

function groupLabel(m: LearningModule, country: Country = 'DE'): string {
  if (m.area === 'schule') {
    const y = m.years ?? (m.grade ? [m.grade, m.grade] : undefined);
    const yr = y ? (y[0] === y[1] ? yearLabel(country, y[0]) : `${yearLabel(country, y[0]).replace(/ · .*/, '')} – ${yearLabel(country, y[1]).replace(/ · .*/, '')}`) : '';
    return `${subjectName(m.subject ?? '', country)}${yr ? ` · ${yr}` : ''}`;
  }
  return areaLabel(m.area);
}

/** Auswahlliste aller Klassen eines Landes */
function YearSelect({ country, value, onChange, label }: { country: Country; value: number; onChange: (y: number) => void; label: string }) {
  return (
    <select className="feld" value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label}>
      {STAGES.filter((s) => s.country === country).map((s) => (
        <optgroup key={s.id} label={tr(s.name)}>
          {s.years.map((y) => <option key={y} value={y}>{yearLabel(country, y)}</option>)}
        </optgroup>
      ))}
    </select>
  );
}

export function ParentDashboard() {
  const profiles = useApp((s) => s.profiles);
  const [tab, setTab] = useState<Tab>('uebersicht');
  const [childId, setChildId] = useState<string | null>(profiles[0]?.id ?? null);
  const child = profiles.find((p) => p.id === childId) ?? profiles[0];
  const needsChild = ['uebersicht', 'ziele', 'aufgaben', 'bericht'].includes(tab);

  return (
    <main className="seite grid gap-6 lg:grid-cols-[16rem_1fr]">
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label={L('Bereiche', 'Sezioni')}>
        {tabs().map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} data-testid={`tab-${t.id}`} className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-left font-bold ${tab === t.id ? 'bg-himmel-500 text-white' : 'bg-flaeche'}`}>
            <t.icon size={20} /> {t.label}
          </button>
        ))}
        <Link to="/admin" className="flex shrink-0 items-center gap-2 rounded-2xl bg-flaeche px-4 py-3 font-bold" data-testid="zum-admin"><Wrench size={20} /> {L('Inhalte verwalten', 'Gestisci contenuti')}</Link>
      </nav>
      <section className="min-w-0">
        {needsChild && profiles.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label={L('Kind auswählen', 'Scegli il bambino')}>
            {profiles.map((p) => (
              <button key={p.id} role="tab" aria-selected={child?.id === p.id} onClick={() => setChildId(p.id)} className={`flex items-center gap-2 rounded-full px-3 py-2 font-bold ${child?.id === p.id ? 'bg-sonne-300' : 'bg-flaeche'}`}>
                <Avatar config={p.avatar} size={32} /> {p.name}
              </button>
            ))}
          </div>
        )}
        {needsChild && !child && <Notice>{L('Es gibt noch kein Kinderprofil. Legen Sie unter „Kinderprofile“ eines an.', 'Non c’è ancora nessun profilo. Createne uno in «Profili dei bambini».')}</Notice>}
        {tab === 'uebersicht' && child && <Overview child={child} />}
        {tab === 'kinder' && <Children />}
        {tab === 'ziele' && child && <Goals child={child} />}
        {tab === 'aufgaben' && child && <Assign child={child} />}
        {tab === 'bericht' && child && <Report child={child} />}
        {tab === 'datenschutz' && <Privacy />}
        {tab === 'barrierefrei' && <A11y />}
      </section>
    </main>
  );
}

function useChildProgress(id: string): ProfileProgress {
  return useApp((s) => s.progress[id]) ?? { stars: 0, xp: 0, rounds: 0, badges: {}, modules: {}, daily: {}, videos: {}, minigamesPlayed: 0 };
}

function topicStats(progress: ProfileProgress, modules: LearningModule[]) {
  return modules
    .map((m) => ({ m, p: progress.modules[m.id] }))
    .filter((x) => x.p && x.p.rounds > 0)
    .map(({ m, p }) => ({ m, p: p!, rate: p!.tasks ? p!.firstTry / p!.tasks : 0 }))
    .sort((a, b) => b.p.lastPlayed.localeCompare(a.p.lastPlayed));
}

function Overview({ child }: { child: Profile }) {
  const progress = useChildProgress(child.id);
  const custom = useApp((s) => s.customModules);
  const mods = useMemo(() => allModules(custom), [custom]);
  const days = lastNDays(7);
  const weekSec = days.reduce((a, d) => a + (progress.daily[d]?.seconds ?? 0), 0);
  const maxSec = Math.max(600, ...days.map((d) => progress.daily[d]?.seconds ?? 0));
  const stats = topicStats(progress, mods);
  const byGroup = stats.reduce<Record<string, { tasks: number; first: number }>>((acc, s) => {
    const g = groupLabel(s.m, child.country);
    acc[g] ??= { tasks: 0, first: 0 };
    acc[g]!.tasks += s.p.tasks; acc[g]!.first += s.p.firstTry;
    return acc;
  }, {});
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label={L('Sterne', 'Stelle')} value={String(progress.stars)} />
        <Stat label={L('Lernrunden', 'Turni')} value={String(progress.rounds)} />
        <Stat label="Level" value={String(levelFromXp(progress.xp).level)} />
        <Stat label={L('Lernzeit (7 Tage)', 'Tempo di studio (7 giorni)')} value={formatMinutes(weekSec)} />
      </div>
      <div className="karte p-5">
        <h3 className="mb-4 font-display text-xl font-bold">{L('Lernzeit pro Tag', 'Tempo di studio al giorno')}</h3>
        <div className="flex h-44 items-end gap-2">
          {days.map((d) => {
            const sec = progress.daily[d]?.seconds ?? 0;
            return (
              <div key={d} className="flex flex-1 flex-col items-center gap-1" aria-label={`${d}: ${formatMinutes(sec)}`}>
                <span className="text-xs">{sec ? formatMinutes(sec) : ''}</span>
                <div className="w-full rounded-t-lg bg-himmel-500" style={{ height: `${(sec / maxSec) * 120}px` }} />
                <span className="text-sm">{wochentagKurz(new Date(`${d}T12:00:00`).getDay())}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="karte p-5">
        <h3 className="mb-3 font-display text-xl font-bold">{L('Bereiche', 'Aree')}</h3>
        {Object.keys(byGroup).length === 0 && <p className="text-tinte/70">{L('Noch keine Lernrunden gespielt.', 'Ancora nessun turno giocato.')}</p>}
        <ul className="flex flex-col gap-3">
          {Object.entries(byGroup).map(([g, v]) => (
            <li key={g}>
              <div className="mb-1 flex justify-between"><span className="font-bold">{g}</span><span>{L(`${Math.round((v.first / Math.max(1, v.tasks)) * 100)} % auf Anhieb · ${v.tasks} Aufgaben`, `${Math.round((v.first / Math.max(1, v.tasks)) * 100)} % al primo colpo · ${v.tasks} esercizi`)}</span></div>
              <ProgressBar value={v.first / Math.max(1, v.tasks)} />
            </li>
          ))}
        </ul>
      </div>
      <div className="karte overflow-x-auto p-5">
        <h3 className="mb-3 font-display text-xl font-bold">{L('Themenübersicht', 'Panoramica degli argomenti')}</h3>
        {stats.length === 0 ? <p className="text-tinte/70">{L('Noch keine Themen bearbeitet.', 'Ancora nessun argomento svolto.')}</p> : (
          <table className="w-full min-w-[36rem] text-left">
            <thead><tr className="border-b"><th className="py-2">{L('Thema', 'Argomento')}</th><th>{L('Bereich', 'Area')}</th><th>{L('Runden', 'Turni')}</th><th>{L('Auf Anhieb', 'Al primo colpo')}</th><th>{L('Stufe', 'Livello')}</th><th>{L('Hinweis', 'Nota')}</th></tr></thead>
            <tbody>
              {stats.map(({ m, p, rate }) => (
                <tr key={m.id} className="border-b border-tinte/5">
                  <td className="py-2 font-bold"><span className="emoji mr-1">{m.emoji}</span>{tr(m.title)}</td>
                  <td>{groupLabel(m, child.country)}</td>
                  <td>{p.rounds}</td>
                  <td>{Math.round(rate * 100)} %</td>
                  <td>{['', L('Leicht', 'Facile'), L('Mittel', 'Medio'), L('Knifflig', 'Difficile')][p.level]}</td>
                  <td>{needsPractice(p) ? <span className="rounded-full bg-sonne-100 px-2 py-0.5 text-sm">{L('Wiederholung empfohlen', 'Ripasso consigliato')}</span> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-3 text-sm text-tinte/60">{L('„Auf Anhieb“ zählt Aufgaben, die beim ersten Versuch gelöst wurden. Kinder sehen diese Quote nicht – sie bekommen nur ermutigende Rückmeldungen.', '«Al primo colpo» conta gli esercizi risolti al primo tentativo. I bambini non vedono questa percentuale: ricevono solo messaggi di incoraggiamento.')}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="karte p-4"><div className="font-display text-3xl font-bold">{value}</div><div className="text-tinte/70">{label}</div></div>;
}

function Children() {
  const profiles = useApp((s) => s.profiles);
  const update = useApp((s) => s.updateProfile);
  const del = useApp((s) => s.deleteProfile);
  const reset = useApp((s) => s.resetProfileProgress);
  const add = useApp((s) => s.addProfile);
  const [confirm, setConfirm] = useState<{ kind: 'delete' | 'reset'; p: Profile } | null>(null);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState<Country>(L('DE', 'IT') as Country);
  const [newYear, setNewYear] = useState(0);
  return (
    <div className="flex flex-col gap-4">
      {profiles.map((p) => (
        <div key={p.id} className="karte flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <Avatar config={p.avatar} size={56} />
          <div className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <input className="feld" value={p.name} maxLength={20} onChange={(e) => update(p.id, { name: e.target.value })} aria-label={L('Name', 'Nome')} />
            <select className="feld" value={p.country} onChange={(e) => update(p.id, { country: e.target.value as Country })} aria-label={L('Land', 'Paese')} data-testid={`land-${p.name}`}>
              {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{c.flag} {tr(c.name)}</option>)}
            </select>
            <YearSelect country={p.country} value={p.year} onChange={(y) => update(p.id, { year: y })} label={L('Klasse', 'Classe')} />
            <select className="feld" value={p.lang} onChange={(e) => update(p.id, { lang: e.target.value as Lang })} aria-label={L('Sprache', 'Lingua')}>
              {LANGS.map((l) => <option key={l.id} value={l.id}>{l.flag} {l.name}</option>)}
            </select>
          </div>
          <button className="knopf bg-flaeche text-base" onClick={() => setConfirm({ kind: 'reset', p })}>{L('Fortschritt zurücksetzen', 'Azzera i progressi')}</button>
          <button className="knopf bg-koralle-100 text-base" onClick={() => setConfirm({ kind: 'delete', p })} aria-label={L(`${p.name} löschen`, `Elimina ${p.name}`)}><Trash2 size={20} /> {L('Löschen', 'Elimina')}</button>
        </div>
      ))}
      <form className="karte flex flex-col gap-3 p-5 sm:flex-row sm:items-end" onSubmit={(e) => { e.preventDefault(); if (!newName.trim()) return; add({ name: newName.trim(), country: newCountry, lang: COUNTRIES.find((c) => c.id === newCountry)!.defaultLang, year: newYear, avatar: { animal: AVATAR_TIERE[Math.floor(Math.random() * AVATAR_TIERE.length)]!, color: AVATAR_FARBEN[0]!, extra: 'keins' } }); setNewName(''); }}>
        <label className="flex-1"><span className="mb-1 block font-bold">{L('Neues Kind', 'Nuovo bambino')}</span><input className="feld" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={L('Spitzname', 'Soprannome')} maxLength={20} /></label>
        <select className="feld sm:w-44" value={newCountry} onChange={(e) => { setNewCountry(e.target.value as Country); setNewYear(0); }} aria-label={L('Land', 'Paese')}>
          {COUNTRIES.map((c) => <option key={c.id} value={c.id}>{c.flag} {tr(c.name)}</option>)}
        </select>
        <div className="sm:w-56"><YearSelect country={newCountry} value={newYear} onChange={setNewYear} label={L('Klasse', 'Classe')} /></div>
        <button className="knopf bg-minze-500 text-white" type="submit">{L('Hinzufügen', 'Aggiungi')}</button>
      </form>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.kind === 'delete' ? L('Profil löschen?', 'Eliminare il profilo?') : L('Fortschritt zurücksetzen?', 'Azzerare i progressi?')}>
        <p className="mb-4">{confirm?.kind === 'delete' ? L(`Das Profil „${confirm?.p.name}“ und alle Lerndaten werden dauerhaft von diesem Gerät gelöscht.`, `Il profilo «${confirm?.p.name}» e tutti i dati verranno eliminati definitivamente da questo dispositivo.`) : L(`Sterne, Abzeichen und Lernstände von „${confirm?.p.name}“ werden auf null gesetzt.`, `Stelle, distintivi e progressi di «${confirm?.p.name}» verranno azzerati.`)}</p>
        <div className="flex gap-2">
          <button className="knopf bg-koralle-500 text-white" onClick={() => { if (confirm) { if (confirm.kind === 'delete') { del(confirm.p.id); } else { reset(confirm.p.id); } } setConfirm(null); }}>{confirm?.kind === 'delete' ? L('Ja, löschen', 'Sì, elimina') : L('Ja, zurücksetzen', 'Sì, azzera')}</button>
          <button className="knopf bg-flaeche" onClick={() => setConfirm(null)}>{L('Abbrechen', 'Annulla')}</button>
        </div>
      </Modal>
    </div>
  );
}

function Goals({ child }: { child: Profile }) {
  const settings = useApp((s) => s.childSettings[child.id]) ?? defaultChildSettings();
  const set = useApp((s) => s.setChildSettings);
  const progress = useChildProgress(child.id);
  const today = progress.daily[dateKey()]?.seconds ?? 0;
  return (
    <div className="flex flex-col gap-4">
      <div className="karte p-5">
        <label className="mb-2 block font-display text-xl font-bold" htmlFor="ziel">{L('Tägliches Lernziel (freiwillig)', 'Obiettivo giornaliero (facoltativo)')}</label>
        <div className="flex items-center gap-4">
          <input id="ziel" type="range" min={1} max={10} value={settings.dailyGoalRounds} onChange={(e) => set(child.id, { dailyGoalRounds: Number(e.target.value) })} className="flex-1 accent-minze-500" data-testid="tagesziel" />
          <span className="w-28 font-bold">{settings.dailyGoalRounds} {settings.dailyGoalRounds === 1 ? L('Runde', 'turno') : L('Runden', 'turni')}</span>
        </div>
        <p className="mt-2 text-sm text-tinte/60">{L('Das Ziel motiviert, es gibt aber keine Strafen oder Serien, die verloren gehen.', 'L’obiettivo motiva, ma non ci sono punizioni né serie da perdere.')}</p>
      </div>
      <div className="karte p-5">
        <span className="mb-2 block font-display text-xl font-bold">{L('Zeitlimit pro Tag', 'Limite di tempo al giorno')}</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={L('Zeitlimit', 'Limite di tempo')}>
          {[null, 10, 15, 20, 30, 45, 60].map((m) => (
            <button key={String(m)} role="radio" aria-checked={settings.timeLimitMin === m} onClick={() => set(child.id, { timeLimitMin: m })} data-testid={`limit-${m ?? 'aus'}`} className={`rounded-full px-4 py-2 font-bold ${settings.timeLimitMin === m ? 'bg-himmel-500 text-white' : 'bg-creme'}`}>
              {m === null ? L('Kein Limit', 'Nessun limite') : `${m} min`}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-tinte/60">{L(`Heute gelernt: ${formatMinutes(today)}. Ist das Limit erreicht, zeigt Puppy freundlich eine Pause an. Mit der Eltern-PIN lässt sich die Zeit verlängern.`, `Oggi: ${formatMinutes(today)}. Quando il limite è raggiunto, Puppy propone gentilmente una pausa. Con il PIN dei genitori si può prolungare.`)}</p>
      </div>
      <Toggle label={L('Vorlesefunktion', 'Lettura ad alta voce')} description={L('Aufgaben werden automatisch vorgelesen (Web Speech API des Geräts).', 'Gli esercizi vengono letti automaticamente (Web Speech API del dispositivo).')} checked={settings.speech} onChange={(v) => set(child.id, { speech: v })} />
      <Toggle label={L('Soundeffekte', 'Effetti sonori')} description={L('Kurze, leise Töne bei Antworten.', 'Suoni brevi e leggeri alle risposte.')} checked={settings.sounds} onChange={(v) => set(child.id, { sounds: v })} />
    </div>
  );
}

function Assign({ child }: { child: Profile }) {
  const settings = useApp((s) => s.childSettings[child.id]);
  const set = useApp((s) => s.setChildSettings);
  const custom = useApp((s) => s.customModules);
  const mods = useMemo(() => allModules(custom).filter((m) => m.area !== 'video'), [custom]);
  const groups = mods.filter((m) => !m.countries || m.countries.includes(child.country)).reduce<Record<string, LearningModule[]>>((acc, m) => { (acc[groupLabel(m, child.country)] ??= []).push(m); return acc; }, {});
  const assigned = settings?.assigned ?? [];
  const toggle = (id: string) => set(child.id, { assigned: assigned.includes(id) ? assigned.filter((x) => x !== id) : [...assigned, id] });
  return (
    <div className="flex flex-col gap-4">
      <Notice>{L(`Zugewiesene Übungen erscheinen bei ${child.name} auf der Startseite unter „Aufgaben für dich“. Aktuell zugewiesen: ${assigned.length}.`, `Gli esercizi assegnati compaiono nella pagina iniziale di ${child.name} in «Compiti per te». Assegnati ora: ${assigned.length}.`)}</Notice>
      {Object.entries(groups).map(([g, list]) => (
        <details key={g} className="karte p-4" open={list.some((m) => assigned.includes(m.id))}>
          <summary className="cursor-pointer font-display text-lg font-bold">{g} <span className="text-sm font-normal text-tinte/60">({list.filter((m) => assigned.includes(m.id)).length}/{list.length})</span></summary>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {list.map((m) => (
              <li key={m.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-creme p-3">
                  <input type="checkbox" className="h-6 w-6 accent-minze-500" checked={assigned.includes(m.id)} onChange={() => toggle(m.id)} data-testid={`assign-${m.id}`} />
                  <span className="emoji text-2xl">{m.emoji}</span>
                  <span className="font-bold">{tr(m.title)}</span>
                </label>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

function Report({ child }: { child: Profile }) {
  const progress = useChildProgress(child.id);
  const custom = useApp((s) => s.customModules);
  const stats = topicStats(progress, allModules(custom));
  const days = lastNDays(7);
  const week = days.reduce((a, d) => ({ sec: a.sec + (progress.daily[d]?.seconds ?? 0), rounds: a.rounds + (progress.daily[d]?.rounds ?? 0), stars: a.stars + (progress.daily[d]?.stars ?? 0) }), { sec: 0, rounds: 0, stars: 0 });
  const strong = stats.filter((s) => s.rate >= 0.8).slice(0, 5);
  const practice = stats.filter((s) => needsPractice(s.p)).slice(0, 5);
  const text = [
    L(`Lernbericht für ${child.name} (${profileLabel(child)})`, `Resoconto di ${child.name} (${profileLabel(child)})`),
    L(`Zeitraum: ${days[0]} bis ${days[6]}`, `Periodo: dal ${days[0]} al ${days[6]}`),
    L(`Lernzeit: ${formatMinutes(week.sec)} · Runden: ${week.rounds} · Sterne: ${week.stars}`, `Tempo di studio: ${formatMinutes(week.sec)} · Turni: ${week.rounds} · Stelle: ${week.stars}`),
    L(`Abzeichen gesamt: ${Object.keys(progress.badges).length} von ${BADGES.length}`, `Distintivi: ${Object.keys(progress.badges).length} su ${BADGES.length}`),
    `${L('Stärken', 'Punti di forza')}: ${strong.map((s) => tr(s.m.title)).join(', ') || '–'}`,
    `${L('Zum Üben empfohlen', 'Da ripassare')}: ${practice.map((s) => tr(s.m.title)).join(', ') || '–'}`
  ].join('\n');
  const download = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${L('lernbericht', 'resoconto')}-${child.name}-${dateKey()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="flex flex-col gap-4">
      <article className="karte p-6 print:shadow-none" id="bericht">
        <h3 className="mb-2 font-display text-2xl font-bold">{L('Wochenbericht', 'Resoconto settimanale')}: {child.name}</h3>
        <p className="mb-4 text-tinte/70">{new Date(`${days[0]}T12:00:00`).toLocaleDateString(locale())} – {new Date(`${days[6]}T12:00:00`).toLocaleDateString(locale())}</p>
        <ul className="mb-4 grid gap-2 sm:grid-cols-3">
          <li className="rounded-xl bg-creme p-3"><b>{formatMinutes(week.sec)}</b><br />{L('Lernzeit', 'Tempo di studio')}</li>
          <li className="rounded-xl bg-creme p-3"><b>{week.rounds}</b><br />{L('Runden', 'Turni')}</li>
          <li className="rounded-xl bg-creme p-3"><b>{week.stars}</b><br />{L('Sterne', 'Stelle')}</li>
        </ul>
        <h4 className="font-bold">{L('Stärken', 'Punti di forza')}</h4>
        <p className="mb-3">{strong.map((s) => tr(s.m.title)).join(', ') || L('Noch nicht genug Daten.', 'Dati non ancora sufficienti.')}</p>
        <h4 className="font-bold">{L('Zum Üben empfohlen', 'Da ripassare')}</h4>
        <p>{practice.map((s) => tr(s.m.title)).join(', ') || L('Aktuell keine.', 'Al momento nessuno.')}</p>
      </article>
      <div className="flex flex-wrap gap-2">
        <button className="knopf bg-himmel-500 text-white" onClick={() => window.print()}><FileText /> {L('Drucken / als PDF', 'Stampa / PDF')}</button>
        <button className="knopf bg-flaeche" onClick={download}><Download /> {L('Als Textdatei', 'Come file di testo')}</button>
      </div>
      <p className="text-sm text-tinte/60">{L('Berichte werden nur auf Wunsch erstellt und nicht automatisch versendet.', 'I resoconti vengono creati solo su richiesta e non vengono inviati automaticamente.')}</p>
    </div>
  );
}

function Privacy() {
  const parent = useApp((s) => s.parent);
  const setParent = useApp((s) => s.setParent);
  const importData = useApp((s) => s.importData);
  const wipe = useApp((s) => s.wipeAll);
  const nav = useNavigate();
  const [wipeOpen, setWipeOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [msg, setMsg] = useState<{ tone: 'ok' | 'warn'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const syncConfigured = Boolean(import.meta.env.VITE_SUPABASE_URL);
  const aiConfigured = Boolean(import.meta.env.VITE_AI_PROXY_URL);
  const confirmWord = L('LÖSCHEN', 'CANCELLA');
  const consent = (patch: Partial<typeof parent>) => setParent({ ...patch, consentUpdatedAt: new Date().toISOString() });

  const doExport = () => {
    const blob = new Blob([exportAllData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lernito-daten-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg({ tone: 'ok', text: L('Export erstellt.', 'Esportazione creata.') });
  };
  const doImport = async (f: File) => {
    try { importData(JSON.parse(await f.text())); setMsg({ tone: 'ok', text: L('Daten wurden importiert.', 'Dati importati.') }); }
    catch (e) { setMsg({ tone: 'warn', text: e instanceof Error ? e.message : L('Import fehlgeschlagen.', 'Importazione non riuscita.') }); }
  };

  return (
    <div className="flex flex-col gap-4">
      <Notice>{L('Alle Daten liegen ausschließlich auf diesem Gerät. Online-Dienste sind standardmäßig deaktiviert und werden nur mit Ihrer Zustimmung genutzt.', 'Tutti i dati restano solo su questo dispositivo. I servizi online sono disattivati di default e si usano solo con il vostro consenso.')}</Notice>
      <Toggle
        label={L('Online-Synchronisierung (Elternkonto)', 'Sincronizzazione online (account genitori)')}
        description={syncConfigured ? L('Fortschritte werden verschlüsselt mit Ihrem Elternkonto synchronisiert.', 'I progressi vengono sincronizzati in modo cifrato con il vostro account.') : L('Vorbereitet, aber in dieser Installation nicht eingerichtet (kein Server konfiguriert). Ihre Zustimmung wird nur gespeichert.', 'Predisposta, ma non configurata in questa installazione (nessun server). Il consenso viene solo memorizzato.')}
        checked={parent.consentOnlineSync}
        onChange={(v) => consent({ consentOnlineSync: v })}
        testId="consent-sync"
      />
      <Toggle
        label={L('KI-Lernhilfe (nur durch Erwachsene aktivierbar)', 'Aiuto IA (attivabile solo da un adulto)')}
        description={<>{L('Gibt zusätzliche, vorformulierte Erklärungen zu Aufgaben. Kein offener Chat für Kinder, Anfragen laufen nur über einen moderierten Server (keine API-Schlüssel in der App).', 'Fornisce spiegazioni aggiuntive agli esercizi. Nessuna chat libera per i bambini: le richieste passano solo da un server moderato (nessuna chiave API nell’app).')} {aiConfigured ? '' : <b>{L('In dieser Installation nicht eingerichtet – bleibt ohne Funktion.', 'Non configurato in questa installazione: resta inattivo.')}</b>}</>}
        checked={parent.consentAiHelper}
        onChange={(v) => consent({ consentAiHelper: v })}
        testId="consent-ai"
      />
      <Toggle
        label={L('Mikrofon für Aussprache und Sprachantworten', 'Microfono per pronuncia e risposte a voce')}
        description={L('Kinder können in den Sprachkursen nachsprechen und Quizfragen mit der Stimme beantworten. Die Spracherkennung übernimmt der Browser; je nach Gerät wird die Aufnahme dafür an dessen Anbieter (z. B. Google oder Apple) übertragen. Lernito speichert keine Aufnahmen.', 'I bambini possono ripetere le frasi nei corsi di lingua e rispondere ai quiz con la voce. Il riconoscimento vocale è fornito dal browser; a seconda del dispositivo, l’audio può essere inviato al suo fornitore (ad es. Google o Apple). Lernito non salva registrazioni.')}
        checked={!!parent.consentVoice}
        onChange={(v) => consent({ consentVoice: v })}
        testId="consent-voice"
      />
      <Toggle
        label={L('Kamera für die Hausaufgaben-Hilfe', 'Fotocamera per l’aiuto compiti')}
        description={L('Kinder können eine Mathe-Aufgabe fotografieren und bekommen den Lösungsweg erklärt. Das Foto wird nur auf diesem Gerät gelesen, nicht hochgeladen und nicht gespeichert.', 'I bambini possono fotografare un esercizio di matematica e ricevere la spiegazione. La foto viene letta solo su questo dispositivo: non viene caricata né salvata.')}
        checked={!!parent.consentCamera}
        onChange={(v) => consent({ consentCamera: v })}
        testId="consent-camera"
      />
      {parent.consentUpdatedAt && <p className="text-sm text-tinte/60">{L('Einwilligungen zuletzt geändert:', 'Consensi modificati il:')} {new Date(parent.consentUpdatedAt).toLocaleString(locale())}</p>}

      <div className="karte flex flex-col gap-3 p-5">
        <h3 className="font-display text-xl font-bold">{L('Ihre Daten', 'I vostri dati')}</h3>
        <div className="flex flex-wrap gap-2">
          <button className="knopf bg-himmel-500 text-white" onClick={doExport} data-testid="export"><Download /> {L('Alle Daten exportieren', 'Esporta tutti i dati')}</button>
          <button className="knopf bg-flaeche" onClick={() => fileRef.current?.click()}><Upload /> {L('Daten importieren', 'Importa dati')}</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ''; }} />
          <button className="knopf bg-koralle-500 text-white" onClick={() => setWipeOpen(true)} data-testid="alles-loeschen"><Trash2 /> {L('Alle Daten löschen', 'Cancella tutti i dati')}</button>
        </div>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      </div>
      <Link to="/datenschutz" className="flex items-center gap-2 underline"><BookOpen size={18} /> {L('Datenschutz-Informationen ansehen', 'Leggi le informazioni sulla privacy')}</Link>

      <Modal open={wipeOpen} onClose={() => setWipeOpen(false)} title={L('Alle Daten löschen?', 'Cancellare tutti i dati?')}>
        <p className="mb-3">{L('Alle Profile, Lernstände, Einstellungen, die PIN sowie eigene Inhalte und Medien werden unwiderruflich von diesem Gerät gelöscht.', 'Tutti i profili, i progressi, le impostazioni, il PIN e i contenuti propri verranno cancellati per sempre da questo dispositivo.')}</p>
        <label className="mb-3 block">{L('Zur Bestätigung bitte', 'Per confermare scrivete')} <b>{confirmWord}</b>{L(' eingeben:', ':')}<input className="feld mt-1" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} data-testid="loeschen-bestaetigen" /></label>
        <button className="knopf w-full bg-koralle-500 text-white" disabled={confirmText.trim().toUpperCase() !== confirmWord} onClick={async () => { wipe(); await clearAllData(); setWipeOpen(false); nav('/'); }} data-testid="loeschen-final">{L('Endgültig löschen', 'Cancella definitivamente')}</button>
      </Modal>
    </div>
  );
}

function A11y() {
  const parent = useApp((s) => s.parent);
  const setParent = useApp((s) => s.setParent);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className="font-bold">{L('Erscheinungsbild', 'Aspetto')}</span>
        <ThemePicker id="thema-eltern" />
        <span className="text-sm text-tinte/60">{L('Dunkles Thema schont die Augen am Abend. Bei hohem Kontrast bleibt die App hell.', 'Il tema scuro riposa gli occhi la sera. Con il contrasto elevato l’app resta chiara.')}</span>
      </div>
      <Toggle label={L('Hoher Kontrast', 'Contrasto elevato')} description={L('Stärkere Rahmen und Kontraste.', 'Bordi e contrasti più marcati.')} checked={parent.highContrast} onChange={(v) => setParent({ highContrast: v })} />
      <Toggle label={L('Größere Schrift', 'Testo più grande')} description={L('Alle Texte werden etwas größer dargestellt.', 'Tutti i testi vengono mostrati un po’ più grandi.')} checked={parent.largeText} onChange={(v) => setParent({ largeText: v })} />
      <Toggle label={L('Weniger Bewegung', 'Meno animazioni')} description={L('Animationen werden reduziert.', 'Le animazioni vengono ridotte.')} checked={parent.reduceMotion} onChange={(v) => setParent({ reduceMotion: v })} />
    </div>
  );
}
