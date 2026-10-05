"""Pack only used Kenney CC0 tiles, normalize their palette, and author missing props."""
from PIL import Image, ImageDraw
from pathlib import Path
import zipfile,io,json
OUT=Path('public/assets/pixel/processed');OUT.mkdir(parents=True,exist_ok=True)
z=zipfile.ZipFile('public/assets/vendor/kenney/tiny-town/kenney_tiny-town.zip')
palette={'3f2631':'344b40','eaa56c':'c29b68','c0cbdc':'d6cfad','8b9bb4':'929e91','84c669':'849760','bd6c4a':'a57d54','5a6988':'607c78','c34b35':'a9674d','763b36':'694e40','fdbe53':'d7af55','262b44':'263e38','e38628':'b98b4c','479f4a':'577547','f28462':'cb8b62','52607c':'516964','3d212d':'344b40','65a556':'6d894f'}
used=set();assets={}
def tile(i):
 used.add(i);im=Image.open(io.BytesIO(z.read(f'Tiles/tile_{i:04}.png'))).convert('RGBA');pixels=im.load()
 for y in range(16):
  for x in range(16):
   r,g,b,a=pixels[x,y];h=f'{r:02x}{g:02x}{b:02x}'
   if h in palette:pixels[x,y]=(*bytes.fromhex(palette[h]),a)
 return im
def composite(name,rows):
 im=Image.new('RGBA',(len(rows[0])*16,len(rows)*16))
 for y,row in enumerate(rows):
  for x,i in enumerate(row):
   if i is not None:im.alpha_composite(tile(i),(x*16,y*16))
 assets[name]=im
for name,i in {'grass':0,'grass-detail':1,'flowers':2,'bush':5,'mushroom':29,'fence':45,'post':47,'fence-v':59,'crate':57,'sign':83,'well':104,'wheelbarrow':105,'barrel':107}.items():assets[name]=tile(i)
# Path edges: grass visible in corners makes the terrain transition cleanly.
for name,i in {'path-nw':12,'path-n':13,'path-ne':14,'path-w':24,'path':25,'path-e':26,'path-sw':36,'path-s':37,'path-se':38}.items():assets[name]=tile(i)
composite('tree',[[None,None,None],[None,4,None],[None,16,None]])
# Turn the grass-detail tile into a transparent overlay for resting soil.
im=assets['grass-detail'];px=im.load()
for y in range(16):
 for x in range(16):
  if px[x,y][:3]==(132,151,96):px[x,y]=(0,0,0,0)
composite('roof-left',[[52],[64]])
composite('roof-center',[[53],[65]])
composite('roof-right',[[54],[66]])
composite('house',[[52,53,53,53,54],[64,65,67,65,66],[72,73,73,73,75],[84,73,85,73,88]])
composite('house-blue',[[48,49,49,49,50],[60,61,63,61,62],[76,77,77,77,79],[103,77,90,77,103]])
composite('shed',[[52,53,54],[64,65,66],[84,85,88]])
# Missing town/farm furniture follows the same palette and source grid.
C={'dark':'#344b40','wood':'#a57d54','light':'#d6cfad','gold':'#d7af55','shade':'#694e40','leaf':'#577547','water':'#5c8f88','foam':'#9ac1b0'}
def make(name,w,h):
 im=Image.new('RGBA',(w,h));assets[name]=im;return ImageDraw.Draw(im)
def r(d,box,c):d.rectangle(box,fill=C.get(c,c))
d=make('plaza',16,16);r(d,(0,0,15,15),'#929e91');r(d,(0,0,15,0),'#7e9083');r(d,(0,8,15,8),'#7e9083');r(d,(0,0,0,7),'#7e9083');r(d,(8,8,8,15),'#7e9083');r(d,(2,1,13,1),'#a7b09b');r(d,(2,9,6,9),'#a7b09b')
d=make('bench',32,20)
for y in [4,8,12]:r(d,(2,y,29,y+2),'wood');r(d,(3,y,28,y),'gold')
for x in [5,26]:r(d,(x,2,x+1,17),'shade')
d=make('lamp',16,32);r(d,(7,7,8,29),'dark');r(d,(4,29,11,30),'dark');r(d,(3,3,12,10),'dark');r(d,(5,4,10,8),'gold');r(d,(6,4,8,7),'light');r(d,(5,1,10,2),'dark')
d=make('mailbox',16,24);r(d,(7,12,9,22),'shade');r(d,(2,4,13,13),'dark');r(d,(3,4,12,11),'wood');r(d,(5,7,11,8),'shade');r(d,(12,2,14,6),'gold')
d=make('scarecrow',32,40);r(d,(15,13,17,38),'shade');r(d,(2,19,29,21),'wood');r(d,(11,18,21,30),'#607c78');r(d,(10,9,21,17),'wood');r(d,(11,9,20,15),'gold');r(d,(7,7,24,9),'shade');r(d,(11,2,20,6),'wood');r(d,(12,2,19,3),'gold');r(d,(13,12,13,12),'dark');r(d,(18,12,18,12),'dark')
d=make('notice',32,32);r(d,(5,16,7,31),'shade');r(d,(25,16,27,31),'shade');r(d,(1,2,30,22),'dark');r(d,(3,4,28,20),'wood');r(d,(6,6,14,15),'light');r(d,(18,8,25,17),'light');r(d,(8,9,12,9),'shade')
for n in range(2):
 d=make('fountain'+str(n),48,48);d.polygon([(8,19),(39,19),(47,27),(47,37),(38,44),(9,44),(0,37),(0,27)],fill=C['dark']);r(d,(5,23,42,37),'#929e91');r(d,(9,24,38,34),'water');r(d,(14,28+n*2,33,28+n*2),'foam');r(d,(21,8,26,28),'#929e91');r(d,(16,6,31,10),'light');r(d,(23,1,24,6),'foam');r(d,(19,11,20,19+n*2),'foam');r(d,(28,11,29,21-n*2),'foam')
