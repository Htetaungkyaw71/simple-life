import test from 'node:test';
import assert from 'node:assert/strict';
import {recorder} from './helpers/uiRecorder.js';
import {groundShadow,shadowTexture,SHADOW_DEPTH} from '../src/art/GroundShadow.js';
import {drawBridge,drawBridgeRails} from '../src/art/BridgeView.js';
import {canopyOccludes} from '../src/art/occlusion.js';

test('contact shadow pixels are symmetric, nearest-filtered, cached and above the soil layer',()=>{
 const scene=recorder(),key=shadowTexture(scene,28,8),t=scene.textures.get(key);
 assert.equal(t.filter,1);assert.equal(shadowTexture(scene,28,8),key);assert.equal(scene.textures.cache.size,1);
 let ink=0;for(let y=0;y<t.h;y++)for(let x=0;x<t.w;x++){
  const i=(y*t.w+x)*4,j=(y*t.w+t.w-x-1)*4;assert.deepEqual(t.pixels.slice(i,i+4),t.pixels.slice(j,j+4));if(t.pixels[i+3])ink++;
 }assert.ok(ink>0&&ink<t.w*t.h);
 const shadow=groundShadow(scene,100.4,199.8);assert.deepEqual([shadow.x,shadow.y,shadow.scaleX,shadow.scaleY],[100,200,2,2]);assert.equal(shadow.depth,SHADOW_DEPTH);assert.ok(shadow.depth>2&&shadow.depth<200);
});

test('a tall crown reveals the player behind its full height, but remains opaque in front or alongside',()=>{
 const bounds={x:100,y:100,width:128,height:256},foot=356;
 assert.equal(canopyOccludes(bounds,foot,{x:160,y:160}),true);
 assert.equal(canopyOccludes(bounds,foot,{x:160,y:300}),true);
 assert.equal(canopyOccludes(bounds,foot,{x:160,y:360}),false);
 assert.equal(canopyOccludes(bounds,foot,{x:50,y:300}),false);
 assert.equal(canopyOccludes(bounds,foot,{x:160,y:90}),false);
});

test('horizontal bridge deck and raised front/back rails use separate depth anchors',()=>{
 const scene=recorder(),b={x:100,y:200,w:192,h:72,axis:'horizontal'},deck=drawBridge(scene,b);
 assert.equal(deck.depth,0);assert.deepEqual(scene.bridgeRails.map(r=>r.depth),[208,272]);
 assert.ok(scene.bridgeRails[1].commands.some(c=>c.y===b.y+b.h-22));
});

test('long side rails sort in short ground-anchored sections without fractional pixel drawing',()=>{
 const scene=recorder(),b={x:100,y:200,w:80,h:250,axis:'vertical'},rails=drawBridgeRails(scene,b);
 assert.equal(rails.length,22);assert.equal(rails[0].depth,224);assert.equal(rails[10].depth,450);
 for(const r of rails)for(const c of r.commands)for(const key of ['x','y','w','h'])assert.ok(Number.isInteger(c[key]));
});
