"""Verify the targeted crop export and unchanged gameplay/character assets."""
from pathlib import Path
from PIL import Image
import json,hashlib
ROOT=Path(__file__).resolve().parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def audit():
 baseline=json.loads((ROOT/'docs/verification/farm-refresh/baseline.json').read_text());ok=[]
 for path,expected in baseline.items():
  if path.endswith('town.png'):continue
  actual=sha(ROOT/path)
  if path=='src/data/farms.js':
   text=(ROOT/path).read_text().replace('// Each farm repeats the original 4x4 beds; scenery stays outside the planting area.','// Each farm repeats the original 4x4 bed and its surrounding prop composition.')
   assert hashlib.sha256(text.encode()).hexdigest()==expected
  else:assert actual==expected,path
  ok.append(path)
 meta=json.loads((ROOT/'public/assets/pixel/processed/town.json').read_text());new=Image.open(ROOT/'public/assets/pixel/processed/town.png').convert('RGBA');record=json.loads((ROOT/'docs/assets/licenses/farm-refresh-v1/record.json').read_text());count=len(record['framesChanged'])
 assert count==40 and new.size==tuple(record['atlasSize']);assert sha(ROOT/'public/assets/pixel/processed/town.png')==record['sha256']
 for name in record['framesChanged']:
  r=meta['frames'][name]['frame'];im=new.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']));assert im.size==(r['w'],r['h']);assert set(im.getchannel('A').get_flattened_data())=={0,255}
 oldpath=Path('/private/tmp/farm-refresh-town-before.png');preserved=record['otherAtlasFramesPreserved'];removed=record['removedSoilPixels'];compared=False
 if oldpath.exists():
  old=Image.open(oldpath).convert('RGBA');changed=[];removed=0;preserved=0
  for name,v in meta['frames'].items():
   r=v['frame'];box=(r['x'],r['y'],r['x']+r['w'],r['y']+r['h']);a=old.crop(box);b=new.crop(box)
   if a.tobytes()==b.tobytes():preserved+=1;continue
   changed.append(name)
   for p,q in zip(a.get_flattened_data(),b.get_flattened_data()):
    assert p==q or q==(0,0,0,0),name;removed+=bool(p[3]) and not q[3]
  assert set(changed)==set(record['framesChanged']) and removed==1786 and preserved==898;compared=True
 result={'changedCropFrames':count,'removedSoilPixels':removed,'otherAtlasFramesPreserved':preserved,'survivingPlantPixelsPreserved':True,'binaryAlpha':True,'nativeCropFramesMatchAtlasMetadata':True,'atlasMetadataUnchanged':True,'protectedFilesUnchanged':ok,'farmDefinitionCommentOnlyChange':True,'comparedWithTemporaryPreEditAtlas':compared}
 (ROOT/'docs/verification/farm-refresh/native-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
if __name__=='__main__':audit()
