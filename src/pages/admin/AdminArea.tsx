import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Eye, Film, Image as ImageIcon, LayoutGrid, LogOut, Pencil, Plus, Trash2, BookMarked } from 'lucide-react';
import { useApp, type CustomVideo } from '../../store/useApp';
import { Modal, Notice, TopBar } from '../../components/ui';
import { PinPad } from '../../components/PinPad';
import { AdultCheck } from '../parents/ParentArea';
import { BUILTIN_MODULES } from '../../learning/registry';
import { customToModule, validateCustomModule, type CustomModule, type CustomQuestion, type SubjectSetting } from '../../learning/custom';
import { deleteMedia, getMediaBlob, listMedia, putMedia, type MediaMeta } from '../../lib/db';
import { GameRunner } from '../../games/GameRunner';
import type { Difficulty, Grade } from '../../learning/types';

const COLORS: CustomModule['color'][] = ['sonne', 'himmel', 'minze', 'koralle', 'lila'];
const newId = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

function AdminGate({ onDone }: { onDone: () => void }) {
  const hasPin = useApp((s) => !!s.parent.adminPinHash);
  const setAdminPin = useApp((s) => s.setAdminPin);
  const verify = useApp((s) => s.verifyAdminPin);
  const [step, setStep] = useState<'check' | 'pin'>(hasPin ? 'pin' : 'check');
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-5">
      <Notice tone="warn">
        <b>Lokaler Redaktionsmodus.</b> Für den produktiven Betrieb muss die Admin-Oberfläche über eine serverseitige Anmeldung mit Rollen (z. B. Supabase Auth + Row Level Security, siehe <code>supabase/schema.sql</code>) geschützt werden. Die Admin-PIN schützt nur dieses Gerät.
      </Notice>
      {step === 'check' && <AdultCheck onPass={() => setStep('pin')} />}
      {step === 'pin' && (
        <PinPad
          testId="admin-pin"
          label={hasPin ? 'Admin-PIN eingeben' : 'Admin-PIN festlegen (4–6 Ziffern)'}
          error={err}
          onSubmit={(p) => {
            if (!hasPin) { setAdminPin(p); onDone(); return; }
            if (verify(p)) onDone(); else setErr('Falsche Admin-PIN.');
          }}
        />
      )}
    </div>
  );
}

