import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, ClipboardList, Download, FileText, Settings2, Shield, Trash2, Upload, Users, Accessibility, Wrench } from 'lucide-react';
import { defaultChildSettings, exportAllData, useApp, type AgeGroup, type Profile, type ProfileProgress } from '../../store/useApp';
import { Avatar, Modal, Notice, ProgressBar, Toggle } from '../../components/ui';
import { allModules } from '../../learning/registry';
import { needsPractice } from '../../learning/adaptive';
import { levelFromXp, BADGES } from '../../learning/rewards';
import { dateKey, formatMinutes, lastNDays, WOCHENTAGE_KURZ } from '../../lib/date';
import { clearAllData } from '../../lib/db';
import { AGE_LABEL } from '../Start';
import type { LearningModule } from '../../learning/types';
import { AVATAR_FARBEN, AVATAR_TIERE } from '../../learning/rewards';

type Tab = 'uebersicht' | 'kinder' | 'ziele' | 'aufgaben' | 'bericht' | 'datenschutz' | 'barrierefrei';
const TABS: { id: Tab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'uebersicht', label: 'Fortschritt', icon: BarChart3 },
  { id: 'kinder', label: 'Kinderprofile', icon: Users },
  { id: 'ziele', label: 'Ziele & Zeit', icon: Settings2 },
  { id: 'aufgaben', label: 'Aufgaben zuweisen', icon: ClipboardList },
  { id: 'bericht', label: 'Bericht', icon: FileText },
  { id: 'datenschutz', label: 'Datenschutz & Daten', icon: Shield },
  { id: 'barrierefrei', label: 'Barrierefreiheit', icon: Accessibility }
];

const AREA_LABEL: Record<string, string> = { kita: 'Kindergarten', schule: 'Grundschule', welt3d: '3D-Lernwelt', video: 'Video-Quiz' };
const SUBJECT_LABEL: Record<string, string> = { mathe: 'Mathematik', deutsch: 'Deutsch', sachunterricht: 'Sachunterricht', englisch: 'Englisch' };

function groupLabel(m: LearningModule): string {
  if (m.area === 'schule') return `${m.grade ? `Klasse ${m.grade} · ` : ''}${SUBJECT_LABEL[m.subject ?? ''] ?? m.subject}`;
  return AREA_LABEL[m.area] ?? m.area;
}

