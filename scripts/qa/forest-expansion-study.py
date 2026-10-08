"""Offline approximate sprite composition; not Phaser/browser verification."""
import json,math
from pathlib import Path
from PIL import Image,ImageDraw
base=Path.cwd();a=base/'public/assets/pixel/processed'
frames=json.loads((a/'town.json').read_text())['frames'];atlas=Image.open(a/'town.png').convert('RGBA');m=json.loads(Path('/tmp/simplelife-expansion-map.json').read_text());floor=Image.frombytes('RGBA',(m['size']['width']//2,m['size']['height']//2),Path('/tmp/simplelife-expansion-floor.rgba').read_bytes());cache={}
tones=[(43,51,31),(58,69,36),(78,91,43),(103,116,53),(129,140,68),(154,164,88),(181,187,116),(207,211,155)]
def sprite(key,tone=False):
 if (key,tone) in cache:return cache[(key,tone)].copy()
 if key not in frames:return None
 f=frames[key]['frame'];im=atlas.crop((f['x'],f['y'],f['x']+f['w'],f['y']+f['h']))
 if tone:
  px=im.load()
  for y in range(im.height):
   for x in range(im.width):
    r,g,b,alpha=px[x,y]
    if alpha and (r,g,b)==(52,52,79):px[x,y]=(*tones[0],alpha)
    elif alpha and g>r*1.03 and g>=b*.82 and max(r,g,b)-min(r,g,b)>=10:
     k=sum(.24*r+.60*g+.16*b>=t for t in [44,65,87,110,137,165,195]);px[x,y]=(*tones[k],alpha)
 cache[(key,tone)]=im;return im.copy()

def study(name,cx,cy):
 left=max(0,min(floor.width-640,int(cx/2-320)));top=max(0,min(floor.height-360,int(cy/2-180)));out=floor.crop((left,top,left+640,top+360));objects=[]
 for p in m['props']:
  key=p['name'];tree=key in ['tree','snow-pine','palm-tree','willow-tree','broadleaf-tree'];v=abs(math.floor(p['x']/32+p['y']/32));foot=p['y']+90;x=p['x']+32
  if tree:
   key='forest-palm-'+str(v%2) if key=='palm-tree' else 'willow-tree' if key=='willow-tree' else 'forest-oak-'+str(v%3) if key=='broadleaf-tree' else 'env-pine-snow' if key=='snow-pine' else 'env-pine-olive' if v%5==0 else 'forest-oak-'+str(v%3)
   im=sprite(key,True)
   if im is None:continue
   xx=round(x/2-im.width/2-left);yy=round(foot/2-im.height-top);depth=foot
   if abs(cx-x)<im.width+12 and cy<foot and cy>foot-im.height*2:im.putalpha(im.getchannel('A').point(lambda a:a//2))
  else:
   im=sprite(key,key.endswith('-tree') or key=='bamboo-clump' or key.startswith('forest-palmetto-'))
   if im is None:continue
   xx=round(p['x']/2-left);yy=round(p['y']/2-top);depth=p['y']+(90 if key.startswith('tree') or key.endswith('-tree') else im.height*2)
  if xx>640 or yy>360 or xx+im.width<0 or yy+im.height<0:continue
  objects.append((depth,im,xx,yy))
 for p in m['details']:
  im=sprite(p['name'])
  if im is not None:objects.append((0,im,round(p['x']/2-left),round(p['y']/2-top)))
 for g in m['grass']:
  key='tall-grass-'+('snow-' if g['snow'] else 'dry-' if g['dry'] else '')+str(g['variant'])+'-0';im=sprite(key)
  xx=round(g['x']/2-im.width/2-left);yy=round(g['y']/2-im.height-top)
  if -24<xx<640 and -24<yy<360:objects.append((g['y']-1,im,xx,yy))
 farmer=Image.open(a/'boy.png').crop((0,0,24,32));objects.append((cy,farmer,round(cx/2-left)-12,round(cy/2-top)-32))
 for _,im,x,y in sorted(objects,key=lambda a:a[0]):out.alpha_composite(im,(x,y))
 out=out.resize((1280,720),Image.Resampling.NEAREST);d=ImageDraw.Draw(out);d.rectangle((10,10,330,34),fill='#263e38');d.text((18,18),'OFFLINE ART STUDY / NOT A BROWSER CAPTURE',fill='#ffedcc')
 dest=base/'docs/verification/forest-expansion';dest.mkdir(parents=True,exist_ok=True);out.convert('RGB').save(dest/(name+'.png'))
study('homewood-study',640,4848);study('eastern-grove-study',5640,1880);study('riversong-study',7440,2792)
