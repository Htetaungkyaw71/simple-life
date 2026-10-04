"""Original editable pixel source. Pillow rasterizes integer pixels; no external art."""
from PIL import Image, ImageDraw
from pathlib import Path
import json, random
OUT=Path('public/assets/pixel');OUT.mkdir(parents=True,exist_ok=True)
P={'ink':'#263e38','deep':'#344b40','leaf':'#516d49','moss':'#728454','lime':'#98a76b','glow':'#bdc88b','grass':'#788759','grass2':'#7c8c5d','sand':'#baaa79','sandlight':'#d0bc88','sanddark':'#a29267','soil':'#806345','soil2':'#9b7951','wet':'#594f3d','wood':'#825e46','wood2':'#a57d54','wood3':'#c29b68','cream':'#e1d7ad','roof':'#925d49','roof2':'#b77c58','red':'#c75e41','redlight':'#e5975d','water':'#5c8f88','water2':'#8fb0a0','blue':'#718d8c','gold':'#d7af55','skin':'#d9ac79','skinlight':'#eed09b'}
assets={}
def sprite(name,w,h):
 im=Image.new('RGBA',(w,h));d=ImageDraw.Draw(im);assets[name]=im;return im,d
def rect(d,xy,col):d.rectangle(xy,fill=P.get(col,col))
def poly(d,points,col):d.polygon(points,fill=P.get(col,col))
def tile(name,bg,seed,grain):
 im,d=sprite(name,16,16);rect(d,(0,0,15,15),bg);r=random.Random(seed)
 for _ in range(12):
  x,y=r.randrange(16),r.randrange(16);rect(d,(x,y,x+(r.randrange(3)==0),y),r.choice(grain))
 return im,d
for n in range(4):
 im,d=tile('grass'+str(n),'grass' if n%2 else 'grass2',n,['moss','grass','grass2'])
 if n%2: poly(d,[(3,8),(3,5),(4,7),(5,5),(5,8)],'lime');rect(d,(10,12,12,12),'leaf')
for n in range(2):tile('path'+str(n),'sand',30+n,['sandlight','sanddark'])
for name,col in [('soil','soil'),('watered-soil','wet')]:
 im,d=tile(name,col,7,['soil','soil2'] if col=='soil' else ['wet','#655b44']);
 for y in (3,8,13):rect(d,(2,y,13,y),'#614e38' if col=='soil' else '#464537');rect(d,(2,y+1,13,y+1),'soil2' if col=='soil' else '#736a4d')
for n in range(2):
 im,d=tile('floor'+str(n),'wood2',n,['wood2','#aa8157']);rect(d,(0,0,15,0),'#906b4b');rect(d,(0,8,15,8),'#906b4b');rect(d,(0,0,0,7),'#906b4b');rect(d,(8,8,8,15),'#906b4b');rect(d,(1,1,15,1),'#b48c60');rect(d,(0,9,15,9),'#b48c60');rect(d,(3,5,7,5),'#98714e');rect(d,(10,13,13,13),'#98714e')
im,d=tile('stone','blue',7,['blue','#80938a']);rect(d,(0,0,15,0),'deep');rect(d,(0,0,0,15),'deep');rect(d,(2,2,13,2),'water2')
im,d=tile('wall','cream',1,['cream','#d4c79b']);rect(d,(0,13,15,15),'wood');rect(d,(0,0,15,1),'wood3')
for n in range(2):
 im,d=tile('water'+str(n),'water',2+n,['water','water2']);rect(d,(3,5+n*4,8,5+n*4),'water2');rect(d,(10,11-n*3,14,11-n*3),'#719f92')
