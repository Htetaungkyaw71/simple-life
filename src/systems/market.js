import {CROPS,CROP_IDS} from '../data/crops.js';
export const SHOP_HOURS={seed:{open:420,close:1200,label:'07:00-20:00'},sell:{open:420,close:1260,label:'07:00-21:00'}};
export const shopOpen=(s,type)=>s.minute>=SHOP_HOURS[type].open&&s.minute<SHOP_HOURS[type].close;
// Integer hash: the day, persistent seed and crop all contribute; no runtime random rolls.
export function marketPrice(s,id){
 const crop=CROPS[id];if(!crop)return null;
 let hash=(s.marketSeed^Math.imul(s.day,0x9e3779b1)^Math.imul(CROP_IDS.indexOf(id)+1,0x85ebca6b))>>>0;
 hash=Math.imul(hash^(hash>>>16),0x7feb352d)>>>0;hash=Math.imul(hash^(hash>>>15),0x846ca68b)>>>0;hash=(hash^(hash>>>16))>>>0;
 const percent=85+hash%36,price=Math.max(1,Math.round(crop.sellPrice*percent/100));
 return {price,percent,label:percent<95?'Low':percent>105?'High':'Normal'};
}
export const dailyPrices=s=>Object.fromEntries(CROP_IDS.map(id=>[id,marketPrice(s,id)]));
