import {lineClear} from './forest.js';
import {VEGETATION,vegetationKey,vegetationState,nearbyVegetation,removed} from '../data/vegetation.js';
import {MAPS,MAP_SIZE} from '../data/mapLayouts.js';
import {waterAt,dryFootprint} from '../data/water.js';
import {walkable} from '../data/locations.js';
import {visiblePlots} from './expansion.js';
export const MAX_PLACED_GRASS=2048;
const face={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
export function grassGround(s,p){const map=MAPS[s.area];if(!map||s.area==='interior'||!walkable(s.area,p.x,p.y,24,false,s)||waterAt(map,p,false)||!dryFootprint(map,{x:p.x-24,y:p.y-48,w:48,h:48}))return false;
 if(map.paths.some(([x,y,w,h])=>p.x+16>x&&p.x-16<x+w&&p.y>y&&p.y-16<y+h))return false;
 return s.area!=='farm'||!visiblePlots(s).some(b=>Math.abs(b.x-p.x)<40&&Math.abs(b.y-p.y)<40);
}
export function vegetationContext(s,direction='down',target=null){
 if(!['axe','hand','grass'].includes(s.selected)||s.area==='interior')return null;
 const [dx,dy]=face[direction]||face.down,p=target||{x:s.position.x+dx*36,y:s.position.y+dy*36};
 if(s.selected==='grass'){const q={x:Math.round(p.x/8)*8,y:Math.round(p.y/8)*8};return {...q,type:'placeGrass',label:s.inventory.grass?'Plant grass':'No grass / gather by hand'};}
 const tree=s.selected==='axe';const nodes=nearbyVegetation(s,s.position,72).filter(n=>n.id.startsWith('tree:')===tree).filter(n=>target?Math.hypot(n.x-target.x,n.y-target.y)<56:(n.x-s.position.x)*dx+(n.y-s.position.y)*dy>=-16).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
 const n=nodes[0];return n?{...n,type:tree?'chop':'gatherGrass',label:tree?'Chop tree':'Gather grass'}:null;
}
export function useVegetation(s,c){
 if(!c||!['chop','gatherGrass','placeGrass'].includes(c.type)||Math.hypot(c.x-s.position.x,c.y-s.position.y)>=72)return {ok:false,message:'Walk closer'};
 if(s.selected!==({chop:'axe',gatherGrass:'hand',placeGrass:'grass'}[c.type]))return {ok:false,message:'Select the tool'};
 let v=vegetationState(s),node;
 if(c.type!=='placeGrass'){
  node=VEGETATION[s.area]?.byId.get(c.id)||v?.placed.find(n=>n.id===c.id);
  if(!node||removed(s,c.id)||node.x!==c.x||node.y!==c.y||c.id.startsWith('tree:')!==(c.type==='chop'))return {ok:false,message:'Already gathered'};
 }
 const view=c.type==='chop'?{...s,vegetation:{...s.vegetation,[vegetationKey(s)]:{...v,trees:[...(v?.trees||[]),c.id]}}}:s;
 const size=MAPS[s.area].size||MAP_SIZE,end=c.type==='chop'?{x:Math.max(0,Math.min(size.width,c.x)),y:Math.max(0,Math.min(size.height,c.y))}:c;
 if(!lineClear(s.area,s.position,end,0,view))return {ok:false,message:'Choose a clear approach'};
 const cost=c.type==='chop'?2:1,key=c.type==='chop'?'wood':'grass',amount=c.type==='chop'?3:1;
 if(s.energy<cost)return {ok:false,message:'Too tired / eat or sleep'};
 if(c.type==='placeGrass'){
  if(!s.inventory.grass)return {ok:false,message:'No grass / gather by hand'};
  if(!grassGround(s,c)||nearbyVegetation(s,c,28).some(n=>!n.id.startsWith('tree:')))return {ok:false,message:'Choose clear dry ground'};
  if((v?.placed.length||0)>=MAX_PLACED_GRASS)return {ok:false,message:'Grass garden full'};
 }else if(s.inventory[key]+amount>9999)return {ok:false,message:'Bag full'};
 s.vegetation??={};v??=s.vegetation[vegetationKey(s)]={trees:[],grass:[],placed:[]};s.energy-=cost;
 if(c.type==='chop'){v.trees.push(c.id);s.inventory.wood+=amount;}
 else if(c.type==='gatherGrass'){if(c.id.startsWith('placed:'))v.placed=v.placed.filter(n=>n.id!==c.id);else v.grass.push(c.id);s.inventory.grass++;}
 else {s.inventory.grass--;v.placed.push({id:`placed:${c.x}:${c.y}`,x:c.x,y:c.y,variant:Math.abs(c.x+c.y)%3});}
 return {...c,ok:true,message:c.type==='chop'?'+3 Wood':c.type==='gatherGrass'?'+1 Grass':'Grass planted'};
}
