# LinguaFlow: pacchetti di corso

LinguaFlow è l'app per imparare le lingue di Lernito (`/sprachen/`, con Puppy).
L'app non conosce nessuna lingua in particolare: ogni corso è un **pacchetto di dati** (file JSON)
separato dal codice. Per aggiungere una lingua si aggiungono file: componenti e logica delle lezioni restano uguali.

- Codice: `src/linguaflow/` (tipi, catalogo, caricamento, convalida, pagine)
- Pacchetti pubblicati: `public/linguaflow/`
- Specifica: `docs/linguaflow/pack.schema.json` (JSON Schema) e i tipi in `src/linguaflow/types.ts`
- Pacchetto di esempio: `docs/linguaflow/example/` (italiano → olandese, una lezione)
- Nome dell'app: `src/linguaflow/brand.ts` (`APP_NAME`), più `public/sprachen/manifest.webmanifest` e `sprachen/index.html`

## Avviare

```bash
npm install
npm run dev            # sviluppo: http://localhost:5173/sprachen/
npm run build && npm run preview   # versione di produzione: http://localhost:4173/sprachen/
```

In Lernito, «Lingue» apre direttamente LinguaFlow. Al primo avvio si scelgono la lingua dell'app,
«Parlo…» e «Voglio imparare…». Non servono account né abbonamenti: progressi ed errori restano sul dispositivo
(localStorage `linguaflow-v1`), separati per profilo Lernito (o «ospite») e per corso.

## Struttura di un pacchetto

```
public/linguaflow/
  courses.json                         indice: tutti i corsi
  content/<lingua>/<nome>.json         testi nella lingua da imparare (dialoghi, parole, esercizi)
  translations/<lingua>/<nome>.<partenza>.json   traduzioni e spiegazioni nella lingua di partenza
  audio/…                              (facoltativo) file audio
```

Il contenuto e le traduzioni sono separati: lo stesso dialogo tedesco (`content/de/a1.json`) può servire
a chi parla italiano (`translations/de/a1.it.json`) e, aggiungendo solo un file, a chi parla inglese
(`translations/de/a1.en.json` + una voce in `courses.json`).

### `courses.json`

```json
{ "format": 1, "courses": [
  { "id": "it-de-a1", "source": "it", "target": "de", "level": "A1", "kind": "course",
    "status": "published", "version": "1.0.0",
    "content": "content/de/a1.json", "translations": "translations/de/a1.it.json",
    "lessons": ["de-a1-01", "de-a1-02"] }
] }
```

- `source` / `target`: codici BCP 47 (`de`, `pt-BR`, `zh-Hans` …). Se la lingua non è ancora nel catalogo,
  compare comunque nella ricerca perché l'app aggiunge le lingue dei pacchetti.
- `kind`: `course` = modulo completo, `intro` = introduzione, `demo` = demo. L'app mostra sempre il numero vero di lezioni
  e non presenta mai un'introduzione o una demo come modulo completo.
- `status`: solo `published` compare nell'app; `draft` serve per lavorare.

### Lezione (file di contenuto)

