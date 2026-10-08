import {plotAt,allPlots,replacePlot} from './plots.js';
import {plotOwned} from './expansion.js';
import {CROPS} from '../data/crops.js';
import {emptyPlot} from './state.js';
import {waterPeriod,completedWindow,evaluateWatering,missed} from './watering.js';
export {waterPeriod} from './watering.js';
export function usePlot(s,index){
 if(!plotOwned(s,index))return 'Dig with the shovel first.';
 evaluateWatering(s);
 const p=plotAt(s,index);if(!p)return 'Choose a farm plot';
 if(missed(p)>=2){replacePlot(s,index,emptyPlot());return 'Dead crop cleared';}
 const crop=Object.hasOwn(CROPS,s.selectedCrop)?s.selectedCrop:'tomato',def=CROPS[p.crop||crop];
 if(s.selected==='seed'){
  if(p.crop)return 'Already planted';if(!s.inventory[def.seedKey])return 'No seeds';if(s.energy<5)return 'Too tired - rest at home';
  s.hasVisitedFarm=true;s.energy-=5;s.inventory[def.seedKey]--;p.crop=crop;p.plantedDay=s.day;p.plantedMinute=Math.floor(s.minute);p.lastEvaluatedWindow=completedWindow(s);return def.name+' planted';
 }
 if(!p.crop)return 'Select a seed';
 if(s.selected==='water'){
  if(p.growth>=def.growthDays)return 'Ready to harvest';const period=waterPeriod(s);
  if(!period)return 'Water at 06-12 or 16-22';if(p[period])return 'Already watered';if(s.energy<3)return 'Too tired - rest at home';
  if(missed(p))p.recoveredWindow=(s.day-1)*2+(period==='evening'?1:0);
  s.energy-=3;p[period]=true;p.missedWindows=0;p.dryDays=0;return 'Watered';
 }
 if(p.growth<def.growthDays)return missed(p)?'Wilted - needs water':'Still growing';
 if(s.energy<4)return 'Too tired - rest at home';if((s.inventory[def.produceKey]||0)>9999-def.harvestYield)return 'Produce bag full';
 s.energy-=4;s.inventory[def.produceKey]=(s.inventory[def.produceKey]||0)+def.harvestYield;s.hasHarvestedFirstCrop=true;replacePlot(s,index,emptyPlot());return def.name+' harvested';
}
export function growOvernight(s){
 evaluateWatering(s,(s.day-1)*2+1);
 for(const p of allPlots(s)){
  if(!p.crop||missed(p)>=2||p.growth>=CROPS[p.crop].growthDays)continue;
  if(p.morning&&p.evening)p.growth++;
  p.morning=false;p.evening=false;
 }
}
