# MathLens (nome provvisorio) – «Aiutami con i compiti»

MathLens è una PWA a sé dentro questo repository (`mathlens/index.html`, codice in `src/mathlens/`). Lo studente fotografa un esercizio di matematica, controlla e corregge la formula riconosciuta e vede come si risolve passo dopo passo. Interfaccia e spiegazioni sono in **italiano** (lingua iniziale) e **tedesco**, e la scelta resta salvata sul dispositivo. Nome, interfaccia, icone e grafica sono originali.

In Lernito l'opzione **«Aiutami con i compiti» / «Hilf mir bei den Hausaufgaben»** si trova in *Scopri* (e quindi anche in home), nella pagina *Matematica* e in *Lernito Adult*, e apre MathLens. Il vecchio indirizzo `/hausaufgaben` rimanda a MathLens.

## Avvio

```bash
npm install
npm run dev                         # http://localhost:5173/mathlens/
npm run build && npm run preview    # build di produzione con service worker: http://localhost:4173/mathlens/
npm test                            # test del motore (Vitest)
npx playwright test tests/e2e/mathlens.spec.ts tests/e2e/mathlens-kamera.spec.ts --trace off
```

Online l'app è su `https://<utente>.github.io/<repo>/mathlens/`. La fotocamera funziona solo con HTTPS o su `localhost`.

## Esempi da provare

