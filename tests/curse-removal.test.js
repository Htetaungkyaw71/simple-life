import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate,SaveService} from '../src/systems/save.js';
import {SAVE_KEY} from '../src/config.js';
import {attackTarget,combatRuntime,stepCombat} from '../src/systems/combat.js';
import {recoverStash} from '../src/systems/forest.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {walkable} from '../src/data/locations.js';

const legacy=stage=>{
 const s=newState('girl',123);s.day=9;s.minute=1140;s.money=1234;s.inventory.wood=19;s.inventory.stone=11;s.inventory.meat=7;s.starterSeedsClaimed=true;s.story.intro='seen';
 s.plots[0]={crop:'tomato',growth:1,wateredDay:9,missedDays:0,lastEvaluatedDay:8};
 s.curse={stage,discovered:true,brokenDay:7,restoredDay:stage==='restored'?9:0,paid:{money:600,wood:48,stone:32,meat:20},ghosts:[{id:'curse-ghost-0',health:3,area:'home',position:{x:480,y:510},arrival:0,respawn:0,windup:1}]};return s;
};

test('new lives and continued cave saves omit the retired feature without resetting progress',()=>{
 assert.equal(Object.hasOwn(newState(),'curse'),false);
 for(const stage of ['sealed','broken','restored']){
  const raw=legacy(stage),s=validate(raw),baseline=structuredClone(raw);delete baseline.curse;
  assert.deepEqual(s,validate(baseline));assert.equal(Object.hasOwn(s,'curse'),false);
  assert.equal(s.money,1234);assert.equal(s.inventory.meat,7);assert.equal(s.plots[0].growth,1);assert.equal(s.day,9);
  const data=new Map([[SAVE_KEY,JSON.stringify(raw)]]),service=new SaveService({getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)});
  const continued=service.load();assert.ok(service.write(continued));assert.equal(Object.hasOwn(JSON.parse(data.get(SAVE_KEY)),'curse'),false);
  assert.deepEqual(service.load(),continued);
 }
});

test('legacy ghost records cannot attack or become Axe targets outside the Forest',()=>{
 for(const area of ['home','farm','city','interior']){
  const s=legacy('broken');s.area=area;s.selected='axe';const r=combatRuntime();
  assert.equal(attackTarget(s,'down','curse-ghost-0'),null);
  for(let i=0;i<240;i++)assert.deepEqual(stepCombat(s,r,50),{});
  assert.equal(s.health,100);assert.equal(s.energy,100);
 }
});

test('former cave clearing has no skull prop or invisible cave collider',()=>{
 assert.equal(MAPS.forest.props.some(p=>p.name==='rocky-cave'),false);
 assert.ok(walkable('forest',8046,1180));assert.ok(walkable('forest',8046,1238));
});

test('outdoor Stash Bags from the released cave update remain recoverable once',()=>{
 for(const area of ['home','farm','city','forest']){
  const raw=legacy('broken');raw.area=area;
  raw.position=area==='forest'?{x:8046,y:1238}:area==='city'?{x:896,y:600}:area==='farm'?{x:896,y:600}:{x:480,y:500};
  raw.stash={area,...raw.position,coins:250,...(area==='farm'?{farm:0}:{})};
  const s=validate(raw);s.position={x:s.stash.x,y:s.stash.y};
  assert.match(recoverStash(s),/Recovered 250/);assert.equal(s.money,1484);assert.equal(s.stash,null);
  recoverStash(s);assert.equal(s.money,1484);
 }
});
