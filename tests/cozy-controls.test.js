import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newState} from '../src/systems/state.js';
import {validate} from '../src/systems/save.js';
import {toolSelection} from '../src/systems/toolSelection.js';
import {bagItems,BagPanel} from '../src/ui/BagPanel.js';
import {hudLayout} from '../src/ui/layouts.js';
import {mobileControls} from '../src/ui/MobileControls.js';
import {recorder} from './helpers/uiRecorder.js';
import {contextFor} from '../src/systems/context.js';
import {vegetationContext} from '../src/systems/vegetation.js';
test('empty hands default safely and old valid tool selections survive reload',()=>{
 const s=newState();assert.equal(s.selected,'hand');assert.equal(validate({...s,selected:null}).selected,'hand');assert.equal(validate({...s,selected:'removed-tool'}).selected,'hand');
 for(const tool of ['seed','water','harvest','shovel','axe','grass','hand'])assert.equal(validate({...s,selected:tool}).selected,tool);
 for(const tool of ['seed','water','harvest','shovel','axe','grass']){assert.equal(toolSelection('hand',tool),tool);assert.equal(toolSelection(tool,tool),'hand');}
 assert.equal(toolSelection('axe',null),'hand');
});
test('incidental grass does not hide fruit or recovery actions from default hands',()=>{
 const s=newState();s.area='forest';s.position={x:616,y:4664};assert.equal(vegetationContext(s,'down').type,'gatherGrass');assert.equal(contextFor(s).type,'forage');
 s.stash={area:'forest',...s.position,coins:15};assert.equal(contextFor(s).type,'stash');assert.equal(contextFor(s).coins,15);
 // Desktop explicit grass targeting still chooses the clicked grass.
 const grass=vegetationContext(s,'down');assert.equal(contextFor(s,null,'down',grass).type,'gatherGrass');
});
test('Hand is absent from Bag and HUD; Put away deselects equipment without changing inventory',()=>{
 const s=newState(),u=recorder(360,640),a={state:s,ui:u,input:{},save(){}};u.app=a;const b=new BagPanel(a);s.inventory.grass=2;
 assert.ok(!bagItems(s,'gear').some(i=>i.id==='hand'));assert.ok(!hudLayout(u,false,false,'hand').ids.includes('hand'));
 for(const tool of ['shovel','axe','grass']){u.time.now+=1000;b.open('gear',tool);b.perform();assert.equal(s.selected,tool);const stock={...s.inventory};u.time.now+=1000;b.open('gear',tool);assert.equal(u.controls.find(c=>c.id==='bag-action').label,'Put away');b.perform();assert.equal(s.selected,'hand');assert.deepEqual(s.inventory,stock);}
});
test('mobile Use performs nearby actions indoors and outside while Jump stays disabled indoors',()=>{
 for(const area of ['farm','forest','interior']){
  const u=recorder(360,640);let context=null,uses=0,attacks=0,feedback=0;const s=newState();s.area=area;
  u.app={state:s,input:{},ui:{feedback(){feedback++;}},scene:{jump(){},context:()=>context},use(){uses++;},attack(){attacks++;}};
  const stick=mobileControls(u,u.root),action=u.controls.find(c=>c.id==='attack');assert.equal(action.disabled,false);assert.equal(u.controls.find(c=>c.id==='jump').disabled,area==='interior');
  for(const type of ['plot','dig','waterGround','chop','hunt','forage','stone','travel','bed','keepsakePlace','resident']){context={type};action.action();}
  assert.equal(uses,11);assert.equal(attacks,0);context=null;action.action();assert.equal(feedback,1);
  s.selected='axe';action.action();assert.equal(attacks,area==='interior'?0:1);stick.updateAction(context);assert.equal(action.label,area==='interior'?'Use':'Hit');
  context={type:'hint',label:'Shop closed'};action.action();assert.equal(attacks,area==='interior'?0:1);
 }
});
