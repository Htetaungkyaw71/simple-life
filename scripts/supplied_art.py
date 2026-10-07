"""Selected user-supplied artwork, packed locally; originals never shipped.

Source archives remain with the user. Override SIMPLE_LIFE_FARMER_RAR and
SIMPLE_LIFE_ENV_ZIP to regenerate on another machine with Pillow and bsdtar.
See docs/assets/licenses/supplied-farmer-environment/SOURCE_RECORD.md.
"""
from pathlib import Path
from PIL import Image
import io, os, subprocess, zipfile

def write_supplied_farmers(out):
    archive = Path(os.environ.get('SIMPLE_LIFE_FARMER_RAR', str(Path.home() / 'Downloads/Cute Farmer Character by Channeechan.rar')))
    records = {}
    for character, number in [('boy', '001'), ('girl', '002')]:
        sheets = {}
        for action in ['Idle', 'Walk']:
            entry = f'Cute Farmer Character by Channeechan/Farmer{number}-{action}.png'
            sheets[action] = Image.open(io.BytesIO(subprocess.check_output(['bsdtar', '-xOf', str(archive), entry]))).convert('RGBA')
        out_sheet = Image.new('RGBA', (216, 128))
        # Source rows down/right/up/left. Trim transparent padding only.
        for row, source_row in enumerate([0, 2, 3, 1]):
            def cell(action, n):
                return sheets[action].crop((n*64+20, source_row*64+18, n*64+44, source_row*64+50))
            poses = [cell('Idle', 0)] + [cell('Walk', n) for n in range(4)] + [cell('Idle', 2)]
            base = poses[0]
            # Adapt the licensed body for crouch / tucked feet / landing;
            # preserve the supplied face/hair pixels and native source scale.
            for frame in range(3):
                im = Image.new('RGBA', (24, 32))
                torso = base.crop((0, 0, 24, 23))
                im.alpha_composite(torso, (0, 1 if frame != 1 else 0))
                legs = base.crop((0, 23, 24, 30))
                if frame == 1:
                    im.alpha_composite(legs.crop((0, 2, 24, 7)), (0, 23))
                else:
                    im.alpha_composite(legs, (0, 23))
                poses.append(im)
            for col, im in enumerate(poses):
                out_sheet.alpha_composite(im, (col*24, row*32))
        out_sheet.save(out / f'{character}.png')
        records[character] = {'creator':'Channeechan','sourceURL':'https://channeechan.itch.io/cute-farmer-character','license':'Creator game-use terms: commercial/noncommercial; modifications allowed; no standalone resale/original-file redistribution','templateCreator':'Eris Esra','source': f'Farmer{number}-Idle.png / Farmer{number}-Walk.png', 'sourceCellSize': [64,64], 'trim': [20,18,44,50], 'sourceRows': [0,2,3,1], 'idleSourceColumns': [0,2], 'walkSourceColumns': [0,1,2,3], 'jump': 'three adapted poses from supplied idle pixels'}
    return records

def add_supplied_environment(assets):
    archive = Path(os.environ.get('SIMPLE_LIFE_ENV_ZIP', str(Path.home() / 'Downloads/FreeEnvironment.zip')))
    with zipfile.ZipFile(archive) as z:
        source = Image.open(io.BytesIO(z.read('FreeEnvironment/FreePack.png'))).convert('RGBA')
    boxes = {
        'env-pine-jade': [200,270,252,384],
        'env-pine-olive': [104,270,156,384],
        'env-pine-snow': [4,270,64,384],
        'env-fir': [4,136,96,256],
        'env-agave': [130,46,224,128],
        'env-dry-plant': [226,58,318,128],
        'env-boulder': [398,170,502,242],
        'env-ice': [388,270,510,374],
    }
    for name, box in boxes.items():
        assets[name] = source.crop(box)
    return boxes
