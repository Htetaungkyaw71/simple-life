import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {lineClear} from '../src/systems/forest.js';
import {validate} from '../src/systems/save.js';
import {MAX_DECORATIONS} from '../src/data/settlement.js';
import {validDecoration,placeDecoration,readjustQuote,readjustDecoration,placedDecorationAt} from '../src/systems/settlement.js';
import {placementQuote} from '../src/systems/placement.js';
import {PlacementController} from '../src/ui/PlacementController.js';
import {placementControls} from '../src/ui/PlacementControls.js';
import {UI_COLORS} from '../src/ui/pixelWidgets.js';
import {recorder} from './helpers/uiRecorder.js';
const fixture=()=>{const s=newState();Object.assign(s,{area:'farm',position:{x:1152,y:856},selected:'decorate',selectedDecoration:'bench'});s.hasVisitedFarm=true;s.inventory.benchDecor=2;return s;};
const original=s=>{placeDecoration(s,{x:1152,y:800});s.selected='hand';return s.settlement.decorations[0];};
const unchanged=(s,fn)=>{const before=structuredClone(s);fn();assert.deepEqual(s,before);};
const appFor=s=>{const u=recorder(),a={state:s,ui:u,scene:{player:{direction:'up'},jumping:{},build(){}},save(){}};u.app=a;u.close=()=>{a.paused=false;u.menu=null;};u.feedback=()=>{};u.modal=(kicker,title,body,buttons)=>{a.paused=true;u.menu={kicker,title,body,buttons};};a.placement=new PlacementController(a);return a;};
test('clear screen placements cross the old distance and sight limits; road ground is usable',()=>{
 const s=fixture(),p={type:'bench',farm:0,x:976,y:608,direction:'down'};
 // A saved decoration supplies the sight blocker after the static farm shed removal.
 s.settlement.decorations.push({type:'barrel',farm:0,x:1056,y:720});
 assert.ok(Math.hypot(p.x-s.position.x,p.y-s.position.y)>80);assert.ok(validDecoration(s,p));assert.equal(lineClear(s.area,s.position,p,0,s),false);
 assert.equal(placementQuote(s,p,{view:{x:800,y:500,width:700,height:500}}).ok,true);assert.equal(placementQuote(s,p,{view:{x:1100,y:700,width:100,height:100}}).ok,false);
 placeDecoration(s,p);assert.equal(s.inventory.benchDecor,1);assert.deepEqual(validate(s).settlement.decorations,s.settlement.decorations);unchanged(s,()=>placeDecoration(s,p));
 s.selected='hand';assert.equal(placedDecorationAt(s,{x:p.x,y:p.y-10}),s.settlement.decorations.find(d=>d.type==='bench'));assert.equal(placedDecorationAt(s,{x:Infinity,y:0}),null);
});
test('readjust is atomic without Bag stock or a spare decoration slot; occupied, stale and cross-farm edits fail',()=>{
 const s=fixture(),d=original(s);s.inventory.benchDecor=0;const money=s.money;
 assert.equal(readjustQuote(s,d,{x:976,y:608,direction:'left'}).ok,true);unchanged(s,()=>readjustDecoration(s,d,{x:376,y:248}));
 const blocker={type:'barrel',farm:0,x:976,y:608};s.settlement.decorations.push(blocker);unchanged(s,()=>readjustDecoration(s,d,blocker));s.settlement.decorations.pop();
 while(s.settlement.decorations.length<MAX_DECORATIONS)s.settlement.decorations.push({type:'bench',farm:1,x:1152,y:800});
 readjustDecoration(s,d,{x:976,y:608,direction:'left'});assert.equal(s.settlement.decorations.length,MAX_DECORATIONS);assert.equal(s.settlement.decorations[0].direction,'left');assert.equal(s.inventory.benchDecor,0);assert.equal(s.money,money);unchanged(s,()=>readjustDecoration(s,d,{x:1152,y:800}));
 const moved=s.settlement.decorations[0];s.currentFarm=1;unchanged(s,()=>readjustDecoration(s,moved,{x:1152,y:800}));
});
test('decoration selection offers Remove and Readjust without mutation; cancel and save during readjust preserve the original',()=>{
 const s=fixture(),d=original(s),a=appFor(s),c=a.placement;s.inventory.benchDecor=9999;s.selected='axe';unchanged(s,()=>c.inspect(d));assert.deepEqual(a.ui.menu.buttons.map(b=>b[0]),['Remove','Readjust','Cancel']);assert.equal(a.ui.menu.buttons[0][2],true);
 a.ui.menu.buttons[1][1]();assert.equal(c.original,d);assert.equal(s.selected,'hand');c.move({x:976,y:608});c.turn();assert.equal(c.quote().ok,true);assert.deepEqual(validate(s).settlement.decorations,[d]);assert.equal(s.inventory.benchDecor,9999);c.cancel();assert.equal(c.draft,null);assert.equal(c.original,null);assert.deepEqual(s.settlement.decorations,[d]);
 c.inspect(d);a.ui.menu.buttons[1][1]();c.move({x:976,y:608});c.confirm();assert.equal(s.settlement.decorations.length,1);assert.equal(s.settlement.decorations[0].x,976);assert.equal(s.inventory.benchDecor,9999);
 const moved=s.settlement.decorations[0];s.inventory.benchDecor=0;a.ui.time.now+=1000;c.inspect(moved);assert.equal(s.settlement.decorations.length,1);a.ui.menu.buttons[0][1]();assert.equal(s.settlement.decorations.length,0);assert.equal(s.inventory.benchDecor,1);
});
test('Add text stays readable and all placement/edit choice controls fit phone and Mac sizes',()=>{
 for(const [w,h]of [[1280,720],[844,390],[640,360],[390,844],[360,640]])for(const ok of [true,false]){
  const u=recorder(w,h);u.app={placement:{draft:{type:'path',x:976,y:608,direction:'down'},quote:()=>({ok,message:'Choose a clear spot'}),nudge(){},turn(){},confirm(){},cancel(){}}};placementControls(u,u.root);
  const c=u.controls.find(c=>c.id==='placement-confirm');assert.equal(c.label,'Add');assert.equal(c.disabled,!ok);assert.equal(c.text.fontColor,UI_COLORS.light);assert.ok(c.text.fontHasInk);for(const id of ['left','up','down','right']){const arrow=u.controls.find(c=>c.id==='placement-'+id);assert.equal(arrow.text,null);assert.ok(arrow.box.commands.some(n=>n.color===UI_COLORS.light&&n.w===1&&n.h===1));}
  for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=w/2&&c.y+c.h<=h/2);
 }
});
