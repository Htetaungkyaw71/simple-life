import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {CROPS,CROP_IDS,LEGACY_GROWTH_DAYS} from '../src/data/crops.js';
import {PROJECTS,DECORATIONS,STOVE_COST} from '../src/data/settlement.js';
import {dailyOrders,deliverOrder,completeProject,craftDecoration,buildStove,grillMeat,validDecoration,placeDecoration,reclaimDecoration,decorationContext} from '../src/systems/settlement.js';
import {nextDay} from '../src/systems/time.js';
import {usePlot} from '../src/systems/farming.js';
import {eatFood} from '../src/systems/forest.js';
import {validate} from '../src/systems/save.js';
import {walkable,LOCATIONS} from '../src/data/locations.js';
import {openGround} from '../src/systems/farmGround.js';
import {grassGround} from '../src/systems/vegetation.js';
import {buyFarm} from '../src/systems/expansion.js';
import {MAPS} from '../src/data/mapLayouts.js';
import {overlaps} from '../src/systems/settlementGeometry.js';
import {settlementRects} from '../src/art/SettlementView.js';
import {ResourcePanel} from '../src/ui/ResourcePanel.js';
import {BagPanel,bagItems} from '../src/ui/BagPanel.js';
import {drawModal} from '../src/ui/MenuView.js';
import {recorder} from './helpers/uiRecorder.js';
const stocked=area=>{const s=newState();s.area=area;s.position={...LOCATIONS[area].spawn};s.hasVisitedCity=area==='city';s.hasVisitedFarm=['city','farm'].includes(area);s.inventory.wood=100;s.inventory.stone=100;s.inventory.meat=3;return s;};
const noMutation=(s,fn)=>{const before=structuredClone(s);fn();assert.deepEqual(s,before);};
const placement={type:'bench',farm:0,x:1152,y:800};
test('each crop earns only one growth per watered calendar day, requiring three to six days',()=>{
 for(const id of CROP_IDS){const s=newState(),d=CROPS[id];s.inventory[d.seedKey]=1;s.selectedCrop=id;usePlot(s,0);assert.ok(d.growthDays>=3&&d.growthDays<=6);s.selected='water';
  for(let i=0;i<d.growthDays;i++){s.minute=1439;usePlot(s,0);const e=s.energy;usePlot(s,0);assert.equal(s.energy,e);nextDay(s);assert.equal(s.plots[0].growth,i+1);s.selected='harvest';assert.equal(s.inventory[id],0);if(i<d.growthDays-1){assert.equal(usePlot(s,0),'Still growing');assert.equal(s.inventory[id],0);}s.selected='water';}
  s.selected='harvest';usePlot(s,0);assert.equal(s.inventory[id],d.harvestYield);
 }
 assert.equal(CROPS.tomato.growthDays,3);assert.equal(CROPS.pumpkin.growthDays,6);
 const s=newState();s.inventory.seed=1;usePlot(s,0);s.selected='water';usePlot(s,0);nextDay(s);nextDay(s);nextDay(s);assert.equal(s.plots[0].growth,1);assert.equal(s.plots[0].missedDays,2);
});
test('schema 13 preserves ripe harvests and extends only still-growing legacy crops',()=>{
 for(const id of CROP_IDS){const raw=newState('girl');raw.version=13;raw.plots[0]={...raw.plots[0],crop:id,growth:LEGACY_GROWTH_DAYS[id],missedDays:0};raw.money=732;raw.inventory.wood=8;const ripe=validate(raw);assert.equal(ripe.plots[0].growth,CROPS[id].growthDays);assert.equal(ripe.money,732);assert.equal(ripe.inventory.wood,8);assert.deepEqual(validate(ripe),ripe);
  raw.plots[0].growth=Math.max(0,LEGACY_GROWTH_DAYS[id]-1);assert.equal(validate(raw).plots[0].growth,raw.plots[0].growth);
  raw.plots[0].missedDays=4;assert.equal(validate(raw).plots[0].missedDays,4);
 }
});
test('daily NPC orders pay exactly once, rotate on midnight and reject incomplete/overflow transactions',()=>{
 const s=stocked('city'),d=dailyOrders(s)[0],coins=s.money,wood=s.inventory.wood,stone=s.inventory.stone;
 deliverOrder(s,d.id);assert.equal(s.money,coins+d.coins);assert.equal(s.inventory[d.seed],d.seeds);assert.equal(s.inventory.wood,wood-(d.cost.wood||0));assert.equal(s.inventory.stone,stone-(d.cost.stone||0));noMutation(s,()=>deliverOrder(s,d.id));assert.deepEqual(validate(s),s);
 nextDay(s);assert.deepEqual(s.settlement.orders,{day:2,completed:[]});s.area='city';assert.notDeepEqual(dailyOrders(s),dailyOrders({...s,day:1}));
 const n=dailyOrders(s)[0];s.inventory.wood=0;s.inventory.stone=0;noMutation(s,()=>deliverOrder(s,n.id));s.inventory.wood=100;s.inventory.stone=100;s.money=9999999;noMutation(s,()=>deliverOrder(s,n.id));s.money=60;s.inventory[n.seed]=9999;noMutation(s,()=>deliverOrder(s,n.id));s.inventory[n.seed]=0;s.area='forest';noMutation(s,()=>deliverOrder(s,n.id));
});
test('town projects add permanent visible scenery outside roads and pay once',()=>{
 const s=stocked('city');for(const d of PROJECTS){const before=s.money;completeProject(s,d.id);assert.equal(s.money,before+d.coins);assert.ok(s.settlement.projects.includes(d.id));noMutation(s,()=>completeProject(s,d.id));for(const [name,x,y]of d.props){const rect={x,y,w:name==='bench'?64:32,h:name==='bench'?40:32};assert.ok(!MAPS.city.paths.some(([x,y,w,h])=>overlaps(rect,{x,y,w,h})),d.id+' on road');}}
 assert.ok(settlementRects(s,'city').length>=12);assert.deepEqual(validate(s),s);
});
test('stone stove builds once, cooking consumes fuel and meat, eating restores capped health and energy',()=>{
 const s=stocked('interior');noMutation(s,()=>grillMeat(s));buildStove(s);assert.equal(s.inventory.wood,100-STOVE_COST.wood);assert.equal(s.inventory.stone,100-STOVE_COST.stone);noMutation(s,()=>buildStove(s));const wood=s.inventory.wood;grillMeat(s);assert.equal(s.inventory.meat,2);assert.equal(s.inventory.wood,wood-1);assert.equal(s.inventory.grilledMeat,1);s.health=40;s.energy=50;eatFood(s,'grilledMeat');assert.equal(s.health,90);assert.equal(s.energy,85);assert.equal(s.inventory.grilledMeat,0);
 grillMeat(s);s.health=s.energy=100;noMutation(s,()=>eatFood(s,'grilledMeat'));s.health=99;eatFood(s,'grilledMeat');assert.equal(s.health,100);assert.equal(s.energy,100);s.inventory.wood=0;noMutation(s,()=>grillMeat(s));assert.deepEqual(validate(s),s);
});
test('farm decoration is crafted, safely placed, collidable and packed up without duplication',()=>{
 const s=stocked('farm');s.position={x:1152,y:856};craftDecoration(s,'bench');assert.equal(s.inventory.benchDecor,1);s.selected='decorate';s.selectedDecoration='bench';assert.ok(validDecoration(s,placement));placeDecoration(s,placement);assert.equal(s.inventory.benchDecor,0);assert.equal(s.settlement.decorations.length,1);assert.equal(walkable('farm',1152,796,12,false,s),false);assert.equal(openGround('farm',1152,776,true,s),false);assert.equal(grassGround(s,{x:1152,y:800}),false);noMutation(s,()=>placeDecoration(s,placement));
 s.selected='hand';assert.equal(decorationContext(s,null).type,'reclaimDecoration');const loaded=validate(s);assert.deepEqual(loaded,s);reclaimDecoration(s,placement);assert.equal(s.inventory.benchDecor,1);assert.equal(s.settlement.decorations.length,0);noMutation(s,()=>reclaimDecoration(s,placement));assert.ok(walkable('farm',1152,796,12,false,s));
 for(const id of Object.keys(DECORATIONS)){const before=s.inventory[DECORATIONS[id].item];craftDecoration(s,id);assert.equal(s.inventory[DECORATIONS[id].item],before+1);}s.area='home';noMutation(s,()=>craftDecoration(s,'path'));
});
test('placement protects roads, beds, water, structures and the player; decorations belong to each farm',()=>{
 const s=stocked('farm');s.position={x:1152,y:856};s.selected='decorate';s.inventory.benchDecor=2;
 for(const d of [{...placement,x:976,y:608},{...placement,x:376,y:248},{...placement,x:0},{...placement,x:1153},{...placement,farm:99},{...placement,type:'forged'}])assert.equal(validDecoration(s,d),false);
 s.position={x:1152,y:792};noMutation(s,()=>placeDecoration(s,placement));s.position={x:1152,y:856};placeDecoration(s,placement);s.money=2000;buyFarm(s);s.area='farm';assert.ok(walkable('farm',1152,796,12,false,s));assert.ok(validDecoration(s,{...placement,farm:1}));s.position={x:1152,y:856};placeDecoration(s,{...placement,farm:1});assert.equal(s.settlement.decorations.length,2);assert.deepEqual(validate(s),s);
});
test('malformed resource saves bound known records, reject illegal overlaps and repair trapped player',()=>{
 const s=stocked('farm');s.day=5;s.position={x:1152,y:796};s.selectedDecoration='bad';s.inventory.pathDecor=-1;s.settlement={projects:['bad','commons','commons'],stove:'yes',orders:{day:99,completed:['bad']},decorations:[placement,placement,{...placement,type:'bad'},{...placement,x:976,y:608}]};const v=validate(s);assert.deepEqual(v.settlement.projects,['commons']);assert.equal(v.settlement.stove,false);assert.deepEqual(v.settlement.orders,{day:5,completed:[]});assert.equal(v.settlement.decorations.length,1);assert.equal(v.inventory.pathDecor,0);assert.equal(v.selectedDecoration,'bench');assert.ok(walkable('farm',v.position.x,v.position.y,12,false,v));
});
test('resource pages, farm board and decoration tools remain bounded on desktop and both phone orientations',async()=>{
 const {FarmOffice}=await import('../src/ui/FarmOffice.js'),{Hud}=await import('../src/ui/Hud.js');
 for(const [w,h]of [[1280,720],[360,640],[640,360]]){const u=recorder(w,h),s=stocked('city');const a={state:s,ui:u,scene:{build(){}},save(){},transact(fn){return fn(s);}};u.app=a;u.modal=(kicker,title,body,buttons)=>{u.root=u.add.container();u.controls=[];u.menu={kicker,title,body,buttons};drawModal(u);};const r=new ResourcePanel(a);a.resourcePanel=r;
  const check=()=>{const b=u.menuBounds;assert.ok(b.y+b.h<=h,u.menu.title+' '+w+'x'+h);for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,c.label);};r.open();check();for(let i=0;i<3;i++){r.orders(null,i);check();r.projects(i);check();}s.area='farm';new FarmOffice(a).open();check();for(let i=0;i<4;i++){r.decorations(i);check();}s.area='interior';r.cooking();check();s.settlement.stove=true;r.cooking();check();s.area='farm';s.selected='decorate';u.controls=[];new Hud(u);for(const c of u.controls)assert.ok(c.x>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,c.id);
 }
});
test('visual crafting pages show real object art, live material counts and guarded build/place actions',()=>{
 const u=recorder(360,640),s=stocked('farm'),a={state:s,ui:u,scene:{build(){}},save(){},transact(fn){return fn(s);}};u.app=a;u.toast=()=>{};const r=new ResourcePanel(a);
 for(const [i,id]of Object.keys(DECORATIONS).entries()){r.decorations(i);const d=DECORATIONS[id];assert.equal(u.menu.page.preview,id);assert.equal(u.menu.page.materials[0].have,100);assert.equal(u.controls.find(c=>c.label==='Place').disabled,true);const before=s.inventory[d.item];u.controls.find(c=>c.label==='Build').action();u.time.now+=1000;assert.equal(s.inventory[d.item],before+1);assert.equal(u.controls.find(c=>c.label==='Place').disabled,false);if(d.frame)assert.ok(u.root.list.some(n=>n.type==='image'&&n.frame===d.frame));else assert.ok(u.root.list.some(n=>n.type==='graphics'&&n.commands.some(c=>c.color===(id==='path'?0x756f61:0x543d32))));s.inventory.wood=100;s.inventory.stone=100;}
 s.inventory.wood=0;s.inventory.stone=0;r.decorations();const build=u.controls.find(c=>c.label==='Build');assert.equal(build.disabled,true);assert.equal(build.box.input,undefined);assert.match(u.menu.page.note,/Need materials/);
});
test('resource text, material/reward rows and actions remain legible and separate in seven viewports',()=>{
 for(const [w,h]of [[1440,900],[1280,720],[1024,768],[844,390],[390,844],[640,360],[360,640]]){const u=recorder(w,h),s=stocked('city'),a={state:s,ui:u};u.app=a;const r=new ResourcePanel(a);
  for(const show of [()=>r.open(),()=>r.orders(),()=>r.projects(2),()=>{s.area='farm';r.decorations(1);},()=>{s.area='interior';s.settlement.stove=true;r.cooking();}]){show();const b=u.menuBounds,primary=u.controls.find(c=>c.id==='resource-action-0');for(const t of u.root.list.filter(n=>n.type==='text')){const left=t.x-t.width*t.originX,right=left+t.width;assert.ok(left>=b.x/2&&right<=(b.x+b.w)/2,t.text+' / '+w+'x'+h);assert.ok(t.y+t.height<(b.y+b.h)/2,t.text);if(primary&&t.y<primary.y)assert.ok(t.y+t.height<=primary.y,t.text+' overlaps actions');}for(const c of u.controls)assert.ok(c.h>=22,c.label+' touch size');}
 }
});
test('cooking opens the edible grilled meal directly, including its second bag page',()=>{
 const u=recorder(360,640),s=stocked('interior'),a={state:s,ui:u,scene:{forestView:{energy(){},health(){}}},save(){},sound(){}};u.app=a;s.settlement.stove=true;s.health=40;s.energy=50;s.inventory.grilledMeat=1;a.bagPanel=new BagPanel(a);const r=new ResourcePanel(a);r.cooking();u.controls.find(c=>c.label==='Eat / Bag').action();assert.equal(bagItems(s,'food')[a.bagPanel.index].id,'grilledMeat');assert.equal(u.controls.find(c=>c.id==='bag-action').disabled,false);assert.ok(u.controls.find(c=>c.id==='bag-item-grilledMeat'));a.bagPanel.perform();assert.equal(s.health,90);assert.equal(s.energy,85);assert.equal(s.inventory.grilledMeat,0);assert.equal(u.controls.find(c=>c.id==='bag-action').disabled,true);
});
test('bag pagination never covers any category tab on desktop or phones',()=>{
 for(const [w,h]of [[1280,720],[360,640],[640,360],[390,844],[844,390]]){const u=recorder(w,h),s=stocked('interior'),a={state:s,ui:u};u.app=a;new BagPanel(a).open('food','grilledMeat');const p=u.controls.find(c=>c.id==='bag-page');assert.ok(p);for(const t of u.controls.filter(c=>c.id.startsWith('bag-tab-')))assert.equal(overlaps(p,t),false,t.id+' covered at '+w+'x'+h);}
});
test('resource keyboard focus chooses an available useful action before Close',()=>{
 const u=recorder(),s=stocked('city'),a={state:s,ui:u};u.app=a;const r=new ResourcePanel(a),focused=()=>u.controls.filter(c=>!c.disabled)[u.focus];r.open();assert.equal(focused().id,'resource-orders');s.area='farm';s.inventory.wood=0;s.inventory.stone=0;s.inventory.benchDecor=1;r.decorations();assert.equal(focused().label,'Place');s.area='city';s.settlement.projects=['commons'];r.projects();assert.equal(focused().label,'Back');
});
