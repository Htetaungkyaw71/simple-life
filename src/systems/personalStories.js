import {PERSONAL_REPEAT_LINES,PERSONAL_STORIES,SILAS_FESTIVAL_SUPPORT} from '../data/personalStories.js';
import {SILAS_STORY} from '../data/connections.js';
import {applyConnectionOutcome,connectionFor,eventComplete} from './connections.js';
import {recordLifePath} from './lifePaths.js';
import {syncLastLantern} from './lastLantern.js';

const STORY_BY_RESIDENT=Object.fromEntries(Object.entries(PERSONAL_STORIES).map(([key,value])=>[value.residentId,key]));
const knownEvents=Object.fromEntries(Object.entries(PERSONAL_STORIES).map(([key,value])=>[key,new Set(value.events.map(event=>event.id))]));
const validChoices={clara:{seedMeaning:['preserve','grow','trust']},niko:{reconciliation:['meal','table','honest']},nell:{creativeCourage:['real','work-speaks','surprise'],bannerMeaning:['past','change','together']},walter:{truthResponse:['public','private','change']}};
const validSupports={clara:'flowers',niko:'food',nell:'banner',walter:'truth'};
export const freshPersonalStories=()=>Object.fromEntries(Object.keys(PERSONAL_STORIES).map(key=>[key,{events:[],days:{},choices:{},support:null}]));

export function personalRecord(state,key){return state?.narrative?.personal?.[key]||null;}
export function personalEventComplete(state,key,eventId){return !!personalRecord(state,key)?.events.includes(eventId);}
export function personalSupport(state,key){return personalRecord(state,key)?.support||null;}

function requirementMet(state,requirement){
 if(requirement==='clara-support')return personalSupport(state,'clara')==='flowers';
 if(requirement==='meal-support')return personalSupport(state,'niko')==='food';
 if(requirement==='forest-landmark')return state.narrative?.main?.landmarkVisited===true;
 return true;
}
function ready(state,key,event){
 const c=event.conditions||{},record=personalRecord(state,key),connection=connectionFor(state,PERSONAL_STORIES[key].residentId);
 if(record.events.includes(event.id))return false;
 if(c.chapter==='unlit-road'&&!state.narrative?.main?.completed?.includes('silas'))return false;
 if(c.requires&&!requirementMet(state,c.requires))return false;
 if(c.after&&!record.events.includes(c.after))return false;
 if(c.laterDay&&state.day<=(record.days[c.after]||0))return false;
 if(c.area&&state.area!==c.area)return false;
 if(c.time&&(state.minute<c.time[0]||state.minute>=c.time[1]))return false;
 if(c.minPoints&&connection.points<c.minPoints)return false;
 if(c.near&&Math.hypot(state.position.x-c.near.x,state.position.y-c.near.y)>c.near.radius)return false;
 return true;
}

const oneNode=(speaker,portrait,text)=>({start:'repeat',nodes:{repeat:{speaker,portrait,text,end:true,closeLabel:'Continue your day.'}}});
export function personalStoryDialogue(state,residentId){
 const key=STORY_BY_RESIDENT[residentId];
 if(key){
  const story=PERSONAL_STORIES[key],event=story.events.find(candidate=>ready(state,key,candidate));
  if(event)return {branch:event.id,dialogue:event.dialogue};
 }
 if(residentId==='city-silas'){
  const preparations=state.narrative?.preparations||{},readyForSupport=personalSupport(state,'clara')&&personalSupport(state,'niko')&&personalSupport(state,'nell')&&personalSupport(state,'walter');
  if(readyForSupport&&!preparations.lantern&&eventComplete(state,residentId,SILAS_STORY.events.clue)&&state.area==='city'&&state.minute>=1080&&state.minute<1440&&Math.hypot(state.position.x-SILAS_STORY.eastLamp.x,state.position.y-SILAS_STORY.eastLamp.y)<=SILAS_STORY.eastLamp.radius+40)return {branch:'silas-festival-support',dialogue:SILAS_FESTIVAL_SUPPORT};
 }
 return null;
}

export function personalRepeatDialogue(state,residentId){
 const key=STORY_BY_RESIDENT[residentId]||(residentId==='city-bruno'?'niko':null),record=key?personalRecord(state,key):null,line=PERSONAL_REPEAT_LINES[residentId];
 if(!line||!record?.events.length)return null;
 const completed=state.narrative?.finale?.status==='complete',speaker=residentId.replace(/^city-/,'').replace(/^./,c=>c.toUpperCase());
 return {branch:completed?'post-festival':'personal-repeat',dialogue:oneNode(speaker,residentId,completed?line.post:line.default)};
}

export function applyPersonalOutcome(state,residentId,outcome={}){
 if(!state?.narrative)return null;
 const key=STORY_BY_RESIDENT[residentId],record=key?personalRecord(state,key):null,connectionOutcome={};
 if(outcome.remember&&record){record.choices[outcome.remember.key]=outcome.remember.value;connectionOutcome.remember=outcome.remember;}
 if(outcome.event&&record&&knownEvents[key].has(outcome.event)&&!record.events.includes(outcome.event)){
  record.events.push(outcome.event);record.days[outcome.event]=state.day;connectionOutcome.event=outcome.event;connectionOutcome.dayFlag=null;
  recordLifePath(state,'neighbour','personal',outcome.event);
 }
 if(outcome.support&&record)record.support=outcome.support;
 if(outcome.support==='lantern'&&residentId==='city-silas')state.narrative.preparations.lantern=true;
 const result=Object.keys(connectionOutcome).length?applyConnectionOutcome(state,residentId,connectionOutcome):null;
 syncLastLantern(state);return result;
}

export function restorePersonalStories(raw){
 const result=freshPersonalStories();
 for(const [key,record] of Object.entries(result)){
  const source=raw?.[key];if(!source||typeof source!=='object'||Array.isArray(source))continue;
  record.events=[...new Set((Array.isArray(source.events)?source.events:[]).filter(id=>knownEvents[key].has(id)))];
  for(const id of record.events)record.days[id]=Number.isFinite(source.days?.[id])?Math.max(1,Math.min(99999,Math.floor(source.days[id]))):1;
  if(source.choices&&typeof source.choices==='object'&&!Array.isArray(source.choices))for(const [choice,values] of Object.entries(validChoices[key]))if(values.includes(source.choices[choice]))record.choices[choice]=source.choices[choice];
  const finalEvent=PERSONAL_STORIES[key].events.at(-1).id;
  record.support=source.support===validSupports[key]&&record.events.includes(finalEvent)?validSupports[key]:null;
 }
 return result;
}

export function completedPersonalEvents(state){return Object.values(state.narrative?.personal||{}).reduce((count,record)=>count+(record.events?.length||0),0);}
