import {LIFE_PATH_ACTIONS,LIFE_PATH_ORDER,LIFE_PATHS} from '../data/lifePaths.js';
import {REGIONS} from '../data/forest.js';
import {forestHabitat} from '../data/forestHabitats.js';
import {allPlots} from './plots.js';

const freshAction=()=>({count:0,keys:[]});
export const freshLifePaths=()=>Object.fromEntries(LIFE_PATH_ORDER.map(id=>[id,{actions:Object.fromEntries(Object.keys(LIFE_PATH_ACTIONS[id]).map(action=>[action,freshAction()]))}]));

function actionRecord(state,path,action){return state?.narrative?.paths?.[path]?.actions?.[action]||null;}
export function recordLifePath(state,path,action,key=null,amount=1){
 const record=actionRecord(state,path,action);if(!record)return false;
 if(key!==null&&key!==undefined){const token=String(key).slice(0,96);if(record.keys.includes(token))return false;record.keys.push(token);return true;}
 const value=Number.isFinite(amount)?Math.max(0,Math.floor(amount)):0;if(!value)return false;record.count=Math.min(9999,record.count+value);return true;
}

export function lifePathScore(state,path){
 const record=state?.narrative?.paths?.[path],rules=LIFE_PATH_ACTIONS[path];if(!record||!rules)return 0;
 return Object.entries(rules).reduce((score,[action,[points,cap]])=>{const r=record.actions[action]||freshAction(),units=r.keys.length+r.count;return score+Math.min(cap,units*points);},0);
}
export function lifePathRank(state,path){
 const score=lifePathScore(state,path),definition=LIFE_PATHS[path];let rank=1;
 definition.thresholds.forEach((threshold,index)=>{if(score>=threshold)rank=index+1;});
 return {id:path,name:definition.name,rank,score,description:definition.description,next:definition.objectives[Math.min(rank-1,definition.objectives.length-1)],threshold:definition.thresholds[Math.min(rank,4)]};
}
export function highestLifePath(state){return LIFE_PATH_ORDER.map(id=>lifePathRank(state,id)).sort((a,b)=>b.rank-a.rank||b.score-a.score||LIFE_PATH_ORDER.indexOf(a.id)-LIFE_PATH_ORDER.indexOf(b.id))[0];}

function restoreAction(target,raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return;
 target.count=Number.isFinite(raw.count)?Math.max(0,Math.min(9999,Math.floor(raw.count))):0;
 target.keys=[...new Set((Array.isArray(raw.keys)?raw.keys:[]).filter(v=>typeof v==='string').map(v=>v.slice(0,96)))].slice(0,256);
}
export function restoreLifePaths(raw,state){
 const result=freshLifePaths();
 for(const path of LIFE_PATH_ORDER)for(const action of Object.keys(result[path].actions))restoreAction(result[path].actions[action],raw?.[path]?.actions?.[action]);
 if(raw&&typeof raw==='object'&&!Array.isArray(raw))return result;
 const shell={...state,narrative:{...(state.narrative||{}),paths:result}};
 const plots=allPlots(state),living=plots.filter(p=>p.crop),watered=living.filter(p=>p.wateredDay>0||p.growth>0);
 result.grower.actions.plant.count=Math.max(result.grower.actions.plant.count,Math.min(6,living.length+(state.story?.stats?.harvests||0)));
 result.grower.actions.care.count=Math.max(result.grower.actions.care.count,Math.min(7,watered.length));
 result.grower.actions.harvest.count=Math.max(result.grower.actions.harvest.count,Math.min(10,state.story?.stats?.harvests||0));
 if(state.hasSoldProduce)recordLifePath(shell,'grower','sell','legacy-produce');
 if((state.inventory?.grilledMeat||0)>0)result.grower.actions.cook.count=Math.max(1,result.grower.actions.cook.count);
 for(const regionId of state.forest?.explored||[]){const region=REGIONS.find(r=>r.id===regionId);if(!region)continue;recordLifePath(shell,'explorer','landmark',region.id);recordLifePath(shell,'explorer','habitat',forestHabitat({x:region.x+region.w/2,y:region.y+region.h/2}).id);}
 const forageEvidence=Math.max(state.forest?.collected?.length||0,state.story?.flags?.includes('fruit')?1:0);
 result.explorer.actions.forage.count=Math.max(result.explorer.actions.forage.count,Math.min(8,forageEvidence));
 for(const id of state.forest?.treasures||[])recordLifePath(shell,'explorer','treasure',id);
 result.explorer.actions.challenge.count=Math.max(result.explorer.actions.challenge.count,Math.min(5,state.story?.stats?.boars||0));
 for(const [id,connection] of Object.entries(state.connections||{})){
  if(connection.met)recordLifePath(shell,'neighbour','meet',id);
  for(const token of connection.completedConversationIds||[])if(token.startsWith('conversation:'))recordLifePath(shell,'neighbour','conversation',id+':'+token);
  if(connection.invitation?.status==='attended')recordLifePath(shell,'neighbour','invitation',connection.invitation.id);
  for(let level=2;level<=(connection.level||1);level++)recordLifePath(shell,'neighbour','connection',id+':'+level);
 }
 return result;
}
