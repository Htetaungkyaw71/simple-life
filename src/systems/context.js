import {LOCATIONS,walkable} from '../data/locations.js';
import {PLOTS} from '../data/crops.js';
import {waterPeriod,missed} from './watering.js';
export function plotPrompt(state,plot){
 if(missed(plot)>=2)return 'Clear dead crop';
 if(plot.growth>=3)return state.selected==='harvest'?'Harvest':'Ripe - select Harvest';
 if(missed(plot)===1&&state.selected!=='water')return 'Wilted - select Water';
 if(state.selected==='seed')return plot.crop?'Crop planted':state.inventory.seed?'Plant seed':'No seeds';
 if(!plot.crop)return 'Select a seed';
 if(state.selected==='water'){const period=waterPeriod(state);return !period?'Water at 06-12 or 16-22':plot[period]?'Already watered':missed(plot)?'Wilted - water to recover':'Water';}
 return 'Growing - select Water';
}
export function contextFor(state,targetPlot=null,direction='down'){
 if(!state)return null;
 const {x,y}=state.position,location=LOCATIONS[state.area],dist=p=>Math.hypot(p.x-x,p.y-y);
 const nearby=location.interactions.filter(p=>dist(p)<(p.type==='starter'?52:72)&&(!p.approach||(x>=p.approach[0]&&x<=p.approach[0]+p.approach[2]&&y>=p.approach[1]&&y<=p.approach[1]+p.approach[3]))).sort((a,b)=>dist(a)-dist(b));
 if(nearby.length){const c=nearby[0];return c.type==='starter'&&state.starterSeedsClaimed?{...c,label:'Starter crate - empty'}:c;}
 if(state.area==='farm'){
  let index=targetPlot;
  if(index==null){const facing={up:[0,-36],down:[0,36],left:[-36,0],right:[36,0]}[direction];
   index=PLOTS.findIndex(p=>Math.abs(p.x-x)<24&&Math.abs(p.y-y)<24);
   if(index<0)index=PLOTS.findIndex(p=>Math.abs(p.x-x-facing[0])<24&&Math.abs(p.y-y-facing[1])<24);
  }
  if(index==null||!PLOTS[index]||dist(PLOTS[index])>=60)index=PLOTS.map((p,index)=>({index,d:dist(p)})).sort((a,b)=>a.d-b.d)[0].index;
  if(dist(PLOTS[index])<60)return {type:'plot',index,...PLOTS[index],label:plotPrompt(state,state.plots[index])};
 }
 if(state.selected==='water'){
  const shore=location.shoreline.filter(p=>dist(p)<48&&walkable(state.area,p.x,p.y)).sort((a,b)=>dist(a)-dist(b))[0];
  if(shore)return {type:'refill',...shore,label:'Refill watering can'};
 }
 return null;
}
