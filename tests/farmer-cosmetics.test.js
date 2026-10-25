import test from 'node:test';
import assert from 'node:assert/strict';
import {COSMETIC_ART,COSMETIC_FRAMES} from '../src/data/farmerCosmetics.js';
import {farmerCosmeticPixels,baseFarmerStyle} from '../src/systems/farmerCosmetics.js';
import {freshAppearance,BOY_FARMER,GIRL_FARMER} from '../src/data/appearance.js';

test('all authored body cells have bounded accessory registration, including work and jump poses',()=>{
 for(const character of ['boy','girl']){
  assert.equal(Object.keys(COSMETIC_FRAMES[character]).length,192);
  for(const [action,clip]of Object.entries((character==='boy'?BOY_FARMER:GIRL_FARMER).clips))for(let row=0;row<4;row++)for(let phase=0;phase<clip.count;phase++){
   const anchor=COSMETIC_FRAMES[character][clip.offset+row*8+phase];assert.ok(anchor,action);
   const [cx,top,face,eye,shoulder,dir]=anchor;assert.equal(dir,row);assert.ok(cx>=12&&cx<=48);assert.ok(top>=10&&top<=36);assert.ok(eye>top&&shoulder>=top+8);assert.ok(face>=12&&face<=45);
  }
 }
 for(const views of Object.values(COSMETIC_ART)){assert.equal(views.length,4);for(const view of views){assert.ok(view.pixels.length);for(const [x,y]of view.pixels){assert.ok(x>=0&&x<view.width);assert.ok(y>=0&&y<view.height);}}}
});
test('clothes recolour fabric without changing face, transparency, boot or tool pixels',()=>{
 const width=512,input=new Uint8ClampedArray(width*2176*4),at=(x,y)=>(y*width+x)*4;
 input.set([96,98,67,255],at(32,38));input.set([247,177,117,255],at(32,28));input.set([29,19,17,255],at(29,27));input.set([91,49,32,255],at(32,55));input.set([149,151,149,255],at(42,44));input.set([96,98,67,255],at(32,2080));
 const before=new Uint8ClampedArray(input),a={...freshAppearance('boy'),outfit:'plum'},output=farmerCosmeticPixels(input,width,'boy',a);
 assert.deepEqual(input,before);assert.notDeepEqual(output.slice(at(32,38),at(32,38)+3),input.slice(at(32,38),at(32,38)+3));
 for(const [x,y]of [[32,28],[29,27],[32,55],[42,44],[32,2080]])assert.deepEqual(output.slice(at(x,y),at(x,y)+4),input.slice(at(x,y),at(x,y)+4));
 for(let i=3;i<input.length;i+=4)assert.equal(output[i],input[i]);
});
test('starter farmers keep original native texture; equipped layers are independent and back-facing glasses are hidden',()=>{
 for(const character of ['boy','girl'])assert.equal(baseFarmerStyle(freshAppearance(character),character),true);
 const input=new Uint8ClampedArray(512*2176*4),a={...freshAppearance('boy'),accessories:{hat:'straw',glasses:null,bag:null}};
 assert.equal(baseFarmerStyle(a,'boy'),false);
 const hat=farmerCosmeticPixels(input,512,'boy',a);assert.ok(hat.some(Boolean));
 const glasses=farmerCosmeticPixels(input,512,'boy',{...a,accessories:{glasses:'round'}});
 assert.equal(glasses.subarray(64*512*4,128*512*4).some(Boolean),false,'no glasses on the back of a head');
});
