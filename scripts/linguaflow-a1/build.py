"""
Erzeugt die A1-Kurspakete von LinguaFlow aus skeleton.py (gemeinsamer Lehrplan) und langs/<tag>.py.

    python3 scripts/linguaflow-a1/build.py
    npm run packs:check

Schreibt public/linguaflow/content/<tag>/a1.json, translations/<tag>/a1.<it|de>.json und die Einträge in courses.json.
Der Deutschkurs für Italienischsprachige (it-de-a1) ist von Hand geschrieben und wird nicht verändert.
"""
import importlib.util
import json
import pathlib
import re
import sys
import unicodedata

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
PUB = ROOT / 'public' / 'linguaflow'
sys.path.insert(0, str(HERE))
from skeleton import LESSONS, LANG_NAMES, ROLES  # noqa: E402
import translit  # noqa: E402

SOURCES = ['it', 'de']
ORDER = ['en', 'fr', 'es', 'pt-PT', 'nl', 'ro', 'pl', 'tr', 'ru', 'el', 'ar', 'ja', 'it']
NO_SPACE = {'ja'}
VERSION = '1.0.0'


def load_lang(tag):
    spec = importlib.util.spec_from_file_location(f'lang_{tag}', HERE / 'langs' / f'{tag.replace("-", "_")}.py')
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.LANG


def fold(s):
    """Umschrift ohne Längenstriche/Punkte, als zusätzliche Schreibweise"""
    s = s.replace('ʿ', '').replace('ʾ', "'")
    return ''.join(ch for ch in unicodedata.normalize('NFD', s) if unicodedata.category(ch) != 'Mn')


def typo(s, tag):
    """Französisch: geschütztes Leerzeichen vor ! ? : ; (bleibt beim Ordnen am Wort)"""
    return re.sub(r' ([!?:;])', '\u00a0\\1', s) if tag == 'fr' else s


def variants(s, tag):
    """Rumänisch: auch ş/ţ mit Cedille (ältere Tastaturen) annehmen"""
    if tag == 'ro':
        v = s.replace('ș', 'ş').replace('ț', 'ţ').replace('Ș', 'Ş').replace('Ț', 'Ţ')
        return [v] if v != s else []
    return []


def parse_item(raw, tag):
    if isinstance(raw, dict):
        it = {'t': raw['t'], 'tr': raw.get('tr'), 'acc': list(raw.get('acc', []))}
    else:
        parts = [p.strip() for p in raw.split(' | ')]
        it = {'t': parts[0], 'tr': parts[1] if len(parts) > 1 else None, 'acc': []}
    it['t'] = typo(it['t'], tag)
    it['acc'] = [typo(a, tag) for a in it['acc']]
    if it['tr'] is None and tag in translit.AUTO:
        it['tr'] = translit.AUTO[tag](it['t'])
    return it


def fill(text, lang, src):
    def rep(m):
        v = lang['vars'][m.group(1)]
        return v[src] if isinstance(v, dict) else v
    return re.sub(r'\{(\w+)\}', rep, text)


def auto_segments(text):
    words = text.split(' ')
    # höchstens 6 Bausteine: kurze Wörter am Ende zusammenfassen
    while len(words) > 6:
        words[-2:] = [words[-2] + ' ' + words[-1]]
    return words


def q(src, s):
    """Zitat; ein Schlusspunkt im Zitat entfällt (der Satz endet danach mit eigenem Punkt)"""
    s = re.sub(r'[.。]$', '', s)
    return f'«{s}»' if src == 'it' else f'„{s}“'


def dot(s):
    """Punkt nur, wenn der Satz nicht schon mit einem Satzzeichen endet"""
    return s if re.search(r'[.!?;؟。！？]$', s) else s + '.'


