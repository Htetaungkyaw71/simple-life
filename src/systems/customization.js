import {HOMES,CUSTOMIZE_AREAS} from '../data/homes.js';
import {DECORATIONS} from '../data/settlement.js';
export const customizationAvailable=s=>CUSTOMIZE_AREAS.includes(s?.area);
export function houseQuote(s,id){const d=Object.hasOwn(HOMES,id)?HOMES[id]:null,owned=s.home.owned.includes(id);return {ok:!!d&&['home','interior'].includes(s.area)&&(owned||Number.isInteger(s.money)&&s.money>=d.price),owned,price:owned?0:d?.price};}
export function buyHouse(s,id){const q=houseQuote(s,id);if(!q.ok)return 'Visit Home / need more coins';if(!q.owned){s.money-=q.price;s.home.owned.push(id);}s.home.design=id;return HOMES[id].name+' selected'+(q.price?' / -'+q.price+'c':'');}
export function decorQuote(s,id){const d=Object.hasOwn(DECORATIONS,id)?DECORATIONS[id]:null;return {ok:!!d&&!d.cost&&Number.isInteger(d.price)&&customizationAvailable(s)&&Number.isInteger(s.money)&&s.money>=d.price&&Number.isInteger(s.inventory[d.item])&&s.inventory[d.item]+s.settlement.decorations.filter(p=>p.type===id).length<9999,price:d?.price};}
export function buyDecoration(s,id){const q=decorQuote(s,id);if(!q.ok)return 'Need more coins or Bag space';const d=Object.hasOwn(DECORATIONS,id)?DECORATIONS[id]:null;s.money-=q.price;s.inventory[d.item]++;return d.name+' bought / -'+q.price+'c / Bag Gear';}
export const decorationAllowed=(area,type)=>!!DECORATIONS[type]&&CUSTOMIZE_AREAS.includes(area)&&(area!=='interior'||!DECORATIONS[type].outdoors);
