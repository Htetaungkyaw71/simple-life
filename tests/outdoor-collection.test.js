import test from 'node:test';
import assert from 'node:assert/strict';
import {MAPS} from '../src/data/mapLayouts.js';
import {walkable} from '../src/data/locations.js';
import {outdoorFenceRuns} from '../src/art/OutdoorFenceView.js';

test('continuous fence artwork covers each existing cell exactly without bridging route gaps',()=>{
 for(const map of Object.values(MAPS)){
  const cells=map.props.filter(p=>p.fence),runs=outdoorFenceRuns(map.props),covered=new Set();
  for(const r of runs)for(let n=0;n<r.length;n+=32){const key=[r.vertical?'fence-v':'fence',r.x+(r.vertical?0:n),r.y+(r.vertical?n:0)].join(':');assert.ok(!covered.has(key));covered.add(key);}
  assert.deepEqual(covered,new Set(cells.map(p=>[p.name,p.x,p.y].join(':'))));
 }
 const props=[{name:'fence',x:0,y:10,fence:true},{name:'fence',x:32,y:10,fence:true},{name:'fence',x:96,y:10,fence:true}];
 assert.deepEqual(outdoorFenceRuns(props).map(r=>r.length),[64,32]);
});

test('closed gate replaces a closed City boundary while markets and travel approaches remain open',()=>{
 const gate=MAPS.city.props.find(p=>p.name==='outdoor-closed-gate');assert.ok(gate);assert.equal(gate.noShadow,true);
 assert.equal(walkable('city',1328,188),false);
 for(const [x,y]of [[432,320],[896,320],[484,488],[484,732],[80,488]])assert.ok(walkable('city',x,y));
 assert.equal(MAPS.city.props.filter(p=>p.artFrame==='snapper-planter-bench').length,3);
 assert.ok(!MAPS.city.props.some(p=>p.fence&&p.y===168&&p.x>=1280&&p.x<1376));
});
