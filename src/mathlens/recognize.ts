/** Texterkennung für MathLens: nur auf dem Gerät (Tesseract.js aus /ocr der eigenen Seite). */
import { recognizeImage } from '../hausaufgaben/ocr';
import { analyzeRead, type ReadAnalysis } from './analyze';

/** Erlaubte Zeichen. l, I und | sind absichtlich dabei: so fallen Verwechslungen mit 1 auf, statt still zu raten. */
const WHITELIST = '0123456789+-=xX×·*:÷/()[]{}.,%^lI|oOdivn ';

export async function recognize(img: Blob, onProgress?: (p: number) => void): Promise<ReadAnalysis & { raw: string; confidence: number }> {
  const r = await recognizeImage(img, onProgress, WHITELIST);
  return { ...analyzeRead(r.text, r.confidence), raw: r.text, confidence: r.confidence };
}
