import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAPS} from '../src/data/mapLayouts.js';
import {SHOP_ROOMS} from '../src/data/cityShops.js';
import {CITY_SHOPS_PLAN as P} from '../src/data/cityShopsPlan.js';
import {CITY_SHOP_ART} from '../src/data/cityShopArt.js';
import {CITY_COTTAGE_ART} from '../src/data/cityCottageArt.js';
import {CITY_BUILDING_ART} from '../src/data/cityBuildingArt.js';
import {walkable,LOCATIONS} from '../src/data/locations.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {residentsFor,residentContext} from '../src/systems/residents.js';
import {styleServiceOpen,changeAppearance} from '../src/systems/appearance.js';
import {contextFor} from '../src/systems/context.js';
import {openGround} from '../src/systems/farmGround.js';
import {grassGround} from '../src/systems/vegetation.js';
import {cityMaskAt} from '../src/data/citySurfaceGeometry.js';
import {commutePath} from '../src/systems/commute.js';
const map=MAPS.city;
test('approved shop integration and native Pixel Snapper cottage retain every earlier frame record',()=>{
 const old=JSON.parse(readFileSync('output/art/city-shops-v1/before-town.json')),current=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
 for(const [key,frame]of Object.entries(old.frames).filter(([key])=>!key.startsWith('tomato-')))assert.deepEqual(current.frames[key],frame,key);
 for(const key of ['seed','sprout','young','flowering','ripe','dry','wilted','dead'])assert.deepEqual([current.frames['tomato-'+key].frame.w,current.frames['tomato-'+key].frame.h],[48,70]);
 assert.equal(Object.keys(current.frames).length,Object.keys(old.frames).length+10);
 for(const art of Object.values(CITY_SHOP_ART))assert.deepEqual([current.frames[art.frame].frame.w,current.frames[art.frame].frame.h],[art.width,art.height]);
 assert.deepEqual([current.frames[CITY_COTTAGE_ART.frame].frame.w,current.frames[CITY_COTTAGE_ART.frame].frame.h],[167,110]);
});
test('approved exterior positions and camp move are exact; reviewed cafe furniture and camp planter are absent',()=>{
 for(const b of P.buildings.filter(b=>b.id!=='cottage-a')){const art=b.id==='cottage-b'?CITY_COTTAGE_ART:b.id==='cafe'?CITY_BUILDING_ART['cafe-terracotta-awning']:b.id==='barber'?CITY_BUILDING_ART['shop-barber-blue-roof']:b.id==='clothing'?CITY_BUILDING_ART['shop-clothing-sage-awning']:CITY_SHOP_ART[b.id],placed=map.buildings.find(p=>p.artFrame===art.frame),origin=art.originOffset?[b.origin[0]+art.originOffset[0],b.origin[1]+art.originOffset[1]]:b.origin,approach=art.doorOffset?[origin[0]+art.doorOffset[0],b.approach[1]]:b.approach;assert.ok(placed,b.id);assert.deepEqual([placed.x,placed.y],origin);assert.deepEqual([placed.porch.x,placed.porch.y],approach);assert.ok(walkable('city',...approach));assert.ok(cityMaskAt('walk',...approach),b.id+' paved approach');commutePath('city',LOCATIONS.city.spawn,placed.porch);}
 assert.equal(map.buildings.filter(p=>p.artFrame===CITY_COTTAGE_ART.frame).length,1);
 assert.deepEqual(map.buildings.find(p=>p.artFrame===CITY_COTTAGE_ART.frame).entry,{x:2350,y:438});
 for(const b of P.convertedHouses)assert.equal(map.buildings[b.index].name,b.name,'stable resident home index');
 for(const m of P.camp.moves.filter(m=>m.name!=='barrel'))assert.ok(map.props.some(p=>p.name===m.name&&p.x===m.to[0]&&p.y===m.to[1]));
 assert.ok(!map.props.some(p=>p.name==='barrel'&&p.x===1968&&p.y===760));
 assert.ok(!map.props.some(p=>p.name==='city-bench-garden'&&p.x===P.camp.removedPlanter[0]&&p.y===P.camp.removedPlanter[1]));
 assert.equal(map.props.filter(p=>p.name==='city-cafe-furniture').length,0);
 assert.equal(map.props.filter(p=>p.name==='city-campfire').length,0);
 assert.equal(map.props.filter(p=>p.name==='city-flower-display').length,0);assert.equal(map.cityPlanting.filter(p=>p.group.startsWith('island-underlay')).length,12);
});
function connected(area,start,target,residents=[]){const step=4,queue=[start],seen=new Set([start.x+','+start.y]);for(let i=0;i<queue.length;i++){const p=queue[i];if(Math.hypot(p.x-target.x,p.y-target.y)<=step)return true;for(const [dx,dy]of [[step,0],[-step,0],[0,step],[0,-step]]){const x=p.x+dx,y=p.y+dy,key=x+','+y;if(seen.has(key)||!walkable(area,x,y)||residents.some(n=>n.visible&&Math.hypot(x-n.position.x,y-n.position.y)<24))continue;seen.add(key);queue.push({x,y});}}return false;}
test('shop doors, service approaches and exits connect using real indoor foot size and resident clearance',()=>{
 for(const [area,room]of Object.entries(SHOP_ROOMS)){
  const s=newState();Object.assign(s,{area:'city',minute:600,position:{...room.outside}});const enter=contextFor(s);assert.equal(enter.type,'travel');assert.equal(enter.to,area);assert.deepEqual(enter.spawn,room.spawn);
  s.area=area;s.position={...room.spawn};const people=residentsFor(area,s);assert.equal(people.length,1);assert.ok(connected(area,room.spawn,room.client,people));assert.ok(connected(area,room.spawn,room.exit,people));assert.ok(connected(area,room.exit,room.client,people));
  s.position={...room.client};assert.equal(residentContext(people,s.position).category,room.service);assert.equal(styleServiceOpen(s,room.service),true);
  s.position={...room.exit};const exit=contextFor(s);assert.equal(exit.type,'travel');assert.equal(exit.to,'city');assert.deepEqual(exit.spawn,room.outside);
  assert.equal(openGround(area,room.spawn.x,room.spawn.y),false);assert.equal(grassGround(s,room.spawn),false);
  for(const [x,y,w,h]of room.solids)assert.equal(walkable(area,x+w/2,y+h/2),false,'furniture blocks walking');
 }
});
test('approved Pixel Snapper shop objects replace the old furniture and barber rug sits by the door',()=>{
 const room=SHOP_ROOMS.barber;
 assert.ok(!room.props.some(([,frame])=>frame==='snapper-bench'));
 assert.ok(!room.solids.some(([x,y,w,h])=>x===40&&y===246&&w===60&&h===22));
 assert.ok(walkable('barber',70,257));
 for(const frame of ['snapper-barber-worktop','snapper-barber-coat-hooks','snapper-barber-storage'])assert.ok(room.props.some(([,id])=>id===frame),frame);
 const rug=room.floorRugs[0];assert.deepEqual(rug,[178,258,92,48]);assert.ok(Math.abs(rug[0]+rug[2]/2-room.exit.x)===0);assert.ok(rug[1]+rug[3]>=room.spawn.y);
 const clothing=SHOP_ROOMS.clothing;
 for(const frame of ['snapper-clothing-cabinet','snapper-clothing-counter','snapper-clothing-fitting-corner','snapper-clothing-mirror','snapper-clothing-display-table'])assert.ok(clothing.props.some(([,id])=>id===frame),frame);
 assert.equal(clothing.props.find(([,frame])=>frame==='snapper-clothing-display-table')[5],270,'display-table sorting follows its physical foot line');
 assert.equal(clothing.props.filter(([,frame])=>frame==='snapper-clothing-rack-v3').length,1);
 assert.equal(clothing.props.find(([,frame])=>frame==='snapper-clothing-rack-v3')[4],.7);
 assert.ok(!clothing.props.some(([,frame])=>frame==='snapper-bench'||frame==='snapper-counter'));
});
test('shops preserve purchases and schema-19 saves, hide staff outside at work and close on their commute',()=>{
 for(const [area,room]of Object.entries(SHOP_ROOMS)){
  const s=newState('girl');Object.assign(s,{area,minute:600,position:{...room.client},money:500});const person=residentsFor(area,s)[0];assert.equal(person.visible,true);assert.equal(residentsFor('city',s).find(n=>n.id===person.id).visible,false);
  const id=room.service==='hair'?'golden':'copper';changeAppearance(s,room.service,id);assert.equal(s.money,room.service==='hair'?440:410);
  const loaded=validate(JSON.parse(JSON.stringify(s)));assert.equal(loaded.version,19);assert.equal(loaded.area,area);assert.deepEqual(loaded.position,s.position);assert.deepEqual(loaded.appearance,s.appearance);assert.equal(loaded.money,s.money);assert.equal(loaded.character,'girl');
  s.minute=1139;assert.equal(styleServiceOpen(s,room.service),false);assert.equal(residentsFor(area,s)[0].visible,false);assert.equal(residentsFor('city',s).find(n=>n.id===person.id).visible,true);
  for(const minute of [0,419,1140,1320]){s.minute=minute;assert.equal(styleServiceOpen(s,room.service),false);}
 }
});
test('camp approaches stay connected and completed Flower Court seating clears the tent silhouettes',async()=>{
 const {PROJECTS}=await import('../src/data/settlement.js');const state=newState();state.area='city';state.settlement.projects=PROJECTS.map(p=>p.id);
 for(const [x,y]of [[2160,976],[2160,920],[2056,896],[2040,812],[2260,816]]){assert.ok(walkable('city',x,y,12,false,state),`${x},${y}`);commutePath('city',LOCATIONS.city.spawn,{x,y});}
 const bench=PROJECTS.find(p=>p.id==='flowerCourt').props.find(p=>p[0]==='bench');assert.deepEqual(bench,['bench',2104,864]);
 for(const tent of map.props.filter(p=>p.name==='city-tent'))assert.ok(bench[1]+64<=tent.x||bench[1]>=tent.x+128,'completed bench stays between tents');
});
