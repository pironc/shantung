"""Add a ledger row for a packshot made from a photo already in the ledger: same source, author and licence.
usage: derive.py NAME FROM "alt text" "how it was made" """
import json, pathlib, sys
from PIL import Image

name, frm, alt, note = sys.argv[1:5]
p = pathlib.Path(__file__).resolve().parent.parent / 'photos' / 'ledger.json'
d = json.loads(p.read_text())
src = next(i for i in d['items'] if i['name'] == frm)
w, h = Image.open(p.parent / f'{name}.jpg').size
row = {**src, 'name': name, 'id': f'{src["id"]}:{name}', 'file': f'{name}.jpg', 'alt': alt, 'note': note, 'width': w, 'height': h}
d['items'] = [i for i in d['items'] if i['name'] != name] + [row]
p.write_text(json.dumps(d, indent=2, ensure_ascii=False) + '\n')
print('ledger:', name, '<-', frm, src['licence'])
