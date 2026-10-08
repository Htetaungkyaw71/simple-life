import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LOCATIONS,walkable} from '../src/data/locations.js';
import {MAPS,MAP_SIZE} from '../src/data/mapLayouts.js';
import {displayZoom} from '../src/scenes/displayScale.js';
test('wide display keeps useful tile coverage and small characters',()=>{
 const z=displayZoom(1280,720);assert.equal(z,1);assert.equal(1280/z/32,40);assert.ok(64*z/720>=.06&&64*z/720<=.09);
 for(const [w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844]]){const zoom=displayZoom(w,h);assert.ok(Number.isInteger(zoom*2));assert.ok(64*zoom/h<.17);assert.ok(w/zoom<MAP_SIZE.width&&h/zoom<MAP_SIZE.height);}
});
test('expanded areas connect every interaction and decorative district',()=>{
 const step=16;
 for(const [area,location]of Object.entries(LOCATIONS)){
  const start={x:Math.round(location.spawn.x/step)*step,y:Math.round(location.spawn.y/step)*step};assert.ok(walkable(area,start.x,start.y));
  const queue=[start],seen=new Set([start.x+','+start.y]);
  for(let i=0;i<queue.length;i++){const p=queue[i];for(const [dx,dy]of [[step,0],[-step,0],[0,step],[0,-step]]){const x=p.x+dx,y=p.y+dy,key=x+','+y;if(!seen.has(key)&&walkable(area,x,y)&&walkable(area,p.x+dx/2,p.y+dy/2)){seen.add(key);queue.push({x,y});}}}
  for(const c of location.interactions)assert.ok(queue.some(p=>Math.hypot(p.x-c.x,p.y-c.y)<60),`${area}: unreachable ${c.label}`);
  if(area==='interior')continue;
  for(const [x,y]of (area==='forest'?[[640,880],[480,704],[616,536],[944,304]]:area==='city'?[[432,320],[896,320],[640,560],[1080,608]]:[[960,608],[1952,608],[960,960],[1952,960]]))assert.ok(queue.some(p=>Math.hypot(p.x-x,p.y-y)<100),`${area} district ${x},${y}`);
  if(area!=='forest')assert.ok(MAPS[area].buildings.length>=2);
 }
});

test('new scenery only relocates unsafe legacy positions, preserving progress',async()=>{
 const {validate}=await import('../src/systems/save.js');const {newState}=await import('../src/systems/state.js');
 const legacy=newState('girl');Object.assign(legacy,{area:'farm',position:{x:160,y:190},day:8,money:172,energy:62,sold:6});legacy.inventory={seed:3,tomato:4};legacy.plots[0]={crop:'tomato',growth:2,morning:true,evening:false,dryDays:0};
 assert.equal(walkable('farm',160,190),false);const loaded=validate(legacy);assert.ok(walkable(loaded.area,loaded.position.x,loaded.position.y));assert.ok(Math.hypot(loaded.position.x-160,loaded.position.y-190)<96);
 for(const key of ['character','day','money','energy','sold'])assert.deepEqual(loaded[key],legacy[key]);
 for(const [key,value]of Object.entries(legacy.inventory))assert.equal(loaded.inventory[key],value);
 for(const [key,value]of Object.entries(legacy.plots[0]))assert.deepEqual(loaded.plots[0][key],key==='growth'?1:value);
});
