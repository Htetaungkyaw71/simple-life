import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newState} from '../src/systems/state.js';
import {FARM_ENERGY,FATIGUE_MINUTES} from '../src/data/energy.js';
import {usePlot} from '../src/systems/farming.js';
import {waterGround} from '../src/systems/farmGround.js';
import {FARM_PLOTS} from '../src/data/farms.js';
import {tick} from '../src/systems/time.js';
import {validate} from '../src/systems/save.js';
import {HeldWateringCan,wateringCanPose} from '../src/entities/HeldWateringCan.js';
import {Atmosphere} from '../src/art/Atmosphere.js';
import {soilPixels} from '../src/art/FarmView.js';
import {recorder} from './helpers/uiRecorder.js';
test('a full starter bed can be planted and watered with over half the energy left',()=>{
 const s=newState();s.area='farm';s.inventory.seed=16;
 for(let i=0;i<16;i++)assert.match(usePlot(s,i),/planted/);
 assert.equal(s.energy,68);s.selected='water';
 for(let i=0;i<16;i++){s.position=FARM_PLOTS[i];assert.ok(waterGround(s,FARM_PLOTS[i],i).cared);}
 assert.equal(s.energy,52);assert.deepEqual(FARM_ENERGY,{plant:2,water:1,harvest:2,dig:2});
 s.energy=0;assert.equal(waterGround(s,FARM_PLOTS[15],15).ok,false);
});
test('fatigue drains once an hour and retains a partly accumulated hour through reload',()=>{
 const s=newState();assert.equal(FATIGUE_MINUTES,60);s.fatigueMinutes=59.5;
 const loaded=validate(s);assert.equal(loaded.fatigueMinutes,59.5);tick(loaded,100);assert.equal(loaded.energy,100);tick(loaded,100);assert.equal(loaded.energy,99);assert.ok(loaded.fatigueMinutes<1);
 const old=validate({...s,version:9,fatigueMinutes:29.5});assert.equal(old.fatigueMinutes,29.5);
});
test('the actual held can uses an existing native frame, follows every facing and hides on tool changes',()=>{
 const u=recorder(),s=newState();u.app={state:s,paused:false};s.selected='water';const held=new HeldWateringCan(u);
 const frames=JSON.parse(readFileSync('public/assets/pixel/processed/town.json')).frames;
 assert.ok(frames[held.can.frame]);assert.equal(held.can.texture,'town');assert.equal(frames[held.can.frame].frame.w,16);
 for(const dir of ['down','up','left','right']){held.update({x:100,y:100},dir,2,0);const p=wateringCanPose({x:100,y:100},dir,2);assert.equal(held.can.x,p.x);assert.equal(held.can.y,p.y);assert.equal(held.can.flipX,p.flip);assert.ok(held.can.visible);assert.ok(Math.hypot(held.hand.x-100,held.hand.y-100)<32);}
 held.update({x:100,y:100},'right',2,12);assert.equal(held.can.y,66,'jump keeps the hand and can together');
 held.pour();held.update({x:100,y:100},'right',2);assert.ok(held.can.rotation>0);u.app.paused=true;u.time.now+=100;held.update({x:100,y:100},'right',2);assert.equal(held.remaining,650);
 u.app.paused=false;for(let i=0;i<7;i++){u.time.now+=100;held.update({x:100,y:100},'right',2);}assert.equal(held.can.rotation,0);assert.equal(held.remaining,0);
 s.selected='seed';held.update({x:100,y:100},'right',2);assert.equal(held.can.visible,false);assert.equal(held.hand.visible,false);
});
test('pouring reuses the hand can and starts droplets at its spout rather than spawning a target object',()=>{
 const u=recorder();u.app={state:{selected:'water'},paused:false};const held=new HeldWateringCan(u),drops=[],tweens=[];
 const rectangle=u.add.rectangle;u.add.rectangle=(...args)=>{const r=rectangle(...args);drops.push(r);return r;};u.tweens.add=t=>tweens.push(t);
 u.player={wateringCan:held,anchor:{x:100,y:100},direction:'right',sprite:{scaleX:2}};
 Atmosphere.prototype.pour.call({scene:u},140,120);assert.equal(drops.length,12);assert.equal(tweens.length,12);
 assert.equal(held.can.frame,'watering-can-item');for(const d of drops){assert.equal(d.x,held.nozzle().x);assert.equal(d.y,held.nozzle().y);}
 for(const t of tweens){assert.ok(t.x>=132&&t.x<=148);assert.ok(t.y>=126&&t.y<=132);}
});
test('soil has rounded transparent edges and coordinate-continuous mottling instead of repeated flat tiles',()=>{
 const a=soilPixels(15,false,100,100),b=soilPixels(15,false,112,100),edge=soilPixels(0,false,100,100),wet=soilPixels(15,true,100,100);
 const colours=new Set();for(let y=0;y<24;y++)for(let x=0;x<24;x++){const i=(y*24+x)*4;assert.equal(a[i+3],255);colours.add(a.slice(i,i+3).join(','));if(x>=12)assert.deepEqual(a.slice(i,i+4),b.slice((y*24+x-12)*4,(y*24+x-12)*4+4));assert.ok(wet[i]<=a[i]);}
 assert.ok(colours.size>25);assert.equal(edge[3],0,'corner reveals underlying grass');assert.equal(edge[(12*24+12)*4+3],255);assert.notDeepEqual(a,b);
});