export default function AdminArea() {
  const unlocked = useApp((s) => s.adminUnlocked);
  const setUnlocked = useApp((s) => s.setAdminUnlocked);
  const nav = useNavigate();
  if (!unlocked) {
    return (
      <div className="min-h-[100dvh]">
        <TopBar title="Inhalte verwalten" back="/eltern" />
        <main className="seite"><AdminGate onDone={() => setUnlocked(true)} /></main>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="vorschau/:id" element={<Preview />} />
      <Route path="*" element={
        <div className="min-h-[100dvh] bg-white/60">
          <TopBar title="Inhalte verwalten" back="/eltern" right={<button className="knopf bg-white text-base" onClick={() => { setUnlocked(false); nav('/'); }}><LogOut size={20} /> Abmelden</button>} />
          <AdminDashboard />
        </div>
      } />
    </Routes>
  );
}

function Preview() {
  const { id } = useParams();
  const mod = useApp((s) => s.customModules.find((m) => m.id === id));
  if (!mod) return <div className="seite"><Notice tone="warn">Modul nicht gefunden.</Notice><Link to="/admin" className="underline">Zurück</Link></div>;
  return (
    <GameRunner
      module={customToModule(mod)}
      level={mod.difficulty}
      speechOn={false}
      preview
      backTo="/admin"
      onFinish={(r) => ({ stars: r.solved, xp: 0, levelBefore: 1, levelAfter: 1, difficultyBefore: mod.difficulty, difficultyAfter: mod.difficulty, badges: [] })}
    />
  );
}

type Tab = 'module' | 'faecher' | 'medien' | 'videos';

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('module');
  const tabs: { id: Tab; label: string; icon: typeof LayoutGrid }[] = [
    { id: 'module', label: 'Lernmodule', icon: LayoutGrid },
    { id: 'faecher', label: 'Fächer', icon: BookMarked },
    { id: 'medien', label: 'Bilder & Videos', icon: ImageIcon },
    { id: 'videos', label: 'Video-Lektionen', icon: Film }
  ];
  return (
    <main className="seite flex flex-col gap-5">
      <div className="flex gap-2 overflow-x-auto" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} data-testid={`admin-tab-${t.id}`} className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 font-bold ${tab === t.id ? 'bg-lila-500 text-white' : 'bg-white'}`}>
            <t.icon size={20} /> {t.label}
          </button>
        ))}
      </div>
      {tab === 'module' && <ModulesTab />}
      {tab === 'faecher' && <SubjectsTab />}
      {tab === 'medien' && <MediaTab />}
      {tab === 'videos' && <VideosTab />}
    </main>
  );
}

const emptyQuestion = (): CustomQuestion => ({ id: newId('q'), prompt: '', options: ['', '', '', ''], correctIndex: 0, hint: '', explain: '' });
const emptyModule = (): CustomModule => ({
  id: newId('custom'), title: '', subtitle: '', emoji: '✨', color: 'himmel', target: 1, subject: 'mathe', difficulty: 1, published: false, questions: [emptyQuestion()], updatedAt: ''
});

function ModulesTab() {
  const mods = useApp((s) => s.customModules);
  const save = useApp((s) => s.saveCustomModule);
  const del = useApp((s) => s.deleteCustomModule);
  const nav = useNavigate();
  const [editing, setEditing] = useState<CustomModule | null>(null);
  const [toDelete, setToDelete] = useState<CustomModule | null>(null);
  if (editing) return <ModuleEditor initial={editing} onClose={() => setEditing(null)} />;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="flex-1 font-display text-2xl font-bold">Eigene Lernmodule</h2>
        <button className="knopf bg-minze-500 text-white" onClick={() => setEditing(emptyModule())} data-testid="modul-neu"><Plus /> Neues Modul</button>
      </div>
      {mods.length === 0 && <Notice>Noch keine eigenen Module. Eingebaute Module: {BUILTIN_MODULES.length} (fest im Code, siehe src/learning/modules).</Notice>}
      <ul className="flex flex-col gap-3">
        {mods.map((m) => (
          <li key={m.id} className="karte flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <span className="emoji text-4xl">{m.emoji}</span>
            <div className="flex-1">
              <p className="font-display text-xl font-bold">{m.title}</p>
              <p className="text-sm text-tinte/70">{m.target === 'kita' ? 'Kindergarten' : `Klasse ${m.target} · ${m.subject}`} · Stufe {m.difficulty} · {m.questions.length} Fragen</p>
            </div>
            <label className="flex items-center gap-2 font-bold">
              <input type="checkbox" className="h-6 w-6 accent-minze-500" checked={m.published} onChange={(e) => { if (!e.target.checked || validateCustomModule(m).length === 0) save({ ...m, published: e.target.checked }); }} data-testid={`publish-${m.id}`} />
              Veröffentlicht
            </label>
            <div className="flex gap-2">
              <button className="knopf bg-white px-3 text-base" onClick={() => nav(`/admin/vorschau/${m.id}`)} aria-label="Vorschau"><Eye size={20} /></button>
              <button className="knopf bg-white px-3 text-base" onClick={() => setEditing(m)} aria-label="Bearbeiten"><Pencil size={20} /></button>
              <button className="knopf bg-koralle-100 px-3 text-base" onClick={() => setToDelete(m)} aria-label="Löschen"><Trash2 size={20} /></button>
            </div>
          </li>
        ))}
      </ul>
      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Modul löschen?">
        <p className="mb-4">„{toDelete?.title}“ wird gelöscht. Bereits gesammelte Sterne der Kinder bleiben erhalten.</p>
        <button className="knopf bg-koralle-500 text-white" onClick={() => { if (toDelete) del(toDelete.id); setToDelete(null); }}>Löschen</button>
      </Modal>
    </div>
  );
}

function ModuleEditor({ initial, onClose }: { initial: CustomModule; onClose: () => void }) {
  const save = useApp((s) => s.saveCustomModule);
  const subjects = useApp((s) => s.subjects);
  const [m, setM] = useState<CustomModule>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [images, setImages] = useState<MediaMeta[]>([]);
  useEffect(() => { void listMedia().then((l) => setImages(l.filter((x) => x.kind === 'image'))); }, []);
  const setQ = (i: number, patch: Partial<CustomQuestion>) => setM((x) => ({ ...x, questions: x.questions.map((q, k) => (k === i ? { ...q, ...patch } : q)) }));
  const submit = (publish?: boolean) => {
    const next = { ...m, published: publish ?? m.published };
    const errs = validateCustomModule(next);
    if (errs.length && next.published) { setErrors(errs); return; }
    if (!next.title.trim()) { setErrors(['Bitte einen Titel angeben.']); return; }
    save(next);
    onClose();
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <h2 className="font-display text-2xl font-bold">{initial.title ? 'Modul bearbeiten' : 'Neues Modul'}</h2>
      <div className="karte grid gap-3 p-5 sm:grid-cols-2">
        <label>Titel<input className="feld" value={m.title} onChange={(e) => setM({ ...m, title: e.target.value })} data-testid="modul-titel" required /></label>
        <label>Untertitel<input className="feld" value={m.subtitle} onChange={(e) => setM({ ...m, subtitle: e.target.value })} /></label>
        <label>Symbol (Emoji)<input className="feld" value={m.emoji} maxLength={4} onChange={(e) => setM({ ...m, emoji: e.target.value })} /></label>
        <label>Farbe
          <select className="feld" value={m.color} onChange={(e) => setM({ ...m, color: e.target.value as CustomModule['color'] })}>{COLORS.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        </label>
        <label>Klassenstufe
          <select className="feld" value={String(m.target)} onChange={(e) => setM({ ...m, target: e.target.value === 'kita' ? 'kita' : (Number(e.target.value) as Grade) })} data-testid="modul-stufe">
            <option value="kita">Kindergarten</option>{[1, 2, 3, 4].map((g) => <option key={g} value={g}>Klasse {g}</option>)}
          </select>
        </label>
        <label>Fach
          <select className="feld" value={m.subject} disabled={m.target === 'kita'} onChange={(e) => setM({ ...m, subject: e.target.value })} data-testid="modul-fach">
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>Schwierigkeitsgrad
          <select className="feld" value={m.difficulty} onChange={(e) => setM({ ...m, difficulty: Number(e.target.value) as Difficulty })}>
            <option value={1}>1 – Leicht</option><option value={2}>2 – Mittel</option><option value={3}>3 – Knifflig</option>
          </select>
        </label>
      </div>

      {m.questions.map((q, i) => (
        <fieldset key={q.id} className="karte flex flex-col gap-3 p-5">
          <legend className="sr-only">Frage {i + 1}</legend>
          <div className="flex items-center justify-between"><h3 className="font-display text-xl font-bold">Frage {i + 1}</h3>
            {m.questions.length > 1 && <button type="button" className="text-koralle-700 underline" onClick={() => setM({ ...m, questions: m.questions.filter((_, k) => k !== i) })}>Entfernen</button>}
          </div>
          <label>Aufgabentext<input className="feld" value={q.prompt} onChange={(e) => setQ(i, { prompt: e.target.value })} data-testid={`frage-${i}`} /></label>
          <div className="grid gap-2 sm:grid-cols-2">
            {q.options.map((o, k) => (
              <label key={k} className="flex items-center gap-2">
                <input type="radio" name={`richtig-${q.id}`} className="h-5 w-5 accent-minze-500" checked={q.correctIndex === k} onChange={() => setQ(i, { correctIndex: k })} aria-label={`Antwort ${k + 1} ist richtig`} />
                <input className="feld" placeholder={`Antwort ${k + 1}${k === q.correctIndex ? ' (richtig)' : ''}`} value={o} onChange={(e) => setQ(i, { options: q.options.map((x, j) => (j === k ? e.target.value : x)) })} data-testid={`antwort-${i}-${k}`} />
              </label>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label>Hinweis bei Fehler<input className="feld" value={q.hint} onChange={(e) => setQ(i, { hint: e.target.value })} /></label>
            <label>Erklärung<input className="feld" value={q.explain} onChange={(e) => setQ(i, { explain: e.target.value })} /></label>
            <label>Bild-Emoji (optional)<input className="feld" value={q.emoji ?? ''} maxLength={4} onChange={(e) => setQ(i, { emoji: e.target.value || undefined })} /></label>
            <label>Bild aus Mediathek (optional)
              <select className="feld" value={q.imageMediaId ?? ''} onChange={(e) => setQ(i, { imageMediaId: e.target.value || undefined })}>
                <option value="">– kein Bild –</option>
                {images.map((img) => <option key={img.id} value={img.id}>{img.name}</option>)}
              </select>
            </label>
          </div>
        </fieldset>
      ))}
      <button type="button" className="knopf self-start bg-white" onClick={() => setM({ ...m, questions: [...m.questions, emptyQuestion()] })}><Plus /> Frage hinzufügen</button>
      {errors.length > 0 && <Notice tone="warn"><ul className="list-disc pl-5">{errors.map((e) => <li key={e}>{e}</li>)}</ul></Notice>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="knopf bg-himmel-500 text-white" data-testid="modul-speichern">Speichern</button>
        <button type="button" className="knopf bg-minze-500 text-white" onClick={() => submit(true)} data-testid="modul-veroeffentlichen">Speichern & veröffentlichen</button>
        <button type="button" className="knopf bg-white" onClick={onClose}>Abbrechen</button>
      </div>
    </form>
  );
}

function SubjectsTab() {
  const subjects = useApp((s) => s.subjects);
  const setSubjects = useApp((s) => s.setSubjects);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('📘');
  const upd = (id: string, patch: Partial<SubjectSetting>) => setSubjects(subjects.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-2xl font-bold">Fächer verwalten</h2>
      {subjects.map((s) => (
        <div key={s.id} className="karte flex flex-wrap items-center gap-3 p-4">
          <input className="feld w-20 text-center text-2xl" value={s.emoji} maxLength={4} onChange={(e) => upd(s.id, { emoji: e.target.value })} aria-label="Symbol" />
          <input className="feld flex-1" value={s.name} onChange={(e) => upd(s.id, { name: e.target.value })} aria-label="Name" />
          <label className="flex items-center gap-2 font-bold"><input type="checkbox" className="h-6 w-6 accent-minze-500" checked={s.enabled} onChange={(e) => upd(s.id, { enabled: e.target.checked })} /> Sichtbar</label>
          {!s.builtin && <button className="knopf bg-koralle-100 px-3" onClick={() => setSubjects(subjects.filter((x) => x.id !== s.id))} aria-label="Fach löschen"><Trash2 size={20} /></button>}
        </div>
      ))}
      <form className="karte flex flex-wrap items-end gap-3 p-4" onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; setSubjects([...subjects, { id: newId('fach'), name: name.trim(), emoji, enabled: true, builtin: false }]); setName(''); }}>
        <input className="feld w-20 text-center text-2xl" value={emoji} maxLength={4} onChange={(e) => setEmoji(e.target.value)} aria-label="Symbol" />
        <input className="feld flex-1" placeholder="Neues Fach, z. B. Musik" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="knopf bg-minze-500 text-white" type="submit"><Plus /> Hinzufügen</button>
      </form>
    </div>
  );
}

function MediaTab() {
  const [items, setItems] = useState<MediaMeta[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ url: string; kind: string } | null>(null);
  const reload = () => void listMedia().then(setItems).catch(() => setErr('Mediathek konnte nicht geladen werden.'));
  useEffect(reload, []);
  const upload = async (files: FileList | null) => {
    if (!files) return;
    setBusy(true); setErr(null);
    try {
      for (const f of Array.from(files)) {
        const ok = f.type.startsWith('image/') || f.type.startsWith('video/') || f.name.endsWith('.vtt');
        if (!ok) { setErr(`„${f.name}“: Nur Bilder, Videos und WebVTT-Untertitel (.vtt) sind erlaubt.`); continue; }
        if (f.size > 200 * 1024 * 1024) { setErr(`„${f.name}“ ist größer als 200 MB.`); continue; }
        await putMedia(f.name.endsWith('.vtt') ? new File([f], f.name, { type: 'text/vtt' }) : f, f.name);
      }
      reload();
    } catch { setErr('Upload fehlgeschlagen (Speicher voll?).'); } finally { setBusy(false); }
  };
  const open = async (m: MediaMeta) => { const b = await getMediaBlob(m.id); if (b) setPreview({ url: URL.createObjectURL(b), kind: m.kind }); };
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-2xl font-bold">Bilder & Videos</h2>
      <Notice>Verwenden Sie nur eigene Dateien oder Dateien mit passender Lizenz. Dateien werden lokal gespeichert (IndexedDB). Für den Produktivbetrieb ist ein Supabase-Storage-Bucket vorgesehen.</Notice>
      <label className="knopf cursor-pointer self-start bg-minze-500 text-white">
        <Plus /> {busy ? 'Wird hochgeladen …' : 'Dateien hochladen'}
        <input type="file" multiple accept="image/*,video/*,.vtt,text/vtt" className="hidden" onChange={(e) => { void upload(e.target.files); e.target.value = ''; }} data-testid="media-upload" />
      </label>
      {err && <Notice tone="warn">{err}</Notice>}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <li key={m.id} className="karte flex items-center gap-3 p-4">
            <span className="emoji text-3xl">{m.kind === 'image' ? '🖼️' : m.kind === 'video' ? '🎞️' : '💬'}</span>
            <div className="min-w-0 flex-1"><p className="truncate font-bold">{m.name}</p><p className="text-sm text-tinte/60">{(m.size / 1024).toFixed(0)} KB</p></div>
            {m.kind !== 'subtitle' && <button className="knopf bg-white px-3" onClick={() => void open(m)} aria-label="Ansehen"><Eye size={18} /></button>}
            <button className="knopf bg-koralle-100 px-3" onClick={() => void deleteMedia(m.id).then(reload)} aria-label="Löschen"><Trash2 size={18} /></button>
          </li>
        ))}
      </ul>
      <Modal open={!!preview} onClose={() => { if (preview) URL.revokeObjectURL(preview.url); setPreview(null); }} title="Vorschau">
        {preview?.kind === 'image' && <img src={preview.url} alt="Vorschau" className="max-h-[60vh] w-full object-contain" />}
        {preview?.kind === 'video' && <video src={preview.url} controls className="w-full" />}
      </Modal>
    </div>
  );
}

function VideosTab() {
  const videos = useApp((s) => s.customVideos);
  const save = useApp((s) => s.saveCustomVideo);
  const del = useApp((s) => s.deleteCustomVideo);
  const modules = useApp((s) => s.customModules);
  const subjects = useApp((s) => s.subjects);
  const [media, setMedia] = useState<MediaMeta[]>([]);
  const [draft, setDraft] = useState<CustomVideo | null>(null);
  useEffect(() => { void listMedia().then(setMedia); }, []);
  const vids = media.filter((m) => m.kind === 'video');
  const subs = media.filter((m) => m.kind === 'subtitle');
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="flex-1 font-display text-2xl font-bold">Video-Lektionen</h2>
        <button className="knopf bg-minze-500 text-white" disabled={vids.length === 0} onClick={() => setDraft({ id: newId('vid'), title: '', description: '', subject: 'mathe', topic: '', mediaId: vids[0]?.id ?? '', published: false, updatedAt: '' })}><Plus /> Neue Lektion</button>
      </div>
      {vids.length === 0 && <Notice>Laden Sie zuerst unter „Bilder & Videos“ eine Videodatei hoch (optional mit .vtt-Untertiteln).</Notice>}
      <Notice>Eingebaute Beispiel-Lektion: „Was bedeutet Plus?“ (animiert, mit Untertiteln und Quiz).</Notice>
      <ul className="flex flex-col gap-3">
        {videos.map((v) => (
          <li key={v.id} className="karte flex flex-wrap items-center gap-3 p-4">
            <span className="emoji text-3xl">🎞️</span>
            <div className="flex-1"><p className="font-bold">{v.title}</p><p className="text-sm text-tinte/60">{v.topic} · {v.published ? 'veröffentlicht' : 'Entwurf'}</p></div>
            <button className="knopf bg-white px-3" onClick={() => setDraft(v)} aria-label="Bearbeiten"><Pencil size={18} /></button>
            <button className="knopf bg-koralle-100 px-3" onClick={() => del(v.id)} aria-label="Löschen"><Trash2 size={18} /></button>
          </li>
        ))}
      </ul>
      <Modal open={!!draft} onClose={() => setDraft(null)} title="Video-Lektion">
        {draft && (
          <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); if (!draft.title.trim() || !draft.mediaId) return; save(draft); setDraft(null); }}>
            <label>Titel<input className="feld" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required /></label>
            <label>Beschreibung<input className="feld" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
            <label>Thema<input className="feld" value={draft.topic} onChange={(e) => setDraft({ ...draft, topic: e.target.value })} /></label>
            <label>Fach<select className="feld" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })}>{subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}<option value="kita">Kindergarten</option></select></label>
            <label>Videodatei<select className="feld" value={draft.mediaId} onChange={(e) => setDraft({ ...draft, mediaId: e.target.value })}>{vids.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
            <label>Untertitel (.vtt)<select className="feld" value={draft.subtitleMediaId ?? ''} onChange={(e) => setDraft({ ...draft, subtitleMediaId: e.target.value || undefined })}><option value="">– keine –</option>{subs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label>
            <label>Quiz danach<select className="feld" value={draft.quizModuleId ?? ''} onChange={(e) => setDraft({ ...draft, quizModuleId: e.target.value || undefined })}><option value="">– kein Quiz –</option>{modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</select></label>
            <label className="flex items-center gap-2 font-bold"><input type="checkbox" className="h-6 w-6" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} /> Veröffentlicht</label>
            <button className="knopf bg-himmel-500 text-white" type="submit">Speichern</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
