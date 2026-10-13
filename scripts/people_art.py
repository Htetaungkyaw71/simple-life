"""Dress CraftPix native poses without deforming limbs to invent animation.
64px source cells use a fixed crop and integer 3x world scale. Hair/clothes are
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
WIDTH,HEIGHT,COLUMNS=24,26,24
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

def native_pose(outfit,hair,row,action,frame,sex=None,extra=None):
 sex=sex or ('female' if outfit in ['gardener','plum'] else 'male')
 # Back-facing Idle supplies four poses; its remaining sheet columns are blank.
 if action=='Idle' and row==1:frame%=4
 box=(frame*64,SOURCE_ROWS[row]*64,(frame+1)*64,(SOURCE_ROWS[row]+1)*64)
 body=source(sex,action,'2_body').crop(box);head=source(sex,action,'3_head').crop(box)
 bx0,by0,bx1,by1=body.getbbox();hx0,hy0,hx1,hy1=head.getbbox();cx=(hx0+hx1-1)//2
 # Shade ramps follow the source; every opposing arm/foot stays in place.
 colors=sorted({p for p in body.get_flattened_data() if p[3]},key=lambda p:sum(p[:3]))
 shade={c:min(3,round(i*3/(len(colors)-1))) for i,c in enumerate(colors)}
 torso_top=hy1-3;waist=torso_top+5
 for y in range(by0,by1):
  for x in range(bx0,bx1):
   old=body.getpixel((x,y))
   if not old[3]:continue
   edge=shade[old]==0;hand=abs(x-cx)>3 and y>=torso_top+3 and y<waist+3
   if hand and not edge:continue
   if y>=by1-3:palette=BOOTS
   elif y>=waist:palette=PALETTES['plum'] if outfit=='plum' else TROUSERS
   elif outfit in ['worker','gardener','copper']:palette=PALETTES[outfit] if abs(x-cx)<=2 else IVORY
   else:palette=PALETTES[outfit]
   body.putpixel((x,y),rgba(palette[shade[old]]))
 if outfit=='plum':
  hem=ImageDraw.Draw(body)
  for y in range(waist,waist+2):
   hem.line((cx-3,y,cx+3,y),fill=PALETTES['plum'][1 if y==waist else 0])
 # Hair rides the real head pose, leaving the eyes, face and neck intact.
 hp=HAIR_COLORS[hair];d=ImageDraw.Draw(head)
 for y in range(hy0,hy1):
  for x in range(hx0,hx1):
   old=head.getpixel((x,y))
   is_hair=y<hy0+6 or row==1 and y<hy1-1 or row==2 and x>=hx1-4 and y<hy1-1 or row==3 and x<hx0+4 and y<hy1-1
   if old[3] and is_hair:head.putpixel((x,y),rgba(hp[0 if y==hy0 or x in [hx0,hx1-1] else 2 if y<hy0+3 and abs(x-cx)<3 else 1]))
 back=Image.new('RGBA',(64,64));bd=ImageDraw.Draw(back)
 if hair in ['chestnut','golden','silver']:
  rear_x=hx1-2 if row in [0,2] else hx0 if row==3 else cx
  strands=[rear_x] if hair!='golden' or row!=0 else [hx0,hx1-2]
  for sx in strands:
   for y in range(hy0+7,hy0+7+(11 if hair=='chestnut' else 9)):
    bd.rectangle((sx,y,sx+1,y),fill=rgba(hp[1 if y%2 else 0]));bd.point((sx,y),fill=rgba(hp[2]))
  if hair=='chestnut':bd.line((rear_x-1,hy0+12,rear_x+2,hy0+12),fill='#967354')
 if row==0:
  fringe=[(cx-3,hy0+6),(cx-2,hy0+6),(cx+2,hy0+6)] if hair=='midnight' else [(cx-3,hy0+6),(cx-2,hy0+7),(cx+3,hy0+6)]
  for x,y in fringe:
   if head.getpixel((x,y))[3]:d.point((x,y),fill=rgba(hp[1]))
 if extra=='hat':
  d.rectangle((hx0-2,hy0+3,hx1+1,hy0+4),fill='#6c4e32');d.rectangle((hx0+1,hy0,hx1-2,hy0+2),fill='#c8a065');d.line((hx0+1,hy0+2,hx1-2,hy0+2),fill='#594534')
 im=back;im.alpha_composite(body);im.alpha_composite(head)
 # Fixed feet/head origin, never center each frame's ink independently.
 return im.crop((20,18,44,44))

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
 return {'size':[WIDTH,HEIGHT],'columns':COLUMNS,'rows':DIRECTIONS,'idle':list(range(12)),'run':list(range(12,20)),'walk':list(range(6)),'jump':[20,21,22],'appearanceSheets':20,'source':'CraftPix four-direction unarmed bases; original clothing/hair adaptation','sourceRecord':'docs/assets/licenses/characters-craftpix/SOURCE_RECORD.md','nativeCrop':[20,18,44,44],'worldIntegerScale':3}

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
   poses.append([(x-32)*3,(y-44)*3])
  grips[dir]=poses
 (ROOT/'src/data/peopleHands.js').write_text('// Generated from the selected CraftPix native body poses by scripts/people_art.py.\nexport const PEOPLE_HANDS='+json.dumps(grips,separators=(',',':'))+';\n')

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
