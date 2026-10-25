"""Pack generated NPC idle/walk poses; preserve approved neutral pixels and
all prior town atlas frames. No procedural gait or isolated pixel repainting.
"""
from pathlib import Path
from PIL import Image
from statistics import median
import json,hashlib
from revised_girl import cells,body_limits
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/art/npc-matching-animated-v1'
BASE=ROOT/'output/art/npc-matching-v1'
DIRS=['down','up','left','right'];COMPASS=['south','north','west','east']
SPECS={'idle':{'count':4,'durations':[1500,1200,120,1500]},'walking':{'count':6,'durations':[150]*6}}

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def source(name,action):
 p=OUT/f'source/{name}-{action}-fix.png'
 if not p.exists():p=OUT/f'source/{name}-{action}.png'
 im=Image.open(p).convert('RGBA')
 im.putdata([(*v[:3],255) if v[3]>=128 else (0,0,0,0) for v in im.get_flattened_data()])
 return im

def hair_centre(im,top,ground):
 return median(x for y in range(max(0,round(top)),min(im.height,round(top+(ground-top)*.23)+1)) for x in range(im.width) if (lambda p:p[3] and p[0]<170 and p[0]>p[1]*1.1)(im.getpixel((x,y))))

def native(im,scale,reference,phase_x=0):
 top,ground=body_limits(im);cx=hair_centre(im,top,ground)
 rb=reference.getbbox();target=hair_centre(reference,rb[1],rb[3]-1)
 palette=sorted({p[:3] for p in reference.get_flattened_data() if p[3]});cache={}
 frame=Image.new('RGBA',(64,64))
 for y in range(64):
  for x in range(64):
   sx,sy=round(cx+(x-target+phase_x)*scale),round(ground+(y-56)*scale)
   if sx<0 or sy<0 or sx>=im.width or sy>=im.height:continue
   p=im.getpixel((sx,sy))
   if not p[3]:continue
   rgb=p[:3]
   if rgb not in cache:cache[rgb]=min(palette,key=lambda c:sum((a-b)**2 for a,b in zip(c,rgb)))
   frame.putpixel((x,y),(*cache[rgb],255))
 assert frame.getbbox() and frame.getbbox()[0]>0 and frame.getbbox()[2]<64
 return frame

def export():
 records={}
 for name in ['nell','sol']:
  records[name]={}
  for action,spec in SPECS.items():
   rows=cells(source(name,action),spec['count'],4)
   scale=median(body_limits(row[0])[1]-body_limits(row[0])[0]+1 for row in rows)/40
   sheet=Image.new('RGBA',(spec['count']*64,256));entries=[]
   for row,d in enumerate(DIRS):
    ref=Image.open(BASE/f'frames/{name}/{COMPASS[row]}.png').convert('RGBA')
    for ph,raw in enumerate(rows[row]):
     # Strict west profile reuses the authored east cycle, as the existing
     # farmer/legacy NPC side rigs do. Never use a camera-facing sixth pose.
     if action=='idle' and (ph in [0,3] or d in ['left','right'] or name=='nell' and ph==2):
      # Profile standing stays approved: generated settling turned toward camera.
      # Nell's generated blink lost its facial marks at native resolution.
      im=ref.copy()
     elif action=='walking' and d=='left':
      east=Image.open(BASE/f'frames/{name}/east.png').convert('RGBA')
      im=native(rows[3][ph],scale,east).transpose(Image.Transpose.FLIP_LEFT_RIGHT)
     else:im=native(raw,scale,ref)
     folder=OUT/f'frames/{name}/{action}/{d}';folder.mkdir(parents=True,exist_ok=True);im.save(folder/f'{ph:02}.png');sheet.paste(im,(ph*64,row*64))
     entries.append({'direction':d,'phase':ph,'bounds':im.getbbox(),'rgbaSHA256':hashlib.sha256(im.tobytes()).hexdigest()})
   (OUT/'sheets').mkdir(exist_ok=True);sheet.save(OUT/f'sheets/{name}-{action}.png')
   (OUT/'previews').mkdir(exist_ok=True)
   for row,d in enumerate(DIRS):
    frames=[Image.open(OUT/f'frames/{name}/{action}/{d}/{ph:02}.png').resize((256,256),Image.Resampling.NEAREST) for ph in range(spec['count'])]
    frames[0].save(OUT/f'previews/{name}-{action}-{d}.gif',save_all=True,append_images=frames[1:],duration=spec['durations'],loop=0,disposal=2)
   sheet.resize((sheet.width*3,sheet.height*3),Image.Resampling.NEAREST).save(OUT/f'previews/{name}-{action}-contact.png')
   records[name][action]={**spec,'scaleFromSource':scale,'frames':entries}
 record={'date':'2026-10-14','tool':'OpenAI built-in imagegen','modelVersion':'not exposed','cell':[64,64],'origin':[32,56],'displayScale':1.5,'totalFrames':80,'neutralStandingPixelsPreserved':True,'profileIdleUsesApprovedStanding':True,'nellBlinkUsesApprovedStanding':True,'westWalkMirrorsEast':True,'sources':{p.name:sha(p) for p in (OUT/'source').glob('*.png')},'clips':records}
 (OUT/'manifest.json').write_text(json.dumps(record,indent=2)+'\n')
 return record

def resident_assets(assets):
 for name in ['nell','sol']:
  for action,spec in SPECS.items():
   for d in DIRS:
    for phase in range(spec['count']):
     p=OUT/f'frames/{name}/{action}/{d}/{phase:02}.png'
     if p.exists():assets[f'npc-{name}-{action}-{d}-{phase}']=Image.open(p).convert('RGBA')

def pack_atlas():
 path=ROOT/'public/assets/pixel/processed';meta=json.loads((path/'town.json').read_text());old=Image.open(path/'town.png').convert('RGBA')
 assets={};resident_assets(assets);assert len(assets)==80
 if all(key in meta['frames'] and meta['frames'][key]['frame']['w']==64 and meta['frames'][key]['frame']['h']==64 for key in assets):
  for key,im in assets.items():
   r=meta['frames'][key]['frame'];old.paste(im,(r['x'],r['y']))
  old.save(path/'town.png');return {'addedFrames':80,'baseHeight':meta['meta'].get('matchingNpcBaseHeight'),'height':old.height}
 base_height=meta['meta'].get('matchingNpcBaseHeight',old.height)
 frames={k:v for k,v in meta['frames'].items() if not k.startswith(('npc-nell-','npc-sol-'))}
 cols=15;rows=(len(assets)+cols-1)//cols;height=base_height+2+rows*66
 atlas=Image.new('RGBA',(1024,height));atlas.paste(old.crop((0,0,1024,base_height)),(0,0))
 for index,(key,im) in enumerate(assets.items()):
  x=index%cols*66;y=base_height+2+index//cols*66;atlas.paste(im,(x,y));frames[key]={'frame':{'x':x,'y':y,'w':64,'h':64},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':64,'h':64},'sourceSize':{'w':64,'h':64}}
 assert height<=4096
 meta['frames']=frames;meta['meta']['size']={'w':1024,'h':height};meta['meta']['matchingNpcBaseHeight']=base_height
 atlas.save(path/'town.png');(path/'town.json').write_text(json.dumps(meta,indent=2)+'\n')
 return {'addedFrames':len(assets),'baseHeight':base_height,'height':height}

if __name__=='__main__':
 record=export();print(json.dumps({'frames':record['totalFrames'],**pack_atlas()}))
