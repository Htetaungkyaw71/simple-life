import {LOCATIONS,walkable} from '../data/locations.js';
import {FIELDS,FARM_PLOTS,PLOTS_PER_FARM} from '../data/farms.js';
import {visiblePlots,ownedField} from './expansion.js';
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
 if(nearby.length){const c=nearby[0];if(c.type==='field'&&ownedField(state,c.field))return {...c,type:'hint',label:`Field ${c.field+1} / owned`};return c.type==='starter'&&state.starterSeedsClaimed?{...c,label:'Starter crate - empty'}:c;}
 if(state.area==='farm'){
  const positions=visiblePlots(state),offset=(state.currentFarm||0)*PLOTS_PER_FARM;
  const pointed=targetPlot!=null?FARM_PLOTS[targetPlot-offset]:null;
  const locked=FIELDS.findIndex((f,i)=>!ownedField(state,i)&&(pointed?.field===i&&dist(pointed)<60||x>=f.x-12&&x<=f.x+f.w+12&&y>=f.y-12&&y<=f.y+f.h+12));
  if(locked>=0){const f=FIELDS[locked];return {type:'field',field:locked,x:f.x+f.w/2,y:f.y+f.h/2,label:`Buy field ${locked+1} / ${f.price} coins`};}
  let pos=positions.find(p=>p.index===targetPlot&&dist(p)<60);
  if(!pos){const facing={up:[0,-36],down:[0,36],left:[-36,0],right:[36,0]}[direction];
   pos=positions.find(p=>Math.abs(p.x-x)<24&&Math.abs(p.y-y)<24)||positions.find(p=>Math.abs(p.x-x-facing[0])<24&&Math.abs(p.y-y-facing[1])<24);
  }
  if(!pos)pos=positions.sort((a,b)=>dist(a)-dist(b))[0];
  if(pos&&dist(pos)<60)return {type:'plot',...pos,label:plotPrompt(state,state.plots[pos.index])};
 }
 if(state.selected==='water'){
  const shore=location.shoreline.filter(p=>dist(p)<48&&walkable(state.area,p.x,p.y)).sort((a,b)=>dist(a)-dist(b))[0];
  if(shore)return {type:'refill',...shore,label:'Refill watering can'};
 }
 return null;
}
