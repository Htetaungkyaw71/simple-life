"""Export authored female poses to the approved male's rig, without limb warps."""
from pathlib import Path
from PIL import Image
from statistics import median
import hashlib
import json
from revised_farmer import hand, wrist_angle

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/art/farmer-girl-v2'
DIRS=['down','up','left','right']
COMPASS=['south','north','west','east']
DISPLAY_SCALE=1.45
PALETTE=json.loads((ROOT/'output/art/farmer-boy-revised-v2/manifest.json').read_text())['palette']
SPECS={
 'idle':{'count':4,'durations':[1100,1000,120,1000],'loop':True},
 'running':{'count':8,'durations':[83,84,83,83,84,83,83,84],'loop':True},
 'harvesting':{'count':6,'durations':[100]*6,'loop':False},
 'digging':{'count':6,'durations':[100]*6,'loop':False},
 'chopping':{'count':6,'durations':[100]*6,'loop':False},
 'watering':{'count':6,'durations':[125]*6,'loop':False},
 'attack':{'count':6,'durations':[83,84,83,83,84,83],'loop':False},
 'jumping':{'count':6,'durations':[90,90,120,120,90,90],'loop':False},
}

def sha(data):return hashlib.sha256(data).hexdigest()
def save(im,p):p.parent.mkdir(parents=True,exist_ok=True);im.save(p)
def source(name):
 file=OUT/f'source/{name}.png'
 if name=='idle' and (OUT/'source/idle-eye-fix.png').exists():file=OUT/'source/idle-eye-fix.png'
 im=Image.open(file).convert('RGBA')
 im.putdata([(*p[:3],255) if p[3]>=128 else (0,0,0,0) for p in im.get_flattened_data()])
 return im

