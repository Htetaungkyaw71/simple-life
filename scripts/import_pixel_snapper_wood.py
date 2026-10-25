"""Import the reviewed user-supplied log bundle into the existing 16 px wood frame."""
from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'output/art/pixel-snapper-wood-v1/source/wood-bundle.png'
ATLAS=ROOT/'public/assets/pixel/processed/town.png'
META=ATLAS.with_suffix('.json')
PREVIEW=ROOT/'output/art/pixel-snapper-wood-v1/wood-item-preview.png'

source=Image.open(SOURCE).convert('RGBA')
box=source.getbbox()
if box is None:
 raise SystemExit('Supplied wood source has no visible pixels')
bundle=source.crop(box)
bundle.thumbnail((15,12),Image.Resampling.NEAREST)
icon=Image.new('RGBA',(16,16))
icon.alpha_composite(bundle,((16-bundle.width)//2,16-bundle.height))

meta=json.loads(META.read_text())
frame=meta['frames']['wood-item']['frame']
if (frame['w'],frame['h'])!=(16,16):
 raise SystemExit('wood-item is no longer the expected 16x16 frame')
atlas=Image.open(ATLAS).convert('RGBA')
atlas.paste((0,0,0,0),(frame['x'],frame['y'],frame['x']+16,frame['y']+16))
atlas.alpha_composite(icon,(frame['x'],frame['y']))
atlas.save(ATLAS)
PREVIEW.parent.mkdir(parents=True,exist_ok=True)
icon.resize((256,256),Image.Resampling.NEAREST).save(PREVIEW)
print(f'Imported {SOURCE.name} {source.size} visible={box} -> wood-item {bundle.size}')