# Broad tropical trees with stepped silhouettes, clustered highlights, shaded underside.
for variant in range(2):
 im,d=sprite('tree'+str(variant),48,64)
 poly(d,[(10,56),(15,53),(37,53),(43,57),(39,61),(15,61)],'#435943')
 rect(d,(21,33,28,57),'deep');rect(d,(22,33,26,57),'wood');rect(d,(23,34,24,54),'wood3');poly(d,[(21,55),(18,59),(24,58),(29,59),(27,54)],'wood')
 pts=[(4,17),(9,17),(9,10),(15,10),(15,5),(26,5),(26,8),(34,8),(34,13),(40,13),(40,20),(44,20),(44,34),(39,34),(39,41),(31,41),(31,44),(17,44),(17,40),(8,40),(8,35),(3,35),(3,24),(0,24),(0,20),(4,20)]
 poly(d,pts,'deep');poly(d,[(5,18),(12,18),(12,11),(19,11),(19,7),(26,7),(26,11),(34,11),(34,17),(40,17),(40,29),(35,29),(35,36),(26,36),(26,39),(16,39),(16,35),(8,35),(8,30),(4,30)],'leaf')
 r=random.Random(90+variant)
 for _ in range(30):
  x,y=r.randrange(8,37),r.randrange(12,34)
  rect(d,(x,y,x+r.randrange(2,6),y+2),r.choice(['leaf','moss','lime']))
 poly(d,[(10,17),(15,17),(15,12),(23,12),(23,10),(27,10),(27,14),(21,14),(21,17),(16,17),(16,20),(10,20)],'glow')
im,d=sprite('palm',48,64);poly(d,[(23,58),(27,58),(29,35),(26,16),(22,17),(25,36)],'wood');
for y in range(24,56,5):rect(d,(24,y,27,y+1),'wood3')
for pts in [[(25,18),(14,8),(4,9),(0,14),(12,12),(23,21)],[(26,19),(34,8),(43,9),(47,15),(37,12),(27,22)],[(25,17),(21,2),(16,0),(17,11),(23,23)],[(25,20),(7,23),(2,34),(12,27),(26,24)],[(27,19),(42,23),(47,36),(36,28),(25,24)]]:poly(d,pts,'leaf')
for pts in [[(24,18),(13,10),(4,12),(16,12)],[(27,19),(35,10),(43,12),(35,13)],[(25,18),(20,4),(22,15)],[(22,22),(9,25),(5,31),(13,26)],[(28,22),(40,25),(45,33),(36,27)]]:poly(d,pts,'lime')
rect(d,(22,21,25,24),'gold')
im,d=sprite('bush',24,20);poly(d,[(1,12),(4,12),(4,6),(9,6),(9,3),(17,3),(17,7),(21,7),(21,12),(23,12),(23,17),(3,17)],'deep');rect(d,(4,10,20,15),'leaf');rect(d,(6,7,17,12),'moss');rect(d,(10,5,15,7),'lime');rect(d,(6,10,9,11),'glow')
im,d=sprite('flowers',16,16)
for x,y in [(3,8),(10,4),(12,12)]:rect(d,(x,y,x,y+3),'leaf');rect(d,(x-1,y-2,x+1,y),'cream');rect(d,(x,y-1,x,y-1),'gold')
im,d=sprite('rock',16,16);poly(d,[(2,9),(5,4),(10,3),(14,8),(14,12),(10,14),(3,13)],'deep');poly(d,[(3,9),(6,5),(10,5),(13,9),(11,11),(4,11)],'#8a9180');rect(d,(6,5,9,6),'#bac0a0')
im,d=sprite('fence',16,20)
rect(d,(0,6,15,8),'wood');rect(d,(0,12,15,14),'wood');
for x in [2,12]:rect(d,(x,2,x+2,18),'wood2');rect(d,(x,2,x,17),'wood3');rect(d,(x,1,x+1,1),'cream')
im,d=sprite('sign',24,24);rect(d,(10,10,12,23),'wood');rect(d,(1,1,22,13),'deep');rect(d,(2,2,21,11),'wood2');rect(d,(3,3,20,3),'wood3');poly(d,[(6,6),(15,6),(15,4),(19,7),(15,10),(15,8),(6,8)],'cream')
# Building pieces tiled/composed in the world; sprites match the old collision footprint.
im,d=sprite('house',96,88)
rect(d,(4,36,91,83),'deep');rect(d,(7,35,88,80),'cream');rect(d,(7,74,88,80),'wood');
for x in range(9,90,10):rect(d,(x,40,x,74),'#c3b38d')
poly(d,[(0,35),(14,5),(81,5),(95,35),(95,42),(0,42)],'deep');poly(d,[(3,34),(16,7),(79,7),(92,34),(92,38),(3,38)],'roof')
for y in range(10,36,5):
 x1=16-(y-10)//2;x2=79+(y-10)//2
 rect(d,(x1,y,x2,y+1),'roof2')
 for x in range(x1,x2,10):rect(d,(x,y+2,x,y+4),'#774d40')
