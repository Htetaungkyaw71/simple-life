import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {GrassView} from '../src/art/GrassView.js';
import {SHOP_ROOMS} from '../src/data/cityShops.js';

const manifest=JSON.parse(readFileSync('output/art/barber-grass-v2/manifest.json','utf8'));
const snapper=JSON.parse(readFileSync('public/assets/pixel/processed/pixel-snapper-assets.json','utf8'));
const town=JSON.parse(readFileSync('public/assets/pixel/processed/town.json','utf8'));
const sha=file=>createHash('sha256').update(readFileSync(file)).digest('hex');

test('new chair and grass retain the preceding runtime sizes with clean local pixels',()=>{
 assert.deepEqual(town.frames['city-review-barber-chair'].frame,{x:662,y:3927,w:28,h:42});
 assert.deepEqual(manifest.runtime.chair.size,[28,42]);
 assert.deepEqual(manifest.runtime.chair.visibleBounds,[2,4,26,40]);
 assert.equal(SHOP_ROOMS.barber.props.some(([texture,frame,,,scale])=>texture==='town'&&frame==='city-review-barber-chair'&&scale===2),true);
 for(const frame of manifest.runtime.grass.frames)assert.deepEqual([snapper.frames[frame].frame.w,snapper.frames[frame].frame.h],[79,79]);
 assert.deepEqual(manifest.runtime.grass.visibleBounds,[9,10,69,79]);
 assert.equal(manifest.runtime.grass.scale,.46);
 assert.equal(manifest.checks.magentaRemoved,true);
 assert.equal(manifest.checks.binaryAlpha,true);
 assert.equal(manifest.checks.nearestOnly,true);
 assert.equal(sha('public/assets/pixel/processed/town.png'),manifest.runtime.townSha256);
 assert.equal(sha('public/assets/pixel/processed/pixel-snapper-assets.png'),manifest.runtime.pixelSnapperSha256);
 assert.equal(sha('public/assets/pixel/processed/pixel-snapper-assets.json'),manifest.runtime.pixelSnapperJsonSha256);
});

test('small ground grass bends on player contact and springs back without changing data',()=>{
 const sprite={active:true,frame:{name:'snapper-grass'},setFrame(name){this.frame.name=name;return this;}};
 const scene={app:{state:{area:'home',vegetation:{}}},cameras:{main:{worldView:{x:0,y:0,right:640,bottom:480}}},touchGrass:[{id:'grass:test',x:100,y:100,bend:0,sprite}]};
 const view=new GrassView(scene,{grass:[]});
 for(let i=0;i<3;i++)view.update(50,{x:88,y:100},false);
 assert.equal(sprite.frame.name,'snapper-grass-bend-right');
 assert.deepEqual(view.snapshot().touchBending,[{x:100,y:100,frame:'snapper-grass-bend-right'}]);
 for(let i=0;i<8;i++)view.update(50,{x:200,y:200},false);
 assert.equal(sprite.frame.name,'snapper-grass');
 assert.deepEqual(view.snapshot().touchBending,[]);
 assert.deepEqual(scene.app.state,{area:'home',vegetation:{}});
});
