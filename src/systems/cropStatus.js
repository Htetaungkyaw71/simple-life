import {CROPS,WATER_WINDOWS} from '../data/crops.js';
import {evaluateWatering,missed,waterPeriod} from './watering.js';

// Presentation derives from the same window evaluator as ticks/rest/sleep. Never
// mutate the inspected state or run a second countdown. Growth is earned at sleep.
export function cropStatus(state,index){
 const original=state?.plots[index];if(!original?.crop)return null;
 const def=CROPS[original.crop];if(!def)return null;
 const projected={...state,plots:[{...original}]};evaluateWatering(projected);
 const p=projected.plots[0],remaining=def.growthDays-p.growth;
 const dead=missed(p)>=2,ready=!dead&&remaining===0,wilted=!dead&&!ready&&missed(p)>0;
 const period=waterPeriod(state),window=(state.day-1)*2+(period==='evening'?1:0);
 const recovering=!dead&&!ready&&!wilted&&period&&p.recoveredWindow===window;
 const fully=p.morning&&p.evening;
 const care=WATER_WINDOWS.map(w=>({id:w.id,label:p[w.id]?'Watered':ready?'Done':dead?'Closed':state.minute>=w.end?'Missed':state.minute<w.start?'Due later':'Needs water',watered:p[w.id]}));
 let condition=ready?'Ready to harvest':dead?'Dead crop':wilted?'Wilted':recovering?'Recovering':fully?'Fully watered today':period&&p[period]?'Watered for this window':p.growth===0&&!p.morning&&!p.evening?'Newly planted':'Growing';
 const need=!dead&&!ready&&!wilted&&period&&!p[period]?`Needs ${period} water`:'';
 let timer,next;
 if(dead){timer='Dead crop - clear the plot';next='';}
 else if(ready){timer='Ready to harvest';next='';}
 else if(wilted){timer='Growth paused - water this crop';next=period?'Water now to recover':'Recover in the next water window';}
 else {
  timer=`Harvest: ${remaining} cared-for night${remaining===1?'':'s'}`;
  // A missed or skipped morning cannot be repaired in the evening. No growth
  // tonight even after recovery; the next complete care day earns a stage.
  const eligible=p.morning||state.minute<WATER_WINDOWS[0].end;
  next=fully?(remaining===1?'Ready after sleeping':'Next stage after sleeping'):eligible?'Next stage tomorrow if watered':'Next stage after a full care day';
 }
 return {index,name:def.name,icon:def.id,stage:p.growth+1,stages:def.growthDays+1,stageName:def.growthStages[p.growth],progress:p.growth/def.growthDays,remaining,condition,need,timer,next,care,paused:wilted,dead,ready,plantedDay:p.plantedDay??null,plantedMinute:p.plantedMinute??null};
}