rect(d,(15,4,80,6),'wood3');rect(d,(39,50,59,81),'deep');rect(d,(41,51,57,78),'wood');rect(d,(44,54,55,72),'wood2');rect(d,(53,66,54,67),'gold');rect(d,(35,81,64,86),'wood3')
for x in [16,68]:
 rect(d,(x,48,x+13,65),'wood');rect(d,(x+2,50,x+11,61),'water');rect(d,(x+3,51,x+8,53),'water2');rect(d,(x+6,50,x+7,62),'cream');rect(d,(x,64,x+13,66),'wood3')
rect(d,(74,2,82,15),'deep');rect(d,(76,2,81,13),'wood');rect(d,(73,0,83,3),'wood2')
im,d=sprite('window',32,32);rect(d,(2,1,29,29),'deep');rect(d,(4,3,27,26),'wood3');rect(d,(6,5,25,23),'water');rect(d,(7,6,15,11),'water2');rect(d,(15,5,16,24),'cream');rect(d,(6,14,25,15),'cream');rect(d,(0,27,31,30),'wood')
im,d=sprite('door',32,32);rect(d,(2,0,29,31),'deep');rect(d,(4,2,27,30),'wood');rect(d,(6,4,25,27),'wood2');rect(d,(8,5,8,26),'wood3');rect(d,(23,18,24,19),'gold')
im,d=sprite('bed',54,70);rect(d,(1,2,52,67),'deep');rect(d,(3,1,50,64),'wood');rect(d,(5,7,48,59),'cream');rect(d,(9,9,44,24),'#bdbb9a');rect(d,(10,9,43,21),'#efe4bd');rect(d,(6,28,47,59),'blue');rect(d,(8,30,45,32),'water2');rect(d,(8,34,45,54),'#6c8b82');
for y in range(36,54,6):rect(d,(9,y,44,y),'#77978a')
rect(d,(5,58,49,63),'wood2');rect(d,(3,65,7,69),'deep');rect(d,(47,65,51,69),'deep')
for name,w,h in [('table',64,32),('dresser',48,32),('counter',88,24)]:
 im,d=sprite(name,w,h);rect(d,(2,4,w-3,h-2),'deep');rect(d,(3,2,w-4,h-8),'wood2');rect(d,(4,3,w-5,5),'wood3');rect(d,(5,h-8,w-6,h-5),'wood');
 for x in range(10,w-6,14):rect(d,(x,6,x,h-9),'wood');rect(d,(x-4,h-11,x-2,h-10),'gold')
 rect(d,(3,h-3,6,h-1),'wood');rect(d,(w-7,h-3,w-4,h-1),'wood')
for color,name in [('moss','seed-shop'),('roof','produce-shop')]:
 im,d=sprite(name,96,64);rect(d,(5,14,90,58),'deep');rect(d,(8,16,87,57),'cream');rect(d,(0,1,95,22),'deep');rect(d,(2,2,93,19),color)
 for x in range(3,94,12):rect(d,(x,3,x+5,23),'cream');rect(d,(x+6,19,x+11,25),color)
 rect(d,(7,42,88,61),'wood');rect(d,(9,43,86,54),'wood2');rect(d,(9,44,86,45),'wood3')
 for x in range(15,82,14):rect(d,(x,38,x+8,43),'soil2');rect(d,(x+2,36,x+6,39),'gold' if name=='seed-shop' else 'red');rect(d,(x+3,35,x+4,37),'leaf')
 # original market keeper behind counter
 rect(d,(44,26,53,35),'skin');rect(d,(43,24,54,28),'wood');rect(d,(41,35,56,41),'blue');rect(d,(46,31,46,31),'ink');rect(d,(51,31,51,31),'ink')
