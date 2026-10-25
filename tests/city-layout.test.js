import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {MAPS} from '../src/data/mapLayouts.js';
import {CITY_LAYOUT} from '../src/data/cityLayout.js';
import {CITY_FOUNTAIN_ISLAND} from '../src/data/cityFountainIsland.js';
import {citySurfaceMasks,cityMaskAt,CITY_NATIVE_SIZE} from '../src/data/citySurfaceGeometry.js';
import {paintCityPixels} from '../src/art/citySurface.js';
import {paintGround} from '../src/art/groundSurface.js';
import {VEGETATION,removed} from '../src/data/vegetation.js';
import {walkable,LOCATIONS} from '../src/data/locations.js';
import {waterAt} from '../src/data/water.js';
import {residentsFor} from '../src/systems/residents.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {PROJECTS} from '../src/data/settlement.js';
const map=MAPS.city;
const before=JSON.parse(readFileSync('output/art/city-layout-v1/before-city.json')).map;
const oldGrassIds=[...before.grass.map(p=>p.id),...[...before.details,...before.props].filter(p=>['grass-detail','mushroom','flowers','flowers0','flowers1','flowers2','flowers3','flowers4'].includes(p.name)).map(p=>`grass:${p.name}:${p.x}:${p.y}`)];

test('City integration preserves every approved sprite and all gathered-plant save identities',()=>{
 const hashes=JSON.parse(readFileSync('output/art/city-layout-v1/baseline-hashes.json'));
 for(const [p,h]of Object.entries(hashes).filter(([p])=>p.startsWith('public/')&&!['public/assets/pixel/processed/town.png','public/assets/pixel/processed/town.json'].includes(p)||p==='src/art/groundSurface.js'))assert.equal(createHash('sha256').update(readFileSync(p)).digest('hex'),h,p);
 assert.deepEqual(new Set(VEGETATION.city.grass.map(n=>n.id)),new Set(oldGrassIds));
 const oldTreeIds=before.props.filter(p=>p.name==='tree').map(p=>p.vegetationId||`tree:tree:${p.x}:${p.y}`);
 assert.deepEqual(new Set(VEGETATION.city.trees.map(n=>n.id)),new Set(oldTreeIds));
 const s=newState();s.area='city';s.position={x:610,y:728};s.money=981;s.day=12;s.vegetation.city={trees:oldTreeIds,grass:oldGrassIds,placed:[]};
 const loaded=validate(s);assert.equal(loaded.money,981);assert.equal(loaded.day,12);
 assert.deepEqual(new Set(loaded.vegetation.city.grass),new Set(oldGrassIds));
 for(const n of VEGETATION.city.grass)assert.ok(removed(loaded,n.id));
 for(const n of VEGETATION.city.trees)assert.ok(removed(loaded,n.id));
});

test('current grass colours and texture survive the new paved overlay and curbs lower at the crossing',()=>{
 const {width:w,height:h}=CITY_NATIVE_SIZE,data=new Uint8ClampedArray(w*h*4);paintGround(data,w,h);
 const old=data.slice();paintCityPixels(data,map);
 // Samples well inside unchanged open lawns, outside the new small soil pockets.
 for(const [x,y]of [[480,1180],[784,892],[980,1390],[1980,260],[2260,1210]]){const i=(Math.floor(y/2)*w+Math.floor(x/2))*4;assert.deepEqual(data.slice(i,i+4),old.slice(i,i+4),`${x},${y}`);}
 const px=(x,y)=>Array.from(data.slice((y*w+x)*4,(y*w+x)*4+3));
 assert.deepEqual(px(370,371),[230,215,185],'front crest');
 assert.deepEqual(px(370,372),[170,157,133],'short face');
 assert.deepEqual(px(370,374),[144,131,111],'face bottom: six world units');
 assert.notDeepEqual(px(370,375),[144,131,111],'no tall bank');
 assert.notDeepEqual(px(324,373),[170,157,133],'central crossing is lowered');
 assert.equal(cityMaskAt('cream',648,742),true);assert.equal(cityMaskAt('ramp',648,742),true);
 const [ix,iy,iw,ih]=CITY_FOUNTAIN_ISLAND.bounds,[cx,cy]=CITY_FOUNTAIN_ISLAND.center;
 assert.deepEqual([iw,ih],[181,170]);assert.equal(CITY_FOUNTAIN_ISLAND.surface,false);
 assert.equal(cityMaskAt('island',cx,cy),false,'the transparent island art replaces the baked green rectangle');
 assert.equal(cityMaskAt('road',cx,cy),true);assert.equal(cityMaskAt('road',ix-2,cy),true);assert.equal(cityMaskAt('road',ix+iw+2,cy),true);
 assert.equal(cityMaskAt('road',cx,iy-2),true);assert.equal(cityMaskAt('road',cx,iy+ih+2),true);
});

