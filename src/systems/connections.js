import {CONNECTION_IDS,CONNECTION_LEVELS,CONNECTION_NPCS,CONNECTION_RULES,SILAS_STORY} from '../data/connections.js';
import {recordLifePath} from './lifePaths.js';

const bounded=(value,max=9999)=>Number.isFinite(value)?Math.max(0,Math.min(max,Math.floor(value))):0;
const primitive=value=>typeof value==='string'||typeof value==='boolean'||Number.isFinite(value);
export const connectionLevel=points=>CONNECTION_LEVELS.reduce((level,row)=>points>=row.threshold?row:level,CONNECTION_LEVELS[0]);
export const freshConnection=()=>({met:false,points:0,level:1,lastMeaningfulConversationDay:0,completedConversationIds:[],choices:{},invitation:null,promise:{id:null,state:'none'},flags:{}});
export const freshConnections=()=>Object.fromEntries(CONNECTION_IDS.map(id=>[id,freshConnection()]));
export const connectionFor=(s,id)=>s?.connections?.[id]||freshConnection();
export const eventComplete=(s,id,eventId)=>connectionFor(s,id).completedConversationIds.includes(eventId);

function normalizeInvitation(value){
 if(!value||value.id!==SILAS_STORY.invitationId||!['pending','attended'].includes(value.status))return null;
 return {id:value.id,status:value.status,issuedDay:Math.max(1,bounded(value.issuedDay,99999)),dueDay:Math.max(1,bounded(value.dueDay,99999))};
}
function normalizePromise(value){
 if(!value||typeof value!=='object')return {id:null,state:'none'};
 const state=['none','pending','kept'].includes(value.state)?value.state:'none';
 return {id:state==='none'?null:typeof value.id==='string'?value.id.slice(0,64):null,state};
}
export function restoreConnections(raw,state,sourceVersion=0){
 const result=freshConnections(),saved=raw&&typeof raw==='object'?raw:{};
 for(const id of CONNECTION_IDS){
  const from=saved[id],r=result[id],definition=CONNECTION_NPCS[id];
  if(from&&typeof from==='object'){
   r.met=from.met===true;r.points=bounded(from.points);r.lastMeaningfulConversationDay=bounded(from.lastMeaningfulConversationDay,99999);
   r.completedConversationIds=[...new Set((Array.isArray(from.completedConversationIds)?from.completedConversationIds:[]).filter(v=>typeof v==='string'&&v.length<=80))].slice(0,128);
   if(from.choices&&typeof from.choices==='object'&&!Array.isArray(from.choices))for(const [key,value]of Object.entries(from.choices).slice(0,32))if(key.length<=64&&primitive(value))r.choices[key]=typeof value==='string'?value.slice(0,120):value;
   r.invitation=id==='city-silas'?normalizeInvitation(from.invitation):null;r.promise=normalizePromise(from.promise);
   if(from.flags&&typeof from.flags==='object'&&!Array.isArray(from.flags))for(const key of definition.personalFlags)if(primitive(from.flags[key]))r.flags[key]=from.flags[key];
  }
  const metFlag=state.story?.conversations?.includes('met:'+id),openingSilas=id==='city-silas'&&state.story?.intro!=='pending';
  if((metFlag||openingSilas)&&!r.met){r.met=true;r.points=Math.max(r.points,CONNECTION_RULES.introduction+CONNECTION_RULES.dailyUsefulConversation);r.completedConversationIds.push('introduction:'+id);}
  // Milestone 1's completed Teo/Silas clue is the same one-time story beat.
  if(id==='city-silas'&&state.story?.conversations?.includes('clue:silas-lamp')&&!r.completedConversationIds.includes(SILAS_STORY.events.clue)){
   r.met=true;r.completedConversationIds.push(SILAS_STORY.events.clue);r.points=Math.max(r.points,11);r.choices.lampQuestion='legacy-clue';r.flags.event1Day=Math.max(1,state.day-1);
  }
  r.completedConversationIds=[...new Set(r.completedConversationIds)].slice(0,128);r.level=connectionLevel(r.points).id;
 }
 return result;
}

