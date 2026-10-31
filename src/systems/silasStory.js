import {SILAS_STORY} from '../data/connections.js';
import {connectionFor,eventComplete} from './connections.js';

const within=(minute,range)=>minute>=range[0]&&minute<range[1];
export function silasResidentStoryPose(state,resident){
 if(resident.id!=='city-silas'||state.area!=='city')return null;
 const record=connectionFor(state,'city-silas'),teo=state.story?.conversations?.includes('clue:teo-lantern');
 const clueReady=teo&&!eventComplete(state,'city-silas',SILAS_STORY.events.clue);
 const meetingReady=record.invitation?.status==='pending'&&state.day>=record.invitation.dueDay&&!eventComplete(state,'city-silas',SILAS_STORY.events.lamp);
 const personal=state.narrative?.personal,festivalReady=['clara','niko','nell','walter'].every(key=>personal?.[key]?.support)&&!state.narrative?.preparations?.lantern;
 if((clueReady||meetingReady||festivalReady)&&within(state.minute,SILAS_STORY.evening))return {position:{x:SILAS_STORY.eastLamp.x,y:SILAS_STORY.eastLamp.y},direction:'left',visible:true,moving:false,sitting:false,mode:'story'};
 return null;
}
