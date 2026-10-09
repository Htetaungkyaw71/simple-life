"""Update house cells in place and append the town-only art without repacking other art."""
from PIL import Image,ImageDraw
from pathlib import Path
import json
from city_art import add_city_art
out=Path('public/assets/pixel/processed');meta=json.loads((out/'town.json').read_text());atlas=Image.open(out/'town.png').convert('RGBA');assets={}
# Always adapt native licensed houses, making this extension idempotent.
import zipfile,io
z=zipfile.ZipFile('public/assets/vendor/limezu/serene-village/Serene_Village_revamped_v1.9.zip');sheet=Image.open(io.BytesIO(z.read('SERENE_VILLAGE_REVAMPED/Serene_Village_16x16.png'))).convert('RGBA')
for name,box in [('shed',(0,464,48,528)),('house',(160,336,240,400)),('house-blue',(160,592,240,656)),('house-green',(160,464,240,528)),('seed-shop',(160,464,240,528)),('produce-shop',(160,336,240,400))]:assets[name]=sheet.crop(box)
for name in ['house','house-blue','house-green','seed-shop','produce-shop']:
 d=ImageDraw.Draw(assets[name]);d.rectangle((58,5,65,19),fill='#694757');d.rectangle((59,6,64,18),fill='#a87e7c');d.rectangle((57,4,66,6),fill='#d2a891');d.rectangle((59,10,63,10),fill='#d2a891');d.rectangle((60,14,64,14),fill='#d2a891')
for name,color in [('seed-shop','#719e91'),('produce-shop','#c97770')]:
 d=ImageDraw.Draw(assets[name]);d.polygon([(8,38),(67,38),(70,46),(5,46)],fill='#694757')
 for x in range(8,68,8):d.rectangle((x,38,x+6,45),fill=color if (x//8)%2 else '#efd6a0');d.rectangle((x,46,x+6,48),fill=color if (x//8)%2 else '#d6bc95')
provenance=add_city_art(assets);x=0;y=max(f['frame']['y']+f['frame']['h'] for f in meta['frames'].values())+2;row=0
for name,im in assets.items():
 if name in meta['frames']:
  r=meta['frames'][name]['frame'];assert (im.width,im.height)==(r['w'],r['h']);atlas.paste(im,(r['x'],r['y']));continue
 if x+im.width>atlas.width:x=0;y+=row+2;row=0
 assert y+im.height<=atlas.height
 atlas.paste(im,(x,y));meta['frames'][name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}};x+=im.width+2;row=max(row,im.height)
atlas.save(out/'town.png');(out/'town.json').write_text(json.dumps(meta,indent=2)+'\n');manifest=json.loads((out/'manifest.json').read_text());manifest['townResidents']=provenance;manifest['originalHouses']=[n for n in assets if n.startswith('house-village-')];manifest['cityOriginalAdditions']=[n for n in assets if n.startswith('city-')];manifest['atlasComposition']='LimeZu CC BY 4.0 environment, Pipoya custom game-use human residents, Craftpix Freebie Products section 2, ToffeeCraft Standard Free personal-use scenery, and original project additions; licences apply per source.';manifest['cityAdaptations']='LimeZu houses: original roof cells muted terracotta, plaster/timber facades, arched windows, flowerboxes and ivy; alpha/geometry retained. Original fountain, lamp, planted bench, flowerpot and tent.';(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print('City frames:',len(assets),'total:',len(meta['frames']))
