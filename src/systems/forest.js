import {FORAGE_NODES,BOAR_HOME,BOAR_TERRITORY,TREASURES} from '../data/forest.js';
import {ANIMAL_SPAWNS,SPECIES} from '../data/wildlife.js';
import {FOODS,CLUB} from '../data/items.js';
import {walkable,nearestSafe} from '../data/locations.js';
import {shopOpen} from './market.js';
import {INVENTORY_LIMIT} from './economy.js';

export const freshBoar=()=>({position:{...BOAR_HOME},health:3,defeatedDay:0});
export const freshAnimal=a=>({id:a.id,species:a.species,position:{...a.home},health:SPECIES[a.species].health,defeatedDay:0});
export const freshForest=()=>{const animals=Object.fromEntries(ANIMAL_SPAWNS.map(a=>[a.id,freshAnimal(a)]));return {forageDay:1,collected:[],animals,boar:animals['boar-original'],explored:['entrance'],treasures:[]};};
export function refreshForest(s){
 if(s.forest.forageDay<s.day){s.forest.forageDay=s.day;s.forest.collected=[];}
 for(const a of ANIMAL_SPAWNS){const old=s.forest.animals[a.id];if(old.health===0&&old.defeatedDay<s.day)s.forest.animals[a.id]=freshAnimal(a);}
 s.forest.boar=s.forest.animals['boar-original'];
}
export function inTerritory(p,territory=BOAR_TERRITORY){const [x,y,w,h]=territory;return p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h;}
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

export function treasureAvailable(s,t){return !s.forest.treasures.includes(t.id);}
export function recoverTreasure(s,id){
 const t=TREASURES.find(t=>t.id===id);
 if(!t||s.area!=='forest'||Math.hypot(s.position.x-t.x,s.position.y-t.y)>64||!lineClear('forest',s.position,t))return 'Search closer to the chest.';
 if(!treasureAvailable(s,t))return 'This treasure has been recovered.';
 const guard=Object.values(s.forest.animals).find(a=>a.health>0&&Math.hypot(a.position.x-t.x,a.position.y-t.y)<240);
 if(guard)return 'Danger nearby / drive the animals away first.';
 if(s.money+t.coins>9999999)return 'Coin purse full.';
 s.money+=t.coins;s.forest.treasures.push(id);return 'Treasure recovered / '+t.coins+' coins!';
}
