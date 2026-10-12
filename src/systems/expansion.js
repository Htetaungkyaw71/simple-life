import {FIELDS,FARM_PLOTS,PLOTS_PER_FARM,FARM_PRICE,MAX_FARMS} from '../data/farms.js';
import {emptyPlot} from './state.js';

export const newFarm=()=>({fields:[true,false,false,false]});
export const ownedField=(s,field,farm=s.currentFarm||0)=>s.farms?.[farm]?.fields[field]===true;
export const visiblePlots=s=>[...FARM_PLOTS.flatMap((p,local)=>{const index=(s.currentFarm||0)*PLOTS_PER_FARM+local;return ownedField(s,p.field)||(s.dugPlots||[]).includes(index)?[{...p,index}]:[];}),...(s.customBeds||[]).flatMap((b,i)=>b.farm===(s.currentFarm||0)?[{x:b.x,y:b.y,index:s.plots.length+i}]:[])];
export const plotOwned=(s,index)=>Number.isInteger(index)&&index>=0&&(index<s.plots.length?(s.dugPlots||[]).includes(index)||ownedField(s,Math.floor(index%PLOTS_PER_FARM/16),Math.floor(index/PLOTS_PER_FARM)):!!s.customBeds?.[index-s.plots.length]);
export const nextFarmPrice=s=>FARM_PRICE*s.farms.length;
export const canExpandFarm=s=>s.farms.length<MAX_FARMS;

export function buyField(s,field){
 if(!Number.isInteger(field)||!FIELDS[field]||field===0)return 'Choose a locked field.';
 if(ownedField(s,field))return 'You already own this field.';
 const price=FIELDS[field].price;
 if(s.money<price)return `You need ${price} coins for field ${field+1}.`;
 if(!s.ownsCopperCan)return 'Buy the Copper Can at the Farm board before expanding.';
 s.money-=price;s.farms[s.currentFarm].fields[field]=true;
 return `Field ${field+1} is ready. Sixteen new planting spaces!`;
}
export function buyFarm(s){
 if(s.farms.length>=MAX_FARMS)return 'Your farm collection is full.';
 const price=nextFarmPrice(s);
 if(s.money<price)return `You need ${price} coins for another farm.`;
 if(!s.ownsCopperCan)return 'Buy the Copper Can at the Farm board before expanding.';
 s.money-=price;s.farms.push(newFarm());s.plots.push(...Array.from({length:PLOTS_PER_FARM},emptyPlot));s.currentFarm=s.farms.length-1;
 return `Welcome to farm ${s.currentFarm+1}. Its first field is yours.`;
}
export function visitFarm(s,index){
 if(!Number.isInteger(index)||!s.farms[index])return false;
 s.currentFarm=index;return true;
}
