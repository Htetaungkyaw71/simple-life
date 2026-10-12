"""Bake requested native-16 TTFs into binary-alpha local Phaser bitmap fonts."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import xml.etree.ElementTree as ET
import hashlib,json
root=Path(__file__).resolve().parents[1]
source=root/'docs/assets/licenses/ui-fonts/source';out=root/'public/assets/pixel/fonts';out.mkdir(parents=True,exist_ok=True)
rows=[]
for name,file in [('thaleah','ThaleahFat.ttf'),('m5x7','m5x7.ttf')]:
 font=ImageFont.truetype(str(source/file),16);sheet=Image.new('RGBA',(256,96));chars=[]
 for i,code in enumerate(range(32,127)):
  c=chr(code);box=font.getbbox(c);left,top,right,bottom=box;x=i%16*16;y=i//16*16
  mask=Image.new('1',(16,16));draw=ImageDraw.Draw(mask);draw.fontmode='1';draw.text((-left,-4),c,font=font,fill=1)
  glyph=Image.new('RGBA',(16,16),'white');glyph.putalpha(mask.convert('L'));sheet.alpha_composite(glyph,(x,y))
  chars.append(dict(id=code,x=x,y=y,width=max(1,right-left),height=max(1,bottom-4),xoffset=left,yoffset=0,xadvance=round(font.getlength(c)),page=0,chnl=15))
 sheet.save(out/(name+'.png'))
 xml=ET.Element('font');ET.SubElement(xml,'info',face=name,size='16');ET.SubElement(xml,'common',lineHeight='10',base='7',scaleW='256',scaleH='96',pages='1');pages=ET.SubElement(xml,'pages');ET.SubElement(pages,'page',id='0',file=name+'.png');cs=ET.SubElement(xml,'chars',count='95')
 for c in chars:ET.SubElement(cs,'char',**{k:str(v) for k,v in c.items()})
 ET.indent(xml);ET.ElementTree(xml).write(out/(name+'.xml'),encoding='UTF-8',xml_declaration=True)
 for p in [source/file,out/(name+'.png'),out/(name+'.xml')]:rows.append({'file':str(p.relative_to(root)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(source.parent/'manifest.json').write_text(json.dumps({'nativeSize':16,'pixelConversion':'Native 16px monochrome FreeType raster, no smoothing; common 10px line metrics, 2px extra leading at runtime, unchanged glyph silhouettes','files':rows},indent=2)+'\n')
print('Baked',len(rows),'source/runtime font records')
