import {OPENING_DIALOGUE,CITY_INVITE_DIALOGUE} from '../data/dialogues.js';
import {finishIntroduction,finishTutorial,completeStory} from '../systems/story.js';
import {ConversationPanel} from './ConversationPanel.js';
import {panel,text,button,UI_COLORS} from './pixelWidgets.js';
import {keepsakeSprite} from './KeepsakeArt.js';
import {CONNECTION_IDS,CONNECTION_LEVELS,CONNECTION_NPCS} from '../data/connections.js';
import {connectionDescription,connectionFor,connectionObjective,meetResident} from '../systems/connections.js';
import {portraitFor} from '../data/portraits.js';
import {residentScheduleHint} from '../systems/residentSchedules.js';
import {LAST_LANTERN_CHAPTERS} from '../data/lastLantern.js';
import {beginLanternNight,completedStoryDescription,finaleDialogue,mainStoryObjective} from '../systems/lastLantern.js';
import {LIFE_PATH_ORDER} from '../data/lifePaths.js';
import {lifePathRank} from '../systems/lifePaths.js';
export function storyPanelLayout(u){const w=Math.min(330,u.w-u.safe.left-u.safe.right-12),h=Math.min(272,u.h-u.safe.top-u.safe.bottom-10);return {x:Math.floor((u.w-w)/2),y:Math.floor((u.h-h)/2),w,h,short:h<210};}
export function peoplePanelLayout(u){
 const compact=u.touch&&u.w>u.h;if(!compact)return {...storyPanelLayout(u),compact:false};
 const w=Math.min(460,u.w-u.safe.left-u.safe.right-12),h=Math.min(210,u.h-u.safe.top-u.safe.bottom-10);
 return {x:Math.floor((u.w-w)/2),y:Math.floor((u.h-h)/2),w,h,short:true,compact:true};
}
function backdrop(u,l){const veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.6).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());panel(u,u.root,l.x,l.y,l.w,l.h);u.menuBounds={x:l.x*2,y:l.y*2,w:l.w*2,h:l.h*2};}
function check(g,x,y,done){g.fillStyle(UI_COLORS.border).fillRect(x,y,7,7).fillStyle(UI_COLORS.cream).fillRect(x+1,y+1,5,5);if(done)g.fillStyle(UI_COLORS.light).fillRect(x+1,y+3,2,2).fillRect(x+3,y+2,2,3).fillRect(x+5,y+1,1,2);}
function connectionFlames(g,x,y,level){for(let i=0;i<5;i++){const px=x+i*15,active=i<level;g.fillStyle(active?UI_COLORS.gold:UI_COLORS.border,active?1:.7).fillTriangle(px,y+9,px+5,y,px+10,y+9).fillCircle(px+5,y+9,4);}}
function connectionPerson(u,parent,id,x,y,w,h,met){const p=portraitFor(id,u.app.state),crop=p.crop,fit=p.fit||[crop?.[2]||32,crop?.[3]||48],s=u.add.sprite(x+w/2,y+h-3,p.texture,p.frame).setOrigin(.5,1);if(crop)s.setCrop(...crop);s.setScale(Math.min(w/fit[0],h/fit[1])*.9);if(!met)s.setTint(0x354239).setAlpha(.78);parent.add(s);return s;}
function dialogue(u,l,d,progress){
 const heading=text(u,u.root,l.x+12,l.y+9,progress+'  '+d.title,9,UI_COLORS.light,l.w-24,true,'heading'),top=Math.max(l.y+28,heading.y+heading.height+4),box=Math.min(l.short?38:46,Math.floor((l.w-34)/2)),gap=10,left=Math.floor(l.x+(l.w-box*2-gap)/2);
 for(const [i,person]of [{name:'You',texture:u.app.state.character,frame:0},{name:'Silas',texture:'lamplighter',frame:0}].entries()){
  const x=left+i*(box+gap),active=d.speaker===person.name;panel(u,u.root,x,top,box,box,active?UI_COLORS.selected:UI_COLORS.cream);
  const portrait=u.add.sprite(x+box/2,top+box-3,person.texture,person.frame).setOrigin(.5,1).setScale(person.name==='Silas'?box/72:box/88);u.root.add(portrait);
  text(u,u.root,x+box/2,top+box-10,person.name,6,active?UI_COLORS.gold:UI_COLORS.muted,box-4).setOrigin(.5,0);
 }
 const speaker=text(u,u.root,l.x+12,top+box+5,d.speaker,7,UI_COLORS.gold,l.w-24,true,'heading');
 text(u,u.root,l.x+12,speaker.y+speaker.height+3,d.text,l.short?7:8,UI_COLORS.light,l.w-24);
}
export class StoryPanel {
 constructor(app){this.app=app;this.conversation=app.conversationPanel||new ConversationPanel(app);}
 show(kind,draw,escape){this.app.sound?.('ui:open');const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;u.menu={kind,title:kind==='journal'?"GRANDFATHER'S LAST REQUEST":kind,draw:()=>draw(u),escape};u.focus=0;u.layout();u.highlight();}
 intro(index=0,replay=false){
  const met=meetResident(this.app.state,'city-silas');if(met.gained)this.app.save();
  const exit=()=>{if(replay)this.journal();else{finishIntroduction(this.app.state,true);this.app.save();this.app.ui.close();}};
  const done=()=>{if(replay)this.invite(true);else{finishIntroduction(this.app.state);this.app.save();this.app.ui.close();}};
  this.conversation.present(OPENING_DIALOGUE,typeof index==='string'?index:OPENING_DIALOGUE.start,{partner:'city-silas',residentId:'city-silas',residentName:'Silas',conversationId:'opening-silas',onComplete:done,escape:exit,progress:'OPENING',auxiliary:{label:replay?'Close':'Skip Opening',id:'intro-skip',action:exit}});
 }
 invite(replay=false){
  const done=()=>{if(replay)this.journal();else{finishTutorial(this.app.state);this.app.save();this.app.ui.close();this.app.ui.showCityObjective();}};
  this.conversation.present(CITY_INVITE_DIALOGUE,CITY_INVITE_DIALOGUE.start,{partner:'player',onComplete:done,escape:done,progress:'CITY',endId:'tutorial-finish'});
 }
 journal(index=mainStoryObjective(this.app.state).chapter,hintPage=0){
  this.show('journal',u=>{const l=storyPanelLayout(u),s=this.app.state,current=mainStoryObjective(s),c=LAST_LANTERN_CHAPTERS[index],completed=s.narrative.main.completed,g=u.add.graphics();backdrop(u,l);u.root.add(g);
   if(!(l.short&&u.app.language?.current==='mm'))text(u,u.root,l.x+12,l.y+9,'THE LAST LANTERN',l.w<220?7:10,UI_COLORS.light,l.w-24,true,'heading');
   const chapter=text(u,u.root,l.x+12,l.y+(l.short&&u.app.language?.current==='mm'?9:l.short?26:34),'CHAPTER '+(index+1)+' / '+c.title,7,UI_COLORS.gold,l.w-24,true,'heading');
   const top=Math.max(l.y+(l.short&&u.app.language?.current==='mm'?34:l.short?44:56),chapter.y+chapter.height+6),step=l.short?13:18,active=c.steps.find(([id])=>!completed.includes(id)),shown=l.short?[active||c.steps.at(-1)]:c.steps;
   let cursor=top;shown.forEach(([id,label])=>{check(g,l.x+12,cursor,completed.includes(id));const row=text(u,u.root,l.x+24,cursor,label,8,id===active?.[0]?UI_COLORS.gold:UI_COLORS.light,l.w-38);cursor+=Math.max(step,row.height+4);});
   const copy=active?active[2]:s.narrative.finale.status==='complete'?completedStoryDescription(s):'Chapter complete.',hint=text(u,u.root,l.x+12,cursor+4,copy,8,UI_COLORS.muted,l.w-24),limit=l.y+l.h-36;
   if(hint.y+hint.height>limit){hint.setMaxWidth(l.w-52);const lines=hint.getTextBounds().wrappedText.split('\n'),count=Math.max(1,Math.floor((limit-hint.y+2)/(u.app.language?.current==='mm'?19:12))),pages=Math.ceil(lines.length/count),part=hintPage%pages;hint.setText(lines.slice(part*count,(part+1)*count).join('\n'));button(u,u.root,'>',l.x+l.w-34,l.y+l.h-58,22,22,()=>this.journal(index,(part+1)%pages),{id:'journal-hint-next'});}
   if(!current.complete&&!l.short&&hint.y+hint.height+5<=l.y+l.h-62)text(u,u.root,l.x+12,l.y+l.h-62,'ACTIVE / '+current.step,7,UI_COLORS.gold,l.w-24);
   const y=l.y+l.h-30,bw=Math.floor((l.w-43)/6);[['<',()=>this.journal((index+4)%5),'journal-prev'],['>',()=>this.journal((index+1)%5),'journal-next'],['People',()=>this.people(0),'journal-people'],['Paths',()=>this.lifePaths(0),'journal-paths'],['Replay',()=>this.intro(0,true),'journal-replay'],['Close',()=>this.app.pauseMenu(),'journal-close']].forEach(([label,fn,id],i)=>button(u,u.root,label,l.x+8+i*(bw+3),y,bw,24,fn,{id,fontSize:6}));
  },()=>this.app.pauseMenu());
 }
 lifePaths(index=0){
  const pathId=LIFE_PATH_ORDER[(index+LIFE_PATH_ORDER.length)%LIFE_PATH_ORDER.length],progress=lifePathRank(this.app.state,pathId);
  this.show('journal',u=>{const l=storyPanelLayout(u),g=u.add.graphics();backdrop(u,l);u.root.add(g);text(u,u.root,l.x+12,l.y+9,'LIFE PATHS',10,UI_COLORS.light,l.w-24,true,'heading');
   text(u,u.root,l.x+12,l.y+36,progress.name.toUpperCase()+' / RANK '+progress.rank,9,UI_COLORS.gold,l.w-24,true,'heading');
   for(let i=0;i<5;i++){const x=l.x+14+i*24,y=l.y+57,active=i<progress.rank;g.fillStyle(active?UI_COLORS.gold:UI_COLORS.border,active?1:.65).fillCircle(x+6,y+7,6).fillTriangle(x+1,y+7,x+6,y-3,x+11,y+7);}
   const desc=text(u,u.root,l.x+12,l.y+78,progress.description,8,UI_COLORS.light,l.w-24),objectiveY=Math.max(l.y+125,desc.y+desc.height+12);text(u,u.root,l.x+12,objectiveY,'NEXT MEANINGFUL STEP',7,UI_COLORS.gold,l.w-24,true,'heading');text(u,u.root,l.x+12,objectiveY+16,progress.next,8,UI_COLORS.muted,l.w-24);
   const y=l.y+l.h-30,bw=Math.floor((l.w-32)/4);[['<',()=>this.lifePaths(index-1),'paths-prev'],['>',()=>this.lifePaths(index+1),'paths-next'],['Story',()=>this.journal(),'paths-story'],['Close',()=>this.app.pauseMenu(),'paths-close']].forEach(([label,fn,id],i)=>button(u,u.root,label,l.x+10+i*(bw+4),y,bw,24,fn,{id,fontSize:7}));
  },()=>this.app.pauseMenu());
 }
 people(index=0){
  const id=CONNECTION_IDS[(index+CONNECTION_IDS.length)%CONNECTION_IDS.length],definition=CONNECTION_NPCS[id],record=connectionFor(this.app.state,id),level=CONNECTION_LEVELS[record.level-1]||CONNECTION_LEVELS[0];
  this.show('journal',u=>{const l=peoplePanelLayout(u),g=u.add.graphics();backdrop(u,l);u.root.add(g);
   const title=text(u,u.root,l.x+12,l.y+(l.compact?7:9),'PEOPLE / CONNECTIONS',l.compact?8:l.w<240?8:10,UI_COLORS.light,l.w-24,true,'heading'),footerY=l.y+l.h-30;
   const cardY=Math.max(l.y+(l.compact?27:31),title.y+title.height+4),imageW=Math.min(l.compact?72:90,Math.floor(l.w*(l.compact?0.22:0.3))),contentX=l.x+20+imageW,contentW=l.w-imageW-32,imageH=l.compact?Math.max(54,Math.min(72,footerY-cardY-36)):Math.min(126,l.h-82);
   panel(u,u.root,l.x+10,cardY,imageW,imageH,0xe4e9c6,'plain');connectionPerson(u,u.root,id,l.x+12,cardY+3,imageW-4,imageH-6,record.met);
   const name=record.met?definition.name:'Not met';text(u,u.root,contentX,cardY+2,name,l.compact?8:9,record.met?UI_COLORS.gold:UI_COLORS.muted,contentW,true,'heading');
   text(u,u.root,contentX,cardY+(l.compact?16:19),record.met?level.name:'Stranger',7,UI_COLORS.light,contentW,true,'heading');connectionFlames(g,contentX,cardY+(l.compact?31:36),record.met?level.id:0);
   const desc=text(u,u.root,contentX,cardY+(l.compact?45:53),connectionDescription(this.app.state,id),l.compact?6:7,UI_COLORS.light,contentW),objectiveY=Math.max(cardY+imageH+4,desc.y+desc.height+(l.compact?3:7)),hint=residentScheduleHint(this.app.state,id);
   if(l.short){if(!l.compact||l.h>=145){text(u,u.root,l.x+12,objectiveY,'USUALLY',l.compact?6:7,UI_COLORS.gold,l.w-24,true,'heading');text(u,u.root,l.x+12,objectiveY+(l.compact?11:13),hint,l.compact?6:7,UI_COLORS.muted,l.w-24);}}
   else {text(u,u.root,l.x+12,objectiveY,'CURRENT',7,UI_COLORS.gold,l.w-24,true,'heading');const current=text(u,u.root,l.x+12,objectiveY+13,connectionObjective(this.app.state,id),7,UI_COLORS.muted,l.w-24);const hintY=Math.max(objectiveY+30,current.y+current.height+5);text(u,u.root,l.x+12,hintY,'USUALLY',7,UI_COLORS.gold,l.w-24,true,'heading');text(u,u.root,l.x+12,hintY+13,hint,7,UI_COLORS.muted,l.w-24);}
   const bw=Math.floor((l.w-32)/4);[['<',()=>this.people(index-1),'people-prev'],['>',()=>this.people(index+1),'people-next'],['Story',()=>this.journal(),'people-story'],['Close',()=>this.app.pauseMenu(),'people-close']].forEach(([label,fn,bid],i)=>button(u,u.root,label,l.x+10+i*(bw+4),footerY,bw,24,fn,{id:bid,fontSize:7}));
  },()=>this.app.pauseMenu());
 }
 place(){const a=this.app;if(!completeStory(a.state)){a.ui.feedback('Finish the journal chapters, then place the Keepsake.');a.sound('ui:disabled');return false;}
  a.save();const p=a.state.position,pendant=keepsakeSprite(a.scene,null,p.x,p.y-56).setDepth(10002);a.paused=true;a.transitioning=true;a.input={};
  a.scene.tweens.add({targets:pendant,y:pendant.y-24,alpha:0,duration:900,onComplete:()=>{pendant.destroy();a.transitioning=false;a.scene.build();this.completion();}});return true;
 }
 lanternNight(){const a=this.app;if(!beginLanternNight(a.state)){a.ui.feedback('Lantern Night is not ready yet.');a.sound('ui:disabled');return false;}a.festivalActive=true;a.save();a.scene.build();const dialogue=finaleDialogue(a.state);this.conversation.present(dialogue,dialogue.start,{partner:'player',progress:'LANTERN NIGHT',onComplete:()=>{a.festivalActive=false;a.scene.build();this.lanternSummary();},escape:()=>{a.festivalActive=false;a.scene.build();if(a.state.narrative.finale.status==='complete')this.lanternSummary();else a.ui.close();}});return true;}
 lanternSummary(){const a=this.app,finale=a.state.narrative.finale,stats=finale.completion;if(finale.status!=='complete'){a.ui.close();return;}const close=()=>{finale.summarySeen=true;a.festivalActive=false;a.save();a.scene.build();a.ui.close();};
  this.show('completion',u=>{const l=storyPanelLayout(u);backdrop(u,l);text(u,u.root,l.x+12,l.y+10,'LANTERN NIGHT',10,UI_COLORS.light,l.w-24,true,'heading');text(u,u.root,l.x+12,l.y+34,'THE LAST LANTERN / COMPLETE',8,UI_COLORS.gold,l.w-24,true,'heading');const body=`${stats.meaning}\n\nHighest path / ${stats.highestPath} Rank ${stats.highestRank}\nConnection / ${stats.connections}\nInvitations kept / ${stats.keptInvitations}\nPersonal events / ${stats.personalEvents}\n\nYour farm, City and Forest remain open.`;text(u,u.root,l.x+12,l.y+58,body,l.short?7:8,UI_COLORS.light,l.w-24);button(u,u.root,'Continue normal play',l.x+12,l.y+l.h-30,l.w-24,24,close,{id:'lantern-ending-continue',fontSize:7});},close);
 }
 completion(){const a=this.app,q=a.state.story;if(!q.cuePlayed){q.cuePlayed=true;a.save();a.audio.completion();}this.letter(0,true);}
 letter(page=0,ending=false,leaf=0){
  const a=this.app,q=a.state.story,stats=q.completion||q.stats,body=page===0?'A seed cared for. A neighbour helped.\nA brave journey, and a safe return.\n\nThe little sun was never treasure.\nThere is always another morning.\n\nI am glad you found your way home.\n- Grandfather':`Days / ${q.completion?.day||a.state.day}\nActive time / ${Math.floor((q.completion?.seconds||q.activeSeconds)/60)} min\nHarvests / ${stats.harvests}\nProduce sales / ${stats.sales}\nBoars / ${stats.boars}   Falls / ${stats.deaths}`;
  this.show('completion',u=>{const l=storyPanelLayout(u);backdrop(u,l);const heading=text(u,u.root,l.x+12,l.y+10,"GRANDFATHER'S LAST REQUEST",9,UI_COLORS.light,l.w-24,true,'heading'),sub=text(u,u.root,l.x+12,Math.max(l.y+27,heading.y+heading.height+6),'COMPLETE',9,UI_COLORS.gold,undefined,false,'heading');keepsakeSprite(u,u.root,l.x+l.w-22,sub.y+6,18);const copy=text(u,u.root,l.x+12,sub.y+sub.height+6,body,8,UI_COLORS.light,l.w-24),limit=l.y+l.h-36;if(copy.y+copy.height>limit){copy.setMaxWidth(l.w-52);const lines=copy.getTextBounds().wrappedText.split('\n'),count=Math.max(1,Math.floor((limit-copy.y+2)/(u.app.language?.current==='mm'?19:12))),pages=Math.ceil(lines.length/count),part=leaf%pages;copy.setText(lines.slice(part*count,(part+1)*count).join('\n'));button(u,u.root,'>',l.x+l.w-34,l.y+l.h-58,22,22,()=>this.letter(page,ending,(part+1)%pages),{id:'ending-letter-next'});}
   const y=l.y+l.h-30,bw=Math.floor((l.w-32)/3);[['Continue',()=>{q.endingSeen=true;a.save();a.ui.close();},'ending-continue'],[page?'Letter':'Stats',()=>this.letter(1-page,ending),'ending-stats'],['Credits',()=>a.ui.credits(()=>this.letter(page,ending)),'ending-credits']].forEach(([label,fn,id],i)=>button(u,u.root,label,l.x+12+i*(bw+4),y,bw,24,fn,{id,fontSize:7}));
  },()=>{q.endingSeen=true;a.save();a.ui.close();});
 }
}
