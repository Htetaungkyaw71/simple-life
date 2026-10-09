"""Audit the original Home correction against the completed v0.11.0 release."""
from pathlib import Path
from PIL import Image
import json,hashlib,subprocess,io,sys
root=Path(__file__).resolve().parents[2];base='c9f21ee';out=root/'public/assets/pixel/processed'
oldmeta=json.loads(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.json'],cwd=root));meta=json.loads((out/'town.json').read_text())
old=Image.open(io.BytesIO(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.png'],cwd=root))).convert('RGBA');atlas=Image.open(out/'town.png').convert('RGBA')
def cell(image,frame):
 r=frame['frame'];return image.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
houses={f'house-village-{n}' for n in range(13)};changed=[]
assert set(meta['frames'])==set(oldmeta['frames'])
for name,f in meta['frames'].items():
 if name!='house-village-0':assert f==oldmeta['frames'][name],name
 if cell(atlas,f).tobytes()!=cell(old,oldmeta['frames'][name]).tobytes():changed.append(name)
assert set(changed)==houses
sys.path.insert(0,str(root/'scripts'))
from large_houses_art import dimensional_house
records=[]
for n in range(13):
 name=f'house-village-{n}';art=dimensional_house(n)
 assert cell(atlas,meta['frames'][name]).tobytes()==art.tobytes()
 if n>1:assert art.getchannel('A').tobytes()==dimensional_house(1).getchannel('A').tobytes()
 records.append({'frame':name,'size':list(art.size),'sha256':hashlib.sha256(art.tobytes()).hexdigest(),'source':'Original scripts/large_houses_art.py. Home drawn directly at 180x144; twelve other cottages at 120x96. No reference pixels or resampled sprites.'})
allowed=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png'];files=[]
for name in allowed:
 p='public/assets/pixel/'+name;data=(root/p).read_bytes();before=subprocess.check_output(['git','show',base+':'+p],cwd=root)
 if name not in ['processed/town.png','processed/town.json']:assert data==before
 assert (root/'dist/assets/pixel'/name).read_bytes()==data
 files.append({'file':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'unchanged':data==before})
assert sorted(str(p.relative_to(root/'dist/assets/pixel')) for p in (root/'dist/assets/pixel').rglob('*') if p.is_file())==sorted(allowed)
production=[p for p in (root/'dist').rglob('*') if p.is_file()];assert len(production)==12
result={'baseline':base,'atlasFrames':len(meta['frames']),'unchangedCells':len(meta['frames'])-len(changed),'changed':sorted(changed),'relocatedFrame':'house-village-0','newFrames':0,'runtimeArtFiles':files,'productionFiles':len(production),'productionBytes':sum(p.stat().st_size for p in production)}
evidence=root/'docs/assets/licenses/home-proportions';evidence.mkdir(parents=True,exist_ok=True)
(evidence/'original-cells.json').write_text(json.dumps(records,indent=2)+'\n')
(root/'docs/verification/home-proportions/runtime-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['runtimeArtFiles','changed']}))
