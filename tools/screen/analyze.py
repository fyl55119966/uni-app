import sys, json
from PIL import Image
from collections import Counter

def q(c, step=16):
    return tuple(min(255, (v // step) * step) for v in c)

def hexc(c):
    return '#%02X%02X%02X' % c

def join_words(words):
    out = ''
    prev = None
    for w in words:
        t = w['text']
        if prev is not None:
            a, b = prev['text'][-1], t[0]
            gap = w['x'] - (prev['x'] + prev['w'])
            ascii_pair = ord(a) < 128 and ord(b) < 128
            if ascii_pair and gap > 1:
                out += ' '
            elif not ascii_pair and gap > max(6, w['h'] * 0.5):
                out += ' '
        out += t
        prev = w
    return out

def line_colors(px, W, H, x, y, w, h):
    ring = []
    for xx in range(max(0, x - 2), min(W, x + w + 2)):
        for yy in (max(0, y - 2), min(H - 1, y + h + 1)):
            ring.append(px[xx, yy])
    for yy in range(max(0, y - 2), min(H, y + h + 2)):
        for xx in (max(0, x - 2), min(W - 1, x + w + 1)):
            ring.append(px[xx, yy])
    bg = tuple(sorted(c[i] for c in ring)[len(ring) // 2] for i in range(3)) if ring else (255, 255, 255)
    samples = []
    step = max(1, int((w * h) ** 0.5 / 20))
    for yy in range(y, min(H, y + h), step):
        for xx in range(x, min(W, x + w), step):
            c = px[xx, yy]
            d = sum((c[i] - bg[i]) ** 2 for i in range(3))
            samples.append((d, c))
    samples.sort(key=lambda t: -t[0])
    top = [c for d, c in samples[:max(3, len(samples) // 10)]]
    fg = tuple(sum(c[i] for c in top) // len(top) for i in range(3))
    return hexc(fg), hexc(bg)

def main():
    img_path, ocr_path, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
    im = Image.open(img_path).convert('RGB')
    W, H = im.size
    px = im.load()

    # 行带：每行 5 个采样列的众数色，连续同色行合并
    xs = [4, W // 4, W // 2, 3 * W // 4, W - 5]
    rows = []
    for y in range(H):
        rows.append(Counter(q(px[x, y]) for x in xs).most_common(1)[0][0])
    bands = []
    start = 0
    for y in range(1, H):
        if rows[y] != rows[y - 1]:
            bands.append([start, y - 1, rows[y - 1]])
            start = y
    bands.append([start, H - 1, rows[-1]])
    merged = []
    for b in bands:
        if merged and b[1] - b[0] < 4:
            merged[-1][1] = b[1]
        else:
            merged.append(list(b))
    bands_out = [{'y0': b[0], 'y1': b[1], 'color': hexc(b[2])} for b in merged if b[1] - b[0] >= 5]

    raw = json.load(open(ocr_path, encoding='utf-8-sig'))
    if isinstance(raw, dict):
        raw = [raw]
    words = [{'text': it['text'], 'x': float(it['x']), 'y': float(it['y']),
              'w': float(it['w']), 'h': float(it['h'])} for it in (raw or [])]

    # 切片重叠区去重
    seen = set()
    uniq = []
    for w in sorted(words, key=lambda w: (w['y'], w['x'])):
        key = (w['text'], int(w['x'] // 6), int(w['y'] // 6))
        if key in seen:
            continue
        seen.add(key)
        uniq.append(w)

    # 按纵向中心聚成行
    uniq.sort(key=lambda w: w['y'] + w['h'] / 2)
    clusters = []
    for w in uniq:
        cy = w['y'] + w['h'] / 2
        placed = False
        for cl in clusters:
            if abs(cl['cy'] - cy) <= max(6, min(cl['h'], w['h']) * 0.6):
                cl['words'].append(w)
                n = len(cl['words'])
                cl['cy'] = (cl['cy'] * (n - 1) + cy) / n
                cl['h'] = max(cl['h'], w['h'])
                placed = True
                break
        if not placed:
            clusters.append({'cy': cy, 'h': w['h'], 'words': [w]})

    lines = []
    for cl in clusters:
        ws = sorted(cl['words'], key=lambda w: w['x'])
        x0 = int(min(w['x'] for w in ws)); y0 = int(min(w['y'] for w in ws))
        x1 = int(max(w['x'] + w['w'] for w in ws)); y1 = int(max(w['y'] + w['h'] for w in ws))
        text = join_words(ws)
        fg, bg = line_colors(px, W, H, x0, y0, max(2, x1 - x0), max(2, y1 - y0))
        lines.append({'text': text, 'x': x0, 'y': y0, 'w': x1 - x0, 'h': y1 - y0, 'fg': fg, 'bg': bg})
    lines.sort(key=lambda l: (l['y'], l['x']))

    json.dump({'width': W, 'height': H, 'lines': lines, 'bands': bands_out},
              open(out_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

main()
