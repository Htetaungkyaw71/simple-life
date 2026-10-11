"""Reproduce the public-domain rooster WAV from the retained source recording.
No network or downloaded asset packs are needed for a normal game build.
"""
from pathlib import Path
import hashlib, json, subprocess, wave
import numpy as np
root=Path(__file__).resolve().parents[1]
evidence=root/'docs/assets/licenses/morning-audio'
original=evidence/'Medium_rooster_crowing.ogg'
raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(original),'-f','f32le','-ac','1','-ar','22050','pipe:1'])
samples=np.frombuffer(raw,dtype='<f4').astype(np.float64)
samples-=samples.mean()
# Keep the natural crow/clucking; only format, boundary and level changes.
head,tail=220,882
samples[:head]*=np.linspace(0,1,head);samples[-tail:]*=np.linspace(1,0,tail)
samples-=samples.mean()
samples*=min(.08/max(np.sqrt(np.mean(samples*samples)),1e-9),.35/max(np.max(abs(samples)),1e-9))
runtime='assets/audio/cozy/sfx-rooster.wav'
dest=root/'public'/runtime
with wave.open(str(dest),'wb') as w:
 w.setnchannels(1);w.setsampwidth(2);w.setframerate(22050);w.writeframes(np.round(samples*32767).astype('<i2').tobytes())
row={'id':'sfx-rooster','runtime':runtime,'creator':'alys','sourcePage':'https://commons.wikimedia.org/wiki/File:Medium_rooster_crowing.ogg','sourceURL':(evidence/'source-url.txt').read_text().strip(),'licence':'Public domain; author grants use for any purpose without conditions where dedication is unavailable','sourceSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'seconds':len(samples)/22050,'peak':float(np.max(abs(samples))),'rms':float(np.sqrt(np.mean(samples*samples))),'loop':False,'changes':'Mono PCM16 / 22050 Hz, DC removal, 10ms head / 40ms tail fades, RMS <= .08 and peak <= .35; no remix/music/loop'}
(evidence/'manifest.json').write_text(json.dumps({'reviewed':'2026-10-11','files':[row]},indent=2)+'\n')
print(json.dumps({'seconds':row['seconds'],'bytes':dest.stat().st_size,'peak':row['peak'],'rms':row['rms']}))
