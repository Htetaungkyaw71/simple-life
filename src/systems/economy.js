import {recordStory} from './story.js';
import {CROPS,SALE_ITEMS} from '../data/crops.js';
import {marketPrice} from './market.js';
import {recordLifePath} from './lifePaths.js';
export const INVENTORY_LIMIT=9999,COIN_LIMIT=9999999;
export const affordableSeeds=(s,id)=>CROPS[id]?Math.max(0,Math.min(INVENTORY_LIMIT-(s.inventory[CROPS[id].seedKey]||0),Math.floor(s.money/CROPS[id].seedPrice))):0;
export function quote(s,type,id,quantity){
 const catalog=type==='seed'?CROPS:SALE_ITEMS,d=Object.hasOwn(catalog,id)?catalog[id]:null;if(!d||!['seed','sell'].includes(type))return {ok:false,reason:'Unknown crop',quantity:0,total:0};
 const owned=s.inventory[type==='seed'?d.seedKey:id]||0;
 const emptyProduceReason=Object.keys(SALE_ITEMS).some(key=>s.inventory[key]>0)?`No ${d.name} to sell.`:'You have no produce to sell.';
 const max=type==='seed'?affordableSeeds(s,id):Math.min(owned,Math.floor((COIN_LIMIT-s.money)/marketPrice(s,id).price));
 const count=quantity==='max'||quantity==='all'?max:quantity;
 if(!Number.isInteger(count)||count<1)return {ok:false,reason:type==='seed'?(owned>=INVENTORY_LIMIT?'Inventory full':'Not enough coins'):owned?'Coin purse full':emptyProduceReason,quantity:0,total:0};
 const unit=type==='seed'?d.seedPrice:marketPrice(s,id).price,total=unit*count;
 const reason=type==='seed'?owned+count>INVENTORY_LIMIT?'Inventory full':total>s.money?'Not enough coins':null:count>owned?(owned?'Not enough produce':emptyProduceReason):s.money+total>COIN_LIMIT?'Coin purse full':null;
 return {ok:!reason,reason,quantity:count,unit,total,owned};
}
export function buySeeds(s,id='tomato',quantity=1){
 const q=quote(s,'seed',id,quantity);if(!q.ok)return q.reason;
 s.money-=q.total;s.inventory[CROPS[id].seedKey]=(s.inventory[CROPS[id].seedKey]||0)+q.quantity;s.hasBoughtSeeds=true;
 return `Bought ${q.quantity} ${CROPS[id].name} seeds for ${q.total} coins.`;
}
export function sellCrop(s,id='tomato',quantity='all'){
 const q=quote(s,'sell',id,quantity);if(!q.ok)return q.reason;
 s.inventory[id]-=q.quantity;s.money+=q.total;s.sold+=q.quantity;s.hasSoldProduce=true;if(Object.hasOwn(CROPS,id)){recordStory(s,'sell');recordLifePath(s,'grower','sell',id);if(s.story)s.story.stats.sales+=q.quantity;}
 return `Sold ${q.quantity} ${SALE_ITEMS[id].name} for ${q.total} coins.`;
}
// Existing Farm board entry points continue to share the same safe transactions/prices.
export const buySeed=s=>buySeeds(s,'tomato',1);
export const sellProduce=s=>sellCrop(s,'tomato','all');
