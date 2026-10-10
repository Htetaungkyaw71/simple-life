import {DECORATIONS,DECORATION_DIRECTIONS} from '../data/settlement.js';
import {decorationPlacement} from './settlement.js';
const snap=n=>Math.round(n/8)*8;
export function placementDraft(s,direction='down'){
 if(s.area!=='farm'||s.selected!=='decorate'||!DECORATIONS[s.selectedDecoration]||!s.inventory[DECORATIONS[s.selectedDecoration].item])return null;
 const offset={down:[0,56],up:[0,-56],left:[-56,0],right:[56,0]}[direction]||[0,56];
 return {type:s.selectedDecoration,farm:s.currentFarm||0,x:snap(s.position.x+offset[0]),y:snap(s.position.y+offset[1]),direction:'down'};
}
export function adjustPlacement(d,point){return Number.isFinite(point?.x)&&Number.isFinite(point?.y)?{...d,x:snap(point.x),y:snap(point.y)}:d;}
export function turnPlacement(d){return {...d,direction:DECORATION_DIRECTIONS[(DECORATION_DIRECTIONS.indexOf(d.direction)+1)%4]};}
export function placementQuote(s,d){if(!d||s.area!=='farm'||d.farm!==(s.currentFarm||0)||d.type!==s.selectedDecoration)return {ok:false,message:'Choose a piece on this Farm'};return decorationPlacement(s,d);}
