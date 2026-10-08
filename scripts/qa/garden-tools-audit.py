"""Audit v0.6.2 native art against v0.6.1 and the production art allowlist.
Run from the repository root after npm run build; requires Pillow.
"""
from pathlib import Path
from PIL import Image,ImageDraw
from io import BytesIO
import subprocess,json,hashlib
out=Path('docs/verification/garden-tools');out.mkdir(parents=True,exist_ok=True)
base='f87c2cf';folder='public/assets/pixel/processed/'
def old(path):return subprocess.check_output(['git','show',base+':'+path])
a=Image.open(BytesIO(old(folder+'town.png'))).convert('RGBA');b=Image.open(folder+'town.png').convert('RGBA');ma=json.loads(old(folder+'town.json'));mb=json.loads(Path(folder+'town.json').read_text())
def crop(im,r):return im.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
changed=[];unchanged=[]
for name,f in ma['frames'].items():
 assert f==mb['frames'][name],name+' moved'
 (unchanged if crop(a,f['frame']).tobytes()==crop(b,f['frame']).tobytes() else changed).append(name)
added=[n for n in mb['frames'] if n not in ma['frames']]
assert sorted(added)==['axe-item','grass-item','hand-item','wood-item']
assert len(changed)==24 and all(n.endswith('-seed') or n.endswith('-seed-item') for n in changed),changed
art=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png'];same=[]
for name in art:
 path='public/assets/pixel/'+name
 if name not in ['processed/town.png','processed/town.json']:assert old(path)==Path(path).read_bytes();same.append(name)
files=[p for p in Path('dist').rglob('*') if p.is_file()];distart=sorted(str(p.relative_to('dist/assets/pixel')) for p in Path('dist/assets/pixel').rglob('*') if p.is_file());assert distart==sorted(art)
result={'baseCommit':base,'oldFrames':len(ma['frames']),'frames':len(mb['frames']),'unchangedFrames':len(unchanged),'changedFrames':changed,'addedFrames':added,'unchangedArtFiles':same,'runtimeFiles':[str(p.relative_to('dist')) for p in sorted(files)],'runtimeBytes':sum(p.stat().st_size for p in files),'artAllowlist':distart,'atlasSha256':hashlib.sha256(Path(folder+'town.png').read_bytes()).hexdigest()}
(out/'runtime-audit.json').write_text(json.dumps(result,indent=2)+'\n')
# Native atlas gallery, explicitly a source-pixel study, not a browser screenshot.
cs=('tomato','strawberry','carrot','corn','chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato');sheet=Image.new('RGBA',(720,450),'#ece3ba');d=ImageDraw.Draw(sheet);d.text((12,8),'ORIGINAL SEED / TOOL PIXELS — OFFLINE ATLAS STUDY',fill='#3e4730')
for i,c in enumerate(cs):
 x=12+(i%4)*174;y=38+(i//4)*110;d.text((x,y),c,fill='#3e4730')
 for j,key in enumerate((c+'-seed-item',c+'-seed')):
  im=crop(b,mb['frames'][key]['frame']);im=im.resize((im.width*2,im.height*2),Image.Resampling.NEAREST);sheet.alpha_composite(im,(x+j*58,y+16))
for i,key in enumerate(added+['shovel-item','watering-can-item']):
 im=crop(b,mb['frames'][key]['frame']).resize((32,32),Image.Resampling.NEAREST);sheet.alpha_composite(im,(12+i*112,390));d.text((12+i*112,428),key.replace('-item',''),fill='#3e4730')
sheet.convert('RGB').save(out/'atlas-study.png')
print(json.dumps({k:result[k] for k in ['frames','unchangedFrames','addedFrames','runtimeBytes']}))
