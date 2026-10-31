import {portraitFor} from '../data/portraits.js';
import {RESIDENT_SERVICES} from '../data/dialogues.js';
import {ORDERS} from '../data/settlement.js';
import {dialogueFor,recordConversationFlags} from '../systems/conversations.js';
import {applyConnectionOutcome,completeMeaningfulConversation,connectionLevel,meetResident} from '../systems/connections.js';
import {recordStory} from '../systems/story.js';
import {applyNarrativeOutcome} from '../systems/narrative.js';
import {resolveResidentSchedule} from '../systems/residentSchedules.js';
import {button,panel,text,UI_COLORS} from './pixelWidgets.js';

function portrait(u,parent,id,x,y,w,h,small=false){
 const d=portraitFor(id,u.app.state),crop=d.crop,fit=d.fit||[crop?.[2]||32,crop?.[3]||48],s=u.add.sprite(x+w/2,y,d.texture,d.frame).setOrigin(.5,0);
 if(crop)s.setCrop(...crop);
 const scale=Math.min(w/fit[0],h/fit[1])*(small?.82:1);
 s.setScale(scale);parent.add(s);return s;
}
const portraitName=id=>id==='player'?'You':id.replace(/^city-/,'').replace(/^./,c=>c.toUpperCase());
function layout(u){
 const available=u.h-u.safe.top-u.safe.bottom,pw=Math.min(620,u.w-u.safe.left-u.safe.right-12),portraitW=Math.max(54,Math.min(132,Math.floor(pw*.34)));
 const preferred=u.w<u.h?184:u.h<210?130:154,ph=Math.min(preferred,available-10),x=Math.floor((u.w-pw)/2),y=u.h-u.safe.bottom-ph-6;
 return {x,y,w:pw,h:ph,portraitW,textW:pw-portraitW-32};
}
export function drawConversation(u,page,choices,{partner='player',auxiliary=null,progress=''}={}){
 const l=layout(u),veil=u.add.rectangle(0,0,u.w,u.h,0x23362a,.18).setOrigin(0).setInteractive();u.root.add(veil);veil.on('pointerdown',(p,a,b,e)=>e.stopPropagation());
 panel(u,u.root,l.x,l.y,l.w,l.h);u.menuBounds={x:l.x*2,y:l.y*2,w:l.w*2,h:l.h*2};
 const displayPortrait=page.portrait==='player'?(partner&&partner!=='player'?partner:null):page.portrait;
 if(displayPortrait){const px=l.x+l.w-l.portraitW-8,py=l.y+8,plateH=20,portraitH=l.h-plateH-18;
  panel(u,u.root,px,py,l.portraitW,portraitH,0xe4e9c6,'plain');portrait(u,u.root,displayPortrait,px+3,py+3,l.portraitW-6,portraitH-5);
  panel(u,u.root,px,py+portraitH,l.portraitW,plateH,UI_COLORS.wood,'wood');text(u,u.root,px+l.portraitW/2,py+portraitH+5,portraitName(displayPortrait),7,UI_COLORS.cream,l.portraitW-8,true).setOrigin(.5,0).setCenterAlign();
 }
 const tx=l.x+12,tw=displayPortrait?l.textW:l.w-24,kicker=progress?progress+'  '+page.speaker:page.speaker;
 const heading=text(u,u.root,tx,l.y+10,kicker,8,UI_COLORS.gold,tw,true,'heading');
 const actions=auxiliary?[...choices,auxiliary]:choices,buttons=actions.length,vertical=buttons>2||tw<170||u.touch&&choices.some(c=>c.label.length>18),buttonRows=vertical?buttons:1,bh=22,gap=4,footer=buttonRows*bh+(buttonRows-1)*gap;
 const bodyY=Math.max(l.y+27,heading.y+heading.height+5),bodyH=l.y+l.h-10-footer-bodyY;
 const copy=text(u,u.root,tx,bodyY,page.text,7,UI_COLORS.light,tw);
 if(copy.height>bodyH&&u.app.language?.current!=='mm')copy.setFontSize(6);
 const by=l.y+l.h-10-footer;
 actions.forEach((c,i)=>{const bw=vertical?tw:Math.floor((tw-gap*(buttons-1))/buttons),x=vertical?tx:tx+i*(bw+gap),y=vertical?by+i*(bh+gap):by;button(u,u.root,c.label,x,y,bw,bh,c.action,{id:c.id||c.label,fontSize:7});});
 u.highlight();
}

