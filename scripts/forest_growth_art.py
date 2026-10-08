"""Original undergrowth and jump poses; no pixels from rejected supplied packs."""
from PIL import Image, ImageDraw

def add_grass_art(assets):
 for variant in range(3):
  for bend in range(3):
   im=Image.new('RGBA',(24,24));d=ImageDraw.Draw(im)
   for n in range(16):
    x=3+(n*7+variant*3)%18;bottom=23-(n%3);height=12+(n*5+variant*2)%11;shift=(height//3)*(1 if bend==1 else -1 if bend==2 else 0)
    tip=x+shift+((n%3)-1)*2;top=bottom-height+(3 if bend else 0)
    d.polygon([(x-2,bottom),(x,bottom-height//3),(tip,top),(x+2,bottom)],fill='#303b24')
    d.line([(x-1,bottom-2),(x,bottom-height//3),(tip,top+2)],fill=['#9da55e','#7d8949','#b9be79'][n%3],width=2)
   assets[f'tall-grass-{variant}-{bend}']=im
   for theme,colors in [('dry',['#303b24','#a4ab63','#80894b','#bcc27d']),('snow',['#516967','#b9d3c2','#96b5a5','#dfebe0'])]:
    toned=im.copy();px=toned.load();palette={tuple(bytes.fromhex(a[1:])):tuple(bytes.fromhex(b[1:])) for a,b in zip(['#303b24','#9da55e','#7d8949','#b9be79'],colors)}
    for y in range(24):
     for x in range(24):
      if px[x,y][:3] in palette:px[x,y]=(*palette[px[x,y][:3]],px[x,y][3])
    assets[f'tall-grass-{theme}-{variant}-{bend}']=toned
