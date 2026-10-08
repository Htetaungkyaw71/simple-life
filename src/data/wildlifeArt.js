export const ANIMATION_LENGTHS={idle:4,walk:6,run:5,attack:5};
export function animalDirection({x,y},previous='down'){
 if(Math.abs(x)+Math.abs(y)<.001)return previous;
 return Math.abs(x)>Math.abs(y)?x<0?'left':'right':y<0?'up':'down';
}
export function wildlifeFrame(species,action,direction,now){
 const count=species==='hare'&&action==='walk'?5:ANIMATION_LENGTHS[action];
 return `cp-${species}-${action}-${direction}-${Math.floor(now/(action==='idle'?260:100))%count}`;
}
export function combatAnimalVisual(species,action,direction,now){return {frame:wildlifeFrame(species,action,direction,now),flipX:false,originY:.9};}
// Quiet woodland species use the supplied pack's actual identity. These animals
// flee from the farmer, have no combat/drop/save state and do not guard treasure.
export {WOODLAND_WILDLIFE} from './woodlandWildlife.js';
