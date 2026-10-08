import {allPlots} from './plots.js';
import {WATER_WINDOWS,CROPS} from '../data/crops.js';
export const waterPeriod=s=>WATER_WINDOWS.find(w=>s.minute>=w.start&&s.minute<w.end)?.id||null;
export const completedWindow=s=>(s.day-1)*2+(s.minute>=1320?1:s.minute>=720?0:-1);
export const wateringLabel=s=>waterPeriod(s)==='morning'?'WATER AM 06-12':waterPeriod(s)==='evening'?'WATER PM 16-22':s.minute<360?'NEXT WATER 06:00':s.minute<960?'NEXT WATER 16:00':'NEXT WATER 06:00';
export const missed=p=>p.missedWindows??p.dryDays??0;
// Cursor makes window expiry idempotent across ticks, sleeping, reloads and time skips.
export function evaluateWatering(s,through=completedWindow(s)){
 let changed=false;
 for(const p of allPlots(s)){
  if(!p.crop||p.growth>=CROPS[p.crop].growthDays||missed(p)>=2)continue;
  const start=p.lastEvaluatedWindow??(s.day-1)*2-1;
  for(let window=start+1;window<=through;window++){
   const watered=window%2===0?p.morning:p.evening;
   p.missedWindows=watered?0:Math.min(2,missed(p)+1);p.dryDays=p.missedWindows;p.lastEvaluatedWindow=window;changed=true;
   if(p.missedWindows>=2)break;
  }
 }
 return changed;
}
export function cropVisual(p,s){
 if(!p?.crop)return null;
 if(missed(p)>=2)return 'dead';
 if(missed(p)===1)return 'wilted';
 if(p.growth>=CROPS[p.crop].growthDays)return 'ripe';
 const period=waterPeriod(s),watered=period?p[period]:s.minute<960?p.morning:p.evening;
 if(p.growth>0&&!watered)return 'dry';
 return p.growth/CROPS[p.crop].growthDays>=.6?'flowering':p.growth>0?'young':p.morning||p.evening?'sprout':'seed';
}
