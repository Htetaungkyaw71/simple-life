"""Build an allowlisted mixed-source atlas, supplied players and original NPC/home art.
Never edits the vendor archive. Run from the project root with Pillow installed.
"""
from PIL import Image, ImageDraw
from pathlib import Path
import zipfile, io, json, math, random
OUT=Path('public/assets/pixel/processed');OUT.mkdir(parents=True,exist_ok=True)
z=zipfile.ZipFile('public/assets/vendor/limezu/serene-village/Serene_Village_revamped_v1.9.zip')
sheet=Image.open(io.BytesIO(z.read('SERENE_VILLAGE_REVAMPED/Serene_Village_16x16.png'))).convert('RGBA')
assets={};source={}
def crop(name,box):
 assets[name]=sheet.crop(box);source[name]=list(box)
def make(name,w,h):
 im=Image.new('RGBA',(w,h));assets[name]=im;return ImageDraw.Draw(im)
def rect(d,b,c):d.rectangle(b,fill=c)
INK='#34344f';WOOD='#ad7056';LIGHT='#efd6a0';SHADE='#694757';GOLD='#e6af66';JADE='#469b7c';SKIN='#ecb889'
# Original 24x32 farmers. Four genuinely different walking poses per direction,
# plus two idle poses. Row order is shared with PlayerView.
for gender in ['boy','girl']:
 out=Image.new('RGBA',(216,128))
 for row,direction in enumerate(['down','up','left','right']):
  for frame in range(9):
   im=Image.new('RGBA',(24,32));d=ImageDraw.Draw(im)
   step=[0,-2,0,2,0,0,0,0,0][frame];bob=1 if frame in [2,4] else 0
   shirt='#e99566' if gender=='boy' else '#e6c879';pants='#457da5' if gender=='boy' else '#539a8a';hair='#634555' if gender=='boy' else '#964e48'
   d.ellipse((5,27,20,30),fill=(36,46,68,65))
   # Walking legs alternate extension and expose the boot tops.
   for x,offset in [(8,step),(14,-step)]:
    rect(d,(x,23+min(0,offset),x+3,28+offset),INK);rect(d,(x,23+min(0,offset),x+2,26+offset),pants);rect(d,(x-1,28+offset,x+3,29+offset),SHADE)
   if direction in ['left','right']:
    rect(d,(9,16+bob,16,24+bob),INK);rect(d,(10,17+bob,15,22+bob),pants)
    ax=9 if direction=='left' else 15
    rect(d,(ax,18-step//2+bob,ax+2,24-step//2+bob),SKIN);rect(d,(ax,17-step//2+bob,ax+2,20-step//2+bob),shirt)
   else:
    rect(d,(6,16+bob,18,24+bob),INK);rect(d,(7,17+bob,17,22+bob),shirt)
    rect(d,(9,18+bob,15,25+bob),pants);rect(d,(9,17+bob,10,19+bob),LIGHT);rect(d,(14,17+bob,15,19+bob),LIGHT)
    for x,offset in [(5,-step//2),(18,step//2)]:
     rect(d,(x,18+offset+bob,x+1,23+offset+bob),SKIN);rect(d,(x,17+offset+bob,x+1,20+offset+bob),shirt)
    rect(d,(11,21+bob,14,22+bob),'#7abac1')
   # Rounded silhouette, asymmetric locks and cheek highlights.
   d.polygon([(7,4+bob),(16,4+bob),(19,7+bob),(19,13+bob),(16,17+bob),(8,17+bob),(5,13+bob),(5,8+bob)],fill=INK)
   d.polygon([(7,7+bob),(17,7+bob),(18,12+bob),(15,16+bob),(9,16+bob),(6,12+bob)],fill=SKIN)
   rect(d,(7,8+bob,16,11+bob),'#f6d2a0');rect(d,(7,4+bob,16,7+bob),hair);rect(d,(5,7+bob,7,12+bob),hair);rect(d,(17,7+bob,18,12+bob),hair)
   if direction=='up':
    rect(d,(6,7+bob,18,14+bob),hair);rect(d,(8,8+bob,15,9+bob),'#b0705b');rect(d,(9,15+bob,15,16+bob),hair)
   else:
    eyes=[9,15] if direction=='down' else [9] if direction=='left' else [15]
    for x in eyes:rect(d,(x,10+bob,x,10+bob+(0 if frame==5 else 1)),INK)
    if direction=='down':rect(d,(12,14+bob,13,14+bob),'#a96164');rect(d,(7,13+bob,8,13+bob),'#db8d79');rect(d,(16,13+bob,17,13+bob),'#db8d79')
   if gender=='girl':
    rect(d,(5,12+bob,6,18+bob),hair);rect(d,(18,12+bob,19,18+bob),hair);rect(d,(5,15+bob,6,16+bob),'#6bc3b2');rect(d,(18,15+bob,19,16+bob),'#6bc3b2')
    d.polygon([(6,4+bob),(9,2+bob),(15,2+bob),(18,5+bob),(18,7+bob),(7,7+bob)],fill=hair);rect(d,(8,3+bob,15,4+bob),'#bf785b');rect(d,(16,5+bob,19,6+bob),'#f2d185')
   else:
    d.polygon([(3,6+bob),(6,4+bob),(7,2+bob),(15,1+bob),(18,4+bob),(21,6+bob),(19,8+bob),(5,8+bob)],fill=SHADE)
    rect(d,(6,4+bob,18,6+bob),GOLD);rect(d,(8,2+bob,15,4+bob),LIGHT);rect(d,(8,5+bob,17,5+bob),'#b47852');rect(d,(3,7+bob,20,7+bob),GOLD)
   if frame>=6:
    # Original crouch / tucked knees / landing poses, retaining the existing face.
    im.paste((0,0,0,0),(4,23,21,31));jd=ImageDraw.Draw(im)
    if frame==7:
     for x in [8,14]:rect(jd,(x,22,x+3,25),pants);rect(jd,(x-1,25,x+3,26),SHADE)
     for x in [4,19]:rect(jd,(x,15,x+1,20),SKIN);rect(jd,(x,14,x+1,16),shirt)
    else:
     for x in ([7,15] if frame==8 else [8,14]):rect(jd,(x,23,x+3,27),pants);rect(jd,(x-1,27,x+3,28),SHADE)
   out.alpha_composite(im,(frame*24,row*32))
 out.save(OUT/(gender+'.png'))
for n,(base,colour) in enumerate([('girl',(163,110,170)),('boy',(109,152,106)),('girl',(101,143,185))]):
 im=Image.open(OUT/(base+'.png')).crop((0,0,24,32));px=im.load();old=(83,154,138) if base=='girl' else (69,125,165)
 for y in range(32):
  for x in range(24):
   if px[x,y][:3]==old:px[x,y]=(*colour,255)
 assets['npc'+str(n)]=im
# Native source rectangles only; no preview extraction or resampling.
crop('cliff-face',(16,160,32,176));crop('cliff-stairs',(32,160,64,176));crop('cliff-left',(0,144,16,160));crop('cliff-right',(80,144,96,160));
crop('grass',(64,0,80,16));crop('path',(144,16,160,32));crop('plaza',(0,48,48,96))
# This source tile includes a grass edge; remove that edge from the interior fill.
px=assets['path'].load()
for y in range(16):
 for x in range(16):
  r,g,b,a=px[x,y]
  if g>r*.9:px[x,y]=(202,167,105,255)
for name,box in {'nw':(48,16,64,32),'n':(64,16,80,32),'ne':(80,16,96,32),'w':(48,32,64,48),'e':(80,32,96,48),'sw':(48,48,64,64),'s':(64,48,80,64),'se':(80,48,96,64)}.items():crop('path-'+name,box)
for i,x in enumerate([144,176,208,240]):crop('tree'+str(i),(x,192,x+32,240))
assets['tree']=assets['tree0'];crop('tree-tall',(144,144,176,192));crop('tree-wide',(144,288,192,336))
for i,x in enumerate([32,48,64,80,96]):crop('flowers'+str(i),(x,192,x+16,208))
assets['flowers']=assets['flowers0'];crop('bush',(112,192,128,208));crop('rock',(0,288,32,320));crop('pebble',(0,320,16,336));crop('fence',(64,240,80,256));crop('fence-v',(64,256,80,272));crop('post',(64,224,80,240));crop('sign',(112,208,128,240));crop('planter',(64,288,80,304))
crop('house',(160,336,240,400));crop('house-blue',(160,592,240,656));crop('house-green',(160,464,240,528));crop('shed',(0,464,48,528))
crop('seed-shop',(160,464,240,528));crop('produce-shop',(160,336,240,400))
for name in ['house','house-blue','house-green','seed-shop','produce-shop']:
 d=ImageDraw.Draw(assets[name]);rect(d,(58,5,65,19),SHADE);rect(d,(59,6,64,18),'#a87e7c');rect(d,(57,4,66,6),'#d2a891');rect(d,(59,10,63,10),'#d2a891');rect(d,(60,14,64,14),'#d2a891')
for name,colour in [('seed-shop','#719e91'),('produce-shop','#c97770')]:
 d=ImageDraw.Draw(assets[name]);d.polygon([(8,38),(67,38),(70,46),(5,46)],fill=SHADE)
 for x in range(8,68,8):rect(d,(x,38,x+6,45),colour if (x//8)%2 else LIGHT);rect(d,(x,46,x+6,48),colour if (x//8)%2 else '#d6bc95')
# Recolour the overly saturated base green gently towards a richer jade, keeping
# every authored highlight/shadow cluster intact. Roads retain their warm sand.
for name,im in assets.items():
 if name.startswith(('npc','house','shed','seed-shop','produce-shop')):continue
 px=im.load()
 for y in range(im.height):
  for x in range(im.width):
   r,g,b,a=px[x,y]
   if g>r*1.12 and g>b*1.15 and a: px[x,y]=(int(r*.87),int(g*.93),min(255,int(b*1.18)),a)
# Additional ground and furniture are original missing assets.
rng=random.Random(41)
for i in range(4):
 im=Image.new('RGBA',(16,16),'#78ad6d');d=ImageDraw.Draw(im)
 for j in range(2):
  x,y=rng.randrange(2,14),rng.randrange(2,14);d.line((x,y,x+1,y),fill=['#75b26c','#80bb72','#6da967'][i%3])
 assets['grass'+str(i)]=im
for i in range(4):
 d=make('grass-detail'+str(i),16,16)
 for x,y in [(3,9),(8,5),(11,12),(5,13)]:
  d.line((x-1,y,x,y+3,x+2,y-2),fill='#4f9566');d.point((x+1,y),fill='#9acc7c')
assets['grass-detail']=assets['grass-detail0']
d=make('fern',24,20)
for tip in [(1,7),(5,1),(10,0),(17,2),(22,7)]:
 x,y=tip;d.polygon([(11,18),(x,y),(x+3,y+1),(14,15)],fill='#398973');d.line((12,18,x+1,y+1),fill='#96c984')
rect(d,(11,12,12,19),'#527553')
d=make('mushroom',16,16);d.ellipse((5,8,12,13),fill=SHADE);rect(d,(8,10,9,14),LIGHT);d.ellipse((4,6,13,10),fill='#cf797a');rect(d,(7,7,8,7),LIGHT)
for i in range(2):
 d=make('water'+str(i),16,16);rect(d,(0,0,15,15),'#4d9fc5');rect(d,(0,8,15,15),'#4898c0');d.line((2+i*3,4,6+i*3,4),fill='#9bd8da');d.line((7-i*2,12,13-i*2,12),fill='#78bfcd')
for name,c in [('soil','#9c6d55'),('watered-soil','#654f59')]:
 d=make(name,32,32);rect(d,(0,0,31,31),c)
 for y in range(4,32,7):
  d.line((2,y,29,y),fill='#785345' if name=='soil' else '#514451');d.line((4,y+1,27,y+1),fill='#b68560' if name=='soil' else '#796673')
 for i in range(12):
  x,y=rng.randrange(32),rng.randrange(32);d.point((x,y),fill='#d5a378' if name=='soil' else '#8b8390')
for name in ['soil','watered-soil']:
 d=ImageDraw.Draw(assets[name]);d.rectangle((0,0,2,1),fill=(0,0,0,0));d.rectangle((29,0,31,1),fill=(0,0,0,0));d.rectangle((0,30,2,31),fill=(0,0,0,0));d.rectangle((29,30,31,31),fill=(0,0,0,0))
for name,colour in [('floor0','#ba8864'),('floor1','#c29470')]:
 d=make(name,32,16);rect(d,(0,0,31,15),colour)
 for y in [0,8]:
  rect(d,(0,y,31,y),SHADE);rect(d,(0,y+1,31,y+1),'#d6ad81');d.line((5 if y==0 else 22,y,5 if y==0 else 22,y+7),fill='#98674f')
 d.line((9,4,18,4),fill='#af7c58');d.line((2,13,8,13),fill='#ae7d59')
d=make('wall',16,32);rect(d,(0,0,15,31),'#e4c99a');rect(d,(0,0,15,2),SHADE);rect(d,(0,3,15,5),WOOD);rect(d,(0,23,15,31),WOOD);rect(d,(0,24,15,25),GOLD);rect(d,(0,30,15,31),SHADE);rect(d,(0,6,1,22),'#c4a87c')
d=make('window',24,28);rect(d,(0,0,23,27),SHADE);rect(d,(2,2,21,25),GOLD);rect(d,(4,4,19,22),'#73b7c4');rect(d,(5,5,10,12),'#b4ded7');rect(d,(11,3,12,23),LIGHT);rect(d,(3,13,20,14),LIGHT);rect(d,(0,24,23,26),WOOD)
d=make('bed',24,40);rect(d,(1,1,22,39),SHADE);rect(d,(2,2,21,9),WOOD);rect(d,(3,3,20,4),GOLD);rect(d,(3,7,20,34),LIGHT);rect(d,(5,8,18,15),'#fff0ca');rect(d,(6,9,17,10),'#fff8e8');rect(d,(4,18,19,35),'#7097b0');rect(d,(4,18,19,20),'#b8d3cb');rect(d,(6,23,7,34),'#8eb4c3');rect(d,(17,21,19,34),'#4b6e94');rect(d,(2,35,21,37),WOOD);rect(d,(3,35,20,35),GOLD)
def furniture(name,w,h):
 d=make(name,w,h);rect(d,(2,h-7,w-3,h-1),SHADE);rect(d,(0,3,w-1,h-6),INK);rect(d,(1,2,w-2,h-8),WOOD);rect(d,(2,2,w-3,3),GOLD);return d
d=furniture('table',32,24)
for x in [9,20]:rect(d,(x,5,x,15),'#8e594a')
d.ellipse((10,6,20,12),fill=LIGHT);d.ellipse((13,7,18,10),fill='#d18364')
d=furniture('dresser',32,32)
for y in [8,17]:rect(d,(3,y,28,y+7),SHADE);rect(d,(4,y,27,y+5),WOOD);rect(d,(15,y+2,17,y+2),GOLD)
d=furniture('kitchen',64,32);rect(d,(2,4,61,12),LIGHT)
for x in [5,23,43]:rect(d,(x,16,x+13,25),SHADE);rect(d,(x+1,16,x+12,24),WOOD);rect(d,(x+9,18,x+10,18),GOLD)
d.ellipse((6,5,20,11),fill='#77a3ac');d.ellipse((9,6,17,10),fill='#475a79');rect(d,(14,2,15,6),INK)
for x in [43,54]:d.ellipse((x,5,x+6,10),fill=INK)
d=furniture('shelf',32,26)
for x,col in [(3,'#658ead'),(9,'#a76871'),(15,'#7dab84'),(22,'#d5b075')]:rect(d,(x,6,x+4,16),col);rect(d,(x+1,7,x+1,15),LIGHT)
rect(d,(2,17,29,19),GOLD)
d=furniture('chair',16,24);rect(d,(2,0,13,8),SHADE);rect(d,(3,1,12,6),WOOD);rect(d,(4,2,11,3),GOLD)
d=make('rug',64,40);rect(d,(1,1,62,38),'#545772');rect(d,(3,3,60,36),'#bd777c');rect(d,(5,5,58,34),'#dfb590');rect(d,(7,7,56,32),'#628f98')
for x in range(12,56,10):d.polygon([(x,17),(x+3,20),(x,23),(x-3,20)],fill=LIGHT)
d=make('pot',16,24);d.ellipse((2,19,13,23),fill=(30,35,50,60));rect(d,(4,13,11,21),SHADE);rect(d,(5,14,10,20),'#c7836a');rect(d,(3,12,12,14),GOLD)
for x,y in [(4,7),(9,3),(11,8),(5,3)]:d.ellipse((x-3,y-2,x+2,y+5),fill=JADE);d.line((x,y,x,13),fill='#416a60');d.point((x-1,y-1),fill='#93c181')
for name in ['crate','barrel']:
 d=furniture(name,16,18)
 for x in [4,8,12]:rect(d,(x,5,x,14),SHADE)
 if name=='barrel':rect(d,(1,6,14,7),'#78788b');rect(d,(1,13,14,14),'#78788b')
 else:d.line((2,4,13,14),fill=GOLD)
d=make('bench',32,20)
for y in [3,7,11]:rect(d,(1,y,30,y+2),WOOD);rect(d,(2,y,29,y),GOLD)
for x in [4,26]:rect(d,(x,13,x+2,19),SHADE)
d=make('lamp',16,32);rect(d,(7,7,8,29),INK);rect(d,(4,29,11,30),INK);rect(d,(3,3,12,11),INK);rect(d,(5,4,10,9),GOLD);rect(d,(6,5,8,8),LIGHT);rect(d,(5,1,10,2),INK)
d=make('well',24,32);d.ellipse((2,14,21,30),fill=INK);d.ellipse((3,13,20,26),fill='#9d91a0');d.ellipse((5,15,18,21),fill='#435e7c');rect(d,(2,4,3,22),WOOD);rect(d,(20,4,21,22),WOOD);d.polygon([(0,6),(12,0),(23,6)],fill='#b96a68');rect(d,(1,6,22,8),SHADE)
d=make('wheelbarrow',24,24);d.ellipse((15,16,22,23),fill=INK);d.polygon([(0,6),(19,8),(17,17),(4,15)],fill='#779c98');d.line((1,4,21,11),fill=LIGHT);rect(d,(3,15,4,22),WOOD)
d=make('mailbox',16,24);rect(d,(7,12,9,23),WOOD);rect(d,(1,4,14,14),INK);rect(d,(2,4,13,11),'#698fa4');rect(d,(4,7,11,8),INK);rect(d,(13,2,14,6),'#d88673')
d=furniture('notice',32,32);rect(d,(5,6,15,18),LIGHT);rect(d,(19,8,27,19),LIGHT);rect(d,(7,10,13,10),SHADE);rect(d,(20,12,25,12),SHADE)
d=make('scarecrow',32,40);rect(d,(15,10,17,39),WOOD);rect(d,(3,19,29,21),GOLD);rect(d,(10,17,22,31),'#628caa');rect(d,(11,8,21,17),LIGHT);rect(d,(6,7,25,9),GOLD);rect(d,(11,2,20,6),WOOD);rect(d,(13,12,13,13),INK);rect(d,(19,12,19,13),INK)
for n in range(2):
 d=make('fountain'+str(n),48,48);d.ellipse((0,22,47,47),fill=INK);d.ellipse((2,20,45,43),fill='#a2a0ad');d.ellipse((5,23,42,38),fill='#549dbc');d.arc((8,24+n*2,39,35),0,180,fill='#b3e0dc');rect(d,(21,9,26,29),'#b4b4bd');d.ellipse((14,5,33,12),fill='#dad3ca');rect(d,(23,1,24,8),'#aedfda');rect(d,(17,11,18,23+n*2),'#8fd2d3');rect(d,(29,11,30,23-n*2),'#8fd2d3')
for n in range(2):
 d=make('butterfly'+str(n),8,8);rect(d,(3,3,4,6),INK);rect(d,(0 if n==0 else 2,2,2,4),'#ebac9b');rect(d,(5,2,7 if n==0 else 5,4),LIGHT)
d=make('dust',4,4);rect(d,(0,2,2,2),GOLD);rect(d,(2,0,3,0),LIGHT)
# Animated official door frames, retained at native source resolution.
door=Image.open(io.BytesIO(z.read('SERENE_VILLAGE_REVAMPED/Animated stuff/door_16x16.png'))).convert('RGBA')
for i in range(door.width//16):assets['door'+str(i)]=door.crop((i*16,0,i*16+16,door.height))
from crop_art import add_crop_art,add_city_crop_art,add_stall_art
add_crop_art(assets)
add_city_crop_art(assets)
from farm_crop_art import add_farm_crop_art
add_farm_crop_art(assets)
add_stall_art(assets)
from forest_art import add_forest_art
add_forest_art(assets)
from wilderness_art import add_wilderness_art
add_wilderness_art(assets)
from craftpix_art import add_craftpix_art
craftpix=add_craftpix_art(assets)
wildlife={} # Superseded animal packs are intentionally excluded.
from forest_growth_art import add_grass_art
add_grass_art(assets)
from forest_trees_art import add_forest_trees
add_forest_trees(assets)
from forest_canopy_art import add_forest_canopies
add_forest_canopies(assets)
from supplied_art import write_supplied_farmers, add_supplied_environment
supplied_characters=write_supplied_farmers(OUT)
supplied_environment=add_supplied_environment(assets)
from city_art import add_city_art
town_residents=add_city_art(assets)
from matched_residents_art import add_matched_residents_art
matched_residents=add_matched_residents_art(assets,OUT)
for n in range(4):assets.pop('boar'+str(n),None)
atlas=Image.new('RGBA',(1024,2048));frames={};x=y=rowh=0;wildlife_cells={}
for name,im in assets.items():
 if name in wildlife:
  key=(im.size,im.tobytes())
  if key in wildlife_cells:frames[name]=frames[wildlife_cells[key]];continue
  wildlife_cells[key]=name
 if x+im.width>1024:x=0;y+=rowh+2;rowh=0
 atlas.alpha_composite(im,(x,y));frames[name]={'frame':dict(x=x,y=y,w=im.width,h=im.height),'rotated':False,'trimmed':False,'spriteSourceSize':dict(x=0,y=0,w=im.width,h=im.height),'sourceSize':dict(w=im.width,h=im.height)};x+=im.width+2;rowh=max(rowh,im.height)
assert y+rowh<=2048
atlas.save(OUT/'town.png');(OUT/'town.json').write_text(json.dumps({'frames':frames,'meta':{'image':'town.png','size':{'w':1024,'h':2048}}},indent=2))
(OUT/'manifest.json').write_text(json.dumps({'pack':'Serene Village revamped 1.9','creator':'LimeZu','license':'CC BY 4.0','sourceRectangles':source,'sourceAliases':{'tree':'tree0','flowers':'flowers0'},'derivedAdditions':{'guava-tree':'LimeZu tree0 plus original Guava clusters','mango-tree':'LimeZu tree0 plus original Mango clusters','snow-pine':'LimeZu tree0 with original snow palette','acacia-tree':'LimeZu tree0 with original dry palette'},'atlasComposition':'LimeZu CC BY 4.0 environment, Pipoya custom game-use human residents, Craftpix Freebie Products section 2, ToffeeCraft Standard Free personal-use scenery, original forest trees/undergrowth, and other original additions; licences apply per source.', 'townResidents':town_residents,'matchedResidents':matched_residents,'originalHouses':[n for n in assets if n.startswith('house-village-')],'cityOriginalAdditions':[n for n in assets if n.startswith('city-')],'cityAdaptations':'LimeZu houses: muted terracotta roofs, cream timber facades, arched doors, windows, flower boxes and ivy; original alpha retained.','suppliedEnvironment':supplied_environment,'suppliedCharacters':supplied_characters,'craftpixFrames':craftpix,'wildlifeFrames':wildlife,'originalAdditions':[n for n in assets if n not in supplied_environment and n not in craftpix and n not in wildlife and n not in ['guava-tree','mango-tree','snow-pine','acacia-tree'] and n not in source and not n.startswith(('door','resident-','town-person-')) and n not in ['tree','flowers']],'characterFrames':{'size':[24,32],'columns':9,'rows':['down','up','left','right'],'idle':[0,5],'walk':[1,2,3,4],'jump':[6,7,8]},'modifications':'Extracted/repacked; selected green pixels gently adjusted toward jade; original missing sprites/furniture.'},indent=2))
print('Packed',len(assets),'frames, Channeechan farmers 24x32 / 36 frames each')