function connectionAnimation(u,name,result){
 if(!result?.gained)return;if(u.connectionNotice)u.connectionNotice.destroy(true);const level=connectionLevel(result.record.points),root=u.add.container(Math.floor(u.w/2),u.safe.top+16).setDepth(500).setScale(2),g=u.add.graphics();u.connectionNotice=root;root.add(g);
 const width=74;g.fillStyle(0x23362a,.92).fillRect(-width/2,-8,width,25).lineStyle(1,UI_COLORS.gold,1).strokeRect(-width/2,-8,width,25);
 for(let i=0;i<5;i++){const x=-24+i*12,active=i<level.id;g.fillStyle(active?UI_COLORS.gold:UI_COLORS.border,active?1:.7).fillTriangle(x,6,x+4,-1,x+8,6).fillCircle(x+4,6,3);}
 text(u,root,0,10,result.levelUp?name+' / '+level.name:name+' / connection grew',6,result.levelUp?UI_COLORS.gold:UI_COLORS.cream,width-4,true).setOrigin(.5,0).setCenterAlign();
 u.tweens.add({targets:root,y:root.y-8,alpha:0,duration:1150,ease:'Quad.easeOut',onComplete:()=>{if(u.connectionNotice===root)u.connectionNotice=null;root.destroy(true);}});
}

export class ConversationPanel{
 constructor(app){this.app=app;}
 present(dialogue,nodeId=dialogue.start,options={}){
  const page=dialogue.nodes[nodeId];if(!page)return;
  let pageResult=null;
  if(page.flags?.length)recordConversationFlags(this.app.state,page.flags);
  if(page.connection&&options.residentId)pageResult=applyConnectionOutcome(this.app.state,options.residentId,page.connection);
  if(page.narrative)pageResult=applyNarrativeOutcome(this.app.state,options.residentId,page.narrative)||pageResult;
  if(page.flags?.length||page.connection||page.narrative)this.app.save();
  if(page.connection?.effect==='light-east-lamp')this.app.scene.cityLights?.celebrateEastLamp?.();
  if(page.narrative?.effect==='festival-lights')this.app.scene.cityLights?.celebrateFestival?.();
  const advance=c=>{let result=null;if(c.flags?.length)recordConversationFlags(this.app.state,c.flags);if(c.connection&&options.residentId)result=applyConnectionOutcome(this.app.state,options.residentId,c.connection);if(c.narrative)result=applyNarrativeOutcome(this.app.state,options.residentId,c.narrative)||result;if(c.flags?.length||c.connection||c.narrative)this.app.save();if(c.narrative?.finalChoice||c.narrative?.effect==='festival-lights')this.app.scene.cityLights?.celebrateFestival?.();this.present(dialogue,c.next,options);connectionAnimation(this.app.ui,options.residentName||page.speaker,result);};
  const finish=()=>{let result=null;if(options.residentId)result=completeMeaningfulConversation(this.app.state,options.residentId,options.conversationId||nodeId);this.app.save();options.onComplete?.();if(!options.onComplete)this.app.ui.close();connectionAnimation(this.app.ui,options.residentName||page.speaker,result);};
  let choices=(page.choices||[]).map(c=>({label:c.label,id:c.id,action:()=>advance(c)}));
  if(page.end)choices=[{label:options.primaryLabel?.(page)||page.closeLabel||'Close',id:options.endId||'conversation-close',action:finish},...(options.extraChoices?.()||[])];
  const u=this.app.ui;this.app.paused=true;this.app.input={};u.notice=null;
  u.menu={kind:'conversation',title:page.speaker,openedAt:u.time.now,escape:options.escape||finish,draw:()=>drawConversation(u,page,choices,{partner:options.partner,auxiliary:options.auxiliary,progress:options.progress})};u.focus=0;u.layout();u.highlight();
  connectionAnimation(u,options.residentName||page.speaker,pageResult);
 }
 openResident(id){
  const selected=dialogueFor(this.app.state,id);if(!selected)return;
  recordStory(this.app.state,'resident');recordConversationFlags(this.app.state,'met:'+id);const met=meetResident(this.app.state,id);this.app.save();
  const service=RESIDENT_SERVICES[id],schedule=resolveResidentSchedule(this.app.state,id),serviceOpen=!!service&&schedule?.serviceActive,hasOrder=ORDERS.some(d=>d.resident===id);
  const openService=()=>{this.app.ui.close();if(service.type==='seed'||service.type==='sell')this.app.tradePanel.open(service.type);else this.app.appearancePanel.openShop(service.type);};
  const extras=()=>[
   ...(serviceOpen?[{label:service.label,id:'conversation-service',action:openService}]:[]),
   ...(hasOrder?[{label:'Daily request',id:'conversation-order',action:()=>{this.app.ui.close();this.app.resourcePanel.orders(id);}}]:[]),
  ];
  const dialogue=selected.dialogue;
  this.present(dialogue,dialogue.start,{partner:'player',residentId:id,residentName:selected.dialogue.nodes[selected.dialogue.start]?.speaker,conversationId:id+':'+selected.branch,extraChoices:extras,primaryLabel:page=>serviceOpen&&page.closeLabel===service.label?'Maybe later.':page.closeLabel});
  connectionAnimation(this.app.ui,selected.dialogue.nodes[selected.dialogue.start]?.speaker||id,met);
 }
}
