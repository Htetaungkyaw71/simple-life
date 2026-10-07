import {FOODS,FOOD_IDS,CLUB} from '../data/items.js';
import {eatFood,buyClub,equipClub} from '../systems/forest.js';
import {marketPrice,shopOpen} from '../systems/market.js';
import {inputGate} from '../systems/inputGate.js';
import {button,panel,text,icon,UI_COLORS} from './pixelWidgets.js';
export class SurvivalPanel {
 constructor(app){this.app=app;this.index=0;this.gate=inputGate();this.message='';}
 open(type){if(this.app.transitioning)return;this.type=type;this.message='';this.show();}
 show(){const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;u.menu={kind:'survival',draw:()=>this.draw(u)};u.focus=0;u.layout();u.focus=Math.max(0,u.controls.filter(c=>!c.disabled).findIndex(c=>c.id==='survival-action'));u.highlight();}
 move(step){if(this.type!=='food')return;this.index=(this.index+step+FOOD_IDS.length)%FOOD_IDS.length;this.message='';this.show();}
 perform(){
  if(!this.gate.accept(this.app.ui.time.now))return;
  const s=this.app.state,id=FOOD_IDS[this.index],before=s.energy;
  this.message=this.type==='food'?eatFood(s,id):this.type==='outfitter'?buyClub(s):equipClub(s);
  if(s.energy>before)this.app.scene.forestView.energy(s.energy-before);
  this.app.save();this.app.sound(this.type==='food'?'food:eat':'gear:equip');this.show();
 }
 draw(u){
  const s=this.app.state,food=this.type==='food',shop=this.type==='outfitter',id=FOOD_IDS[this.index],d=food?FOODS[id]:CLUB;
  const pw=Math.min(244,u.w-16),ph=Math.min(180,u.h-10),x=Math.floor((u.w-pw)/2),y=Math.floor((u.h-ph)/2),lift=180-ph,tx=x+10;
  u.menuBounds={x:x*2,y:y*2,w:pw*2,h:ph*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x102025,.46).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,lx,ly,e)=>e.stopPropagation());
  panel(u,u.root,x,y,pw,ph);text(u,u.root,tx,y+14,shop?'OUTFITTER':food?'FOOD BAG':'EQUIPMENT',8,UI_COLORS.gold);
  button(u,u.root,'X',x+pw-32,y+8,22,22,()=>u.close(),{id:'survival-close'});
  if(!shop){
   button(u,u.root,'SEEDS',tx,y+36,48,24,()=>{u.close();this.app.tradePanel.open('plant');},{id:'bag-seeds'});
   button(u,u.root,food?'GEAR':'FOOD',tx+52,y+36,48,24,()=>this.open(food?'gear':'food'),{id:'bag-gear'});
  }else text(u,u.root,tx,y+40,'Coins '+s.money+' / 07:00-20:00',7,UI_COLORS.muted);
  if(food){FOOD_IDS.forEach((key,i)=>button(u,u.root,FOODS[key].name,tx+i*40,y+66-lift,36,25,()=>{this.index=i;this.message='';this.show();},{id:'food-'+key,iconName:FOODS[key].icon}));}
  icon(u,u.root,d.icon,tx,y+98-lift,1.6);
  text(u,u.root,tx+32,y+99-lift,d.name,8);
  text(u,u.root,tx+32,y+113-lift,food?'Bag '+s.inventory[id]+' / +'+d.energyRestored+' energy':s.ownsClub?'Owned / '+(s.clubEquipped?'Equipped':'Unequipped'):'45 coins / permanent',7,UI_COLORS.muted,pw-52);
  if(food)text(u,u.root,tx,y+132-lift,'Sale '+marketPrice(s,id).price+'c / City Market',7,UI_COLORS.gold);
  else text(u,u.root,tx,y+75-lift,shop?'Space / K to swing. Costs 5 energy.':'Hide '+s.inventory.wildHide+' / sell at City Market.',7,UI_COLORS.muted,pw-20);
  button(u,u.root,food?'EAT 1':shop?s.ownsClub?'OWNED':'BUY / 45c':'EQUIP',tx,y+146-lift,pw-20,22,()=>this.perform(),{id:'survival-action',disabled:food?!s.inventory[id]:shop?(s.ownsClub||s.money<45||!shopOpen(s,'outfitter')):!s.ownsClub});
  const message=this.message||(shop&&!s.ownsClub&&s.money<45?'Earn coins through farming.':'');
  text(u,u.root,tx,y+171-lift,message,6,UI_COLORS.muted,pw-20);
  u.highlight();
 }
}
