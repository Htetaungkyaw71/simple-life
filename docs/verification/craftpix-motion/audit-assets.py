from pathlib import Path
from PIL import Image,ImageChops
import sys,subprocess,json,hashlib,io
sys.path.insert(0,'scripts')
from people_art import SOURCE,OUT,WIDTH,HEIGHT,COLUMNS,OUTFITS,HAIRS,SOURCE_ROWS,NPCS
out=Path('docs/verification/craftpix-motion');out.mkdir(parents=True,exist_ok=True)
appearance=Image.open(OUT/'appearance.png').convert('RGBA');town=Image.open(OUT/'town.png').convert('RGBA');meta=json.loads((OUT/'town.json').read_text())
oldmeta=json.loads(subprocess.check_output(['git','show','35303c0:public/assets/pixel/processed/town.json']));old=Image.open(io.BytesIO(subprocess.check_output(['git','show','35303c0:public/assets/pixel/processed/town.png']))).convert('RGBA');preserved=0
for n,r in oldmeta['frames'].items():
 if n.startswith('town-person-'):continue
 a=r['frame'];b=meta['frames'][n]['frame'];assert old.crop((a['x'],a['y'],a['x']+a['w'],a['y']+a['h'])).tobytes()==town.crop((b['x'],b['y'],b['x']+b['w'],b['y']+b['h'])).tobytes(),n;preserved+=1
source_images={};checked=0
for style,outfit in enumerate(OUTFITS):
 for hair in range(4):
  sex='female' if outfit in ['gardener','plum'] else 'male'
  for row in range(4):
   for f in range(COLUMNS):
    action='Idle' if f<12 else 'Run';n=f%4 if f<12 and row==1 else f if f<12 else f-12 if f<20 else {20:1,21:3,22:5,23:0}[f]
    key=(sex,action)
    if key not in source_images:source_images[key]=Image.open(SOURCE/sex/f'Unarmed_{action}_without_shadow.png').convert('RGBA')
    raw=source_images[key].crop((n*64+20,SOURCE_ROWS[row]*64+18,n*64+44,SOURCE_ROWS[row]*64+44))
    index=(style*4+hair)*96+row*24+f;cell=appearance.crop((index%40*WIDTH,index//40*HEIGHT,index%40*WIDTH+WIDTH,index//40*HEIGHT+HEIGHT));native=cell.resize((24,26),Image.Resampling.NEAREST)
    assert cell.tobytes()==native.resize(cell.size,Image.Resampling.NEAREST).tobytes(),('not integer native pixels',index)
    assert ImageChops.subtract(raw.getchannel('A'),native.getchannel('A')).getbbox() is None,('lost source anatomy',index)
    assert native.getbbox(),index;checked+=1
for npc,(outfit,hair,sex,extra) in enumerate(NPCS):
 for row,dir in enumerate(['down','up','left','right']):
  for f in range(7):
   action='Idle' if f==0 else 'Walk';n=0 if f==0 else f-1
   raw=Image.open(SOURCE/sex/f'Unarmed_{action}_without_shadow.png').convert('RGBA').crop((n*64+20,SOURCE_ROWS[row]*64+18,n*64+44,SOURCE_ROWS[row]*64+44));r=meta['frames'][f'town-person-{npc}-{dir}-{f}']['frame'];cell=town.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']));native=cell.resize((24,26),Image.Resampling.NEAREST)
   assert cell.tobytes()==native.resize(cell.size,Image.Resampling.NEAREST).tobytes();assert ImageChops.subtract(raw.getchannel('A'),native.getchannel('A')).getbbox() is None;checked+=1
assert preserved==698 and max(appearance.size)<=4096 and max(town.size)<=4096
result={'result':'PASS','sourcePoseCellsChecked':checked,'allSourceAnatomyPixelsRetained':True,'nativePixelsAtInteger3xWorldScale':True,'preservedNonPersonTownCells':preserved,'baselineCommit':'35303c0','appearanceSize':appearance.size,'townSize':town.size,'townCells':len(meta['frames']),'runtimeSourceArchivesExcluded':True}
(out/'source-pose-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(result)
# A preview from the actual processed runtime frames, not a concept sheet.
frames=[]
for f in range(8):
 bg=Image.new('RGBA',(WIDTH*2,HEIGHT*4),(115,136,82,255))
 for col,style in enumerate([0,6]):
  for row in range(4):
   index=style*96+row*24+12+f;bg.alpha_composite(appearance.crop((index%40*WIDTH,index//40*HEIGHT,index%40*WIDTH+WIDTH,index//40*HEIGHT+HEIGHT)),(col*WIDTH,row*HEIGHT))
 frames.append(bg.resize((288,624),Image.Resampling.NEAREST).convert('RGB'))
frames[0].save(out/'farmers-jog.gif',save_all=True,append_images=frames[1:],duration=80,loop=0,disposal=2)
