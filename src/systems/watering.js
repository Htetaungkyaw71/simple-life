import {allPlots} from './plots.js';
import {CROPS} from '../data/crops.js';
export const waterPeriod=()=> 'daily';
export const completedDay=s=>s.day-1;
export const wateringLabel=()=> 'WATER ONCE DAILY';
export const missed=p=>p.missedDays??0;
export const wateredToday=(s,p)=>p.wateredDay===s.day;
// Only completed calendar days count. The saved cursor prevents duplicate expiry.
export function evaluateWatering(s,through=completedDay(s)){
 let changed=false;
 for(const p of allPlots(s)){
  if(!p.crop||p.growth>=CROPS[p.crop].growthDays||missed(p)>=4)continue;
  const start=p.lastEvaluatedDay??Math.max(0,(p.plantedDay??s.day)-1);
  for(let day=start+1;day<=through;day++){
   p.missedDays=p.wateredDay===day?0:Math.min(4,missed(p)+1);p.lastEvaluatedDay=day;changed=true;
   if(p.missedDays>=4)break;
  }
 }
 return changed;
}
export function cropVisual(p,s){
 if(!p?.crop)return null;
 if(missed(p)>=4)return 'dead';
 if(p.growth>=CROPS[p.crop].growthDays)return 'ripe';
 if(missed(p)>=3)return 'wilted';
 const watered=wateredToday(s,p);
 if((p.growth>0||missed(p)>0)&&!watered)return 'dry';
 return p.growth/CROPS[p.crop].growthDays>=.6?'flowering':p.growth>0?'young':watered?'sprout':'seed';
}
