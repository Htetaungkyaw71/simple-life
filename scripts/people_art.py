"""Dress CraftPix native poses without deforming limbs to invent animation.
64px source poses are consistently retargeted to adult proportions at 2x world scale. Hair/clothes are
original project additions; the complete authored idle/run/walk cycles remain.
"""
from pathlib import Path
from functools import lru_cache
from PIL import Image, ImageDraw
import json
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/assets/licenses/characters-craftpix/source'
OUT=ROOT/'public/assets/pixel/processed'
DIRECTIONS=['down','up','left','right'];SOURCE_ROWS=[0,3,2,1]
OUTFITS=['worker','gardener','copper','plum','forest'];HAIRS=['midnight','copper','chestnut','golden']
WIDTH,HEIGHT,COLUMNS=24,36,24
WORLD_SCALE=2
BODY_STRETCH=1.8
def body_y(y):return HEIGHT-1-round((44-y)*BODY_STRETCH)
COUNTS={'Idle':12,'Run':8,'Walk':6}
PALETTES={
 'worker':['#263d3b','#365653','#4e7370','#74958a'],
 'gardener':['#36432d','#526040','#788357','#a3a96f'],
 'copper':['#4f302c','#754330','#a36841','#c79761'],
 'plum':['#452c3d','#6d3e53','#995968','#c0828a'],
 'forest':['#293a31','#3f5541','#65765b','#8d9971'],
}
HAIR_COLORS={
 'midnight':['#242324','#393033','#55423b'],
 'copper':['#4b2927','#85412c','#bd683c'],
 'chestnut':['#382925','#694432','#956242'],
 'golden':['#65442c','#a47740','#d9b064'],
 'silver':['#4e4640','#8e8679','#b9b3a0'],
}
IVORY=['#665544','#978366','#c7b695','#eee0b5']
TROUSERS=['#242b2b','#384640','#536358','#7b826a']
BOOTS=['#33251f','#59402d','#87613e','#ac8050']
def rgba(color):return tuple(bytes.fromhex(color[1:]))+(255,)
@lru_cache(maxsize=None)
def source(sex,action,part):
 im=Image.open(SOURCE/sex/f'Unarmed_{action}{part}.png').convert('RGBA')
 assert im.size==(COUNTS[action]*64,256)
 return im

def prepared_body(sex,action,row,frame):
 if action=='Idle' and row==1:frame%=4
 box=(frame*64,SOURCE_ROWS[row]*64,(frame+1)*64,(SOURCE_ROWS[row]+1)*64)
 return source(sex,action,'2_body').crop(box),source(sex,action,'3_head').crop(box)

