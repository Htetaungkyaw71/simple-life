"""Audit original large houses and the production allowlist; run after build.
Requires Pillow. Baseline is the completed v0.7.0 City integration.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image
import subprocess, json, hashlib

base = '51701a6'
folder = 'public/assets/pixel/processed/'
def old(path):
    return subprocess.check_output(['git', 'show', base + ':' + path])
def cell(image, frame):
    r = frame['frame']
    return image.crop((r['x'], r['y'], r['x'] + r['w'], r['y'] + r['h'])).tobytes()

before = json.loads(old(folder + 'town.json'))['frames']
after = json.loads(Path(folder + 'town.json').read_text())['frames']
a = Image.open(BytesIO(old(folder + 'town.png'))).convert('RGBA')
b = Image.open(folder + 'town.png').convert('RGBA')
for name, frame in before.items():
    assert frame == after[name], name + ' metadata changed'
    assert cell(a, frame) == cell(b, frame), name + ' pixels changed'
added = {name for name in after if name not in before}
assert added == {'house-village-' + str(i) for i in range(13)}
hashes = {name: hashlib.sha256(cell(b, after[name])).hexdigest() for name in sorted(added)}
assert len(set(hashes.values())) == 13
art = ['font.png', 'font.xml', 'world.png', 'world.json', 'processed/boy.png',
       'processed/girl.png', 'processed/town.png', 'processed/town.json']
same = []
for name in art:
    if name not in ['processed/town.png', 'processed/town.json']:
        path = 'public/assets/pixel/' + name
        assert old(path) == Path(path).read_bytes(), name + ' changed'
        same.append(name)
files = sorted(p for p in Path('dist').rglob('*') if p.is_file())
runtime = sorted(str(p.relative_to('dist')) for p in Path('dist/assets/pixel').rglob('*') if p.is_file())
assert runtime == sorted('assets/pixel/' + name for name in art)
result = {'baseCommit': base, 'previousFrames': len(before), 'currentFrames': len(after),
          'unchangedExistingFrames': len(before), 'newOriginalHouses': hashes,
          'unchangedOtherArt': same, 'runtimeArt': runtime, 'buildFiles': len(files),
          'buildBytes': sum(p.stat().st_size for p in files)}
Path('docs/verification/town-polish/runtime-audit.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({'frames': len(after), 'retained': len(before), 'buildBytes': result['buildBytes']}))