def cuts(im,count,axis):
 n,other=im.size[axis],im.size[1-axis]
 hist=[sum(im.getpixel((p,q) if axis==0 else (q,p))[3]>0 for q in range(other)) for p in range(n)]
 ranges=[];start=None
 for p in range(n+1):
  if p<n and hist[p] and start is None:start=p
  if (p==n or not hist[p]) and start is not None:ranges.append((start,p));start=None
 if len(ranges)==count:return [0]+[(a[1]+b[0])//2 for a,b in zip(ranges,ranges[1:])]+[n]
 result=[0]
 for i in range(1,count):
  mid=n*i/count;pitch=n/count
  p=min(range(round(mid-pitch*.30),round(mid+pitch*.30)),key=lambda p:(hist[p],abs(p-mid)))
  assert hist[p]==0,('No transparent gutter',axis,i,hist[p])
  result.append(p)
 return result+[n]

def cells(im,cols,rows):
 xs=cuts(im,cols,0)
 strips=[im.crop((xs[c],0,xs[c+1],im.height)) for c in range(cols)]
 ys=[cuts(s,rows,1) for s in strips]
 result=[]
 for r in range(rows):
  top=min(y[r] for y in ys);bottom=max(y[r+1] for y in ys)
  row=[]
  for c,s in enumerate(strips):
   frame=Image.new('RGBA',(s.width,bottom-top));frame.paste(s.crop((0,ys[c][r],s.width,ys[c][r+1])),(0,ys[c][r]-top));row.append(frame)
  result.append(row)
 return result

def body_limits(im):
 b=im.getbbox();assert b
 hair=[];boots=[]
 for y in range(b[1],b[3]):
  for x in range(b[0],b[2]):
   r,g,blue,a=im.getpixel((x,y))
   if not a or r>=155 or r<g*1.1 or g<blue*.65:continue
   if y<b[1]+(b[3]-b[1])*.52:hair.append(y)
   if y>b[1]+(b[3]-b[1])*.72:boots.append(y)
 assert hair and boots,'Hair/boot calibration missing'
 return min(hair),max(boots)

def centre(im,top,ground):
 points=[];height=ground-top+1
 for y in range(max(0,int(top+height*.38)),min(im.height,int(top+height*.65))):
  for x in range(im.width):
   r,g,b,a=im.getpixel((x,y))
   if a and r<170 and g>35 and g>=r*.91 and b<g*.89:points.append(x)
 return median(points) if points else sum(im.getbbox()[::2])/2

COLOUR_CACHE={}
def colour(p):
 if not p[3]:return (0,0,0,0)
 key=p[:3]
 if key not in COLOUR_CACHE:COLOUR_CACHE[key]=(*min(PALETTE,key=lambda c:sum((a-b)**2 for a,b in zip(c,key))),255)
 return COLOUR_CACHE[key]

def native(im,scale,limits,register_boots=False,grid_phase_x=0):
 top,ground=limits
 if register_boots:ground=body_limits(im)[1]
 cx=centre(im,top,ground)
 b=im.getbbox();assert (b[0]-cx)/scale+32>0 and (b[2]-cx)/scale+32<64
 assert (b[1]-ground)/scale+56>0 and (b[3]-ground)/scale+56<64,('Clipped source ink',b,scale,limits)
 result=Image.new('RGBA',(64,64))
 for y in range(64):
  for x in range(64):
   sx,sy=round(cx+(x-32+.5+grid_phase_x)*scale),round(ground+(y-56)*scale)
   if 0<=sx<im.width and 0<=sy<im.height:result.putpixel((x,y),colour(im.getpixel((sx,sy))))
 assert result.getbbox()
 return result

def female_hand(im,direction):
 side=-1 if direction in ('up','right') else 1
 skin=[(x,y) for y in range(32,51) for x in range(64) if (lambda p:p[3] and p[0]>120 and p[0]>p[1]*1.25 and p[1]>p[2]*1.25)(im.getpixel((x,y)))]
 assert skin,direction
 preferred=[(x,y) for x,y in skin if (x-32)*side>=1] or skin
 extreme=max(x*side for x,y in preferred);edge=[(x,y) for x,y in preferred if x*side==extreme];x,y=edge[len(edge)//2]
 return [round((x-32+.5)*DISPLAY_SCALE),round((y-56+.5)*DISPLAY_SCALE)]

def action_frames(action):
 count=SPECS[action]['count']
 if action=='running':
  fb=cells(source('run_frontback'),8,2);east=cells(source('run_east'),8,1)[0]
  raw=fb+[east,east]
 else:raw=cells(source(action),count,4)
 calibration_phase=1 if action=='jumping' else 0
 limits=[body_limits(row[calibration_phase]) for row in raw]
 scale=median(b-t+1 for t,b in limits)/40
 # One consistent sampling-grid registration for the complete south idle
 # preserves both corrected one-column eyes at the same positions in every
 # open-eye hold. No isolated face/body pixel is redrawn or displaced.
 packed=[[native(im,scale,limits[r],action=='jumping',.25 if action=='idle' and r==0 else 0) for im in row] for r,row in enumerate(raw)]
 if action=='running':packed[2]=[im.transpose(Image.Transpose.FLIP_LEFT_RIGHT) for im in packed[3]]
 return packed,{'sourceScale':scale,'bodyCalibration':limits,'mirroredWest':action=='running'}

def write_girl():
 atlas=Image.new('RGBA',(512,2048));hands={d:{} for d in DIRS};angles={d:{} for d in DIRS};records={};clips={};animations=[];total=0
 for block,(action,spec) in enumerate(SPECS.items()):
  rows,calibration=action_frames(action);sheet=Image.new('RGBA',(64*spec['count'],256))
  clips[action]={'offset':block*32,**spec}
  unique=[];bounds=[]
  for row,d in enumerate(DIRS):
   unique.append(len({im.tobytes() for im in rows[row]}));bounds.append([im.getbbox() for im in rows[row]])
   for phase,im in enumerate(rows[row]):
    save(im,OUT/f'frames/{action}/{COMPASS[row]}/{phase:02}.png');sheet.paste(im,(phase*64,row*64));atlas.paste(im,(phase*64,(block*4+row)*64));total+=1
    if action in ('idle','running','jumping'):
     grip=female_hand(im,d);hands[d].setdefault(action,[]).append(grip);angles[d].setdefault(action,[]).append(wrist_angle(im,hand(im,d)))
   animations.append({'key':f'girl-{action}-{COMPASS[row]}','action':action,'direction':COMPASS[row],'sheet':f'sheets/{action}.png','frameWidth':64,'frameHeight':64,'row':row,'columns':spec['count'],'frameIndices':[row*spec['count']+i for i in range(spec['count'])],'frameDurationsMs':spec['durations'],'loop':spec['loop']})
  save(sheet,OUT/f'sheets/{action}.png');save(sheet.resize((sheet.width*3,768),Image.Resampling.NEAREST),OUT/f'previews/{action}-contact.png')
  frames=[]
  for phase in range(spec['count']):
   fr=Image.new('RGBA',(256,64),(211,212,182,255))
   for row in range(4):fr.alpha_composite(rows[row][phase],(row*64,0))
   frames.append(fr.resize((768,192),Image.Resampling.NEAREST))
  frames[0].save(OUT/f'previews/{action}.gif',save_all=True,append_images=frames[1:],duration=spec['durations'],loop=0,disposal=2)
  records[action]={**spec,**calibration,'uniqueFrames':unique,'bounds':bounds,'sheetSha256':sha((OUT/f'sheets/{action}.png').read_bytes())}
  print(action,unique,flush=True)
 for d,modes in angles.items():
  base=modes['idle'][0]
  for mode,values in modes.items():modes[mode]=[round(max(-.26,min(.26,(v-base)*.25))/.087266)*.087266 for v in values]
 assert total==192
 save(atlas,ROOT/'public/assets/pixel/processed/girl.png');save(atlas,OUT/'runtime-girl.png')
 (ROOT/'src/data/revisedGirl.js').write_text('// Imagegen-authored female poses, packed by scripts/revised_girl.py.\n'+'export const GIRL_CLIPS='+json.dumps(clips,separators=(',',':'))+';\n'+'export const GIRL_V2_HANDS='+json.dumps(hands,separators=(',',':'))+';\n'+'export const GIRL_CARRY_ANGLES='+json.dumps(angles,separators=(',',':'))+';\n')
 manifest={'date':'2026-10-14','tool':'OpenAI built-in imagegen','modelVersion':'not exposed','cellSize':[64,64],'bodyHeightTarget':40,'groundRow':56,'scale':1.5,'directions':COMPASS,'totalFrames':total,'runtimeSlots':256,'palette':PALETTE,'actions':records,'clips':clips,'handsWorldOffsets':hands,'carryAnglesRadians':angles,'sources':{p.name:sha(p.read_bytes()) for p in sorted((OUT/'source').glob('*.png'))},'runtimeSha256':sha((ROOT/'public/assets/pixel/processed/girl.png').read_bytes()),'conversion':'Authored whole-body poses with male pose guides and new female identity; alpha threshold128 preserving partially opaque handles/face edges; nearest native sampling; one action-wide standing-equivalent scale; torso registration; boot registration for jump; shared existing32-colour palette; west run mirrors east. No limb warps or procedural replacement poses.','carriedTools':'Existing approved male tools are shared; female grips/angles/hand overlay come from her own frames.'}
 manifest['scale']=DISPLAY_SCALE
 manifest['idleFrontGridPhaseX']=.25
 manifest['sizeCorrection']='Display scale1.45 matches the41-pixel female standing silhouette to the40-pixel male at1.5; approximately59.45 versus60world units. Hand grips are re-extracted at the actual female scale.'
 manifest['eyeCorrection']='Imagegen edited the idle source; both front open eyes are one native column by two rows in phases0,1,3, with fixed whole-frame grid registration.'
 (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 (OUT/'animations.json').write_text(json.dumps({'frameIndexBase':0,'originPixels':[32,56],'clips':animations},indent=2)+'\n')
 return manifest

if __name__=='__main__':write_girl()
