import {test} from 'node:test';
import assert from 'node:assert/strict';
import {movementVector,movementFacing,joystickVector} from '../src/systems/movement.js';
import {mobileControls} from '../src/ui/MobileControls.js';
import {ROOM,FURNITURE,configureRoom} from '../src/data/interior.js';
import {LARGE_HOUSE_SOLIDS} from '../src/data/largeHouseGeometry.js';
import {walkable,syncInterior} from '../src/data/locations.js';
import {beginJump,jumpRuntime,stepJump} from '../src/systems/jump.js';
import {newState} from '../src/systems/state.js';
import {recorder} from './helpers/uiRecorder.js';
import {UI_COLORS} from '../src/ui/pixelWidgets.js';

test('eight-way input retains equal speed, analog strength and stable diagonal native facing',()=>{
 for(const x of [-1,0,1])for(const y of [-1,0,1]){
  const v=movementVector({}, {stick:{x,y}});assert.ok(Math.hypot(v.x,v.y)<=1+1e-12);
  if(x&&y)assert.ok(Math.abs(v.x/v.y-x/y)<1e-10);
 }
 assert.deepEqual(movementVector({}, {stick:{x:.25,y:0}}),{x:.25,y:0});
 assert.deepEqual(movementVector({W:{isDown:true}}, {stick:{x:1,y:1}}),{x:0,y:-1});
 for(const x of [-1,1])for(const y of [-1,1])for(const prior of [x<0?'left':'right',y<0?'up':'down']){
  let facing=prior;for(let i=0;i<100;i++)facing=movementFacing(x*(i%2?.999:1.001),y,facing);assert.equal(facing,prior);
 }
 assert.equal(movementFacing(1,0,'up'),'right');assert.equal(movementFacing(0,-1,'left'),'up');
 assert.deepEqual(joystickVector(1,1,18),{x:0,y:0});assert.ok(Math.abs(Math.hypot(...Object.values(joystickVector(100,100,18)))-1)<1e-12);
});
test('joystick owns one pointer, supports a separate action finger, releases outside and resets on UI rebuild',()=>{
 const ui=recorder(360,640);let jumped=0,attacked=0,chopped=0,context=null;ui.app={state:{...newState(),selected:'axe'},input:{},ui:{feedback(){}},scene:{jump(){jumped++;},context:()=>context},attack(){attacked++;},use(){chopped++;}};
 const stick=mobileControls(ui,ui.root),cx=(stick.x+stick.w/2)*2,cy=(stick.y+stick.h/2)*2,event={stopPropagation(){}};
 stick.box.events.pointerdown({id:1,x:cx+24,y:cy-24},0,0,event);assert.ok(ui.app.input.stick.x>0&&ui.app.input.stick.y<0);
 assert.equal(stick.box.commands.at(-1).color,UI_COLORS.cream,'moving keeps the joystick knob white');
 const before={...ui.app.input.stick};stick.box.events.pointerdown({id:2,x:cx-24,y:cy},0,0,event);stick.move({id:2,x:0,y:0});assert.deepEqual(ui.app.input.stick,before);
 ui.controls.find(c=>c.id==='jump').action();ui.controls.find(c=>c.id==='attack').action();assert.equal(jumped,1);assert.equal(attacked,1);assert.deepEqual(ui.app.input.stick,before);
 ui.app.state.selected='axe';context={type:'chop'};ui.controls.find(c=>c.id==='attack').action();assert.equal(chopped,1);
 stick.release({id:2});assert.deepEqual(ui.app.input.stick,before);stick.move({id:1,x:10000,y:-10000});assert.ok(Math.hypot(...Object.values(ui.app.input.stick))<=1);
 stick.release({id:1});assert.deepEqual(ui.app.input.stick,{x:0,y:0});stick.box.events.pointerdown({id:3,x:cx+30,y:cy},0,0,event);stick.reset();stick.move({id:3,x:cx+50,y:cy});assert.deepEqual(ui.app.input.stick,{x:0,y:0});
});
test('all thirteen house finishes share the reference structure and doorway footprint',()=>{
 const masks=Object.values(LARGE_HOUSE_SOLIDS);assert.equal(masks.length,13);for(const mask of masks.slice(1))assert.deepEqual(mask,masks[1]);assert.ok(masks[0].length>masks[1].length);
});
test('furnished Home has connected spawn, bed and exit at every supported viewport',()=>{
 for(const [w,h]of [[1280,720],[1440,900],[1024,768],[360,640],[640,360],[390,844]]){
  syncInterior(w,h);for(const p of [ROOM.spawn,ROOM.bed,ROOM.exit])assert.ok(walkable('interior',p.x,p.y,6));
  const origin={x:Math.round(ROOM.spawn.x/4)*4,y:Math.round(ROOM.spawn.y/4)*4},q=[origin],seen=new Set([origin.x+','+origin.y]);
  for(let i=0;i<q.length;i++)for(const [dx,dy]of [[4,0],[-4,0],[0,4],[0,-4]]){const p={x:q[i].x+dx,y:q[i].y+dy},key=p.x+','+p.y;if(!seen.has(key)&&walkable('interior',p.x,p.y,6)){seen.add(key);q.push(p);}}
  for(const p of [ROOM.bed,ROOM.exit])assert.ok(q.some(v=>Math.hypot(v.x-p.x,v.y-p.y)<=4),`${w}x${h} unreachable ${JSON.stringify(p)}`);
  assert.ok(FURNITURE.some(f=>f[0]==='home-bed'));assert.ok(FURNITURE.some(f=>f[0]==='home-fireplace'));
 }
 configureRoom();syncInterior(1280,720);
});
test('mobile outdoor jumps reuse collision checks and leave interior/energy/save rules intact',()=>{
 const s=newState(),r=jumpRuntime(),energy=s.energy;s.position={x:480,y:600};assert.ok(beginJump(s,r,{x:1,y:0}));for(let i=0;i<12;i++)stepJump(s,r,50);assert.ok(walkable('home',s.position.x,s.position.y));assert.equal(s.energy,energy);
 s.area='interior';s.position={...ROOM.spawn};assert.equal(beginJump(s,jumpRuntime(),{x:1,y:0}),false);
});
