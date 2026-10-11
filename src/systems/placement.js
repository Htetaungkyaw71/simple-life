import {decorationAllowed} from './customization.js';
import {DECORATIONS,DECORATION_DIRECTIONS} from '../data/settlement.js';
import {decorationPlacement,readjustQuote} from './settlement.js';
const snap=n=>Math.round(n/8)*8;
export function placementDraft(s,direction='down'){
 if(!decorationAllowed(s.area,s.selectedDecoration)||s.selected!=='decorate'||!DECORATIONS[s.selectedDecoration]||!s.inventory[DECORATIONS[s.selectedDecoration].item])return null;
 const offset={down:[0,56],up:[0,-56],left:[-56,0],right:[56,0]}[direction]||[0,56];
 return {type:s.selectedDecoration,...(s.area==='farm'?{farm:s.currentFarm||0}:{area:s.area}),x:snap(s.position.x+offset[0]),y:snap(s.position.y+offset[1]),direction:'down'};
}
export function adjustPlacement(d,point){return Number.isFinite(point?.x)&&Number.isFinite(point?.y)?{...d,x:snap(point.x),y:snap(point.y)}:d;}
export function turnPlacement(d){return {...d,direction:DECORATION_DIRECTIONS[(DECORATION_DIRECTIONS.indexOf(d.direction)+1)%4]};}
export function placementQuote(s,d,{original=null,view=null}={}){
 if(!d||(d.area||'farm')!==s.area||s.area==='farm'&&d.farm!==(s.currentFarm||0)||!original&&d.type!==s.selectedDecoration)return {ok:false,message:'Choose a piece in this area'};
 if(view&&(d.x<view.x||d.y<view.y||d.x>view.x+view.width||d.y>view.y+view.height))return {ok:false,message:'Choose a spot inside the screen'};
 return original?readjustQuote(s,original,d):decorationPlacement(s,d);
}
