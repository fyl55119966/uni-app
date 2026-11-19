import sys, json, os
from PIL import Image

def main():
    src, outdir = sys.argv[1], sys.argv[2]
    os.makedirs(outdir, exist_ok=True)
    im = Image.open(src).convert('RGB')
    W, H = im.size
    MAX, OV = 2400, 120
    chunks = []
    y, i = 0, 0
    while True:
        y2 = min(y + MAX, H)
        p = os.path.abspath(os.path.join(outdir, f'chunk{i}.png'))
        im.crop((0, y, W, y2)).save(p)
        chunks.append({'path': p, 'yOffset': y})
        if y2 >= H:
            break
        y = y2 - OV
        i += 1
    print(json.dumps({'width': W, 'height': H, 'chunks': chunks}, ensure_ascii=False))

main()
