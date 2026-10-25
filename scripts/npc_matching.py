"""Standing-design review export only. Generated raster artwork is sampled
whole, never redrawn; no NPC behaviour or production atlas is changed.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import json,hashlib
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/art/npc-matching-v1'
DIRS=['south','north','west','east']
records={}
for name in ['nell','sol']:
 raw=Image.open(OUT/f'source/{name}.png').convert('RGBA')
 raw.putdata([(*p[:3],255) if p[3]>=128 else (0,0,0,0) for p in raw.get_flattened_data()])
 sheet=Image.new('RGBA',(256,64));records[name]=[]
 for col,direction in enumerate(DIRS):
  crop=raw.crop((col*raw.width//4,0,(col+1)*raw.width//4,raw.height));bbox=crop.getbbox();assert bbox
  crop=crop.crop(bbox);w=round(crop.width*40/crop.height)
  native=crop.resize((w,40),Image.Resampling.NEAREST)
  native=native.quantize(colors=32,method=Image.Quantize.FASTOCTREE).convert('RGBA')
  frame=Image.new('RGBA',(64,64));frame.paste(native,(32-w//2,17));assert frame.getbbox()[3]==57
  folder=OUT/f'frames/{name}';folder.mkdir(parents=True,exist_ok=True);frame.save(folder/f'{direction}.png')
  sheet.paste(frame,(col*64,0));records[name].append({'direction':direction,'size':[64,64],'nativeHeight':40,'ground':[32,56],'sourceCrop':list(bbox),'nativeWidth':w,'rgbaSHA256':hashlib.sha256(frame.tobytes()).hexdigest()})
 (OUT/'sheets').mkdir(exist_ok=True);sheet.save(OUT/f'sheets/{name}-standing.png')
# Review contact board: original farmer reference pixels beside native NPCs.
# Labels/background are presentation only; transparent PNG frames stay separate.
board=Image.new('RGBA',(1024,640),(217,219,194,255));draw=ImageDraw.Draw(board)
for i,(name,label) in enumerate([('boy','APPROVED FARMER'),('nell','NELL / CLOTHES'),('sol','SOL / HAIR')]):
 if name=='boy':im=Image.open(ROOT/'public/assets/pixel/processed/boy.png').convert('RGBA').crop((0,0,64,64))
 else:im=Image.open(OUT/f'frames/{name}/south.png')
 x=32+i*328;board.alpha_composite(im.resize((256,256),Image.Resampling.NEAREST),(x,32));draw.text((x+50,302),label,fill=(53,70,46,255))
for row,name in enumerate(['nell','sol']):
 for col,d in enumerate(DIRS):
  im=Image.open(OUT/f'frames/{name}/{d}.png').resize((128,128),Image.Resampling.NEAREST)
  x=200+col*184;y=330+row*150;board.alpha_composite(im,(x,y));draw.text((x+45,y+125),d.upper(),fill=(53,70,46,255))
 draw.text((40,390+row*150),name.upper(),fill=(53,70,46,255))
board.save(OUT/'comparison.png')
record={'date':'2026-10-14','stage':'standing-design review, pending user appearance approval','tool':'OpenAI built-in imagegen','modelVersion':'not exposed','conversion':'alpha128, whole-character proportional nearest sampling to40native pixels,32colours per view, padded64x64ground(32,56); no limb/eye repainting','sources':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (OUT/'source').glob('*.png')},'frames':records,'runtimeChanged':False}
(OUT/'manifest.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'frames':sum(map(len,records.values())),'nativeHeight':40,'runtimeChanged':False}))
