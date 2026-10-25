"""Original code-authored utility/seed pixels; no reference-image pixel extraction."""
from PIL import Image,ImageDraw
from pathlib import Path
CROPS=('tomato','strawberry','carrot','corn','chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato')
def add_garden_tools_art(assets):
 axe=Image.new('RGBA',(16,16));d=ImageDraw.Draw(axe)
 d.line((3,2,12,13),fill='#3b3b2e',width=3);d.line((3,2,12,13),fill='#a87546');d.line((4,2,12,12),fill='#d2b17b')
 d.polygon([(8,5),(12,3),(15,4),(15,9),(11,11),(7,8)],fill='#38423b');d.polygon([(9,5),(12,4),(14,5),(14,8),(11,9),(8,7)],fill='#a3aca0');d.line((14,5,14,8),fill='#e0dfbd');d.rectangle((8,5,10,7),fill='#697a70');assets['axe-item']=axe
 hand=Image.new('RGBA',(16,16));d=ImageDraw.Draw(hand)
 d.polygon([(5,14),(4,10),(1,8),(1,5),(3,4),(5,7),(5,2),(7,1),(9,2),(9,6),(11,3),(13,4),(13,10),(10,14)],fill='#594a35');d.polygon([(6,13),(5,9),(2,7),(2,5),(3,5),(6,8),(6,2),(8,2),(8,8),(11,5),(12,5),(12,10),(9,13)],fill='#d9ac79');d.line((6,10,9,12),fill='#b98359');assets['hand-item']=hand
 source=Path('output/art/pixel-snapper-wood-v1/source/wood-bundle.png')
 if source.exists():
  original=Image.open(source).convert('RGBA');box=original.getbbox();bundle=original.crop(box)
  bundle.thumbnail((15,12),Image.Resampling.NEAREST);wood=Image.new('RGBA',(16,16));wood.alpha_composite(bundle,((16-bundle.width)//2,16-bundle.height))
 else:
  wood=Image.new('RGBA',(16,16));d=ImageDraw.Draw(wood)
  for x,y in [(2,8),(6,4),(3,10)]:
   d.polygon([(x,y),(x+7,y-4),(x+11,y),(x+4,y+5)],fill='#57422e');d.polygon([(x+1,y),(x+7,y-3),(x+9,y),(x+4,y+3)],fill='#9b6740');d.line((x+2,y,x+7,y-2),fill='#bf8b57');d.rectangle((x+2,y+1,x+5,y+3),fill='#d0ad76');d.point((x+4,y+2),fill='#92653e')
 assets['wood-item']=wood
 grass=Image.new('RGBA',(16,16));d=ImageDraw.Draw(grass)
 d.polygon([(4,14),(2,6),(6,9),(5,1),(8,6),(11,2),(10,9),(14,5),(12,14)],fill='#3b482d');d.line((5,12,3,7),fill='#98aa58',width=2);d.line((7,12,6,3),fill='#b3be70',width=2);d.line((9,12,11,4),fill='#8f9e50',width=2);d.line((11,12,13,7),fill='#adbc65');d.rectangle((4,12,11,14),fill='#7b623e');d.line((5,12,10,12),fill='#c7ad6d');assets['grass-item']=grass
 for c in CROPS:
  fruit=assets[c+'-item'];symbol=fruit.copy();bbox=symbol.getbbox();symbol=symbol.crop(bbox);symbol.thumbnail((10,10),Image.Resampling.NEAREST)
  seed=Image.new('RGBA',(16,16));d=ImageDraw.Draw(seed)
  d.rectangle((1,0,14,15),fill='#3e4730');d.rectangle((2,1,13,14),fill='#e4d49d');d.line((2,1,13,1),fill='#fff1c3');d.rectangle((2,2,13,3),fill='#718644');d.line((2,14,13,14),fill='#bca36a')
  seed.alpha_composite(symbol,((16-symbol.width)//2,5+(10-symbol.height)//2));assets[c+'-seed-item']=seed
  # Seeds belong on the soil; inventory packets must not become giant field signs.
  plant=Image.new('RGBA',(24,32));d=ImageDraw.Draw(plant)
  # Draw only the seeds; shared bed art supplies the surrounding earth.
  for x,y in [(9,27),(13,26),(16,28)]:
   d.line((x,y,x+1,y),fill='#d9ba7c');d.point((x,y-1),fill='#f0d79a')
  assets[c+'-seed']=plant
