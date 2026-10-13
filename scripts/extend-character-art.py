"""Update twelve planted seeds and regenerate current tall CC0-derived people."""
from pathlib import Path
from PIL import Image
import json
from people_art import update_atlas
from garden_tools_art import add_garden_tools_art, CROPS

out=Path('public/assets/pixel/processed')
meta=json.loads((out/'town.json').read_text());atlas=Image.open(out/'town.png').convert('RGBA')
items={}
for c in CROPS:
    r=meta['frames'][c+'-item']['frame']
    items[c+'-item']=atlas.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
add_garden_tools_art(items)
assets={c+'-seed':items[c+'-seed'] for c in CROPS}

x=0;y=max(f['frame']['y']+f['frame']['h'] for f in meta['frames'].values())+2;row=0
for name,im in assets.items():
    if name in meta['frames']:
        r=meta['frames'][name]['frame'];assert (im.width,im.height)==(r['w'],r['h'])
        atlas.paste(im,(r['x'],r['y']));continue
    if x+im.width>atlas.width:x=0;y+=row+2;row=0
    assert y+im.height<=atlas.height
    atlas.paste(im,(x,y));meta['frames'][name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}}
    x+=im.width+2;row=max(row,im.height)
atlas.save(out/'town.png');(out/'town.json').write_text(json.dumps(meta,indent=2)+'\n')
manifest=json.loads((out/'manifest.json').read_text())
manifest['plantedSeeds']='Original ground-level seed grains and soil mound; inventory packets stay in menus.'
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
update_atlas()
print('Updated seeds and regenerated current 24x40 people')