| Esercizio | Risultato |
|---|---|
| `3(2x − 4) = 18` | x = 5, con verifica nell'equazione di partenza |
| `1/2 + 3/4` | 5/4 |
| `15% di 80` | 12 |
| `x + 1 = x` | Nessuna soluzione |
| `2(x + 1) = 2x + 2` | Infinite soluzioni |
| `1/0` | «Non si può dividere per 0» |
| `5x − 3 = 2x + 9` | x = 4 |
| `[(2 + 3) × 4 − 5] : 3` | 5 |
| `2(x + 3) − x` | x + 6 (espressione letterale) |
| `457 : 3` | 152 resto 1, con la divisione in colonna |
| `2y + 3 = 7` | non supportato (c'è una lettera diversa da x) |

## Struttura

| Parte | File |
|---|---|
| Acquisizione della foto (fotocamera posteriore, riquadro, ritaglio) | `src/mathlens/capture/` |
| Riconoscimento (Tesseract.js nel browser) | `src/hausaufgaben/ocr.ts`, `src/mathlens/recognize.ts` |
| Controllo della lettura (x/×, 1/l, O/0, frazioni su due righe) | `src/mathlens/analyze.ts` |
| Parsing (solo operatori consentiti, niente `eval`) | `src/hausaufgaben/parse.ts` |
| Motore matematico (frazioni esatte, passaggi con regole fisse) | `src/hausaufgaben/solve.ts`, `rational.ts`, `columns.ts` |
| Rendering delle formule e tastiera matematica | `src/mathlens/formula/` |
| Soluzione («Dammi un indizio» / «Mostra la soluzione») | `src/mathlens/SolutionView.tsx` |
| Cronologia locale (esercizio, risultato e data, mai le foto) | `src/mathlens/history.ts` |
| Traduzioni | testi IT/DE con `L(de, it)` di `src/i18n`; la scelta è salvata da `src/mathlens/lang.ts` |

Il risultato lo decide solo il motore deterministico: niente modelli generativi e niente server. Le foto non lasciano mai il dispositivo. I file del riconoscimento sono serviti dal sito stesso (`/ocr/`), copiati da npm con `scripts/copy-ocr.mjs`.

Per i profili bambino di Lernito, la fotocamera si attiva solo dopo il PIN dei genitori (è lo stesso consenso dell'area genitori). Senza un profilo Lernito non c'è nessun blocco.

## Offline

- Dopo il primo caricamento il service worker mette l'app in cache: **tastiera, calcolo e cronologia funzionano offline**. Lo verifica il test e2e «Offline».
- Il **riconoscimento** (circa 7 MB) non viene scaricato in anticipo. Si scarica alla prima scansione e da quel momento funziona anche offline. Se la prima scansione avviene senza rete, si può comunque scrivere l'esercizio a mano.

## Limiti effettivi del riconoscimento

Li ho misurati con il test «Erkennungsrate» di `tests/e2e/mathlens.spec.ts` su 13 immagini campione in `tests/e2e/fixtures/mathlens/`: testo stampato in vari font, una foto inclinata e sfocata, una su quaderno a righe. Sono **immagini generate al computer, non foto scattate con un telefono**.

| Immagine | Atteso | Letto | Esito |
|---|---|---|---|
| `01-equazione-parentesi.png` | 3(2x − 4) = 18 | `3(2x - 4) = 18` | ✅ giusto |
| `02-frazioni.png` | 1/2 + 3/4 | `1/2 + 3/4` | ✅ giusto |
| `03-percentuale.png` | 15% di 80 | `15% di 80` | ✅ giusto |
| `04-addizione-times.png` | 345 + 278 | `345 + 278` | ✅ giusto |
| `05-equazione-georgia.png` | 5x − 3 = 2x + 9 | `5x -3=2x+9` | ✅ giusto |
| `06-espressione-courier.png` | (12 − 4) × 3 : 6 | `(12 - 4) x 3 : 6` | ⚠️ letto male ma segnalato |
| `07-decimali.png` | 0,75 + 2,5 | `0,75 +25` | ⚠️ letto male ma segnalato |
| `08-per-punto.png` | 7 · 8 − 6 | `7-8-6` | ❌ letto male, non segnalato |
| `09-frazione-impilata.png` | (frazione su due righe) | `1.3 271` | ✅ segnalata, non indovinata |
| `10-nessuna-soluzione.png` | x + 1 = x | `X+1=Xx` | ⚠️ letto male ma segnalato |
| `11-foto-storta.png` | 2x + 5 = 17 | `2x +5=17` | ✅ giusto |
| `12-x-o-per.png` | 4 x 3 + 2 | `4x3+2` | ✅ giusto |
| `13-quaderno-piccolo.png` | 48 : 6 + 9 | `48:6 +9` | ✅ giusto |

Cosa ne risulta:
- Il testo **stampato** su una riga viene letto bene.
- Il segno **×** viene spesso letto come **x**: l'app lo segnala e chiede di controllare.
- Il **punto per (·)** può diventare **−** senza avviso, quindi va controllato a occhio.
- Le **frazioni su due righe** (impilate) non vengono interpretate: l'app lo dice e chiede di riscriverle con `/`.
- Le virgole piccole dei decimali possono sparire. In quel caso l'app segnala che la lettura è incerta.
- La **scrittura a mano non è stata testata** e non va considerata affidabile.
- La prima versione non supporta problemi a parole, geometria, sistemi, potenze della x (equazioni di secondo grado) e lettere diverse da x.

## Prove eseguite

- Test unitari del motore. Coprono i casi obbligatori (`3(2x − 4) = 18`, `1/2 + 3/4`, `15% di 80`, `x + 1 = x`, `2(x + 1) = 2x + 2`, `1/0`), le espressioni letterali e gli esercizi non supportati.
- Test e2e con Playwright su Chromium, con profili desktop, smartphone (Pixel 7) e tablet:
  - percorso completo: foto → ritaglio → riconoscimento → controllo → indizio e soluzione → cronologia;
  - formula da correggere (x/×) con la tastiera matematica;
  - frazione impilata;
  - fotocamera negata, con l'offerta immediata di caricare una foto o scrivere l'esercizio;
  - fotocamera simulata di Chromium, con scatto e ritaglio;
  - cambio IT/DE, anche durante la soluzione;
  - uso offline;
  - ingresso da Lernito con il PIN dei genitori;
  - build di produzione.

## Da provare su dispositivi fisici

- iPhone (Safari) e Android (Chrome): fotocamera posteriore vera, messa a fuoco, luce, permesso negato e poi riattivato dalle impostazioni.
- Foto reali di libri e schede stampate: le misure sopra sono su immagini sintetiche.
- Scrittura a mano.
- Installazione come app (aggiungi alla schermata Home) e uso offline dopo la prima scansione.
- Tablet in orizzontale.