for n in range(2):
 d=make('butterfly'+str(n),8,8);r(d,(3,3,4,6),'dark');r(d,(0 if n==0 else 2,2,2,4),'gold');r(d,(5,2,7 if n==0 else 5,4),'light')
d=make('dust',4,4);r(d,(0,2,2,2),'gold');r(d,(2,0,3,0),'light')
# Compact furniture: footprints now match the visual body, not the old oversize art.
d=make('bed',24,40);r(d,(1,2,22,39),'shade');r(d,(3,4,20,35),'light');r(d,(5,5,18,12),'#eee2bd');r(d,(3,15,20,34),'#607c78');r(d,(4,17,19,18),'foam');r(d,(2,35,21,37),'wood')
d=make('table',32,24);r(d,(3,10,5,23),'shade');r(d,(26,10,28,23),'shade');r(d,(0,3,31,18),'dark');r(d,(1,2,30,15),'wood');r(d,(2,3,29,4),'gold');r(d,(10,5,10,14),'shade');r(d,(21,5,21,14),'shade')
# Retained farmer identity redrawn in 16x24 instead of resampled; 4 directions/3 poses.
for gender in ['boy','girl']:
 sheet=Image.new('RGBA',(48,96))
 for row,direction in enumerate(['down','up','left','right']):
  for frame in range(3):
   im=Image.new('RGBA',(16,24));d=ImageDraw.Draw(im);bob=1 if frame==2 else 0;a,b=(0,0) if frame==0 else ((1,-1) if frame==1 else (-1,1))
   r(d,(4,21,12,22),'dark');r(d,(5,18+a,7,22+a),'dark');r(d,(9,18+b,11,22+b),'dark');r(d,(4,12+bob,12,19+bob),'dark');r(d,(5,13+bob,11,18+bob),'#a9674d' if gender=='girl' else '#607c78');r(d,(6,15+bob,7,19+bob),'wood');r(d,(10,15+bob,10,19+bob),'wood');r(d,(3,14+bob,4,18+bob),'#d9ac79');r(d,(12,14+bob,13,18+bob),'#d9ac79')
   r(d,(4,5+bob,12,12+bob),'shade');r(d,(5,6+bob,11,12+bob),'#d9ac79');r(d,(5,7+bob,10,9+bob),'#eed09b')
   if gender=='girl':r(d,(3,7+bob,4,14+bob),'shade');r(d,(12,7+bob,13,14+bob),'shade')
   if direction=='up':r(d,(4,6+bob,12,12+bob),'shade');r(d,(6,7+bob,10,8+bob),'wood')
   elif direction=='left':r(d,(5,8+bob,5,9+bob),'dark')
   elif direction=='right':r(d,(11,8+bob,11,9+bob),'dark')
   else:r(d,(6,8+bob,6,9+bob),'dark');r(d,(10,8+bob,10,9+bob),'dark')
   r(d,(2,4+bob,14,5+bob),'shade');r(d,(3,3+bob,13,4+bob),'gold');r(d,(5,0+bob,11,2+bob),'#c29b68');r(d,(5,0+bob,10,0+bob),'light')
   sheet.alpha_composite(im,(frame*16,row*24))
 sheet.save(OUT/(gender+'.png'))
# Make three townspeople by palette-only variants of the original farmers.
for n,(base,color) in enumerate([('boy','#8c6e89'),('girl','#6f8e75'),('boy','#b89852')]):
 im=Image.open(OUT/(base+'.png')).crop((0,0,16,24));pixels=im.load();old=(96,124,120) if base=='boy' else (169,103,77)
 for y in range(24):
  for x in range(16):
   if pixels[x,y][:3]==old:pixels[x,y]=(*bytes.fromhex(color[1:]),255)
 assets['npc'+str(n)]=im
atlas=Image.new('RGBA',(512,256));frames={};x=y=rowh=0
for name,im in assets.items():
 if x+im.width>512:x=0;y+=rowh+2;rowh=0
 atlas.alpha_composite(im,(x,y));frames[name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}};x+=im.width+2;rowh=max(rowh,im.height)
assert y+rowh<=256
atlas.save(OUT/'town.png');(OUT/'town.json').write_text(json.dumps({'frames':frames,'meta':{'image':'town.png','size':{'w':512,'h':256}}},indent=2));(OUT/'manifest.json').write_text(json.dumps({'pack':'Tiny Town 1.1','creator':'Kenney','license':'CC0 1.0','tilesUsed':sorted(used),'palette':palette,'frames':list(assets),'originalAdditions':['plaza','bench','lamp','mailbox','scarecrow','notice','fountain0','fountain1','butterfly0','butterfly1','dust','bed','table','npc0','npc1','npc2','boy.png','girl.png']},indent=2))
print('Packed',len(assets),'frames from',len(used),'licensed tiles plus original additions')
