"""Compare deployed farmer cells byte-for-byte with the supplied native PNGs."""
from pathlib import Path
import hashlib, json, subprocess, sys
from PIL import Image
ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / 'scripts'))
from pixellab_people import ROWS
source = ROOT / 'docs/assets/licenses/characters-pixellab/source'
record = json.loads((source.parent / 'hashes.json').read_text())
for f in record['files']:
    assert hashlib.sha256((source / f['path']).read_bytes()).hexdigest() == f['sha256']
sheet = Image.open(ROOT / 'public/assets/pixel/processed/boy.png').convert('RGBA')
assert sheet.size == (576, 192)
hands = json.loads((ROOT / 'src/data/farmerHands.js').read_text().split('export const FARMER_HANDS=')[1].strip().rstrip(';'))
cells = pixels = 0
for row, (direction, exported) in enumerate(ROWS):
    idle = Image.open(source / 'Idle/rotations' / (exported + '.png')).convert('RGBA')
    padded = Image.new('RGBA', (48, 48)); padded.paste(idle, (8, 9))
    running = [Image.open(source / 'Idle/animations/Running' / exported / f'frame_{n:03d}.png').convert('RGBA') for n in range(8)]
    assert len({im.tobytes() for im in running}) == 8
    for f, original in enumerate([padded, *running, running[2], running[6], running[2]]):
        actual = sheet.crop((f * 48, row * 48, (f + 1) * 48, (row + 1) * 48))
        assert actual.tobytes() == original.tobytes(), (direction, f)
        hx, hy = hands[direction][f]
        x, y = 24 + (hx - 1) / 2, 40 + (hy - 1) / 2
        assert x.is_integer() and y.is_integer()
        r, g, b, a = actual.getpixel((int(x), int(y)))
        assert a == 255 and r > 120 and r > g * 1.25 and g > b * 1.25
        cells += 1
        pixels += sum(a > 0 for r, g, b, a in original.get_flattened_data())
unchanged = ['appearance.png', 'girl.png', 'town.png', 'town.json']
for f in unchanged:
    path = 'public/assets/pixel/processed/' + f
    assert subprocess.check_output(['git', 'show', 'ccdcc7c:' + path], cwd=ROOT) == (ROOT / path).read_bytes()
result = {'result': 'PASS', 'sourceHashes': len(record['files']), 'exactSourceCells': cells, 'nontransparentPixels': pixels, 'originalRunFrames': 32, 'uniqueFramesPerDirection': 8, 'handGrips': 48, 'unchangedLegacyAndNpcAssets': unchanged, 'resizeOrRecolor': False, 'sharedGroundRow': 40, 'idleTranslation': [8, 9], 'runFps': 16}
(Path(__file__).parent / 'source-pose-audit.json').write_text(json.dumps(result, indent=2) + '\n')
print(result)