# Small objects and inventory icons, all drawn on a 16px grid.
for name in ['seed','can','sickle','coin','heart','energy','marker','sun','moon','pot','tomato','pause']:
 im,d=sprite(name,16,16)
 if name=='seed':
  rect(d,(3,2,12,14),'deep');rect(d,(4,3,11,13),'cream');rect(d,(4,3,11,5),'roof2');rect(d,(6,8,9,11),'red');rect(d,(7,7,8,8),'leaf')
 elif name=='can':
  rect(d,(4,5,11,13),'deep');rect(d,(5,6,10,12),'blue');rect(d,(6,7,9,8),'water2');rect(d,(2,5,4,10),'blue');rect(d,(11,8,13,9),'blue');rect(d,(13,5,14,8),'water2');rect(d,(5,3,10,4),'deep');rect(d,(6,2,9,2),'blue')
 elif name=='sickle':
  poly(d,[(3,14),(5,14),(10,7),(8,6)],'wood3');poly(d,[(7,6),(7,3),(10,1),(14,2),(15,5),(13,8),(10,8),(12,6),(12,3),(10,3),(9,6)],'cream')
 elif name=='coin':
  poly(d,[(5,1),(10,1),(13,4),(13,11),(10,14),(5,14),(2,11),(2,4)],'wood');poly(d,[(5,2),(10,2),(12,4),(12,10),(9,13),(5,13),(3,10),(3,5)],'gold');rect(d,(5,4,6,10),'cream');rect(d,(9,4,10,10),'roof2')
 elif name=='heart':poly(d,[(1,3),(5,2),(8,5),(11,2),(14,3),(14,8),(8,14),(1,8)],'red');rect(d,(3,4,5,5),'redlight')
 elif name=='energy':poly(d,[(8,1),(3,9),(7,9),(5,15),(13,6),(9,6),(12,1)],'gold');rect(d,(8,3,9,5),'cream')
 elif name=='marker':poly(d,[(2,3),(13,3),(8,10)],'ink');poly(d,[(4,4),(11,4),(8,8)],'gold')
 elif name=='sun':rect(d,(5,5,10,10),'gold');rect(d,(7,1,8,3),'cream');rect(d,(7,12,8,14),'cream');rect(d,(1,7,3,8),'cream');rect(d,(12,7,14,8),'cream')
 elif name=='moon':poly(d,[(8,1),(4,3),(2,7),(4,12),(9,14),(13,11),(8,10),(6,6),(7,3)],'cream')
 elif name=='pot':rect(d,(4,9,11,14),'roof');rect(d,(3,8,12,10),'roof2');rect(d,(7,2,8,8),'leaf');poly(d,[(7,6),(3,2),(6,1),(8,4),(11,0),(14,2),(9,6)],'moss')
 elif name=='tomato':poly(d,[(4,5),(11,5),(14,8),(13,13),(9,15),(4,13),(2,9)],'red');rect(d,(4,6,6,8),'redlight');poly(d,[(5,4),(7,5),(8,1),(9,5),(12,3),(10,6),(6,6)],'leaf')
 elif name=='pause':rect(d,(4,3,6,12),'cream');rect(d,(10,3,12,12),'cream')
for stage in range(6):
 im,d=sprite('crop'+str(stage),24,32)
 if stage==0:rect(d,(9,22,14,24),'soil2');rect(d,(11,19,12,22),'lime')
 else:
  dead=stage==5;color='wood2' if dead else ('sanddark' if stage==4 else 'leaf');h=stage*4 if stage<4 else 10
  rect(d,(11,22-h,12,26),color)
  for x,y in [(5,20),(13,17),(6,13),(13,10)][:min(stage+1,4)]:poly(d,[(x,y),(x+5,y+1),(x+6,y+4),(x+1,y+3)],color);rect(d,(x+1,y+1,x+3,y+1),'lime' if not dead else 'soil')
  if stage==3:
   for x,y in [(4,18),(14,13),(11,24)]:rect(d,(x,y,x+5,y+5),'red');rect(d,(x+1,y,x+2,y+1),'redlight');rect(d,(x+2,y-1,x+3,y),'leaf')
