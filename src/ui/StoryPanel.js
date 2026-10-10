import {INTRO,CHAPTERS} from '../data/story.js';
import {storyObjective,finishIntroduction,completeStory} from '../systems/story.js';
import {panel,text,button,UI_COLORS} from './pixelWidgets.js';
import {keepsakePixels} from './KeepsakeArt.js';
export function storyPanelLayout(u){const w=Math.min(330,u.w-u.safe.left-u.safe.right-12),h=Math.min(272,u.h-u.safe.top-u.safe.bottom-10);return {x:Math.floor((u.w-w)/2),y:Math.floor((u.h-h)/2),w,h,short:h<210};}
function backdrop(u,l){const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.6).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,l.x,l.y,l.w,l.h);u.menuBounds={x:l.x*2,y:l.y*2,w:l.w*2,h:l.h*2};}
function check(g,x,y,done){g.fillStyle(UI_COLORS.edge).fillRect(x,y,7,7).fillStyle(UI_COLORS.cream).fillRect(x+1,y+1,5,5);if(done)g.fillStyle(UI_COLORS.light).fillRect(x+1,y+3,2,2).fillRect(x+3,y+2,2,3).fillRect(x+5,y+1,1,2);}
function illustration(u,l,art,y,height){
 const g=u.add.graphics();u.root.add(g);const x=l.x+12,w=l.w-24,cx=Math.floor(x+w/2);g.fillStyle(0xe5ddba).fillRect(x,y,w,height).fillStyle(0xa9bb7e).fillRect(x,y+height-8,w,8);
 if(art==='city'){for(let i=0;i<9;i++){const px=x+3+i*Math.floor(w/9),h=12+(i*7)%Math.max(13,height-12);g.fillStyle(i%2?0x747154:0x85945c).fillRect(px,y+height-h,Math.floor(w/10),h);for(let k=4;k<h-2;k+=7)g.fillStyle(0xf3eccf).fillRect(px+3,y+height-h+k,2,2);}g.fillStyle(0x423a32).fillRect(x,y+height-4,w,4);}
 else if(art==='letter'){g.fillStyle(0x93694c).fillRect(cx-24,y+4,48,height-10).fillStyle(0xfffbe5).fillRect(cx-22,y+3,44,height-12);for(let i=0;i<3;i++)g.fillStyle(0xa37035).fillRect(cx-15,y+9+i*5,20+i%2*8,1);keepsakePixels(g,cx+27,y+7);}
 else if(art==='farm'){g.fillStyle(0x93694c).fillRect(cx-24,y+12,48,height-16).fillStyle(0xd78b60).fillRect(cx-30,y+8,60,6).fillRect(cx-22,y+4,44,4).fillStyle(0xfffbe5).fillRect(cx-18,y+19,10,8).fillRect(cx+8,y+19,10,8).fillStyle(0x423a32).fillRect(cx-4,y+height-16,8,12);}
 else{for(let i=0;i<7;i++){const px=x+10+i*(w-20)/6;g.fillStyle(0x93694c).fillRect(Math.floor(px)-2,y+12,4,height-15);g.fillStyle(i%2?0x5b713d:0x7e914d).fillRect(Math.floor(px)-8,y+4,16,height-17).fillRect(Math.floor(px)-13,y+12,26,8);}g.fillStyle(0xc6d699).fillRect(cx-6,y+height-10,12,10);}
}
export class StoryPanel {
 constructor(app){this.app=app;}
 show(kind,draw,escape){this.app.sound?.('ui:open');const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;u.menu={kind,title:kind==='journal'?"GRANDFATHER'S LAST REQUEST":kind,draw:()=>draw(u),escape};u.focus=0;u.layout();u.highlight();}
 intro(index=0,replay=false){
  const finish=skipped=>{if(!replay){finishIntroduction(this.app.state,skipped);this.app.save();this.app.ui.close();this.app.ui.toast('Crate / starter seeds. Pause / JOURNAL for your next step.');}else this.journal();};
  this.show('intro',u=>{const l=storyPanelLayout(u),d=INTRO[index];backdrop(u,l);text(u,u.root,l.x+12,l.y+10,(index+1)+' / 4  '+d.title,9,UI_COLORS.light,l.w-24,true);const ah=l.short?34:64;illustration(u,l,d.art,l.y+30,ah);text(u,u.root,l.x+12,l.y+36+ah,d.text,l.short?7:8,UI_COLORS.light,l.w-24);const y=l.y+l.h-30,bw=Math.floor((l.w-28)/2);button(u,u.root,index===3?'Begin':'Continue',l.x+12,y,bw,24,()=>index<3?this.intro(index+1,replay):finish(false),{id:'intro-continue'});button(u,u.root,replay?'Close':'Skip',l.x+16+bw,y,bw,24,()=>finish(true),{id:'intro-skip'});},()=>finish(true));
 }
 journal(index=storyObjective(this.app.state).chapter){
  this.show('journal',u=>{const l=storyPanelLayout(u),s=this.app.state,q=s.story,c=CHAPTERS[index],current=storyObjective(s),g=u.add.graphics();backdrop(u,l);u.root.add(g);
   text(u,u.root,l.x+12,l.y+9,"GRANDFATHER'S LAST REQUEST",l.w<220?7:10,UI_COLORS.light,l.w-24,true);
   text(u,u.root,l.x+12,l.y+(l.short?26:34),'CHAPTER '+(index+1)+' / '+c.title,7,UI_COLORS.gold,l.w-24,true);
   const top=l.y+(l.short?44:56),step=l.short?12:19;
   c.steps.forEach(([id,label],i)=>{check(g,l.x+12,top+i*step,q.flags.includes(id));text(u,u.root,l.x+24,top+i*step,label,l.short?6:7,UI_COLORS.light,l.w-38);});
   const active=c.steps.find(([id])=>!q.flags.includes(id));text(u,u.root,l.x+12,top+c.steps.length*step+5,active?active[2]:'Chapter complete.',l.short?6:7,UI_COLORS.muted,l.w-24);
   if(!l.short)text(u,u.root,l.x+12,l.y+l.h-66,q.completed?'Your life here continues.':'Current / '+current.step,7,UI_COLORS.gold,l.w-24);
   const y=l.y+l.h-30,bw=Math.floor((l.w-36)/4);
   [['<',()=>this.journal((index+4)%5),'journal-prev'],['>',()=>this.journal((index+1)%5),'journal-next'],['Replay',()=>this.intro(0,true),'journal-replay'],['Close',()=>this.app.pauseMenu(),'journal-close']].forEach(([label,fn,id],i)=>button(u,u.root,label,l.x+12+i*(bw+4),y,bw,24,fn,{id,fontSize:7}));
  },()=>this.app.pauseMenu());
 }
 place(){const a=this.app;if(!completeStory(a.state)){a.ui.feedback('Finish the journal chapters, then place the Keepsake.');a.sound('ui:disabled');return false;}
  a.save();const p=a.state.position,g=a.scene.add.graphics().setDepth(10002);keepsakePixels(g,p.x-16,p.y-72,2);a.paused=true;a.transitioning=true;a.input={};
  a.scene.tweens.add({targets:g,y:-24,alpha:0,duration:900,onComplete:()=>{g.destroy();a.transitioning=false;a.scene.build();this.completion();}});return true;
 }
 completion(){const a=this.app,q=a.state.story;if(!q.cuePlayed){q.cuePlayed=true;a.save();a.audio.completion();}this.letter(0,true);}
 letter(page=0,ending=false){
  const a=this.app,q=a.state.story,stats=q.completion||q.stats,body=page===0?'A seed cared for. A neighbour helped.\nA brave journey, and a safe return.\n\nThe little sun was never treasure.\nThere is always another morning.\n\nI am glad you found your way home.\n- Grandfather':`Days / ${q.completion?.day||a.state.day}\nActive time / ${Math.floor((q.completion?.seconds||q.activeSeconds)/60)} min\nHarvests / ${stats.harvests}\nProduce sales / ${stats.sales}\nBoars / ${stats.boars}   Falls / ${stats.deaths}`;
  this.show('completion',u=>{const l=storyPanelLayout(u);backdrop(u,l);text(u,u.root,l.x+12,l.y+10,"GRANDFATHER'S LAST REQUEST",l.w<220?7:9,UI_COLORS.light,l.w-24,true);text(u,u.root,l.x+12,l.y+27,'COMPLETE',9,UI_COLORS.gold);const g=u.add.graphics();u.root.add(g);keepsakePixels(g,l.x+l.w-29,l.y+24);text(u,u.root,l.x+12,l.y+46,body,l.short?6:8,UI_COLORS.light,l.w-24);
   const y=l.y+l.h-30,bw=Math.floor((l.w-32)/3);[['Continue',()=>{q.endingSeen=true;a.save();a.ui.close();},'ending-continue'],[page?'Letter':'Stats',()=>this.letter(1-page,ending),'ending-stats'],['Credits',()=>a.ui.credits(()=>this.letter(page,ending)),'ending-credits']].forEach(([label,fn,id],i)=>button(u,u.root,label,l.x+12+i*(bw+4),y,bw,24,fn,{id,fontSize:7}));
  },()=>{q.endingSeen=true;a.save();a.ui.close();});
 }
}
