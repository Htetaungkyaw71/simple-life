import {dryGround} from './farmGround.js';
import {refreshForest} from './forest.js';
import {evaluateWatering} from './watering.js';
import {ROOM} from '../data/interior.js';
import {DAY_SECONDS} from '../config.js';
import {growOvernight} from './farming.js';
import {FATIGUE_MINUTES} from '../data/energy.js';
export {FATIGUE_MINUTES};
export const MORNING=360, NIGHT=1200;
export const isNight=s=>s.minute<MORNING||s.minute>=NIGHT;
// Each crossed midnight settles care/growth once, awake or asleep.
function advanceMinutes(s,minutes){
 if(minutes>=15)s.wetGround=[];
 s.minute+=minutes;
 while(s.minute>=1440){growOvernight(s);s.day++;s.minute-=1440;refreshForest(s);}
 evaluateWatering(s);
}
function rested(s){s.energy=100;s.fatigueMinutes=0;s.area='interior';s.position={x:ROOM.bed.x,y:ROOM.bed.y+16};}
export function wakeTime(s){return isNight(s)?MORNING:NIGHT;}
export function sleep(s){const wake=wakeTime(s);advanceMinutes(s,(wake-s.minute+1440)%1440);rested(s);}
// Retained explicit skips used by the established pure farming tests.
export function nextDay(s){advanceMinutes(s,1440-s.minute+MORNING);rested(s);}
export function restUntilEvening(s){if(s.minute<960)advanceMinutes(s,960-s.minute);}
export function tick(s,delta){
 dryGround(s,delta);
 const minutes=Math.max(0,Math.min(delta,100))/1000*1080/DAY_SECONDS;
 // Legacy saves retain this field, but elapsed time never spends energy.
 s.fatigueMinutes=0;
 advanceMinutes(s,minutes);
}
export function phase(s){return isNight(s)?'Night':s.minute<720?'Morning':s.minute<1080?'Afternoon':'Evening';}
export function clock(s){const m=Math.floor(s.minute);return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
const blend=(a,b,t)=>[16,8,0].reduce((color,shift)=>color|(Math.round(((a>>>shift)&255)*(1-t)+((b>>>shift)&255)*t)<<shift),0);
// Faint blue moonlight across the whole world; no player halo or lamp lighting.
export function daylight(s){
 const m=s.minute;
 if(m<300||m>=NIGHT)return {alpha:.78,color:0x071221};
 if(m<420)return {alpha:.78*(420-m)/120,color:blend(0x071221,0xb98a69,(m-300)/120)};
 if(m<1020)return {alpha:0,color:0x18243a};
 if(m<1080)return {alpha:.12*(m-1020)/60,color:0x9e542e};
 const t=(m-1080)/120;
 return {alpha:.12+.66*t,color:blend(0x9e542e,0x071221,t)};
}
