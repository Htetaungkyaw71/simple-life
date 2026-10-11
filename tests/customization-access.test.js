import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {HOMES} from '../src/data/homes.js';
import {DECORATIONS,CRAFT_DECORATIONS} from '../src/data/settlement.js';
import {craftDecoration} from '../src/systems/settlement.js';
import {buyDecoration} from '../src/systems/customization.js';
import {homePixels} from '../src/art/homePalette.js';
import {hudLayout} from '../src/ui/layouts.js';
import {FarmOffice} from '../src/ui/FarmOffice.js';
import {recorder} from './helpers/uiRecorder.js';
test('every recipe crafts at Home, Farm and indoors for materials only; failures and coin purchases cannot spend',()=>{
 for(const area of ['home','farm','interior'])for(const id of CRAFT_DECORATIONS){const s=newState();s.area=area;s.inventory.wood=100;s.inventory.stone=100;const d=DECORATIONS[id];craftDecoration(s,id);assert.equal(s.money,60);assert.equal(s.inventory[d.item],1);assert.equal(s.inventory.wood,100-(d.cost.wood||0));assert.equal(s.inventory.stone,100-(d.cost.stone||0));const before=structuredClone(s);buyDecoration(s,id);assert.deepEqual(s,before);s.inventory.wood=0;s.inventory.stone=0;const poor=structuredClone(s);craftDecoration(s,id);assert.deepEqual(s,poor);}
 for(const area of ['city','forest']){const s=newState();s.area=area;s.inventory.wood=100;s.inventory.stone=100;const before=structuredClone(s);craftDecoration(s,'bench');assert.deepEqual(s,before);}
 const s=newState();s.inventory.wood=100;s.inventory.stone=100;s.inventory.benchDecor=9998;s.settlement.decorations=[{type:'bench',area:'home',x:96,y:224}];const before=structuredClone(s);craftDecoration(s,'bench');assert.deepEqual(s,before);
});
test('Customize is adjacent to Menu with bounded, distinct touch targets on every screen and tool selection',()=>{
 for(const [w,h]of [[1280,720],[390,844],[640,360],[360,640]])for(const forest of [false,true])for(const selected of ['hand','shovel','axe','grass','decorate']){const u=recorder(w,h),l=hudLayout(u,forest,selected==='axe',selected);assert.deepEqual(l.ids.slice(-2),['customize','pause']);assert.ok(l.cell>=22);assert.ok(l.x>=u.safe.left);assert.ok(l.x+l.width<=u.w-u.safe.right);assert.ok(l.y+l.cell<=u.h-u.safe.bottom);}
 const s=newState();s.area='farm';let buttons;const u={modal(kicker,title,body,choices){buttons=choices;}},a={state:s,ui:u};new FarmOffice(a).open();assert.ok(!buttons.some(([label])=>/decor|craft/i.test(label)));assert.ok(buttons.some(([label])=>label==='Seeds and harvest'));
});
test('all themed houses preserve every original alpha pixel and step while keeping different material palettes',()=>{
 const source=new Uint8ClampedArray(180*144*4);for(let i=0;i<source.length;i+=4){source.set([185,154,120,(i/4)%7?255:0],i);}source.set([233,212,185,255],(180*90+40)*4);
 const outputs=[];for(const id of Object.keys(HOMES)){const out=homePixels(source,id);assert.equal(out.length,source.length);for(let i=3;i<out.length;i+=4)assert.equal(out[i],source[i]);assert.deepEqual(out.slice(180*129*4),source.slice(180*129*4));outputs.push(Buffer.from(out).toString('base64'));}assert.equal(new Set(outputs).size,9);assert.deepEqual(homePixels(source,'starter'),source);assert.deepEqual(homePixels(source,'unknown'),source);
});