function updateLevel(record,before){record.level=connectionLevel(record.points).id;return {record,gained:record.points-before,levelUp:record.level>connectionLevel(before).id};}
function addOnce(record,id,points){if(record.completedConversationIds.includes(id))return 0;record.completedConversationIds.push(id);record.points=Math.min(9999,record.points+points);return points;}
export function meetResident(s,id){
 const record=s?.connections?.[id];if(!record)return {gained:0,record:null,levelUp:false};const before=record.points;
 if(!record.met){record.met=true;addOnce(record,'introduction:'+id,CONNECTION_RULES.introduction);recordLifePath(s,'neighbour','meet',id);}
 const result=updateLevel(record,before);if(result.levelUp)recordLifePath(s,'neighbour','connection',id+':'+record.level);return result;
}
export function completeMeaningfulConversation(s,id,conversationId){
 const record=s?.connections?.[id];if(!record)return {gained:0,record:null,levelUp:false};const before=record.points;
 if(conversationId&&!record.completedConversationIds.includes('conversation:'+conversationId)){record.completedConversationIds.push('conversation:'+conversationId);recordLifePath(s,'neighbour','conversation',id+':'+conversationId);}
 if(record.lastMeaningfulConversationDay!==s.day){record.lastMeaningfulConversationDay=s.day;record.points=Math.min(9999,record.points+CONNECTION_RULES.dailyUsefulConversation);}
 const result=updateLevel(record,before);if(result.levelUp)recordLifePath(s,'neighbour','connection',id+':'+record.level);return result;
}
export function applyConnectionOutcome(s,id,outcome={}){
 const record=s?.connections?.[id];if(!record)return {gained:0,record:null,levelUp:false};const before=record.points;
 if(outcome.remember){const {key,value}=outcome.remember,token='choice:'+key;if(!record.completedConversationIds.includes(token)){record.choices[key]=value;addOnce(record,token,outcome.points??CONNECTION_RULES.thoughtfulChoice);}}
 if(outcome.event){const first=!record.completedConversationIds.includes(outcome.event);addOnce(record,outcome.event,outcome.points??CONNECTION_RULES.personalEvent);if(first&&outcome.dayFlag)record.flags[outcome.dayFlag]=s.day;}
 if(outcome.invitation==='offer'&&!record.invitation)record.invitation={id:SILAS_STORY.invitationId,status:'pending',issuedDay:s.day,dueDay:s.day+1};
 if(outcome.invitation==='attend'&&record.invitation?.status==='pending'){
  record.invitation.status='attended';addOnce(record,'invitation:'+SILAS_STORY.invitationId,CONNECTION_RULES.attendedInvitation);recordLifePath(s,'neighbour','invitation',SILAS_STORY.invitationId);
 }
 if(outcome.promise){record.promise={id:outcome.promise.id,state:outcome.promise.state};if(outcome.promise.state==='kept')addOnce(record,'promise:'+outcome.promise.id,CONNECTION_RULES.keptPromise);}
 if(outcome.flags)for(const [key,value]of Object.entries(outcome.flags))if(CONNECTION_NPCS[id]?.personalFlags.includes(key)&&primitive(value))record.flags[key]=value;
 const result=updateLevel(record,before);if(result.levelUp)recordLifePath(s,'neighbour','connection',id+':'+record.level);return result;
}

export function connectionDescription(s,id){
 const d=CONNECTION_NPCS[id],r=connectionFor(s,id);if(!d)return '';
 if(!r.met)return d.unknown;
 const personal=s.narrative?.personal;
 if(id==='clara'&&personal?.clara?.support)return 'Clara planted her family’s last rare seed and will bring its flowers to Lantern Night.';
 if(id==='niko'&&personal?.niko?.support)return 'Niko and Bruno are rebuilding trust while preparing a table the whole town can share.';
 if(id==='city-nell'&&personal?.nell?.support)return 'Nell trusted the town with an original banner and the meaning you chose together.';
 if(id==='city-walter'&&personal?.walter?.support)return 'Walter told you why Lantern Night ended and promised to speak honestly when it returns.';
 if(id==='city-silas'&&eventComplete(s,id,SILAS_STORY.events.lamp))return "Silas trusted you with the road lamp, Grandfather's memory and a lead pointing to Walter.";
 if(id==='city-silas'&&eventComplete(s,id,SILAS_STORY.events.company))return "Silas protects Grandfather's memory through quiet work and the lamps he keeps.";
 return d.known;
}
export function connectionObjective(s,id){
 const r=connectionFor(s,id);if(!r.met)return 'Meet this resident in town.';
 const personal=s.narrative?.personal;
 if(id==='clara')return personal?.clara?.support?'Flowers / ready for Lantern Night.':personal?.clara?.events?.includes('clara-seed-1')?'Return to the seed stall on a later day.':'Visit the seed stall between 08:00 and 16:00.';
 if(id==='niko')return personal?.niko?.support?'Festival table / ready.':personal?.niko?.events?.includes('niko-table-1')?'Return to the market on a later day.':'Visit the market between 10:00 and 15:00.';
 if(id==='city-nell')return personal?.nell?.support?'Banner / ready for Lantern Night.':personal?.nell?.events?.includes('nell-cloth-1')?'Return to Nell on a later day.':'Visit Nell’s clothing shop during the day.';
 if(id==='city-walter')return personal?.walter?.support?'Truth / Walter will speak publicly.':personal?.walter?.events?.includes('walter-truth-1')?s.narrative?.main?.landmarkVisited?'Return to the quiet bench on a later day.':'Visit the old Forest waystone.':'Speak with Walter after midday.';
 if(id!=='city-silas')return r.promise.state==='pending'?'Promise / '+r.promise.id:'Talk again on another day.';
 if(!eventComplete(s,id,SILAS_STORY.events.clue))return s.story?.conversations?.includes('clue:teo-lantern')?'After 18:00 / meet Silas at the east-road lamp.':'Listen for a clue about Silas and the road lamp.';
 if(!eventComplete(s,id,SILAS_STORY.events.company))return s.day>(r.flags.event1Day||0)?'Find Silas at his quiet City bench.':'Give Silas time. Return on a later day.';
 if(r.invitation?.status==='pending')return s.day<r.invitation.dueDay?'Invitation / east-road lamp tomorrow after 18:00.':'Invitation / east-road lamp this evening after 18:00.';
 if(!eventComplete(s,id,SILAS_STORY.events.lamp))return 'Speak with Silas on a later morning.';
 if(s.narrative?.preparations?.lantern)return 'First lantern / ready for Lantern Night.';
 return 'New lead / Walter may know what Grandfather left unfinished.';
}
