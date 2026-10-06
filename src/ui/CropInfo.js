import {cropStatus} from '../systems/cropStatus.js';
import {panel,text,icon,UI_COLORS} from './pixelWidgets.js';
import {pixels} from './statusArt.js';
const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export class CropInfo {
 constructor(hud){
  this.hud=hud;this.ui=hud.ui;const u=this.ui;this.w=Math.min(u.touch&&u.w>u.h&&u.h<240?176:184,u.w-u.safe.left-u.safe.right-12);this.h=80;
  this.root=u.add.container().setVisible(false);hud.root.add(this.root);panel(u,this.root,0,0,this.w,this.h,0x304a40);
  this.art=u.add.graphics();this.root.add(this.art);this.crop=icon(u,this.root,'tomato',6,4,.75);
  this.name=text(u,this.root,23,5,'',8,UI_COLORS.gold);this.stage=text(u,this.root,6,18,'',7);
  this.timer=text(u,this.root,19,37,'',7);this.next=text(u,this.root,6,48,'',6,UI_COLORS.muted);
  this.condition=text(u,this.root,19,58,'',7);this.am=text(u,this.root,18,70,'',6);this.pm=text(u,this.root,104,70,'',6);
 }
 update(s,c){
  const info=c?.type==='plot'?cropStatus(s,c.index):null;this.info=info;this.root.setVisible(!!info);if(!info)return;
  this.name.setText(info.name);this.stage.setText(`Stage ${info.stage}/${info.stages} / ${info.stageName}`);
  this.timer.setFontSize(7).setText(info.timer);if(this.timer.width>this.w-25)this.timer.setFontSize(6);this.next.setText(info.next);const condition=info.condition==='Newly planted'&&info.need?`Newly planted / water ${info.need.includes('morning')?'AM':'PM'}`:info.need||info.condition;this.condition.setText(condition);
  this.am.setText('AM '+info.care[0].label);this.pm.setText('PM '+info.care[1].label);
  const g=this.art;g.clear();pixels(g,'clock',6,36,UI_COLORS.gold);
  pixels(g,info.dead||info.paused?'warning':info.ready?'basket':info.need?'drop':'leaf',6,57,UI_COLORS.gold);
  pixels(g,'sun',6,68,info.care[0].watered?UI_COLORS.gold:UI_COLORS.muted);pixels(g,'moon',92,68,info.care[1].watered?UI_COLORS.gold:UI_COLORS.muted);
  const sw=Math.floor((this.w-12-(info.stages-1)*3)/info.stages);
  for(let i=0;i<info.stages;i++){g.fillStyle(UI_COLORS.ink);g.fillRect(6+i*(sw+3),29,sw,5);g.fillStyle(i<info.stage?UI_COLORS.gold:0x536e59);g.fillRect(7+i*(sw+3),30,sw-2,3);}
  this.place(s,c);
 }
 place(s,c){
  const u=this.ui,cam=u.app.scene.cameras.main,screen=p=>({x:(p.x-cam.worldView.x)*cam.zoom/2,y:(p.y-cam.worldView.y)*cam.zoom/2});
  const player=screen(s.position),plot=screen(c);
  const avoid=[{x:player.x-14,y:player.y-34,w:28,h:38},{x:plot.x-25,y:plot.y-24,w:50,h:47}];
  const left=u.safe.left+6,right=u.w-u.safe.right-6-this.w,top=u.safe.top+64;
  // Candidate positions avoid the farmer, inspected sprite/soil and existing HUD.
  // On short landscape displays use a side; portrait uses the upper clear band.
  const short=u.touch&&u.w>u.h&&u.h<240;const floor=u.h-u.safe.bottom-(short?50:u.touch?78:48);
  const bottom=short?floor-this.h:Math.min(this.hud.promptY-4-this.h,floor-this.h);
  const candidates=[{x:Math.floor((u.w-this.w)/2),y:bottom},{x:left,y:bottom},{x:right,y:bottom},{x:left,y:top},{x:right,y:top}];
  const chosen=candidates.find(p=>p.y>=top&&p.x>=left&&p.x+this.w<=u.w-u.safe.right-6&&p.y+this.h<=floor&&!avoid.some(b=>intersects({...p,w:this.w,h:this.h},b)));
  // Above the top side HUDs is free at the middle on wide landscape screens.
  const fallback=[{x:left,y:u.safe.top+8},{x:right,y:u.safe.top+8},{x:Math.floor((u.w-this.w)/2),y:u.safe.top+8}].find(p=>!avoid.some(b=>intersects({...p,w:this.w,h:this.h},b))&&p.x>100&&p.x+this.w<u.w-72);
  const at=chosen||fallback;
  this.root.setVisible(!!at);if(at)this.root.setPosition(Math.round(at.x),Math.round(at.y));
 }
 snapshot(){return this.root.visible?{...this.info,x:this.root.x*2,y:this.root.y*2,w:this.w*2,h:this.h*2}:null;}
}
