"""Verify integration preserved the complete old atlas and every approved PNG."""
from pathlib import Path
from PIL import Image
import json,zipfile,hashlib
r=Path.cwd();o=r/'output/art/city-shops-v1';p=r/'output/previews/city-garden-shops-v2'
old=Image.open(o/'before-town.png').convert('RGBA');new=Image.open(r/'public/assets/pixel/processed/town.png').convert('RGBA')
a=json.loads((o/'before-town.json').read_text());b=json.loads((r/'public/assets/pixel/processed/town.json').read_text())
assert new.crop((0,0,*old.size)).tobytes()==old.tobytes()
for k,v in a['frames'].items():assert b['frames'][k]==v,k
for asset in json.loads((p/'objects.json').read_text())['assets']:
 im=Image.open(p/asset['file']).convert('RGBA');f=b['frames']['city-review-'+asset['name']]['frame'];assert new.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])).tobytes()==im.tobytes(),asset['name']
other=0
with zipfile.ZipFile(o/'before-runtime-assets.zip') as z:
 for n in z.namelist():
  if n.endswith('/town.png') or n.endswith('/town.json'):continue
  assert (r/n).read_bytes()==z.read(n),n;other+=1
result={'oldAtlasPixelsExact':True,'oldFramesExact':len(a['frames']),'approvedPNGsExact':9,'otherRuntimeFilesExact':other,'newAtlasSize':list(new.size)}
(o/'preservation-check.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
