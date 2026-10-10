import {cutObstacle,VEGETATION,vegetationKey,vegetationState} from '../data/vegetation.js';
import {lineClear} from './forest.js';
import {MAPS,MAP_SIZE} from '../data/mapLayouts.js';
import {waterAt} from '../data/water.js';
import {FARM_PLOTS,PLOTS_PER_FARM} from '../data/farms.js';
import {visiblePlots,plotOwned} from './expansion.js';
import {emptyPlot} from './state.js';
import {plotAt} from './plots.js';
import {usePlot} from './farming.js';
import {CROPS} from '../data/crops.js';
import {wateredToday,evaluateWatering,missed} from './watering.js';
import {FARM_ENERGY} from '../data/energy.js';
export const WET_DURATION=180000,MAX_CUSTOM_BEDS=2048,MAX_WET_PATCHES=256;
export function openGround(area,x,y,dig=false,state=null){
 const map=Object.hasOwn(MAPS,area)?MAPS[area]:null;if(!map||area==='interior'||!Number.isFinite(x)||!Number.isFinite(y))return false;
 const size=map.size||MAP_SIZE,r=dig?24:8;
 if(x-r<32||y-r<32||x+r>size.width-32||y+r>size.height-32)return false;
 if(map.obstacles.some(box=>{const [bx,by,w,h]=box;return !cutObstacle(state,area,box)&&x+r>bx&&x-r<bx+w&&y+r>by&&y-r<by+h;}))return false;
 if([[0,0],[-r,-r],[r,-r],[-r,r],[r,r]].some(([dx,dy])=>waterAt(map,{x:x+dx,y:y+dy},false)))return false;
 if(dig&&(area!=='farm'||map.paths.some(([bx,by,w,h])=>x+24>bx&&x-24<bx+w&&y+24>by&&y-24<by+h)))return false;
 return true;
}
export function groundPoint(s,point,direction='down'){
 const facing={up:[0,-36],down:[0,36],left:[-36,0],right:[36,0]}[direction]||[0,36];
 const p=point||{x:s.position.x+facing[0],y:s.position.y+facing[1]};
 const local=s.area==='farm'?FARM_PLOTS.findIndex(b=>Math.abs(b.x-p.x)<24&&Math.abs(b.y-p.y)<24):-1;
 if(local>=0)return {...FARM_PLOTS[local],index:(s.currentFarm||0)*PLOTS_PER_FARM+local};
 // Continue a nearby bed's lattice so shovel additions join old fields seamlessly.
 const nearby=s.area==='farm'?[...FARM_PLOTS,...visiblePlots(s)].filter(b=>Math.hypot(b.x-p.x,b.y-p.y)<96).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]:null;
 return nearby?{x:nearby.x+Math.round((p.x-nearby.x)/48)*48,y:nearby.y+Math.round((p.y-nearby.y)/48)*48}:{x:Math.floor(p.x/48)*48+24,y:Math.floor(p.y/48)*48+24};
}
export function digGround(s,point){
 if(s.area!=='farm')return {ok:false,message:'Dig on your Farm'};
 const p=groundPoint(s,point);
 if(Math.hypot(p.x-s.position.x,p.y-s.position.y)>=72)return {ok:false,message:'Walk closer'};
 if(!openGround('farm',p.x,p.y,true,s)||!lineClear('farm',s.position,p,0,s))return {ok:false,message:'Choose clear grass'};
 if(visiblePlots(s).some(b=>Math.abs(b.x-p.x)<47&&Math.abs(b.y-p.y)<47))return {ok:false,message:'Already dug'};
 if(p.index==null&&FARM_PLOTS.some(b=>Math.abs(b.x-p.x)<48&&Math.abs(b.y-p.y)<48))return {ok:false,message:'Dig beside the existing bed'};
 if(s.energy<FARM_ENERGY.dig)return {ok:false,message:'Too tired - eat or sleep'};
 if(p.index==null&&(s.customBeds||[]).length>=MAX_CUSTOM_BEDS)return {ok:false,message:'Farm beds full'};
 s.energy-=FARM_ENERGY.dig;s.hasVisitedFarm=true;
 // Digging clears ground cover; gather it by hand first to keep the grass.
 const grass=VEGETATION.farm.grass.filter(n=>Math.abs(n.x-p.x)<40&&Math.abs(n.y-p.y)<40),old=vegetationState(s);
 if(grass.length||old?.placed.some(n=>Math.abs(n.x-p.x)<40&&Math.abs(n.y-p.y)<40)){
  s.vegetation??={};const v=old|| (s.vegetation[vegetationKey(s)]={trees:[],grass:[],placed:[]});
  v.grass=[...new Set([...v.grass,...grass.map(n=>n.id)])];v.placed=v.placed.filter(n=>Math.abs(n.x-p.x)>=40||Math.abs(n.y-p.y)>=40);
 }

 if(p.index!=null){s.dugPlots??=[];s.dugPlots.push(p.index);}
 else {s.customBeds??=[];s.customBeds.push({farm:s.currentFarm||0,x:p.x,y:p.y,plot:emptyPlot()});p.index=s.plots.length+s.customBeds.length-1;}
 return {ok:true,message:'Ready to plant',...p};
}
export const wetAt=(s,x,y,area=s.area,farm=s.currentFarm||0)=>(s.wetGround||[]).some(p=>p.area===area&&(area!=='farm'||p.farm===farm)&&Math.abs(p.x-x)<24&&Math.abs(p.y-y)<24&&p.remaining>0);
export function waterGround(s,point,index){
 if(Math.hypot(point.x-s.position.x,point.y-s.position.y)>=72)return {ok:false,message:'Walk closer'};
 if(!openGround(s.area,point.x,point.y,false,s)||!lineClear(s.area,s.position,point,0,s))return {ok:false,message:'Water on open ground'};
 evaluateWatering(s);
 const p=index!=null&&plotOwned(s,index)?plotAt(s,index):null;
 if(p?.crop){
  if(missed(p)>=4)return {ok:false,message:'Dead / select Harvest'};
  if(p.growth>=CROPS[p.crop].growthDays)return {ok:false,message:'Ready to harvest'};
  if(wateredToday(s,p))return {ok:false,message:'Already watered today'};
 }
 if(s.energy<FARM_ENERGY.water)return {ok:false,message:'Too tired - eat or sleep'};
 const care=!!p?.crop;
 if(care)usePlot(s,index);else s.energy-=FARM_ENERGY.water;
 s.wetGround??=[];const existing=s.wetGround.find(p=>p.area===s.area&&(s.area!=='farm'||p.farm===(s.currentFarm||0))&&p.x===point.x&&p.y===point.y);
 if(existing)existing.remaining=WET_DURATION;else {if(s.wetGround.length>=MAX_WET_PATCHES)s.wetGround.shift();s.wetGround.push({area:s.area,farm:s.currentFarm||0,x:point.x,y:point.y,remaining:WET_DURATION});}
 return {...point,ok:true,message:care?'Watered':'Watered ground',cared:!!care};
}
export function dryGround(s,delta){let changed=false;for(const p of s.wetGround||[]){p.remaining-=Math.max(0,Math.min(delta,100));if(p.remaining<=0)changed=true;}if(changed)s.wetGround=s.wetGround.filter(p=>p.remaining>0);return changed;}
