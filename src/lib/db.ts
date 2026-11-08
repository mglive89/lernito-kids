import { openDB, type IDBPDatabase } from 'idb';
import type { StateStorage } from 'zustand/middleware';

export interface MediaMeta {
  id: string;
  name: string;
  type: string;
  size: number;
  kind: 'image' | 'video' | 'subtitle';
  createdAt: string;
}
interface MediaRecord extends MediaMeta { blob: Blob }

let dbPromise: Promise<IDBPDatabase> | null = null;
let memoryFallback: Map<string, string> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB('lernito-kids', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
        if (!db.objectStoreNames.contains('media')) db.createObjectStore('media', { keyPath: 'id' });
      }
    });
  }
  return dbPromise;
}

export function isIndexedDbAvailable(): boolean {
  try { return typeof indexedDB !== 'undefined'; } catch { return false; }
}

const LS_PREFIX = 'lernito-backup:';
function lsGet(name: string): string | null {
  try { return localStorage.getItem(LS_PREFIX + name); } catch { return null; }
}
function lsSet(name: string, value: string | null): void {
  try { if (value === null) localStorage.removeItem(LS_PREFIX + name); else localStorage.setItem(LS_PREFIX + name, value); } catch { /* Speicher voll oder gesperrt */ }
}

/**
 * Zustand-Storage auf IndexedDB-Basis.
 * Zusätzlich wird synchron eine Sicherungskopie in localStorage geschrieben, damit beim
 * schnellen Schließen der App (asynchrones IndexedDB-Schreiben noch nicht fertig) nichts verloren geht.
 * Fallback: In-Memory (z. B. privater Modus).
 */
export const idbStorage: StateStorage = {
  async getItem(name) {
    if (memoryFallback) return memoryFallback.get(name) ?? null;
    const backup = lsGet(name);
    if (backup !== null) return backup;
    try {
      const db = await getDb();
      return ((await db.get('kv', name)) as string | undefined) ?? null;
    } catch (e) {
      console.warn('IndexedDB nicht verfügbar – Daten nur temporär.', e);
      memoryFallback = new Map();
      return null;
    }
  },
  async setItem(name, value) {
    lsSet(name, value);
    if (memoryFallback) { memoryFallback.set(name, value); return; }
    try {
      const db = await getDb();
      await db.put('kv', value, name);
    } catch (e) {
      console.warn('Speichern fehlgeschlagen', e);
      memoryFallback = new Map([[name, value]]);
    }
  },
  async removeItem(name) {
    lsSet(name, null);
    if (memoryFallback) { memoryFallback.delete(name); return; }
    const db = await getDb();
    await db.delete('kv', name);
  }
};

export function isUsingMemoryFallback(): boolean {
  return memoryFallback !== null;
}

export async function putMedia(file: File | Blob, name: string): Promise<MediaMeta> {
  const db = await getDb();
  const type = file.type || 'application/octet-stream';
  const kind: MediaMeta['kind'] = type.startsWith('image/') ? 'image' : type.startsWith('video/') ? 'video' : 'subtitle';
  const rec: MediaRecord = { id: `media-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, name, type, size: file.size, kind, createdAt: new Date().toISOString(), blob: file };
  await db.put('media', rec);
  const { blob: _b, ...meta } = rec;
  void _b;
  return meta;
}

export async function listMedia(): Promise<MediaMeta[]> {
  const db = await getDb();
  const all = (await db.getAll('media')) as MediaRecord[];
  return all.map(({ blob: _b, ...m }) => { void _b; return m; }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getMediaBlob(id: string): Promise<Blob | null> {
  const db = await getDb();
  const rec = (await db.get('media', id)) as MediaRecord | undefined;
  return rec?.blob ?? null;
}

export async function deleteMedia(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('media', id);
}

export async function clearAllData(): Promise<void> {
  const db = await getDb();
  await db.clear('kv');
  await db.clear('media');
  try { Object.keys(localStorage).filter((k) => k.startsWith(LS_PREFIX)).forEach((k) => localStorage.removeItem(k)); } catch { /* egal */ }
}
