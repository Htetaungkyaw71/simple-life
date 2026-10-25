import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MAPS} from '../src/data/mapLayouts.js';
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

test('large authored barrels block their visible body instead of the retired small footprint',()=>{
 for(const area of ['home','city'])for(const p of MAPS[area].props.filter(p=>p.name==='barrel')){
  const expected=[p.x+25,p.y+19,47,117];
  assert.ok(MAPS[area].obstacles.some(box=>box.every((value,index)=>value===expected[index])),`${area} barrel uses its rendered bounds plus farmer clearance`);
  assert.equal(walkable(area,p.x+49,p.y+54,0),false,`${area} barrel centre is blocked`);
  assert.equal(walkable(area,p.x+49,p.y+120,0),false,`${area} barrel keeps the farmer's visible body clear below it`);
 }
});

test('bootstrap markup presents a styled loading state before Phaser starts',()=>{
 const html=readFileSync('index.html','utf8'),css=readFileSync('src/ui/styles.css','utf8');
 assert.match(html,/id="loading-screen"/);assert.match(html,/role="progressbar"/);assert.match(html,/Loading your little world/);
 const head=html.slice(html.indexOf('<head>'),html.indexOf('</head>'));assert.match(head,/<style>[^]*background:#263e38/);assert.match(head,/\.loading-screen\{/);
 assert.match(css,/\.loading-screen\{/);assert.match(css,/\.loading-screen__fill\{/);
});

test('visible stones are solid across Home, Farm and the Forest',()=>{
 for(const area of ['home','farm'])for(const p of MAPS[area].props.filter(p=>p.name==='rock')){
  assert.ok(MAPS[area].obstacles.some(b=>b[0]===p.x&&b[1]===p.y&&b[2]===64&&b[3]===112),`${area} rock keeps the farmer's visible body clear`);
  assert.equal(walkable(area,p.x+32,p.y+32,0),false,`${area} rock centre is blocked`);
 }
 for(const p of MAPS.forest.props.filter(p=>p.name==='rock')){
  assert.ok(MAPS.forest.obstacles.some(b=>b[0]===p.x-20&&b[1]===p.y-8&&b[2]===104&&b[3]===120),"Forest boulder keeps the farmer's visible body clear");
  assert.equal(walkable('forest',p.x+32,p.y+28,0),false,'Forest boulder centre is blocked');
 }
 for(const p of MAPS.forest.props.filter(p=>p.rocky&&p.solid)){
  assert.ok(MAPS.forest.obstacles.some(b=>b[0]===p.x&&b[1]===p.y&&b[2]===p.w&&b[3]===p.h+48),`${p.name} keeps the farmer's visible body clear`);
  assert.equal(walkable('forest',p.x+p.w/2,p.y+p.h/2,0),false,`${p.name} centre is blocked`);
 }
});
