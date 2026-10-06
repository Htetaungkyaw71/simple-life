import {EDGE_TRAVEL} from '../data/locations.js';
export const farmObjective=state=>!!state?.starterSeedsClaimed&&!state.hasVisitedFarm;
export function farmWaypoint(state,view){
 if(!state||state.area!=='home'||state.hasVisitedFarm)return null;
 const [x,y,w,h]=EDGE_TRAVEL.home.zone,target={x:x+w/2,y:y+h/2};
 const visible=target.x>=view.x&&target.x<=view.x+view.width&&target.y>=view.y&&target.y<=view.y+view.height;
 if(visible)return null;
 const dx=target.x-state.position.x,dy=target.y-state.position.y;
 return {target,dx,dy,direction:Math.round(Math.atan2(dy,dx)/(Math.PI/4)+8)%8};
}
export function inferFarmVisit(raw,state){
 return raw.hasVisitedFarm===true||['farm','city'].includes(raw.area)||state.plots.some(p=>p.crop)||state.inventory.tomato>0||state.sold>0;
}

export const cityObjective=s=>!!s?.hasHarvestedFirstCrop&&!s.hasVisitedCity;
export function cityWaypoint(s,view){
 if(!cityObjective(s)||!['home','farm'].includes(s.area))return null;
 const [x,y,w,h]=(s.area==='home'?EDGE_TRAVEL.homeCity:EDGE_TRAVEL.farm).zone,target={x:x+w/2,y:y+h/2};
 if(target.x>=view.x&&target.x<=view.x+view.width&&target.y>=view.y&&target.y<=view.y+view.height)return null;
 const dx=target.x-s.position.x,dy=target.y-s.position.y;return {target,dx,dy,direction:Math.round(Math.atan2(dy,dx)/(Math.PI/4)+8)%8};
}
