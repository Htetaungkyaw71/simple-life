import {HOUSE} from '../data/geometry.js';
import {MAPS} from '../data/mapLayouts.js';
import {SHOP_ROOMS} from '../data/cityShops.js';
import {MERCHANT_RESIDENTS,RESIDENTS} from '../data/residents.js';
import {scheduleDefinition,schedulePattern,schedulePlace,scheduleSlots} from '../data/residentSchedules.js';
import {connectionFor,eventComplete} from './connections.js';
import {commutePath,pathLength,pathPose,NPC_HOME_MINUTE,NPC_WALK_SPEED} from './commute.js';
import {DAY_SECONDS} from '../config.js';
import {SILAS_STORY} from '../data/connections.js';
import {PERSONAL_SCHEDULE_CHANGES} from '../data/personalStories.js';

const CITY_RESIDENTS=[...(RESIDENTS.city||[]),...MERCHANT_RESIDENTS];
export const residentDefinition=id=>CITY_RESIDENTS.find(n=>n.id===id)||null;

function homeAnchors(definition){
 const building=MAPS.city.buildings[definition.home],fallback=building.name==='house-village-0';
 const door=building.entry||(fallback?{x:HOUSE.door.x,y:building.y+256}:{x:building.x+120,y:building.y+170});
 const porch=building.porch||(fallback?{...HOUSE.porch}:{x:building.x+120,y:building.y+234});
 return {door,porch};
}
function resolvedPlace(value){
 const p=schedulePlace(value);if(!p)return null;
 const room=SHOP_ROOMS[p.area];return {...p,outdoor:room?{...room.outside}:null};
}
const cityPoint=place=>place?.area==='city'?{x:place.x,y:place.y}:place?.outdoor;
function activity(slot,pattern){
 const location=resolvedPlace(slot.location);
 return {...slot,location,pattern,area:location.area,service:slot.service===true,meeting:slot.meeting||null};
}
function overlaySlots(base,overlays=[]){
 let result=base.map(row=>({...row}));
 for(const overlay of overlays){result=result.flatMap(row=>{if(row.end<=overlay.start||row.start>=overlay.end)return [row];const pieces=[];if(row.start<overlay.start)pieces.push({...row,id:row.id+'-before',end:overlay.start});if(row.end>overlay.end)pieces.push({...row,id:row.id+'-after',start:overlay.end});return pieces;});result.push({...overlay});}
 return result.sort((a,b)=>a.start-b.start||a.end-b.end);
}
function storySlots(state,id,base){
 let result=base;
 for(const [key,change] of Object.entries(PERSONAL_SCHEDULE_CHANGES)){if(state.narrative?.personal?.[key]?.support!==change.support)continue;result=overlaySlots(result,change.residents[id]);}
 return result;
}
function travelPose(from,to,minute,start,end){
 const a=cityPoint(from),b=cityPoint(to);if(!a||!b)return {position:{...(b||a)},direction:'down',visible:false,moving:false};
 try{
  const route=commutePath('city',a,b),distance=pathLength(route),progress=end<=start?distance:(minute-start)/(end-start)*distance;
  return {...pathPose(route,progress),visible:true,moving:true};
 }catch{return {position:{...b},direction:'down',visible:false,moving:false};}
}

// Ordinary resident state is a pure projection of day, minute and authored
// slots. Only Connection/story facts are saved; routes and animation stay local.
export function resolveResidentSchedule(state,id){
 const definition=residentDefinition(id),schedule=scheduleDefinition(id);if(!definition||!schedule)return null;
 const minute=Number.isFinite(state.minute)?state.minute:360,pattern=schedulePattern(state.day),slots=storySlots(state,id,scheduleSlots(id,state.day)).map(row=>activity(row,pattern)),home=homeAnchors(definition);
 if(minute<schedule.firstAppearance)return {id,definition,schedule,pattern,phase:'home',activity:null,position:{...home.door},direction:'up',visible:false,moving:false,area:'home'};
 const current=slots.find(row=>minute>=row.start&&minute<row.end);
 if(current){
  const p=current.location,position=p.area==='city'?{x:p.x,y:p.y}:{...(p.outdoor||p)};
  return {id,definition,schedule,pattern,phase:current.service?'work':'activity',activity:current,position,direction:p.direction||'down',visible:p.area==='city',moving:false,sitting:!!p.sitting,area:p.area,serviceActive:current.service};
 }
 const next=slots.find(row=>minute<row.start),previous=[...slots].reverse().find(row=>minute>=row.end);
 if(!next&&minute<NPC_HOME_MINUTE&&previous){
  const p=previous.location,position=p.area==='city'?{x:p.x,y:p.y}:{...(p.outdoor||p)};
  return {id,definition,schedule,pattern,phase:'activity',activity:previous,position,direction:p.direction||'down',visible:p.area==='city',moving:false,sitting:false,area:p.area,serviceActive:false};
 }
 const start=next?(previous?.end??schedule.firstAppearance):NPC_HOME_MINUTE,from=previous?.location??{area:'city',...home.porch},to=next?.location??{area:'city',...home.door};
 let end=next?.start??NPC_HOME_MINUTE;
 if(!next){
  const a=cityPoint(from),b=cityPoint(to);let duration=1;
  try{duration=Math.max(1,pathLength(commutePath('city',a,b))/NPC_WALK_SPEED*(1080/DAY_SECONDS));}catch{}
  end=start+duration;
  if(minute>=end)return {id,definition,schedule,pattern,phase:'home',activity:null,position:{...home.door},direction:'up',visible:false,moving:false,area:'home'};
 }
 const pose=travelPose(from,to,minute,start,end);
 return {id,definition,schedule,pattern,phase:next?'toActivity':'toHome',activity:{id:next?'travel-'+next.id:'return-home',dialogueGroup:'travel',pattern,meeting:null,service:false,location:to},...pose,sitting:false,area:'city',serviceActive:false};
}

export function residentScheduleHint(state,id){
 const schedule=scheduleDefinition(id);if(!schedule)return '';
 if(id==='city-silas'){
  const record=connectionFor(state,id),teo=state.story?.conversations?.includes('clue:teo-lantern');
  if(record.invitation?.status==='pending'&&!eventComplete(state,id,SILAS_STORY.events.lamp))return state.day>=record.invitation.dueDay?'At the east-road lamp this evening.':'Expected at the east-road lamp tomorrow evening.';
  if(teo&&!eventComplete(state,id,SILAS_STORY.events.clue))return 'Checks the east-road lamp after 18:00.';
 }
 return schedule.journalHints?.[schedulePattern(state.day)]||schedule.journalHints?.normal||'';
}

export function residentScheduleSnapshot(state,id){
 const r=resolveResidentSchedule(state,id);if(!r)return null;
 return {id,pattern:r.pattern,phase:r.phase,activity:r.activity?.id||'home',dialogueGroup:r.activity?.dialogueGroup||null,meeting:r.activity?.meeting||null,area:r.area,position:{...r.position},visible:r.visible,serviceActive:r.serviceActive};
}
