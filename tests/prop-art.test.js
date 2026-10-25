import {propFrame,propTexture} from '../src/data/propArt.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DECORATIONS} from '../src/data/settlement.js';
import {decorationFrame,drawDecorationArt} from '../src/art/DecorationArt.js';
import {decorationPreview} from '../src/ui/resourcePreviews.js';
import {forestLeafColor,forestTexture} from '../src/art/forestPalette.js';
import {recorder} from './helpers/uiRecorder.js';
import {drawSettlement} from '../src/art/SettlementView.js';
import {newState} from '../src/systems/state.js';
import {PROJECTS} from '../src/data/settlement.js';
const meta=JSON.parse(readFileSync('public/assets/pixel/processed/town.json'));
const atlases={town:meta,pixelSnapper:JSON.parse(readFileSync('public/assets/pixel/processed/pixel-snapper-assets.json'))};
test('unbuilt City gardens show one marker each; completed gardens show furniture without duplicate flowers or markers',()=>{
 for(const completed of [false,true]){
  const u=recorder(),s=newState(),images=[];s.settlement.projects=completed?PROJECTS.map(p=>p.id):[];u.app={state:s};
  const image=u.add.image;u.add.image=(...args)=>{const n=image(...args);images.push(n);return n;};drawSettlement(u,'city');
  assert.equal(images.filter(n=>n.frame===propFrame('post')).length,completed?0:PROJECTS.length);
  assert.equal(images.filter(n=>n.frame===propFrame('flowers2')).length,0);
  assert.equal(images.filter(n=>n.frame===propFrame('bench')).length,completed?4:0);
  assert.equal(images.filter(n=>n.frame===propFrame('prop-planter')).length,completed?5:0);
 }
});
test('every upright decoration shares local pixels between catalog and placement, including authored upright side views',()=>{
 for(const type of Object.keys(DECORATIONS))for(const dir of ['down','left','up','right']){
  const u=recorder(),p=u.add.container();drawDecorationArt(u,p,type,dir,10,20,2,100);
  const node=p.list.find(n=>n.type==='image'),frame=decorationFrame(type,dir),texture=propTexture(frame)||'town';assert.ok(atlases[texture].frames[frame],frame);assert.equal(node.frame,frame);assert.equal(node.texture,texture);assert.equal(node.rotation,undefined,'never turns upright artwork sideways');assert.equal(node.depth,100);assert.equal(node.originY,1);
 }
 for(const type of ['bench','table','fence'])assert.notEqual(decorationFrame(type,'down'),decorationFrame(type,'left'));
 assert.notEqual(decorationFrame('bench','down'),decorationFrame('bench','up'));
});
test('all catalog thumbnails stay inside their preview area on compact and full panels',()=>{
 for(const type of Object.keys(DECORATIONS))for(const [w,h]of [[46,24],[70,40],[140,100]]){
  const u=recorder(),p=u.add.container();decorationPreview(u,p,type,100,100,w,h);
  for(const n of p.list.filter(n=>n.type==='image')){const f=atlases[n.texture].frames[n.frame].frame,sw=f.w*n.scaleX,sh=f.h*n.scaleY;assert.ok(n.x-sw*n.originX>=100-w/2-1,type+' left');assert.ok(n.x+sw*(1-n.originX)<=100+w/2+1,type+' right');assert.ok(n.y-sh*n.originY>=100-h/2-1,type+' top');assert.ok(n.y+sh*(1-n.originY)<=100+h/2+1,type+' bottom');}
 }
});
test('snow retains dark needles and authored snow texture bypasses the habitat whitewash',()=>{
 const dark=forestLeafColor(43,65,31,'snow');assert.ok(Math.max(...dark)<100,'needle undersides keep their low values');assert.deepEqual(forestLeafColor(200,203,202,'snow'),[200,203,202]);assert.deepEqual(forestLeafColor(130,79,53,'snow'),[130,79,53]);
 const u=recorder(),name=forestTexture(u,'env-pine-snow','snow'),t=u.textures.cache.get(name);assert.equal(name,forestTexture(u,'env-pine-snow','snow'),'cached');assert.equal(t.sourceImage.key,'town');assert.equal(t.pixels,undefined,'native snow colours are copied without recolouring');
});
