import {FIELDS,FARM_PLOTS,PLOTS_PER_FARM,FARM_PRICE,MAX_FARMS,STARTER_EXTENSION,MAX_CUSTOM_BEDS} from '../data/farms.js';
import {emptyPlot} from './state.js';

export const newFarm=()=>({fields:[true,false,false,false]});
// Append, never reorder or replace saved custom crops. A caller can protect scenery.
export function prepareStarterBeds(s,farm=null,clear=()=>true){
 s.customBeds??=[];
 for(let n=0;n<s.farms.length;n++)if(farm===null||farm===n)for(const p of STARTER_EXTENSION){
  if(s.customBeds.length>=MAX_CUSTOM_BEDS)return;
  if(s.restoredBeds?.some(b=>b?.farm===n&&b.x===p.x&&b.y===p.y))continue;
  if(s.customBeds.some(b=>b.farm===n&&Math.abs(b.x-p.x)<48&&Math.abs(b.y-p.y)<48)||!clear(n,p))continue;
  s.customBeds.push({farm:n,...p,plot:emptyPlot()});
 }
}
export const ownedField=(s,field,farm=s.currentFarm||0)=>s.farms?.[farm]?.fields[field]===true;
const activeBed=(s,p,farm=s.currentFarm||0)=>!s.restoredBeds?.some(b=>b?.farm===farm&&b.x===p.x&&b.y===p.y);
export const visiblePlots=s=>[...FARM_PLOTS.flatMap((p,local)=>{const index=(s.currentFarm||0)*PLOTS_PER_FARM+local;return ownedField(s,p.field)||(s.dugPlots||[]).includes(index)?[{...p,index}]:[];}),...(s.customBeds||[]).flatMap((b,i)=>b.farm===(s.currentFarm||0)?[{x:b.x,y:b.y,index:s.plots.length+i}]:[])].filter(p=>activeBed(s,p));
export const plotOwned=(s,index)=>{
 if(!Number.isInteger(index)||index<0)return false;
 const b=index<s.plots.length?FARM_PLOTS[index%PLOTS_PER_FARM]:s.customBeds?.[index-s.plots.length],farm=index<s.plots.length?Math.floor(index/PLOTS_PER_FARM):b?.farm;
 return !!b&&activeBed(s,b,farm)&&(index>=s.plots.length||(s.dugPlots||[]).includes(index)||ownedField(s,Math.floor(index%PLOTS_PER_FARM/16),farm));
};
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
 s.money-=price;s.farms.push(newFarm());s.plots.push(...Array.from({length:PLOTS_PER_FARM},emptyPlot));s.currentFarm=s.farms.length-1;prepareStarterBeds(s,s.currentFarm);
 return `Welcome to farm ${s.currentFarm+1}. Its first field is yours.`;
}
export function visitFarm(s,index){
 if(!Number.isInteger(index)||!s.farms[index])return false;
 s.currentFarm=index;return true;
}
