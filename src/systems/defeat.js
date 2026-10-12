import {nextDay} from './time.js';
import {nearestSafe} from '../data/locations.js';
import {safeStash} from './forest.js';
export const droppedCoins=money=>Math.floor(money*.25);
// Atomic persisted defeat: an interrupted fade/reload cannot duplicate a loss.
export function defeat(s){
 if(s.story)s.story.stats.deaths++;
 const coins=droppedCoins(s.money),position={...s.position};
 s.stash=s.area!=='interior'&&coins>0?{...(s.area==='forest'?safeStash(position,s):{area:s.area,...nearestSafe(s.area,position,s)}),...(s.area==='farm'?{farm:s.currentFarm||0}:{}),coins}:null;
 s.money-=coins;s.hasDied=true;
 nextDay(s);s.health=100;
 return coins;
}
