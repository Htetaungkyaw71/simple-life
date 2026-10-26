"""Original crop/item/tool pixels for the user-authorized free-bed farming update.
Reference screenshots inform soil/foliage density only; no source pixels sampled.
"""
from pathlib import Path
from PIL import Image,ImageDraw
from import_sheet import candidate_frames
ROOT=Path(__file__).resolve().parents[1]
NEW_CROPS=('chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato')
IMPORTED_CROPS=('chili','eggplant','cucumber','watermelon','pumpkin','grape','blueberry','sweetPotato')
COLOURS={'chili':('#b14e37','#e9894d'),'eggplant':('#5b485e','#92788e'),'cucumber':('#4f7041','#98ac58'),'watermelon':('#476945','#98aa62'),'pumpkin':('#b16c38','#e1a650'),'grape':('#695575','#a391ae'),'blueberry':('#516275','#8b9aab'),'sweetPotato':('#8a5551','#c78c67')}
def fruit(d,c,x,y,small=False):
 dark,light=COLOURS[c];r=2 if small else 5
 if c in ('grape','blueberry'):
  for dx,dy in [(-2,-1),(2,-1),(0,2),(-1,4)]:d.rectangle((x+dx-1,y+dy-1,x+dx+1,y+dy+1),fill=dark);d.point((x+dx,y+dy-1),fill=light)
 elif c in ('chili','cucumber','eggplant','sweetPotato'):
  d.polygon([(x-2,y-3),(x+2,y-2),(x+3,y+2),(x,y+5),(x-2,y+3)],fill=dark);d.line((x,y-2,x+1,y+2),fill=light,width=1 if small else 2)
 else:
  d.ellipse((x-r,y-r+1,x+r,y+r),fill=dark);d.line((x-1,y-r+2,x-1,y+r-1),fill=light,width=2)
  if c=='watermelon':d.line((x+2,y-r+2,x+2,y+r-1),fill='#253f30')
 d.line((x,y-4,x+1,y-5),fill='#62733b')
def add_farm_crop_art(assets):
 for c in NEW_CROPS:
  icon=Image.new('RGBA',(16,16));d=ImageDraw.Draw(icon);fruit(d,c,8,8);assets[c+'-item']=icon
  seed=Image.new('RGBA',(16,16));d=ImageDraw.Draw(seed);d.rectangle((3,1,12,14),fill='#675543');d.rectangle((4,2,11,13),fill='#ddbd85');d.rectangle((4,2,11,4),fill='#f1d8a4');seed.alpha_composite(icon.resize((8,8),Image.Resampling.NEAREST),(4,5));assets[c+'-seed-item']=seed
  for stage in ('seed','sprout','young','flowering','ripe','dry','wilted','dead'):
   im=Image.new('RGBA',(24,32));d=ImageDraw.Draw(im);dead=stage=='dead';weak=stage in ('dry','wilted');ink='#384329';green='#86984d' if not weak else '#9c925b';light='#b0bd6c' if not weak else '#c1ad76'
   if stage=='seed':d.line((10,27,13,27),fill='#d0b584');d.point((11,26),fill='#edcf96')
   elif dead:d.line((12,28,11,19),fill='#97764d',width=2);d.line((11,24,6,22),fill='#a8885c');d.line((11,22,16,23),fill='#a8885c')
   else:
    vine=c in ('cucumber','watermelon','pumpkin','sweetPotato');low=stage=='sprout';top=22 if low else 15 if vine else 8
    if weak:top+=4 if stage=='wilted' else 2
    d.line((12,28,12,top),fill=ink,width=3);d.line((12,27,12,top),fill='#798749')
    leaves=[(7,24),(17,23)] if low else [(5,24),(18,23),(7,17),(17,14),(11,10)] if not vine else [(4,26),(8,21),(17,24),(20,19),(13,18)]
    for x,y in leaves:
     if weak:y+=2
     d.line((12,27,x,y),fill=ink);d.polygon([(x-3,y),(x,y-4),(x+3,y),(x+2,y+3),(x-2,y+2)],fill=ink);d.polygon([(x-2,y),(x,y-3),(x+2,y),(x,y+2)],fill=green);d.line((x-1,y,x,y-2),fill=light)
    if stage=='flowering':
     for x,y in [(6,19),(16,22)]:d.rectangle((x-1,y-1,x+1,y+1),fill='#e7d79a');d.point((x,y),fill='#d2aa57')
    if stage=='ripe':
     for x,y in ([(6,25),(18,27)] if vine else [(6,18),(17,22)]):fruit(d,c,x,y,small=True)
   assets[c+'-'+stage]=im
 # Verified native sheets replace only their existing plant-key families.
 for crop in IMPORTED_CROPS:
  for state,frame in candidate_frames(ROOT/'docs/assets/licenses'/f'{crop}-import-v1').items():assets[crop+'-'+state]=frame
 shovel=Image.new('RGBA',(16,16));d=ImageDraw.Draw(shovel);d.line((4,2,11,10),fill='#504734',width=3);d.line((4,2,11,10),fill='#bb9363');d.polygon([(9,8),(13,7),(15,11),(12,15),(8,12)],fill='#444d43');d.polygon([(10,9),(13,8),(14,11),(12,13),(9,11)],fill='#b1b5a2');assets['shovel-item']=shovel
 # Metal watering can: open handle, curved tank, long spout and perforated rose.
 can=Image.new('RGBA',(16,16));d=ImageDraw.Draw(can)
 d.rectangle((1,3,6,8),fill='#394c48');d.rectangle((2,4,5,7),fill=(0,0,0,0));d.line((2,3,5,3),fill='#b3bdb0')
 d.polygon([(4,6),(10,6),(11,9),(10,13),(5,13),(3,10)],fill='#344a45')
 d.polygon([(5,7),(9,7),(10,9),(9,12),(5,12),(4,10)],fill='#7c9991')
 d.line((5,8,5,10),fill='#d1d4bb');d.line((6,12,9,12),fill='#526f67')
 d.rectangle((5,5,9,6),fill='#3f5b54');d.line((6,5,8,5),fill='#bcc7b0')
 d.polygon([(10,10),(12,8),(13,4),(15,4),(14,9),(11,12)],fill='#3c554e')
 d.line((11,10,13,6),fill='#a3b8a4');d.rectangle((12,3,15,5),fill='#526d61');d.line((13,3,15,3),fill='#e0dabc');d.point((14,4),fill='#bdcabc')
 assets['watering-can-item']=can
 # Original project crops adopt the garden's olive leaf palette.
 mapping={'#344b40':'#384329','#699458':'#829448','#3f8055':'#738b42','#8cbd69':'#b0bd6c','#66985a':'#829448','#a7c575':'#b0bd6c','#528b64':'#718644','#63975e':'#7a9046','#8dc06c':'#adbb64','#5b9167':'#708344','#82b572':'#9cae59'}
 from PIL import ImageColor
 mapping={ImageColor.getrgb(k):ImageColor.getrgb(v) for k,v in mapping.items()}
 for key in [n for n in assets if any(n.startswith(c+'-') for c in ('tomato','strawberry','carrot','corn')) and n.endswith('-item')]:
  im=assets[key];im.putdata([(*mapping.get(p[:3],p[:3]),p[3]) for p in im.getdata()])

 # Shared utility tools and larger crop emblems also cover the original four crops.
 from garden_tools_art import add_garden_tools_art
 add_garden_tools_art(assets)
