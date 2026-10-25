"""Audit native NPC frames and untouched pre-existing atlas content."""
from pathlib import Path
from PIL import Image
import json,hashlib
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'output/art/npc-matching-animated-v1';ART=ROOT/'public/assets/pixel/processed'
manifest=json.loads((OUT/'manifest.json').read_text());meta=json.loads((ART/'town.json').read_text());atlas=Image.open(ART/'town.png').convert('RGBA');count=0;heights=[]
for name,actions in manifest['clips'].items():
 for action,clip in actions.items():
  for entry in clip['frames']:
   direction=entry['direction'];phase=entry['phase'];im=Image.open(OUT/f'frames/{name}/{action}/{direction}/{phase:02}.png').convert('RGBA');r=meta['frames'][f'npc-{name}-{action}-{direction}-{phase}']['frame'];b=im.getbbox()
   assert im.size==(64,64) and set(im.getchannel('A').get_flattened_data())=={0,255}
   assert b[0]>0 and b[1]>0 and b[2]<64 and b[3]==57,(name,action,direction,phase,b)
   assert im.tobytes()==atlas.crop((r['x'],r['y'],r['x']+64,r['y']+64)).tobytes()
   if action=='idle' and phase in [0,3]:
    compass={'down':'south','up':'north','left':'west','right':'east'}[direction]
    assert im.tobytes()==Image.open(ROOT/f'output/art/npc-matching-v1/frames/{name}/{compass}.png').convert('RGBA').tobytes()
   heights.append(b[3]-b[1]);count+=1
assert count==80
baseline=Path('/private/tmp/simple-life-npc-town-baseline.json');preserved=None
if baseline.exists():
 old=json.loads(baseline.read_text());oldim=Image.open('/private/tmp/simple-life-npc-town-baseline.png').convert('RGBA')
 for key,v in old['frames'].items():
  assert meta['frames'][key]==v
  r=v['frame'];box=(r['x'],r['y'],r['x']+r['w'],r['y']+r['h']);assert oldim.crop(box).tobytes()==atlas.crop(box).tobytes(),key
 preserved=len(old['frames'])
hashes=json.loads((ROOT/'docs/verification/npc-integration/baseline-hashes.json').read_text());unchanged=[]
for path,sha in hashes.items():
 if path.endswith(('town.png','town.json')):continue
 assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==sha,path
 unchanged.append(path)
result={'frames':count,'binaryAlpha':True,'alignedBootBaseline':56,'nativeHeightRange':[min(heights),max(heights)],'neutralFramesUnchanged':16,'legacyAtlasFramesPreserved':preserved,'unchangedFiles':unchanged,'atlasSize':atlas.size,'nativeFramesEqualRuntime':True}
(ROOT/'docs/verification/npc-integration/native-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
