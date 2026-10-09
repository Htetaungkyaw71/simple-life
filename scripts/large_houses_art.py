"""Original native front-facing cottages; reference structure, no copied pixels."""
from PIL import Image,ImageDraw
from pathlib import Path
import json
INK='#493e33';WOOD='#9d7050';LEAF='#718347'
# Draw Home directly on a larger native canvas, never resample a finished sprite.
class ScaledDraw:
 def __init__(self,draw,scale):self.draw=draw;self.scale=scale
 def coords(self,xy):
  if isinstance(xy[0],(tuple,list)):return [tuple(round(v*self.scale) for v in p) for p in xy]
  return tuple(round(v*self.scale) for v in xy)
 def shape(self,kind,xy,**kwargs):
  if 'width' in kwargs:kwargs['width']=max(1,round(kwargs['width']*self.scale))
  return getattr(self.draw,kind)(self.coords(xy),**kwargs)
 def rectangle(self,xy,**kw):return self.shape('rectangle',xy,**kw)
 def polygon(self,xy,**kw):return self.shape('polygon',xy,**kw)
 def line(self,xy,**kw):return self.shape('line',xy,**kw)
 def point(self,xy,**kw):return self.shape('point',xy,**kw)

def add_large_houses_art(assets):
 geometry={}
 for n in range(13):
  im=dimensional_house(n);name=f'house-village-{n}';assets[name]=im;boxes=[]
  for y in range(129 if n==0 else 86):
   x=0
   while x<im.width:
    if im.getpixel((x,y))[3]==0:x+=1;continue
    start=x
    while x<im.width and im.getpixel((x,y))[3]:x+=1
    boxes.append([start,y,x-start,1])
  geometry[name]=boxes
 Path('src/data/largeHouseGeometry.js').write_text('// Generated from native house pixels by scripts/large_houses_art.py.\nexport const LARGE_HOUSE_SOLIDS='+json.dumps(geometry,separators=(',',':'))+';\n')
def dimensional_house(n):
 im=Image.new('RGBA',(180,144) if n==0 else (120,96));d=ScaledDraw(ImageDraw.Draw(im),1.5 if n==0 else 1)
 plaster=['#e9d4b9','#d5d6b7','#eed8c4','#dfcbb2','#d2d8c9'][n%5]
 roof=['#b99a78','#9d7665','#ae8564','#8c9280','#ba8e78'][n%5]
 trim=['#75523e','#645343','#835947','#685d4b','#6d554d'][n%5]
 # All variants share one front elevation, including the roof and doorway.
 d.rectangle((12,48,107,85),fill=INK);d.rectangle((15,51,104,82),fill=plaster)
 d.rectangle((8,16,111,50),fill=INK);d.rectangle((10,18,109,48),fill=roof)
 for y in range(20,46,4):
  for x in range(12+(y%8),108,8):
   off=(x*7+y*3+n*11)%3;d.line((x,y,x-2,y+2+off),fill='#c8ac89');d.point((x+2,y+2),fill='#94765c')
 # Long raised central roof ends in a front gable; no side facade/return wall.
 d.polygon([(60,0),(87,14),(89,49),(60,34),(30,49),(32,14)],fill=INK)
 d.polygon([(58,3),(34,15),(32,46),(58,33)],fill=roof)
 d.polygon([(62,3),(85,15),(87,46),(62,33)],fill=roof)
 for y in range(3,33,4):
  for x in range(36,86,6):
   if 58<=x<=62 or y<abs(x-60)*.5+3:continue
   d.line((x,y,x-2 if x<60 else x+2,y+3),fill='#cbb18d')
 d.rectangle((59,0,61,33),fill=trim);d.line((59,0,59,32),fill='#d3b595')
 d.polygon([(31,50),(60,32),(88,50)],fill=INK);d.polygon([(36,49),(60,36),(83,49)],fill=plaster)
 d.line((32,49,60,33,88,49),fill=trim,width=2)
 d.line((46,43,46,49),fill=trim,width=2);d.line((74,43,74,49),fill=trim,width=2)
 def window(x,y,w,h):
  d.rectangle((x-2,y-2,x+w+1,y+h+2),fill=trim);d.rectangle((x,y,x+w-1,y+h-1),fill='#91a393')
  for yy in range(y,y+h):
   for xx in range(x,x+w):
    if (xx-x+yy-y)%4==0 or (xx-x-yy+y)%4==0:d.point((xx,yy),fill='#d6d5b8')
  d.line((x+w//2,y,x+w//2,y+h-1),fill=trim);d.line((x-3,y+h+3,x+w+2,y+h+3),fill='#b58a67')
 window(54,41,12,8)
 for x in [22,77,94]:window(x,67,10,10)
 d.line((14,51,105,51),fill='#b19374');d.line((15,52,15,82),fill=trim,width=2);d.line((104,52,104,82),fill=trim,width=2)
 if n%3==1:
  for x in [39,71]:d.line((x,52,x,82),fill=trim,width=2)
 if n%3==2:
  for y in [54,59,64,69,74,79]:
   for x in range(16+(y%2)*4,104,9):d.line((x,y,x+4,y),fill='#c0a68d')
 d.rectangle((48,51,71,85),fill=INK);d.rectangle((50,53,69,84),fill=trim)
 for x in [51,61]:
  d.rectangle((x,54,x+7,66),fill='#8e9d8f')
  for yy in range(54,67):
   for xx in range(x,x+8):
    if (xx+yy)%4==0:d.point((xx,yy),fill='#cfcbb3')
  d.rectangle((x,70,x+7,82),outline='#b18a68')
 d.line((60,53,60,84),fill=INK);d.point((58,69),fill='#e4c38a');d.point((62,69),fill='#e4c38a')
 d.line((15,83,47,83),fill='#bca78a');d.line((72,83,104,83),fill='#bca78a')
 # Planter boxes flank the door within the shared solid facade footprint.
 for x,w in [(17,25),(78,24)]:
  d.rectangle((x,80,x+w,85),fill=trim);d.line((x+1,82,x+w-1,82),fill='#bb956e')
  for xx in range(x+1,x+w,3):
   d.rectangle((xx,79,xx+2,81),fill=LEAF);d.point((xx,79),fill=['#d39b85','#cfb974','#b5a3b9'][n%3])
 for y,x0,x1 in [(86,48,72),(89,46,74),(92,44,76)]:
  d.rectangle((x0,y,x1,y+2),fill='#817a65');d.line((x0,y,x1,y),fill='#d1c7a7')
 return im
