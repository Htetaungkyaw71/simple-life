"""Audit selected native art, house changes, runtime allowlist and saved content IDs."""
from pathlib import Path
from PIL import Image
import hashlib,json,subprocess,tarfile,io,tempfile,zipfile,os
root=Path(__file__).resolve().parents[2];base='ba601de'
oldmeta=json.loads(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.json'],cwd=root));meta=json.loads((root/'public/assets/pixel/processed/town.json').read_text());oldim=Image.open(io.BytesIO(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.png'],cwd=root))).convert('RGBA');im=Image.open(root/'public/assets/pixel/processed/town.png').convert('RGBA')
changed=[]
for name,v in oldmeta['frames'].items():
 assert meta['frames'][name]==v,name
 f=v['frame'];box=(f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])
 if oldim.crop(box).tobytes()!=im.crop(box).tobytes():changed.append(name)
assert sorted(changed)==sorted('house-village-'+str(i) for i in range(13))
assert set(meta['frames'])-set(oldmeta['frames'])==set('rocky-'+n for n in ['cave','bones','deer','fox','rock','mushroom','orange','cairn'])
evidence=json.loads((root/'docs/assets/licenses/rocky-depth/selected-assets.json').read_text())
archive=Path(os.environ.get('SIMPLE_LIFE_ROCKY_ZIP','/Users/mac/Downloads/craftpix-net-639143-free-rocky-area-objects-pixel-art.zip'))
assert hashlib.sha256(archive.read_bytes()).hexdigest()==evidence['archiveSha256']
with zipfile.ZipFile(archive) as z:
 for item in evidence['selected']:
  raw=z.read(item['member']);assert hashlib.sha256(raw).hexdigest()==item['sha256'];native=Image.open(io.BytesIO(raw)).convert('RGBA').crop(item['crop']);f=meta['frames'][item['frame']]['frame'];cell=im.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h']));assert cell.tobytes()==native.tobytes(),item['frame']
allowed=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png'];art=[]
for name in allowed:
 p='public/assets/pixel/'+name;data=(root/p).read_bytes();old=subprocess.check_output(['git','show',base+':'+p],cwd=root)
 if name not in ['processed/town.png','processed/town.json']:assert data==old,p
 assert (root/'dist/assets/pixel'/name).read_bytes()==data
 art.append({'file':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'unchanged':data==old})
code="""import {FOREST_MAP,FORAGE_NODES,TREASURES,REGIONS} from './src/data/forest.js';import {forestTree} from './src/data/forestGrowth.js';import {WOODLAND_WILDLIFE} from './src/data/woodlandWildlife.js';import {ANIMAL_SPAWNS} from './src/data/wildlife.js';console.log(JSON.stringify({trees:FOREST_MAP.props.filter(forestTree).map(p=>'tree:'+p.name+':'+p.x+':'+p.y),forage:FORAGE_NODES.map(n=>n.id),animals:ANIMAL_SPAWNS.map(n=>n.id),quiet:WOODLAND_WILDLIFE.map(n=>n.id),caches:TREASURES.map(n=>n.id),regions:REGIONS.map(n=>n.id),terraces:FOREST_MAP.terraces.length,ledges:FOREST_MAP.ledges.length,rocky:FOREST_MAP.props.filter(p=>p.rocky).length}));"""
with tempfile.TemporaryDirectory(prefix='simple-life-depth-') as temp:
 with tarfile.open(fileobj=io.BytesIO(subprocess.check_output(['git','archive',base,'src','package.json'],cwd=root))) as tar:tar.extractall(temp,filter='data')
 old=json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=temp))
new=json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=root))
for key in ['forage','animals','quiet','caches','regions']:assert old[key]==new[key],key
files=sorted(p for p in (root/'dist').rglob('*') if p.is_file());assert len(files)==12
assert sorted(str(p.relative_to(root/'dist/assets/pixel')) for p in (root/'dist/assets/pixel').rglob('*') if p.is_file())==sorted(allowed)
assert not any(p.suffix in ['.zip','.rar','.md','.py','.pdf','.psd'] for p in files)
report={'version':'0.10.0','baseline':base,'files':len(files),'bytes':sum(p.stat().st_size for p in files),'runtimeArt':art,'atlasFrames':len(meta['frames']),'unchangedOldCells':len(oldmeta['frames'])-len(changed),'changedOldCells':changed,'newNativeCells':8,'progress':{'treesBefore':len(old['trees']),'treesAfter':len(new['trees']),'newTreeIDs':len(set(new['trees'])-set(old['trees'])),'retainedTreeIDs':len(set(new['trees'])&set(old['trees'])),'forage':len(new['forage']),'quietAnimals':len(new['quiet']),'boars':len(new['animals']),'regions':len(new['regions']),'caches':len(new['caches']),'forageAnimalDiscoveryCacheIDsUnchanged':True,'terraces':new['terraces'],'ledges':new['ledges'],'rockyLandmarks':new['rocky']},'newDependencies':0}
out=root/'docs/verification/scene-depth/runtime-audit.json';out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['version','files','bytes','unchangedOldCells','progress']}))
