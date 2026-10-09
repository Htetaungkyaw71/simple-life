"""Integrate only selected rocky objects and enhance original houses in-place.
The user-owned archive remains external. No PSD/source pack enters production.
"""
from pathlib import Path
from PIL import Image,ImageDraw
import io,json,zipfile,os,hashlib
from large_houses_art import add_large_houses_art
out=Path('public/assets/pixel/processed')
meta=json.loads((out/'town.json').read_text());atlas=Image.open(out/'town.png').convert('RGBA')
assets={};add_large_houses_art(assets)
archive=Path(os.environ.get('SIMPLE_LIFE_ROCKY_ZIP','/Users/mac/Downloads/craftpix-net-639143-free-rocky-area-objects-pixel-art.zip'))
selection={'cave':'Cave_entrance1','bones':'Dragon_bones_full','deer':'Rock_statue_deer','fox':'Rock_statue_fox','rock':'Oval_rock1','mushroom':'Black_mushrooms1','orange':'Orange_mushrooms1','cairn':'Stone_pyramid1'}
record={'archiveSha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'creator':'CraftPix','source':'https://craftpix.net/freebies/free-rocky-area-objects-pixel-art/','license':'CraftPix Freebie Products section 2','selected':[]}
with zipfile.ZipFile(archive) as z:
 for key,stem in selection.items():
  file='PNG/Objects_separately/'+stem+'_grass_shadow.png';raw=z.read(file);im=Image.open(io.BytesIO(raw)).convert('RGBA');box=im.getbbox();im=im.crop(box)
  assets['rocky-'+key]=im
  record['selected'].append({'frame':'rocky-'+key,'member':file,'sha256':hashlib.sha256(raw).hexdigest(),'crop':list(box),'size':list(im.size),'changes':'Transparent margins cropped; native pixels and alpha retained.'})
x=0;y=max(f['frame']['y']+f['frame']['h'] for f in meta['frames'].values())+2;row=0
for name,im in assets.items():
 if name in meta['frames']:
  r=meta['frames'][name]['frame'];assert (im.width,im.height)==(r['w'],r['h']);atlas.paste(im,(r['x'],r['y']));continue
 if x+im.width>atlas.width:x=0;y+=row+2;row=0
 assert y+im.height<=atlas.height
 atlas.paste(im,(x,y));meta['frames'][name]={'frame':{'x':x,'y':y,'w':im.width,'h':im.height},'rotated':False,'trimmed':False,'spriteSourceSize':{'x':0,'y':0,'w':im.width,'h':im.height},'sourceSize':{'w':im.width,'h':im.height}}
 x+=im.width+2;row=max(row,im.height)
atlas.save(out/'town.png');(out/'town.json').write_text(json.dumps(meta,indent=2)+'\n')
manifest=json.loads((out/'manifest.json').read_text());manifest['rockyObjects']=record;manifest['houseDepth']='Original three-quarter roof and wall silhouettes, recessed windows/doors, return-wall windows, tiled roof planes and masonry relief; shared opaque collision rows regenerated, established door approaches retained.'
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
proof=Path('docs/assets/licenses/rocky-depth');proof.mkdir(parents=True,exist_ok=True)
(proof/'selected-assets.json').write_text(json.dumps(record,indent=2)+'\n')
print('Atlas frames:',len(meta['frames']))
