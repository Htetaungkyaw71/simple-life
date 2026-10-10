import {ORDERS,PROJECTS,DECORATIONS,DECORATION_DIRECTIONS,STOVE_COST,GRILL_COST,MAX_DECORATIONS} from '../data/settlement.js';
import {MAPS,MAP_SIZE} from '../data/mapLayouts.js';
import {CROPS} from '../data/crops.js';
import {dryFootprint} from '../data/water.js';
import {cutObstacle} from '../data/vegetation.js';
import {visiblePlots} from './expansion.js';
import {farmDecorations,decorationRect,overlaps} from './settlementGeometry.js';
import {lineClear} from './forest.js';
const reachableDecoration=(s,d)=>lineClear('farm',s.position,d,0,{...s,settlement:{...s.settlement,decorations:s.settlement.decorations.filter(n=>n!==d)}});
const validId=(catalog,id)=>Object.hasOwn(catalog,id)?catalog[id]:null;
export function materials(s,cost){return Object.entries(cost).every(([id,n])=>Number.isInteger(s.inventory[id])&&s.inventory[id]>=n);}
const spend=(s,cost)=>{for(const [id,n]of Object.entries(cost))s.inventory[id]-=n;};
export const materialLabel=cost=>Object.entries(cost).map(([id,n])=>n+' '+(id==='meat'?'Meat':id==='stone'?'Stone':'Wood')).join(' / ');
export function dailyOrders(s){const start=((s.marketSeed>>>0)+s.day-1)%ORDERS.length;return Array.from({length:3},(_,i)=>ORDERS[(start+i)%ORDERS.length]);}
export const orderComplete=(s,id)=>s.settlement.orders.day===s.day&&s.settlement.orders.completed.includes(id);
const rewardRoom=(s,d)=>s.money+d.coins<=9999999&&(s.inventory[d.seed]||0)+d.seeds<=9999;
const reward=(s,d)=>{s.money+=d.coins;s.inventory[d.seed]+=d.seeds;};
export function orderQuote(s,id){const d=dailyOrders(s).find(o=>o.id===id);return {ok:!!d&&s.area==='city'&&!orderComplete(s,id)&&materials(s,d.cost)&&rewardRoom(s,d),definition:d};}
export function deliverOrder(s,id){const {ok,definition:d}=orderQuote(s,id);if(!ok)return 'Order unavailable / check materials and bag space';spend(s,d.cost);reward(s,d);if(s.settlement.orders.day!==s.day)s.settlement.orders={day:s.day,completed:[]};s.settlement.orders.completed.push(id);return d.name+' thanks you / +'+d.coins+'c / +'+d.seeds+' '+CROPS[Object.keys(CROPS).find(k=>CROPS[k].seedKey===d.seed)].name+' seeds';}
export function projectQuote(s,id){const d=PROJECTS.find(o=>o.id===id);return {ok:!!d&&s.area==='city'&&!s.settlement.projects.includes(id)&&materials(s,d.cost)&&rewardRoom(s,d),definition:d};}
export function completeProject(s,id){const {ok,definition:d}=projectQuote(s,id);if(!ok)return 'Project unavailable / check materials and bag space';spend(s,d.cost);reward(s,d);s.settlement.projects.push(id);return d.name+' completed / +'+d.coins+'c / +'+d.seeds+' seeds';}
export function craftDecoration(s,id){const d=validId(DECORATIONS,id);if(!d||s.area!=='farm'||!materials(s,d.cost)||s.inventory[d.item]>=9999)return 'Build on your Farm / check materials and bag space';spend(s,d.cost);s.inventory[d.item]++;return d.name+' built / select it in Bag / Gear';}
export function buildStove(s){if(s.area!=='interior'||s.settlement.stove||!materials(s,STOVE_COST))return 'Build at the Home hearth / check materials';spend(s,STOVE_COST);s.settlement.stove=true;return 'Cooking station built / Meat + Wood makes Grilled Meat';}
export function grillMeat(s){if(s.area!=='interior'||!s.settlement.stove||!materials(s,GRILL_COST)||s.inventory.grilledMeat>=9999)return 'Use your cooking station / need 1 Meat and 1 Wood';spend(s,GRILL_COST);s.inventory.grilledMeat++;return '+1 Grilled Meat / eat from Bag / Food';}
export function validDecoration(s,d){
 const def=validId(DECORATIONS,d?.type);if(!def||d.direction!==undefined&&!DECORATION_DIRECTIONS.includes(d.direction)||!Number.isInteger(d.farm)||!s.farms[d.farm]||!Number.isInteger(d.x)||!Number.isInteger(d.y)||d.x%8||d.y%8)return false;
 const map=MAPS.farm,size=map.size||MAP_SIZE,rect=decorationRect(d),view={...s,area:'farm',currentFarm:d.farm};
 if(rect.x<40||rect.y<48||rect.x+rect.w>size.width-40||rect.y+rect.h>size.height-40||!dryFootprint(map,rect))return false;
 if(map.paths.some(([x,y,w,h])=>overlaps(rect,{x,y,w,h},12))||map.obstacles.some(box=>!cutObstacle(view,'farm',box)&&overlaps(rect,{x:box[0],y:box[1],w:box[2],h:box[3]},12)))return false;
 if(visiblePlots(view).some(p=>overlaps(rect,{x:p.x-24,y:p.y-24,w:48,h:48},8)))return false;
 return !farmDecorations(view).some(p=>overlaps(rect,decorationRect(p),4));
}
export function decorationContext(s,target,direction='down'){
 if(s.area!=='farm')return null;
 if(s.selected==='hand'){const d=farmDecorations(s).filter(d=>{const r=decorationRect(d);return Math.hypot(s.position.x-d.x,s.position.y-d.y)<72&&(!target||target.x>=r.x-8&&target.x<=r.x+r.w+8&&target.y>=r.y-8&&target.y<=d.y+8)&&reachableDecoration(s,d);}).sort((a,b)=>Math.hypot(s.position.x-a.x,s.position.y-a.y)-Math.hypot(s.position.x-b.x,s.position.y-b.y))[0];return d?{...d,type:'reclaimDecoration',label:'Pack into Bag / '+DECORATIONS[d.type].name}:null;}
 if(s.selected!=='decorate')return null;
 const [dx,dy]=({up:[0,-56],down:[0,56],left:[-56,0],right:[56,0]})[direction]||[0,56],p=target||{x:s.position.x+dx,y:s.position.y+dy};
 return {type:'placeDecoration',x:Math.round(p.x/8)*8,y:Math.round(p.y/8)*8,label:'Place '+(DECORATIONS[s.selectedDecoration]?.name||'decoration')};
}
export function decorationPlacement(s,p){
 const def=validId(DECORATIONS,s.selectedDecoration),d={type:s.selectedDecoration,farm:s.currentFarm||0,x:p?.x,y:p?.y,...(p?.direction&&p.direction!=='down'?{direction:p.direction}:{})};
 const no=message=>({ok:false,message,decoration:d});
 if(s.area!=='farm'||s.selected!=='decorate'||!def||!s.inventory[def.item])return no('No built item / choose one in Bag');
 if(Math.hypot(s.position.x-d.x,s.position.y-d.y)>=80)return no('Move the preview closer');
 if(s.settlement.decorations.length>=MAX_DECORATIONS)return no('Farm full / pack up a piece with Hand');
 if(!validDecoration(s,d)||!lineClear('farm',s.position,d,0,s)||overlaps(decorationRect(d),{x:s.position.x-12,y:s.position.y-12,w:24,h:16},4))return no('Keep roads, beds and your feet clear');
 return {ok:true,message:'Ready to place / Hand recovers it',decoration:d};
}
export function placeDecoration(s,p){
 const q=decorationPlacement(s,p);if(!q.ok)return q.message;const d=q.decoration,def=DECORATIONS[d.type];
 s.inventory[def.item]--;s.settlement.decorations.push(d);return def.name+' placed / Hand packs it up';
}
export function reclaimDecoration(s,p){const d=farmDecorations(s).find(d=>d.x===p.x&&d.y===p.y),def=d&&DECORATIONS[d.type];if(s.area!=='farm'||s.selected!=='hand'||!d||Math.hypot(s.position.x-d.x,s.position.y-d.y)>=72||s.inventory[def.item]>=9999||!reachableDecoration(s,d))return 'Walk closer with Hand / check bag space';s.settlement.decorations=s.settlement.decorations.filter(n=>n!==d);s.inventory[def.item]++;return def.name+' packed into Bag / Gear';}
