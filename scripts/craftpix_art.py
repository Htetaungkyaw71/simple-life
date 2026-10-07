"""Curate user-supplied Craftpix freebie PNGs at native resolution.
No previews, PSDs or unused sheets enter the runtime atlas.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import zipfile,io
PACKS={
 'hunt':'craftpix-net-789196-free-top-down-hunt-animals-pixel-sprite-pack.zip',
 'ruins':'craftpix-net-934618-free-top-down-ruins-pixel-art.zip',
 'plants':'craftpix-net-284465-free-predator-plant-mobs-pixel-art-pack.zip'}
def add_craftpix_art(assets):
 evidence={}
 archives={k:zipfile.ZipFile(Path('public/assets/vendor/craftpix')/v) for k,v in PACKS.items()}
 def load(pack,path):return Image.open(io.BytesIO(archives[pack].read(path))).convert('RGBA')
 def add(name,pack,path,box):
  assets[name]=load(pack,path).crop(box)
  evidence[name]={'creator':'Craftpix','license':'Craftpix Freebie Products §2','archive':PACKS[pack],'file':path,'rectangle':list(box),'modifications':'Native PNG cell extraction/repacking; no resampling or recolour.'}
 # Cell order is front, back, left, right. All 32px cells retain the same foot anchor.
 for species,source in [('boar','Boar'),('fox','Fox'),('hare','Hare'),('deer','Deer'),('grouse','Black_grouse')]:
  actions=['Idle','Walk']+(['Run','Attack'] if species=='boar' else [])
  for action in actions:
   fileaction='walk' if source=='Fox' and action=='Walk' else action
   path=f'PNG/Without_shadow/{source}/{source}_{fileaction}.png';sheet=load('hunt',path)
   for row,direction in enumerate(['down','up','left','right']):
    for frame in range(sheet.width//32):
     add(f'cp-{species}-{action.lower()}-{direction}-{frame}','hunt',path,(frame*32,row*32,frame*32+32,row*32+32))
 for variant in ['Brown-gray','Snow','Sand','Water']:
  for number in ([3,4,5] if variant in ['Brown-gray','Water'] else [4,5]):
   path=f'PNG/Assets/{variant}_ruins{number}.png';im=load('ruins',path)
   add(f'cp-ruins-{variant.lower()}-{number}','ruins',path,(0,0,*im.size))
 for plant in range(1,4):
  path=f'PNG/Plant{plant}/Without_shadow/Plant{plant}_Idle_without_shadow.png'
  for frame in range(4):add(f'cp-plant-{plant}-{frame}','plants',path,(frame*64+12,12,frame*64+52,54))
 # Original native-pixel waterfall surfaces; rocky side banks leave the water open.
 for phase in range(4):
  im=Image.new('RGBA',(72,92));d=ImageDraw.Draw(im)
  for side in [0,60]:
   d.polygon([(side,5),(side+8,0),(side+11,8),(side+12,66),(side+7,79),(side,76)],fill='#394d59')
   d.polygon([(side+2,7),(side+8,3),(side+9,13),(side+10,65),(side+5,74),(side+2,72)],fill='#7e9290')
   for y in [12,29,48,65]:d.line((side+2,y,side+8,y-2),fill='#b9c5b1');d.line((side+4,y+5,side+9,y+8),fill='#566e70')
  d.rectangle((12,0,59,72),fill='#4088a5');d.rectangle((16,0,55,68),fill='#81cbd0')
  for x in range(14,58,6):
   d.rectangle((x,2,x+2,68),fill='#a7dfda' if x%12 else '#5ba7bd')
   for y in range(-20,72,25):
    top=y+(phase*6+x*3)%25
    if top<=72 and top+12>=0:d.rectangle((x,max(0,top),x+1,min(72,top+12)),fill='#e2f4e1')
  for n in range(12):
   x=12+n*4;y=69+(n+phase)%3*2
   d.ellipse((x-5,y-3,x+6,y+4),fill='#cdece2');d.line((x-3,y,x+3,y),fill='#f0f5df')
  for n in range(5):
   x=16+n*8;y=80+(n+phase)%3*3;d.line((x-3,y,x+4,y),fill='#93d5d2')
  assets['fall-flow-'+str(phase)]=im
 return evidence
