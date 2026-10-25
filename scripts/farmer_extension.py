"""Offline imagegen-to-native export. Existing approved body/action pixels stay intact."""
from pathlib import Path
from PIL import Image
import json
import math
import hashlib

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/art/farmer-boy-extension-v1'
DIRS = ['down', 'up', 'left', 'right']
PALETTE = json.loads((ROOT / 'output/art/farmer-boy-revised-v2/manifest.json').read_text())['palette']

def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()

def binary(im, cutoff=250):
    result = Image.new('RGBA', im.size)
    result.putdata([(*p[:3], 255) if p[3] >= cutoff else (0, 0, 0, 0) for p in im.getdata()])
    return result

def mapped(im):
    result = Image.new('RGBA', im.size)
    cache = {}
    def colour(p):
        if not p[3]:
            return (0, 0, 0, 0)
        rgb = p[:3]
        if rgb not in cache:
            cache[rgb] = (*min(PALETTE, key=lambda c: sum((a-b)**2 for a,b in zip(c, rgb))), 255)
        return cache[rgb]
    result.putdata([colour(p) for p in im.getdata()])
    return result

def split(im, cols, rows):
    # Clear projected alpha gutters separate every authored pose.
    def cuts(axis, count):
        n, other = im.size[axis], im.size[1-axis]
        hist = [sum(im.getpixel((a,b) if axis == 0 else (b,a))[3] > 0 for b in range(other)) for a in range(n)]
        result = [0]
        for i in range(1, count):
            mid, pitch = n*i/count, n/count
            choices = range(round(mid-pitch*.30), round(mid+pitch*.30))
            best = min(choices, key=lambda q: (hist[q], abs(q-mid)))
            assert hist[best] == 0, (axis, i, hist[best])
            result.append(best)
        return result+[n]
    xs, ys = cuts(0, cols), cuts(1, rows)
    return [[im.crop((xs[c], ys[r], xs[c+1], ys[r+1])) for c in range(cols)] for r in range(rows)]

def save(im, p):
    p.parent.mkdir(parents=True, exist_ok=True)
    im.save(p)

def grip(im, direction):
    side = -1 if direction in ('up', 'right') else 1
    skin = [(x,y) for y in range(30,54) for x in range(64) if (lambda p:p[3] and p[0]>120 and p[0]>p[1]*1.25 and p[1]>p[2]*1.25)(im.getpixel((x,y)))]
    assert skin, direction
    preferred = [(x,y) for x,y in skin if (x-32)*side>=1] or skin
    extreme = max(x*side for x,y in preferred)
    edge = [(x,y) for x,y in preferred if x*side == extreme]
    x,y = edge[len(edge)//2]
    return [round((x-32+.5)*1.5), round((y-56+.5)*1.5)]

def export():
    jump_rows = split(binary(Image.open(OUT/'source/jump.png').convert('RGBA')),6,4)
    # One shared standing-equivalent scale from the takeoff poses. Do not scale
    # shorter crouch/tuck phases back up to standing height.
    scale = sorted(row[1].getbbox()[3]-row[1].getbbox()[1] for row in jump_rows)[2]/40
    sheet = Image.new('RGBA',(384,256))
    hands = {}
    for r,row in enumerate(jump_rows):
        hands[DIRS[r]] = []
        for c,raw in enumerate(row):
            b = raw.getbbox()
            body = raw.crop(b)
            # Whole source pose only, no independently displaced limbs.
            body = mapped(body.resize((round(body.width/scale),round(body.height/scale)),Image.Resampling.NEAREST))
            frame = Image.new('RGBA',(64,64))
            frame.paste(body,(32-body.width//2,57-body.height))
            assert frame.getbbox()[1]>0 and frame.getbbox()[3]<64
            hands[DIRS[r]].append(grip(frame,DIRS[r]))
            save(frame,OUT/f'frames/jumping/{DIRS[r]}/{c:02}.png')
            sheet.paste(frame,(64*c,64*r))
    save(sheet,OUT/'sheets/jumping.png')
    save(sheet.resize((1152,768),Image.Resampling.NEAREST),OUT/'previews/jumping-contact.png')
    gif = []
    for c in range(6):
        fr = Image.new('RGBA',(256,64),(211,212,182,255))
        for r in range(4):
            p=sheet.crop((c*64,r*64,(c+1)*64,(r+1)*64))
            fr.alpha_composite(p,(r*64,0))
        gif.append(fr.resize((1024,256),Image.Resampling.NEAREST))
    gif[0].save(OUT/'previews/jumping.gif',save_all=True,append_images=gif[1:],duration=[90,90,120,120,90,90],loop=0,disposal=2)
    tool_frames, tool_info = {}, {}
    tool_sheet = Image.new('RGBA',(512,128))
    for tool,target_height in [('axe',17),('shovel',22),('water',10)]:
        rows = split(binary(Image.open(OUT/f'source/{tool}.png').convert('RGBA')),2,2)
        tool_frames[tool] = {}
        tool_info[tool] = {}
        for n,direction in enumerate(DIRS):
            raw = rows[n//2][n%2]
            raw=raw.crop(raw.getbbox())
            native=mapped(raw.resize((max(3,round(raw.width/raw.height*target_height)),target_height),Image.Resampling.NEAREST))
            # Grip within the existing painted handle/shaft, below the top for
            # the long shovel so its carried tip stays near the ground plane.
            gy={'axe':5,'shovel':9,'water':1}[tool]
            xs=[x for x in range(native.width) if native.getpixel((x,gy))[3]]
            assert xs,(tool,direction)
            gx=xs[len(xs)//2]
            frame=Image.new('RGBA',(64,64))
            frame.paste(native,(32-gx,32-gy))
            assert frame.getpixel((32,32))[3] == 255
            index=len([v for d in tool_frames.values() for v in d.values()])
            tool_frames[tool][direction]=256+index
            tool_info[tool][direction]={'frame':256+index,'gripPixels':[32,32],'nativeSize':list(native.size)}
            save(frame,OUT/f'tools/{tool}/{direction}.png')
            tool_sheet.paste(frame,((index%8)*64,(index//8)*64))
    save(tool_sheet,OUT/'sheets/carried-tools.png')
    save(tool_sheet.resize((1536,384),Image.Resampling.NEAREST),OUT/'previews/tools-contact.png')
    manifest={'date':'2026-10-14','frameSize':[64,64],'scale':1.5,'groundOrigin':[32,56],
              'jump':{'offset':224,'count':6,'durations':[90,90,120,120,90,90],'loop':False},
              'jumpHands':hands,'toolFrames':tool_frames,'toolDetails':tool_info,
              'totalRuntimeFrames':272,'standingEquivalentScale':scale,
              'sources':{p.name:sha(p) for p in sorted((OUT/'source').glob('*.png'))},
              'conversion':'Imagegen-authored poses/views; opaque alpha core250 removes generated fringes/glow; whole-pose nearest native sampling; shared existing32-colour palette; boots registered to ground56; no synthetic limb warps. Tool grip at32,32.'}
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    return manifest

if __name__=='__main__':
    print(json.dumps(export(),indent=2))
