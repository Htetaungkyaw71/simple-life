import {CROPS,CROP_IDS} from '../data/crops.js';
import {quote,buySeeds,sellCrop} from '../systems/economy.js';
import {marketPrice,SHOP_HOURS} from '../systems/market.js';
import {inputGate} from '../systems/inputGate.js';
import {pixelArrow} from './statusArt.js';
import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
export class TradePanel {
 constructor(app){this.app=app;this.gate=inputGate();this.index=0;this.message='';}
 open(type){if(this.app.transitioning||this.app.paused)return;this.type=type;this.index=Math.max(0,CROP_IDS.indexOf(this.app.state.selectedCrop));if(type==='sell'&&!this.app.state.inventory[CROP_IDS[this.index]])this.index=Math.max(0,CROP_IDS.findIndex(id=>this.app.state.inventory[id]>0));this.message='';this.coinFrom=null;this.app.sound('shop:open');this.show();}
 show(){const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;u.menu={kind:'trade',draw:()=>this.draw(u)};u.focus=0;u.layout();}
 move(step){this.index=(this.index+step+CROP_IDS.length)%CROP_IDS.length;this.message='';this.show();}
 perform(quantity){
  if(this.app.transitioning||this.app.ui.menu?.kind!=='trade'||!this.gate.accept(this.app.ui.time.now))return;
  const id=CROP_IDS[this.index],q=quote(this.app.state,this.type,id,quantity);
  this.coinFrom=this.app.state.money;
  this.message=this.app.transact(s=>this.type==='seed'?buySeeds(s,id,quantity):sellCrop(s,id,quantity));
  this.app.sound(q.ok?(this.type==='seed'?'shop:buy':'shop:sell'):'shop:failure');this.app.ui.notice=null;this.show();
 }
 draw(u){
  const s=this.app.state,id=CROP_IDS[this.index],d=CROPS[id],plant=this.type==='plant',selling=this.type==='sell';
  const pw=Math.min(330,u.w-u.safe.left-u.safe.right-16),ph=plant?160:Math.min(220,u.h-u.safe.top-u.safe.bottom-10),x=Math.floor((u.w-pw)/2),y=Math.max(u.safe.top+5,Math.floor((u.h-ph)/2));
  u.menuBounds={x:x*2,y:y*2,w:pw*2,h:ph*2};
  u.root.add(u.add.rectangle(0,0,u.w,u.h,0x102b25,.85).setOrigin(0).setInteractive());panel(u,u.root,x,y,pw,ph);
  const tx=x+10,right=x+pw-10;
  text(u,u.root,tx,y+8,plant?'SEED BAG':selling?'NIKO / PRODUCE MARKET':'CLARA / SEED SHOP',8,UI_COLORS.gold);
  const coins=text(u,u.root,right,y+20,s.money+' coins',8).setOrigin(1,0);
  if(this.coinFrom!=null&&this.coinFrom!==s.money){u.tweens.addCounter({from:this.coinFrom,to:s.money,duration:250,onUpdate:t=>{if(coins.scene)coins.setText(Math.round(t.getValue())+' coins');}});this.coinFrom=null;}
  text(u,u.root,tx,y+21,plant?'Choose seeds to plant':SHOP_HOURS[this.type].label,7,UI_COLORS.muted);
  icon(u,u.root,selling?d.icon:d.seedIcon,tx+1,y+39,1.5);
  text(u,u.root,tx+32,y+40,d.name.toUpperCase(),11);
  text(u,u.root,tx+32,y+55,`${this.index+1} / 4   Owned: ${s.inventory[plant||!selling?d.seedKey:d.produceKey]}`,8,UI_COLORS.muted);
  if(plant)coins.setVisible(false);
  const price=marketPrice(s,id);
  this.priceText=text(u,u.root,tx,y+73,plant?`${d.growthDays} nights / ${d.harvestYield} produce`:selling?`${price.price} coins each / ${price.label}`:`${d.seedPrice} coins / seed`,8,UI_COLORS.gold);
  if(selling&&price.label!=='Normal'){const arrow=u.add.graphics();u.root.add(arrow);pixelArrow(arrow,price.label==='Low'?2:6,right-4,y+77,UI_COLORS.gold);}
  text(u,u.root,tx,y+(ph<205?82:86),selling?'Today\'s price holds until you sleep.':`${d.growthDays} nights / yields ${d.harvestYield}${ph>=205?'\nWater morning AND evening.':''}`,7,UI_COLORS.muted,pw-20);
  const navY=y+ph-(ph<205?42:49);
  if(!plant)text(u,u.root,tx,y+(ph<205?92:112),selling&&!CROP_IDS.some(crop=>s.inventory[crop]>0)?'You have no produce to sell.':d.description,7,UI_COLORS.muted,pw-20);
  if(plant){button(u,u.root,'Plant '+d.name,tx,navY-26,pw-20,22,()=>{s.selectedCrop=id;s.selected='seed';this.app.save();u.close();},{id:'choose-crop'});}
  else {
   const quantities=[1,5,selling?'all':'max'],labels=selling?['Sell 1','Sell 5','Sell all']:['Buy 1','Buy 5','Max'];
   const bw=Math.floor((pw-26)/3),by=navY-26;
   let largeQuote=null;
   quantities.forEach((quantity,i)=>{const q=quote(s,this.type,id,quantity);button(u,u.root,labels[i],tx+i*(bw+3),by,bw,22,()=>this.perform(quantity),{id:'trade-'+quantity,disabled:!q.ok});const total=text(u,u.root,tx+i*(bw+3)+bw/2,by-13,q.quantity?`${q.quantity} / ${q.total}c`:'0 / 0c',7,UI_COLORS.gold).setOrigin(.5,0);if(total.width>bw-2){total.setText(`${q.total}c`);largeQuote=`${labels[i]}: ${q.quantity} / ${q.total} coins`;}});
   const unavailable=quantities.map((n,i)=>({q:quote(s,this.type,id,n),label:labels[i]})).find(v=>!v.q.ok);
   const reason=this.message||quote(s,this.type,id,selling?'all':'max').reason||(unavailable?unavailable.label+': '+unavailable.q.reason:largeQuote|| (selling?'Fresh harvest? I will buy it.':'Welcome, farmer. Choose your seeds.'));
   text(u,u.root,tx,navY+27,reason,6,UI_COLORS.muted,pw-20);
  }
  const third=Math.floor((pw-26)/3);
  button(u,u.root,'< Crop',tx,navY,third,22,()=>this.move(-1),{id:'crop-prev'});
  button(u,u.root,'Crop >',tx+third+3,navY,third,22,()=>this.move(1),{id:'crop-next'});
  button(u,u.root,'Close',tx+2*(third+3),navY,third,22,()=>{u.close();},{id:'trade-close'});u.highlight();
 }
}