export function ParentDashboard() {
  const profiles = useApp((s) => s.profiles);
  const [tab, setTab] = useState<Tab>('uebersicht');
  const [childId, setChildId] = useState<string | null>(profiles[0]?.id ?? null);
  const child = profiles.find((p) => p.id === childId) ?? profiles[0];
  const needsChild = ['uebersicht', 'ziele', 'aufgaben', 'bericht'].includes(tab);

  return (
    <main className="seite grid gap-6 lg:grid-cols-[16rem_1fr]">
      <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible" aria-label="Bereiche">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} aria-current={tab === t.id} data-testid={`tab-${t.id}`} className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-left font-bold ${tab === t.id ? 'bg-himmel-500 text-white' : 'bg-white'}`}>
            <t.icon size={20} /> {t.label}
          </button>
        ))}
        <Link to="/admin" className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-3 font-bold" data-testid="zum-admin"><Wrench size={20} /> Inhalte verwalten</Link>
      </nav>
      <section className="min-w-0">
        {needsChild && profiles.length > 1 && (
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Kind auswählen">
            {profiles.map((p) => (
              <button key={p.id} role="tab" aria-selected={child?.id === p.id} onClick={() => setChildId(p.id)} className={`flex items-center gap-2 rounded-full px-3 py-2 font-bold ${child?.id === p.id ? 'bg-sonne-300' : 'bg-white'}`}>
                <Avatar config={p.avatar} size={32} /> {p.name}
              </button>
            ))}
          </div>
        )}
        {needsChild && !child && <Notice>Es gibt noch kein Kinderprofil. Legen Sie unter „Kinderprofile“ eines an.</Notice>}
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
    const g = groupLabel(s.m);
    acc[g] ??= { tasks: 0, first: 0 };
    acc[g]!.tasks += s.p.tasks; acc[g]!.first += s.p.firstTry;
    return acc;
  }, {});
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Sterne" value={String(progress.stars)} />
        <Stat label="Lernrunden" value={String(progress.rounds)} />
        <Stat label="Level" value={String(levelFromXp(progress.xp).level)} />
        <Stat label="Lernzeit (7 Tage)" value={formatMinutes(weekSec)} />
      </div>
      <div className="karte p-5">
        <h3 className="mb-4 font-display text-xl font-bold">Lernzeit pro Tag</h3>
        <div className="flex h-44 items-end gap-2">
          {days.map((d) => {
            const sec = progress.daily[d]?.seconds ?? 0;
            return (
              <div key={d} className="flex flex-1 flex-col items-center gap-1" aria-label={`${d}: ${formatMinutes(sec)}`}>
                <span className="text-xs">{sec ? formatMinutes(sec) : ''}</span>
                <div className="w-full rounded-t-lg bg-himmel-500" style={{ height: `${(sec / maxSec) * 120}px` }} />
                <span className="text-sm">{WOCHENTAGE_KURZ[new Date(`${d}T12:00:00`).getDay()]}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="karte p-5">
        <h3 className="mb-3 font-display text-xl font-bold">Bereiche</h3>
        {Object.keys(byGroup).length === 0 && <p className="text-tinte/70">Noch keine Lernrunden gespielt.</p>}
        <ul className="flex flex-col gap-3">
          {Object.entries(byGroup).map(([g, v]) => (
            <li key={g}>
              <div className="mb-1 flex justify-between"><span className="font-bold">{g}</span><span>{Math.round((v.first / Math.max(1, v.tasks)) * 100)} % auf Anhieb · {v.tasks} Aufgaben</span></div>
              <ProgressBar value={v.first / Math.max(1, v.tasks)} />
            </li>
          ))}
        </ul>
      </div>
      <div className="karte overflow-x-auto p-5">
        <h3 className="mb-3 font-display text-xl font-bold">Themenübersicht</h3>
        {stats.length === 0 ? <p className="text-tinte/70">Noch keine Themen bearbeitet.</p> : (
          <table className="w-full min-w-[36rem] text-left">
            <thead><tr className="border-b"><th className="py-2">Thema</th><th>Bereich</th><th>Runden</th><th>Auf Anhieb</th><th>Stufe</th><th>Hinweis</th></tr></thead>
            <tbody>
              {stats.map(({ m, p, rate }) => (
                <tr key={m.id} className="border-b border-tinte/5">
                  <td className="py-2 font-bold"><span className="emoji mr-1">{m.emoji}</span>{m.title}</td>
                  <td>{groupLabel(m)}</td>
                  <td>{p.rounds}</td>
                  <td>{Math.round(rate * 100)} %</td>
                  <td>{['', 'Leicht', 'Mittel', 'Knifflig'][p.level]}</td>
                  <td>{needsPractice(p) ? <span className="rounded-full bg-sonne-100 px-2 py-0.5 text-sm">Wiederholung empfohlen</span> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="mt-3 text-sm text-tinte/60">„Auf Anhieb“ zählt Aufgaben, die beim ersten Versuch gelöst wurden. Kinder sehen diese Quote nicht – sie bekommen nur ermutigende Rückmeldungen.</p>
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
  const [newAge, setNewAge] = useState<AgeGroup>('kita');
  return (
    <div className="flex flex-col gap-4">
      {profiles.map((p) => (
        <div key={p.id} className="karte flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
          <Avatar config={p.avatar} size={56} />
          <label className="flex-1">
            <span className="sr-only">Name</span>
            <input className="feld" value={p.name} maxLength={20} onChange={(e) => update(p.id, { name: e.target.value })} />
          </label>
          <label>
            <span className="sr-only">Altersgruppe</span>
            <select className="feld" value={String(p.ageGroup)} onChange={(e) => update(p.id, { ageGroup: e.target.value === 'kita' ? 'kita' : (Number(e.target.value) as AgeGroup) })}>
              {Object.entries(AGE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <button className="knopf bg-white text-base" onClick={() => setConfirm({ kind: 'reset', p })}>Fortschritt zurücksetzen</button>
          <button className="knopf bg-koralle-100 text-base" onClick={() => setConfirm({ kind: 'delete', p })} aria-label={`${p.name} löschen`}><Trash2 size={20} /> Löschen</button>
        </div>
      ))}
      <form className="karte flex flex-col gap-3 p-5 sm:flex-row sm:items-end" onSubmit={(e) => { e.preventDefault(); if (!newName.trim()) return; add({ name: newName.trim(), ageGroup: newAge, avatar: { animal: AVATAR_TIERE[Math.floor(Math.random() * AVATAR_TIERE.length)]!, color: AVATAR_FARBEN[0]!, extra: 'keins' } }); setNewName(''); }}>
        <label className="flex-1"><span className="mb-1 block font-bold">Neues Kind</span><input className="feld" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Spitzname" maxLength={20} /></label>
        <select className="feld sm:w-48" value={String(newAge)} onChange={(e) => setNewAge(e.target.value === 'kita' ? 'kita' : (Number(e.target.value) as AgeGroup))} aria-label="Altersgruppe">
          {Object.entries(AGE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button className="knopf bg-minze-500 text-white" type="submit">Hinzufügen</button>
      </form>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.kind === 'delete' ? 'Profil löschen?' : 'Fortschritt zurücksetzen?'}>
        <p className="mb-4">{confirm?.kind === 'delete' ? `Das Profil „${confirm?.p.name}“ und alle Lerndaten werden dauerhaft von diesem Gerät gelöscht.` : `Sterne, Abzeichen und Lernstände von „${confirm?.p.name}“ werden auf null gesetzt.`}</p>
        <div className="flex gap-2">
          <button className="knopf bg-koralle-500 text-white" onClick={() => { if (confirm) { if (confirm.kind === 'delete') { del(confirm.p.id); } else { reset(confirm.p.id); } } setConfirm(null); }}>Ja, {confirm?.kind === 'delete' ? 'löschen' : 'zurücksetzen'}</button>
          <button className="knopf bg-white" onClick={() => setConfirm(null)}>Abbrechen</button>
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
        <label className="mb-2 block font-display text-xl font-bold" htmlFor="ziel">Tägliches Lernziel (freiwillig)</label>
        <div className="flex items-center gap-4">
          <input id="ziel" type="range" min={1} max={10} value={settings.dailyGoalRounds} onChange={(e) => set(child.id, { dailyGoalRounds: Number(e.target.value) })} className="flex-1 accent-minze-500" data-testid="tagesziel" />
          <span className="w-28 font-bold">{settings.dailyGoalRounds} {settings.dailyGoalRounds === 1 ? 'Runde' : 'Runden'}</span>
        </div>
        <p className="mt-2 text-sm text-tinte/60">Das Ziel motiviert, es gibt aber keine Strafen oder Serien, die verloren gehen.</p>
      </div>
      <div className="karte p-5">
        <span className="mb-2 block font-display text-xl font-bold">Zeitlimit pro Tag</span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Zeitlimit">
          {[null, 10, 15, 20, 30, 45, 60].map((m) => (
            <button key={String(m)} role="radio" aria-checked={settings.timeLimitMin === m} onClick={() => set(child.id, { timeLimitMin: m })} data-testid={`limit-${m ?? 'aus'}`} className={`rounded-full px-4 py-2 font-bold ${settings.timeLimitMin === m ? 'bg-himmel-500 text-white' : 'bg-creme'}`}>
              {m === null ? 'Kein Limit' : `${m} Min.`}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-tinte/60">Heute gelernt: {formatMinutes(today)}. Ist das Limit erreicht, zeigt Puppy freundlich eine Pause an. Mit der Eltern-PIN lässt sich die Zeit verlängern.</p>
      </div>
      <Toggle label="Vorlesefunktion" description="Aufgaben werden automatisch vorgelesen (Web Speech API des Geräts)." checked={settings.speech} onChange={(v) => set(child.id, { speech: v })} />
      <Toggle label="Soundeffekte" description="Kurze, leise Töne bei Antworten." checked={settings.sounds} onChange={(v) => set(child.id, { sounds: v })} />
    </div>
  );
}

function Assign({ child }: { child: Profile }) {
  const settings = useApp((s) => s.childSettings[child.id]);
  const set = useApp((s) => s.setChildSettings);
  const custom = useApp((s) => s.customModules);
  const mods = useMemo(() => allModules(custom).filter((m) => m.area !== 'video'), [custom]);
  const groups = mods.reduce<Record<string, LearningModule[]>>((acc, m) => { (acc[groupLabel(m)] ??= []).push(m); return acc; }, {});
  const assigned = settings?.assigned ?? [];
  const toggle = (id: string) => set(child.id, { assigned: assigned.includes(id) ? assigned.filter((x) => x !== id) : [...assigned, id] });
  return (
    <div className="flex flex-col gap-4">
      <Notice>Zugewiesene Übungen erscheinen bei {child.name} auf der Startseite unter „Aufgaben für dich“. Aktuell zugewiesen: {assigned.length}.</Notice>
      {Object.entries(groups).map(([g, list]) => (
        <details key={g} className="karte p-4" open={list.some((m) => assigned.includes(m.id))}>
          <summary className="cursor-pointer font-display text-lg font-bold">{g} <span className="text-sm font-normal text-tinte/60">({list.filter((m) => assigned.includes(m.id)).length}/{list.length})</span></summary>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {list.map((m) => (
              <li key={m.id}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-creme p-3">
                  <input type="checkbox" className="h-6 w-6 accent-minze-500" checked={assigned.includes(m.id)} onChange={() => toggle(m.id)} data-testid={`assign-${m.id}`} />
                  <span className="emoji text-2xl">{m.emoji}</span>
                  <span className="font-bold">{m.title}</span>
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
    `Lernbericht für ${child.name} (${AGE_LABEL[String(child.ageGroup)]})`,
    `Zeitraum: ${days[0]} bis ${days[6]}`,
    `Lernzeit: ${formatMinutes(week.sec)} · Runden: ${week.rounds} · Sterne: ${week.stars}`,
    `Abzeichen gesamt: ${Object.keys(progress.badges).length} von ${BADGES.length}`,
    `Stärken: ${strong.map((s) => s.m.title).join(', ') || '–'}`,
    `Zum Üben empfohlen: ${practice.map((s) => s.m.title).join(', ') || '–'}`
  ].join('\n');
  const download = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lernbericht-${child.name}-${dateKey()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="flex flex-col gap-4">
      <article className="karte p-6 print:shadow-none" id="bericht">
        <h3 className="mb-2 font-display text-2xl font-bold">Wochenbericht: {child.name}</h3>
        <p className="mb-4 text-tinte/70">{new Date(`${days[0]}T12:00:00`).toLocaleDateString('de-DE')} – {new Date(`${days[6]}T12:00:00`).toLocaleDateString('de-DE')}</p>
        <ul className="mb-4 grid gap-2 sm:grid-cols-3">
          <li className="rounded-xl bg-creme p-3"><b>{formatMinutes(week.sec)}</b><br />Lernzeit</li>
          <li className="rounded-xl bg-creme p-3"><b>{week.rounds}</b><br />Runden</li>
          <li className="rounded-xl bg-creme p-3"><b>{week.stars}</b><br />Sterne</li>
        </ul>
        <h4 className="font-bold">Stärken</h4>
        <p className="mb-3">{strong.map((s) => s.m.title).join(', ') || 'Noch nicht genug Daten.'}</p>
        <h4 className="font-bold">Zum Üben empfohlen</h4>
        <p>{practice.map((s) => s.m.title).join(', ') || 'Aktuell keine.'}</p>
      </article>
      <div className="flex flex-wrap gap-2">
        <button className="knopf bg-himmel-500 text-white" onClick={() => window.print()}><FileText /> Drucken / als PDF</button>
        <button className="knopf bg-white" onClick={download}><Download /> Als Textdatei</button>
      </div>
      <p className="text-sm text-tinte/60">Berichte werden nur auf Wunsch erstellt und nicht automatisch versendet.</p>
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
  const consent = (patch: Partial<typeof parent>) => setParent({ ...patch, consentUpdatedAt: new Date().toISOString() });

  const doExport = () => {
    const blob = new Blob([exportAllData()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lernito-daten-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg({ tone: 'ok', text: 'Export erstellt.' });
  };
  const doImport = async (f: File) => {
    try { importData(JSON.parse(await f.text())); setMsg({ tone: 'ok', text: 'Daten wurden importiert.' }); }
    catch (e) { setMsg({ tone: 'warn', text: e instanceof Error ? e.message : 'Import fehlgeschlagen.' }); }
  };

  return (
    <div className="flex flex-col gap-4">
      <Notice>Alle Daten liegen ausschließlich auf diesem Gerät. Online-Dienste sind standardmäßig deaktiviert und werden nur mit Ihrer Zustimmung genutzt.</Notice>
      <Toggle
        label="Online-Synchronisierung (Elternkonto)"
        description={syncConfigured ? 'Fortschritte werden verschlüsselt mit Ihrem Elternkonto synchronisiert.' : 'Vorbereitet, aber in dieser Installation nicht eingerichtet (kein Server konfiguriert). Ihre Zustimmung wird nur gespeichert.'}
        checked={parent.consentOnlineSync}
        onChange={(v) => consent({ consentOnlineSync: v })}
        testId="consent-sync"
      />
      <Toggle
        label="KI-Lernhilfe (nur durch Erwachsene aktivierbar)"
        description={<>Gibt zusätzliche, vorformulierte Erklärungen zu Aufgaben. Kein offener Chat für Kinder, Anfragen laufen nur über einen moderierten Server (keine API-Schlüssel in der App). {aiConfigured ? '' : <b>In dieser Installation nicht eingerichtet – bleibt ohne Funktion.</b>}</>}
        checked={parent.consentAiHelper}
        onChange={(v) => consent({ consentAiHelper: v })}
        testId="consent-ai"
      />
      {parent.consentUpdatedAt && <p className="text-sm text-tinte/60">Einwilligungen zuletzt geändert: {new Date(parent.consentUpdatedAt).toLocaleString('de-DE')}</p>}

      <div className="karte flex flex-col gap-3 p-5">
        <h3 className="font-display text-xl font-bold">Ihre Daten</h3>
        <div className="flex flex-wrap gap-2">
          <button className="knopf bg-himmel-500 text-white" onClick={doExport} data-testid="export"><Download /> Alle Daten exportieren</button>
          <button className="knopf bg-white" onClick={() => fileRef.current?.click()}><Upload /> Daten importieren</button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void doImport(f); e.target.value = ''; }} />
          <button className="knopf bg-koralle-500 text-white" onClick={() => setWipeOpen(true)} data-testid="alles-loeschen"><Trash2 /> Alle Daten löschen</button>
        </div>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      </div>
      <Link to="/datenschutz" className="flex items-center gap-2 underline"><BookOpen size={18} /> Datenschutz-Informationen ansehen</Link>

      <Modal open={wipeOpen} onClose={() => setWipeOpen(false)} title="Alle Daten löschen?">
        <p className="mb-3">Alle Profile, Lernstände, Einstellungen, die PIN sowie eigene Inhalte und Medien werden unwiderruflich von diesem Gerät gelöscht.</p>
        <label className="mb-3 block">Zur Bestätigung bitte <b>LÖSCHEN</b> eingeben:<input className="feld mt-1" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} data-testid="loeschen-bestaetigen" /></label>
        <button className="knopf w-full bg-koralle-500 text-white" disabled={confirmText.trim().toUpperCase() !== 'LÖSCHEN'} onClick={async () => { wipe(); await clearAllData(); setWipeOpen(false); nav('/'); }} data-testid="loeschen-final">Endgültig löschen</button>
      </Modal>
    </div>
  );
}

function A11y() {
  const parent = useApp((s) => s.parent);
  const setParent = useApp((s) => s.setParent);
  return (
    <div className="flex flex-col gap-3">
      <Toggle label="Hoher Kontrast" description="Stärkere Rahmen und Kontraste." checked={parent.highContrast} onChange={(v) => setParent({ highContrast: v })} />
      <Toggle label="Größere Schrift" description="Alle Texte werden etwas größer dargestellt." checked={parent.largeText} onChange={(v) => setParent({ largeText: v })} />
      <Toggle label="Weniger Bewegung" description="Animationen werden reduziert." checked={parent.reduceMotion} onChange={(v) => setParent({ reduceMotion: v })} />
    </div>
  );
}
