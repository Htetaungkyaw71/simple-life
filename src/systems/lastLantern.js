import {FINAL_MEANINGS,FESTIVAL_POSITIONS,FESTIVAL_SITE,LAST_LANTERN_CHAPTERS} from '../data/lastLantern.js';
import {SILAS_STORY} from '../data/connections.js';
import {FOREST_PORTAL} from '../data/forestLandmarks.js';
import {connectionFor,eventComplete} from './connections.js';
import {highestLifePath,recordLifePath} from './lifePaths.js';

const personal=(state,key)=>state.narrative?.personal?.[key];
const event=(state,key,id)=>personal(state,key)?.events?.includes(id);
const support=(state,key)=>!!personal(state,key)?.support;
const stepChecks={
 opening:s=>s.story?.intro!=='pending',
 teo:s=>s.story?.conversations?.includes('clue:teo-lantern'),
 silas:s=>eventComplete(s,'city-silas',SILAS_STORY.events.clue)||s.story?.conversations?.includes('clue:silas-lamp'),
 'clara-first':s=>event(s,'clara','clara-seed-1'),'clara-second':s=>event(s,'clara','clara-seed-2'),'clara-support':s=>support(s,'clara'),
 'niko-first':s=>event(s,'niko','niko-table-1'),'niko-second':s=>event(s,'niko','niko-table-2'),'meal-support':s=>support(s,'niko'),
 'walter-first':s=>event(s,'walter','walter-truth-1'),'forest-landmark':s=>s.narrative?.main?.landmarkVisited===true,'walter-second':s=>event(s,'walter','walter-truth-2'),
 'nell-support':s=>support(s,'nell'),'silas-support':s=>s.narrative?.preparations?.lantern===true,
 preparations:s=>['clara','niko','nell','walter'].every(key=>support(s,key))&&s.narrative?.preparations?.lantern===true,
 gathering:s=>s.narrative?.finale?.status==='complete',
};
const allSteps=LAST_LANTERN_CHAPTERS.flatMap(chapter=>chapter.steps.map(([id])=>id));

export function syncLastLantern(state){
 const main=state?.narrative?.main;if(!main)return null;
 main.completed=allSteps.filter(id=>stepChecks[id]?.(state));
 const prepared=stepChecks.preparations(state),finale=state.narrative.finale;
 if(finale.status!=='complete')finale.status=prepared?'ready':'locked';
 return main;
}
export function mainStoryObjective(state){
 syncLastLantern(state);const completed=state.narrative.main.completed;
 let chapterIndex=LAST_LANTERN_CHAPTERS.findIndex(chapter=>chapter.steps.some(([id])=>!completed.includes(id)));
 if(chapterIndex<0)chapterIndex=LAST_LANTERN_CHAPTERS.length-1;
 const chapter=LAST_LANTERN_CHAPTERS[chapterIndex],active=chapter.steps.find(([id])=>!completed.includes(id))||chapter.steps.at(-1);
 const complete=state.narrative.finale.status==='complete';
 return {chapter:chapterIndex,title:chapter.title,step:complete?'The Last Lantern is complete':active[1],hint:complete?completedStoryDescription(state):active[2],activeId:active[0],completed:chapter.steps.filter(([id])=>completed.includes(id)),total:chapter.steps.length,done:chapter.steps.filter(([id])=>completed.includes(id)).length,complete};
}
export function recordForestLandmarkVisit(state){
 if(state?.area!=='forest'||!event(state,'walter','walter-truth-1')||state.narrative.main.landmarkVisited)return false;
 if(Math.hypot(state.position.x-FOREST_PORTAL.x,state.position.y-FOREST_PORTAL.y)>FOREST_PORTAL.clearing+48)return false;
 state.narrative.main.landmarkVisited=true;recordLifePath(state,'explorer','landmark','central-waystone');syncLastLantern(state);return true;
}
export function canBeginLanternNight(state){syncLastLantern(state);return state?.narrative?.finale?.status==='ready'&&state.area==='city';}
export function lanternNightContext(state){
 if(!canBeginLanternNight(state)||Math.hypot(state.position.x-FESTIVAL_SITE.x,state.position.y-FESTIVAL_SITE.y)>FESTIVAL_SITE.radius)return null;
 return {type:'lanternNight',x:FESTIVAL_SITE.x,y:FESTIVAL_SITE.y,label:'Begin Lantern Night'};
}
export function beginLanternNight(state){
 if(!canBeginLanternNight(state))return false;
 state.minute=Math.max(state.minute,1140);return true;
}
export function completeLanternNight(state,choice){
 if(!FINAL_MEANINGS[choice]||state.narrative.finale.status!=='ready')return false;
 const highest=highestLifePath(state),connections=Object.values(state.connections||{}),keptInvitations=connections.filter(record=>record.invitation?.status==='attended').length;
 state.narrative.finale={status:'complete',choice,summarySeen:false,completion:{day:state.day,meaning:FINAL_MEANINGS[choice].summary,highestPath:highest.id,highestRank:highest.rank,connections:connections.reduce((sum,record)=>sum+(record.points||0),0),keptInvitations,personalEvents:Object.values(state.narrative.personal).reduce((sum,record)=>sum+record.events.length,0)}};
 syncLastLantern(state);return true;
}
export function completedStoryDescription(state){const choice=state.narrative?.finale?.choice;return choice?FINAL_MEANINGS[choice].summary:'Lantern Night is waiting for the town to gather.';}

