"""Patch only the eight existing rectangles; preserve all other pixels and metadata."""
from pathlib import Path
from PIL import Image
import json,hashlib
from original_environment_art import original_environment
p=Path('public/assets/pixel/processed');atlas=Image.open(p/'town.png').convert('RGBA');frames=json.loads((p/'town.json').read_text())['frames'];records=[]
for name,im in original_environment().items():
 f=frames[name]['frame'];assert im.size==(f['w'],f['h']);atlas.paste(im,(f['x'],f['y']));records.append({'frame':name,'size':list(im.size),'sha256':hashlib.sha256(im.tobytes()).hexdigest(),'creator':'Simple Life / Codex-assisted source','source':'scripts/original_environment_art.py','license':'Original project work; competition use authorized by user; no exclusive-copyright claim'})
atlas.save(p/'town.png');(Path('docs/assets/licenses/story-audio')/'original-cells.json').write_text(json.dumps(records,indent=2)+'\n')
manifest=json.loads((p/'manifest.json').read_text());manifest['suppliedEnvironment']={};manifest['originalEnvironmentReplacements']=records;manifest['atlasComposition']=manifest['atlasComposition'].replace('ToffeeCraft Standard Free personal-use scenery, ','');(p/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Replaced eight uncertain cells, preserving frame rectangles and all other pixels.')
