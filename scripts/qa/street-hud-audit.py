"""Verify unchanged art and the production allowlist after street/HUD repairs."""
from pathlib import Path
import hashlib
import json
import subprocess

base = 'ef08d42'
root = Path('public/assets/pixel')
art = ['font.png', 'font.xml', 'world.png', 'world.json',
       'processed/boy.png', 'processed/girl.png', 'processed/town.png', 'processed/town.json']
hashes = {}
for name in art:
    path = root / name
    data = path.read_bytes()
    assert data == subprocess.check_output(['git', 'show', base + ':' + str(path)]), name
    hashes[name] = hashlib.sha256(data).hexdigest()
runtime = sorted(str(p.relative_to('dist/assets/pixel'))
                 for p in Path('dist/assets/pixel').rglob('*') if p.is_file())
assert runtime == sorted(art)
files = [p for p in Path('dist').rglob('*') if p.is_file()]
result = {'baseCommit': base, 'unchangedArtSha256': hashes, 'runtimeArt': runtime,
          'frames': len(json.loads((root / 'processed/town.json').read_text())['frames']),
          'buildFiles': len(files), 'buildBytes': sum(p.stat().st_size for p in files)}
out = Path('docs/verification/street-hud/runtime-audit.json')
out.write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result))
