/**
 * Kopiert die Texterkennung (Tesseract) nach public/ocr, damit sie von der eigenen Seite
 * geladen wird: kein fremder Server, Fotos verlassen das Gerät nie.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(join(root, 'package.json'));
const out = join(root, 'public', 'ocr');
mkdirSync(out, { recursive: true });

const pkg = (name) => dirname(require.resolve(`${name}/package.json`));
const files = [
  [join(pkg('tesseract.js'), 'dist', 'worker.min.js'), 'worker.min.js'],
  [join(pkg('tesseract.js-core'), 'tesseract-core-simd-lstm.wasm.js'), 'tesseract-core-simd-lstm.wasm.js'],
  [join(pkg('tesseract.js-core'), 'tesseract-core-lstm.wasm.js'), 'tesseract-core-lstm.wasm.js'],
  [join(pkg('@tesseract.js-data/eng'), '4.0.0_best_int', 'eng.traineddata.gz'), 'eng.traineddata.gz']
];
for (const [from, to] of files) {
  if (!existsSync(from)) throw new Error(`Texterkennung: ${from} fehlt (npm install ausführen)`);
  copyFileSync(from, join(out, to));
}
console.log(`Texterkennung kopiert nach ${out}`);
