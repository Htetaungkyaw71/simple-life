"""Original native pixel wildlife, fruit and wilderness landmarks.
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
 # Deliberately different silhouettes and markings for each species.
 profiles={
 'lion':('cat','#cea264'), 'tiger':('cat','#db9157'),'cheetah':('cat','#e0bd76'),'leopard':('cat','#d8aa64'),'jaguar':('cat','#c69b58'),
 'wolf':('dog','#8f9e9e'),'hyena':('dog','#aa8d6b'),
 'elephant':('elephant','#94a4a2'),'giraffe':('giraffe','#d9b477'),'hippopotamus':('hippo','#a68e9b'),'zebra':('horse','#e0dac3'),'rhinoceros':('rhino','#8e9f96'),
 'kangaroo':('kangaroo','#b98c71'),'panda':('bear','#e6dfc8'),'polarBear':('bear','#e5eadc'),
 'chimpanzee':('ape','#81665d'),'gorilla':('ape','#667472'),'monkey':('monkey','#ac8560'),
 'crocodile':('reptile','#6f9277'),'komodo':('reptile','#98a077'),'snake':('snake','#78a57a')}
 for name,(kind,color) in profiles.items():
  w,h=(64,52) if kind=='elephant' else (44,64) if kind=='giraffe' else (48,44) if kind in ['hippo','rhino','bear','ape'] else (48,28) if kind=='reptile' else (40,44) if kind=='kangaroo' else (40,32)
  for frame in range(4):
   d=make(name+str(frame),w,h);ground=h-5;step=frame%3-1
   d.ellipse((4,ground-2,w-3,h-1),fill=(36,46,68,65))
   def oval(box,c=color):
    d.ellipse(box,fill=INK);d.ellipse((box[0]+1,box[1]+1,box[2]-1,box[3]-1),fill=c)
   def legs(xs,top):
    for j,x in enumerate(xs):
     t=step if j%2 else -step;d.rectangle((x,top,x+4,ground+t),fill=INK);d.rectangle((x+1,top,x+3,ground-2+t),fill=color)
   if kind=='snake':
    d.line([(34,23),(24,16),(17,22),(11,15),(8,9)],fill=INK,width=9);d.line([(34,23),(24,16),(17,22),(11,15),(8,9)],fill=color,width=6)
    oval((2,3,13,13));d.line((2,8,0,8),fill='#d8798e');d.point((5,6),fill=LIGHT);d.point((5,7),fill=INK)
    for x,y in [(16,20),(22,18),(28,20)]:d.rectangle((x,y,x+2,y+1),fill=LIGHT)
   elif kind=='elephant':
    legs([21,45],31);oval((18,9,60,40));oval((7,10,34,36));oval((15,12,32,34),'#7c8c89')
    d.polygon([(8,20),(3,27),(3,42),(10,47),(15,43),(15,39),(10,39),(10,29),(16,22)],fill=INK);d.polygon([(9,22),(5,29),(5,41),(10,44),(13,42),(8,39),(8,29),(15,22)],fill=color)
    d.polygon([(11,28),(9,35),(15,32)],fill=LIGHT);d.point((10,18),fill=LIGHT);d.point((10,19),fill=INK);d.line((59,23,63,34),fill=INK)
   elif kind=='giraffe':
    legs([20,32],44);oval((15,35,40,51));d.polygon([(16,39),(12,13),(18,11),(24,40)],fill=INK);d.polygon([(17,38),(14,15),(17,14),(22,39)],fill=color)
    oval((3,8,20,20));d.line((12,9,11,2),fill=INK,width=2);d.line((17,9,19,3),fill=INK,width=2);d.point((7,12),fill=LIGHT);d.point((7,13),fill=INK)
    for x,y in [(18,24),(18,31),(25,39),(33,43),(19,47)]:d.rectangle((x,y,x+3,y+3),fill='#9a6854')
   elif kind in ['hippo','rhino','bear','ape']:
    legs([15,31],26);oval((12,9,w-4,ground-2));oval((3,10,24,29));oval((1,19,15,30),color)
    if kind=='ape':
     oval((5,22,14,ground));oval((28,23,38,ground));oval((5,12,19,24),'#b48c73');d.rectangle((7,15,17,17),fill=SHADE)
    elif name=='panda':
     for box in [(6,7,13,14),(18,8,24,15),(6,15,11,20),(16,15,21,20),(13,26,18,ground),(31,26,37,ground)]:d.ellipse(box,fill=INK)
    elif kind=='rhino':d.polygon([(2,22),(5,9),(8,22)],fill=LIGHT)
    elif kind=='hippo':d.rectangle((3,25,12,28),fill='#bf99a0')
    else:d.ellipse((5,7,12,14),fill=color);d.ellipse((18,7,25,14),fill=color)
    d.point((8,17),fill=LIGHT);d.point((8,18),fill=INK)
   elif kind=='reptile':
    legs([16,32],16);d.polygon([(9,8),(34,8),(47,16),(34,21),(12,20),(1,17),(1,12)],fill=INK);d.polygon([(10,9),(32,10),(44,16),(32,18),(12,18),(2,16),(2,13)],fill=color)
    d.line((2,16,13,16),fill=SHADE);d.point((9,10),fill=LIGHT);d.point((9,11),fill=INK)
    for x in [16,21,26,31]:d.polygon([(x,11),(x+2,7),(x+4,12)],fill='#536d5c')
    if name=='crocodile':
     for x in [3,6,9]:d.point((x,16),fill=LIGHT)
   elif kind=='kangaroo':
    d.polygon([(24,23),(39,37),(31,38),(20,29)],fill=INK);legs([18,25],27);oval((14,17,29,36));oval((8,8,22,22));d.polygon([(12,10),(8,1),(12,2),(16,9),(16,1),(20,2),(19,12)],fill=color)
    d.line((15,23,8,28),fill=INK,width=3);d.point((10,13),fill=LIGHT);d.point((10,14),fill=INK)
   elif kind=='monkey':
    d.arc((20,3,39,25),270,190,fill=INK,width=4);d.arc((21,4,38,24),270,190,fill=color,width=2);legs([14,24],19);oval((12,12,29,26));oval((3,4,20,18));oval((5,7,18,16),'#e2b48b');d.point((8,10),fill=INK);d.line((5,17,2,24),fill=INK,width=3)
   else:
    legs([13,28],19);oval((10,10,35,24));d.line((33,16,39,11 if frame%2 else 18),fill=INK,width=3)
    if name=='lion':oval((1,2,20,22),'#95694f')
    oval((2,7,17,20));d.polygon([(5,9),(4,3),(10,7),(13,3),(15,10)],fill=INK);d.point((6,11),fill=LIGHT);d.point((6,12),fill=INK);d.rectangle((1,15,4,17),fill=SHADE)
    if name in ['wolf','hyena']:d.polygon([(4,12),(0,13),(0,18),(8,19)],fill=color)
    if name in ['tiger','zebra']:
     for x in [16,22,28]:d.line((x,12,x-2,18,x+1,22),fill=INK,width=2)
    if name in ['leopard','jaguar','cheetah','hyena']:
     for x,y in [(17,14),(24,12),(29,17),(19,20),(26,21)]:d.rectangle((x,y,x+1,y+1),fill=SHADE)
    if kind=='horse':d.line((11,10,14,4),fill=INK,width=3)
   im=assets[name+str(frame)];px=im.load();base=tuple(int(color[k:k+2],16) for k in (1,3,5))
   for yy in range(h):
    for xx in range(w):
     if px[xx,yy][:3]==base and px[xx,yy][3]:
      tone=14 if w*.42<xx<w*.72 and h*.32<yy<h*.45 else -14 if yy>ground-8 and xx>w*.3 else 0
      if tone:px[xx,yy]=tuple(max(0,min(255,c+tone)) for c in base)+(255,)
   if frame==3:d.rectangle((w-7,3,w-5,5),fill='#e6af66')
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
