"""Pack approved generated people into the game's native animation rig.
Native palette and articulated limb poses retain the approved face/clothing art.
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
WIDTH,HEIGHT=40,72
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
 scale=min(36/pose.width,64/pose.height)
 pose=pose.resize((max(1,round(pose.width*scale)),max(1,round(pose.height*scale))),Image.Resampling.NEAREST)
 # Crisp native silhouette; transparent pixels remain genuinely transparent.
 pose.putalpha(pose.getchannel('A').point(lambda v:255 if v>=128 else 0))
 im=Image.new('RGBA',(WIDTH,HEIGHT));im.alpha_composite(pose,((WIDTH-pose.width)//2,HEIGHT-pose.height))
 return im

@lru_cache(maxsize=None)
def pixel_pose(outfit,hair,row,extra=-1):
 # One palette per identity keeps shading stable between facings and frames.
 poses=[source_pose(outfit,hair,r,extra) for r in range(4)]
 colors=[p[:3] for im in poses for p in im.get_flattened_data() if p[3]]
 swatch=Image.new('RGB',(len(colors),1));swatch.putdata(colors)
 palette=swatch.quantize(colors=32,method=Image.Quantize.MEDIANCUT)
 im=poses[row];result=im.convert('RGB').quantize(palette=palette,dither=Image.Dither.NONE).convert('RGBA')
 result.putalpha(im.getchannel('A'));return result

def cut_region(im,box):
 part=Image.new('RGBA',im.size);part.paste(im.crop(box),box[:2]);im.paste((0,0,0,0),box);return part

def bend_limb(part,start,knee,end,knee_x,foot_x,lift=0):
 """Pixel row warp around fixed joints: hip/shoulder stays attached.
 Lift compresses the limb; sideways joint offsets make a bent silhouette.
 No resampling blur, pasted boot rectangles or whole-body slide frames.
 """
 out=Image.new('RGBA',part.size)
 for y in range(start,end):
  t=(y-start)/max(1,end-start-1)
  if y<=knee:dx=round(knee_x*(y-start)/max(1,knee-start))
  else:dx=round(knee_x+(foot_x-knee_x)*(y-knee)/max(1,end-1-knee))
  yy=y-round(lift*t)
  line=part.crop((0,y,WIDTH,y+1));out.alpha_composite(line,(dx,yy))
 return out

def walk_pose(base,row,frame,skirt=False):
 # Contact, passing, opposite contact, opposite passing.
 phase=1 if frame in [1,2] else -1;passing=frame in [2,4]
 body=base.copy();leg_y=65 if skirt else 52
 if row<2:
  arms=[cut_region(body,(0,34,13,57)),cut_region(body,(27,34,WIDTH,57))]
 else:
  # Side poses show the near arm in front of the garment. Leave the
  # upper sleeve/shoulder attached, and move elbow, forearm and hand.
  arm_box=(21,39,30,57) if row==2 else (10,39,19,57)
  arms=[cut_region(body,arm_box)]
  # Fill only the garment behind the detached forearm with adjacent
  # source torso pixels; the moving hand no longer leaves a hole.
  x0,y0,x1,y1=arm_box
  for y in range(y0,y1):
   edge=x0-1 if row==2 else x1
   for x in range(x0,x1):
    inside=x<=23 if row==2 else x>=17
    if inside and base.getpixel((x,y))[3]:body.putpixel((x,y),base.getpixel((edge,y)))
 legs=cut_region(body,(0,leg_y,WIDTH,HEIGHT))
 # A one-pixel rise during the passing poses gives a gentle body bob.
 bob=-1 if passing else 0
 out=Image.new('RGBA',base.size);out.alpha_composite(body,(0,bob))
 halves=[]
 for left in [True,False]:
  box=(0,leg_y,WIDTH//2,HEIGHT) if left else (WIDTH//2,leg_y,WIDTH,HEIGHT)
  part=Image.new('RGBA',base.size);part.paste(legs.crop(box),box[:2]);halves.append(part)
 if row<2:
  for side,part in enumerate(halves):
   forward=(side==0)==(phase>0)
   lift=(3 if not forward else 0) if not passing else (5 if not forward else 0)
   spread=(-1 if side==0 else 1)*(1 if not passing else 0)
   knee=(1 if side==0 else -1) if passing and not forward else spread
   out.alpha_composite(bend_limb(part,leg_y,61 if not skirt else 67,HEIGHT,knee,spread,lift))
  for side,part in enumerate(arms):
   forward=(side==0)!=(phase>0);lift=0 if forward else 4
   swing=(-2 if side==0 else 2) if forward else (1 if side==0 else -1)
   out.alpha_composite(bend_limb(part,34,45,57,swing//2,swing,lift),(0,bob))
 else:
  # Contact has a long separated stride; passing bends the raised knee
  # and brings the planted leg beneath the torso, rather than sliding.
  for side,part in enumerate(halves):
   direction=phase*(1 if side==0 else -1)
   dx=direction*(4 if not passing else 1)
   recovering=direction>0 if row==2 else direction<0
   lift=1 if not passing else (4 if recovering else 0)
   knee=round(dx/2) if not passing else ((-4 if row==2 else 4) if recovering else 0)
   if side==0:
    # Far leg is a little darker so both legs read when they overlap.
    alpha=part.getchannel('A');rgb=part.convert('RGB').point(lambda v:round(v*.84));part=rgb.convert('RGBA');part.putalpha(alpha)
   out.alpha_composite(bend_limb(part,leg_y,61 if not skirt else 67,HEIGHT,knee,dx,lift))
  part=arms[0];swing=(phase if row==2 else -phase)*(3 if not passing else 1)
  out.alpha_composite(bend_limb(part,39,47,57,round(swing/2),swing,2 if phase>0 else 0),(0,bob))
 return out

def cell(outfit,hair,row,frame,extra=-1):
 im=pixel_pose(outfit,hair,row,extra).copy()
 skirt=outfit=='plum' or extra==2
 if frame in [1,2,3,4]:return walk_pose(im,row,frame,skirt)
 if frame in [6,7,8]:
  amount={6:1,7:3,8:2}[frame];legs=cut_region(im,(0,65 if skirt else 52,WIDTH,HEIGHT))
  im.alpha_composite(bend_limb(legs,65 if skirt else 52,67 if skirt else 61,HEIGHT,0,0,amount))
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
