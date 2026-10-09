import {test} from 'node:test';
import assert from 'node:assert/strict';
import {FOREST_MAP,REGIONS} from '../src/data/forest.js';
import {waterAt} from '../src/data/water.js';
import {waterRipples,ripplePose} from '../src/art/waterRipples.js';
import {forestTree} from '../src/data/forestGrowth.js';
import {walkable} from '../src/data/locations.js';
const m=FOREST_MAP;
const overlaps=(a,b)=>a.x+a.w>b.x&&a.x<b.x+b.w&&a.y+a.h>b.y&&a.y<b.y+b.h;
function verifyDry(rect,label){
 for(const b of m.bridges)assert.ok(!overlaps(rect,b),label+' must clear the whole bridge');
 for(let y=rect.y;y<=rect.y+rect.h;y+=8)for(let x=rect.x;x<=rect.x+rect.w;x+=4)assert.equal(waterAt(m,{x,y},false),false,label+' must have a dry footprint');
}
test('forest has no dirt roads or waterfall faces and low new shelves stay dry and old river banks and teal ferns remain removed',()=>{
 assert.deepEqual(m.paths,[]);assert.deepEqual(m.falls,[]);assert.equal(REGIONS.find(r=>r.id==='jaguar').name,'Emerald Banks');
 assert.ok(m.terraces.length>=65);for(const l of m.ledges)verifyDry(l,l.terrace);assert.ok(!m.details.some(p=>p.name==='fern'));assert.ok(walkable('forest',2048,970));
});
test('every grass sprite footprint and every tree root avoids bridge decks and water',()=>{
 assert.ok(m.grass.length>3000);for(const g of m.grass)verifyDry({x:g.x-24,y:g.y-48,w:48,h:48},g.id);
 for(const p of m.props.filter(forestTree))verifyDry({x:p.x+6,y:p.y+76,w:52,h:20},p.name);
});
test('forest includes palms, willows, broadleaf trees and retained cold/dry tree varieties',()=>{
 for(const name of ['palm-tree','willow-tree','broadleaf-tree','tree','snow-pine','acacia-tree'])assert.ok(m.props.filter(p=>p.name===name).length>=20,name);
 for(const p of m.props.filter(p=>p.name==='palm-tree'))assert.ok(!REGIONS.some(r=>r.biome==='snow'&&p.x+32>=r.x&&p.x+32<r.x+r.w&&p.y+90>=r.y&&p.y+90<r.y+r.h));
});
test('ripples scatter across the channel with independent lifetimes and never seed on a bridge',()=>{
 const seeds=waterRipples(m);assert.ok(seeds.length>100);assert.deepEqual(waterRipples(m),seeds,'stable source distribution');
 for(const r of seeds){assert.ok(waterAt(m,r));for(const b of m.bridges)assert.ok(!overlaps({x:r.x-12,y:r.y-4,w:28,h:12},b));}
 const river=seeds.filter(r=>r.x>2250&&r.x<2490);assert.ok(new Set(river.map(r=>r.x)).size>30,'no vertical wave lines');assert.ok(new Set(river.map(r=>r.y%48)).size>12,'no repeating wave rows');
 assert.ok(new Set(seeds.map(r=>r.period)).size>50);assert.ok(new Set(seeds.map(r=>r.delay)).size>50);
 const now=seeds.map(r=>ripplePose(r,900));assert.ok(now.some(r=>!r)&&now.some(Boolean),'ripples appear independently');assert.ok(new Set(now.filter(Boolean).map(r=>r.alpha.toFixed(2))).size>15,'waves have different phases');
});
