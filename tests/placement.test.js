import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {DECORATIONS,DECORATION_DIRECTIONS} from '../src/data/settlement.js';
import {craftDecoration,placeDecoration,reclaimDecoration,decorationContext} from '../src/systems/settlement.js';
import {placementDraft,adjustPlacement,turnPlacement,placementQuote} from '../src/systems/placement.js';
import {decorationRect,decorationBoxes,overlaps} from '../src/systems/settlementGeometry.js';
import {walkable} from '../src/data/locations.js';
import {PlacementController} from '../src/ui/PlacementController.js';
import {placementControls} from '../src/ui/PlacementControls.js';
import {ResourcePanel} from '../src/ui/ResourcePanel.js';
import {recorder} from './helpers/uiRecorder.js';
const stocked=()=>{const s=newState();s.area='farm';s.position={x:1152,y:856};s.hasVisitedFarm=true;s.selected='decorate';s.inventory.wood=200;s.inventory.stone=200;for(const def of Object.values(DECORATIONS))s.inventory[def.item]=1;return s;};
const noMutation=(s,fn)=>{const before=structuredClone(s);fn();assert.deepEqual(s,before);};
test('draft movement and four turns never spend an item; confirmation uses the exact preview geometry',()=>{
 const s=stocked();let d=placementDraft(s,'up');assert.equal(d.y,800);const before=structuredClone(s);
 d=adjustPlacement(d,{x:1155,y:804});assert.deepEqual([d.x,d.y],[1152,808]);const start={...d};for(let i=0;i<4;i++)d=turnPlacement(d);assert.deepEqual(d,start);assert.deepEqual(s,before);
 for(const type of Object.keys(DECORATIONS))for(const direction of DECORATION_DIRECTIONS){const a=stocked();a.selectedDecoration=type;const p={type,farm:0,x:1152,y:800,direction};const q=placementQuote(a,p);assert.ok(q.ok,type+' '+direction+' '+q.message);placeDecoration(a,p);assert.equal(a.inventory[DECORATIONS[type].item],0);assert.deepEqual(decorationRect(a.settlement.decorations[0]),decorationRect(p));assert.deepEqual(validate(a),a);a.selected='hand';assert.equal(decorationContext(a,{x:1152,y:decorationRect(p).y+5}).type,'reclaimDecoration');reclaimDecoration(a,p);assert.equal(a.inventory[DECORATIONS[type].item],1);assert.equal(a.settlement.decorations.length,0);}
});
test('blocked previews and stale/cross-farm selection reject atomically; cancellation retains the item',()=>{
 const s=stocked();for(const p of [{x:1792,y:720},{x:s.position.x,y:s.position.y},{x:1152,y:808,direction:'forged'},{x:1152,y:800,farm:1},{x:1152,y:800,type:'path'},{x:Infinity,y:800}])noMutation(s,()=>assert.equal(placementQuote(s,{type:'bench',farm:0,direction:'down',...p}).ok,false));
 const u=recorder(),a={state:s,ui:u,scene:{player:{direction:'up'},jumping:{},build(){}},save(){}};u.app=a;const c=new PlacementController(a);a.placement=c;u.close=()=>{a.paused=false;};c.begin('bench');const item=s.inventory.benchDecor;c.move({x:1792,y:720});c.turn();c.cancel();assert.equal(c.draft,null);assert.equal(s.inventory.benchDecor,item);assert.equal(s.settlement.decorations.length,0);
});
test('side furniture footprints, collisions and restored directions match; legacy cuts and furniture remain intact',()=>{
 const s=stocked(),p={type:'bench',farm:0,x:1152,y:800,direction:'left'};placeDecoration(s,p);assert.deepEqual(decorationRect(p),{x:1132,y:736,w:40,h:64});const b=decorationBoxes(s,'farm')[0];assert.equal(walkable('farm',b[0]+b[2]/2,b[1]+b[3]/2,12,false,s),false);const v=validate(s);assert.equal(v.settlement.decorations[0].direction,'left');assert.deepEqual(validate(v),v);
 const old=stocked();old.version=15;old.settlement.decorations=[{type:'bench',farm:0,x:1152,y:800}];old.vegetation={'farm:0':{trees:[],grass:[],placed:[]}};old.inventory.tableDecor=undefined;assert.equal(validate(old).inventory.tableDecor,0);assert.deepEqual(validate(old).settlement.decorations,old.settlement.decorations);const bad=stocked();bad.settlement.decorations=[{...p,direction:'forged'},{...p,direction:2}];assert.deepEqual(validate(bad).settlement.decorations,[]);
});
test('all new recipes have pictured pages and material costs; object pages and placement controls fit seven viewports',()=>{
 for(const [w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844],[640,360],[360,640]]){const u=recorder(w,h),s=stocked(),a={state:s,ui:u,scene:{},save(){}};u.app=a;a.placement={draft:placementDraft(s,'up'),quote:()=>placementQuote(s,a.placement.draft),nudge(){},turn(){},cancel(){},confirm(){}};
  placementControls(u,u.root);for(const c of u.controls){assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,c.id+' '+w+'x'+h);assert.ok(c.w>=22&&c.h>=22);for(const other of u.controls)if(c!==other)assert.equal(overlaps(c,other),false);}
  const r=new ResourcePanel(a);for(let i=4;i<7;i++){r.decorations(i);assert.equal(u.menu.page.preview,Object.keys(DECORATIONS)[i]);for(const c of u.controls)assert.ok(c.w>=22&&c.h>=22,c.id+' touch size');for(const t of u.root.list.filter(n=>n.type==='text'))assert.ok(t.x-t.width*t.originX>=u.menuBounds.x/2&&t.x+t.width*(1-t.originX)<=(u.menuBounds.x+u.menuBounds.w)/2,t.text+' '+w+'x'+h);}
 }
 for(const type of ['table','barrel','lantern']){const s=stocked(),def=DECORATIONS[type],before=s.inventory[def.item];craftDecoration(s,type);assert.equal(s.inventory[def.item],before+1);assert.equal(s.inventory.wood,200-def.cost.wood);assert.equal(s.inventory.stone,200-(def.cost.stone||0));}
});
test('packing a turned piece from the side ignores its own solid but opens selection across blockers and full-bag guard',()=>{
 const s=stocked(),p={type:'table',farm:0,x:1152,y:800,direction:'left'};s.selectedDecoration='table';placeDecoration(s,p);s.selected='hand';s.position={x:1112,y:784};assert.ok(decorationContext(s,{x:1152,y:760}));s.inventory.tableDecor=9999;noMutation(s,()=>reclaimDecoration(s,p));s.inventory.tableDecor=0;reclaimDecoration(s,p);assert.equal(s.inventory.tableDecor,1);noMutation(s,()=>reclaimDecoration(s,p));
});
