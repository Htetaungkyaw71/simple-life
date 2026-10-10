"""Verify targeted cell replacement and every packaged runtime path."""
from pathlib import Path
from PIL import Image,ImageChops
import subprocess,io,json,hashlib,sys
root=Path(__file__).resolve().parents[2];base='ce6903a';out=root/'public/assets/pixel/processed'
sys.path.insert(0,str(root/'scripts'))
from original_environment_art import original_environment
meta=json.loads((out/'town.json').read_text());oldmeta=json.loads(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.json'],cwd=root));assert meta==oldmeta
old=Image.open(io.BytesIO(subprocess.check_output(['git','show',base+':public/assets/pixel/processed/town.png'],cwd=root))).convert('RGBA');im=Image.open(out/'town.png').convert('RGBA');changed=[]
for name,v in meta['frames'].items():
 f=v['frame'];box=(f['x'],f['y'],f['x']+f['w'],f['y']+f['h'])
 if old.crop(box).tobytes()!=im.crop(box).tobytes():changed.append(name)
 if name in original_environment():assert im.crop(box).tobytes()==original_environment()[name].tobytes();old.paste(im.crop(box),box)
assert set(changed)==set(original_environment());assert old.tobytes()==im.tobytes()
allowed=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png'];art=[]
for name in allowed:
 p='public/assets/pixel/'+name;data=(root/p).read_bytes();before=subprocess.check_output(['git','show',base+':'+p],cwd=root)
 if name!='processed/town.png':assert data==before
 assert (root/'dist/assets/pixel'/name).read_bytes()==data
 art.append({'file':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'unchanged':before==data})
assert sorted(str(p.relative_to(root/'dist/assets/pixel')) for p in (root/'dist/assets/pixel').rglob('*') if p.is_file())==sorted(allowed)
expected={n+'.wav' for n in ['title','farm','city','forest','night','completion']};assert {p.name for p in (root/'dist/assets/audio').iterdir()}==expected
files=[p for p in (root/'dist').rglob('*') if p.is_file()];assert len(files)==18;assert not any(p.suffix.lower() in ['.zip','.rar','.psd','.html','.md'] for p in files if p.name!='index.html')
normalize=lambda text:' '.join(text.split())
phaser_bundle=next((root/'dist/assets').glob('phaser-*.js')).read_text()
app_bundle=next((root/'dist/assets').glob('index-*.js')).read_text()
for licence in ['phaser-LICENSE.md','eventemitter3-LICENSE']:
 assert normalize((root/'docs/licenses'/licence).read_text()) in normalize(phaser_bundle)
assert normalize((root/'docs/licenses/vite-LICENSE.md').read_text().split('# Licenses of bundled dependencies')[0]) in normalize(app_bundle)
result={'result':'PASS','runtimeNoticesPresent':True,'baseline':base,'atlasFrames':len(meta['frames']),'changedCells':changed,'unchangedCells':len(meta['frames'])-8,'metadataUnchanged':True,'outsideReplacementPixelsUnchanged':True,'runtimeArt':art,'productionFiles':[{'file':str(p.relative_to(root/'dist')),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(files)],'productionBytes':sum(p.stat().st_size for p in files)}
(root/'docs/verification/story-audio/runtime-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k not in ['runtimeArt','productionFiles','changedCells']}))