# 4 directions x 3 frames, idle then two walk poses. Individual silhouette pixels.
for gender in ['boy','girl']:
 sheet=Image.new('RGBA',(72,128))
 for row,direction in enumerate(['down','up','left','right']):
  for frame in range(3):
   im=Image.new('RGBA',(24,32));d=ImageDraw.Draw(im);bob=1 if frame==2 else 0;feet=[0,0] if frame==0 else ([1,-1] if frame==1 else [-1,1])
   rect(d,(5,28,18,29),'#384c3a');rect(d,(8,25+feet[0],11,29+feet[0]),'ink');rect(d,(13,25+feet[1],16,29+feet[1]),'ink')
   rect(d,(6,15+bob,18,25+bob),'deep');rect(d,(7,15+bob,17,23+bob),'roof2' if gender=='girl' else 'blue');rect(d,(8,18+bob,10,24+bob),'wood3');rect(d,(15,18+bob,16,24+bob),'wood3');rect(d,(10,22+bob,15,24+bob),'wood')
   rect(d,(4,17+bob,6,23+bob),'skin');rect(d,(18,17+bob,20,23+bob),'skin');rect(d,(7,6+bob,17,15+bob),'wood');rect(d,(8,8+bob,16,16+bob),'skin');rect(d,(9,9+bob,15,13+bob),'skinlight')
   if gender=='girl':rect(d,(5,9+bob,7,19+bob),'wood');rect(d,(17,9+bob,19,19+bob),'wood');rect(d,(5,17+bob,7,18+bob),'gold')
   if direction=='up':rect(d,(7,8+bob,17,16+bob),'wood');rect(d,(8,10+bob,14,12+bob),'wood2')
   elif direction in ['left','right']:
    x=8 if direction=='left' else 16;rect(d,(x,11+bob,x,12+bob),'ink');rect(d,(7 if direction=='left' else 17,13+bob,8 if direction=='left' else 18,14+bob),'skin')
   else:rect(d,(9,11+bob,9,12+bob),'ink');rect(d,(15,11+bob,15,12+bob),'ink');rect(d,(11,15+bob,13,15+bob),'roof')
   rect(d,(5,5+bob,19,7+bob),'deep');rect(d,(4,5+bob,20,6+bob),'wood3');rect(d,(8,1+bob,16,4+bob),'sandlight');rect(d,(8,4+bob,16,4+bob),'roof');rect(d,(9,1+bob,15,1+bob),'cream')
   sheet.paste(im,(frame*24,row*32))
 sheet.save(OUT/(gender+'.png'))
# Pack source sprites into a padded atlas, keeping integral source pixels.
atlas=Image.new('RGBA',(512,512));frames={};x=y=rowh=0
for name,im in assets.items():
 if x+im.width>512:x=0;y+=rowh+2;rowh=0
 atlas.paste(im,(x,y));frames[name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}}
 x+=im.width+2;rowh=max(rowh,im.height)
