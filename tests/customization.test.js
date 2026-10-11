import test from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {HOMES,HOME_IDS} from '../src/data/homes.js';
import {DECORATIONS,CRAFT_DECORATIONS} from '../src/data/settlement.js';
import {buyHouse,houseQuote,buyDecoration,decorQuote,decorationAllowed} from '../src/systems/customization.js';
import {testingCredit,testingCreditEnabled} from '../src/systems/testingCredit.js';
import {validDecoration,placeDecoration,reclaimDecoration,decorationContext} from '../src/systems/settlement.js';
import {placementDraft,placementQuote} from '../src/systems/placement.js';
import {areaDecorations,decorationBoxes,overlaps} from '../src/systems/settlementGeometry.js';
import {ROOM} from '../src/data/interior.js';
import {syncInterior,walkable,LOCATIONS} from '../src/data/locations.js';
import {resizeRoomDecor} from '../src/systems/roomDecor.js';
import {ResourcePanel} from '../src/ui/ResourcePanel.js';
import {CustomizationPanel} from '../src/ui/CustomizationPanel.js';
import {drawModal} from '../src/ui/MenuView.js';
import {recorder} from './helpers/uiRecorder.js';
const unchanged=(s,fn)=>{const before=structuredClone(s);fn();assert.deepEqual(s,before);};
test('eight progressively priced houses buy once, switch owned designs freely and reject invalid or remote purchases',()=>{
 assert.equal(HOME_IDS.length,8);assert.deepEqual(HOME_IDS.map(id=>HOMES[id].price),[2000,5000,10000,18000,30000,45000,65000,90000]);
 const s=newState();s.money=999999;for(const id of HOME_IDS){const before=s.money;buyHouse(s,id);assert.equal(s.money,before-HOMES[id].price);assert.equal(s.home.design,id);buyHouse(s,id);assert.equal(s.money,before-HOMES[id].price);assert.equal(s.home.owned.filter(k=>k===id).length,1);}
 const before=s.money;buyHouse(s,'rose');buyHouse(s,'starter');assert.equal(s.money,before);assert.equal(s.home.design,'starter');
 for(const id of ['bad','constructor','__proto__'])unchanged(s,()=>buyHouse(s,id));s.area='forest';unchanged(s,()=>buyHouse(s,'manor'));s.area='home';const poor=newState();unchanged(poor,()=>buyHouse(poor,'rose'));assert.equal(houseQuote(poor,'rose').ok,false);
});
test('playtest gift is once per save and preserves all progress; normal release remains at 60 coins',()=>{
 const s=newState();s.day=9;s.inventory.mango=3;s.story.intro='seen';const gifted=testingCredit(s);assert.equal(gifted.added,100000);assert.equal(gifted.state.money,100060);assert.equal(gifted.state.day,9);assert.equal(gifted.state.inventory.mango,3);
 assert.equal(testingCredit(validate(gifted.state)).added,0);assert.equal(testingCreditEnabled('https://example.com/',false,false),false);assert.equal(testingCreditEnabled('https://simple-life-playtest.vercel.app/',false,true),true);assert.equal(newState().money,60);
});
test('all paid scenery charges exactly once per item and rejects insufficient money, full bags and unsupported areas',()=>{
 assert.equal(CRAFT_DECORATIONS.length,7);for(const [id,d]of Object.entries(DECORATIONS)){const s=newState();if(d.cost){s.money=100000;unchanged(s,()=>buyDecoration(s,id));assert.equal(decorQuote(s,id).ok,false);continue;}s.money=d.price;buyDecoration(s,id);assert.equal(s.money,0);assert.equal(s.inventory[d.item],1);unchanged(s,()=>buyDecoration(s,id));s.money=100000;s.inventory[d.item]=9999;unchanged(s,()=>buyDecoration(s,id));s.inventory[d.item]=0;s.area='city';assert.equal(decorQuote(s,id).ok,false);unchanged(s,()=>buyDecoration(s,id));assert.equal(decorationAllowed('interior',id),!d.outdoors);}
});
test('Home, individual Farms and interior pieces use their own collision and recovery domains',()=>{
 syncInterior(1280,720);const s=newState();s.money=100000;s.selected='decorate';
 for(const [area,type,d,p]of [['home','oak',{x:96,y:224},{x:96,y:280}],['farm','blossom',{x:1152,y:800},{x:1152,y:856}],['interior','bookcase',{x:384,y:120},{x:384,y:176}]]){
  s.area=area;if(area==='farm')s.hasVisitedFarm=true;s.position=p;s.selected='decorate';s.selectedDecoration=type;buyDecoration(s,type);const draft={type,...(area==='farm'?{farm:0}:{area}),...d,direction:'down'};assert.equal(placementQuote(s,draft).ok,true);placeDecoration(s,draft);assert.equal(s.inventory[DECORATIONS[type].item],0);assert.equal(areaDecorations(s).length,1);const box=decorationBoxes(s,area)[0];assert.equal(walkable(area,box[0]+box[2]/2,box[1]+box[3]/2,6,false,s),false);assert.deepEqual(validate(s),s);s.selected='hand';assert.equal(decorationContext(s,d).type,'reclaimDecoration');reclaimDecoration(s,d);assert.equal(s.inventory[DECORATIONS[type].item],1);assert.equal(areaDecorations(s).length,0);
 }
 s.area='home';s.position={x:96,y:280};s.selected='decorate';s.selectedDecoration='oak';assert.equal(placementDraft(s,'up').area,'home');assert.equal(placementQuote(s,{type:'oak',farm:0,x:96,y:224}).ok,false);
 s.settlement.decorations=[{type:'bench',farm:0,x:1152,y:800},{type:'bench',farm:1,x:1152,y:800},{type:'bench',area:'home',x:72,y:88}];assert.equal(decorationBoxes(s,'home').length,1);assert.equal(decorationBoxes(s,'farm').length,1);s.currentFarm=1;assert.equal(areaDecorations(s,'farm')[0].farm,1);
});
test('reserved doors, indoor bed/hearth/Keepsake, water and crop beds reject scenery without spending',()=>{
 syncInterior(1280,720);for(const [area,points]of [['home',[{x:480,y:496},{x:544,y:544}]],['interior',[ROOM.bed,ROOM.exit,{x:ROOM.width/2-64,y:144},{x:ROOM.width-120,y:158}]],['farm',[{x:376,y:248},{x:1792,y:720}]]]){const s=newState();s.area=area;s.selected='decorate';s.selectedDecoration='planter';s.inventory.planterDecor=3;for(const p of points){const d={type:'planter',...(area==='farm'?{farm:0}:{area}),x:Math.round(p.x/8)*8,y:Math.round(p.y/8)*8};assert.equal(validDecoration(s,d),false);unchanged(s,()=>placeDecoration(s,d));}}
});
test('schema 17 keeps farming and legacy decor; schema 18 validates house ownership and keeps separate areas',()=>{
 const old=newState();old.version=17;delete old.home;old.money=9876;old.day=8;old.inventory.wood=23;old.story.intro='seen';old.settlement.decorations=[{type:'bench',farm:0,x:1152,y:800}];const s=validate(old);assert.equal(s.version,18);assert.deepEqual(s.home,{design:'starter',owned:['starter']});assert.equal(s.money,9876);assert.deepEqual(s.settlement.decorations,old.settlement.decorations);
 const bad=structuredClone(s);bad.home={design:'manor',owned:['bad','rose','rose','constructor']};bad.settlement.decorations.push({type:'oak',area:'interior',x:96,y:224},{type:'vase',area:'city',x:96,y:224});const v=validate(bad);assert.equal(v.home.design,'starter');assert.deepEqual(v.home.owned,['starter','rose']);assert.equal(v.settlement.decorations.length,1);assert.deepEqual(validate(v),v);
});
test('phone room resizing preserves paid furniture by safely repositioning or packing it',()=>{
 syncInterior(1280,720);const s=newState();s.area='interior';s.settlement.decorations=[{type:'bookcase',area:'interior',x:384,y:120}];const old={width:ROOM.width,height:ROOM.height};syncInterior(390,844);resizeRoomDecor(s,old);assert.equal(s.inventory.bookcaseDecor+s.settlement.decorations.filter(d=>d.type==='bookcase').length,1);assert.deepEqual(validate(s).settlement.decorations,s.settlement.decorations);syncInterior(1280,720);
});
test('house and paid decor pages keep controls and text in bounds at desktop and phone sizes',()=>{
 for(const [w,h]of [[1280,720],[1024,768],[844,390],[640,360],[390,844],[360,640]]){const u=recorder(w,h),s=newState(),a={state:s,ui:u,input:{},scene:{build(){}},save(){},sound(){}};u.app=a;a.resourcePanel=new ResourcePanel(a);const c=new CustomizationPanel(a);s.money=100000;
  for(const show of [()=>c.open(),...HOME_IDS.map((_,i)=>()=>c.houses(i)),()=>c.houses(8,true),...['garden','furniture'].flatMap(category=>Object.keys(DECORATIONS).filter(id=>!DECORATIONS[id].cost&&!!DECORATIONS[id].outdoors===(category==='garden')).map((_,i)=>()=>c.decorations(category,i)))]){show();const b=u.menuBounds;assert.ok(b.y+b.h<=h);for(const ctrl of u.controls){assert.ok(ctrl.x>=0&&ctrl.y>=0&&ctrl.x+ctrl.w<=u.w&&ctrl.y+ctrl.h<=u.h,ctrl.id+' '+w+'x'+h);assert.ok(ctrl.w>=22&&ctrl.h>=22);for(const other of u.controls)if(other!==ctrl)assert.equal(overlaps(ctrl,other),false);}
   for(const n of u.root.list.filter(n=>n.type==='text'))assert.ok(n.x-n.width*n.originX>=b.x/2&&n.x+n.width*(1-n.originX)<=(b.x+b.w)/2,n.text+' '+w+'x'+h);
  }
 }
});

test('expanded pause menu retains Save and keeps six buttons inside short and portrait phone screens',()=>{
 for(const [w,h]of [[1280,720],[390,844],[640,360],[360,640]]){const u=recorder(w,h);u.menu={kind:'dialog',title:'Paused',kicker:'SIMPLE LIFE',body:'',buttons:['Resume','Save','Audio','JOURNAL','Controls','Return to title'].map(label=>[label,()=>{}])};drawModal(u);assert.equal(u.controls.length,6);for(const c of u.controls)assert.ok(c.x>=0&&c.y>=0&&c.x+c.w<=u.w&&c.y+c.h<=u.h,c.label);assert.ok(u.menuBounds.y+u.menuBounds.h<=h);}
});
