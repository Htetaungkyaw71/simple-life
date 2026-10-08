"""Original native pixel fruit and wilderness landmarks.
The three tree variants are explicitly derived from the licensed tree0 frame.
"""
from PIL import Image,ImageDraw
INK='#34344f';LIGHT='#efd6a0';SHADE='#694757'
def add_wilderness_art(assets):
 def make(name,w,h):
  im=Image.new('RGBA',(w,h));assets[name]=im;return ImageDraw.Draw(im)
 fruit=[('banana','#f0cf74'),('orange','#efa456'),('papaya','#efb264'),('coconut','#a98262'),('dragon-fruit','#d879b2'),('pineapple','#d2b269')]
 for name,c in fruit:
  d=make(name+'-item',16,16)
  if name=='banana':
   d.polygon([(2,2),(5,5),(7,9),(13,8),(12,12),(8,14),(4,11),(1,6)],fill=INK);d.polygon([(3,4),(6,10),(12,10),(10,12),(7,12),(4,9)],fill=c);d.line((3,5,5,10,8,12),fill=LIGHT)
  else:
   d.ellipse((2,3,13,14),fill=INK);d.ellipse((3,4,12,13),fill=c);d.line((5,5,4,8),fill=LIGHT);d.arc((4,5,11,12),0,85,fill=SHADE)
   if name=='coconut':
    for x,y in [(7,6),(10,7),(8,9)]:d.point((x,y),fill=INK)
   if name=='dragon-fruit':
    for x,y in [(2,7),(7,3),(12,7),(9,12)]:d.line((x,y,x-1,y-2),fill='#75b77a')
   if name=='pineapple':
    for y in [7,10]:d.line((5,y,10,y+2),fill=SHADE)
  d.line((7,4,8,1),fill='#ad7056');d.polygon([(7,3),(4,0),(8,1),(11,0),(10,3)],fill='#469b7c')
 # Original terrain detail and stone/wood landmarks.
 for name,c in [('dry-grass','#b8a566'),('snow-grass','#b3ced1')]:
  d=make(name,16,16)
  for x,y in [(3,7),(8,4),(12,10)]:d.line((x-1,y,x,y+5,x+2,y+1),fill=c)
 d=make('bamboo-clump',32,40)
 for x in [8,15,23]:
  d.rectangle((x,3,x+3,38),fill=INK);d.rectangle((x+1,4,x+2,37),fill='#78ae73')
  for y in [9,18,27]:d.line((x,y,x+3,y),fill=LIGHT);d.polygon([(x,y),(x-6,y-4),(x-4,y-6)],fill='#469b7c')
 for name,variant in [('snow-pine','snow'),('acacia-tree','dry')]:
  im=assets['tree0'].copy();px=im.load()
  for y in range(im.height):
   for x in range(im.width):
    r,g,b,a=px[x,y]
    if a and g>r and g>b:
     if variant=='snow':px[x,y]=(int(110+g*.42),int(135+g*.40),int(136+g*.42),a) if y<22 else (int(45+g*.34),int(65+g*.43),int(68+g*.44),a)
     else:px[x,y]=(int(g*.80),int(g*.89),int(g*.50),a)
  assets[name]=im
 d=make('cave-mouth',64,44)
 d.polygon([(0,37),(5,18),(18,3),(43,1),(60,18),(63,39)],fill=INK);d.polygon([(3,36),(8,19),(19,6),(41,4),(57,20),(60,37)],fill='#8c9292');d.polygon([(15,38),(18,20),(29,13),(42,21),(48,38)],fill=INK);d.polygon([(20,37),(23,23),(29,19),(37,24),(41,37)],fill='#263e38');d.line((12,17,19,10,29,8),fill='#bfccba');d.rectangle((1,38,62,40),fill='#6d827a')
 for name in ['ruin-pillar','shrine-stone']:
  if name=='shrine-stone':continue
  d=make(name,24,36);d.rectangle((3,10,20,32),fill=INK);d.rectangle((5,11,18,30),fill='#8f9e9c');d.rectangle((2,6,21,10),fill='#b5c4b3');d.line((7,12,7,29),fill=LIGHT);d.line((13,12,12,20,16,24),fill=SHADE);d.rectangle((1,32,22,34),fill='#6d827a')
 d=make('ice-crystal',28,34);d.polygon([(2,28),(5,11),(12,1),(19,7),(25,27),(17,31),(7,32)],fill=INK);d.polygon([(4,27),(7,12),(12,4),(17,9),(22,26),(16,29),(8,30)],fill='#9fcbd0');d.line((12,5,12,25,8,29),fill='#e8edda');d.line((17,10,20,26,16,28),fill='#619ba6')
 d=make('camp-tent',48,40);d.polygon([(2,33),(19,4),(34,4),(46,33)],fill=INK);d.polygon([(5,32),(20,7),(32,7),(43,32)],fill='#ceaa70');d.polygon([(8,32),(20,11),(27,32)],fill='#69564e');d.line((30,8,41,31),fill=LIGHT);d.rectangle((1,33,46,36),fill='#ad7056')
 d=make('bamboo-gate',48,44)
 for x in [0,40]:d.rectangle((x,4,x+7,42),fill=INK);d.rectangle((x+2,5,x+5,40),fill='#78ae73')
 d.rectangle((0,0,47,6),fill='#b7c078');d.line((1,1,46,1),fill=LIGHT)
 d=make('waterfall-stone',32,32);d.polygon([(1,9),(7,1),(25,3),(30,13),(28,29),(3,29)],fill=INK);d.polygon([(3,10),(8,4),(23,5),(27,14),(25,26),(5,26)],fill='#8f9e9c');d.rectangle((11,8,20,28),fill='#549dbc');d.line((13,9,13,27),fill='#a8dcdb');d.line((18,12,18,25),fill='#7cbfc9')
 d=make('ancient-chest',24,24);d.rectangle((2,8,21,21),fill=INK);d.rectangle((3,9,20,20),fill='#ad7056');d.pieslice((2,3,21,17),180,360,fill=INK);d.pieslice((3,4,20,16),180,360,fill='#b38b62');d.line((3,13,20,13),fill=INK)
 for x in [5,17]:d.rectangle((x,6,x+2,20),fill='#d7b779')
 d.rectangle((10,12,13,16),fill=INK);d.rectangle((11,13,12,15),fill=LIGHT)
