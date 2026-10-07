import {FOREST_ENTRANCE} from './forest.js';
import {ROOM,configureRoom} from './interior.js';
import {MAPS,MAP_SIZE} from './mapLayouts.js';
import {HOUSE,houseSolids,pondRows} from './geometry.js';
export const LOCATIONS = {
 forest:{name:'Forest',subtitle:'The Wild Woods',spawn:{...FOREST_ENTRANCE},interactions:[]},
 home:{name:'Home',subtitle:'The shade garden',spawn:{x:480,y:500},interactions:[
  {type:'travel',...HOUSE.door,label:'Enter house',to:'interior',spawn:{...ROOM.spawn},approach:[464,480,32,28]},
  {type:'starter',x:544,y:542,label:'Collect starter seeds'},

 ]},
 interior:{name:'Home',subtitle:'Inside the house',spawn:{...ROOM.spawn},interactions:[
  {type:'bed',...ROOM.bed,label:'Rest at the bed'},
  {type:'travel',...ROOM.exit,label:'Exit house',to:'home',spawn:{...HOUSE.exit},approach:[ROOM.width/2-24,ROOM.height-104,48,48]},
 ]},
 farm:{name:'Farm',subtitle:'The active field',spawn:{x:320,y:64},interactions:[

  {type:'hint',x:865,y:275,label:'CITY / return Home, then follow the east road'},
 ]},
 city:{name:'City',subtitle:'Lantern Market',spawn:{x:64,y:488},interactions:[
  {type:'outfitter',x:336,y:738,label:'Browse Outfitter',approach:[276,720,120,56]},
  {type:'seed',x:432,y:306,label:'Browse seeds',approach:[372,288,120,56]},
  {type:'sell',x:896,y:306,label:'Sell produce',approach:[836,288,120,56]},
 ]},
};
for(const [area,location]of Object.entries(LOCATIONS)){
 location.bounds=area==='interior'?ROOM.bounds:[0,0,(MAPS[area].size||MAP_SIZE).width,(MAPS[area].size||MAP_SIZE).height];location.obstacles=MAPS[area].obstacles;
 location.houseSolids=MAPS[area].buildings.filter(p=>p.name.startsWith('house')).flatMap(p=>houseSolids(p.x,p.y));
 location.interactions.push(...MAPS[area].signs.map(p=>({type:'dialog',...p})));
 location.shoreline=MAPS[area].water.flatMap(pond=>{const rows=pondRows(pond),[x,y,w,h]=pond;return [{x:x+w/2,y:y-16},{x:x+w/2,y:y+h+16},...rows.filter((_,i)=>i%8===0).flatMap(([x,y,w])=>[{x:x-16,y:y+1},{x:x+w+16,y:y+1}])];});
}
export function inBounds(area,x,y,r=area==='interior'?6:12){const map=LOCATIONS[area];if(!map||!Number.isFinite(x)||!Number.isFinite(y))return false;const [bx,by,w,h]=map.bounds;return x>=bx+r&&x<=bx+w-r&&y>=by+r&&y<=by+h;}
// Keep the visible farmer clear of opaque house art without enlarging the feet body
// used for trees, ponds, furniture and crops. The front interaction approach stays open.
export function houseClearance(area,x,y){return !LOCATIONS[area].houseSolids.some(([ox,oy,ow,oh])=>x+20>ox&&x-20<ox+ow&&y>oy&&y-60<oy+oh);}
const spatial=new Map();
function candidates(area,x,y,r){
 if(area!=='forest')return LOCATIONS[area].obstacles;
 const map=LOCATIONS[area];let index=spatial.get(map.obstacles);
 if(!index){index=new Map();for(const box of map.obstacles){const [a,b,w,h]=box;for(let cy=Math.floor(b/128);cy<=Math.floor((b+h)/128);cy++)for(let cx=Math.floor(a/128);cx<=Math.floor((a+w)/128);cx++){const k=cx+":"+cy;if(!index.has(k))index.set(k,[]);index.get(k).push(box);}}spatial.set(map.obstacles,index);}
 const found=new Set();for(let cy=Math.floor((y-r)/128);cy<=Math.floor(y/128);cy++)for(let cx=Math.floor((x-r)/128);cx<=Math.floor((x+r)/128);cx++)for(const b of index.get(cx+":"+cy)||[])found.add(b);return [...found];
}
export function walkable(area,x,y,r=area==='interior'?6:12){return inBounds(area,x,y,r)&&(r===0||houseClearance(area,x,y))&&!candidates(area,x,y,r).some(([ox,oy,ow,oh])=>x+r>ox&&x-r<ox+ow&&y>oy&&y-r<oy+oh);}

export const EDGE_TRAVEL={
 home:{zone:[448,1120,64,32],to:'farm',spawn:{x:320,y:64},facing:'down'},
 homeForest:{zone:[672,0,96,32],to:'forest',spawn:{...FOREST_ENTRANCE},facing:'up'},
 forest:{zone:[592,5088,96,32],to:'home',spawn:{x:720,y:64},facing:'down'},
 homeCity:{zone:[2208,608,32,64],to:'city',spawn:{x:64,y:488},facing:'right'},
 city:{zone:[0,448,32,80],to:'home',spawn:{x:2176,y:640},facing:'left'},
 farm:{zone:[288,0,64,32],to:'home',spawn:{x:480,y:1088},facing:'up'}
};
export function edgeTravel(state){const edges=state.area==='home'?[EDGE_TRAVEL.home,EDGE_TRAVEL.homeCity,EDGE_TRAVEL.homeForest]:[EDGE_TRAVEL[state.area]];for(const edge of edges){if(!edge)continue;const [x,y,w,h]=edge.zone,p=state.position;if(p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h)return edge;}return null;}
export function nearestSafe(area,position){
 if(walkable(area,position?.x,position?.y))return {x:position.x,y:position.y};
 if(Number.isFinite(position?.x)&&Number.isFinite(position?.y)){
  let best=null,dist=Infinity;
  for(let r=2;r<=256&&r*r<=dist;r+=2)for(let d=-r;d<=r;d+=2)for(const [dx,dy]of [[d,-r],[d,r],[-r,d],[r,d]]){const x=position.x+dx,y=position.y+dy,v=dx*dx+dy*dy;if(v<dist&&walkable(area,x,y)){best={x,y};dist=v;}}
  if(best)return best;
 }
 return {...LOCATIONS[area].spawn};
}

export function syncInterior(width,height){
 const changed=configureRoom(width,height),room=LOCATIONS.interior;
 room.bounds=ROOM.bounds;room.spawn={...ROOM.spawn};
 Object.assign(room.interactions[0],ROOM.bed);Object.assign(room.interactions[1],ROOM.exit,{approach:[ROOM.width/2-24,ROOM.height-104,48,48]});
 LOCATIONS.home.interactions[0].spawn={...ROOM.spawn};return changed;
}

export const TRAVEL_COOLDOWN=700;
export function readyEdgeTravel(state,now,ready){return now>=ready?edgeTravel(state):null;}
