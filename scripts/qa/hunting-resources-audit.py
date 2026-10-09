"""Check original resource additions, retained art and runtime allowlist."""
from pathlib import Path
from PIL import Image
from io import BytesIO
import hashlib
import json
import subprocess

base='5466130'
root=Path('public/assets/pixel')
art=['font.png','font.xml','world.png','world.json','processed/boy.png','processed/girl.png','processed/town.png','processed/town.json']
old=lambda path:subprocess.check_output(['git','show',base+':'+str(path)])
meta=json.loads((root/'processed/town.json').read_text())['frames']
before=json.loads(old(root/'processed/town.json'))['frames']
atlas=Image.open(root/'processed/town.png').convert('RGBA')
previous=Image.open(BytesIO(old(root/'processed/town.png'))).convert('RGBA')
for name,f in before.items():
    assert meta[name]==f,name+' metadata'
    r=f['frame'];box=(r['x'],r['y'],r['x']+r['w'],r['y']+r['h'])
    assert atlas.crop(box).tobytes()==previous.crop(box).tobytes(),name+' pixels'
added=sorted(set(meta)-set(before))
assert added==['loose-stones','meat-item','stone-item']
unchanged=[]
for name in art:
    if name.startswith('processed/town'):continue
    assert (root/name).read_bytes()==old(root/name),name
    unchanged.append(name)
runtime=sorted(str(p.relative_to('dist/assets/pixel')) for p in Path('dist/assets/pixel').rglob('*') if p.is_file())
assert runtime==sorted(art)
for name in art:assert (root/name).read_bytes()==(Path('dist/assets/pixel')/name).read_bytes(),name+' build'
files=[p for p in Path('dist').rglob('*') if p.is_file()]
result={'baseCommit':base,'unchangedOldFrames':len(before),'newOriginalFrames':added,'frames':len(meta),'unchangedArt':unchanged,'runtimeArt':runtime,'runtimeSha256':{name:hashlib.sha256((root/name).read_bytes()).hexdigest() for name in art},'originalSourceSha256':hashlib.sha256(Path('scripts/hunting_resources_art.py').read_bytes()).hexdigest(),'buildFiles':len(files),'buildBytes':sum(p.stat().st_size for p in files)}
Path('docs/verification/hunting-resources/runtime-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
