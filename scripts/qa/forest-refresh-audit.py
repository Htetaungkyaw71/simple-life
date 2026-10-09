"""Compare allowlisted art and Forest progress IDs against v0.8.0, then audit dist."""
from pathlib import Path
import hashlib, json, subprocess, tarfile, io, tempfile
root=Path(__file__).resolve().parents[2]
base='2484fba'
def node_snapshot(folder):
    code='''import {FOREST_MAP,FORAGE_NODES,TREASURES,REGIONS} from './src/data/forest.js';import {forestTree} from './src/data/forestGrowth.js';import {WOODLAND_WILDLIFE} from './src/data/woodlandWildlife.js';console.log(JSON.stringify({trees:FOREST_MAP.props.filter(forestTree).map(p=>'tree:'+p.name+':'+p.x+':'+p.y),forage:FORAGE_NODES.map(n=>n.id),woodland:WOODLAND_WILDLIFE.map(n=>n.id),caches:TREASURES.map(n=>n.id),regions:REGIONS.map(n=>n.id),terraces:FOREST_MAP.terraces.length,ledges:FOREST_MAP.ledges.length}));'''
    return json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=folder))
with tempfile.TemporaryDirectory(prefix='simple-life-forest-audit-') as temp:
    archive=subprocess.check_output(['git','archive',base,'src','package.json'],cwd=root)
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:tar.extractall(temp,filter='data')
    old=node_snapshot(temp)
new=node_snapshot(root)
assert set(new['trees'])<=set(old['trees'])
for key in ['forage','woodland']:assert set(old[key])<=set(new[key])
for key in ['caches','regions']:assert old[key]==new[key]
allowed=['world.png','world.json','font.png','font.xml','processed/town.png','processed/town.json','processed/boy.png','processed/girl.png']
art=[]
for name in allowed:
    path='public/assets/pixel/'+name;data=(root/path).read_bytes();original=subprocess.check_output(['git','show',base+':'+path],cwd=root)
    assert original==data,path
    assert (root/'dist/assets/pixel'/name).read_bytes()==data
    art.append({'file':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'unchanged':True})
files=sorted(p for p in (root/'dist').rglob('*') if p.is_file())
assert len(files)==12
assert sorted(str(p.relative_to(root/'dist/assets/pixel')) for p in (root/'dist/assets/pixel').rglob('*') if p.is_file())==sorted(allowed)
assert not any(p.suffix in ['.zip','.rar','.md','.py','.pdf'] for p in files)
report={'version':'0.9.0','baseline':base,'files':len(files),'bytes':sum(p.stat().st_size for p in files),'atlasFrames':len(json.loads((root/'public/assets/pixel/processed/town.json').read_text())['frames']),'runtimeArt':art,'progress':{'treesBefore':len(old['trees']),'treesAfter':len(new['trees']),'forageBefore':len(old['forage']),'forageAfter':len(new['forage']),'quietAnimalsBefore':len(old['woodland']),'quietAnimalsAfter':len(new['woodland']),'regionsUnchanged':True,'cachesUnchanged':True,'allEarlierForageAndAnimalIDsRetained':True,'allRemainingTreeIDsRetained':True,'terraces':new['terraces'],'ledges':new['ledges']},'newAssetDownloads':0,'newDependencies':0,'audio':'original local Web Audio synthesis'}
out=root/'docs/verification/forest-refresh/runtime-audit.json';out.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:report[k] for k in ['version','files','bytes','atlasFrames','progress']}))
