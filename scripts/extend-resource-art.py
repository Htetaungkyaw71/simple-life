"""Append original meat/stone cells without changing any existing atlas pixel."""
from pathlib import Path
from PIL import Image
import json
from hunting_resources_art import add_hunting_resources_art

out=Path('public/assets/pixel/processed')
meta=json.loads((out/'town.json').read_text());atlas=Image.open(out/'town.png').convert('RGBA')
assets={};add_hunting_resources_art(assets)
x=0;y=max(f['frame']['y']+f['frame']['h'] for f in meta['frames'].values())+2;row=0
for name,im in assets.items():
    if name in meta['frames']:
        r=meta['frames'][name]['frame'];atlas.paste(im,(r['x'],r['y']));continue
    if x+im.width>atlas.width:x=0;y+=row+2;row=0
    assert y+im.height<=atlas.height
    atlas.paste(im,(x,y));meta['frames'][name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}}
    x+=im.width+2;row=max(row,im.height)
atlas.save(out/'town.png');(out/'town.json').write_text(json.dumps(meta,indent=2)+'\n')
manifest=json.loads((out/'manifest.json').read_text())
manifest['originalAdditions']=list(dict.fromkeys(manifest['originalAdditions']+list(assets)))
manifest['huntingResources']='Original meat meal, stone inventory and loose-stone cells; scripts/hunting_resources_art.py'
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Atlas frames:',len(meta['frames']))
