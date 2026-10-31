import {recordStory} from './story.js';
import {plotAt,allPlots,replacePlot} from './plots.js';
import {FARM_ENERGY} from '../data/energy.js';
import {plotOwned} from './expansion.js';
import {CROPS} from '../data/crops.js';
import {emptyPlot} from './state.js';
import {wateredToday,completedDay,evaluateWatering,missed} from './watering.js';
import {recordLifePath} from './lifePaths.js';
export {waterPeriod} from './watering.js';
export function usePlot(s,index,{waterCost=FARM_ENERGY.water}={}){
 if(!plotOwned(s,index))return 'Dig with the shovel first.';
 evaluateWatering(s);
 const p=plotAt(s,index);if(!p)return 'Choose a farm plot';
 if(missed(p)>=4){replacePlot(s,index,emptyPlot());return 'Dead crop cleared';}
 const crop=Object.hasOwn(CROPS,s.selectedCrop)?s.selectedCrop:'tomato',def=CROPS[p.crop||crop];
 if(s.selected==='seed'){
  if(p.crop)return 'Already planted';if(!s.inventory[def.seedKey])return 'No seeds';if(s.energy<FARM_ENERGY.plant)return 'Too tired - rest at home';
  s.hasVisitedFarm=true;s.energy-=FARM_ENERGY.plant;s.inventory[def.seedKey]--;p.crop=crop;recordStory(s,'plant');recordLifePath(s,'grower','plant');p.plantedDay=s.day;p.plantedMinute=Math.floor(s.minute);p.lastEvaluatedDay=completedDay(s);return def.name+' planted';
 }
 if(!p.crop)return 'Select a seed';
 if(s.selected==='water'){
  if(p.growth>=def.growthDays)return 'Ready to harvest';
  if(wateredToday(s,p))return 'Already watered today';if(s.energy<waterCost)return 'Too tired - rest at home';
  if(missed(p))p.recoveredDay=s.day;
  s.energy-=waterCost;p.wateredDay=s.day;recordStory(s,'water');recordLifePath(s,'grower','care');p.missedDays=0;return 'Watered';
 }
 if(p.growth<def.growthDays)return missed(p)?'Growth paused - needs water':'Still growing';
 if(s.energy<FARM_ENERGY.harvest)return 'Too tired - rest at home';if((s.inventory[def.produceKey]||0)>9999-def.harvestYield)return 'Produce bag full';
 s.energy-=FARM_ENERGY.harvest;s.inventory[def.produceKey]=(s.inventory[def.produceKey]||0)+def.harvestYield;s.hasHarvestedFirstCrop=true;recordStory(s,'harvest');recordLifePath(s,'grower','harvest');if(s.story)s.story.stats.harvests++; replacePlot(s,index,emptyPlot());return def.name+' harvested';
}
export function growOvernight(s){
 const eligible=new Set(allPlots(s).filter(p=>p.crop&&(p.lastEvaluatedDay??0)<s.day&&wateredToday(s,p)));
 evaluateWatering(s,s.day);
 for(const p of allPlots(s)){
  if(!p.crop||missed(p)>=4||p.growth>=CROPS[p.crop].growthDays)continue;
  if(eligible.has(p))p.growth++;
 }
}
