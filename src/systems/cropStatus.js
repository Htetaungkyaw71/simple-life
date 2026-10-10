import {plotAt} from './plots.js';
import {CROPS} from '../data/crops.js';
import {evaluateWatering,missed,wateredToday} from './watering.js';

// Project completed days without mutating the inspected state. Growth occurs at midnight.
export function cropStatus(state,index){
 const original=state?plotAt(state,index):null;if(!original?.crop)return null;
 const def=CROPS[original.crop];if(!def)return null;
 const projected={...state,plots:[{...original}],customBeds:[]};evaluateWatering(projected);
 const p=projected.plots[0],remaining=def.growthDays-p.growth;
 const dead=missed(p)>=4,ready=!dead&&remaining===0,paused=!dead&&!ready&&missed(p)>0;
 const watered=wateredToday(state,p),recovering=!dead&&!ready&&missed(p)===3;
 const care=[{id:'daily',label:ready?'Done':dead?'Closed':watered?'Watered today':'Needs water',watered}];
 const condition=ready?'Ready to harvest':dead?'Dead crop':recovering?'Recovering':paused?'Dry':watered?'Watered today':p.growth===0?'Newly planted':'Growing';
 const need=!dead&&!ready&&!watered?'Needs water':'';
 const timer=dead?'Dead crop - clear the plot':ready?'Ready to harvest':paused?'Growth paused - water this crop':`Harvest: ${remaining} cared-for night${remaining===1?'':'s'}`;
 const next=dead||ready?'':recovering?'Water today before this crop dies':paused?'Water now to resume growth':watered?(remaining===1?'Ready at midnight':'Next stage at midnight'):'Next stage at midnight if watered';
 return {index,name:def.name,icon:def.icon,stage:p.growth+1,stages:def.stageCount,stageName:def.growthStages[p.growth],progress:p.growth/def.growthDays,remaining,condition,need,timer,next,care,paused,dead,ready,recovering,missedDays:missed(p),plantedDay:p.plantedDay??null,plantedMinute:p.plantedMinute??null};
}
