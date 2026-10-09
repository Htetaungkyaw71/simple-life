import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOREST_MAP,FOREST_ENTRANCE} from '../src/data/forest.js';
import {FOREST_PORTAL,forestPortalTravel} from '../src/data/forestLandmarks.js';
import {forestHabitat} from '../src/data/forestHabitats.js';
import {dryFootprint,waterAt} from '../src/data/water.js';
import {walkable} from '../src/data/locations.js';
import {newState} from '../src/systems/state.js';

test('central return gate is entered on foot, respects travel cooldown and leaves progress intact',()=>{
 const s=newState();s.area='forest';s.position={x:FOREST_PORTAL.x,y:FOREST_PORTAL.y};s.money=317;s.inventory.mango=4;const before=JSON.stringify(s);
 const travel=forestPortalTravel(s,1000,999);assert.deepEqual(travel,{to:'forest',spawn:FOREST_ENTRANCE,facing:'down',portal:true});assert.equal(JSON.stringify(s),before);
 assert.equal(forestPortalTravel(s,999,1000),null);s.position.y+=31;assert.equal(forestPortalTravel(s,1000,999),null);s.position.y-=31;s.area='farm';assert.equal(forestPortalTravel(s,1000,999),null);
 for(let x=-80;x<=80;x+=16)for(let y=-80;y<=80;y+=16){const p={x:FOREST_PORTAL.x+x,y:FOREST_PORTAL.y+y};assert.ok(walkable('forest',p.x,p.y),'ring and approaches are walkable');assert.equal(waterAt(FOREST_MAP,p),false);}
 assert.ok(walkable('forest',travel.spawn.x,travel.spawn.y));
});
test('every selected native rocky asset appears on dry Dark Forest ground, clear of crossings and cliffs',()=>{
 const evidence=JSON.parse(readFileSync('docs/assets/licenses/rocky-depth/selected-assets.json')),atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
 const props=FOREST_MAP.props.filter(p=>p.rocky);assert.equal(new Set(props.map(p=>p.name)).size,8);
 for(const selected of evidence.selected){assert.ok(props.some(p=>p.name===selected.frame),selected.frame);const f=atlas.frames[selected.frame].frame;assert.deepEqual([f.w,f.h],selected.size);}
 for(const p of props){assert.equal(forestHabitat({x:p.x+p.w/2,y:p.foot}).id,'darkForest');assert.ok(dryFootprint(FOREST_MAP,p));assert.ok(p.x>=0&&p.y>=0&&p.x+p.w<=10240&&p.y+p.h<=5120);const overlap=r=>p.x+p.w>r.x&&p.x<r.x+r.w&&p.y+p.h>r.y&&p.y<r.y+r.h;assert.ok(!FOREST_MAP.bridges.some(overlap));assert.ok(!FOREST_MAP.ledges.some(l=>overlap({...l,w:32,h:48})));}
});
