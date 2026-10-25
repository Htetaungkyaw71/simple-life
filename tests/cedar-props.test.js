import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PROP_ART,propFrame,propScale,propTexture,pixelSnapperOverride} from '../src/data/propArt.js';
import {DECORATIONS} from '../src/data/settlement.js';
const atlas=JSON.parse(readFileSync('public/assets/pixel/processed/town.json')).frames;
const snapper=JSON.parse(readFileSync('public/assets/pixel/processed/pixel-snapper-assets.json')).frames;
test('cedar artwork preserves every existing prop footprint at its normal and preview scales',()=>{
 for(const [name,a]of Object.entries(PROP_ART)){
  const override=pixelSnapperOverride(name),f=(override?snapper[override.frame]:atlas[a.frame])?.frame;assert.ok(f,`${name} maps to an installed local frame`);assert.equal(propTexture(name),override?'pixelSnapper':'town');
  if(!override){const size=a.nativeSize||[atlas[name].frame.w*2,atlas[name].frame.h*2];assert.deepEqual([f.w,f.h],size,name);}
  if(!override&&!a.nativeSize)for(const scale of [.5,1,2])assert.deepEqual([f.w*propScale(name,scale),f.h*propScale(name,scale)],[atlas[name].frame.w*scale,atlas[name].frame.h*scale],`${name} at ${scale}`);
 }
 assert.equal(propFrame('bench'),'snapper-bench','new supplied bench is reused');
 assert.equal(propFrame('city-fountain0'),propFrame('city-fountain1'),'water overlay animates over a stable basin');
 assert.ok(['door0','door1','door2'].every(name=>atlas[propFrame(name)]),'all door states installed');
 assert.equal(DECORATIONS.table.indoors,true,'tables stay indoors');
});
