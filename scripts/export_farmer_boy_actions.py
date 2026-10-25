"""Pack imagegen-authored boy poses into native review/export assets.

This is offline resampling, alpha/palette conversion and atlas packing, not
procedural artwork or invented limb animation. Original PNGs stay untouched.
It does not replace a runtime texture or change gameplay.
"""
from pathlib import Path
from statistics import median
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/art/farmer-boy-actions-v1'
EVIDENCE = ROOT / 'docs/assets/licenses/farmer-boy-actions-v1'
DIRECTIONS = ['south', 'north', 'west', 'east']
COUNTS = {'idle': 1, 'running': 8, 'harvesting': 6, 'digging': 6,
          'chopping': 6, 'watering': 6, 'attack': 6}
FPS = {'idle': 1, 'running': 16, 'harvesting': 12, 'digging': 12,
       'chopping': 14, 'watering': 10, 'attack': 14}
SIZE, GROUND = 48, 40


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def splits(im, count, axis):
    """Separate rows/columns at clear gutters, avoiding raised tool clipping."""
    mask = im.getchannel('A').point(lambda a: 255 if a >= 128 else 0)
    extent = im.size[axis]
    histogram = []
    for i in range(extent):
        strip = mask.crop((i, 0, i+1, im.height) if axis == 0
                          else (0, i, im.width, i+1))
        histogram.append(strip.histogram()[255])
    result = [0]
    pitch = extent / count
    for i in range(1, count):
        centre = i*pitch
        lo, hi = round(centre-pitch*.20), round(centre+pitch*.20)
        minimum = min(histogram[lo:hi])
        candidates = [p for p in range(lo, hi) if histogram[p] == minimum]
        cut = min(candidates, key=lambda p: abs(p-centre))
        assert histogram[cut] == 0, ('No clear gutter', axis, i, cut)
        result.append(cut)
    return [*result, extent]


def cells(path, columns, rows):
    im = Image.open(path).convert('RGBA')
    xs = splits(im, columns, 0)
    # An axe raised in one column can extend into another column's row gutter.
    # Find each column's clear row gutters independently, then restore their
    # shared source-coordinate baseline with transparent padding.
    strips = [im.crop((xs[c], 0, xs[c+1], im.height)) for c in range(columns)]
    cuts = [splits(strip, rows, 1) for strip in strips]
    result = []
    for r in range(rows):
        top = min(ys[r] for ys in cuts)
        bottom = max(ys[r+1] for ys in cuts)
        row = []
        for strip, ys in zip(strips, cuts):
            cell = Image.new('RGBA', (strip.width, bottom-top))
            crop = strip.crop((0, ys[r], strip.width, ys[r+1]))
            cell.paste(crop, (0, ys[r]-top))
            row.append(cell)
        result.append(row)
    return result


def brown_points(im):
    return [(x, y) for y in range(im.height) for x in range(im.width)
            if (lambda p: p[3] >= 128 and 25 <= p[0] < 140 and
                10 <= p[1] < 95 and p[2] < 90 and p[0] > p[1]*1.18 and
                p[1] >= p[2]*.7)(im.getpixel((x, y)))]


def body_limits(im):
    bounds = im.getchannel('A').point(lambda a: 255 if a >= 128 else 0).getbbox()
    assert bounds
    points = brown_points(im)
    h = bounds[3]-bounds[1]
    top = min(y for x, y in points if y < bounds[1]+h*.5)
    ground = max(y for x, y in points if y > bounds[1]+h*.7)+1
    return top, ground


def native(im, scale, ground):
    """One shared scale per action, including bent/raised poses and tools."""
    points = [(x, y) for y in range(im.height) for x in range(im.width)
              if (lambda p: p[3] >= 128 and p[0] < 150 and
                  p[1] > p[0]*1.03 and p[1] > p[2]*1.04)(im.getpixel((x, y)))]
    assert points, 'Missing teal torso'
    # Torso registration excludes extended hands and tool heads.
    centre = median(x for x, y in points)
    canvas = Image.new('RGBA', (round(SIZE*scale), round(SIZE*scale)))
    dx, dy = round(SIZE*scale/2-centre), round(GROUND*scale-ground)
    # Verify all surviving source ink fits; do not silently crop a tool.
    bounds = im.getchannel('A').point(lambda a: 255 if a >= 128 else 0).getbbox()
    assert bounds[0]+dx >= 0 and bounds[2]+dx <= canvas.width, (bounds, dx, scale)
    assert bounds[1]+dy >= 0 and bounds[3]+dy <= canvas.height, (bounds, dy, scale)
    canvas.paste(im, (dx, dy))
    frame = canvas.resize((SIZE, SIZE), Image.Resampling.NEAREST)
    frame.putdata([(*p[:3], 255) if p[3] >= 128 else (0, 0, 0, 0)
                   for p in frame.get_flattened_data()])
    return frame