def native_pose(outfit,hair,row,action,frame,sex=None,extra=None):
 sex=sex or ('female' if outfit in ['gardener','plum'] else 'male')
 body,original_head=prepared_body(sex,action,row,frame)
 bx0,by0,bx1,by1=body.getbbox();hx0,hy0,hx1,hy1=original_head.getbbox();cx=(hx0+hx1-1)//2
 colors=sorted({p for p in body.get_flattened_data() if p[3]},key=lambda p:sum(p[:3]))
 shade={c:min(3,round(i*3/(len(colors)-1))) for i,c in enumerate(colors)}
 torso=hy1-3;waist=torso+5
 im=Image.new('RGBA',(WIDTH,HEIGHT));d=ImageDraw.Draw(im)
 # One fixed row mapping for every authored pose: lengthen torso/legs without
 # moving one limb independently, inventing poses or introducing waist seams.
 for y in range(by0,by1):
  for x in range(bx0,bx1):
   old=body.getpixel((x,y))
   if not old[3]:continue
   rank=shade[old];side=abs(x-cx)
   hand=side>=4 and y>=torso+4 and y<waist+3
   if hand:color=old
   elif y>=by1-2:color=rgba(BOOTS[rank])
   elif y>=waist:color=rgba(TROUSERS[rank])
   elif outfit in ['worker','gardener']:
    color=rgba((PALETTES[outfit] if side<=2 and y>=torso+2 else IVORY)[rank])
   elif outfit=='copper':color=rgba((PALETTES[outfit] if side<=2 else IVORY)[rank])
   else:color=rgba(PALETTES[outfit][rank])
   x-=20;y0=body_y(y);y1=body_y(y+1)-1
   if 0<=x<WIDTH and y1>=0:d.line((x,max(0,y0),x,min(HEIGHT-1,y1)),fill=color)
 # Readable collar/straps/belt; all attachments follow the supplied torso bob.
 c=cx-20;t=body_y(torso);w=body_y(waist)
 if row in [0,1]:
  if outfit in ['worker','gardener']:
   d.line((c-2,t+2,c-2,t+6),fill=PALETTES[outfit][2]);d.line((c+2,t+2,c+2,t+6),fill=PALETTES[outfit][2])
   if row==0:d.point((c-2,t+5),fill='#d4b77b');d.point((c+2,t+5),fill='#d4b77b')
  elif outfit in ['copper','forest']:
   d.line((c,t+3,c,w-1),fill=IVORY[2] if outfit=='copper' else PALETTES[outfit][0])
   if row==0:d.point((c+1,w-2),fill='#c9a675')
 if outfit=='plum':
  for y in range(w-2,min(HEIGHT-4,w+5)):
   spread=3+(y-w>=2);d.line((c-spread,y,c+spread,y),fill=PALETTES[outfit][1])
   d.point((c-spread+1,y),fill=PALETTES[outfit][2])
  d.line((c-3,w-1,c+3,w-1),fill=PALETTES[outfit][0])
 # A smaller original pixel head: warm skin, small dark eyes and a visible neck,
 # replacing the base's giant irises and spherical six-row hair cap.
 top=t-8;left=c-4;hp=HAIR_COLORS[hair]
 skin=['#805142','#bb8060','#dfa578','#f1c08c'] if sex=='male' else ['#885449','#bd846b','#e6ad88','#f3c5a0']
 if row==1:
  face_rows=[(2,6),(1,7),(0,8),(0,8),(0,8),(0,8),(1,7),(2,6),(3,5)]
  for y,(l,r) in enumerate(face_rows):
   for x in range(l,r+1):d.point((left+x,top+y),fill=hp[0 if x in [l,r] else 2 if x<4 and y<4 else 1])
  d.line((c-1,top+9,c+1,top+9),fill=skin[1])
 else:
  # Front/side silhouette; front eyes are separated by a two-pixel nose bridge.
  for y,(l,r) in enumerate([(3,6),(1,7),(0,8),(0,8),(0,8),(0,8),(1,7),(1,7),(2,6),(3,5)]):
   for x in range(l,r+1):
    face=y>=4
    color=skin[1 if x in [l,r] else 3 if x<5 else 2] if face else hp[0 if x in [l,r] else 1]
    d.point((left+x,top+y),fill=color)
  if row==0:
   d.point((left+2,top+6),fill='#352c2b');d.point((left+6,top+6),fill='#352c2b')
   d.point((left+4,top+7),fill=skin[1]);d.line((left+3,top+8,left+5,top+8),fill=skin[2])
   for x,y in [(1,4),(2,4),(3,4),(6,4),(0,5),(8,5)]:d.point((left+x,top+y),fill=hp[0 if x in [0,8] else 1])
  else:
   rear=range(5,9) if row==2 else range(0,4)
   for y in range(4,8):
    for x in rear:d.point((left+x,top+y),fill=hp[0 if x in [0,8] else 1])
   eye=1 if row==2 else 7;d.point((left+eye,top+6),fill='#352c2b');d.point((left+eye,top+7),fill=skin[2])
  # Broken highlight and asymmetrical fringe give hair its own silhouette.
  sweep=range(2,6) if hair in ['midnight','chestnut'] else range(4,8)
  for x in sweep:d.point((left+x,top+2),fill=hp[2])
  d.point((left+5,top-1),fill=hp[0]);d.point((left+6,top),fill=hp[1]);d.point((left+2,top+3),fill=hp[1]);d.point((left+4,top+3),fill=hp[2])
  if hair=='midnight':d.point((left+1,top+1),fill=hp[0]);d.point((left+7,top+3),fill=hp[0])
  elif hair=='copper':d.line((left+5,top+3,left+7,top+4),fill=hp[1])
 if hair in ['chestnut','golden','silver']:
  rear=c+4 if row in [0,2] else c-4 if row==3 else c+2
  for y in range(top+5,min(t+8,HEIGHT-5)):
   d.point((rear,y),fill=hp[0]);d.point((rear+(1 if row!=3 else -1),y),fill=hp[2 if y%3==0 else 1])
  if hair=='chestnut':d.line((rear,t+3,rear+1,t+3),fill='#b88770')
  if hair=='golden' and row==0:
   for y in range(top+5,t+4):d.point((c-4,y),fill=hp[1])
 if extra=='hat':
  d.line((left-2,top+3,left+10,top+3),fill='#735335');d.rectangle((left+1,top,left+7,top+2),fill='#caa56b');d.line((left+1,top+2,left+7,top+2),fill='#574533')
 return im

def cell(outfit,hair,row,frame,sex=None,extra=None,action=None):
 if action is None:
  if frame<12:action='Idle';n=frame
  elif frame<20:action='Run';n=frame-12
  else:action='Run';n={20:1,21:3,22:5,23:0}[frame]
 else:n=frame
 return native_pose(outfit,hair,row,action,n,sex,extra)

def sheet(outfit,hair):
 im=Image.new('RGBA',(WIDTH*COLUMNS,HEIGHT*4))
 for row in range(4):
  for f in range(COLUMNS):im.alpha_composite(cell(outfit,hair,row,f),(f*WIDTH,row*HEIGHT))
 return im
