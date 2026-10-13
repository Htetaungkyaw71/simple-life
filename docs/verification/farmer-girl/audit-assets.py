"""Audit generated girl's native poses, grips and runtime asset exclusion."""
from pathlib import Path
import hashlib, json, subprocess, sys
from PIL import Image
ROOT=Path(__file__).resolve().parents[3]
sys.path.insert(0,str(ROOT/'scripts'))
from generated_girl import native_poses, DIRECTIONS
poses,anchors=native_poses()
sheet=Image.open(ROOT/'public/assets/pixel/processed/girl.png').convert('RGBA')
assert sheet.size==(576,192)
hands=json.loads((ROOT/'src/data/girlHands.js').read_text().split('export const GIRL_HANDS=')[1].strip().rstrip(';'))
rows=[]
for row,dir in enumerate(DIRECTIONS):
 idle,*run=poses[row]
 actual=[sheet.crop((f*48,row*48,(f+1)*48,(row+1)*48)) for f in range(12)]
 assert all(a.tobytes()==b.tobytes() for a,b in zip(actual,[idle,*run,run[2],run[6],run[2]]))
 assert len({im.tobytes() for im in run})==8
 def changed(region):
  a=run[0].crop(region).tobytes()
  return max(sum(a[i:i+4]!=b[i:i+4] for i in range(0,len(a),4)) for b in [im.crop(region).tobytes() for im in run[1:]])
 armChanges=changed((0,22,48,33));footChanges=changed((0,33,48,41))
 assert armChanges>=8 and footChanges>=8,(dir,armChanges,footChanges)
 for f,im in enumerate(actual):
  assert set(im.getchannel('A').get_flattened_data())<={0,255}
  box=im.getbbox();assert box and 8<=box[1]<=13 and 37<=box[3]<=40
  hx,hy=hands[dir][f];x,y=24+(hx-1)/2,40+(hy-1)/2
  assert x.is_integer() and y.is_integer()
  r,g,b,a=im.getpixel((int(x),int(y)));assert 25<=y<34 and a==255 and r>=180 and g>=110 and r>g*1.25 and g>b*1.25
 rows.append({'direction':dir,'uniqueRunFrames':8,'armPixelChanges':armChanges,'footPixelChanges':footChanges,'idleBounds':idle.getbbox(),'runBounds':[im.getbbox() for im in run]})
palette={p[:3] for p in sheet.get_flattened_data() if p[3]};assert len(palette)<=32
unchanged=['boy.png','appearance.png','town.png','town.json']
for f in unchanged:
 path='public/assets/pixel/processed/'+f
 assert subprocess.check_output(['git','show','HEAD:'+path],cwd=ROOT)==(ROOT/path).read_bytes()
files=sorted(p.relative_to(ROOT/'dist').as_posix() for p in (ROOT/'dist').rglob('*') if p.is_file())
assert not any(s in f for f in files for s in ['generated-sheet','farmer-girl','source','prompts','record.json','.zip'])
assets=[f for f in files if f.startswith('assets/pixel/') or f.startswith('assets/audio/')]
assert len(files)==46,len(files)
assert len([f for f in assets if f.endswith('.wav')])==27
assert (ROOT/'dist/assets/pixel/processed/girl.png').read_bytes()==(ROOT/'public/assets/pixel/processed/girl.png').read_bytes()
result={'result':'PASS','sourceSha256':hashlib.sha256((ROOT/'docs/assets/licenses/farmer-girl-v1/source/generated-sheet.png').read_bytes()).hexdigest(),'nativeCells':48,'generatedIdlePoses':4,'generatedRunPoses':32,'handGrips':48,'paletteColours':len(palette),'rows':rows,'unchangedMaleNpcLegacyAssets':unchanged,'runtimeFiles':len(files),'runtimeBytes':sum((ROOT/'dist'/f).stat().st_size for f in files),'unchangedWavFiles':27,'sourceEvidenceExcluded':True}
(Path(__file__).parent/'native-audit.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