test('actual 24 by 12 foot body reaches all City services, porches and both sides of the three benches on connected paving',()=>{
 const step=8,w=321,h=225,safe=new Uint8Array(w*h),seen=new Uint8Array(w*h);
 const paved=(x,y)=>cityMaskAt('walk',x,y)||map.bridges.some(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<b.y+b.h);
 for(let gy=1;gy<h;gy++)for(let gx=2;gx<w-2;gx++){
  const x=gx*step,y=gy*step;if(!walkable('city',x,y,12)||waterAt(map,{x,y}))continue;
  let valid=true;for(let dy=-12;dy<0&&valid;dy+=2)for(let dx=-12;dx<12;dx+=2)if(!paved(x+dx,y+dy)){valid=false;break;}
  if(valid)safe[gy*w+gx]=1;
 }
 const start=61*w+8,queue=[start];seen[start]=1;
 for(let i=0;i<queue.length;i++){const n=queue[i],x=n%w,y=Math.floor(n/w);for(const d of [-1,1,-w,w]){const nn=n+d;if(x>0&&x<w-1&&y>0&&y<h-1&&safe[nn]&&!seen[nn]){seen[nn]=1;queue.push(nn);}}}
 const targets=[['Seeds',432,306],['Produce',896,306],['Town board',1688,1080],['West bridge',648,192],['East bridge',1800,192],['Fountain north',704,304],['Fountain west',576,420],['Fountain east',832,420],['Fountain south',704,536],['Terrace crossing',648,748],...map.buildings.filter(b=>!b.name.startsWith('house')).map(b=>[b.name,b.porch?.x??b.x+120,b.porch?.y??b.y+234])];
 for(const [i,p]of map.props.filter(p=>p.name==='city-bench-garden').slice(0,3).entries())for(const dx of [-24,96+24])targets.push(['Bench '+(i+1),p.x+3+dx,p.y+76]);
 for(const [name,x,y]of targets)assert.ok(queue.some(n=>Math.hypot(n%w*step-x,Math.floor(n/w)*step-y)<=16),name+' disconnected');
 assert.ok(walkable('city',1024,624,12),'Seed aid grass approach');
 for(const b of map.buildings.filter(b=>b.name.startsWith('house')))assert.ok(walkable('city',b.porch.x,b.porch.y,8),b.name+' grass porch');
 assert.equal(CITY_LAYOUT.terrace[2],560);assert.equal(map.props.filter(p=>p.name==='city-bench-garden').length,3);
});

test('resident commutes and completed town-project approaches remain connected',()=>{
 const s=newState();s.area='city';s.settlement.projects=PROJECTS.map(p=>p.id);
 for(const n of residentsFor('city',s)){
  assert.ok(n.commute.length>=2,n.name);
  // The first segment enters a doorway and is intentionally inside house art.
  for(const point of n.commute.slice(1))assert.ok(walkable('city',point.x,point.y,8),n.name+' commute');
 }
 for(const p of PROJECTS)assert.ok(walkable('city',p.x,p.y+16,12,false,s),p.id+' board approach');
 assert.deepEqual(LOCATIONS.city.interactions.slice(0,2).map(p=>[p.x,p.y]),[[432,306],[896,306]]);
});
