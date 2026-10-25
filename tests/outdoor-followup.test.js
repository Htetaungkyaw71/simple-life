import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAPS} from '../src/data/mapLayouts.js';
import {cityGreenGround,cityTreeGround,cityRoads,cityLampGround,rectHit} from '../src/data/cityPlacement.js';
import {VEGETATION,removed} from '../src/data/vegetation.js';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {LOCATIONS} from '../src/data/locations.js';
import {lampGlassPixel,lampNightStrength} from '../src/art/CityLights.js';
import {worldLight} from '../src/art/worldLight.js';

test('City tree roots occupy grass and every lamp base clears all street surfaces',()=>{
 const m=MAPS.city;
 for(const p of m.props.filter(p=>p.name==='tree'))assert.ok(cityGreenGround(m,cityTreeGround(p)),JSON.stringify(p));
 for(const p of m.props.filter(p=>p.name==='city-lamp'))assert.ok(!cityRoads(m).some(r=>rectHit(cityLampGround(p),r,6)),JSON.stringify(p));
 assert.ok(!cityGreenGround(m,[1400,100,20,16]),'canal is not green ground');
 assert.ok(!cityGreenGround(m,[1500,800,20,16]),'garden soil is not green ground');
});

test('a moved City tree retains its old saved identity and stays removed after Continue',()=>{
 const n=VEGETATION.city.trees.find(n=>n.prop.relocatedFrom);assert.ok(n);
 assert.equal(n.id,`tree:tree:${n.prop.relocatedFrom.x}:${n.prop.relocatedFrom.y}`);
 const s=newState();s.area='city';s.position={...LOCATIONS.city.spawn};s.vegetation.city={trees:[n.id],grass:[],placed:[]};s.money=880;
 const loaded=validate(s);assert.equal(loaded.money,880);assert.ok(removed(loaded,n.id));
});

test('lamp emission is off in daylight, reaches warm nighttime strength, and excludes wood/stone/transparent pixels',()=>{
 for(const minute of [420,720,1019])assert.equal(lampNightStrength(worldLight({area:'city',minute})),0);
 assert.ok(lampNightStrength(worldLight({area:'city',minute:1140}))>.5);
 assert.equal(lampNightStrength(worldLight({area:'city',minute:0})),1);
 assert.equal(lampGlassPixel(217,198,163,255),true);
 for(const p of [[217,198,163,0],[165,104,72,255],[190,140,105,255],[170,167,159,255]])assert.equal(lampGlassPixel(...p),false);
});

test('larger wells reuse a 72 by 96 native frame with grounded fixed footprints',()=>{
 const meta=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
 assert.deepEqual([meta.frames['outdoor-well-large'].frame.w,meta.frames['outdoor-well-large'].frame.h],[72,96]);
 for(const area of ['home','farm','city'])for(const p of MAPS[area].props.filter(p=>p.name==='well')){assert.equal(p.artFrame,'outdoor-well-large');assert.equal(p.artScale,1);assert.deepEqual(p.footprint,[15,68,42,24]);}
});
