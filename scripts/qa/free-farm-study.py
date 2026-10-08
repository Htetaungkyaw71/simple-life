"""Render recorded FarmView commands with original atlas pixels, offline only."""
from pathlib import Path
from PIL import Image,ImageDraw
import json
base=Path.cwd();source=Path('/tmp/simplelife-free-farm');out=base/'docs/verification/free-farming';out.mkdir(parents=True,exist_ok=True)
atlas=Image.open('public/assets/pixel/processed/town.png').convert('RGBA');frames=json.loads(Path('public/assets/pixel/processed/town.json').read_text())['frames'];boy=Image.open('public/assets/pixel/processed/boy.png').convert('RGBA');floor=Image.frombytes('RGBA',(1120,576),(source/'floor.rgba').read_bytes())
for name in ['growing','watered']:
 r=json.loads((source/(name+'.json')).read_text());im=floor.crop((140,50,780,410)).resize((1280,720),Image.Resampling.NEAREST);textures={t['key']:Image.frombytes('RGBA',(t['w'],t['h']),bytes(t['pixels'])) for t in r['textures']}
 def patch(art,x,y,alpha):
  if alpha<1:art=art.copy();art.putalpha(art.getchannel('A').point(lambda a:round(a*alpha)))
  im.alpha_composite(art,(round(x),round(y)))
 def visit(n,px=0,py=0,sx=2,sy=2,alpha=1):
  if not n['visible']:return
  x=px+n['x']*sx;y=py+n['y']*sy;sx*=n['sx'];sy*=n['sy'];alpha*=n['alpha']
  if n['type']=='image':
   if n['texture'] in textures:art=textures[n['texture']]
   elif n['texture']=='boy':art=boy.crop((0,0,24,32))
   elif n.get('frame') in frames:
    f=frames[n['frame']]['frame'];art=atlas.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h']))
   else:art=None
   if art is not None:
    art=art.resize((round(art.width*sx),round(art.height*sy)),Image.Resampling.NEAREST);patch(art,x-art.width*n['ox'],y-art.height*n['oy'],alpha)
  if n['type']=='graphics':
   for c in n['commands']:
    if c['type']!='rect':continue
    v=c['color'];art=Image.new('RGBA',(max(1,round(c['w']*sx)),max(1,round(c['h']*sy))),(v>>16&255,v>>8&255,v&255,round(255*alpha*c['alpha'])));patch(art,x+c['x']*sx,y+c['y']*sy,1)
  for child in sorted(n['children'],key=lambda a:a.get('depth') or 0):visit(child,x,y,sx,sy,alpha)
 visit(r['root']);d=ImageDraw.Draw(im);d.rectangle((0,0,1280,23),fill='#273d32');d.text((6,5),'OFFLINE FARM VIEW STUDY / NOT A BROWSER CAPTURE',fill='#f3eccf');im.save(out/(name+'-study.png'))
print('2 labelled offline Farm studies rendered')
