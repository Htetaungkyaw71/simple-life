"""Eight independently authored replacement cells; no ToffeeCraft pixels read."""
from PIL import Image, ImageDraw
import random
SIZES={'env-pine-jade':(52,114),'env-pine-olive':(52,114),'env-pine-snow':(60,114),'env-fir':(92,120),'env-agave':(94,82),'env-dry-plant':(92,70),'env-boulder':(104,72),'env-ice':(122,104)}
def original_environment():
 result={}
 for n,(w,h) in SIZES.items():
  im=Image.new('RGBA',(w,h));d=ImageDraw.Draw(im);cx=w//2;rng=random.Random(n)
  if 'pine' in n or n=='env-fir':
   snow=n.endswith('snow');pal=['#354b32','#5b713d','#7e914d','#a2ad64'];
   if snow:pal=['#516967','#96b5a5','#b9d3c2','#dfebe0']
   d.rectangle((cx-3,h-32,cx+3,h-1),fill='#493d36');d.rectangle((cx-1,h-30,cx+2,h-3),fill='#a66b45');d.line((cx,h-28,cx,h-4),fill='#c59158')
   for k in range(7):
    y=4+k*(h-28)//9;spread=min(cx-3,5+k*(cx-6)//6);bottom=y+18+k
    pts=[(cx,y),(cx+3,y+5),(cx+spread-2,bottom-6),(cx+spread,bottom),(cx+6,bottom-2),(cx,bottom+3),(cx-8,bottom),(cx-spread,bottom-2),(cx-spread+4,bottom-8)]
    d.polygon(pts,fill=pal[0]);d.polygon([(cx,y+2),(cx+spread-5,bottom-8),(cx+spread-3,bottom-4),(cx+1,bottom-2),(cx-spread+3,bottom-5)],fill=pal[1]);
    for j in range(4):
     xx=cx-spread+5+j*max(1,(2*spread-9)//4);yy=bottom-7+(j+k)%3;d.rectangle((xx,yy,xx+3,yy+1),fill=pal[2+(j+k)%2])
  elif 'plant' in n or 'agave' in n:
   d.rectangle((cx-2,h-13,cx+2,h-3),fill='#93694c')
   for k in range(13):
    tx=8+(k*17)%max(1,w-16);ty=8+(k*9)%max(1,h-24);d.polygon([(cx-2,h-5),(tx-2,ty+3),(tx,ty),(tx+2,ty+5),(cx+2,h-5)],fill=['#354b32','#7e914d','#a2ad64'][k%3]);d.line((cx,h-6,tx,ty+5),fill='#bcc477',width=1)
  elif n=='env-boulder':
   d.polygon([(7,h-10),(2,38),(19,16),(44,6),(79,10),(99,31),(w-5,h-15),(73,h-3),(27,h-2)],fill='#493d36');d.polygon([(6,36),(21,18),(45,9),(78,13),(93,30),(78,48),(40,48)],fill='#a2a18b');d.polygon([(7,39),(39,51),(76,51),(90,33),(97,38),(93,57),(70,66),(26,65)],fill='#747868');d.line((19,27,43,18,72,20),fill='#d5d3b6',width=2)
   for i in range(18):
    x=rng.randrange(18,w-20);y=rng.randrange(24,h-16);d.rectangle((x,y,x+3,y+1),fill='#8e927d')
  else:
   for k in range(5):
    x=10+k*22;top=13+(k*17)%25;d.polygon([(x,h-10),(x-5,top+24),(x+6,top),(x+18,top+22),(x+18,h-14)],fill='#516967');d.polygon([(x-2,top+25),(x+6,top+3),(x+11,top+23),(x+6,h-14),(x+1,h-13)],fill='#b9d3c2');d.polygon([(x+8,top+12),(x+16,top+25),(x+15,h-17),(x+8,h-14)],fill='#96b5a5');d.line((x+4,top+15,x+4,h-23),fill='#dfebe0',width=2)
  result[n]=im
 return result
