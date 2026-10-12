import {CURSED_CAVE,curseComplete} from '../data/cursedCave.js';
import {breakSeal,contribute,nearCave} from '../systems/curse.js';
import {curseTextures} from '../art/CurseArt.js';
import {panel,text,button,UI_COLORS as C} from './pixelWidgets.js';
const INFO='The untouched seal is harmless.\nBreaking it gives 200 coins once, but releases a curse.\nRead the warning before deciding.\nFind the cave marker in the eastern Dark Forest.';
const WARNING='Destroying the seal releases a curse.\nGhosts attack outdoors every night from 7 pm to 6 am.\nDefeated ghosts return after 5 seconds.\nYour house interior is safe.\nNPCs return home by 7 pm.\nOnly rebuilding this cave ends the curse.\nRepair costs:\n600 coins\n48 Wood\n32 Stone\n20 Meat\nMeat is an offering.\nResources can be given in stages. Contributions stay saved.\nBreaking the seal gives 200 coins once.\nBreak seal = release curse.';
const BROKEN='Ghosts attack outdoors from 7 pm to 6 am.\nThey return 5 seconds after defeat.\nYour house interior is safe.\nRebuild this cave to end the curse.\nTap a resource to give what you have, up to its remaining cost.\nContributions stay saved.\nRepair at the cave entrance.';
const RESTORED='Curse Breaker\nAchievement earned.\nThe cave is restored.\nGhosts will never return.\nYour saved repair progress records this achievement.';
export class CavePanel {
 constructor(app){this.app=app;this.page=0;this.mode='info';}
 open(remote=false){const a=this.app;if(!a.state||a.transitioning)return;if(!remote&&!nearCave(a.state))return;a.state.curse.discovered=true;a.save();this.back=remote?()=>a.pauseMenu():()=>a.ui.close();this.show('info');}
 show(mode=this.mode,page=0){this.mode=mode;this.page=page;const a=this.app,u=a.ui;a.paused=true;a.input={};a.pendingAttack=null;u.notice=null;u.menu={kind:'curse',draw:()=>this.draw(u),escape:()=>this.back()};u.focus=0;u.layout();u.highlight();}
 draw(u){const a=this.app,s=a.state,c=s.curse,w=Math.min(330,u.w-u.safe.left-u.safe.right-8),h=Math.min(248,u.h-u.safe.top-u.safe.bottom-8),x=Math.floor((u.w-w)/2),y=Math.floor((u.h-h)/2),signature=[w,h,a.language.current,this.mode].join(':');
  if(this.signature!==signature){this.signature=signature;this.page=0;}
  const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.7).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,b,d,e)=>e.stopPropagation());panel(u,u.root,x,y,w,h);u.menuBounds={x:x*2,y:y*2,w:w*2,h:h*2};
  const title=text(u,u.root,x+10,y+7,this.mode==='warning'?'WARNING':this.mode==='repair'?'Give resources':'Cursed cave',12,C.light,w-48,true,'heading');button(u,u.root,'X',x+w-30,y+6,22,22,()=>this.back(),{id:'cave-close'});
  const top=Math.max(y+30,title.y+title.height+4),fy=y+h-28,available=fy-top-4,scale=available>=112&&w>=260?2:1,iw=48*scale,cx=x+10+iw+10,cw=w-20-iw-10;
  curseTextures(u);const image=u.add.image(x+10,top,'curse-cave-'+c.stage).setOrigin(0).setScale(scale);u.root.add(image);this.artBounds={x:(x+10)*2,y:top*2,w:iw*2,h:52*scale*2,texture:image.texture.key};
  const labels={money:'Coins',wood:'Wood',stone:'Stone',meat:'Meat'};
  let pages=1;
  if(this.mode==='repair'&&c.stage==='broken'){
   const cols=cw>=144?2:1,gap=4,ch=38,rows=Math.max(1,Math.floor((available+gap)/(ch+gap))),per=cols*rows,entries=Object.entries(CURSED_CAVE.cost);pages=Math.ceil(entries.length/per);this.page=Math.min(this.page,pages-1);
   entries.slice(this.page*per,(this.page+1)*per).forEach(([key,n],i)=>{const bw=Math.floor((cw-gap*(cols-1))/cols),bx=cx+i%cols*(bw+gap),by=top+Math.floor(i/cols)*(ch+gap),disabled=!nearCave(s)||c.paid[key]>=n||!(key==='money'?s.money:s.inventory[key]);
    button(u,u.root,labels[key],bx,by,bw,ch,()=>{const r=contribute(s,key);a.save();if(r.complete){a.sound('journal:update');this.show('info');}else this.show('repair',this.page);},{id:'cave-give-'+key,disabled,preview:(scene,parent)=>{text(scene,parent,bx+bw/2,by+4,labels[key],8,C.light,bw-8).setOrigin(.5,0);text(scene,parent,bx+bw/2,by+23,c.paid[key]+'/'+n,8,C.light,undefined,false,'numeric').setOrigin(.5,0);}});
   });
  }else{
   const copy=text(u,u.root,cx,top,this.mode==='warning'?WARNING:c.stage==='sealed'?INFO:c.stage==='broken'?BROKEN:RESTORED,8,C.light,cw),lines=copy.getTextBounds().wrappedText.split('\n'),leaves=[];let part=[];
   for(const line of lines){copy.setText([...part,line].join('\n'));if(part.length&&copy.height>available){leaves.push(part.join('\n'));part=[line];}else part.push(line);}if(part.length)leaves.push(part.join('\n'));pages=leaves.length;this.page=Math.min(this.page,pages-1);copy.setText(leaves[this.page]);
  }
  this.pages=pages;this.ready=this.page===pages-1;const bw=Math.floor((w-24)/2),last=this.ready;
  if(!last)button(u,u.root,'Next',x+10,fy,bw,22,()=>this.show(this.mode,this.page+1),{id:'cave-next'});
  else if(this.mode==='warning')button(u,u.root,'Break seal',x+10,fy,bw,22,()=>{const r=breakSeal(s,true);if(r.ok){a.save();a.sound('cache:open');this.show('info');}},{id:'cave-break',disabled:!nearCave(s)||c.stage!=='sealed'});
  else if(this.mode==='info'&&c.stage==='sealed')button(u,u.root,'Read warning',x+10,fy,bw,22,()=>this.show('warning'),{id:'cave-warning'});
  else if(this.mode==='info'&&c.stage==='broken')button(u,u.root,'Rebuild',x+10,fy,bw,22,()=>this.show('repair'),{id:'cave-rebuild'});
  else button(u,u.root,'<',x+10,fy,bw,22,()=>this.show(this.mode==='repair'?'info':this.mode,0),{id:'cave-back'});
  button(u,u.root,this.mode==='warning'?'Keep seal':'Close',x+14+bw,fy,bw,22,()=>this.back(),{id:'cave-keep'});
  if(available>=52*scale+16)text(u,u.root,x+10+iw/2,top+52*scale+4,(this.page+1)+'/'+pages,8,C.muted,undefined,false,'numeric').setOrigin(.5,0);
 }
 snapshot(){return {mode:this.mode,page:this.page,pages:this.pages,ready:this.ready,art:this.artBounds,achievement:curseComplete(this.app.state?.curse||{paid:{}})&&this.app.state?.curse.stage==='restored'};}
}
