"""Original native 120x96 three-quarter houses; no copied reference pixels."""
from PIL import Image,ImageDraw
from pathlib import Path
import json
INK='#493e33';WOOD='#9d7050';LEAF='#718347'
def add_large_houses_art(assets):
 geometry={}
 for n in range(13):
  im=dimensional_house(n);name=f'house-village-{n}';assets[name]=im
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

def dimensional_house(n):
 """Original three-quarter cottages: a front gable and visible roof/wall return."""
 im=Image.new('RGBA',(120,96));d=ImageDraw.Draw(im)
 plaster=['#e7d8b6','#d8ccac','#e1c7ad','#d1d2b3','#dccdb1'][n%5]
 roof=['#a77558','#966851','#ae795c','#89725c','#a27564'][n%5]
 side=['#a7977a','#a49a7e','#aa947a','#9c9e80','#a69a7d'][n%5]
 peak=44+n%3*6;ridge=7+n%3*3
 d.polygon([(16,44),(84,44),(108,38),(108,77),(84,85),(16,85)],fill=INK)
 d.rectangle((18,46,83,82),fill=plaster)
 d.polygon([(84,46),(106,40),(106,75),(84,82)],fill=side)
 # The roof has a long sloping side plane receding behind the front gable.
 d.polygon([(8,47),(peak,ridge),(98,ridge+11),(114,42),(88,50)],fill=INK)
 d.polygon([(peak,ridge+3),(97,ridge+14),(109,41),(87,46)],fill=roof)
 for y in range(ridge+17,43,4):
  left=peak+int((y-ridge)*.9);right=min(109,97+int((y-ridge-14)*.55))
  d.line((left,y,right,y-2),fill='#74533f');d.line((left,y-1,right,y-3),fill='#bf9370')
  for x in range(left+3,right,9):d.line((x,y-3,x+1,y-1),fill='#d0a47f')
 # Front gable: thick roof edge, light plaster, recessed arched attic window.
 d.polygon([(11,46),(peak,ridge+3),(87,46)],fill=INK)
 d.polygon([(18,43),(peak,ridge+10),(79,43)],fill=plaster)
 d.line((13,44,peak,ridge+5,84,44),fill=roof,width=4)
 d.line((15,41,peak,ridge+4),fill='#d4aa7e',width=2)
 d.line((peak,ridge+4,84,44),fill='#79513f',width=2)
 d.line((peak,ridge+3,97,ridge+14),fill='#ddb28b',width=2)
 d.rectangle((peak-5,29,peak+5,38),fill=INK);d.pieslice((peak-5,23,peak+5,33),180,360,fill=INK)
 d.rectangle((peak-3,29,peak+3,37),fill='#77908a');d.pieslice((peak-3,25,peak+3,32),180,360,fill='#77908a')
 d.line((peak,26,peak,37),fill='#d6d5b6');d.line((peak-3,32,peak+3,32),fill='#d6d5b6')
 d.line((14,48,86,48),fill='#574334',width=3);d.line((18,51,83,51),fill='#b8a185')
 d.line((18,52,18,79),fill='#f1e3c2');d.line((83,49,83,80),fill='#755c45',width=2)
 chimney=92 if n%2==0 else 27;d.rectangle((chimney,11,chimney+8,29),fill=INK);d.rectangle((chimney+2,12,chimney+6,27),fill='#b29478');d.rectangle((chimney-1,10,chimney+9,13),fill='#d2b797')
 if n%3==2:
  for y in range(55,80,5):
   d.line((19,y,82,y),fill='#b8a589')
   for x in range(20+(y%10),82,12):d.line((x,y,x,y+4),fill='#b8a589')
 else:
  for x in [19,43,81]:d.line((x,52,x,79),fill='#95775a',width=2)
  if n%3==1:d.line((20,54,40,68),fill='#95775a',width=2)
 # Main front window and narrow perspective window on the side wall.
 for x,y,w,h in [(24,56,15,13),(91,51,10,14)]:
  d.rectangle((x-2,y-2,x+w+1,y+h+2),fill=INK);d.rectangle((x,y,x+w-1,y+h-1),fill='#6f8780')
  d.line((x+1,y+1,x+3,y+h-3),fill='#aec3b5');d.line((x+w//2,y,x+w//2,y+h-1),fill='#e8d6b0');d.line((x,y+h//2,x+w-1,y+h//2),fill='#e8d6b0')
  d.line((x-2,y-1,x+w+1,y-1),fill='#ead6b2');d.rectangle((x-3,y+h+2,x+w+2,y+h+5),fill=WOOD);d.line((x-3,y+h+5,x+w+2,y+h+5),fill='#5e4936')
  for xx in range(x-2,x+w+2,3):d.rectangle((xx,y+h,xx+2,y+h+2),fill=LEAF);d.point((xx,y+h),fill=['#d59b83','#c6b36c','#b6a4c0'][n%3])
 d.rectangle((51,65,69,82),fill='#4d3b2d');d.pieslice((51,53,69,71),180,360,fill='#4d3b2d')
 d.rectangle((54,65,67,82),fill=WOOD);d.pieslice((54,56,67,70),180,360,fill=WOOD)
 d.line((53,66,53,81),fill='#cfad80');d.rectangle((57,60,64,65),fill='#829b8e');d.line((60,60,60,65),fill='#dcc8a1');d.rectangle((57,69,64,78),outline='#71513c');d.point((65,69),fill='#ecc477')
 d.line((18,81,50,81),fill='#736c58');d.line((70,81,83,81),fill='#736c58');d.line((18,83,83,83),fill='#bcab88')
 for y,x0,x1 in [(86,48,72),(89,46,74),(92,44,76)]:d.rectangle((x0,y,x1,y+2),fill='#817a65');d.line((x0,y,x1,y),fill='#d1c7a7')
 for x,y in [(19,50),(23,49),(28,49),(84,48),(87,48),(88,51),(88,55)]:d.rectangle((x,y,x+3,y+2),fill='#435735');d.rectangle((x,y,x+2,y+1),fill=LEAF)
 return im
