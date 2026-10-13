"""Pack Szadiart's original people pixels. No redraws, resampling or limb warps.
Only the supplied alpha-77 ground shadow is removed; runtime owns shadows.
Fixed native crop [4,2,28,42] and horizontally mirrored side rows retain all ink.
"""
from pathlib import Path
from functools import lru_cache
from PIL import Image
import json
from pixellab_people import write_farmer
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/assets/licenses/characters-szadiart/source'
OUT=ROOT/'public/assets/pixel/processed'
DIRECTIONS=['down','up','left','right'];SOURCE_ROWS=[1,2,0,0]
OUTFITS=['worker','gardener','copper','plum','forest'];HAIRS=['midnight','copper','chestnut','golden']
WIDTH,HEIGHT,COLUMNS=24,40,12
WORLD_SCALE=2
# Entire authored looks. Persistent legacy IDs keep purchased clothes/saves.
FAMILIES={'worker':'Male4','gardener':'Female2','copper':'Male2','plum':'Female1','forest':'Male1'}
# Classic, coastal, autumn, evening; current 'hair' ID is a preset variant.
VARIANTS=[0,1,2,3]
NPCS=[('Female2',0),('Female2',2),('Female1',0),('Male2',1),('Male3',0),('Male1',0),('Female1',2),('Female1',3)]
@lru_cache(maxsize=None)
def source(family):
 im=Image.open(SOURCE/(family+'.png')).convert('RGBA');assert im.size==(256,576)
 return im

def source_cell(family,variant,row,frame):
 r=variant*3+SOURCE_ROWS[row]
 im=source(family).crop((frame*32,r*48,(frame+1)*32,(r+1)*48))
 # Preserve every fully opaque source art pixel; all translucent pixels are
 # explicitly black alpha-77 shadows, not outlines or antialiasing.
 for y in range(48):
  for x in range(32):
   p=im.getpixel((x,y))
   if 0<p[3]<255:
    assert p==(0,0,0,77);im.putpixel((x,y),(0,0,0,0))
 if row==3:im=im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 return im

def pose(family,variant,row,frame):
 return source_cell(family,variant,row,frame).crop((4,2,28,42))

def source_frame(frame):
 if frame<4:return frame
 if frame<8:return frame
 return {8:5,9:7,10:5,11:0}[frame]

def cell(outfit,hair,row,frame):
 return pose(FAMILIES[outfit],VARIANTS[HAIRS.index(hair)],row,source_frame(frame))

def sheet(outfit,hair):
 im=Image.new('RGBA',(WIDTH*COLUMNS,HEIGHT*4))
 for row in range(4):
  for f in range(COLUMNS):im.alpha_composite(cell(outfit,hair,row,f),(f*WIDTH,row*HEIGHT))
 return im

def resident_art(assets):
 for name in list(assets):
  if name.startswith('town-person-'):del assets[name]
 for n,(family,variant) in enumerate(NPCS):
  for row,direction in enumerate(DIRECTIONS):
   for f in range(5):assets[f'town-person-{n}-{direction}-{f}']=pose(family,variant,row,0 if f==0 else f+3)
 return {'creator':'Szadi art.','license':'Included Szadiart License for Everyone; custom game-use licence','source':'docs/assets/licenses/characters-szadiart/SOURCE_RECORD.md','cells':[WIDTH,HEIGHT],'variants':8,'walkFrames':4,'sourcePixelsPreserved':True,'sideMirrored':True}

def write_people():
 OUT.mkdir(parents=True,exist_ok=True)
 appearance=Image.new('RGBA',(WIDTH*40,HEIGHT*24));index=0
 for outfit in OUTFITS:
  for hair in HAIRS:
   for row in range(4):
    for f in range(COLUMNS):
     appearance.alpha_composite(cell(outfit,hair,row,f),((index%40)*WIDTH,(index//40)*HEIGHT));index+=1
 appearance.save(OUT/'appearance.png');sheet('worker','midnight').save(OUT/'boy.png');sheet('gardener','chestnut').save(OUT/'girl.png')
 write_grips();farmer=write_farmer()
 return {'approvedFarmer':farmer,'size':[WIDTH,HEIGHT],'columns':COLUMNS,'rows':DIRECTIONS,'idle':[0,1,2,3],'move':[4,5,6,7],'walk':[4,5,6,7],'jump':[8,9,10],'appearanceSheets':20,'source':'Szadiart original finished character presets','sourceRecord':'docs/assets/licenses/characters-szadiart/SOURCE_RECORD.md','nativeCrop':[4,2,28,42],'worldIntegerScale':WORLD_SCALE,'sourceRows':SOURCE_ROWS,'mirroredRow':3,'shadowRemovedAlpha':77,'originalArtPreserved':True}

def grip(family,variant,row,frame):
 im=source_cell(family,variant,row,source_frame(frame));side=-1 if row in [1,3] else 1
 # Select a real opaque hand/forearm skin pixel below the head, on the held side.
 candidates=[]
 for y in range(23,35):
  for x in range(5,27):
   r,g,b,a=im.getpixel((x,y))
   if a==255 and r>=180 and g>=120 and r>g*1.1 and g>b:candidates.append((x,y))
 assert candidates,(family,variant,row,frame)
 preferred=[(x,y) for x,y in candidates if (x-15.5)*side>=1]
 candidates=preferred or candidates
 extreme=max(x*side for x,y in candidates);edge=[(x,y) for x,y in candidates if x*side>=extreme-1]
 tx=sum(x for x,y in edge)/len(edge);ty=sum(y for x,y in edge)/len(edge)
 x,y=min(edge,key=lambda p:(p[0]-tx)**2+(p[1]-ty)**2)
 return [(x-16)*WORLD_SCALE+1,(y-42)*WORLD_SCALE+1]

def write_grips():
 styles=[]
 for outfit in OUTFITS:
  for variant in VARIANTS:
   styles.append({direction:[grip(FAMILIES[outfit],variant,row,f) for f in range(COLUMNS)] for row,direction in enumerate(DIRECTIONS)})
 (ROOT/'src/data/peopleHands.js').write_text('// Generated from original Szadiart opaque hand pixels by scripts/people_art.py.\nexport const PEOPLE_STYLE_HANDS='+json.dumps(styles,separators=(',',':'))+';\nexport const PEOPLE_HANDS=PEOPLE_STYLE_HANDS[0];\n')

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
 manifest=json.loads((OUT/'manifest.json').read_text());manifest['matchedResidents']=provenance;manifest['characterFrames']=write_people();manifest['suppliedCharacters']='Active people use original Szadiart NPC characters, mirrored side poses and fixed crops. Previous people are retired provenance.';(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
if __name__=='__main__':update_atlas()
