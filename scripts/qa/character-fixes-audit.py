"""Verify native farmer-matched actors, planted seeds, and runtime allowlist.
Run after build with Pillow. No original downloaded files enter the build.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image
import subprocess, json, hashlib, sys
sys.path.insert(0,str(Path('scripts').resolve()))
from matched_residents_art import VARIANTS
from garden_tools_art import CROPS

base='c93f84c';folder=Path('public/assets/pixel/processed')
def old(path):return subprocess.check_output(['git','show',base+':'+str(path)])
def crop(im,frame):
    r=frame['frame'];return im.crop((r['x'],r['y'],r['x']+r['w'],r['y']+r['h']))
before=json.loads(old(folder/'town.json'))['frames'];after=json.loads((folder/'town.json').read_text())['frames']
a=Image.open(BytesIO(old(folder/'town.png'))).convert('RGBA');b=Image.open(folder/'town.png').convert('RGBA')
changed=[]
for name,f in before.items():
    assert f==after[name],name+' moved'
    if crop(a,f).tobytes()!=crop(b,f).tobytes():changed.append(name)
assert set(changed)=={c+'-seed' for c in CROPS}
for c in CROPS:
    box=crop(b,after[c+'-seed']).getbbox();assert box[1]>=25 and box[3]<=30 and box[2]-box[0]<=13
added=set(after)-set(before)
assert added=={f'town-person-{i}-{direction}-{f}' for i in range(8) for direction in ['down','up','left','right'] for f in range(5)}
sheets={name:Image.open(folder/(name+'.png')).convert('RGBA') for name in ['boy','girl']}
for i,(body,*_) in enumerate(VARIANTS):
    for row,direction in enumerate(['down','up','left','right']):
        for f in range(5):
            im=crop(b,after[f'town-person-{i}-{direction}-{f}']);source=sheets[body].crop((f*24,row*32,f*24+24,row*32+32))
            assert im.size==source.size==(24,32)
            assert im.getchannel('A').tobytes()==source.getchannel('A').tobytes(), 'body silhouette changed'
            # Facial skin and eyes retain exact original pixels in every pose.
            for p,q in zip(source.getdata(),im.getdata()):
                if p[:3] in [(250,232,231),(235,168,167),(240,189,187),(247,217,216),(0,168,154),(0,200,185)]:assert p==q
art=['font.png','font.xml','world.png','world.json','processed/boy.png','processed/girl.png','processed/town.png','processed/town.json']
same=[]
for name in art:
    if name not in ['processed/town.png','processed/town.json']:
        p=Path('public/assets/pixel')/name;assert old(p)==p.read_bytes();same.append(name)
runtime=sorted(str(p.relative_to('dist/assets/pixel')) for p in Path('dist/assets/pixel').rglob('*') if p.is_file());assert runtime==sorted(art)
files=[p for p in Path('dist').rglob('*') if p.is_file()]
result={'baseCommit':base,'previousFrames':len(before),'frames':len(after),'retainedUnchangedFrames':len(before)-len(changed),'changedOriginalSeeds':changed,'matchedActorFrames':len(added),'nativeBodies':'24x32; alpha and facial pixels match the existing farmer cells','unchangedOtherArt':same,'runtimeArt':runtime,'buildFiles':len(files),'buildBytes':sum(p.stat().st_size for p in files),'atlasSha256':hashlib.sha256((folder/'town.png').read_bytes()).hexdigest()}
out=Path('docs/verification/character-fixes');out.mkdir(parents=True,exist_ok=True);(out/'runtime-audit.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
