import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ROOM,FURNITURE,roomVisibleRect} from '../src/data/interior.js';
import {HOME_INTERIOR_ART} from '../src/data/homeInteriorArt.js';
import {homeInteriorSurface} from '../src/art/homeInteriorSurface.js';
import {syncInterior,walkable} from '../src/data/locations.js';
import {contextFor} from '../src/systems/context.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
const profiles=[[1440,900],[1280,720],[1024,768],[844,390],[390,844]];

test('approved home fixtures remain wall mounted and every newly supplied interior asset is installed',()=>{
 const atlases={homeInterior:JSON.parse(readFileSync('public/assets/pixel/processed/home-interior.json')).frames,pixelSnapper:JSON.parse(readFileSync('public/assets/pixel/processed/pixel-snapper-assets.json')).frames};
 for(const [w,h]of profiles){
  syncInterior(w,h);
  assert.equal(FURNITURE.filter(p=>p[0]==='home-window').length,2);
  for(const p of FURNITURE){const art=HOME_INTERIOR_ART[p[0]];assert.ok(atlases[art.texture][art.frame],p[0]);const r=roomVisibleRect(p);if(['home-window','home-wall-shelf'].includes(p[0]))assert.ok(r.y>=10&&r.y+r.h<=96,'fixture fits the plaster');}
  assert.equal(FURNITURE.filter(p=>p[0]==='home-storage-jar').length,1);assert.equal(FURNITURE.filter(p=>p[0]==='home-threshold').length,1);
  const fireplace=roomVisibleRect(FURNITURE.find(p=>p[0]==='home-fireplace')),fire=roomVisibleRect(FURNITURE.find(p=>p[0]==='home-fire'));assert.ok(Math.abs(fire.x+fire.w/2-(fireplace.x+fireplace.w/2))<1);assert.ok(fire.y+fire.h<=fireplace.y+fireplace.h);
  const logs=roomVisibleRect(FURNITURE.find(p=>p[0]==='home-logs'));assert.equal(logs.y+logs.h,138,'wood stays aligned with the fireplace wall');assert.ok(logs.w>50&&logs.w<60,'new wood pile keeps the reviewed Home size');
 }
 syncInterior(1280,720);
});

test('all five room profiles provide a continuous walking route to the bed, cooking station, door and both table sides',()=>{
 for(const [w,h]of profiles){
  syncInterior(w,h);const s=newState();s.area='interior';s.position={...ROOM.spawn};
  const table=roomVisibleRect(FURNITURE.find(p=>p[0]==='home-table'));
  const targets=[ROOM.bed,ROOM.hearth,ROOM.exit,{x:table.x-12,y:table.y+table.h/2},{x:table.x+table.w+12,y:table.y+table.h/2}];
  for(const p of targets)assert.ok(walkable('interior',p.x,p.y,6,false,s),'safe target '+JSON.stringify(p));
  const seen=new Set(),queue=[s.position];seen.add(s.position.x+','+s.position.y);
  for(let i=0;i<queue.length;i++)for(const [dx,dy]of [[4,0],[-4,0],[0,4],[0,-4]]){
   const x=queue[i].x+dx,y=queue[i].y+dy,k=x+','+y;if(seen.has(k)||!walkable('interior',x,y,6,false,s))continue;seen.add(k);queue.push({x,y});
  }
  for(const p of targets)assert.ok(queue.some(q=>Math.abs(q.x-p.x)<=4&&Math.abs(q.y-p.y)<=4),'reachable target '+JSON.stringify({w,h,p}));
  for(const [p,type]of [[ROOM.bed,'bed'],[ROOM.hearth,'cooking'],[ROOM.exit,'travel']]){s.position={...p};assert.equal(contextFor(s).type,type);}
 }
 syncInterior(1280,720);
});

test('rasterized architecture has solid side faces, a clear front opening and hard pixel edges',()=>{
 const {width:w,height:h,back,front}=homeInteriorSurface(576,400),at=(a,x,y)=>Array.from(a.slice((y*w+x)*4,(y*w+x)*4+4));
 for(let i=3;i<back.length;i+=4){assert.ok([0,255].includes(back[i]));assert.ok([0,255].includes(front[i]));}
 for(let y=112;y<368;y++){assert.deepEqual(at(front,8,y),at(front,8,112));assert.deepEqual(at(front,w-8,y),at(front,w-8,112));}
 assert.equal(at(front,w/2,380)[3],0);assert.equal(at(back,w/2,380)[3],255);
 assert.equal(at(front,w/2-40,380)[3],255);assert.equal(at(front,w/2+40,380)[3],255);
 assert.deepEqual(at(back,20,40),[240,221,188,255]);assert.notDeepEqual(at(back,20,120),at(back,20,40));
});

test('green and blue Home choices render visibly different room surfaces',()=>{
 const green=homeInteriorSurface(576,400,'starter'),blue=homeInteriorSurface(576,400,'slate');
 assert.notDeepEqual(Array.from(green.back.slice((40*576+20)*4,(40*576+20)*4+4)),Array.from(blue.back.slice((40*576+20)*4,(40*576+20)*4+4)));
 assert.notDeepEqual(Array.from(green.back.slice((140*576+200)*4,(140*576+200)*4+4)),Array.from(blue.back.slice((140*576+200)*4,(140*576+200)*4+4)));
});

test('older room saves repair wall positions and return displaced paid furniture once while retaining progress',()=>{
 syncInterior(1280,720);const s=newState('girl');Object.assign(s,{area:'interior',position:{x:200,y:72},money:723,day:8});s.settlement.stove=true;s.inventory.bookcaseDecor=2;s.inventory.mango=7;
 s.settlement.decorations=[{type:'bookcase',area:'interior',x:392,y:120}];const v=validate(s);
 assert.ok(walkable('interior',v.position.x,v.position.y,6,false,v));assert.equal(v.money,723);assert.equal(v.day,8);assert.equal(v.inventory.mango,7);assert.equal(v.settlement.stove,true);
 assert.equal(v.inventory.bookcaseDecor,3);assert.deepEqual(v.settlement.decorations,[]);assert.deepEqual(validate(v),v);
});
