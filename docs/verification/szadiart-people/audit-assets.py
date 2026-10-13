from pathlib import Path
from PIL import Image
import sys,subprocess,json,io,hashlib
sys.path.insert(0,'scripts')
from people_art import SOURCE,OUT,WIDTH,HEIGHT,COLUMNS,OUTFITS,HAIRS,SOURCE_ROWS,NPCS,FAMILIES,VARIANTS
out=Path('docs/verification/szadiart-people')
record=json.loads((SOURCE.parent/'sources.json').read_text())
for entry in record['selectedFiles']:
 p=(SOURCE if entry['path'].endswith('.png') else SOURCE.parent)/entry['path']
 assert hashlib.sha256(p.read_bytes()).hexdigest()==entry['sha256'],entry['path']
app=Image.open(OUT/'appearance.png').convert('RGBA');town=Image.open(OUT/'town.png').convert('RGBA');meta=json.loads((OUT/'town.json').read_text())
oldmeta=json.loads(subprocess.check_output(['git','show','ffaa375:public/assets/pixel/processed/town.json']));old=Image.open(io.BytesIO(subprocess.check_output(['git','show','ffaa375:public/assets/pixel/processed/town.png']))).convert('RGBA');preserved=0
for n,r in oldmeta['frames'].items():
 if n.startswith('town-person-'):continue
 a=r['frame'];b=meta['frames'][n]['frame'];assert old.crop((a['x'],a['y'],a['x']+a['w'],a['y']+a['h'])).tobytes()==town.crop((b['x'],b['y'],b['x']+b['w'],b['y']+b['h'])).tobytes(),n;preserved+=1
images={p.stem:Image.open(p).convert('RGBA') for p in SOURCE.glob('*.png')};count=ink=shadows=grips=0
# Parse generated source grips as data, then prove they land on opaque native ink.
hand_text=Path('src/data/peopleHands.js').read_text();hands=json.loads(hand_text.split('PEOPLE_STYLE_HANDS=')[1].split(';')[0])
def verify(actual,family,variant,row,f,hand=None):
 global count,ink,shadows,grips
 raw=images[family].crop((f*32,(variant*3+SOURCE_ROWS[row])*48,(f+1)*32,(variant*3+SOURCE_ROWS[row]+1)*48));expected=Image.new('RGBA',(24,40))
 for y in range(48):
  for x in range(32):
   p=raw.getpixel((x,y))
   if p[3]==255:
    xx=31-x if row==3 else x;assert 4<=xx<28 and 2<=y<42,(family,variant,row,f,x,y)
    expected.putpixel((xx-4,y-2),p);ink+=1
   elif p[3]:assert p==(0,0,0,77);shadows+=1
 visible=Image.new('RGBA',actual.size);visible.alpha_composite(actual)
 assert visible.tobytes()==expected.tobytes(),(family,variant,row,f,'source art altered')
 if hand:
  # World coordinates select the centre of a 2x native opaque hand pixel.
  x=(hand[0]-1)//2+12;y=(hand[1]-1)//2+40
  r,g,b,a=actual.getpixel((x,y));assert a==255 and r>=180 and g>=120 and r>g*1.1 and g>b,(family,variant,row,f,'grip',hand);grips+=1
 count+=1
for style,outfit in enumerate(OUTFITS):
 for h,hair in enumerate(HAIRS):
  for row,dir in enumerate(['down','up','left','right']):
   for f in range(COLUMNS):
    n=f if f<8 else {8:5,9:7,10:5,11:0}[f];i=(style*4+h)*48+row*12+f
    actual=app.crop((i%40*WIDTH,i//40*HEIGHT,i%40*WIDTH+WIDTH,i//40*HEIGHT+HEIGHT));verify(actual,FAMILIES[outfit],VARIANTS[h],row,n,hands[style*4+h][dir][f])
for npc,(family,variant) in enumerate(NPCS):
 for row,dir in enumerate(['down','up','left','right']):
  for f in range(5):
   r=meta['frames'][f'town-person-{npc}-{dir}-{f}']['frame'];verify(town.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h'])),family,variant,row,0 if f==0 else f+3)
assert preserved==698 and max(app.size)<=4096 and max(town.size)<=4096
result={'result':'PASS','verifiedSourceHashes':len(record['selectedFiles']),'exactOriginalArtCells':count,'opaqueSourcePixelsPreserved':ink,'onlyAlpha77ShadowsRemoved':shadows,'exactOpaqueSkinGrips':grips,'nativeCell':[WIDTH,HEIGHT],'worldIntegerScale':2,'preservedNonPersonTownCells':preserved,'baselineCommit':'ffaa375','appearanceSize':app.size,'townSize':town.size,'townCells':len(meta['frames']),'mirroredSideOnly':True}
(out/'source-pose-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(result)
frames=[]
for f in range(4):
 bg=Image.new('RGBA',(WIDTH*2,HEIGHT*4),(115,136,82,255))
 for col,style in enumerate([0,6]):
  for row in range(4):
   i=style*48+row*12+4+f;bg.alpha_composite(app.crop((i%40*WIDTH,i//40*HEIGHT,i%40*WIDTH+WIDTH,i//40*HEIGHT+HEIGHT)),(col*WIDTH,row*HEIGHT))
 frames.append(bg.resize((192,640),Image.Resampling.NEAREST).convert('RGB'))
frames[0].save(out/'farmers-walk.gif',save_all=True,append_images=frames[1:],duration=100,loop=0,disposal=2)
bg=Image.new('RGBA',(WIDTH*8,HEIGHT*4),(115,136,82,255))
for npc in range(8):
 for row,dir in enumerate(['down','up','left','right']):
  r=meta['frames'][f'town-person-{npc}-{dir}-0']['frame'];bg.alpha_composite(town.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h'])),(npc*WIDTH,row*HEIGHT))
bg.resize((768,640),Image.Resampling.NEAREST).save(out/'town-people.png')
