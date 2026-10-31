import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAPS} from '../src/data/mapLayouts.js';
import {PLANTER_BENCH} from '../src/data/planterBench.js';
import {walkable} from '../src/data/locations.js';
import {dryFootprint} from '../src/data/water.js';
import {groundDetailFootprint,hitsRows,isNaturalScenery,surfaceFootprint} from '../src/data/surfaceClearance.js';

test('incidental scenery stays off every road and every water surface',()=>{
 for(const [area,map] of Object.entries(MAPS).filter(([name])=>name!=='city')){
  for(const p of map.props){
   const box=surfaceFootprint(p);
   assert.equal(dryFootprint(map,box),true,`${area} ${p.name} is on water or a bridge`);
   if(isNaturalScenery(p))assert.equal(hitsRows(box,map.paths,24),false,`${area} ${p.name} is on a road`);
  }
  for(const p of map.details){
   const box=groundDetailFootprint(p);
   assert.equal(dryFootprint(map,box),true,`${area} ${p.name} detail is on water or a bridge`);
   assert.equal(hitsRows(box,map.paths,8),false,`${area} ${p.name} detail is on a road`);
  }
 }
 assert.ok(!MAPS.home.props.some(p=>p.name==='tree'&&p.x===480&&p.y===880),'the reviewed road tree is removed');
});

test('home storage props have visible breathing room and no ground growth',()=>{
 const barrel=MAPS.home.props.find(p=>p.name==='barrel'&&p.x===1432),crate=MAPS.home.props.find(p=>p.name==='crate'&&p.x===1560);
 assert.ok(crate.x-(barrel.x+98)>=30);
 const barrelVisual=[barrel.x,barrel.y,98,101];
 assert.ok(!MAPS.home.details.some(p=>hitsRows(groundDetailFootprint(p),[barrelVisual],2)));
});

test('large authored barrels block their visible body without extra clearance',()=>{
 for(const area of ['home','city'])for(const p of MAPS[area].props.filter(p=>p.name==='barrel')){
  const expected=[p.x+25,p.y+19,47,69];
  assert.ok(MAPS[area].obstacles.some(box=>box.every((value,index)=>value===expected[index])),`${area} barrel uses its visible bounds`);
  assert.equal(walkable(area,p.x+49,p.y+54,0),false,`${area} barrel centre is solid`);
  assert.equal(walkable(area,p.x+84,p.y+54),true,`${area} barrel allows a close side approach`);
  assert.equal(walkable(area,p.x+49,p.y+100),true,`${area} barrel has no invisible clearance below it`);
 }
});

test('bootstrap markup presents a styled loading state before Phaser starts',()=>{
 const html=readFileSync('index.html','utf8'),css=readFileSync('src/ui/styles.css','utf8');
 assert.match(html,/id="loading-screen"/);assert.match(html,/role="progressbar"/);assert.match(html,/Loading your little world/);
 const head=html.slice(html.indexOf('<head>'),html.indexOf('</head>'));assert.match(head,/<style>[^]*background:#263e38/);assert.match(head,/\.loading-screen\{/);
 assert.match(css,/\.loading-screen\{/);assert.match(css,/\.loading-screen__fill\{/);
});

test('visible stones block their painted body without invisible padding',()=>{
 for(const area of ['home','farm']){
  const rocks=MAPS[area].props.filter(p=>p.name==='rock');let approachable=0;
  for(const p of rocks){
   assert.ok(MAPS[area].obstacles.some(b=>b[0]===p.x+2&&b[1]===p.y+22&&b[2]===60&&b[3]===40),`${area} rock uses its visible bounds`);
   assert.equal(walkable(area,p.x+32,p.y+42,0),false,`${area} rock centre is solid`);
   if([[p.x-16,p.y+42],[p.x+74,p.y+42],[p.x+32,p.y+74]].some(([x,y])=>walkable(area,x,y)))approachable++;
  }
  assert.ok(approachable>=rocks.length-1,`${area} isolated rocks allow close approaches`);
 }
 const forestRocks=MAPS.forest.props.filter(p=>p.name==='rock');for(const p of forestRocks){
  assert.ok(MAPS.forest.obstacles.some(b=>b[0]===p.x-20&&b[1]===p.y-8&&b[2]===104&&b[3]===72),'Forest boulder uses its visible bounds');
  assert.equal(walkable('forest',p.x+32,p.y+28,0),false,'Forest boulder centre is solid');
 }
 for(const p of MAPS.forest.props.filter(p=>p.rocky&&p.solid)){
  assert.ok(MAPS.forest.obstacles.some(b=>b[0]===p.x&&b[1]===p.y&&b[2]===p.w&&b[3]===p.h),`${p.name} has no invisible extension`);
  assert.equal(walkable('forest',p.x+p.w/2,p.y+p.h/2,0),false,`${p.name} centre is blocked`);
 }
});

test('City planter benches block their full visible body and allow close approach',()=>{
 for(const p of MAPS.city.props.filter(p=>p.name==='city-bench-garden')){
  const [ox,oy,w,h]=PLANTER_BENCH.footprint,expected=[p.x+ox,p.y+oy,w,h];
  assert.ok(MAPS.city.obstacles.some(box=>box.every((value,index)=>value===expected[index])),'planter bench uses its scaled visible bounds');
  assert.equal(walkable('city',p.x+71,p.y+49,0),false,'planter body is solid');
  assert.equal(walkable('city',p.x+119,p.y+49),true,'farmer can approach beside the planter');
  assert.equal(walkable('city',p.x+71,p.y+107),true,'no invisible wall remains below the planter');
 }
});
