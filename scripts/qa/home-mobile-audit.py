"""Native cell, original provenance, shared structure and production allowlist audit."""
from pathlib import Path
from PIL import Image
import json,hashlib,subprocess,io
root=Path(__file__).resolve().parents[2];base='4db7b4a';out=root/'public/assets/pixel/processed'
oldmeta=json.loads(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.json'],cwd=root));meta=json.loads((out/'town.json').read_text());oldim=Image.open(io.BytesIO(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.png'],cwd=root))).convert('RGBA');im=Image.open(out/'town.png').convert('RGBA')
def cell(image,frame):
 f=frame['frame'];return image.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h']))
changed=[]
for name,f in oldmeta['frames'].items():
 assert f==meta['frames'][name],name
 if cell(oldim,f).tobytes()!=cell(im,f).tobytes():changed.append(name)
assert set(changed)==set('house-village-'+str(i) for i in range(13))
new=set(meta['frames'])-set(oldmeta['frames']);assert len(new)==12 and all(n.startswith('home-') for n in new)
import sys
sys.path.insert(0,str(root/'scripts'))
from home_interior_art import add_home_interior_art
from large_houses_art import dimensional_house
assets={};add_home_interior_art(assets);record=[]
for name,art in assets.items():
 assert cell(im,meta['frames'][name]).tobytes()==art.tobytes(),name
 record.append({'frame':name,'size':list(art.size),'pixelSha256':hashlib.sha256(art.tobytes()).hexdigest(),'source':'Original scripts/home_interior_art.py; no imported image/reference pixels.'})
for i in range(13):
 name='house-village-'+str(i);art=dimensional_house(i);assert cell(im,meta['frames'][name]).tobytes()==art.tobytes()
 assert art.getchannel('A').tobytes()==dimensional_house(0).getchannel('A').tobytes()
 record.append({'frame':name,'size':list(art.size),'pixelSha256':hashlib.sha256(art.tobytes()).hexdigest(),'source':'Original scripts/large_houses_art.py; reference structure, thirteen finishes, no imported image pixels.'})
assert len(set(r['pixelSha256'] for r in record if r['frame'].startswith('house-')))==13
allowed=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png'];art=[]
for name in allowed:
 p='public/assets/pixel/'+name;data=(root/p).read_bytes();old=subprocess.check_output(['git','show',base+':'+p],cwd=root)
 if name not in ['processed/town.png','processed/town.json']:assert data==old,p
 assert (root/'dist/assets/pixel'/name).read_bytes()==data
 art.append({'file':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'unchanged':data==old})
assert sorted(str(p.relative_to(root/'dist/assets/pixel')) for p in (root/'dist/assets/pixel').rglob('*') if p.is_file())==sorted(allowed)
files=[p for p in (root/'dist').rglob('*') if p.is_file()];assert len(files)==12
result={'baseline':base,'atlasFrames':len(meta['frames']),'unchangedOldCells':len(oldmeta['frames'])-len(changed),'changed':sorted(changed),'newFrames':sorted(new),'sameHouseAlpha':True,'uniqueHouseFinishes':13,'art':art,'productionFiles':len(files),'productionBytes':sum(p.stat().st_size for p in files)}
(root/'docs/verification/home-mobile/runtime-audit.json').write_text(json.dumps(result,indent=2)+'\n');(root/'docs/assets/licenses/home-mobile/original-cells.json').write_text(json.dumps(record,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k not in ['art','changed','newFrames']}))
