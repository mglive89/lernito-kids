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

/** Foto verkleinern, in Graustufen umwandeln und den Kontrast erhöhen. */
async function prepare(file: Blob): Promise<HTMLCanvasElement> {
  const bmp = await createImageBitmap(file);
  const max = 2000;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  let lo = 255, hi = 0;
  const gray = new Uint8ClampedArray(w * h);
  for (let i = 0, j = 0; i < d.length; i += 4, j++) {
    const g = 0.299 * d[i]! + 0.587 * d[i + 1]! + 0.114 * d[i + 2]!;
    gray[j] = g;
    if (g < lo) lo = g;
    if (g > hi) hi = g;
  }
  const range = Math.max(1, hi - lo);
  for (let i = 0, j = 0; i < d.length; i += 4, j++) {
    const v = ((gray[j]! - lo) / range) * 255;
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return c;
}

/** Text aus einem Foto lesen. onProgress bekommt Werte von 0 bis 1. */
export async function readPhoto(file: Blob, onProgress?: (p: number) => void): Promise<string> {
  progressCb = onProgress ?? null;
  try {
    onProgress?.(0.02);
    const canvas = await prepare(file);
    const worker = await getWorker();
    const { data } = await worker.recognize(canvas);
    onProgress?.(1);
    return data.text;
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