const choice=(label,next,id,finalChoice)=>({label,next,id,narrative:{finalChoice}});
const onward=next=>[{label:'Continue',next,id:'continue'}];
export function finaleDialogue(state){
 const clara=personal(state,'clara')?.choices?.seedMeaning||'grow',niko=personal(state,'niko')?.choices?.reconciliation||'honest',banner=personal(state,'nell')?.choices?.bannerMeaning||'together',walter=personal(state,'walter')?.choices?.truthResponse||'change',path=highestLifePath(state),kept=Object.values(state.connections||{}).filter(record=>record.invitation?.status==='attended').length;
 const flowerLine=clara==='preserve'?'We kept the memory safe long enough to let it live.':clara==='trust'?'The next hands are already caring for it.':'The memory grew because we let it change.';
 const tableLine=niko==='meal'?'We began with one honest meal.':niko==='table'?'The community table keeps generosity and tomorrow in the same plan.':'We spoke honestly before deciding what to share.';
 const truthLine=walter==='private'?'I apologized first to the people I failed, and now I owe the truth to everyone.':'I let fear divide this town after a Forest accident. Grandfather asked us to welcome travellers, and I helped silence him.';
 return {start:'welcome',nodes:{
  welcome:{speaker:'Teo',portrait:'city-teo',text:'You came! Luca and I kept the path clear, mostly. Everyone is waiting by the fountain.',choices:onward('luca')},
  luca:{speaker:'Luca',portrait:'city-luca',text:'The lamps look like a trail already. This time the trail ends with room for everyone.',choices:onward('flowers')},
  flowers:{speaker:'Clara',portrait:'clara',text:'The flowers are from the seed your grandfather saved for us. '+flowerLine,choices:onward('table')},
  table:{speaker:'Bruno',portrait:'city-bruno',text:'Niko and I made this table together. '+tableLine,choices:onward('banner')},
  banner:{speaker:'Nell',portrait:'city-nell',text:`The banner means “${banner==='past'?'remember':banner==='change'?'welcome change':'belong together'}.” It is the first original design I have shown the whole town.`,choices:onward('truth')},
  truth:{speaker:'Walter',portrait:'city-walter',text:truthLine,choices:onward('silas')},
  silas:{speaker:'Silas',portrait:'city-silas',text:'The first lantern was never meant to belong to one keeper. Stand with me, and help the road remember its light.',choices:onward('lights')},
  lights:{speaker:'Silas',portrait:'city-silas',text:'There. Every City lamp is answering it.',choices:onward('letter'),narrative:{effect:'festival-lights'}},
  letter:{speaker:'Grandfather’s letter',portrait:'player',text:'A tradition survives when it makes room for another person. Do not keep my light unchanged; decide what it is for.',choices:onward('recognition')},
  recognition:{speaker:'Elena',portrait:'city-elena',text:`The town saw a Rank ${path.rank} ${path.name} bring people back together${kept?' and keep every invitation':' without asking anyone to be perfect'}.`,choices:onward('meaning')},
  meaning:{speaker:'You',portrait:'player',text:'From tonight on, Lantern Night will mean…',choices:[
   choice(FINAL_MEANINGS.remember.label,'end-remember','final-remember','remember'),choice(FINAL_MEANINGS.welcome.label,'end-welcome','final-welcome','welcome'),choice(FINAL_MEANINGS.together.label,'end-together','final-together','together'),
  ]},
  'end-remember':{speaker:'Silas',portrait:'city-silas',text:'Then we will remember them by keeping the road open for those who follow.',end:true,closeLabel:'Continue life in City.'},
  'end-welcome':{speaker:'Walter',portrait:'city-walter',text:'Then the welcome Grandfather asked for will finally be spoken aloud.',end:true,closeLabel:'Continue life in City.'},
  'end-together':{speaker:'Clara',portrait:'clara',text:'Then no one carries the light alone, and no memory has to remain hidden.',end:true,closeLabel:'Continue life in City.'},
 }};
}

