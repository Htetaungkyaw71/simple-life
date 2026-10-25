"""Native review-frame checks; no game state or runtime assets are mutated."""
from pathlib import Path
from PIL import Image
import hashlib,json,sys
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/art/npc-matching-v1'
checks={'characters':{},'runtimeBaselineChecked':False}
for name in ['nell','sol']:
 frames=[]
 for direction in ['south','north','west','east']:
  im=Image.open(OUT/f'frames/{name}/{direction}.png').convert('RGBA');assert im.size==(64,64)
  b=im.getbbox();assert b[3]-b[1]==40 and b[3]==57
  assert {p[3] for p in im.get_flattened_data()}=={0,255}
  assert len({p for p in im.get_flattened_data() if p[3]})<=32
  assert not any(im.getpixel((x,y))[3] for x in range(64) for y in range(64) if x in [0,63] or y in [0,63])
  frames.append(direction)
 front=Image.open(OUT/f'frames/{name}/south.png').convert('RGBA');eyes=[]
 for y in range(24,30):
  for x in range(28,36):
   p=front.getpixel((x,y));skin=lambda q:q[3] and q[0]>180 and q[0]>q[1]*1.25
   if p[3] and max(p[:3])<65 and skin(front.getpixel((x-1,y))) and skin(front.getpixel((x+1,y))):eyes.append([x,y])
 xs=sorted(set(x for x,y in eyes));assert len(xs)==2,(name,eyes)
 heights=[len([y for x,y in eyes if x==xx]) for xx in xs];assert heights==[2,2],(name,eyes)
 checks['characters'][name]={'frames':frames,'visibleNativeHeight':40,'gameHeightAt1_5x':60,'frontPupilDimensions':[[1,h] for h in heights],'eyePixels':eyes,'binaryAlpha':True,'maxColoursPerFrame':32,'clearMargins':True}
# The former review-only baseline predates the now-authorized runtime integration.
if '--check-review-baseline' in sys.argv:
 for path,sha in json.loads((ROOT/'docs/verification/npc-matching/baseline-hashes.json').read_text()).items():
  assert hashlib.sha256((ROOT/path).read_bytes()).hexdigest()==sha,path
 checks['runtimeBaselineChecked']=True
(ROOT/'docs/verification/npc-matching/asset-audit.json').write_text(json.dumps(checks,indent=2)+'\n')
print(json.dumps(checks,indent=2))
