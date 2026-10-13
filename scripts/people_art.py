"""Pack approved generated people into the game's native animation rig.
No procedural body redraw: face, hair, garments and boots come from the images.
"""
from pathlib import Path
from PIL import Image
import json
from functools import lru_cache
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'docs/assets/licenses/characters-v2/source'
OUT=ROOT/'public/assets/pixel/processed'
DIRECTIONS=['down','up','left','right']
OUTFITS=['worker','gardener','copper','plum','forest']
HAIRS=['midnight','copper','chestnut','golden']
WIDTH,HEIGHT=48,80
@lru_cache(maxsize=None)
def source_pose(outfit,hair,row,extra=-1):
 name='extras' if extra>=0 else outfit
 source=Image.open(SOURCE/(name+'.png')).convert('RGBA')
 col=extra if extra>=0 else HAIRS.index(hair)
 x0=round(col*source.width/4);x1=round((col+1)*source.width/4)
 strip=source.crop((x0,0,x1,source.height));alpha=strip.getchannel('A').point(lambda v:255 if v>=128 else 0)
 spans=[];begin=None
 for y in range(source.height+1):
  occupied=y<source.height and alpha.crop((0,y,strip.width,y+1)).getbbox() is not None
  if occupied and begin is None:begin=y
  if not occupied and begin is not None:
   if spans and begin-spans[-1][1]<=8:spans[-1]=(spans[-1][0],y)
   else:spans.append((begin,y))
   begin=None
 spans=[v for v in spans if v[1]-v[0]>100]
 assert len(spans)==4,(name,col,spans)
 y0,y1=spans[row];pose=strip.crop((0,y0,strip.width,y1));alpha=pose.getchannel('A');bbox=alpha.point(lambda v:255 if v>=128 else 0).getbbox()
 assert bbox is not None,(name,col,row)
 pose=pose.crop(bbox)
 scale=min(44/pose.width,76/pose.height)
 pose=pose.resize((max(1,round(pose.width*scale)),max(1,round(pose.height*scale))),Image.Resampling.NEAREST)
 # Crisp native silhouette; transparent pixels remain genuinely transparent.
 pose.putalpha(pose.getchannel('A').point(lambda v:255 if v>=128 else 0))
 im=Image.new('RGBA',(WIDTH,HEIGHT));im.alpha_composite(pose,((WIDTH-pose.width)//2,HEIGHT-pose.height))
 return im

def cell(outfit,hair,row,frame,extra=-1):
 im=source_pose(outfit,hair,row,extra).copy()
 # Preserve the supplied upper-body artwork. Opposite grounded leg offsets
 # create the two stride extremes; neutral steps share the original artwork.
 if frame in [1,3]:
  lower=im.crop((0,55,WIDTH,HEIGHT));im.paste((0,0,0,0),(0,55,WIDTH,HEIGHT))
  split=WIDTH//2;phase=1 if frame==1 else -1
  for x0,x1,dy in [(0,split,-phase),(split,WIDTH,phase)]:
   part=lower.crop((x0,0,x1,HEIGHT-55));im.alpha_composite(part,(x0,55+dy))
 if frame in [6,7,8]:
  amount={6:1,7:3,8:2}[frame];legs=im.crop((0,58,WIDTH,HEIGHT));im.paste((0,0,0,0),(0,58,WIDTH,HEIGHT));im.alpha_composite(legs,(0,58-amount))
 return im

def sheet(outfit,hair,extra=-1):
 im=Image.new('RGBA',(WIDTH*9,HEIGHT*4))
 for row in range(4):
  for frame in range(9):im.alpha_composite(cell(outfit,hair,row,frame,extra),(frame*WIDTH,row*HEIGHT))
 return im
NPCS=[('gardener','chestnut',-1),('copper','chestnut',3),('plum','midnight',-1),('worker','copper',-1),('forest','midnight',0),('worker','midnight',1),('forest','golden',-1),('plum','chestnut',2)]
def resident_art(assets):
 for n,(outfit,hair,extra) in enumerate(NPCS):
  for row,direction in enumerate(DIRECTIONS):
   for frame in range(5):assets[f'town-person-{n}-{direction}-{frame}']=cell(outfit,hair,row,frame,extra)
 return {'creator':'Simple Life / OpenAI image generation and native sprite packing','license':'Original generated project art; AI assistance disclosed; no exclusive copyright claim','source':'docs/assets/licenses/characters-v2/SOURCE_RECORD.md','cells':[WIDTH,HEIGHT],'variants':8}
def write_people():
 OUT.mkdir(parents=True,exist_ok=True)
 # Eighteen cells per row keep all 720 linear animation indexes intact,
 # while staying below the 4096px texture limit on mobile GPUs.
 appearance=Image.new('RGBA',(WIDTH*18,HEIGHT*40));index=0
 for outfit in OUTFITS:
  for hair in HAIRS:
   for row in range(4):
    for frame in range(9):
     appearance.alpha_composite(cell(outfit,hair,row,frame),((index%18)*WIDTH,(index//18)*HEIGHT));index+=1
 appearance.save(OUT/'appearance.png');sheet('worker','midnight').save(OUT/'boy.png');sheet('gardener','chestnut').save(OUT/'girl.png')
 return {'size':[WIDTH,HEIGHT],'columns':9,'rows':DIRECTIONS,'idle':[0,5],'walk':[1,2,3,4],'jump':[6,7,8],'appearanceSheets':20,'source':'Original generated reference-matched art'}
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
 manifest=json.loads((OUT/'manifest.json').read_text());manifest['matchedResidents']=provenance;manifest['characterFrames']=write_people();manifest['suppliedCharacters']='Retired CC0 base; active people use original generated reference-matched art.';(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
if __name__=='__main__':update_atlas()
