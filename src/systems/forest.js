import {FORAGE_NODES,BOAR_HOME,BOAR_TERRITORY} from '../data/forest.js';
import {FOODS,CLUB} from '../data/items.js';
import {walkable,nearestSafe} from '../data/locations.js';
import {shopOpen} from './market.js';
import {INVENTORY_LIMIT} from './economy.js';

export const freshBoar=()=>({position:{...BOAR_HOME},health:3,defeatedDay:0});
export const freshForest=()=>({forageDay:1,collected:[],boar:freshBoar()});
export function refreshForest(s){
 if(s.forest.forageDay<s.day){s.forest.forageDay=s.day;s.forest.collected=[];}
 if(s.forest.boar.health===0&&s.forest.boar.defeatedDay<s.day)s.forest.boar=freshBoar();
}
export function inTerritory(p){const [x,y,w,h]=BOAR_TERRITORY;return p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;}
export function lineClear(area,a,b,r=0){
 const distance=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(1,Math.ceil(distance/4));
 for(let i=0;i<=steps;i++)if(!walkable(area,a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps,r))return false;
 return true;
}
export function forageAvailable(s,node){return !s.forest.collected.includes(node.id);}
export function collectForage(s,id){
 const node=FORAGE_NODES.find(n=>n.id===id);
 if(!node||s.area!=='forest'||Math.hypot(s.position.x-node.x,s.position.y-node.y)>64||!lineClear('forest',s.position,node))return 'Walk closer to the fruit.';
 if(!forageAvailable(s,node))return 'More fruit tomorrow.';
 if(s.inventory[node.item]>=INVENTORY_LIMIT)return 'Bag is full.';
 s.inventory[node.item]++;s.forest.collected.push(id);
 return 'Collected '+FOODS[node.item].name+'.';
}
export function eatFood(s,id){
 const food=FOODS[id];if(!food||!s.inventory[id])return 'No fruit in your bag.';
 if(s.energy>=100)return 'Energy is already full.';
 const gain=Math.min(food.energyRestored,100-s.energy);s.inventory[id]--;s.energy+=gain;
 return '+'+gain+' energy / '+food.name;
}
export function buyClub(s){
 if(!shopOpen(s,'outfitter'))return 'Closed / 07:00-20:00';
 if(s.ownsClub)return 'Wooden Club already owned.';
 if(s.money<CLUB.price)return 'Need 45 coins.';
 s.money-=CLUB.price;s.ownsClub=true;s.clubEquipped=true;return 'Wooden Club equipped. Space / K to attack.';
}
export function equipClub(s){if(!s.ownsClub)return 'Buy a club at the City Outfitter.';s.clubEquipped=true;return 'Wooden Club equipped.';}
export function recoverStash(s){
 const bag=s.stash;if(!bag||s.area!==bag.area||Math.hypot(s.position.x-bag.x,s.position.y-bag.y)>64||!lineClear(s.area,s.position,bag))return 'Walk closer to your Stash Bag.';
 if(s.money+bag.coins>9999999)return 'Coin purse full.';
 s.money+=bag.coins;s.stash=null;return 'Recovered '+bag.coins+' coins';
}
export function safeStash(position){const p=nearestSafe('forest',position);return {area:'forest',...p};}
