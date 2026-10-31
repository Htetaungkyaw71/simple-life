import {OUTFITS,HAIRCUTS,ACCESSORIES,OUTFIT_IDS,HAIRCUT_IDS,ACCESSORY_IDS,playerVisual} from '../data/appearance.js';
import {farmerTexture} from '../art/farmerTexture.js';
import {styleQuote,changeAppearance,styleServiceOpen} from '../systems/appearance.js';
import {button,panel,text,UI_COLORS} from './pixelWidgets.js';
import {inputGate} from '../systems/inputGate.js';
const TABS=[['Outfits','clothes'],['Hair','hair'],['Extras','accessories']];
export const appearanceTabs=scope=>TABS.filter(([,type])=>scope==='hair'?type==='hair':scope==='clothes'?type!=='hair':true);
export class AppearancePanel{
 constructor(app){this.app=app;this.gate=inputGate();this.category='clothes';this.scope='wardrobe';this.index=0;this.direction=0;}
 openShop(category){this.open(category,0,category==='hair'?'hair':'clothes');}
 open(category='clothes',index=0,scope='wardrobe'){this.scope=scope;const tabs=appearanceTabs(scope);this.category=tabs.some(([,type])=>type===category)?category:tabs[0][1];this.index=this.category===category?index:0;this.app.paused=true;this.app.input={};const u=this.app.ui;u.notice=null;u.menu={kind:'appearance',draw:()=>this.draw()};u.focus=0;u.layout();}
 draw(){
  const a=this.app,u=a.ui,s=a.state,category=this.category,catalog=category==='clothes'?OUTFITS:category==='hair'?HAIRCUTS:ACCESSORIES,ids=category==='clothes'?OUTFIT_IDS:category==='hair'?HAIRCUT_IDS:ACCESSORY_IDS,id=ids[this.index],d=catalog[id],q=styleQuote(s,category,id),availableHeight=u.h-u.safe.top-u.safe.bottom,phoneLandscape=u.touch&&u.w>u.h,short=availableHeight<290;
  const w=Math.min(phoneLandscape?300:326,u.w-u.safe.left-u.safe.right-12),h=Math.min(phoneLandscape?174:short?176:286,availableHeight-(short?8:12)),x=Math.floor(u.safe.left+(u.w-u.safe.left-u.safe.right-w)/2),y=Math.floor(u.safe.top+(availableHeight-h)/2),inner=w-24,ultra=h<150;
  u.menu.title=this.scope==='clothes'?'Clothes / Nell':category==='hair'?'Town stylist':'Wardrobe';u.menu.body=d.name;u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.65).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,lx,ly,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h);
  text(u,u.root,x+12,y+(ultra?6:8),u.menu.title,short?8:12,UI_COLORS.light,inner-28,true,short?'body':'heading');button(u,u.root,'X',x+w-32,y+(ultra?5:7),22,22,()=>u.close(),{id:'style-close'});
  const tabs=appearanceTabs(this.scope),tabY=y+(ultra?28:short?30:36),tabW=Math.floor((inner-4*(tabs.length-1))/tabs.length),bw=Math.floor((inner-4)/2),tabH=ultra?22:short?24:26;
  for(const [i,[label,type]]of tabs.entries()){const c=button(u,u.root,label,x+12+i*(tabW+4),tabY,tabW,tabH,()=>this.open(type,0,this.scope),{id:'style-tab-'+type});if(category===type)c.box.setFillStyle(UI_COLORS.selected);}
  const top=tabY+tabH+(phoneLandscape?7:ultra?2:4),bottom=y+h-(ultra?26:36),actionH=ultra?22:28,px=x+12;
  const preview={...s.appearance,accessories:{...s.appearance.accessories}};
  if(category==='hair')preview.accessories={hat:null,glasses:null,bag:null};
  if(category==='accessories')preview.accessories[d.slot]=id;else preview[category==='clothes'?'outfit':'hair']=id;
  const {rig}=playerVisual(preview,s.character),texture=farmerTexture(u,preview,s.character,'preview'),navW=ultra?22:26;
  if(ultra){
   const previewSize=Math.max(28,Math.min(38,bottom-top-2));panel(u,u.root,px,top,previewSize,previewSize,0xe4e9c6,'plain');
   u.root.add(u.add.sprite(px+previewSize/2,top+previewSize-3,texture,this.direction*8).setOrigin(.5,rig.originY).setScale(rig.scale*.38));
   const turnX=px+previewSize+4,turnW=64,prevX=turnX+turnW+4,nextX=prevX+navW+2,tx=nextX+navW+8,tw=x+w-12-tx;
   button(u,u.root,'Turn',turnX,top,turnW,22,()=>{this.direction=(this.direction+1)%4;u.layout();},{id:'style-turn'});
   button(u,u.root,'<',prevX,top,navW,22,()=>this.open(category,(this.index+ids.length-1)%ids.length,this.scope),{id:'style-prev'});
   button(u,u.root,'>',nextX,top,navW,22,()=>this.open(category,(this.index+1)%ids.length,this.scope),{id:'style-next'});
   text(u,u.root,(prevX+nextX+navW)/2,top+25,(this.index+1)+' / '+ids.length,7,UI_COLORS.muted).setOrigin(.5,0);
   let cy=top;for(const line of [d.name,(q.current?'Selected':q.owned?'Owned / free':d.price+'c')+' / '+s.money+'c']){const t=text(u,u.root,tx,cy,line,7,UI_COLORS.light,tw);cy+=t.height+1;}
  }else{
   const navY=short?bottom-28:top+94,previewW=short?64:76,previewH=Math.max(30,Math.min(short?49:88,navY-top-2));
   panel(u,u.root,px,top,previewW,previewH,0xe4e9c6,'plain');u.root.add(u.add.sprite(px+previewW/2,top+previewH-4,texture,this.direction*8).setOrigin(.5,rig.originY).setScale(rig.scale*(short?.5:1)));
   const tx=px+previewW+8,tw=inner-previewW-8;let cy=top;for(const line of [d.name,(q.current?'Selected':q.owned?'Owned / free':d.price+'c')+' / '+s.money+'c']){const t=text(u,u.root,tx,cy,line,8,UI_COLORS.light,tw);cy+=t.height+3;}
   if(!short&&tw>=130)text(u,u.root,tx,top+43,category==='hair'?'Hair colour only.':'Same farmer. Cosmetic only.',7,UI_COLORS.muted,tw);
   button(u,u.root,'Turn',tx,Math.min(navY-24,top+(short?27:63)),Math.min(tw,60),22,()=>{this.direction=(this.direction+1)%4;u.layout();},{id:'style-turn'});
   button(u,u.root,'<',px,navY,navW,24,()=>this.open(category,(this.index+ids.length-1)%ids.length,this.scope),{id:'style-prev'});button(u,u.root,'>',x+w-12-navW,navY,navW,24,()=>this.open(category,(this.index+1)%ids.length,this.scope),{id:'style-next'});text(u,u.root,x+w/2,navY+6,(this.index+1)+' / '+ids.length,8).setOrigin(.5,0);
  }
  if(!short){
   const navY=top+94,note=category==='hair'?(styleServiceOpen(s,category)?'Hair colour only.':'Visit Sol / City barber.'):(styleServiceOpen(s,category)?'Buy once. Equip owned items for free.':'Buy from Nell / City clothing shop.');
   text(u,u.root,px,navY+30,note,8,UI_COLORS.muted,inner);text(u,u.root,px,bottom-19,'Open / 7 am - 7 pm',7,UI_COLORS.muted,inner);
  }
  const action=category==='accessories'&&q.current?'Remove':q.current?'Selected':q.owned?'Wear':category==='hair'?'Change colour':'Buy & wear';
  button(u,u.root,action,px,bottom,bw,actionH,()=>this.apply(id),{disabled:!q.ok,id:'style-apply'});button(u,u.root,'Back',px+bw+4,bottom,bw,actionH,()=>u.close(),{id:'style-back'});u.highlight();
 }
 apply(id){const a=this.app;if(a.transitioning||!this.gate.accept(a.ui.time.now))return;const before=a.state.money,q=styleQuote(a.state,this.category,id);if(!q.ok)return;a.transact(s=>changeAppearance(s,this.category,id));if(a.state.money<before)a.sound('shop:buy');a.scene.build();this.open(this.category,this.index,this.scope);}
}
