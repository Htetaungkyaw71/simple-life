import {CROPS,CROP_IDS,SALE_ITEMS,SALE_IDS} from '../data/crops.js';
import {quote,buySeeds,sellCrop} from '../systems/economy.js';
import {marketPrice,SHOP_HOURS} from '../systems/market.js';
import {inputGate} from '../systems/inputGate.js';
import {pixelArrow} from './statusArt.js';
import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
export class TradePanel {
 constructor(app){this.app=app;this.gate=inputGate();this.index=0;this.message='';}
 open(type){
  if(this.app.transitioning||this.app.paused)return;
  this.type=type;this.ids=type==='sell'?SALE_IDS:CROP_IDS;this.catalog=type==='sell'?SALE_ITEMS:CROPS;this.index=Math.max(0,CROP_IDS.indexOf(this.app.state.selectedCrop));
  if(type==='sell'&&!this.app.state.inventory[this.ids[this.index]])this.index=Math.max(0,this.ids.findIndex(id=>this.app.state.inventory[id]>0));
  this.quantity=1;this.details=false;this.message='';this.coinFrom=null;this.app.sound('shop:open');this.show();
 }
 show(focus='trade-confirm'){
  const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;
  u.menu={kind:'trade',draw:()=>this.draw(u)};u.focus=0;u.layout();
  const choices=u.controls.filter(c=>!c.disabled),index=choices.findIndex(c=>c.id===focus);
  u.focus=Math.max(0,index);u.highlight();
 }
 move(step){this.selectCrop((this.index+step+this.ids.length)%this.ids.length);}
 selectCrop(index){this.index=index;this.message='';this.show(this.details?'trade-info':this.type==='plant'?'choose-crop':'trade-confirm');}
 perform(){
  if(this.app.transitioning||this.app.ui.menu?.kind!=='trade'||!this.gate.accept(this.app.ui.time.now))return;
  const id=this.ids[this.index],q=quote(this.app.state,this.type,id,this.quantity);
  this.coinFrom=this.app.state.money;
  this.app.transact(s=>this.type==='seed'?buySeeds(s,id,this.quantity):sellCrop(s,id,this.quantity));
  this.message=q.ok?(this.type==='seed'?`+${q.quantity} seeds`:`+${q.total} coins`):q.reason;
  this.app.sound(q.ok?(this.type==='seed'?'shop:buy':'shop:sell'):'shop:failure');this.app.ui.notice=null;this.show();
 }
 draw(u){
  const s=this.app.state,id=this.ids[this.index],d=this.catalog[id],plant=this.type==='plant',selling=this.type==='sell';
  const pw=Math.min(252,u.w-u.safe.left-u.safe.right-16),ph=Math.min(181,u.h-u.safe.top-u.safe.bottom-10),lift=181-ph,x=Math.floor((u.w-pw)/2),y=Math.max(u.safe.top+5,Math.floor((u.h-ph)/2));
  u.menuBounds={x:x*2,y:y*2,w:pw*2,h:ph*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x102025,.46).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,lx,ly,e)=>e.stopPropagation());
  panel(u,u.root,x,y,pw,ph,0x263e38);
  const tx=x+10,right=x+pw-10;
  text(u,u.root,tx,y+14,plant?'SEED BAG':selling?'MARKET':'SEEDS',8,UI_COLORS.gold);
  button(u,u.root,'X',right-22,y+8,22,22,()=>u.close(),{id:'trade-close'});
  if(plant)button(u,u.root,'FOOD',tx+76,y+8,44,22,()=>this.app.survivalPanel.open('food'),{id:'bag-food'});
  if(selling)button(u,u.root,'PAGE '+(Math.floor(this.index/4)+1)+' >',tx+64,y+8,66,22,()=>this.selectCrop((Math.floor(this.index/4)*4+4)%this.ids.length),{id:'market-page'});
  if(!plant&&!selling){
   const coins=text(u,u.root,right-30,y+14,String(s.money),8).setOrigin(1,0);
   const purse=icon(u,u.root,'coin',right-46-coins.width,y+11,.75);
   if(this.coinFrom!=null&&this.coinFrom!==s.money){u.tweens.addCounter({from:this.coinFrom,to:s.money,duration:250,onUpdate:t=>{if(coins.scene){coins.setText(String(Math.round(t.getValue())));purse.setX(right-46-coins.width);}}});this.coinFrom=null;}
  }
  const cw=Math.floor((pw-29)/4);
  this.ids.slice(selling?Math.floor(this.index/4)*4:0,selling?Math.floor(this.index/4)*4+4:4).forEach((crop,i)=>{
   const index=this.ids.indexOf(crop);
   const c=button(u,u.root,this.catalog[crop].name,tx+i*(cw+3),y+37-Math.min(4,lift),cw,28-Math.min(4,lift),()=>this.selectCrop(index),{id:'crop-'+crop,iconName:selling?this.catalog[crop].icon:CROPS[crop].seedIcon});
   if(index===this.index){c.box.setFillStyle(0x826a43);const mark=u.add.rectangle(c.x+3,c.y+c.h-4,c.w-6,2,UI_COLORS.gold).setOrigin(0);u.root.add(mark);}
  });
  icon(u,u.root,selling?d.icon:d.seedIcon,tx,y+75-lift,2);
  text(u,u.root,tx+40,y+75-lift,d.name,9);
  text(u,u.root,tx+40,y+102-lift,'Bag '+s.inventory[plant||!selling?d.seedKey:id],7,UI_COLORS.muted);
  const price=marketPrice(s,id);
  if(!plant){icon(u,u.root,'coin',tx+39,y+88-lift,.65);this.priceText=text(u,u.root,tx+52,y+90-lift,String(selling?price.price:d.seedPrice)+' each',8,UI_COLORS.gold);}
  else this.priceText=null;
  button(u,u.root,this.details?'<':'?',right-22,y+77-lift,22,22,()=>{this.details=!this.details;this.show('trade-info');},{id:'trade-info'});
  if(this.details){
   panel(u,u.root,tx,y+111-lift,pw-20,60);
   text(u,u.root,tx+7,y+117-lift,selling?`Today: ${price.label}`:`${d.growthDays} nights / yield ${d.harvestYield}`,7,UI_COLORS.gold);
   text(u,u.root,tx+7,y+133-lift,selling?'Price changes at midnight.':'Water 06-12 and 16-22.',7,UI_COLORS.muted,pw-34);
   text(u,u.root,tx+7,y+150-lift,plant?d.description:SHOP_HOURS[this.type].label,7,UI_COLORS.muted,pw-34);
   if(selling&&price.label!=='Normal'){const arrow=u.add.graphics();u.root.add(arrow);pixelArrow(arrow,price.label==='Low'?2:6,right-14,y+121-lift,UI_COLORS.gold);}
  }else if(plant){
   button(u,u.root,'Select',tx,y+134-lift,pw-20,26,()=>{s.selectedCrop=id;s.selected='seed';this.app.save();u.close();},{id:'choose-crop'});
  }else{
   const quantities=[1,5,selling?'all':'max'],bw=Math.floor((pw-26)/3);
   quantities.forEach((quantity,i)=>{
    const c=button(u,u.root,String(quantity).toUpperCase(),tx+i*(bw+3),y+113-lift,bw,22,()=>{this.quantity=quantity;this.message='';this.show('trade-'+quantity);},{id:'trade-'+quantity});
    if(this.quantity===quantity){c.box.setFillStyle(0x826a43);const mark=u.add.rectangle(c.x+3,c.y+c.h-4,c.w-6,2,UI_COLORS.gold).setOrigin(0);u.root.add(mark);}
   });
   const q=quote(s,this.type,id,this.quantity);
   button(u,u.root,(selling?'Sell ':'Buy ')+(q.quantity||0)+' / '+(q.total||0)+'c',tx,y+140-lift,pw-20,24,()=>this.perform(),{id:'trade-confirm',disabled:!q.ok});
   const reason=this.message||(!q.ok?(q.reason==='Not enough coins'?`Need ${q.total||d.seedPrice} coins`:q.reason==='You have no produce to sell.'?'No produce':q.reason.replace(' to sell.','')):'');
   text(u,u.root,tx,y+169-lift,reason,6,UI_COLORS.muted,pw-20);
  }
  u.highlight();
 }
}
