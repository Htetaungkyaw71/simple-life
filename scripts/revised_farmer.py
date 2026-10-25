"""Keep original v2 pixels; match game size with display scaling."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import math

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'docs/assets/licenses/farmer-boy-revised-v2/runtime-source'
DIRECTIONS = ['down', 'up', 'left', 'right']
SOURCE_SIZE, SIZE, GROUND, SCALE, COLUMNS = 64, 64, 56, 1.5, 8

def sha(data):
    return hashlib.sha256(data).hexdigest()

def hand(im, direction):
    side = -1 if direction in ('up', 'right') else 1
    skin = []
    for y in range(32, 51):
        for x in range(SIZE):
            r, g, b, a = im.getpixel((x, y))
            if a == 255 and r > 120 and r > g * 1.25 and g > b * 1.25:
                skin.append((x, y))
    assert skin, direction
    preferred = [(x, y) for x, y in skin if (x - SIZE / 2) * side >= 1] or skin
    extreme = max(x * side for x, y in preferred)
    edge = [(x, y) for x, y in preferred if x * side == extreme]
    x, y = edge[len(edge) // 2]
    return [round((x - SIZE / 2 + .5) * SCALE), round((y - GROUND + .5) * SCALE)]

def wrist_angle(im, grip):
    x, y = grip[0]/SCALE+32-.5, grip[1]/SCALE+GROUND-.5
    sleeve = []
    for sy in range(max(0, round(y)-7), min(SIZE, round(y)+3)):
        for sx in range(max(0, round(x)-7), min(SIZE, round(x)+8)):
            r,g,b,a = im.getpixel((sx,sy))
            if a and r>190 and g>170 and b>140 and g>r*.78:
                sleeve.append((sx,sy))
    if not sleeve:
        return 0
    sx,sy = min(sleeve,key=lambda p:(p[0]-x)**2+(p[1]-y)**2)
    return math.atan2(x-sx, max(1,y-sy))

def write_farmer():
    metadata = json.loads((SOURCE / 'animations.json').read_text())
    actions = list(dict.fromkeys(c['action'] for c in metadata['clips']))
    extension_path = ROOT / 'output/art/farmer-boy-extension-v1'
    extension = json.loads((extension_path / 'manifest.json').read_text()) if (extension_path / 'manifest.json').exists() else None
    rows = 34 if extension else 4 * len(actions)
    sheet = Image.new('RGBA', (SIZE * COLUMNS, SIZE * rows))
    hands = {direction: [] for direction in DIRECTIONS}
    clips, records = {}, []
    angles = {direction:{} for direction in DIRECTIONS}
    for action_index, action in enumerate(actions):
        source = Image.open(SOURCE / f'{action}.png').convert('RGBA')
        entries = [c for c in metadata['clips'] if c['action'] == action]
        count = entries[0]['columns']
        assert source.size == (SOURCE_SIZE * count, SOURCE_SIZE * 4)
        offset = action_index * COLUMNS * 4
        clips[action] = {'offset': offset, 'count': count,
                         'durations': entries[0]['frameDurationsMs'], 'loop': entries[0]['loop']}
        for row, direction in enumerate(DIRECTIONS):
            assert entries[row]['row'] == row
            for frame in range(count):
                original = source.crop((frame * SOURCE_SIZE, row * SOURCE_SIZE, (frame + 1) * SOURCE_SIZE, (row + 1) * SOURCE_SIZE))
                # Retain fine face details, including one-pixel eyes. Render
                # the original artwork at the accepted smaller world size.
                im = original
                sheet.paste(im, (frame * SIZE, (action_index * 4 + row) * SIZE))
                if action in ('idle', 'running'):
                    hands[direction].append(hand(im, direction))
                    angles[direction].setdefault(action,[]).append(wrist_angle(im,hand(im,direction)))
                records.append({'action': action, 'direction': direction, 'phase': frame,
                                'frame': offset + row * COLUMNS + frame, 'rgbaSHA256': sha(im.tobytes()),
                                'sourceRGBA_SHA256': sha(original.tobytes())})
    sheet.save(ROOT / 'public/assets/pixel/processed/boy.png')
    # Hands use the animation's local phase; work poses already include their tools.
    grips = {direction: {'idle': poses[:4], 'running': poses[4:]} for direction, poses in hands.items()}
    tools = {}
    if extension:
        jump = Image.open(extension_path / 'sheets/jumping.png').convert('RGBA')
        clips['jumping'] = extension['jump']
        for row, direction in enumerate(DIRECTIONS):
            grips[direction]['jumping'] = extension['jumpHands'][direction]
            for phase in range(6):
                im = jump.crop((phase*64,row*64,(phase+1)*64,(row+1)*64))
                sheet.paste(im,(phase*64,(28+row)*64))
                angles[direction].setdefault('jumping',[]).append(wrist_angle(im,grips[direction]['jumping'][phase]))
        carried = Image.open(extension_path / 'sheets/carried-tools.png').convert('RGBA')
        sheet.paste(carried,(0,32*64))
        tools = extension['toolFrames']
        sheet.save(ROOT / 'public/assets/pixel/processed/boy.png')
    # Small angle changes follow the painted sleeve-to-hand axis, relative to
    # its neutral carry view. Quantized steps avoid noisy subpixel jitter.
    for direction, modes in angles.items():
        base = modes['idle'][0]
        for mode, values in modes.items():
            modes[mode] = [round(max(-.26,min(.26,(v-base)*.25))/.087266)*.087266 for v in values]
    (ROOT / 'src/data/revisedFarmer.js').write_text(
        '// Original v2 pixels, display scale 1.5; generated by scripts/revised_farmer.py.\n'
        + 'export const BOY_CLIPS=' + json.dumps(clips, separators=(',', ':')) + ';\n'
        + 'export const BOY_HANDS=' + json.dumps(grips, separators=(',', ':')) + ';\n'
        + 'export const BOY_TOOL_FRAMES=' + json.dumps(tools, separators=(',', ':')) + ';\n'
        + 'export const BOY_CARRY_ANGLES=' + json.dumps(angles, separators=(',', ':')) + ';\n')
    record = {'sourceRecord': 'docs/assets/licenses/farmer-boy-revised-v2/SOURCE_RECORD.md',
              'size': [SIZE, SIZE], 'columns': COLUMNS, 'groundRow': GROUND, 'scale': SCALE,
              'sourceSize': [SOURCE_SIZE, SOURCE_SIZE], 'conversion': 'Byte-preserving whole-frame packing; display scale 1.5; no resizing/recolour/limb warps',
              'pixelsPreserved': True, 'sourceSheetsUnchanged': True, 'frames': records,
              'extensionRecord': 'output/art/farmer-boy-extension-v1/manifest.json' if extension else None,
              'runtimeSHA256': sha((ROOT / 'public/assets/pixel/processed/boy.png').read_bytes())}
    (SOURCE.parent / 'runtime-record.json').write_text(json.dumps(record, indent=2) + '\n')
    return record

if __name__ == '__main__':
    r = write_farmer()
    print(json.dumps({'frames': len(r['frames']), 'runtimeSHA256': r['runtimeSHA256']}))