NPCS=[('gardener','chestnut','female',None),('copper','chestnut','female',None),('plum','midnight','female',None),('worker','copper','male',None),('forest','midnight','male','hat'),('worker','midnight','male',None),('forest','golden','female',None),('plum','silver','female',None)]
def resident_art(assets):
 for name in list(assets):
  if name.startswith('town-person-'):del assets[name]
 for n,(outfit,hair,sex,extra) in enumerate(NPCS):
  for row,direction in enumerate(DIRECTIONS):
   for f in range(7):assets[f'town-person-{n}-{direction}-{f}']=cell(outfit,hair,row,0 if f==0 else f-1,sex,extra,'Idle' if f==0 else 'Walk')
 return {'creator':'CraftPix; Simple Life clothing/hair adaptation','license':'CraftPix Freebie Products section 2; project additions AI-assisted','source':'docs/assets/licenses/characters-craftpix/SOURCE_RECORD.md','cells':[WIDTH,HEIGHT],'variants':8,'walkFrames':6}

def write_people():
 OUT.mkdir(parents=True,exist_ok=True)
 # 1,920 frames remain below 4096px in both texture dimensions.
 appearance=Image.new('RGBA',(WIDTH*40,HEIGHT*48));index=0
 for outfit in OUTFITS:
  for hair in HAIRS:
   for row in range(4):
    for f in range(COLUMNS):
     appearance.alpha_composite(cell(outfit,hair,row,f),((index%40)*WIDTH,(index//40)*HEIGHT));index+=1
 appearance.save(OUT/'appearance.png');sheet('worker','midnight').save(OUT/'boy.png');sheet('gardener','chestnut').save(OUT/'girl.png')
 write_grips()
 return {'size':[WIDTH,HEIGHT],'columns':COLUMNS,'rows':DIRECTIONS,'idle':list(range(12)),'run':list(range(12,20)),'walk':list(range(6)),'jump':[20,21,22],'appearanceSheets':20,'source':'CraftPix four-direction unarmed bases; original clothing/hair adaptation','sourceRecord':'docs/assets/licenses/characters-craftpix/SOURCE_RECORD.md','sourceFrame':[64,64],'bodyRowStretch':BODY_STRETCH,'worldIntegerScale':WORLD_SCALE}

def write_grips():
 grips={}
 for row,dir in enumerate(DIRECTIONS):
  poses=[]
  for f in range(COLUMNS):
   action='Idle' if f<12 else 'Run';n=(f%4 if row==1 else f) if f<12 else f-12 if f<20 else {20:1,21:3,22:5,23:0}[f]
   box=(n*64,SOURCE_ROWS[row]*64,(n+1)*64,(SOURCE_ROWS[row]+1)*64)
   body=source('male',action,'2_body').crop(box);head=source('male',action,'3_head').crop(box)
   h=head.getbbox();cx=(h[0]+h[2]-1)//2;top=h[3]-3;side=-1 if dir in ['up','left'] else 1
   colors=sorted({p for p in body.get_flattened_data() if p[3]},key=lambda p:sum(p[:3]));light=set(colors[3:])
   candidates=[(x,y) for y in range(top+1,top+7) for x in range(64) if body.getpixel((x,y)) in light and (x-cx)*side>=1]
   if candidates:
    extreme=max(x*side for x,y in candidates);edge=[(x,y) for x,y in candidates if x*side>=extreme-1];x=round(sum(x for x,y in edge)/len(edge));y=round(sum(y for x,y in edge)/len(edge))
   else:x=cx+side*3;y=top+5
   poses.append([(x-32)*WORLD_SCALE+WORLD_SCALE//2,(body_y(y+1)-1-HEIGHT)*WORLD_SCALE+WORLD_SCALE//2])
  grips[dir]=poses
 (ROOT/'src/data/peopleHands.js').write_text('// Generated from consistently retargeted CraftPix body poses by scripts/people_art.py.\nexport const PEOPLE_HANDS='+json.dumps(grips,separators=(',',':'))+';\n')

def update_atlas():
 meta=json.loads((OUT/'town.json').read_text());old=Image.open(OUT/'town.png').convert('RGBA');assets={}
 for name,entry in meta['frames'].items():
  r=entry['frame'];assets[name]=old.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
 provenance=resident_art(assets);atlas=Image.new('RGBA',(1024,4096));x=y=height=0;frames={}
 for name,im in assets.items():
  if x+im.width>1024:x=0;y+=height+2;height=0
  atlas.paste(im,(x,y));frames[name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}}
  x+=im.width+2;height=max(height,im.height)
 assert y+height+2<=4096
 atlas=atlas.crop((0,0,1024,y+height+2));atlas.save(OUT/'town.png');meta['frames']=frames;meta['meta']['size']={'w':1024,'h':atlas.height};(OUT/'town.json').write_text(json.dumps(meta,indent=2)+'\n')
 manifest=json.loads((OUT/'manifest.json').read_text());manifest['matchedResidents']=provenance;manifest['characterFrames']=write_people();manifest['suppliedCharacters']='Active people use adapted CraftPix unarmed bases. Retired generated sheets remain provenance only.';(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
if __name__=='__main__':update_atlas()
