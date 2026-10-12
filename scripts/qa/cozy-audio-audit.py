from pathlib import Path
import hashlib, json, subprocess, wave, os
import numpy as np
root=Path(__file__).resolve().parents[2]
manifest=json.loads((root/'docs/assets/licenses/cozy-audio/manifest.json').read_text())
manifest['files']+=json.loads((root/'docs/assets/licenses/morning-audio/manifest.json').read_text())['files']
mapping=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {COZY_FILES} from './src/audio/cozy.js'; import {AUDIO_FILES} from './src/audio/score.js'; console.log(JSON.stringify({...COZY_FILES,...AUDIO_FILES}))"],cwd=root))
expected=set(mapping.values())
actual={str(p.relative_to(root/'dist')) for p in (root/'dist/assets/audio').rglob('*') if p.is_file()}
assert actual==expected
checks=[]
assert {row['runtime'] for row in manifest['files'] if row['runtime'] in expected}==expected
for row in manifest['files']:
 if row['runtime'] not in mapping.values():continue # Earlier selected effects remain provenance, outside production.
 p=root/'public'/row['runtime'];assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'];assert p.read_bytes()==(root/'dist'/row['runtime']).read_bytes()
 with wave.open(str(p)) as w:
  assert w.getnchannels()==1 and w.getsampwidth()==2 and w.getframerate()==22050
  samples=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(float)/32767
 assert np.isfinite(samples).all() and np.max(abs(samples))<=.501
 assert abs(samples.mean())<.0005
 assert np.sqrt(np.mean(samples*samples))>.005
 seam=float(abs(samples[0]-samples[-1]));normal=float(np.quantile(abs(np.diff(samples)),.99))
 # Broadband nature has larger ordinary adjacent-sample steps than tonal music.
 assert seam<=max(.005,normal),row['id']
 checks.append({'id':row['id'],'seconds':len(samples)/22050,'peak':float(np.max(abs(samples))),'rms':float(np.sqrt(np.mean(samples*samples))),'boundaryStep':seam,'normalStep99':normal,'clipped':0})
for p in (root/'public/assets/pixel').rglob('*'):
 if p.is_file() and 'fonts' not in p.parts and (root/'dist/assets/pixel'/p.relative_to(root/'public/assets/pixel')).exists():
  old=subprocess.check_output(['git','show','0cf62d9:'+str(p.relative_to(root))],cwd=root);assert old==p.read_bytes()
fonts=json.loads((root/'docs/assets/licenses/ui-fonts/manifest.json').read_text())
for row in fonts['files']:
 p=root/row['file'];assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256']
 if row['file'].startswith('public/'):
  assert p.read_bytes()==(root/'dist'/row['file'].removeprefix('public/')).read_bytes()
  if p.suffix=='.png':
   from PIL import Image
   assert set(Image.open(p).getchannel('A').tobytes())=={0,255}
files=[p for p in (root/'dist').rglob('*') if p.is_file()]
assert len(files)==len(expected)+16
assert not any(p.suffix.lower() in ['.zip','.rar','.md','.txt','.ogg','.mp4'] for p in files)
normalize=lambda text:' '.join(text.split())
phaser=next((root/'dist/assets').glob('phaser-*.js')).read_text();app=next((root/'dist/assets').glob('index-*.js')).read_text()
for name in ['phaser-LICENSE.md','eventemitter3-LICENSE']:assert normalize((root/'docs/licenses'/name).read_text()) in normalize(phaser)
assert normalize((root/'docs/licenses/vite-LICENSE.md').read_text().split('# Licenses of bundled dependencies')[0]) in normalize(app)
result={'result':'PASS','licensedSamples':len(checks),'runtimeAudio':len(expected),'artUnchanged':True,'runtimeNoticesPresent':True,'productionFiles':len(files),'productionBytes':sum(p.stat().st_size for p in files),'files':checks}
out=root/os.environ.get('AUDIO_QA_OUT','docs/verification/cozy-audio');out.mkdir(parents=True,exist_ok=True);(out/'runtime-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='files'}))
