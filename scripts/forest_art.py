"""Original integer-pixel forest items, animal, props and shop adaptation.
Authored for Simple Life with Codex assistance; no commercial-game source art.
"""
from PIL import Image, ImageDraw

INK='#34344f'; LIGHT='#efd6a0'; WOOD='#ad7056'; SHADE='#694757'
def add_forest_art(assets):
 def make(name,w,h):
  im=Image.new('RGBA',(w,h));assets[name]=im;return ImageDraw.Draw(im)
 for name,color,shade in [('wild-berry-item','#c96894','#824a79'),('guava-item','#a7c962','#51865c'),('mango-item','#f4be65','#d58550')]:
  d=make(name,16,16)
  if name.startswith('wild'):
   for x,y in [(4,8),(9,9),(7,5)]:
    d.ellipse((x-3,y-3,x+3,y+3),fill=INK);d.ellipse((x-2,y-2,x+2,y+2),fill=color);d.point((x-1,y-1),fill=LIGHT);d.point((x+1,y+2),fill=shade)
  else:
   d.polygon([(5,4),(10,3),(13,6),(12,11),(9,14),(4,12),(2,8)],fill=INK)
   d.polygon([(5,5),(10,4),(12,6),(11,11),(8,13),(4,11),(3,8)],fill=color)
   d.line((5,6,5,9),fill=LIGHT);d.line((9,12,11,9),fill=shade)
  d.line((7,4,8,1),fill=WOOD);d.polygon([(8,2),(12,1),(11,4),(8,4)],fill='#469b7c')
 d=make('wild-hide-item',16,16)
 d.polygon([(2,2),(6,4),(11,2),(14,4),(12,8),(14,13),(9,12),(4,14),(2,11),(4,7)],fill=INK)
 d.polygon([(3,3),(6,5),(11,3),(13,4),(10,8),(12,12),(9,10),(4,12),(3,11),(5,7)],fill=WOOD)
 d.line((6,6,9,8,7,10),fill=LIGHT)
 d=make('wooden-club-item',16,16)
 d.polygon([(2,0),(7,1),(8,5),(6,8),(13,13),(12,15),(9,14),(4,9),(1,6)],fill=INK)
 d.polygon([(3,1),(6,2),(7,5),(5,7),(12,13),(11,14),(4,8),(2,5)],fill=WOOD)
 d.line((3,2,4,6),fill=LIGHT);d.line((6,8,11,13),fill='#e6af66')
 d=make('stash-bag',24,24)
 d.ellipse((2,19,22,23),fill=(36,46,68,75))
 d.polygon([(7,4),(4,1),(10,2),(15,0),(18,4),(15,7),(21,14),(20,20),(17,22),(6,22),(3,18),(4,12),(9,7)],fill=INK)
 d.polygon([(8,5),(7,2),(11,4),(15,2),(16,4),(13,8),(19,14),(18,20),(7,20),(5,17),(6,12),(11,8)],fill='#b78a60')
 d.line((9,7,16,7),fill=LIGHT);d.line((7,13,7,17),fill='#d9b57a');d.ellipse((10,12,15,17),fill='#e6af66');d.point((11,13),fill=LIGHT)
 for i in range(4):
  d=make('boar'+str(i),32,26)
  d.ellipse((3,21,29,25),fill=(36,46,68,65))
  # Two sturdy legs, round flank, bristled spine and a blunt tusked snout.
  for x,step in [(10,1 if i%2 else 0),(22,-1 if i%2 else 0)]:
   d.rectangle((x,17,x+4,23+step),fill=INK);d.rectangle((x+1,18,x+3,21+step),fill=SHADE)
  d.polygon([(7,8),(10,4),(12,6),(16,3),(18,5),(24,5),(28,9),(29,17),(25,21),(11,21),(7,18),(2,18),(0,14),(1,10)],fill=INK)
  d.polygon([(8,9),(11,7),(23,6),(27,10),(27,16),(23,19),(11,19),(8,16),(3,16),(2,13),(3,11)],fill='#88665d')
  d.rectangle((13,8,22,10),fill='#b28b70');d.rectangle((14,16,24,18),fill=SHADE)
  d.polygon([(7,8),(7,3),(12,5),(11,10)],fill=INK);d.point((8,6),fill='#c59580')
  d.rectangle((5,11,7,12),fill=INK);d.point((5,11),fill=LIGHT)
  d.rectangle((1,13,3,15),fill='#b78d7d');d.point((2,13),fill=INK)
  d.polygon([(4,16),(5,13),(6,16)],fill=LIGHT)
  if i==3:d.rectangle((5,11,7,12),fill='#e6af66')
 d=make('forest-log',32,18)
 d.rectangle((3,5,28,15),fill=INK);d.rectangle((3,6,27,13),fill=WOOD)
 d.ellipse((0,4,8,16),fill=SHADE);d.ellipse((1,5,7,14),fill=LIGHT);d.ellipse((3,7,6,12),outline=WOOD)
 d.line((10,7,25,7),fill='#e6af66');d.line((12,11,27,11),fill=SHADE)
 d.line((17,4,21,1),fill=INK);d.line((17,5,21,2),fill=WOOD)
 d=make('shrine-stone',24,28)
 d.polygon([(4,7),(8,1),(17,2),(21,7),(20,22),(23,26),(1,26),(4,22)],fill=INK)
 d.polygon([(5,8),(9,3),(16,4),(19,8),(18,23),(6,23)],fill='#8b9f9a')
 d.line((7,8,7,20),fill='#bfd0b4');d.rectangle((2,24,21,25),fill='#698474')
 d.ellipse((10,10,15,15),outline=LIGHT);d.point((12,8),fill=LIGHT);d.point((17,12),fill=LIGHT)
 for name,item in [('guava-tree','guava-item'),('mango-tree','mango-item')]:
  im=assets['tree0'].copy();d=ImageDraw.Draw(im)
  col='#a7c962' if name.startswith('guava') else '#f4be65'
  for x,y in [(8,16),(21,13),(15,26)]:d.ellipse((x,y,x+3,y+4),fill=INK);d.rectangle((x+1,y+1,x+2,y+3),fill=col);d.point((x+1,y+1),fill=LIGHT)
  assets[name]=im
 # Reuse the original project awning; recolour cloth and display the single club.
 im=assets['seed-stall'].copy();px=im.load()
 for y in range(30):
  for x in range(im.width):
   r,g,b,a=px[x,y]
   if a and g>r: px[x,y]=(110,139,174,a)
 im.alpha_composite(assets['wooden-club-item'],(35,43));assets['outfitter-stall']=im
