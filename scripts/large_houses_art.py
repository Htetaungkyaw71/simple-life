"""Original native 120x96 town houses; reference-inspired shapes, no copied pixels."""
from PIL import Image,ImageDraw
from pathlib import Path
import json
INK='#493e33';WOOD='#9d7050';LEAF='#718347'
def add_large_houses_art(assets):
 geometry={}
 for n in range(13):
  im=Image.new('RGBA',(120,96));d=ImageDraw.Draw(im)
  plaster=['#e9d9b7','#d5c7a7','#e5c5ad','#cdcdb0','#ddcfb1'][n%5]
  roof=['#a16b54','#936753','#ac765b','#84705d','#a57062'][n%5]
  # Broad eaves, foundation, side-wall shade and a visibly pitched tiled roof.
  d.rectangle((12,44,107,85),fill=INK);d.rectangle((14,45,105,82),fill=plaster)
  d.rectangle((95,45,105,82),fill='#b6a287');d.rectangle((14,79,105,83),fill='#a49277')
  ridge=17+n%3*2
  d.polygon([(7,44),(24,ridge),(94,ridge),(113,44),(109,49),(10,49)],fill=INK)
  d.polygon([(11,43),(26,ridge+2),(92,ridge+2),(109,43)],fill=roof)
  d.line((26,ridge+2,92,ridge+2),fill='#e0b28b',width=2)
  for y in range(ridge+5,44,4):
   inset=round((44-y)*.6);d.line((12+inset,y,108-inset,y),fill='#704f41')
   for x in range(16+(y%8),105,10):
    if 12+inset<x<108-inset:d.line((x,y-2,x,y),fill='#c49372')
  # Alternating front gables, hipped roofs and twin dormers are distinct silhouettes.
  gables=[60] if n%3==0 else [35,85] if n%3==1 else []
  for x in gables:
   d.polygon([(x-21,45),(x,4+n%4),(x+21,45)],fill=INK)
   d.polygon([(x-17,43),(x,9+n%4),(x+17,43)],fill=plaster)
   d.line((x-17,40,x,9+n%4,x+17,40),fill=roof,width=3)
   d.ellipse((x-6,26,x+6,39),fill=INK);d.ellipse((x-4,28,x+4,37),fill='#8da19b');d.line((x,28,x,37),fill='#ecdfbf')
  chimney=87 if n%2==0 else 24;d.rectangle((chimney,9,chimney+9,25),fill=INK);d.rectangle((chimney+2,10,chimney+7,24),fill='#aa8772');d.rectangle((chimney-1,8,chimney+10,11),fill='#c2ad92')
  if n%3==2:
   for y in range(50,79,6):
    d.line((15,y,94,y),fill='#b3a286')
    for x in range(17+(y%12),94,12):d.line((x,y,x,y+5),fill='#b3a286')
  else:
   for x in [14,44,75,94]:d.rectangle((x,49,x+1,79),fill='#967557')
   if n%3==1:d.line((16,50,42,72),fill='#967557',width=2);d.line((77,72,93,50),fill='#967557',width=2)
  for x in [23,82]:
   d.rectangle((x-2,55,x+15,71),fill=INK);d.rectangle((x,57,x+13,69),fill='#718c88');d.line((x+1,57,x+3,66),fill='#b8cec2');d.line((x+7,57,x+7,69),fill='#eadbb9');d.line((x,63,x+13,63),fill='#eadbb9')
   d.rectangle((x-3,72,x+16,76),fill=WOOD);d.line((x-2,72,x+15,72),fill='#c9a17b')
   for xx in range(x-2,x+16,3):d.rectangle((xx,70,xx+2,72),fill=LEAF);d.point((xx,70),fill=['#d69b83','#c4b269','#b5a7c3'][n%3])
  d.rectangle((51,64,69,83),fill=INK);d.pieslice((51,52,69,70),180,360,fill=INK);d.rectangle((53,64,67,83),fill=WOOD);d.pieslice((53,54,67,68),180,360,fill=WOOD)
  d.rectangle((56,59,64,64),fill='#a2b4a7');d.line((60,59,60,64),fill='#e4d7b6');d.rectangle((56,69,64,79),outline='#71513d');d.rectangle((64,68,65,69),fill='#e2bd78')
  for y,x0,x1 in [(86,48,72),(89,46,74),(92,44,76)]:d.rectangle((x0,y,x1,y+2),fill='#837d69');d.line((x0,y,x1,y),fill='#cec4a5')
  for x,y in [(15,48),(19,50),(23,49),(96,49),(100,53),(101,57),(98,61)]:d.rectangle((x,y,x+3,y+2),fill='#435735');d.rectangle((x,y,x+2,y+1),fill=LEAF)
  name=f'house-village-{n}';assets[name]=im
  # Exact opaque rows through the foundation. Porch steps remain walkable.
  boxes=[]
  for y in range(86):
   x=0
   while x<120:
    if im.getpixel((x,y))[3]==0:x+=1;continue
    start=x
    while x<120 and im.getpixel((x,y))[3]:x+=1
    boxes.append([start,y,x-start,1])
  geometry[name]=boxes
 Path('src/data/largeHouseGeometry.js').write_text('// Generated from native house pixels by scripts/large_houses_art.py.\nexport const LARGE_HOUSE_SOLIDS='+json.dumps(geometry,separators=(',',':'))+';\n')
