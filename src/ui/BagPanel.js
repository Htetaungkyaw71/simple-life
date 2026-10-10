import {DECORATIONS} from '../data/settlement.js';
import {CROPS,CROP_IDS} from '../data/crops.js';
import {FOODS,FOOD_IDS} from '../data/items.js';
import {eatFood} from '../systems/forest.js';
import {marketPrice} from '../systems/market.js';
import {inputGate} from '../systems/inputGate.js';
import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
import {bagLayout} from './layouts.js';
export function bagItems(s,tab){
 if(tab==='seeds')return CROP_IDS.map(id=>({id,name:CROPS[id].name,icon:CROPS[id].seedIcon,count:s.inventory[CROPS[id].seedKey]}));
 if(tab==='food')return FOOD_IDS.map(id=>({id,name:FOODS[id].name,icon:FOODS[id].icon,count:s.inventory[id]}));
 if(tab==='gear')return [{id:'shovel',name:'Shovel',icon:'shovel-item',count:1},{id:'axe',name:'Axe',icon:'axe-item',count:1},{id:'hand',name:'Hand',icon:'hand-item',count:1},{id:'grass',name:'Grass',icon:'grass-item',count:s.inventory.grass},{id:'wood',name:'Wood',icon:'wood-item',count:s.inventory.wood},{id:'stone',name:'Stone',icon:'stone-item',count:s.inventory.stone},...Object.entries(DECORATIONS).map(([id,d])=>({id,name:d.name,icon:d.icon,count:s.inventory[d.item]}))];
 return [...CROP_IDS.map(id=>({id,name:CROPS[id].name,icon:CROPS[id].icon,count:s.inventory[id]})),{id:'wildHide',name:'Wild Hide',icon:'wild-hide-item',count:s.inventory.wildHide},{id:'meat',name:'Meat',icon:FOODS.meat.icon,count:s.inventory.meat}];
}
export class BagPanel {
 constructor(app){this.app=app;this.tab='seeds';this.index=0;this.gate=inputGate();this.message='';}
 open(tab='seeds'){if(this.app.transitioning||!this.app.state)return;this.tab=tab;this.index=0;this.message='';this.show();}
 show(){const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;u.menu={kind:'bag',draw:()=>this.draw(u)};u.focus=0;u.layout();u.focus=Math.max(0,u.controls.filter(c=>!c.disabled).findIndex(c=>c.id==='bag-action'));u.highlight();}
 move(step){const items=bagItems(this.app.state,this.tab);this.index=(this.index+step+items.length)%items.length;this.message='';this.show();}
 perform(){
  if(this.app.transitioning||this.tab==='produce'||this.app.ui.menu?.kind!=='bag'||!this.gate.accept(this.app.ui.time.now))return;
  const s=this.app.state,item=bagItems(s,this.tab)[this.index];
  if(this.tab==='seeds'){s.selectedCrop=item.id;s.selected='seed';this.app.save();this.app.ui.close();return;}
  if(this.tab==='gear'){if(['wood','stone'].includes(item.id)){this.app.resourcePanel.open();return;}if(Object.hasOwn(DECORATIONS,item.id)){if(s.area!=='farm'||!item.count)return;s.selected='decorate';s.selectedDecoration=item.id;}else s.selected=item.id;this.app.save();this.app.ui.close();return;}
  const before=s.energy,health=s.health;this.message=eatFood(s,item.id);
  if(s.energy>before)this.app.scene.forestView.energy(s.energy-before);
  if(s.health>health)this.app.scene.forestView.health(s.health-health);
  this.app.save();this.app.sound('food:eat');this.show();
 }
 draw(u){
  const s=this.app.state,l=bagLayout(u),{x,y,w,h,cell,gap}=l,items=bagItems(s,this.tab),item=items[this.index];u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x26342b,.62).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h);
  text(u,u.root,x+12,y+10,'Bag',12);button(u,u.root,'X',x+w-31,y+7,22,22,()=>u.close(),{id:'bag-close'});
  const tabs=[['seeds',CROPS.tomato.seedIcon],['produce',CROPS.tomato.icon],['food',FOODS.wildBerry.icon],['gear','axe-item']];
  tabs.forEach(([tab,key],i)=>{const c=button(u,u.root,tab,x+12+i*29,y+29,26,h<190?22:24,()=>this.open(tab),{id:'bag-tab-'+tab,iconName:key});if(tab===this.tab)c.box.setFillStyle(UI_COLORS.selected);});
  const gw=4*cell+3*gap,gx=Math.floor(x+(w-gw)/2),gy=y+(h<190?55:59);
  const page=Math.floor(this.index/12);if(items.length>12)button(u,u.root,(page+1)+' >',x+w-63,y+29,32,22,()=>{this.index=(page*12+12)%items.length;this.show();},{id:'bag-page'});
  for(let slot=0;slot<12;slot++){const i=page*12+slot;
   const sx=gx+(slot%4)*(cell+gap),sy=gy+Math.floor(slot/4)*(cell+gap),entry=items[i];
   const c=button(u,u.root,entry?.name||'',sx,sy,cell,cell,()=>{this.index=i;this.message='';this.show();},{id:'bag-item-'+(entry?.id||'empty-'+i),disabled:!entry,iconName:entry?.icon||null});
   if(entry){if(i===this.index)c.box.setFillStyle(UI_COLORS.selected);text(u,u.root,sx+cell-4,sy+cell-9,String(entry.count),7).setOrigin(1,0);}
  }
  const fy=y+h-(h<190?33:37);text(u,u.root,x+12,fy,item.name,8,UI_COLORS.light,w-24);
  const detail=this.tab==='food'?'+'+FOODS[item.id].healthRestored+' HP / +'+FOODS[item.id].energyRestored+' EP':this.tab==='gear'?(({shovel:'Dig free beds',axe:'Trees / hunt with K',hand:'Grass / stone',grass:'Plant on dry ground',wood:'Orders / projects / decor',stone:'Projects / decor / stove'})[item.id]||'Place on Farm / Hand packs it'):this.tab==='produce'?marketPrice(s,item.id).price+'c / City Market':'Planting seeds';
  text(u,u.root,x+12,fy+13,this.message||detail,6,UI_COLORS.muted,w-90);
  if(this.tab!=='produce')button(u,u.root,this.tab==='food'?'Eat':this.tab==='seeds'?'Select':['wood','stone'].includes(item.id)?'Uses':Object.hasOwn(DECORATIONS,item.id)?'Place':'Equip',x+w-69,fy+(h<190?7:9),57,22,()=>this.perform(),{id:'bag-action',disabled:this.tab==='food'?!item.count||(s.energy>=100&&s.health>=100)||s.health<=0:this.tab==='gear'?(item.id==='grass'&&!item.count||Object.hasOwn(DECORATIONS,item.id)&&(s.area!=='farm'||!item.count)):false});
 }
}
