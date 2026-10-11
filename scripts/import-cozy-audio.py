"""Curate supplied archives; never copy archives or unused assets into runtime.
Run with the bundled Python (numpy), ffmpeg, and optional source directory argument.
"""
from pathlib import Path
import hashlib, io, json, subprocess, sys, tempfile, wave, zipfile
import numpy as np

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv)>1 else Path('/Users/mac/Downloads')
evidence = root/'docs/assets/licenses/cozy-audio'
evidence.mkdir(parents=True, exist_ok=True)
files = json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {COZY_FILES} from './src/audio/cozy.js'; console.log(JSON.stringify(COZY_FILES))"], cwd=root))
archives = ['Cozy SFX Volume 1.zip','cozy-farm-sfx.zip','cozy-farm-sfx-ambience-1.zip','cozy-farm-sfx-ambience-2.zip','cozy-nature-ambience-ogg.zip']
manifest = {'reviewed':'2026-10-11','archives':[], 'files':[]}
for name in archives:
    p=source/name
    with zipfile.ZipFile(p) as z:
        texts=[n for n in z.namelist() if n.lower().endswith('.txt')]
        for n in texts:
            (evidence/(p.stem+'-'+Path(n).name)).write_bytes(z.read(n))
    manifest['archives'].append({'file':name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'embeddedText':texts})

nature={'wind':'meadow-wind','forestDay':'forest-day','night':'night-crickets','water':'river-stream','room':'fireplace-room','fountain':'town-fountain','winter':'winter-wind'}
for key, target in files.items():
    if key=='sfx-rooster':continue # Separate public-domain evidence/import-morning-audio.py.
    if key.startswith('sfx-'):
        archive='cozy-farm-sfx.zip'; member='cozy-farm-sfx/sfx/'+key[4:]+'.wav'; creator='Spaceyyy (formerly Bramble & Byte)'; looping=False
    elif key=='cozyMusic':
        archive='Cozy SFX Volume 1.zip'; member='Cozy SFX Volume 1/BONUS TRACK/BONUS_TRACK.wav'; creator='HuntSounds'; looping=True
    else:
        archive='cozy-nature-ambience-ogg.zip'; member='cozy-nature-ambience/ogg/'+nature[key]+'.ogg'; creator='Spaceyyy (formerly Bramble & Byte)'; looping=True
    with zipfile.ZipFile(source/archive) as z: original=z.read(member)
    with tempfile.TemporaryDirectory() as temp:
        p=Path(temp)/Path(member).name;p.write_bytes(original)
        raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','1','-ar','22050','pipe:1'])
    samples=np.frombuffer(raw,dtype='<f4').astype(np.float64);samples-=samples.mean()
    if looping and key!='cozyMusic':
        # Circular overlap makes decoded Ogg edge discontinuities inaudible without a silent gap.
        n=2205;t=np.linspace(0,1,n);samples=np.concatenate((samples[n:-n],samples[-n:]*(1-t)+samples[:n]*t))
    else:
        n=min(110,len(samples)//4);env=np.linspace(0,1,n);samples[:n]*=env;samples[-n:]*=env[::-1]
    samples-=samples.mean() # Edge processing can introduce a small DC component.
    rms=float(np.sqrt(np.mean(samples*samples)));peak=float(np.max(np.abs(samples)))
    level=.075 if key=='cozyMusic' else .11 if looping else .10
    samples*=min(level/max(rms,1e-9),(.40 if looping else .50)/max(peak,1e-9))
    dest=root/'public'/target;dest.parent.mkdir(parents=True,exist_ok=True)
    with wave.open(str(dest),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(22050);w.writeframes(np.round(samples*32767).astype('<i2').tobytes())
    data=dest.read_bytes()
    manifest['files'].append({'id':key,'runtime':target,'archive':archive,'member':member,'creator':creator,'sourceSha256':hashlib.sha256(original).hexdigest(),'sha256':hashlib.sha256(data).hexdigest(),'seconds':len(samples)/22050,'peak':float(np.max(np.abs(samples))),'rms':float(np.sqrt(np.mean(samples*samples))),'dc':float(samples.mean()),'boundaryStep':float(abs(samples[0]-samples[-1])),'loop':looping,'changes':'mono PCM16 / 22050 Hz, DC removal, loudness adjustment; 100ms circular ambience overlap / 5ms music-effect edge fades'})
(evidence/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'selected':len(files),'bytes':sum((root/'public'/p).stat().st_size for p in files.values()),'maxPeak':max(f['peak'] for f in manifest['files'])}))
