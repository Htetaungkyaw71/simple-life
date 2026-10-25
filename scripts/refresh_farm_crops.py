"""Re-export existing code-native crops without baked soil. Never repack other art."""
from pathlib import Path
from PIL import Image
import json,hashlib
from crop_art import add_crop_art,add_city_crop_art
from farm_crop_art import add_farm_crop_art
ROOT=Path(__file__).resolve().parents[1];ART=ROOT/'public/assets/pixel/processed';OUT=ROOT/'output/art/farm-refresh-v1';OUT.mkdir(parents=True,exist_ok=True)
CROPS=['tomato','strawberry','carrot','corn','chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato'];STAGES=['seed','sprout','young','flowering','ripe','dry','wilted','dead']
def digest(im):return hashlib.sha256(im.tobytes()).hexdigest()
def refresh():
 assets={};add_crop_art(assets);add_city_crop_art(assets);add_farm_crop_art(assets)
 atlas=Image.open(ART/'town.png').convert('RGBA');meta=json.loads((ART/'town.json').read_text());before={};changed=[];removed=0
 for key,v in meta['frames'].items():
  r=v['frame'];before[key]=digest(atlas.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h'])))
 for c in CROPS:
  for stage in STAGES:
   key=c+'-'+stage;r=meta['frames'][key]['frame'];im=assets[key].convert('RGBA');assert im.size==(r['w'],r['h'])
   old=atlas.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']));assert all(not b[3] or b==a for a,b in zip(old.get_flattened_data(),im.get_flattened_data())),key+' changed plant pixels'
   removed+=sum(bool(a[3]) and not b[3] for a,b in zip(old.get_flattened_data(),im.get_flattened_data()))
   if old.tobytes()!=im.tobytes():changed.append(key)
   atlas.paste(im,(r['x'],r['y']))
 atlas.save(ART/'town.png')
 untouched=0
 for key,v in meta['frames'].items():
  if key in changed:continue
  r=v['frame'];assert before[key]==digest(atlas.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))),key;untouched+=1
 board=Image.new('RGBA',(768,512),(145,154,98,255))
 for row,c in enumerate(CROPS[:4]):
  for col,stage in enumerate(STAGES):board.alpha_composite(assets[c+'-'+stage].resize((96,128),Image.Resampling.NEAREST),(col*96,row*128))
 board.save(OUT/'crops-after.png')
 result={'date':'2026-10-15','mode':'existing code-native crop source edit; no image generation','framesChanged':changed,'removedSoilPixels':removed,'allRemainingPlantPixelsUnchanged':True,'otherAtlasFramesPreserved':untouched,'atlasCoordinatesUnchanged':True,'atlasSize':atlas.size,'sha256':hashlib.sha256((ART/'town.png').read_bytes()).hexdigest()};(OUT/'manifest.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
if __name__=='__main__':refresh()