const reaction=(speaker,portrait,text)=>({branch:'last-lantern-reaction',dialogue:{start:'reaction',nodes:{reaction:{speaker,portrait,text,end:true,closeLabel:'Continue your day.'}}}});
export function lastLanternReaction(state,id){
 const complete=state.narrative?.finale?.status==='complete',chapter=mainStoryObjective(state).chapter;
 if(complete){
  const lines={
   'city-teo':'The lamps stayed bright after everyone went home. Luca says that means Lantern Night is permanent now.',
   'city-luca':'Next Lantern Night needs a longer path. I know three Forest turns Teo has never tried.',
   'city-sol':'People came home looking more like themselves. That is rarer than a new haircut.',
   'city-elena':'The gathering left footprints through every garden path. Shared places should look used.',
   'city-bruno':'The last bowl was shared before midnight. That is exactly enough food.',
  };if(lines[id])return reaction(id.replace(/^city-/,'').replace(/^./,c=>c.toUpperCase()),id,lines[id]);
 }
 const chapterLines={
  1:{'city-teo':'Clara checked the old flower bed three times today. That usually means she has decided something.','city-sol':'Clara looks lighter, though she is carrying a watering can. People are strange that way.','city-elena':'A seed can preserve a memory by changing. Gardens have always known that.'},
  2:{'city-bruno':'Niko and I disagree because we both care whether the next table is full. We are learning to say that first.','city-sol':'Niko is still talking quickly, but now he pauses long enough for Bruno to answer.','city-elena':'A shared table needs care as much as a shared garden. Good intentions still need roots.'},
  3:{'city-teo':'Walter watches the east road whenever someone mentions the Forest. He knows more than he has said.','city-luca':'The old waystone is deep in the Forest, but the bridges still lead home. I checked.','city-sol':'Walter has been rehearsing one short sentence all day. It must be an important one.','city-elena':'Fear can close a public place as surely as a locked gate. Someone has to open it again.'},
 };
 if(chapterLines[chapter]?.[id])return reaction(id.replace(/^city-/,'').replace(/^./,c=>c.toUpperCase()),id,chapterLines[chapter][id]);
 if(chapter===4){const lines={'city-teo':'Everyone is carrying something toward the fountain. Luca and I are carrying instructions.','city-luca':'Teo says not to race under the lantern strings. He did not say anything about racing beside them.','city-sol':'Nell has stopped hiding the banner colours. That change suits her.','city-elena':'The garden has room for Clara’s flowers. A gathering needs living things, not only decorations.','city-bruno':'Niko and I have a table plan. It contains both food and numbers, which seems fair.'};if(lines[id])return reaction(id.replace(/^city-/,'').replace(/^./,c=>c.toUpperCase()),id,lines[id]);}
 return null;
}

export function festivalResidentPose(state,resident,active=false){const p=active&&state.area==='city'?FESTIVAL_POSITIONS[resident.id]:null;return p?{position:{x:p.x,y:p.y},direction:p.direction,visible:true,moving:false,sitting:false,mode:'festival',serviceActive:false,activity:{id:'lantern-night',dialogueGroup:'festival'},meeting:'lantern-night'}:null;}
