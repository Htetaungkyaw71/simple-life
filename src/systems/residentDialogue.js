import {SCHEDULE_DIALOGUE} from '../data/residentScheduleDialogue.js';
import {connectionFor,eventComplete} from './connections.js';
import {resolveResidentSchedule} from './residentSchedules.js';
import {SILAS_STORY} from '../data/connections.js';

const hash=value=>[...value].reduce((n,c)=>(n*33+c.charCodeAt(0))>>>0,5381);
const oneNode=(speaker,portrait,text,closeLabel)=>({start:'context',nodes:{context:{speaker,portrait,text,end:true,closeLabel}}});
function storyContext(state,id){
 if(id==='city-teo'&&eventComplete(state,'city-silas',SILAS_STORY.events.lamp))return 'The east-road lamp shone again. Luca stopped our race to look at it.';
 if(id==='city-teo'&&state.story?.conversations?.includes('clue:teo-lantern'))return 'The wooden bird is safe. Silas still checks the east-road lamp after 18:00.';
 if(id==='city-walter'&&connectionFor(state,'city-silas').flags.walterLeadUnlocked)return 'Silas mentioned the brass star. I remember the carving, but that story can wait until I am ready.';
 return null;
}

export function contextualResidentDialogue(state,id){
 const resolved=resolveResidentSchedule(state,id),record=connectionFor(state,id),group=resolved?.activity?.dialogueGroup,data=SCHEDULE_DIALOGUE[id]?.[group];
 if(!resolved||!data)return null;
 const already=record.lastMeaningfulConversationDay===state.day,personal=storyContext(state,id),pool=already?data.again:data.fresh;
 const timeBand=state.minute<720?0:state.minute<1080?1:2;
 let selected=personal||pool[(state.day+record.level+timeBand+hash(id+':'+group))%pool.length];
 if(resolved.activity?.meeting&&!personal&&!already)selected=pool[(state.day+hash(resolved.activity.meeting))%pool.length];
 return {branch:'schedule-'+group+(already?'-again':''),dialogue:oneNode(resolved.definition.name,id,selected,data.close)};
}
