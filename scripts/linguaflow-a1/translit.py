"""Einfache, gut lesbare Umschrift für Russisch und Griechisch (nur Lesehilfe)."""
import re

RU = dict(zip('абвгдеёжзийклмнопрстуфхцчшщъыьэюя',
              ['a', 'b', 'v', 'g', 'd', 'e', 'yo', 'zh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f',
               'kh', 'ts', 'ch', 'sh', 'shch', '', 'y', '', 'e', 'yu', 'ya']))


def ru(text):
    out = []
    for ch in text:
        low = ch.lower()
        if low in RU:
            t = RU[low]
            out.append(t.capitalize() if ch != low and t else t)
        else:
            out.append(ch)
    return ''.join(out)


EL_DI = [('ου', 'ou'), ('ού', 'oú'), ('αι', 'e'), ('αί', 'é'), ('ει', 'i'), ('εί', 'í'), ('οι', 'i'), ('οί', 'í'),
         ('ευ', 'ev'), ('εύ', 'év'), ('αυ', 'av'), ('αύ', 'áv'), ('γγ', 'ng'), ('γκ', 'g'), ('μπ', 'b'), ('ντ', 'nt'), ('τσ', 'ts'), ('τζ', 'tz')]
EL = dict(zip('αάβγδεέζηήθιίϊΐκλμνξοόπρσςτυύϋΰφχψωώ',
              ['a', 'á', 'v', 'g', 'd', 'e', 'é', 'z', 'i', 'í', 'th', 'i', 'í', 'i', 'í', 'k', 'l', 'm', 'n', 'x', 'o', 'ó', 'p', 'r',
               's', 's', 't', 'i', 'í', 'i', 'í', 'f', 'ch', 'ps', 'o', 'ó']))


def el(text):
    out, i = [], 0
    text = text.replace(';', '?')
    while i < len(text):
        ch = text[i]
        pair = text[i:i + 2].lower()
        hit = next((t for g, t in EL_DI if g == pair), None)
        if hit is not None:
            out.append(hit.capitalize() if ch != ch.lower() else hit)
            i += 2
            continue
        low = ch.lower()
        if low in EL:
            t = EL[low]
            out.append(t.capitalize() if ch != low else t)
        else:
            out.append(ch)
        i += 1
    return ''.join(out)


AUTO = {'ru': ru, 'el': el}
# Sprachen, in denen Schreibaufgaben auch in lateinischer Umschrift angenommen werden
LATIN_ACCEPT = {'ru', 'el', 'ar', 'ja'}