Ogni lezione: `minutes` (5–10), `dialogue` (dialogo breve), `vocabulary` (parole e frasi utili),
`exercises` (almeno 6, l'ultimo è sempre una `situation`).
Ogni testo (`item`) ha `id`, `text` nella lingua da imparare e, se serve, `translit` (trascrizione: solo aiuto, mostrata a parte),
`speaker`, `accept` (altre scritture corrette) e `audio`.

Tipi di esercizio (alternarli):

| type | campi | cosa fa |
|---|---|---|
| `listen` | `item`, `options` (id di item) | ascolto e scelta del significato; senza voce sul dispositivo diventa lettura |
| `choice` | `item`, `direction` (`toSource`/`toTarget`), `options` | scelta multipla nelle due direzioni |
| `cloze` | `item`, `gap`, `options` (testi) | completare la frase; `gap` deve comparire nel testo |
| `order` | `item`, `segments`, `extra` | riordinare **i segmenti definiti nella lezione** (non si divide per spazi: funziona anche per giapponese, cinese, thai) |
| `write` | `item`, `accept` | scrivere nella lingua da imparare |
| `situation` | `mode` (`write`/`choice`), `answers`, `options`, `translit` | situazione finale: la consegna è nella lingua di partenza, la risposta nella lingua da imparare |

Le risposte scritte ignorano maiuscole, spazi e punteggiatura ai bordi, **non gli accenti** (né umlaut, né ß, né segni diacritici).
Ogni altra variante corretta va scritta nei dati (`accept`, `answers`).
Per l'arabo e il giapponese è accettata anche la trascrizione dove i dati lo dicono (es. `"accept": ["shukran"]`).

### Traduzioni

```json
{ "format": 1, "id": "de-a1.it", "content": "de-a1", "source": "it", "target": "de", "version": "1.0.0",
  "quality": "unreviewed",
  "course": { "title": "…", "description": "…" },
  "lessons": { "de-a1-01": { "title": "…", "goal": "…" } },
  "items": { "de-a1-01-d1": "Ciao! Sono Lena." },
  "exercises": { "de-a1-01-e3": { "explain": "spiegazione dopo un errore" },
                 "de-a1-01-e7": { "explain": "…", "prompt": "consegna della situazione" } } }
```

`quality`: `reviewed` (controllato da madrelingua), `unreviewed` (scritto a mano, non ancora controllato) oppure `machine`
(traduzione automatica). L'app lo mostra sempre: una traduzione automatica non viene mai presentata come controllata.
I pacchetti attuali sono `unreviewed`.

### Audio e voce

Se un item ha `audio`, l'app usa quel file. Altrimenti usa una voce del dispositivo per la lingua da imparare (Web Speech).
Se il dispositivo non ha una voce adatta, l'app lo dice chiaramente e gli esercizi di ascolto diventano esercizi di lettura.
Non c'è nessuna valutazione della pronuncia simulata.

## Aggiungere una lingua (passo per passo)

1. Copia `docs/linguaflow/example/` come modello.
2. Scrivi `content/<lingua>/<nome>.json` con le lezioni e `translations/<lingua>/<nome>.<partenza>.json` con traduzioni,
   titoli, obiettivi, spiegazioni e consegne.
3. Aggiungi la voce del corso in `public/linguaflow/courses.json` (prima con `"status": "draft"`).
4. Convalida:
   ```bash
   npm run packs:check                              # public/linguaflow
   npm run packs:check -- docs/linguaflow/example   # un'altra cartella
   ```
   Il comando trova ID doppi, esercizi incompleti (opzioni senza la risposta giusta, lacune che non compaiono nel testo,
   segmenti che non formano la frase, situazione finale mancante), traduzioni e spiegazioni mancanti e file audio inesistenti.
   Esce con codice 1 se ci sono errori. Gli stessi controlli girano in `npm test`.
5. Prova la lezione con `npm run dev`, poi metti `"status": "published"` e aumenta `version`.

## Corsi A1 completi (generati da un programma comune)

Tutti i corsi tranne «Tedesco A1 per chi parla italiano» (`it-de-a1`, scritto a mano) nascono da un programma comune
di 10 lezioni: presentarsi, al mercato, al bar, al supermercato, chiedere la strada, in stazione, dal medico,
il tempo libero (giorni e ore), al ristorante, il fine settimana.

- Programma, titoli, obiettivi e consegne (it, de): `scripts/linguaflow-a1/skeleton.py`
- Testi di ogni lingua, spiegazioni grammaticali (it, de) ed esercizi: `scripts/linguaflow-a1/langs/<lingua>.py`
- Generatore: `python3 scripts/linguaflow-a1/build.py` (poi `npm run packs:check`)

Lingue da imparare: inglese, francese, spagnolo, portoghese (Portogallo), olandese, rumeno, polacco, turco, russo,
greco, arabo, giapponese (per chi parla italiano e per chi parla tedesco) e italiano (per chi parla tedesco).
Russo e greco hanno la trascrizione automatica, arabo e giapponese (solo kana) la trascrizione scritta a mano;
in queste lingue gli esercizi di scrittura accettano anche le lettere latine.
Tutti i pacchetti sono `unreviewed`: scritti a mano, non ancora controllati da madrelingua.

## Pubblicare

I file in `public/linguaflow/` finiscono nella build e vengono salvati dal service worker
(`vite.config.ts`, `globPatterns` con `json`): dopo il primo caricamento lezioni e progressi funzionano offline.
Basta fare il merge su `main`: GitHub Actions pubblica su GitHub Pages.
