import {visiblePlots} from './expansion.js';
import {plotAt} from './plots.js';
import {openGround,markWet} from './farmGround.js';
import {lineClear} from './forest.js';
import {usePlot} from './farming.js';
import {CROPS} from '../data/crops.js';
import {wateredToday,missed} from './watering.js';
export const COPPER_CAN={coins:180,wood:6,stone:4,energy:2};
export function copperQuote(s){
 const reason=s.ownsCopperCan?'Already owned':!s.settlement.projects.includes('commons')?'Complete Commons seating first':!['farm','home'].includes(s.area)?'Visit the Farm board':s.money<COPPER_CAN.coins?'Need 180 coins':s.inventory.wood<6||s.inventory.stone<4?'Need 6 Wood / 4 Stone':null;
 return {ok:!reason,reason};
}
export function buyCopperCan(s){const q=copperQuote(s);if(!q.ok)return q.reason;s.money-=180;s.inventory.wood-=6;s.inventory.stone-=4;s.ownsCopperCan=true;return 'Copper Can owned / up to 3 aligned beds / 1-2 energy';}
// Preview and action share this exact stopped ray. Missing beds and obstacles end it.
export function wateringPreview(s,first,direction='down'){
 if(s.area!=='farm'||!first||Math.hypot(first.x-s.position.x,first.y-s.position.y)>=72)return [];
 const [dx,dy]=({up:[0,-48],down:[0,48],left:[-48,0],right:[48,0]})[direction]||[0,48],beds=visiblePlots(s),tiles=[];
 for(let i=0;i<(s.ownsCopperCan?3:1);i++){
  const x=first.x+dx*i,y=first.y+dy*i,b=beds.find(b=>b.x===x&&b.y===y);
  if(!b||!openGround('farm',x,y,false,s)||!lineClear('farm',s.position,b,0,s))break;
  const p=plotAt(s,b.index),d=CROPS[p.crop];
  tiles.push({...b,eligible:!!d&&missed(p)<4&&p.growth<d.growthDays&&!wateredToday(s,p)});
 }
 return tiles;
}
export function waterWithCan(s,first,direction){
 const tiles=wateringPreview(s,first,direction).filter(t=>t.eligible);
 if(!tiles.length)return {ok:false,message:'No thirsty crops in the preview',tiles:[]};
 const energy=s.ownsCopperCan?Math.min(COPPER_CAN.energy,tiles.length):1;
 if(s.energy<energy)return {ok:false,message:'Too tired / eat or sleep',tiles:[]};
 for(const tile of tiles){usePlot(s,tile.index,{waterCost:0});markWet(s,tile);}
 s.energy-=energy;return {ok:true,message:'Watered '+tiles.length+' / -'+energy+' energy',tiles,x:first.x,y:first.y};
}
