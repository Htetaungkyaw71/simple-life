import {ROOM} from '../data/interior.js';
import {vegetationContext} from './vegetation.js';
import {decorationContext} from './settlement.js';
import {huntContext} from './combat.js';
import {stoneContext} from './resources.js';
import {groundPoint,openGround} from './farmGround.js';
import {plotAt} from './plots.js';
import {FORAGE_NODES,TREASURES} from '../data/forest.js';
import {FOODS} from '../data/items.js';
import {forageAvailable,treasureAvailable,lineClear} from './forest.js';
import {CROPS} from '../data/crops.js';
import {shopOpen,SHOP_HOURS} from './market.js';
import {LOCATIONS,walkable} from '../data/locations.js';
import {FIELDS,FARM_PLOTS,PLOTS_PER_FARM} from '../data/farms.js';
import {visiblePlots,ownedField} from './expansion.js';
import {wateredToday,missed} from './watering.js';
export function plotPrompt(state,plot){
 if(missed(plot)>=4)return state.selected==='water'?'Dead / select Harvest':'Clear dead crop';
 if(plot.crop&&plot.growth>=CROPS[plot.crop].growthDays)return state.selected==='harvest'?'Harvest':'Ripe - select Harvest';
 if(missed(plot)>=3&&state.selected!=='water')return 'Recovering - select Water';
 if(state.selected==='seed')return plot.crop?'Crop planted':state.inventory[CROPS[state.selectedCrop||'tomato'].seedKey]?'Plant seed':'No seeds';
 if(!plot.crop)return state.selected==='water'?'Water ground':'Select a seed';
 if(state.selected==='water'){return wateredToday(state,plot)?'Already watered today':missed(plot)>=3?'Recovering - water to recover':'Water';}
 return 'Growing - select Water';
}
export function contextFor(state,targetPlot=null,direction='down',targetGround=null){
 if(!state)return null;
 if(state.area==='interior'&&state.story?.keepsake==='carried'&&Math.hypot(state.position.x-(ROOM.width-120),state.position.y-158)<72)return {type:'keepsakePlace',x:ROOM.width-120,y:158,label:"Place Grandfather's Keepsake"};
 const decoration=decorationContext(state,targetGround,direction);if(decoration)return decoration;
 const hunt=huntContext(state,direction,targetGround);if(hunt)return hunt;
 if(state.area==='forest'&&(state.selected==='hand'||targetGround)){const stone=stoneContext(state,targetGround);if(stone)return stone;}
 const vegetation=vegetationContext(state,direction,targetGround);if(vegetation)return vegetation;
 const {x,y}=state.position,location=LOCATIONS[state.area],dist=p=>Math.hypot(p.x-x,p.y-y);
 const nearby=location.interactions.filter(p=>dist(p)<(p.type==='starter'?52:72)&&(!p.approach||(x>=p.approach[0]&&x<=p.approach[0]+p.approach[2]&&y>=p.approach[1]&&y<=p.approach[1]+p.approach[3]))).sort((a,b)=>dist(a)-dist(b));
 const groundContext=()=>{if(state.selected==='shovel'||state.selected==='water'){
  const positions=visiblePlots(state),underfoot=state.area==='farm'&&state.selected==='water'?positions.find(b=>Math.abs(b.x-state.position.x)<24&&Math.abs(b.y-state.position.y)<24):null,point=groundPoint(state,targetGround||underfoot,direction),bed=state.area==='farm'?positions.find(b=>Math.abs(b.x-point.x)<24&&Math.abs(b.y-point.y)<24):null;
  const p=bed||point;
  if(Math.hypot(p.x-state.position.x,p.y-state.position.y)<72&&openGround(state.area,p.x,p.y,state.selected==='shovel',state))return state.selected==='shovel'?{type:'dig',...p,label:bed?'Already dug':'Dig ground'}:bed?{type:'plot',...bed,label:plotPrompt(state,plotAt(state,bed.index))}:{type:'waterGround',...p,label:'Water ground'};
 }return null;};
 if(targetGround){const ground=groundContext();if(ground)return ground;}
 if(state.area==='forest'){
  const stone=stoneContext(state,targetGround);if(stone)return stone;
  const bag=state.stash;if(bag&&dist(bag)<64&&lineClear('forest',state.position,bag,0,state))return {type:'stash',...bag,label:'Recover '+bag.coins+' coins'};
  const treasure=TREASURES.find(t=>dist(t)<64&&treasureAvailable(state,t)&&lineClear('forest',state.position,t,0,state));if(treasure)return {type:'treasure',...treasure,label:'Search ancient chest'};
  const node=FORAGE_NODES.filter(n=>dist(n)<64&&forageAvailable(state,n)&&lineClear('forest',state.position,n,0,state)).sort((a,b)=>dist(a)-dist(b))[0];
  if(node)return {type:'forage',...node,label:'Gather '+FOODS[node.item].name};
 }
 if(nearby.length){const c=nearby[0];if(['seed','sell'].includes(c.type)&&!shopOpen(state,c.type))return {...c,type:'hint',label:`Closed / ${SHOP_HOURS[c.type].label}`};if(c.type==='field'&&ownedField(state,c.field))return {...c,type:'hint',label:`Planting beds`};return c.type==='starter'&&state.starterSeedsClaimed?{...c,label:'Starter crate - empty'}:c;}
 const ground=groundContext();if(ground)return ground;
 if(['axe','hand','grass'].includes(state.selected))return null;
 if(state.area==='farm'){
  const positions=visiblePlots(state),offset=(state.currentFarm||0)*PLOTS_PER_FARM;
  const pointed=targetPlot!=null?positions.find(p=>p.index===targetPlot)||FARM_PLOTS[targetPlot-offset]:null;
  let pos=positions.find(p=>p.index===targetPlot&&dist(p)<60);
  if(!pos){const facing={up:[0,-36],down:[0,36],left:[-36,0],right:[36,0]}[direction];
   pos=positions.find(p=>Math.abs(p.x-x)<24&&Math.abs(p.y-y)<24)||positions.find(p=>Math.abs(p.x-x-facing[0])<24&&Math.abs(p.y-y-facing[1])<24);
  }
  if(!pos)pos=positions.sort((a,b)=>dist(a)-dist(b))[0];
  if(pos&&dist(pos)<60)return {type:'plot',...pos,label:plotPrompt(state,plotAt(state,pos.index))};
  const locked=FIELDS.findIndex((f,i)=>!ownedField(state,i)&&(pointed?.field===i&&dist(pointed)<60||x>=f.x-12&&x<=f.x+f.w+12&&y>=f.y-12&&y<=f.y+f.h+12));
  if(locked>=0){const f=FIELDS[locked];return {type:'field',field:locked,x:f.x+f.w/2,y:f.y+f.h/2,label:'Select Shovel / dig ground'};}
 }
 if(state.selected==='water'){
  const shore=location.shoreline.filter(p=>dist(p)<48&&walkable(state.area,p.x,p.y)).sort((a,b)=>dist(a)-dist(b))[0];
  if(shore)return {type:'refill',...shore,label:'Refill watering can'};
 }
 return null;
}