atlas.save(OUT/'world.png');(OUT/'world.json').write_text(json.dumps({'frames':frames,'meta':{'image':'world.png','size':{'w':512,'h':512},'scale':'1'}},indent=2))
# Original compact 5x7 glyphs, bitmap only, no redistributed fonts.
glyphs={
'A':['01110','10001','10001','11111','10001','10001','10001'],'B':['11110','10001','10001','11110','10001','10001','11110'],'C':['01111','10000','10000','10000','10000','10000','01111'],'D':['11110','10001','10001','10001','10001','10001','11110'],'E':['11111','10000','10000','11110','10000','10000','11111'],'F':['11111','10000','10000','11110','10000','10000','10000'],'G':['01111','10000','10000','10111','10001','10001','01110'],'H':['10001','10001','10001','11111','10001','10001','10001'],'I':['111','010','010','010','010','010','111'],'J':['00111','00010','00010','00010','10010','10010','01100'],'K':['10001','10010','10100','11000','10100','10010','10001'],'L':['10000','10000','10000','10000','10000','10000','11111'],'M':['10001','11011','10101','10101','10001','10001','10001'],'N':['10001','11001','10101','10011','10001','10001','10001'],'O':['01110','10001','10001','10001','10001','10001','01110'],'P':['11110','10001','10001','11110','10000','10000','10000'],'Q':['01110','10001','10001','10001','10101','10010','01101'],'R':['11110','10001','10001','11110','10100','10010','10001'],'S':['01111','10000','10000','01110','00001','00001','11110'],'T':['11111','00100','00100','00100','00100','00100','00100'],'U':['10001','10001','10001','10001','10001','10001','01110'],'V':['10001','10001','10001','10001','10001','01010','00100'],'W':['10001','10001','10001','10101','10101','10101','01010'],'X':['10001','10001','01010','00100','01010','10001','10001'],'Y':['10001','10001','01010','00100','00100','00100','00100'],'Z':['11111','00001','00010','00100','01000','10000','11111'],
'0':['01110','10001','10011','10101','11001','10001','01110'],'1':['010','110','010','010','010','010','111'],'2':['01110','10001','00001','00010','00100','01000','11111'],'3':['11110','00001','00001','01110','00001','00001','11110'],'4':['00010','00110','01010','10010','11111','00010','00010'],'5':['11111','10000','10000','11110','00001','00001','11110'],'6':['01110','10000','10000','11110','10001','10001','01110'],'7':['11111','00001','00010','00100','01000','01000','01000'],'8':['01110','10001','10001','01110','10001','10001','01110'],'9':['01110','10001','10001','01111','00001','00001','01110'],
'.':['0','0','0','0','0','0','1'],',':['0','0','0','0','0','1','1'],':':['0','1','1','0','1','1','0'],'!':['1','1','1','1','1','0','1'],'?':['1110','0001','0001','0010','0100','0000','0100'],'-':['000','000','000','111','000','000','000'],'/':['00001','00001','00010','00100','01000','10000','10000'],"'":['1','1','0','0','0','0','0'],'+':['000','010','010','111','010','010','000'],'>':['100','010','001','001','001','010','100'],'<':['001','010','100','100','100','010','001'],'(':['01','10','10','10','10','10','01'],')':['10','01','01','01','01','01','10'],'&':['01100','10010','10100','01000','10101','10010','01101'],'=':['000','000','111','000','111','000','000']}
font=Image.new('RGBA',(128,64));fd=ImageDraw.Draw(font);chars=[]
for code in range(32,127):
 c=chr(code);grid=glyphs.get(c.upper(),['0']*7);w=len(grid[0]) if c!=' ' else 3;x=(code-32)%16*8;y=(code-32)//16*10
 for yy,line in enumerate(grid):
  for xx,v in enumerate(line):
   if v=='1':fd.point((x+xx,y+yy),fill='#ffffff')
 chars.append(f'<char id="{code}" x="{x}" y="{y}" width="{w}" height="7" xoffset="0" yoffset="1" xadvance="{w+1}" page="0" chnl="15"/>')
font.save(OUT/'font.png');(OUT/'font.xml').write_text('<font><info face="SimpleLifePixel" size="8"/><common lineHeight="10" base="8" scaleW="128" scaleH="64" pages="1"/><pages><page id="0" file="font.png"/></pages><chars count="95">'+''.join(chars)+'</chars></font>')
(OUT/'README.md').write_text('# Original Simple Life pixel assets\nGenerated deterministically by scripts/generate-pixel-assets.py. Atlas uses native 16px terrain tiles, multi-tile objects, item icons and crop stages; boy/girl sheets have 24x32 frames (3 columns, down/up/left/right rows). Font is an original 5x7 alphabet. No downloaded images or fonts. See docs/ASSET_LICENSES.md and docs/AI_USAGE.md.\n')
print(f'Generated {len(assets)} original atlas frames, two 12-frame character sheets and bitmap font.')
