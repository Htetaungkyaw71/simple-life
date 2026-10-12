import {introArt as illustration} from './IntroArt.js';
import {INTRO,CHAPTERS} from '../data/story.js';
import {storyObjective,finishIntroduction,completeStory} from '../systems/story.js';
import {panel,text,button,UI_COLORS} from './pixelWidgets.js';
import {keepsakePixels} from './KeepsakeArt.js';
export function storyPanelLayout(u){const w=Math.min(330,u.w-u.safe.left-u.safe.right-12),h=Math.min(272,u.h-u.safe.top-u.safe.bottom-10);return {x:Math.floor((u.w-w)/2),y:Math.floor((u.h-h)/2),w,h,short:h<210};}
function backdrop(u,l){const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.6).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,l.x,l.y,l.w,l.h);u.menuBounds={x:l.x*2,y:l.y*2,w:l.w*2,h:l.h*2};}
function check(g,x,y,done){g.fillStyle(UI_COLORS.edge).fillRect(x,y,7,7).fillStyle(UI_COLORS.cream).fillRect(x+1,y+1,5,5);if(done)g.fillStyle(UI_COLORS.light).fillRect(x+1,y+3,2,2).fillRect(x+3,y+2,2,3).fillRect(x+5,y+1,1,2);}
export class StoryPanel {
 constructor(app){this.app=app;}
 show(kind,draw,escape){this.app.sound?.('ui:open');const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;u.menu={kind,title:kind==='journal'?"GRANDFATHER'S LAST REQUEST":kind,draw:()=>draw(u),escape};u.focus=0;u.layout();u.highlight();}
 intro(index=0,replay=false){
  const finish=skipped=>{if(!replay){finishIntroduction(this.app.state,skipped);this.app.save();this.app.ui.gettingStarted();}else this.journal();};
  this.show('intro',u=>{const l=storyPanelLayout(u),d=INTRO[index];backdrop(u,l);const heading=text(u,u.root,l.x+12,l.y+10,(index+1)+' / 4  '+d.title,9,UI_COLORS.light,l.w-24,true,'heading'),artY=l.y+Math.max(30,10+heading.height+6),ah=l.h<150?0:l.short?24:64;if(ah)illustration(u,l,d.art,artY,ah);text(u,u.root,l.x+12,artY+ah+6,d.text,8,UI_COLORS.light,l.w-24);const y=l.y+l.h-30,bw=Math.floor((l.w-28)/2);button(u,u.root,index===3?'Begin':'Continue',l.x+12,y,bw,24,()=>index<3?this.intro(index+1,replay):finish(false),{id:'intro-continue'});button(u,u.root,replay?'Close':'Skip',l.x+16+bw,y,bw,24,()=>finish(true),{id:'intro-skip'});},()=>finish(true));
 }
 journal(index=storyObjective(this.app.state).chapter,hintPage=0){
  this.show('journal',u=>{const l=storyPanelLayout(u),s=this.app.state,q=s.story,c=CHAPTERS[index],current=storyObjective(s),g=u.add.graphics();backdrop(u,l);u.root.add(g);
   if(!(l.short&&u.app.language?.current==='mm'))text(u,u.root,l.x+12,l.y+9,"GRANDFATHER'S LAST REQUEST",l.w<220?7:10,UI_COLORS.light,l.w-24,true,'heading');
   const chapter=text(u,u.root,l.x+12,l.y+(l.short&&u.app.language?.current==='mm'?9:l.short?26:34),'CHAPTER '+(index+1)+' / '+c.title,7,UI_COLORS.gold,l.w-24,true,'heading');
   const top=Math.max(l.y+(l.short&&u.app.language?.current==='mm'?34:l.short?44:56),chapter.y+chapter.height+6),step=l.short?12:19,active=c.steps.find(([id])=>!q.flags.includes(id)),tiny=l.short;
   const shown=tiny?[active||c.steps.at(-1)]:c.steps;
   let cursor=top;shown.forEach(([id,label])=>{check(g,l.x+12,cursor,q.flags.includes(id));const row=text(u,u.root,l.x+24,cursor,label,8,UI_COLORS.light,l.w-38);cursor+=Math.max(step,row.height+4);});
   const hint=text(u,u.root,l.x+12,cursor+5,active?active[2]:'Chapter complete.',8,UI_COLORS.muted,l.w-24),limit=l.y+l.h-36;
   if(hint.y+hint.height>limit){hint.setMaxWidth(l.w-52);const lines=hint.getTextBounds().wrappedText.split('\n'),count=Math.max(1,Math.floor((limit-hint.y+2)/(u.app.language?.current==='mm'?19:12))),pages=Math.ceil(lines.length/count),part=hintPage%pages;hint.setText(lines.slice(part*count,(part+1)*count).join('\n'));button(u,u.root,'>',l.x+l.w-34,l.y+l.h-58,22,22,()=>this.journal(index,(part+1)%pages),{id:'journal-hint-next'});}
   if(!l.short&&hint.y+hint.height+6<=l.y+l.h-66)text(u,u.root,l.x+12,l.y+l.h-66,q.completed?'Your life here continues.':'Current / '+current.step,7,UI_COLORS.gold,l.w-24);
   const y=l.y+l.h-30,bw=Math.floor((l.w-36)/4);
   [['<',()=>this.journal((index+4)%5),'journal-prev'],['>',()=>this.journal((index+1)%5),'journal-next'],['Replay',()=>this.intro(0,true),'journal-replay'],['Close',()=>this.app.pauseMenu(),'journal-close']].forEach(([label,fn,id],i)=>button(u,u.root,label,l.x+12+i*(bw+4),y,bw,24,fn,{id,fontSize:7}));
  },()=>this.app.pauseMenu());
 }
 place(){const a=this.app;if(!completeStory(a.state)){a.ui.feedback('Finish the journal chapters, then place the Keepsake.');a.sound('ui:disabled');return false;}
  a.save();const p=a.state.position,g=a.scene.add.graphics().setDepth(10002);keepsakePixels(g,p.x-16,p.y-72,2);a.paused=true;a.transitioning=true;a.input={};
  a.scene.tweens.add({targets:g,y:-24,alpha:0,duration:900,onComplete:()=>{g.destroy();a.transitioning=false;a.scene.build();this.completion();}});return true;
 }
 completion(){const a=this.app,q=a.state.story;if(!q.cuePlayed){q.cuePlayed=true;a.save();a.audio.completion();}this.letter(0,true);}
 letter(page=0,ending=false,leaf=0){
  const a=this.app,q=a.state.story,stats=q.completion||q.stats,body=page===0?'A seed cared for. A neighbour helped.\nA brave journey, and a safe return.\n\nThe little sun was never treasure.\nThere is always another morning.\n\nI am glad you found your way home.\n- Grandfather':`Days / ${q.completion?.day||a.state.day}\nActive time / ${Math.floor((q.completion?.seconds||q.activeSeconds)/60)} min\nHarvests / ${stats.harvests}\nProduce sales / ${stats.sales}\nBoars / ${stats.boars}   Falls / ${stats.deaths}`;
  this.show('completion',u=>{const l=storyPanelLayout(u);backdrop(u,l);const heading=text(u,u.root,l.x+12,l.y+10,"GRANDFATHER'S LAST REQUEST",9,UI_COLORS.light,l.w-24,true,'heading'),sub=text(u,u.root,l.x+12,Math.max(l.y+27,heading.y+heading.height+6),'COMPLETE',9,UI_COLORS.gold,undefined,false,'heading'),g=u.add.graphics();u.root.add(g);keepsakePixels(g,l.x+l.w-29,sub.y-3);const copy=text(u,u.root,l.x+12,sub.y+sub.height+6,body,8,UI_COLORS.light,l.w-24),limit=l.y+l.h-36;if(copy.y+copy.height>limit){copy.setMaxWidth(l.w-52);const lines=copy.getTextBounds().wrappedText.split('\n'),count=Math.max(1,Math.floor((limit-copy.y+2)/(u.app.language?.current==='mm'?19:12))),pages=Math.ceil(lines.length/count),part=leaf%pages;copy.setText(lines.slice(part*count,(part+1)*count).join('\n'));button(u,u.root,'>',l.x+l.w-34,l.y+l.h-58,22,22,()=>this.letter(page,ending,(part+1)%pages),{id:'ending-letter-next'});}
   const y=l.y+l.h-30,bw=Math.floor((l.w-32)/3);[['Continue',()=>{q.endingSeen=true;a.save();a.ui.close();},'ending-continue'],[page?'Letter':'Stats',()=>this.letter(1-page,ending),'ending-stats'],['Credits',()=>a.ui.credits(()=>this.letter(page,ending)),'ending-credits']].forEach(([label,fn,id],i)=>button(u,u.root,label,l.x+12+i*(bw+4),y,bw,24,fn,{id,fontSize:7}));
  },()=>{q.endingSeen=true;a.save();a.ui.close();});
 }
}
