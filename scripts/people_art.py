"""Reproducible native-pixel adaptation of the CC0 thin character base.
The generated design guide informs original clothing/hair; never resample a pose.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import json

ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'docs/assets/licenses/characters/source/base-light-thin.png'
OUT=ROOT/'public/assets/pixel/processed'
DIRECTIONS=['down','up','left','right']
OUTFITS=['worker','gardener','copper','plum','forest']
HAIRS=['midnight','copper','chestnut','golden']
INK=(51,39,35)
PALETTES=[((224,214,180),(66,104,113)),((226,218,186),(112,128,73)),((225,211,175),(158,91,54)),((233,208,171),(123,64,91)),((218,207,163),(65,93,61))]
HAIR_COLORS=[(47,43,44),(146,63,37),(101,65,44),(190,143,64)]
SKINS=[{(242,181,134):(232,170,124),(228,134,118):(199,126,98),(255,218,176):(250,208,158),(152,89,65):(142,84,64)},
       {(242,181,134):(155,103,72),(228,134,118):(122,76,56),(255,218,176):(185,135,88),(152,89,65):(86,56,43)},
       {(242,181,134):(201,150,104),(228,134,118):(163,108,77),(255,218,176):(229,182,124),(152,89,65):(119,76,56)}]
def shade(c,n):return tuple(max(0,min(255,v+n)) for v in c)
def cell(outfit,hair,row,frame,skin=0):
 source=Image.open(BASE).convert('RGBA');bg=source.getpixel((0,0))[:3]
 col=[1,0,1,2,1,1,1,1,1][frame];source_row=[0,3,1,2][row]
 raw=source.crop((col*24,source_row*32,col*24+24,source_row*32+32))
 im=Image.new('RGBA',(24,40));yy=0
 for sy in range(32):
  repeats=2 if sy in [23,24] else 4 if sy in [27,28] else 1
  for _ in range(repeats):
   for x in range(24):
    p=raw.getpixel((x,sy));c=p[:3]
    if c!=bg:im.putpixel((x,yy),(*(INK if c==(97,60,0) else SKINS[skin].get(c,c)),255))
   yy+=1
 assert yy==40
 shirt,cloth=PALETTES[OUTFITS.index(outfit)];mask=im.getchannel('A');back=row==1;side=row>=2
 # Native body mask keeps each walking silhouette, wrists and face intact.
 for y in range(17,40):
  for x in range(24):
   if not mask.getpixel((x,y)):continue
   outer=any(nx<0 or nx>=24 or not mask.getpixel((nx,y)) for nx in [x-1,x+1])
   torso=9<=x<=15 if not side else 10<=x<=15
   if y<23 or y<29 and torso:
    c=shirt
    if outfit in ['worker','gardener'] and torso and (y>=23 or x in [9,15]):c=cloth
    if outfit=='copper' and torso and x!=12:c=cloth
    if outfit=='forest' and x!=12:c=cloth
    if outfit=='plum' and torso:c=cloth
   elif y<30 and not torso:continue # Exposed hands at waist height.
   elif outfit=='plum' and y<35:c=cloth
   elif y<37:c=cloth if outfit in ['worker','gardener'] else (61,64,59)
   else:c=(86,57,40)
   if outer:c=INK
   elif x<12:c=shade(c,12)
   elif x>14:c=shade(c,-16)
   im.putpixel((x,y),(*c,255))
 d=ImageDraw.Draw(im);hc=HAIR_COLORS[HAIRS.index(hair)];dark=shade(hc,-19);light=shade(hc,21)
 # Hair sits on top of the licensed face; four silhouettes remain distinct.
 if back:
  d.polygon([(9,4),(15,4),(17,7),(17,13),(15,16),(9,16),(7,13),(7,7)],fill=INK)
  d.rectangle((9,5,15,14),fill=hc);d.rectangle((8,7,16,12),fill=hc);d.line((9,6,14,6),fill=light)
 else:
  d.polygon([(9,4),(15,4),(17,7),(17,10),(15,9),(13,8),(10,10),(8,10),(7,8)],fill=INK)
  d.rectangle((9,5,15,7),fill=hc);d.rectangle((8,7,16,8),fill=hc);d.line((10,5,14,5),fill=light)
  d.point((11,9),fill=hc);d.point((9,10),fill=dark)
  if side:
   edge=16 if row==2 else 8;d.rectangle((edge,8,edge+1,14),fill=dark)
 if hair=='copper':d.rectangle((8,7,10,9),fill=hc);d.point((9,4),fill=light)
 if hair=='chestnut':
  edge=12 if back else 17 if row==2 else 6 if row==3 else 16
  d.rectangle((edge,13,edge+2,22),fill=INK);d.rectangle((edge+1,14,edge+1,21),fill=hc);d.point((edge+1,16),fill=(166,77,62))
 if hair=='golden':
  for edge in ([7,16] if row<2 else [16] if row==2 else [7]):
   d.rectangle((edge,10,edge+1,22),fill=dark);d.line((edge,11,edge,20),fill=hc)
  if back:d.rectangle((9,14,15,20),fill=hc);d.line((11,15,11,19),fill=light)
 if row==0:
  d.point((10,12),fill=INK);d.point((14,12),fill=INK);d.point((12,15),fill=(163,108,77))
 elif row>=2:d.point((10 if row==2 else 14,12),fill=INK)
 if frame==5 and row==0:d.line((9,12,10,12),fill=INK);d.line((14,12,15,12),fill=INK)
 if frame in [6,7,8]:
  # Grounded crouch / tucked airborne feet / soft landing. Physics owns height.
  amount={6:1,7:3,8:2}[frame];legs=im.crop((0,30,24,40));im.paste((0,0,0,0),(0,30,24,40));im.alpha_composite(legs,(0,30-amount))
 return im
def sheet(outfit,hair,skin=0):
 im=Image.new('RGBA',(216,160))
 for row in range(4):
  for frame in range(9):im.alpha_composite(cell(outfit,hair,row,frame,skin),(frame*24,row*40))
 return im
NPCS=[('gardener','chestnut',0),('copper','chestnut',2),('plum','golden',0),('worker','copper',0),('forest','midnight',1),('forest','golden',0),('copper','midnight',2),('plum','chestnut',1)]
def resident_art(assets):
 for n,(outfit,hair,skin) in enumerate(NPCS):
  for row,direction in enumerate(DIRECTIONS):
   for frame in range(5):assets[f'town-person-{n}-{direction}-{frame}']=cell(outfit,hair,row,frame,skin)
 return {'creator':'diamonddmgirl; CC0 upstream Cabbit; original Simple Life adaptations', 'license':'CC0 base; disclosed AI-assisted hair/clothes','source':'https://opengameart.org/content/24x32-bases-0','cells':[24,40],'variants':8}
def write_people():
 OUT.mkdir(parents=True,exist_ok=True)
 appearance=Image.new('RGBA',(216,160*20))
 for oi,outfit in enumerate(OUTFITS):
  for hi,hair in enumerate(HAIRS):appearance.alpha_composite(sheet(outfit,hair),(0,(oi*4+hi)*160))
 appearance.save(OUT/'appearance.png');sheet('worker','midnight').save(OUT/'boy.png');sheet('gardener','chestnut').save(OUT/'girl.png')
 return {'size':[24,40],'columns':9,'rows':DIRECTIONS,'idle':[0,5],'walk':[1,2,3,4],'jump':[6,7,8],'appearanceSheets':20}
def update_atlas():
 meta=json.loads((OUT/'town.json').read_text());old=Image.open(OUT/'town.png').convert('RGBA');assets={}
 for name,entry in meta['frames'].items():
  r=entry['frame'];assets[name]=old.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
 provenance=resident_art(assets);atlas=Image.new('RGBA',(1024,4096));x=y=height=0;frames={}
 for name,im in assets.items():
  if x+im.width>1024:x=0;y+=height+2;height=0
  atlas.paste(im,(x,y));frames[name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}}
  x+=im.width+2;height=max(height,im.height)
 atlas=atlas.crop((0,0,1024,y+height+2));atlas.save(OUT/'town.png');meta['frames']=frames;meta['meta']['size']={'w':1024,'h':atlas.height};(OUT/'town.json').write_text(json.dumps(meta,indent=2)+'\n')
 manifest=json.loads((OUT/'manifest.json').read_text());manifest['matchedResidents']=provenance;manifest['characterFrames']=write_people();manifest['suppliedCharacters']='Retired; active people use CC0 base adaptations.';(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
if __name__=='__main__':update_atlas()
