import {decorationAllowed} from './customization.js';
import {ROOM} from '../data/interior.js';
import {LOCATIONS} from '../data/locations.js';
import {recordStory,syncStory} from './story.js';
import {ORDERS,PROJECTS,DECORATIONS,DECORATION_DIRECTIONS,STOVE_COST,GRILL_COST,MAX_DECORATIONS} from '../data/settlement.js';
import {MAPS,MAP_SIZE} from '../data/mapLayouts.js';
import {CROPS} from '../data/crops.js';
import {dryFootprint} from '../data/water.js';
import {cutObstacle} from '../data/vegetation.js';
import {visiblePlots} from './expansion.js';
import {areaDecorations,decorationShape,decorationRect,overlaps} from './settlementGeometry.js';
const validId=(catalog,id)=>Object.hasOwn(catalog,id)?catalog[id]:null;
export function materials(s,cost){return Object.entries(cost).every(([id,n])=>Number.isInteger(s.inventory[id])&&s.inventory[id]>=n);}
const spend=(s,cost)=>{for(const [id,n]of Object.entries(cost))s.inventory[id]-=n;};
export const materialLabel=cost=>Object.entries(cost).map(([id,n])=>n+' '+(id==='meat'?'Meat':id==='stone'?'Stone':'Wood')).join(' / ');
export function dailyOrders(s){const start=((s.marketSeed>>>0)+s.day-1)%ORDERS.length;return Array.from({length:3},(_,i)=>ORDERS[(start+i)%ORDERS.length]);}
export const orderComplete=(s,id)=>s.settlement.orders.day===s.day&&s.settlement.orders.completed.includes(id);
const rewardRoom=(s,d)=>s.money+d.coins<=9999999&&(s.inventory[d.seed]||0)+d.seeds<=9999;
const reward=(s,d)=>{s.money+=d.coins;s.inventory[d.seed]+=d.seeds;};
export function orderQuote(s,id){const d=dailyOrders(s).find(o=>o.id===id);return {ok:!!d&&s.area==='city'&&!orderComplete(s,id)&&materials(s,d.cost)&&rewardRoom(s,d),definition:d};}
export function deliverOrder(s,id){const {ok,definition:d}=orderQuote(s,id);if(!ok)return 'Order unavailable / check materials and bag space';spend(s,d.cost);reward(s,d);if(s.settlement.orders.day!==s.day)s.settlement.orders={day:s.day,completed:[]};s.settlement.orders.completed.push(id);syncStory(s);return d.name+' thanks you / +'+d.coins+'c / +'+d.seeds+' '+CROPS[Object.keys(CROPS).find(k=>CROPS[k].seedKey===d.seed)].name+' seeds';}
export function projectQuote(s,id){const d=PROJECTS.find(o=>o.id===id);return {ok:!!d&&s.area==='city'&&!s.settlement.projects.includes(id)&&materials(s,d.cost)&&rewardRoom(s,d),definition:d};}
export function completeProject(s,id){const {ok,definition:d}=projectQuote(s,id);if(!ok)return 'Project unavailable / check materials and bag space';spend(s,d.cost);reward(s,d);s.settlement.projects.push(id);recordStory(s,'wood');recordStory(s,'stone');syncStory(s);return d.name+' completed / +'+d.coins+'c / +'+d.seeds+' seeds';}
export function craftDecoration(s,id){const d=validId(DECORATIONS,id);if(!d||!d.cost||!['home','farm','interior'].includes(s.area)||!materials(s,d.cost)||s.inventory[d.item]+s.settlement.decorations.filter(p=>p.type===id).length>=9999)return 'Customize at Home or Farm / check materials and bag space';spend(s,d.cost);s.inventory[d.item]++;return d.name+' built / select it in Bag / Gear';}
export function buildStove(s){if(s.area!=='interior'||s.settlement.stove||!materials(s,STOVE_COST))return 'Build at the Home hearth / check materials';spend(s,STOVE_COST);s.settlement.stove=true;return 'Cooking station built / Meat + Wood makes Grilled Meat';}
export function grillMeat(s){if(s.area!=='interior'||!s.settlement.stove||!materials(s,GRILL_COST)||s.inventory.grilledMeat>=9999)return 'Use your cooking station / need 1 Meat and 1 Wood';spend(s,GRILL_COST);s.inventory.grilledMeat++;return '+1 Grilled Meat / eat from Bag / Food';}
export function validDecoration(s,d){
 const area=d?.area||'farm',def=validId(DECORATIONS,d?.type);
 if(!def||!decorationAllowed(area,d.type)||d.direction!==undefined&&!DECORATION_DIRECTIONS.includes(d.direction)||area==='farm'&&(!Number.isInteger(d.farm)||!s.farms[d.farm])||!Number.isInteger(d.x)||!Number.isInteger(d.y)||d.x%8||d.y%8)return false;
 const map=MAPS[area],size=area==='interior'?ROOM:map.size||MAP_SIZE,rect=decorationRect(d),view={...s,area,currentFarm:d.farm||0};
 const margin=area==='interior'?20:40,top=area==='interior'?52:48;
 if(rect.x<margin||rect.y<top||rect.x+rect.w>size.width-margin||rect.y+rect.h>size.height-(area==='interior'?40:40)||!dryFootprint(map,rect))return false;
 if(map.obstacles.some(box=>!cutObstacle(view,area,box)&&overlaps(rect,{x:box[0],y:box[1],w:box[2],h:box[3]},area==='interior'?4:12)))return false;
 if(area==='farm'&&visiblePlots(view).some(p=>overlaps(rect,{x:p.x-24,y:p.y-24,w:48,h:48},8)))return false;
 // Preserve door approaches, the bed/hearth/Keepsake and all travel markers.
 if(LOCATIONS[area].interactions.some(p=>overlaps(rect,p.approach?{x:p.approach[0]-16,y:p.approach[1]-16,w:p.approach[2]+32,h:p.approach[3]+32}:{x:p.x-32,y:p.y-32,w:64,h:64})))return false;
 if(area==='interior'&&overlaps(rect,{x:ROOM.width-152,y:126,w:64,h:64}))return false;
 return !areaDecorations(view,area).some(p=>overlaps(rect,decorationRect(p),4));
}
export function placedDecorationAt(s,target){
 if(!Number.isFinite(target?.x)||!Number.isFinite(target?.y))return null;
 return areaDecorations(s).filter(d=>{const r=decorationRect(d);return target.x>=r.x&&target.x<=r.x+r.w&&target.y>=r.y&&target.y<=r.y+r.h;}).sort((a,b)=>b.y-a.y)[0]||null;
}
export function decorationContext(s,target,direction='down'){
 if(!['home','farm','interior'].includes(s.area))return null;
 if(s.selected==='hand'){const d=target?placedDecorationAt(s,target):areaDecorations(s).filter(d=>Math.hypot(s.position.x-d.x,s.position.y-d.y)<72).sort((a,b)=>Math.hypot(s.position.x-a.x,s.position.y-a.y)-Math.hypot(s.position.x-b.x,s.position.y-b.y))[0];return d?{...d,type:'reclaimDecoration',label:'Edit / '+DECORATIONS[d.type].name}:null;}
 if(s.selected!=='decorate')return null;
 const [dx,dy]=({up:[0,-56],down:[0,56],left:[-56,0],right:[56,0]})[direction]||[0,56],p=target||{x:s.position.x+dx,y:s.position.y+dy};
 return {type:'placeDecoration',x:Math.round(p.x/8)*8,y:Math.round(p.y/8)*8,label:'Place '+(DECORATIONS[s.selectedDecoration]?.name||'decoration')};
}
export function decorationPlacement(s,p){
 const def=validId(DECORATIONS,s.selectedDecoration),d={type:s.selectedDecoration,...(s.area==='farm'?{farm:s.currentFarm||0}:{area:s.area}),x:p?.x,y:p?.y,...(p?.direction&&p.direction!=='down'?{direction:p.direction}:{})};
 const no=message=>({ok:false,message,decoration:d});
 if(!decorationAllowed(s.area,s.selectedDecoration)||s.selected!=='decorate'||!def||!s.inventory[def.item])return no('No built item / choose one in Bag');
 if(s.settlement.decorations.length>=MAX_DECORATIONS)return no('Decor limit / put tools away to pack a piece');
 if(!clearPlacement(s,d))return no('Choose a clear spot / objects, beds or water');
 return {ok:true,message:'Ready to add',decoration:d};
}
const clearPlacement=(s,d)=>validDecoration(s,d)&&!overlaps(decorationShape(d).box?{x:d.x+decorationShape(d).box[0],y:d.y+decorationShape(d).box[1],w:decorationShape(d).box[2],h:decorationShape(d).box[3]}:decorationRect(d),{x:s.position.x-12,y:s.position.y-12,w:24,h:16},4);
export function readjustQuote(s,original,p){
 if(!areaDecorations(s).includes(original))return {ok:false,message:'This piece is no longer here'};
 const d={...original,x:p?.x,y:p?.y};delete d.direction;if(p?.direction&&p.direction!=='down')d.direction=p.direction;
 const view={...s,settlement:{...s.settlement,decorations:s.settlement.decorations.filter(n=>n!==original)}};
 const ok=clearPlacement(view,d);return {ok,message:ok?'Ready to readjust':'Choose a clear spot / objects, beds or water',decoration:d};
}
export function readjustDecoration(s,original,p){const q=readjustQuote(s,original,p);if(!q.ok)return q.message;s.settlement.decorations[s.settlement.decorations.indexOf(original)]=q.decoration;return DECORATIONS[original.type].name+' readjusted';}
export function placeDecoration(s,p){
 const q=decorationPlacement(s,p);if(!q.ok)return q.message;const d=q.decoration,def=DECORATIONS[d.type];
 s.inventory[def.item]--;s.settlement.decorations.push(d);return def.name+' added / select it to remove or readjust';
}
export function reclaimDecoration(s,p){const d=areaDecorations(s).find(d=>d.x===p.x&&d.y===p.y),def=d&&DECORATIONS[d.type];if(!['home','farm','interior'].includes(s.area)||!d||s.inventory[def.item]>=9999)return 'Cannot remove / check bag space';s.settlement.decorations=s.settlement.decorations.filter(n=>n!==d);s.inventory[def.item]++;return def.name+' removed / kept in Bag / Gear';}
