import {CROPS} from '../data/crops.js';
import {emptyPlot} from './state.js';
import {waterPeriod,completedWindow,evaluateWatering,missed} from './watering.js';
export {waterPeriod} from './watering.js';
export function usePlot(s,index){
 evaluateWatering(s);
 const p=s.plots[index];if(!p)return 'Choose a farm plot';
 if(missed(p)>=2){s.plots[index]=emptyPlot();return 'Dead crop cleared';}
 const def=CROPS[p.crop||'tomato'];
 if(s.selected==='seed'){
  if(p.crop)return 'Already planted';if(!s.inventory.seed)return 'No seeds';if(s.energy<5)return 'Too tired - rest at home';
  s.hasVisitedFarm=true;s.energy-=5;s.inventory.seed--;p.crop='tomato';p.plantedDay=s.day;p.plantedMinute=Math.floor(s.minute);p.lastEvaluatedWindow=completedWindow(s);return 'Tomato planted';
 }
 if(!p.crop)return 'Select a seed';
 if(s.selected==='water'){
  if(p.growth>=def.growthDays)return 'Ready to harvest';const period=waterPeriod(s);
  if(!period)return 'Water at 06-12 or 16-22';if(p[period])return 'Already watered';if(s.energy<3)return 'Too tired - rest at home';
  if(missed(p))p.recoveredWindow=(s.day-1)*2+(period==='evening'?1:0);
  s.energy-=3;p[period]=true;p.missedWindows=0;p.dryDays=0;return 'Watered';
 }
 if(p.growth<def.growthDays)return missed(p)?'Wilted - needs water':'Still growing';
 if(s.energy<4)return 'Too tired - rest at home';if(s.inventory.tomato>9999-def.harvestYield)return 'Produce bag full';
 s.energy-=4;s.inventory.tomato+=def.harvestYield;s.plots[index]=emptyPlot();return 'Tomatoes harvested';
}
export function growOvernight(s){
 evaluateWatering(s,(s.day-1)*2+1);
 for(const p of s.plots){
  if(!p.crop||missed(p)>=2||p.growth>=CROPS[p.crop].growthDays)continue;
  if(p.morning&&p.evening)p.growth++;
  p.morning=false;p.evening=false;
 }
}
