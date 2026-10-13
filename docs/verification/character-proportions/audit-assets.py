from pathlib import Path
from PIL import Image
import sys,subprocess,json,io
sys.path.insert(0,'scripts')
from people_art import SOURCE,OUT,WIDTH,HEIGHT,COLUMNS,OUTFITS,HAIRS,SOURCE_ROWS,NPCS,BODY_STRETCH,WORLD_SCALE
out=Path('docs/verification/character-proportions')
appearance=Image.open(OUT/'appearance.png').convert('RGBA');town=Image.open(OUT/'town.png').convert('RGBA');meta=json.loads((OUT/'town.json').read_text())
oldmeta=json.loads(subprocess.check_output(['git','show','25dbc1e:public/assets/pixel/processed/town.json']));old=Image.open(io.BytesIO(subprocess.check_output(['git','show','25dbc1e:public/assets/pixel/processed/town.png']))).convert('RGBA');preserved=0
for n,r in oldmeta['frames'].items():
 if n.startswith('town-person-'):continue
 a=r['frame'];b=meta['frames'][n]['frame'];assert old.crop((a['x'],a['y'],a['x']+a['w'],a['y']+a['h'])).tobytes()==town.crop((b['x'],b['y'],b['x']+b['w'],b['y']+b['h'])).tobytes(),n;preserved+=1
checked=0;pixel_count=0
images={}
def audit(cell,sex,action,row,f):
 global checked,pixel_count
 key=(sex,action)
 if key not in images:images[key]=Image.open(SOURCE/sex/f'Unarmed_{action}2_body.png').convert('RGBA')
 raw=images[key].crop((f*64,SOURCE_ROWS[row]*64,(f+1)*64,(SOURCE_ROWS[row]+1)*64))
 assert cell.size==(WIDTH,HEIGHT) and cell.getbbox()
 assert set(cell.getchannel('A').get_flattened_data())=={0,255}
 # Independently project every body alpha pixel with the fixed global row map.
 # Redrawn heads are intentionally different: original-head retention is not claimed.
 for y in range(64):
  for x in range(64):
   if not raw.getpixel((x,y))[3]:continue
   a=HEIGHT-1-round((44-y)*BODY_STRETCH);b=HEIGHT-2-round((43-y)*BODY_STRETCH)
   for yy in range(a,b+1):
    assert 0<=x-20<WIDTH and 0<=yy<HEIGHT,(sex,action,row,f,x,y,yy)
    assert cell.getpixel((x-20,yy))[3]==255,(sex,action,row,f,x,y)
    pixel_count+=1
 checked+=1
for style,outfit in enumerate(OUTFITS):
 for hair in range(4):
  sex='female' if outfit in ['gardener','plum'] else 'male'
  for row in range(4):
   for f in range(COLUMNS):
    action='Idle' if f<12 else 'Run';n=f%4 if f<12 and row==1 else f if f<12 else f-12 if f<20 else {20:1,21:3,22:5,23:0}[f]
    i=(style*4+hair)*96+row*24+f;cell=appearance.crop((i%40*WIDTH,i//40*HEIGHT,i%40*WIDTH+WIDTH,i//40*HEIGHT+HEIGHT));audit(cell,sex,action,row,n)
for npc,(outfit,hair,sex,extra) in enumerate(NPCS):
 for row,dir in enumerate(['down','up','left','right']):
  for f in range(7):
   r=meta['frames'][f'town-person-{npc}-{dir}-{f}']['frame'];cell=town.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']));audit(cell,sex,'Idle' if f==0 else 'Walk',row,0 if f==0 else f-1)
assert preserved==698 and max(appearance.size)<=4096 and max(town.size)<=4096
result={'result':'PASS','poseCellsChecked':checked,'mappedBodyPixelsChecked':pixel_count,'everyRetargetedBodyPixelRetained':True,'headsRedrawn':True,'nativeCell':[WIDTH,HEIGHT],'worldScale':WORLD_SCALE,'preservedNonPersonTownCells':preserved,'baselineCommit':'25dbc1e','appearanceSize':appearance.size,'townSize':town.size,'townCells':len(meta['frames'])}
(out/'source-pose-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(result)
frames=[]
for f in range(8):
 bg=Image.new('RGBA',(WIDTH*2,HEIGHT*4),(115,136,82,255))
 for col,style in enumerate([0,6]):
  for row in range(4):
   i=style*96+row*24+12+f;bg.alpha_composite(appearance.crop((i%40*WIDTH,i//40*HEIGHT,i%40*WIDTH+WIDTH,i//40*HEIGHT+HEIGHT)),(col*WIDTH,row*HEIGHT))
 frames.append(bg.resize((192,576),Image.Resampling.NEAREST).convert('RGB'))
frames[0].save(out/'farmers-jog.gif',save_all=True,append_images=frames[1:],duration=80,loop=0,disposal=2)
bg=Image.new('RGBA',(WIDTH*8,HEIGHT*4),(115,136,82,255))
for npc in range(8):
 for row,dir in enumerate(['down','up','left','right']):
  r=meta['frames'][f'town-person-{npc}-{dir}-0']['frame'];bg.alpha_composite(town.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h'])),(npc*WIDTH,row*HEIGHT))
bg.resize((768,576),Image.Resampling.NEAREST).save(out/'town-people.png')
