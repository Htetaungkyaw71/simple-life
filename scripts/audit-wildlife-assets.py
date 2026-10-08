"""Pixel preservation, source fingerprints and review contact sheet for v0.4.7."""
from pathlib import Path
from PIL import Image,ImageDraw
import hashlib,io,json,subprocess,zipfile
if not Path('src/data/wildlifeSprites.js').exists():
 raise SystemExit('Historical v0.4.7 audit: run from the v0.4.7 checkout. Current checks: docs/verification/forest-reference/VERIFICATION.md.')
base=Path('public/assets/pixel');out=Path('docs/verification/wildlife-sprites');out.mkdir(exist_ok=True)
atlas=Image.open(base/'processed/town.png').convert('RGBA');frames=json.loads((base/'processed/town.json').read_text())['frames']
rigs=json.loads(Path('src/data/wildlifeSprites.js').read_text().split('=',1)[1].rstrip(';\n'))
def cell(image,f):
 r=f['frame'];return image.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
before=Image.open(io.BytesIO(subprocess.check_output(['git','show','c1efdfe:public/assets/pixel/processed/town.png']))).convert('RGBA')
old=json.loads(subprocess.check_output(['git','show','c1efdfe:public/assets/pixel/processed/town.json']))['frames']
removed={species+str(i) for species in rigs for i in range(4)}
retained=[]
for name,f in old.items():
 if name in removed:assert name not in frames;continue
 assert cell(before,f).tobytes()==cell(atlas,frames[name]).tobytes(),name
 retained.append(name)
unchanged=[]
for p in ['world.png','world.json','font.png','font.xml','processed/boy.png','processed/girl.png']:
 assert (base/p).read_bytes()==subprocess.check_output(['git','show','c1efdfe:public/assets/pixel/'+p]),p
 unchanged.append(p)
for name,f in frames.items():
 r=f['frame'];assert 0<=r['x']<=1024-r['w'] and 0<=r['y']<=2048-r['h'],name
 if name.startswith('wa-'):assert cell(atlas,f).getbbox(),name
sheet=Image.new('RGBA',(1400,800),(133,147,93));draw=ImageDraw.Draw(sheet)
for i,(species,rig) in enumerate(rigs.items()):
 x=20+i%5*280;y=20+i//5*260;draw.text((x,y),species,fill=(36,43,26))
 d='down' if rig['directional'] else 'side';cut=cell(atlas,frames[f'wa-{species}-idle-{d}-0']);sheet.alpha_composite(cut.resize((cut.width*2,cut.height*2),Image.Resampling.NEAREST),(x+20,y+40))
sheet.save(out/'selected-animals.png')
directions=Image.new('RGBA',(1100,15*155),(133,147,93));draw=ImageDraw.Draw(directions)
for row,(species,rig) in enumerate(rigs.items()):
 draw.text((4,row*155+4),species,fill=(36,43,26))
 for col,d in enumerate(['up','right','down','left'] if rig['directional'] else ['side']):
  cut=cell(atlas,frames[f'wa-{species}-walk-{d}-0']);directions.alpha_composite(cut.resize((cut.width*2,cut.height*2),Image.Resampling.NEAREST),(col*250+30,row*155+25))
directions.save(out/'directions.png')
inputs=list(Path('public/assets/vendor/wildlife').glob('*'))+[Path.home()/'Downloads/Animals v1.0.zip',Path.home()/'Downloads/endangered_animals_ilaria_lazzartotto.png',Path.home()/'Downloads/basic asset pack.zip']
hashes={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in inputs}
license_dir=Path('docs/assets/licenses/wildlife-sprites')
(license_dir/'fingerprints.json').write_text(json.dumps(hashes,indent=2)+'\n')
with zipfile.ZipFile('public/assets/vendor/wildlife/elephant-1.1.zip') as z:
 for name in ['LICENSE.txt','README.txt','sources.md']:(license_dir/('elephant-'+name)).write_text('\n'.join(line.rstrip() for line in z.read(name).decode().splitlines()).rstrip()+'\n')
built=list(p for p in Path('dist').rglob('*') if p.is_file())
report={'baseline':'c1efdfe','atlasFrames':len(frames),'retainedFramePixelsUnchanged':len(retained),'removedPlaceholderFrames':len(removed),'unchangedOtherArtFiles':unchanged,'newSpecies':list(rigs),'newNamedFrames':sum(n.startswith('wa-') for n in frames),'productionFiles':len(built),'productionBytes':sum(p.stat().st_size for p in built),'productionPaths':[str(p) for p in built]}
assert len(built)==12
assert not any('vendor' in str(p) or 'manifest' in str(p) or p.suffix in ['.zip','.md','.py'] for p in built)
(out/'asset-audit.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