def build(tag):
    L = load_lang(tag)
    base = tag.split('-')[0].lower()
    cid = f'{base}-a1'
    lessons_out = []
    meaning = {}      # item id -> {src: text}
    itemtext = {}     # item id -> parsed item
    ex_tr = {src: {} for src in SOURCES}
    for n, (sk, ll) in enumerate(zip(LESSONS, L['lessons']), start=1):
        lid = f'{cid}-{n:02d}'
        assert len(ll['d']) == len(sk['dialogue']) and len(ll['v']) == len(sk['vocabulary']), (tag, n)
        dialogue, vocab = [], []
        for i, raw in enumerate(ll['d'], start=1):
            it = parse_item(raw, tag)
            iid = f'{lid}-d{i}'
            role = sk['speakers'][i - 1]
            spk = L['names'][role] if role in ('A', 'B') else L['roles'][role]
            o = {'id': iid, 'speaker': spk, 'text': it['t']}
            if it['tr']:
                o['translit'] = it['tr']
            dialogue.append(o)
            itemtext[iid] = it
            meaning[iid] = ll.get('mean', {}).get(f'd{i}', sk['dialogue'][i - 1])
        for i, raw in enumerate(ll['v'], start=1):
            it = parse_item(raw, tag)
            iid = f'{lid}-v{i}'
            o = {'id': iid, 'text': it['t']}
            if it['tr']:
                o['translit'] = it['tr']
            acc = list(it['acc'])
            if it['tr'] and tag in translit.LATIN_ACCEPT:
                latin = [it['tr']] + [translit.AUTO[tag](a) for a in it['acc'] if tag in translit.AUTO]
                for a in [x for l in latin for x in (l, fold(l))]:
                    if a not in acc:
                        acc.append(a)
            for a in [it['t'], *acc]:
                for v in variants(a, tag):
                    if v not in acc:
                        acc.append(v)
            if acc:
                o['accept'] = acc
            vocab.append(o)
            itemtext[iid] = it
            meaning[iid] = ll.get('mean', {}).get(f'v{i}', sk['vocabulary'][i - 1])
        P = sk['plan']
        vid = lambda k: f'{lid}-v{k}'
        did = lambda k: f'{lid}-d{k}'
        ref = lambda r: f'{lid}-{r}'
        exs = []
        exs.append({'id': f'{lid}-e1', 'type': 'listen', 'item': vid(P['listen'][0]), 'options': [vid(k) for k in P['listen'][1]]})
        exs.append({'id': f'{lid}-e2', 'type': 'choice', 'item': did(P['toSource'][0]), 'direction': 'toSource', 'options': [did(k) for k in P['toSource'][1]]})
        c_ref, gap, distr = ll['cloze']
        ctext = itemtext[ref(c_ref)]['t']
        at = ctext.find(gap)
        assert at >= 0, (tag, n, gap)
        if tag not in NO_SPACE and tag != 'ar':
            before = ctext[at - 1] if at else ' '
            after = ctext[at + len(gap)] if at + len(gap) < len(ctext) else ' '
            assert not before.isalpha() and not after.isalpha(), (tag, n, 'Lücke ist Teil eines Wortes', gap)
        exs.append({'id': f'{lid}-e3', 'type': 'cloze', 'item': ref(c_ref), 'gap': gap, 'options': [gap] + list(distr)})
        o_ref, segs, extra = ll['order']
        otext = itemtext[ref(o_ref)]['t']
        segs = segs or auto_segments(otext)
        oe = {'id': f'{lid}-e4', 'type': 'order', 'item': ref(o_ref), 'segments': segs}
        if extra:
            oe['extra'] = list(extra)
        exs.append(oe)
        exs.append({'id': f'{lid}-e5', 'type': 'choice', 'item': vid(P['toTarget'][0]), 'direction': 'toTarget', 'options': [vid(k) for k in P['toTarget'][1]]})
        exs.append({'id': f'{lid}-e6', 'type': 'write', 'item': vid(P['write'])})
        sit = ll['sit']
        sit = (sit[0], [typo(a, tag) for a in sit[1]], [typo(a, tag) for a in sit[2]] if len(sit) > 2 else [], *sit[3:])
        se = {'id': f'{lid}-e7', 'type': 'situation', 'mode': sit[0], 'answers': list(sit[1]) + [v for a in sit[1] for v in variants(a, tag)]}
        if sit[0] == 'choice':
            se['options'] = [sit[1][0]] + list(sit[2])
        if len(sit) > 3 and sit[3]:
            se['translit'] = sit[3]
        elif tag in translit.AUTO:
            se['translit'] = translit.AUTO[tag](sit[1][0])
        exs.append(se)
        lessons_out.append({'id': lid, 'minutes': sk['minutes'], 'dialogue': dialogue, 'vocabulary': vocab, 'exercises': exs})

        # Erklärungen
        for src in SOURCES:
            if src == base:
                continue
            m = lambda iid: fill(meaning[iid][src], L, src)
            def says(iid):
                it = itemtext[iid]
                s = f'{q(src, it["t"])} significa {q(src, m(iid))}.' if src == 'it' else f'{q(src, it["t"])} bedeutet {q(src, m(iid))}.'
                if it['tr']:
                    s += dot(f' Si legge: {it["tr"]}' if src == 'it' else f' Man liest: {it["tr"]}')
                return s
            E = ex_tr[src]
            E[f'{lid}-e1'] = {'explain': says(vid(P['listen'][0]))}
            E[f'{lid}-e2'] = {'explain': says(did(P['toSource'][0]))}
            E[f'{lid}-e3'] = {'explain': (f'La frase completa è {q(src, itemtext[ref(c_ref)]["t"])} = {q(src, m(ref(c_ref)))}. ' if src == 'it'
                                          else f'Der ganze Satz heißt {q(src, itemtext[ref(c_ref)]["t"])} = {q(src, m(ref(c_ref)))}. ') + ll['tip'][src]}
            otip = ll.get('tip2', {}).get(src, '')
            E[f'{lid}-e4'] = {'explain': ((f'Ordine giusto: {q(src, otext)} = {q(src, m(ref(o_ref)))}.' if src == 'it'
                                           else f'Richtige Reihenfolge: {q(src, otext)} = {q(src, m(ref(o_ref)))}.') + (' ' + otip if otip else '')).strip()}
            E[f'{lid}-e5'] = {'explain': says(vid(P['toTarget'][0]))}
            w = itemtext[vid(P['write'])]
            wexp = (f'{q(src, m(vid(P["write"])))} si dice {q(src, w["t"])}.' if src == 'it' else f'{q(src, m(vid(P["write"])))} heißt {q(src, w["t"])}.')
            if w['tr'] and tag in translit.LATIN_ACCEPT:
                wexp += dot(f' Puoi scrivere anche in lettere latine: {w["tr"]}' if src == 'it' else f' Du kannst auch in lateinischen Buchstaben schreiben: {w["tr"]}')
            elif src == 'it':
                wexp += ' Le maiuscole non contano, ma ogni lettera e ogni accento sì.'
            else:
                wexp += ' Groß- und Kleinschreibung zählt nicht, aber jeder Buchstabe und jedes Zeichen.'
            E[f'{lid}-e6'] = {'explain': wexp}
            ans = sit[1]
            if src == 'it':
                sx = 'Puoi dire: ' + ' oppure '.join(q(src, a) for a in ans[:3]) + '.'
            else:
                sx = 'Du kannst sagen: ' + ' oder '.join(q(src, a) for a in ans[:3]) + '.'
            if ll.get('sit_tip'):
                sx += ' ' + ll['sit_tip'][src]
            E[f'{lid}-e7'] = {'explain': sx, 'prompt': fill(sk['prompt'][src], L, src)}

    content = {'format': 1, 'id': cid, 'language': tag, 'version': VERSION, 'lessons': lessons_out}
    folder = base if tag != 'pt-PT' else 'pt'
    (PUB / 'content' / folder).mkdir(parents=True, exist_ok=True)
    (PUB / 'content' / folder / 'a1.json').write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n')
    entries = []
    for src in SOURCES:
        if src == base:
            continue
        name = LANG_NAMES[tag][src]
        tr = {
            'format': 1, 'id': f'{cid}.{src}', 'content': cid, 'source': src, 'target': tag, 'version': VERSION,
            'quality': 'unreviewed',
            'course': {
                'title': f'{name} A1 – {L["subtitle"][src]}',
                'description': ('Dieci lezioni brevi su situazioni reali: presentarsi, fare la spesa, al bar, in stazione, dal medico, al ristorante e nel tempo libero.'
                                if src == 'it' else
                                'Zehn kurze Lektionen zu echten Situationen: sich vorstellen, einkaufen, im Café, am Bahnhof, beim Arzt, im Restaurant und in der Freizeit.'),
            },
            'lessons': {f'{cid}-{n:02d}': {'title': sk['title'][src], 'goal': sk['goal'][src]} for n, sk in enumerate(LESSONS, start=1)},
            'items': {iid: fill(mm[src], L, src) for iid, mm in meaning.items()},
            'exercises': ex_tr[src],
        }
        (PUB / 'translations' / folder).mkdir(parents=True, exist_ok=True)
        (PUB / 'translations' / folder / f'a1.{src}.json').write_text(json.dumps(tr, ensure_ascii=False, indent=2) + '\n')
        entries.append({
            'id': f'{src}-{base}-a1', 'source': src, 'target': tag, 'level': 'A1', 'kind': 'course', 'status': 'published',
            'version': VERSION, 'content': f'content/{folder}/a1.json', 'translations': f'translations/{folder}/a1.{src}.json',
            'lessons': [l['id'] for l in lessons_out],
        })
    return entries


def main():
    only = sys.argv[1:]
    idx_path = PUB / 'courses.json'
    idx = json.loads(idx_path.read_text())
    keep = [c for c in idx['courses'] if c['id'] == 'it-de-a1']
    generated = {c['id']: c for c in idx['courses'] if c['id'] != 'it-de-a1' and c['kind'] == 'course'}
    for tag in ORDER:
        if only and tag not in only:
            continue
        if not (HERE / 'langs' / f'{tag.replace("-", "_")}.py').exists():
            print('übersprungen (keine Daten):', tag)
            continue
        for e in build(tag):
            generated[e['id']] = e
        print('ok', tag)
    order = {t.split('-')[0]: i for i, t in enumerate(ORDER)}
    rest = sorted(generated.values(), key=lambda c: (c['source'] != 'it', order.get(c['target'].split('-')[0], 99)))
    idx['courses'] = keep + rest
    idx_path.write_text(json.dumps(idx, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
