import {OUTFITS,HAIRCUTS,OUTFIT_IDS,HAIRCUT_IDS,appearanceFrame} from '../data/appearance.js';
import {styleQuote,changeAppearance,styleServiceOpen} from '../systems/appearance.js';
import {button,panel,text,UI_COLORS} from './pixelWidgets.js';
import {inputGate} from '../systems/inputGate.js';

export class AppearancePanel{
 constructor(app){this.app=app;this.gate=inputGate();this.category='clothes';this.index=0;}
 open(category='clothes',index=0){this.category=category;this.index=index;this.app.paused=true;this.app.input={};const u=this.app.ui;u.notice=null;u.menu={kind:'appearance',draw:()=>this.draw()};u.focus=0;u.layout();}
 draw(){
  const a=this.app,u=a.ui,s=a.state,category=this.category,catalog=category==='clothes'?OUTFITS:HAIRCUTS,ids=category==='clothes'?OUTFIT_IDS:HAIRCUT_IDS,id=ids[this.index],d=catalog[id],q=styleQuote(s,category,id),short=u.h-u.safe.top-u.safe.bottom<290;
  const w=Math.min(326,u.w-u.safe.left-u.safe.right-12),h=Math.min(short?176:278,u.h-u.safe.top-u.safe.bottom-12),x=Math.floor(u.safe.left+(u.w-u.safe.left-u.safe.right-w)/2),y=Math.floor(u.safe.top+(u.h-u.safe.top-u.safe.bottom-h)/2),inner=w-24;
  u.menu.title=category==='clothes'?'Wardrobe':'Town barber';u.menu.body=d.name;u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
  const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.65).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,lx,ly,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h);
  text(u,u.root,x+12,y+8,u.menu.title,short?8:12,UI_COLORS.light,inner-28,true,short?'body':'heading');button(u,u.root,'X',x+w-32,y+7,22,22,()=>u.close(),{id:'style-close'});
  const tabY=y+(short?30:36),bw=Math.floor((inner-4)/2);for(const [i,[label,type]]of [['Clothes','clothes'],['Haircuts','hair']].entries()){const c=button(u,u.root,label,x+12+i*(bw+4),tabY,bw,short?24:26,()=>this.open(type),{id:'style-tab-'+type});if(category===type)c.box.setFillStyle(UI_COLORS.selected);}
  const top=tabY+(short?28:32),bottom=y+h-36,previewW=short?64:76,previewH=short?46:88,px=x+12;
  // UI root is 2x: preview scales .5/1 give strict 1x/2x native pixels.
  panel(u,u.root,px,top,previewW,previewH,0xe4e9c6,'plain');const preview={...s.appearance,[category==='clothes'?'outfit':'hair']:id};u.root.add(u.add.sprite(px+previewW/2,top+previewH-4,'appearance',appearanceFrame(preview)).setOrigin(.5,1).setScale(short?.5:1));
  const tx=px+previewW+8,tw=inner-previewW-8;let cy=top;
  for(const line of [d.name,(q.current?'Selected':q.owned?'Owned / free':d.price+'c')+' / '+s.money+'c']){const t=text(u,u.root,tx,cy,line,8,UI_COLORS.light,tw);cy+=t.height+3;}
  const navY=short?top+previewH+2:top+previewH+6,navW=26;
  button(u,u.root,'<',px,navY,navW,24,()=>this.open(category,(this.index+ids.length-1)%ids.length),{id:'style-prev'});button(u,u.root,'>',x+w-12-navW,navY,navW,24,()=>this.open(category,(this.index+1)%ids.length),{id:'style-next'});text(u,u.root,x+w/2,navY+6,(this.index+1)+' / '+ids.length,8).setOrigin(.5,0);
  if(!short){const note=styleServiceOpen(s,category)?category==='clothes'?'Buy once. Wear owned outfits for free.':'Pay for each different haircut.':category==='clothes'?'Buy from Nell / east City commons.':'Visit Sol / west City lane.';text(u,u.root,px,navY+30,note,8,UI_COLORS.muted,inner);text(u,u.root,px,bottom-19,'Open / 7 am - 7 pm',7,UI_COLORS.muted,inner);}
  const action=q.current?'Selected':q.owned?'Wear':category==='clothes'?'Buy & wear':'Change haircut';button(u,u.root,action,px,bottom,bw,28,()=>this.apply(id),{disabled:!q.ok,id:'style-apply'});button(u,u.root,'Back',px+bw+4,bottom,bw,28,()=>u.close(),{id:'style-back'});u.highlight();
 }
 apply(id){const a=this.app;if(a.transitioning||!this.gate.accept(a.ui.time.now))return;const before=a.state.money,q=styleQuote(a.state,this.category,id);if(!q.ok)return;a.transact(s=>changeAppearance(s,this.category,id));if(a.state.money<before)a.sound('shop:buy');a.scene.build();this.open(this.category,this.index);}
}
