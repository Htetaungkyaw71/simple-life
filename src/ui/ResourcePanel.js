import {CROPS,CROP_IDS} from '../data/crops.js';
import {PROJECTS,DECORATIONS,STOVE_COST,GRILL_COST} from '../data/settlement.js';
import {dailyOrders,orderComplete,orderQuote,deliverOrder,projectQuote,completeProject,materials,materialLabel,craftDecoration,buildStove,grillMeat} from '../systems/settlement.js';
import {inputGate} from '../systems/inputGate.js';
const seedName=key=>CROPS[CROP_IDS.find(id=>CROPS[id].seedKey===key)].name;
// Small paused pages reuse the existing canvas modal and keyboard/touch controls.
export class ResourcePanel {
 constructor(app){this.app=app;this.gate=inputGate();this.index=0;}
 get s(){return this.app.state;}
 modal(title,body,buttons){this.app.ui.modal('WOOD & STONE',title,body,buttons);}
 stock(){return 'Wood '+this.s.inventory.wood+' / Stone '+this.s.inventory.stone;}
 run(fn,redraw,rebuild=false){if(this.app.transitioning||!this.gate.accept(this.app.ui.time.now))return;this.app.transact(fn);if(rebuild)this.app.scene.build();redraw();}
 open(){if(this.s.area==='farm'){this.decorations();return;}if(this.s.area==='interior'){this.cooking();return;}if(this.s.area!=='city'){this.modal('Use your materials','Town board / orders and projects\nFarm board / build decorations\nHome hearth / cook meals',[['Close',()=>this.app.ui.close()]]);return;}
  this.modal('Town board',this.stock()+'\nHelp your neighbours. Improve the town.',[['Daily requests',()=>this.orders()],['Town projects',()=>this.projects()],['Close',()=>this.app.ui.close()]]);
 }
 orders(resident=null,index=0){
  const list=dailyOrders(this.s).filter(d=>!resident||d.resident===resident),d=list[index%Math.max(1,list.length)];
  if(!d){this.modal('Daily requests','No request from this neighbour today.\nThe town board has three daily requests.',[['Town board',()=>this.open()],['Close',()=>this.app.ui.close()]]);return;}
  const done=orderComplete(this.s,d.id),q=orderQuote(this.s,d.id);
  this.modal(d.name+' / request',materialLabel(d.cost)+' / '+this.stock()+'\n'+d.purpose+'\nReward '+d.coins+'c + '+d.seeds+' '+seedName(d.seed)+' seeds',[
   [done?'Delivered today':'Deliver materials',()=>this.run(s=>deliverOrder(s,d.id),()=>this.orders(resident,index)),!q.ok],
   ...(list.length>1?[['Next request',()=>this.orders(resident,(index+1)%list.length)]]:[]),['Town board',()=>this.open()],['Close',()=>this.app.ui.close()],
  ]);
 }
 projects(index=0){const d=PROJECTS[index],done=this.s.settlement.projects.includes(d.id),q=projectQuote(this.s,d.id);
  this.modal(d.name,materialLabel(d.cost)+' / '+this.stock()+'\n'+d.description+'\nReward '+d.coins+'c + '+d.seeds+' '+seedName(d.seed)+' seeds',[
   [done?'Project complete':'Build project',()=>this.run(s=>completeProject(s,d.id),()=>this.projects(index),true),!q.ok],['Next project',()=>this.projects((index+1)%PROJECTS.length)],['Town board',()=>this.open()],['Close',()=>this.app.ui.close()],
  ]);
 }
 decorations(index=0){const ids=Object.keys(DECORATIONS),id=ids[index],d=DECORATIONS[id];
  this.modal(d.name,materialLabel(d.cost)+' / '+this.stock()+'\nBuilt '+this.s.inventory[d.item]+' / place on clear Farm grass\nHand packs it up for moving.',[
   ['Build decoration',()=>this.run(s=>craftDecoration(s,id),()=>this.decorations(index)),this.s.area!=='farm'||!materials(this.s,d.cost)||this.s.inventory[d.item]>=9999],
   ['Place '+d.name,()=>{this.s.selected='decorate';this.s.selectedDecoration=id;this.app.save();this.app.ui.close();this.app.ui.toast('Tap clear Farm grass nearby / E places in front');},this.s.area!=='farm'||!this.s.inventory[d.item]],
   ['Next decoration',()=>this.decorations((index+1)%ids.length)],['Close',()=>this.app.ui.close()],
  ]);
 }
 cooking(){const built=this.s.settlement.stove;
  this.modal(built?'Cooking station':'Build cooking station',built?materialLabel(GRILL_COST)+' / Meat '+this.s.inventory.meat+' / Wood '+this.s.inventory.wood+'\nGrilled Meat / +50 HP / +35 EP\nEat from Bag / Food.':materialLabel(STOVE_COST)+' / '+this.stock()+'\nBuild a stone stove at your Home hearth.\nCook stronger healing meals with wood.',[
   [built?'Cook Grilled Meat':'Build cooking station',()=>this.run(built?grillMeat:buildStove,()=>this.cooking(),!built),this.s.area!=='interior'||!materials(this.s,built?GRILL_COST:STOVE_COST)||built&&this.s.inventory.grilledMeat>=9999],
   ...(built?[['Open food bag',()=>this.app.bagPanel.open('food')]]:[]),['Close',()=>this.app.ui.close()],
  ]);
 }
}
