import {CROPS,CROP_IDS,SALE_ITEMS,SALE_IDS} from '../data/crops.js';
import {quote,buySeeds,sellCrop} from '../systems/economy.js';
import {marketPrice,SHOP_HOURS} from '../systems/market.js';
import {inputGate} from '../systems/inputGate.js';
import {pixelArrow} from './statusArt.js';
import {panel,text,icon,button,UI_COLORS} from './pixelWidgets.js';
export class TradePanel {
 constructor(app){this.app=app;this.gate=inputGate();this.index=0;this.message='';}
 open(type){
  if(type==='plant'){this.app.bagPanel.open('seeds');return;}
  if(this.app.transitioning||this.app.paused)return;
  this.type=type;this.ids=type==='sell'?SALE_IDS:CROP_IDS;this.catalog=type==='sell'?SALE_ITEMS:CROPS;this.index=Math.max(0,CROP_IDS.indexOf(this.app.state.selectedCrop));
  if(type==='sell'&&!this.app.state.inventory[this.ids[this.index]])this.index=Math.max(0,this.ids.findIndex(id=>this.app.state.inventory[id]>0));
  this.quantity=1;this.details=false;this.detailPage=0;this.message='';this.coinFrom=null;this.app.sound('shop:open');this.show();
 }
 show(focus='trade-confirm'){
  const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;
  u.menu={kind:'trade',draw:()=>this.draw(u)};u.focus=0;u.layout();
  const choices=u.controls.filter(c=>!c.disabled),index=choices.findIndex(c=>c.id===focus);
  u.focus=Math.max(0,index);u.highlight();
 }
 move(step){this.selectCrop((this.index+step+this.ids.length)%this.ids.length);}
 selectCrop(index){this.detailPage=0;this.index=index;this.message='';this.show(this.details?'trade-info':this.type==='plant'?'choose-crop':'trade-confirm');}
 perform(){
  if(this.app.transitioning||this.app.ui.menu?.kind!=='trade'||!this.gate.accept(this.app.ui.time.now))return;
  const id=this.ids[this.index],q=quote(this.app.state,this.type,id,this.quantity);
  this.coinFrom=this.app.state.money;
  this.app.transact(s=>this.type==='seed'?buySeeds(s,id,this.quantity):sellCrop(s,id,this.quantity));
  this.message=q.ok?(this.type==='seed'?`+${q.quantity} seeds`:`+${q.total} coins${marketPrice(this.app.state,id).label==='High'?' / HIGH market!':''}`):q.reason;
  this.app.sound(q.ok?(this.type==='seed'?'shop:buy':'shop:sell'):'shop:failure');this.app.ui.notice=null;this.show();
 }
 draw(u){
  const mm=u.app.language?.current==='mm',s=this.app.state,id=this.ids[this.index],d=this.catalog[id],plant=this.type==='plant',selling=this.type==='sell';
  const transaction=quote(s,this.type,id,this.quantity),reason=this.message||(!transaction.ok?(transaction.reason==='Not enough coins'?`Need ${transaction.total||d.seedPrice} coins`:transaction.reason==='You have no produce to sell.'?'No produce':transaction.reason.replace(' to sell.','')):'');
  const ph=Math.min(225,u.h-u.safe.top-u.safe.bottom-10),compact=ph<190;
  const pw=Math.min(compact?336:252,u.w-u.safe.left-u.safe.right-16),narrow=!compact&&pw<160,x=u.safe.left+Math.floor((u.w-u.safe.left-u.safe.right-pw)/2),y=u.safe.top+Math.floor((u.h-u.safe.top-u.safe.bottom-ph)/2);
  u.menuBounds={x:x*2,y:y*2,w:pw*2,h:ph*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x102025,.46).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,lx,ly,e)=>e.stopPropagation());
  panel(u,u.root,x,y,pw,ph,UI_COLORS.panel);
  const tx=x+10,right=x+pw-10;
  text(u,u.root,tx,y+(mm?8:14),plant?'SEED BAG':selling?'MARKET':'SEEDS',8,UI_COLORS.gold,undefined,false,'heading');
  button(u,u.root,'X',right-22,y+8,22,22,()=>u.close(),{id:'trade-close'});
  if(plant)button(u,u.root,'FOOD',tx+76,y+8,44,22,()=>this.app.survivalPanel.open('food'),{id:'bag-food'});
  if(!plant)button(u,u.root,(Math.floor(this.index/4)+1)+' >',right-50,y+8,22,22,()=>this.selectCrop((Math.floor(this.index/4)*4+4)%this.ids.length),{id:selling?'market-page':'seed-page'});
  if(!plant&&!selling&&(!narrow||!this.details)){
   const moneyLabel=value=>pw<220&&value>=10000?Math.floor(value/1000)+'k':String(value);
   const coinY=y+(narrow?ph-93:14),coins=text(u,u.root,right-58,coinY,moneyLabel(s.money),8).setOrigin(1,0);
   const purse=icon(u,u.root,'coin',right-74-coins.width,coinY-3,.75);
   if(this.coinFrom!=null&&this.coinFrom!==s.money){u.tweens.addCounter({from:this.coinFrom,to:s.money,duration:250,onUpdate:t=>{if(coins.scene){coins.setText(moneyLabel(Math.round(t.getValue())));purse.setX(right-74-coins.width);}}});this.coinFrom=null;}
  }
  const cw=Math.floor((pw-29)/4);
  this.ids.slice(Math.floor(this.index/4)*4,Math.floor(this.index/4)*4+4).forEach((crop,i)=>{
   const index=this.ids.indexOf(crop);
   const c=button(u,u.root,this.catalog[crop].name,tx+i*(cw+3),y+(compact?32:36),cw,compact?24:28,()=>this.selectCrop(index),{id:'crop-'+crop,iconName:selling?this.catalog[crop].icon:CROPS[crop].seedIcon});
   if(index===this.index){c.box.setFillStyle(UI_COLORS.selected);const mark=u.add.rectangle(c.x+3,c.y+c.h-4,c.w-6,2,UI_COLORS.gold).setOrigin(0);u.root.add(mark);}
  });
  // Short landscape uses two columns, keeping item details clear of tabs and actions.
  const bodyY=y+(compact?62:72),column=Math.floor((pw-26)/2),nameX=tx+(compact?24:40),nameWidth=compact?column-24:narrow?pw-60:pw-88;
  let priceY=bodyY+(mm?20:14);
  if(!this.details||!compact&&!mm){
   icon(u,u.root,selling?d.icon:d.seedIcon,tx,bodyY,compact?1:2);
   const name=text(u,u.root,nameX,bodyY,d.name,9,UI_COLORS.light,nameWidth);
   if(narrow||mm)priceY=bodyY+Math.max(mm?20:14,name.height+4);
   text(u,u.root,nameX,priceY+(mm?20:14),mm&&compact&&reason?reason.replace(' / HIGH market!',''):'Bag '+s.inventory[plant||!selling?d.seedKey:id],7,UI_COLORS.muted,nameWidth);
  }
  const price=marketPrice(s,id);
  if(!plant&&(!this.details||!compact&&!mm)){icon(u,u.root,'coin',nameX,priceY-1,.65);this.priceText=text(u,u.root,nameX+13,priceY,String(selling?price.price:d.seedPrice)+' each',8,UI_COLORS.gold,narrow?pw-73:nameWidth-13);}
  else this.priceText=null;
  button(u,u.root,this.details?'<':'?',compact?tx+60:narrow?tx+50:right-22,compact||narrow?y+8:bodyY,22,22,()=>{this.details=!this.details;this.show('trade-info');},{id:'trade-info'});
  if(this.details){
   const detailY=compact||mm?bodyY:bodyY+(narrow?58:44);
   panel(u,u.root,tx,detailY-3,pw-20,y+ph-6-(detailY-3));
   let row=detailY+3;
   const rows=[...(mm?[[d.name,UI_COLORS.light]]:[]),[selling?`Today: ${price.label}`:`${d.growthDays} days / yield ${d.harvestYield}`,UI_COLORS.gold],[selling?'Price changes at midnight.':`Normal sell ${d.sellPrice}c / Food ${d.energyRestored} EP`,UI_COLORS.muted],[selling?SHOP_HOURS[this.type].label:d.trait,UI_COLORS.muted]];
   if(mm){const copy=text(u,u.root,tx+7,row,rows.map(([value])=>value).join('\n'),7,UI_COLORS.muted,pw-62),lines=copy.getTextBounds().wrappedText.split('\n'),count=Math.max(1,Math.floor((y+ph-8-row)/19)),pages=Math.ceil(lines.length/count),part=this.detailPage%pages;copy.setText(lines.slice(part*count,(part+1)*count).join('\n'));if(pages>1)button(u,u.root,'>',right-22,y+ph-32,22,22,()=>{this.detailPage=(part+1)%pages;this.show('trade-details-next');},{id:'trade-details-next'});}
   else for(const [value,color]of rows){const line=text(u,u.root,tx+7,row,value,7,color,pw-34);row+=line.height+5;}
   if(selling&&price.label!=='Normal'){const arrow=u.add.graphics();u.root.add(arrow);pixelArrow(arrow,price.label==='Low'?2:6,right-14,detailY+7,UI_COLORS.gold);}
  }else if(plant){
   button(u,u.root,'Select',tx,y+ph-40,pw-20,26,()=>{s.selectedCrop=id;s.selected='seed';this.app.save();u.close();},{id:'choose-crop'});
  }else{
   const quantities=[1,5,selling?'all':'max'],actionX=compact?tx+column+6:tx,actionWidth=compact?column:pw-20,actionY=compact?bodyY:y+ph-76,bw=Math.floor((actionWidth-6)/3);
   quantities.forEach((quantity,i)=>{
    const c=button(u,u.root,String(quantity).toUpperCase(),actionX+i*(bw+3),actionY,bw,22,()=>{this.quantity=quantity;this.message='';this.show('trade-'+quantity);},{id:'trade-'+quantity});
    if(this.quantity===quantity){c.box.setFillStyle(UI_COLORS.selected);const mark=u.add.rectangle(c.x+3,c.y+c.h-4,c.w-6,2,UI_COLORS.gold).setOrigin(0);u.root.add(mark);}
   });
   const q=transaction;
   button(u,u.root,(selling?'Sell ':'Buy ')+(q.quantity||0)+' / '+(q.total||0)+'c',actionX,actionY+28,actionWidth,24,()=>this.perform(),{id:'trade-confirm',disabled:!q.ok});
   const feedback=text(u,u.root,tx,compact?y+ph-17:y+ph-18,mm&&compact?'':compact||narrow?reason.replace(' / HIGH market!',''):reason,6,UI_COLORS.muted,compact?column:pw-20);
   if(feedback.text&&feedback.height>12)feedback.setText(reason.replace(' / HIGH market!',''));
  }
  u.highlight();
 }
}
