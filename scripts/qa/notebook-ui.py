"""Approximate offline render of actual UI draw commands, not a browser capture."""
import json,math,re,sys
from pathlib import Path
from PIL import Image,ImageDraw
base=Path.cwd();processed=base/'public/assets/pixel/processed';atlas=Image.open(processed/'town.png').convert('RGBA');frames=json.loads((processed/'town.json').read_text())['frames'];world=Image.open(base/'public/assets/pixel/world.png').convert('RGBA');wf=json.loads((base/'public/assets/pixel/world.json').read_text())['frames'];font=Image.open(base/'public/assets/pixel/font.png').convert('RGBA');xml=(base/'public/assets/pixel/font.xml').read_text();glyphs={}
for m in re.finditer(r'<char ([^>]+)/>',xml):
 d={k:int(v) for k,v in re.findall(r'(\w+)="([^"]+)"',m[1])};glyphs[chr(d['id'])]=d
outdir=base/(sys.argv[1] if len(sys.argv)>1 else 'docs/verification/notebook-ui');outdir.mkdir(parents=True,exist_ok=True)
def color(c):return (c>>16&255,c>>8&255,c&255)
def advance(s,size):return sum(glyphs.get(c,{}).get('xadvance',0)*size/8 for c in s)
def lines(s,size,limit):
 output=[]
 for line in s.split('\n'):
  row=''
  for word in line.split(' '):
   t=row+' '+word if row else word
   if limit and advance(t,size)>limit and row:output.append(row);row=word
   else:row=t
  output.append(row)
 return output
for p in sorted(Path('/tmp/simplelife-notebook-ui').glob('*.json')):
 r=json.loads(p.read_text());w,h=r['width'],r['height'];im=Image.open(base/'docs/verification/forest-expansion/homewood-study.png').convert('RGBA').resize((w,h),Image.Resampling.NEAREST);textures={t['key']:Image.frombytes('RGBA',(t['w'],t['h']),bytes(t['pixels'])) for t in r['textures']}
 def patch(image,x,y,alpha=1):
  if alpha<1:image=image.copy();image.putalpha(image.getchannel('A').point(lambda a:round(a*alpha)))
  im.alpha_composite(image,(round(x),round(y)))
 def rect(x,y,ww,hh,c,alpha):
  if ww>0 and hh>0:patch(Image.new('RGBA',(max(1,round(ww)),max(1,round(hh))),(*color(c),round(alpha*255))),x,y)
 def visit(n,px=0,py=0,sx=2,sy=2,alpha=1):
  if not n['visible']:return
  x=px+n['x']*sx;y=py+n['y']*sy;sx*=n['sx'];sy*=n['sy'];alpha*=n['alpha'];kind=n['type']
  if kind=='graphics':
   for c in n['commands']:
    xx=x+c['x']*sx;yy=y+c['y']*sy;ww=c['w']*sx;hh=c['h']*sy
    if c['type']=='rect':rect(xx,yy,ww,hh,c['color'],alpha*c['alpha'])
    else:
     thick=c['width'];
     for a,b,cw,ch in [(xx,yy,ww,thick*sy),(xx,yy+hh-thick*sy,ww,thick*sy),(xx,yy,thick*sx,hh),(xx+ww-thick*sx,yy,thick*sx,hh)]:rect(a,b,cw,ch,c['color'],alpha*c['alpha'])
  elif kind=='rectangle':rect(x-n['ox']*n['w']*sx,y-n['oy']*n['h']*sy,n['w']*sx,n['h']*sy,n['color'],alpha)
  elif kind=='image':
   key=n['texture'];f=n.get('frame',0)
   if key in textures:art=textures[key]
   elif key in ['boy','girl']:
    sheet=Image.open(processed/(key+'.png')).convert('RGBA');art=sheet.crop(((f%9)*24,(f//9)*32,(f%9+1)*24,(f//9+1)*32))
   else:
    table=frames if key=='town' else wf;sheet=atlas if key=='town' else world
    if f not in table:raise ValueError('Missing actual frame '+str(f))
    d=table[f]['frame'];art=sheet.crop((d['x'],d['y'],d['x']+d['w'],d['y']+d['h']))
   if n.get('tint') is not None:
    tinted=Image.new('RGBA',art.size,(*color(n['tint']),255));tinted.putalpha(art.getchannel('A'));art=tinted
   xx=x-n['ox']*art.width*sx;yy=y-n['oy']*art.height*sy;patch(art.resize((round(art.width*sx),round(art.height*sy)),Image.Resampling.NEAREST),xx,yy,alpha)
  elif kind=='text' and n.get('fontHasInk',True):
   size=n['size'];rows=lines(n['text'],size,n.get('maxWidth'));tw=max(advance(s,size) for s in rows);th=len(rows)*size/8*10;x-=tw*n['ox']*sx;y-=th*n['oy']*sy
   for i,line in enumerate(rows):
    xx=x+(tw-advance(line,size))*sx/2 if n.get('align')=='center' else x
    for ch in line:
     if ch not in glyphs:continue
     d=glyphs[ch];art=font.crop((d['x'],d['y'],d['x']+d['width'],d['y']+d['height']));t=Image.new('RGBA',art.size,(*color(n['fontColor']),255));t.putalpha(art.getchannel('A'));sizeX=max(1,round(art.width*size/8*sx));sizeY=max(1,round(art.height*size/8*sy));patch(t.resize((sizeX,sizeY),Image.Resampling.NEAREST),xx+d['xoffset']*size/8*sx,y+(i*10+d['yoffset'])*size/8*sy,alpha);xx+=d['xadvance']*size/8*sx
  for child in n['children']:visit(child,x,y,sx,sy,alpha)
 visit(r['root']);label=Image.new('RGB',(w,h+24),'#263e38');label.paste(im.convert('RGB'),(0,24));ImageDraw.Draw(label).text((6,6),'OFFLINE UI STUDY / NOT A BROWSER CAPTURE',fill='#fff0c8');label.save(outdir/(p.stem+'.png'))
print('42 labelled offline UI studies')
