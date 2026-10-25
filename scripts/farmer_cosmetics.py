"""Register generated accessory bitmaps to every approved farmer body frame.
No base character pixel is edited here. Native sampling, palette reduction,
frame anchors and export only; sources and prompts remain reviewable.
"""
from pathlib import Path
from PIL import Image
from statistics import median
import json, hashlib
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/art/farmer-cosmetics-v1'
SPECS={'hat':[20,20,17,17],'glasses':[10,10,7,7],'backpack':[11,10,6,6]}
art={};records={}
for name,widths in SPECS.items():
 source=Image.open(OUT/f'source/{name}.png').convert('RGBA')
 source.putdata([(*p[:3],255) if p[3]>=128 else (0,0,0,0) for p in source.get_flattened_data()])
 art[name]=[]
 for row,width in enumerate(widths):
  crop=source.crop((source.width*row//4,0,source.width*(row+1)//4,source.height));crop=crop.crop(crop.getbbox())
  native=crop.resize((width,round(width*crop.height/crop.width)),Image.Resampling.NEAREST)
  # Palette reduction changes no transparency or geometry.
  native=native.quantize(colors=12,method=Image.Quantize.FASTOCTREE).convert('RGBA')
  (OUT/'native').mkdir(exist_ok=True);native.save(OUT/f'native/{name}-{row}.png')
  pixels=[]
  for y in range(native.height):
   for x in range(native.width):
    r,g,b,a=native.getpixel((x,y))
    if a:pixels.append([x,y,r,g,b])
  art[name].append({'width':native.width,'height':native.height,'pixels':pixels})
from farmer_cosmetic_registration import register_frames
frames=register_frames(ROOT)
for char in ['boy','girl']:
 records[char]={'sha256':hashlib.sha256((ROOT/f'public/assets/pixel/processed/{char}.png').read_bytes()).hexdigest(),'frames':len(frames[char])}
(ROOT/'src/data/farmerCosmetics.js').write_text('// Generated bitmap pixels and per-frame registration; scripts/farmer_cosmetics.py.\nexport const COSMETIC_ART='+json.dumps(art,separators=(',',':'))+';\nexport const COSMETIC_FRAMES='+json.dumps(frames,separators=(',',':'))+';\n')
(OUT/'record.json').write_text(json.dumps({'date':'2026-10-14','tool':'OpenAI built-in imagegen','model':'not exposed','baseAtlases':records,'sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (OUT/'source').glob('*.png')},'conversion':'alpha >=128; nearest native sampling; 12-colour per-view reduction; semantic template head/torso anchors including turned/bent heads; no body image edits'},indent=2)+'\n')
print(records)