def export():
    packed, records = {}, {}
    for action, count in COUNTS.items():
        if action == 'idle':
            grid = cells(OUT/'source/idle.png', 2, 2)
            # Generated bottom-left faces east; bottom-right faces west.
            raw = [[grid[0][0]], [grid[0][1]], [grid[1][1]], [grid[1][0]]]
        else:
            raw = cells(OUT/'source'/f'{action}.png', count, 4)
        limits = [body_limits(row[0]) for row in raw]
        scale = median(bottom-top for top, bottom in limits)/30
        if action == 'idle':
            # Include the dark hair/boot outlines in standing height; the
            # brown-only calibration would otherwise add two native pixels.
            boxes = [row[0].getchannel('A').point(lambda a: 255 if a >= 128 else 0).getbbox()
                     for row in raw]
            scale = max(b[3]-b[1] for b in boxes)/30
        rows = []
        for row, (_, ground) in zip(raw, limits):
            rows.append([native(im, scale, ground) for im in row])
        if action == 'watering':
            # Separate generated front/back fixes retain their own layout.
            for r, direction in enumerate(['south', 'north']):
                path = OUT/'source'/f'watering-{direction}.png'
                if path.exists():
                    grid = cells(path, 3, 2)
                    poses = [im for row in grid for im in row]
                    top, ground = body_limits(poses[0])
                    s = (ground-top)/30
                    # Each generated row may have a different sheet baseline.
                    rows[r] = [native(im, s, body_limits(grid[i//3][0])[1])
                               for i, im in enumerate(poses)]
        if action in ('digging', 'attack'):
            # The generated west strip turns east mid-action. Use the fully
            # east-facing authored strip mirrored, a standard sprite packing
            # adaptation. Never invent motion by displacing body parts.
            rows[2] = [ImageOps.mirror(im) for im in rows[3]]
        packed[action] = rows
        records[action] = {'framesPerDirection': count, 'fps': FPS[action],
                           'sourceScale': scale,
                           'sourceReadyBodyLimits': limits,
                           'mirroredWest': action in ('digging', 'attack')}
    samples = [p[:3] for rows in packed.values() for row in rows
               for im in row for p in im.get_flattened_data() if p[3]]
    strip = Image.new('RGB', (len(samples), 1)); strip.putdata(samples)
    palette = strip.quantize(colors=32, method=Image.Quantize.MEDIANCUT)
    for action, rows in packed.items():
        for row in rows:
            for i, im in enumerate(row):
                converted = im.convert('RGB').quantize(palette=palette,
                    dither=Image.Dither.NONE).convert('RGB')
                converted.putalpha(im.getchannel('A')); row[i] = converted
        sheet = Image.new('RGBA', (SIZE*COUNTS[action], SIZE*4))
        for r, (direction, row) in enumerate(zip(DIRECTIONS, rows)):
            dest = OUT/'frames'/action/direction; dest.mkdir(parents=True, exist_ok=True)
            for i, im in enumerate(row):
                assert im.getbbox() and im.getbbox()[0] > 0 and im.getbbox()[2] < SIZE
                sheet.paste(im, (i*SIZE, r*SIZE)); im.save(dest/f'{i:02}.png')
        (OUT/'sheets').mkdir(exist_ok=True); sheet.save(OUT/'sheets'/f'{action}.png')
        durations = [round(1000*(i+1)/FPS[action])-round(1000*i/FPS[action])
                     for i in range(COUNTS[action])]
        preview = []
        for i in range(COUNTS[action]):
            frame = Image.new('RGB', (SIZE*4, SIZE), (211, 212, 182))
            for r in range(4): frame.paste(rows[r][i], (r*SIZE, 0), rows[r][i])
            preview.append(frame.resize((SIZE*4*3, SIZE*3), Image.Resampling.NEAREST))
        (OUT/'previews').mkdir(exist_ok=True)
        preview[0].save(OUT/'previews'/f'{action}.gif', save_all=True,
            append_images=preview[1:], duration=durations, loop=0)
        records[action]['uniqueFrames'] = [len({im.tobytes() for im in row}) for row in rows]
        records[action]['sheetSha256'] = sha(OUT/'sheets'/f'{action}.png')
    contact = Image.new('RGB', (SIZE*8*3, SIZE*4*7*3), (211, 212, 182))
    for a, (action, rows) in enumerate(packed.items()):
        for r, row in enumerate(rows):
            for i, im in enumerate(row):
                big = im.resize((SIZE*3, SIZE*3), Image.Resampling.NEAREST)
                contact.paste(big, (i*SIZE*3, (a*4+r)*SIZE*3), big)
    contact.save(OUT/'contact.png')
    manifest = {'tool': 'OpenAI built-in image_gen', 'modelVersion': 'not exposed',
        'cellSize': [SIZE, SIZE], 'standingHeightTarget': 30, 'groundRow': GROUND,
        'directions': DIRECTIONS, 'totalFrames': sum(COUNTS.values())*4,
        'conversion': 'nearest sampling, torso registration, alpha threshold128, shared32-colour palette; no synthetic limb displacement',
        'actions': records, 'sourceSha256': {p.name: sha(p) for p in sorted((OUT/'source').glob('*.png'))},
        'status': 'review export; not installed in runtime game',
        'limitations': 'AI pose consistency and tool geometry need human review; body/head pixel clusters can vary between generated action sheets.'}
    (OUT/'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n')
    (EVIDENCE/'record.json').write_text(json.dumps(manifest, indent=2)+'\n')
    for p in EVIDENCE.glob('*prompts.json'):
        (OUT/p.name).write_bytes(p.read_bytes())
    with ZipFile(OUT.with_suffix('.zip'), 'w', ZIP_DEFLATED) as archive:
        for p in sorted(OUT.rglob('*')):
            if p.is_file(): archive.write(p, p.relative_to(OUT).as_posix())
    print(json.dumps(manifest, indent=2))


if __name__ == '__main__':
    export()
