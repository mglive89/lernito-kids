/**
 * Texterkennung für Fotos von Mathe-Aufgaben – komplett auf dem Gerät.
 * Tesseract.js wird erst bei Bedarf geladen; Worker, WASM-Kern und Sprachdaten kommen
 * von der eigenen Seite (public/ocr, siehe scripts/copy-ocr.mjs). Das Foto verlässt das Gerät nie.
 */
import type { Worker } from 'tesseract.js';

let workerPromise: Promise<Worker> | null = null;
let progressCb: ((p: number) => void) | null = null;

const assetUrl = (f: string) => new URL(`${import.meta.env.BASE_URL}ocr/${f}`, window.location.href).href;

/** Zeichen, die in Matheaufgaben vorkommen (weniger Auswahl = weniger Lesefehler). */
const WHITELIST = '0123456789+-=xX×·*:÷/()[]{}.,?%_ abcdefgh';

async function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker, OEM, PSM } = await import('tesseract.js');
      const worker = await createWorker('eng', OEM.LSTM_ONLY, {
        workerPath: assetUrl('worker.min.js'),
        corePath: assetUrl(''),
        langPath: assetUrl(''),
        workerBlobURL: false,
        gzip: true,
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') progressCb?.(0.3 + m.progress * 0.7);
          else if (m.status.startsWith('loading')) progressCb?.(Math.min(0.3, m.progress * 0.3));
        }
      });
      await worker.setParameters({
        tessedit_char_whitelist: WHITELIST,
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
        preserve_interword_spaces: '1'
      });
      return worker;
    })();
    workerPromise.catch(() => { workerPromise = null; });
  }
  return workerPromise;
}

/**
 * Foto für die Texterkennung vorbereiten: Größe anpassen, Graustufen und Schwarz-Weiß nach Otsu
 * (blasse Linien von kariertem oder liniertem Papier verschwinden), dazu ein weißer Rand.
 */
async function prepare(file: Blob): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(file);
  const max = 2000, minH = 120;
  let scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  if (bmp.height * scale < minH) scale = Math.min(4, minH / bmp.height);
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const pad = Math.round(Math.max(16, h * 0.08));
  const c = document.createElement('canvas');
  c.width = w + 2 * pad; c.height = h + 2 * pad;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, pad, pad, w, h);
  bmp.close();
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  const n = c.width * c.height;
  const gray = new Uint8ClampedArray(n);
  const hist = new Array<number>(256).fill(0);
  for (let i = 0, j = 0; j < n; i += 4, j++) {
    const g = Math.round(0.299 * d[i]! + 0.587 * d[i + 1]! + 0.114 * d[i + 2]!);
    gray[j] = g;
    hist[g]!++;
  }
  // Otsu-Schwelle
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t]!;
  let sumB = 0, wB = 0, best = 0, thr = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t]!;
    if (!wB) continue;
    const wF = n - wB;
    if (!wF) break;
    sumB += t * hist[t]!;
    const mB = sumB / wB, mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) ** 2;
    if (between > best) { best = between; thr = t; }
  }
  // Tinte ist dunkel: blasse Heftlinien sollen nie als Schrift zählen
  thr = Math.min(thr, 150);
  for (let i = 0, j = 0; j < n; i += 4, j++) {
    const v = gray[j]! > thr ? 255 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Text aus einem Foto lesen. onProgress bekommt Werte von 0 bis 1. */
export async function readPhoto(file: Blob, onProgress?: (p: number) => void): Promise<string> {
  return (await recognizeImage(file, onProgress)).text;
}

export interface OcrResult {
  text: string;
  /** Sicherheit der Erkennung, 0–100 */
  confidence: number;
}

/** Wie readPhoto, mit eigener Zeichenauswahl und Sicherheit der Erkennung. */
export async function recognizeImage(file: Blob, onProgress?: (p: number) => void, whitelist = WHITELIST): Promise<OcrResult> {
  progressCb = onProgress ?? null;
  try {
    onProgress?.(0.02);
    const canvas = await prepare(file);
    const worker = await getWorker();
    await worker.setParameters({ tessedit_char_whitelist: whitelist });
    const { data } = await worker.recognize(canvas);
    onProgress?.(1);
    return { text: data.text, confidence: data.confidence };
  } finally {
    progressCb = null;
  }
}

/** Nach dem Verlassen der Seite den Speicher wieder freigeben. */
export async function releaseOcr(): Promise<void> {
  const p = workerPromise;
  workerPromise = null;
  if (p) { try { await (await p).terminate(); } catch { /* egal */ } }
}
