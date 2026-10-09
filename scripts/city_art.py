"""Native town additions; licensed LimeZu house adaptations and selected Pipoya PNG cells.
Pipoya archive stays external: supply SIMPLE_LIFE_PIPOYA_ZIP for regeneration.
"""
from PIL import Image, ImageDraw
import io,zipfile,os,colorsys
from pathlib import Path
INK='#493f38';STONE='#817d70';CREAM='#ece0bf';WOOD='#a66e52';LEAF='#71834c';DARK='#465538';LIGHT='#aeb775'
PIPOYA_FILES=['Female 03-1','Female 17-1','Female 19-1','Male 02-1','Male 10-1','Male 12-1','Male 13-1','Male 01-1']
def add_city_art(assets):
 for name in ['house','house-blue','house-green','seed-shop','produce-shop']:
  if name not in assets:continue
  old=assets[name];im=old.copy();pix=im.load();variant=['house','house-blue','house-green','seed-shop','produce-shop'].index(name)
  for y in range(im.height):
   for x in range(im.width):
    r,g,b,a=pix[x,y]
    if not a:continue
    if max(r,g,b)<105:pix[x,y]=(66,57,47,a)
    elif y<30 and max(r,g,b)-min(r,g,b)>28:
     v=max(r,g,b); shades=[(124,74,59),(157,94,71),(185,119,87),(213,150,111),(227,177,134)];pix[x,y]=(*shades[min(4,max(0,(v-85)//36))],a)
    elif y>=30 and r>g and r>b:pix[x,y]=(225,214,180,a) if r>165 else (176,158,126,a)
  d=ImageDraw.Draw(im);d.rectangle((9,31,70,52),fill=CREAM);d.rectangle((9,49,70,53),fill='#c6b592');d.line((9,31,70,31),fill='#6d5a47');d.line((9,32,70,32),fill='#f5e9c9')
  for x in [9,29,50,70]:d.rectangle((x,31,x+1,53),fill='#89694f');d.line((x+1,32,x+1,48),fill='#b29168')
  for x in [14,55]:
   d.rectangle((x-1,34,x+11,45),fill=INK);d.rectangle((x,35,x+10,44),fill='#b19d7b');d.rectangle((x+1,36,x+9,42),fill='#6e8580');d.line((x+2,36,x+3,41),fill='#c3d4bf');d.line((x+5,35,x+5,43),fill='#e7d9af');d.line((x,40,x+10,40),fill='#e7d9af');d.rectangle((x-2,45,x+12,47),fill='#a97952');d.line((x-1,45,x+11,45),fill='#d0aa77')
   for xx in range(x-1,x+12,3):d.rectangle((xx,43,xx+2,44),fill=LEAF);d.point((xx+1,43),fill='#d5ae74' if variant%2 else '#d89b88')
  d.rectangle((33,38,46,53),fill=INK);d.pieslice((33,31,46,44),180,360,fill=INK);d.rectangle((35,38,44,53),fill=WOOD);d.pieslice((35,33,44,42),180,360,fill=WOOD);d.rectangle((37,36,42,40),fill='#8fa29a');d.rectangle((37,43,42,49),outline='#795441');d.rectangle((42,42,43,43),fill='#ddbc79');d.line((35,51,44,51),fill='#d1aa78')
  # Roofline ivy and a small side trellis, clustered leaves rather than noise.
  for xx,yy in [(12,29),(16,30),(20,29),(23,30),(62,30),(66,32),(68,35),(67,39),(70,42)]:
   d.rectangle((xx,yy,xx+3,yy+2),fill=DARK);d.rectangle((xx,yy,xx+2,yy+1),fill=LEAF);d.point((xx,yy),fill=LIGHT)
  im.putalpha(old.getchannel('A'));assets[name]=im
 if 'shed' in assets:
  im=assets['shed'].copy()
  for y in range(im.height):
   for x in range(im.width):
    r,g,b,a=im.getpixel((x,y))
    if not a:continue
    if max(r,g,b)<105:c=(66,57,47)
    elif y<35 and g>r:c=[(124,74,59),(157,94,71),(185,119,87),(213,150,111),(227,177,134)][min(4,max(0,(max(r,g,b)-85)//36))]
    elif y>=35 and r>g and r>b:c=(225,214,180) if r>165 else (176,158,126)
    else:c=(r,g,b)
    im.putpixel((x,y),(*c,a))
  assets['shed']=im
 for frame in range(2):
  im=Image.new('RGBA',(80,88));d=ImageDraw.Draw(im)
  d.ellipse((1,36,78,86),fill=INK);d.ellipse((2,32,77,81),fill=STONE);d.ellipse((4,32,75,75),fill='#c4c2b2');d.ellipse((7,35,72,72),fill='#668b93');d.ellipse((9,36,70,69),fill='#91adb0');d.arc((14,40,65,66),0,180,fill='#c7d5c9',width=2);d.arc((20,43+frame,59,62),180,360,fill='#aebfc1',width=2)
  for x in range(8,74,10):d.line((x,35,x-2,38),fill='#7f827a',width=1);d.line((x,71,x+2,76),fill='#817d72')
  d.ellipse((24,43,56,64),fill='#73949a');d.ellipse((25,42,55,58),fill='#cbd0c9');d.rectangle((30,27,49,51),fill='#a7b1b0');d.rectangle((31,29,34,50),fill='#d8ded3');d.rectangle((45,29,48,50),fill='#869998');d.ellipse((21,17,58,32),fill=STONE);d.ellipse((21,15,58,28),fill='#d5d9ce');d.ellipse((25,16,54,24),fill='#9dbabc');d.rectangle((36,5,43,20),fill='#becdca');d.ellipse((32,1,47,10),fill='#e5e9da');d.ellipse((36,0,43,5),fill='#b2c9c7')
  for x in [25,30,48,54]:d.line((x,26,x,47+(x%3)+frame*2),fill='#d6e4dc',width=1)
  for x in [24,28,35,42,49,55]:d.rectangle((x,52+(x%3)+frame,x+2,54+(x%3)+frame),fill='#e3e8d8')
  assets['city-fountain'+str(frame)]=im
 im=Image.new('RGBA',(20,48));d=ImageDraw.Draw(im);d.ellipse((4,40,16,47),fill=INK);d.rectangle((6,39,14,44),fill=STONE);d.rectangle((8,15,11,41),fill=INK);d.line((9,17,9,40),fill='#ae8058');d.rectangle((4,7,15,17),fill=INK);d.rectangle((6,8,13,15),fill='#d9a65e');d.rectangle((8,8,11,13),fill='#f8e5a5');d.polygon([(2,7),(9,0),(17,7)],fill=INK);d.polygon([(5,6),(9,2),(14,6)],fill='#9d684c');d.rectangle((6,17,13,19),fill='#655345');assets['city-lamp']=im
 im=Image.new('RGBA',(64,52));d=ImageDraw.Draw(im)
 for x in [1,46]:
  d.rectangle((x,18,x+16,40),fill=INK)
  for y in range(19,36,4):d.rectangle((x+1,y,x+15,y+2),fill=WOOD);d.line((x+2,y,x+14,y),fill='#d9ab80')
  d.rectangle((x-1,16,x+1,44),fill='#b8b5a3');d.rectangle((x+16,16,x+18,44),fill='#b8b5a3');d.rectangle((x,44,x+2,49),fill=STONE);d.rectangle((x+15,44,x+17,49),fill=STONE)
 d.rectangle((21,14,42,47),fill=INK);d.rectangle((22,15,41,44),fill=WOOD);d.rectangle((24,17,39,39),fill='#6a6048');d.line((23,43,40,43),fill='#d5a679');
 for x,y in [(23,12),(28,6),(34,9),(37,13),(30,16),(25,21),(36,21)]:
  d.ellipse((x-2,y-4,x+5,y+7),fill=DARK);d.ellipse((x-1,y-3,x+4,y+4),fill=LEAF);d.line((x,y-2,x+2,y+2),fill=LIGHT)
 for x,y in [(27,8),(34,11),(30,20)]:d.rectangle((x,y,x+2,y+2),fill='#beab9a');d.point((x+1,y),fill='#d8cfb4')
 assets['city-bench-garden']=im
 im=Image.new('RGBA',(20,32));d=ImageDraw.Draw(im);d.polygon([(3,21),(17,21),(15,30),(5,30)],fill=INK);d.polygon([(4,22),(16,22),(14,29),(6,29)],fill=WOOD);d.rectangle((2,20,18,23),fill='#bf8864');d.line((10,8,10,20),fill=DARK);d.ellipse((3,11,9,16),fill=LEAF);d.ellipse((11,13,17,18),fill=DARK);d.ellipse((4,2,16,13),fill='#c8a457');d.ellipse((7,5,13,11),fill='#705143');d.rectangle((8,3,11,4),fill='#e2c87c');assets['city-flowerpot']=im
 im=Image.new('RGBA',(64,48));d=ImageDraw.Draw(im);d.polygon([(1,37),(32,0),(62,37)],fill=INK);d.polygon([(4,35),(32,3),(59,35)],fill='#a57468');d.polygon([(32,3),(34,35),(59,35)],fill='#875d56');d.polygon([(20,35),(32,13),(44,35)],fill='#4e493c');d.line((32,13,32,35),fill='#c69c77');d.line((2,40,61,40),fill='#d6b98c');d.rectangle((0,36,3,46),fill=INK);d.rectangle((60,36,63,46),fill=INK);assets['city-tent']=im
 path=Path(os.environ.get('SIMPLE_LIFE_PIPOYA_ZIP','/tmp/pipoya-characters.zip'));z=zipfile.ZipFile(path)
 for i,file in enumerate(PIPOYA_FILES):
  directory='Female' if file.startswith('Female') else 'Male';sheet=Image.open(io.BytesIO(z.read(f'PIPOYA FREE RPG Character Sprites 32x32/{directory}/{file}.png'))).convert('RGBA')
  # Retain native contours/faces; only restrain saturation to the town palette.
  for y in range(sheet.height):
   for x in range(sheet.width):
    r,g,b,a=sheet.getpixel((x,y))
    if not a:continue
    h,s,v=colorsys.rgb_to_hsv(r/255,g/255,b/255);rr,gg,bb=colorsys.hsv_to_rgb(h,s*.72,v*.96);sheet.putpixel((x,y),(round(rr*255),round(gg*255),round(bb*255),a))
  for row,direction in enumerate(['down','left','right','up']):
   for f in range(3):assets[f'resident-{i}-{direction}-{f}']=sheet.crop((f*32,row*32,f*32+32,row*32+32))
 from large_houses_art import add_large_houses_art
 add_large_houses_art(assets)
 return {'creator':'Pipoya','source':'https://pipoya.itch.io/pipoya-free-rpg-character-sprites-32x32','files':[f+'.png' for f in PIPOYA_FILES],'directions':['down','left','right','up'],'cells':[32,32],'modifications':'Selected human PNG cells repacked into game atlas; saturation reduced 28%, brightness 4%.','license':'Custom: commercial/personal game use and editing allowed; standalone redistribution/resale forbidden.'}
