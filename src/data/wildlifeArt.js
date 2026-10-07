import {WILDLIFE_SPRITES} from './wildlifeSprites.js';
export const ANIMATION_LENGTHS={idle:4,walk:6,run:5,attack:5};
export function animalDirection({x,y},previous='down'){
 if(Math.abs(x)+Math.abs(y)<.001)return previous;
 return Math.abs(x)>Math.abs(y)?x<0?'left':'right':y<0?'up':'down';
}
export function wildlifeFrame(species,action,direction,now){
 const count=species==='hare'&&action==='walk'?5:ANIMATION_LENGTHS[action];
 return `cp-${species}-${action}-${direction}-${Math.floor(now/(action==='idle'?260:100))%count}`;
}
// Some licensed packs provide orthogonal walks, others only side/idle poses.
// Keep their real capabilities explicit instead of inventing directional cells.
export function combatAnimalVisual(species,action,direction,now,lastSide='right'){
 const rig=WILDLIFE_SPRITES[species];
 if(species==='boar')return {frame:wildlifeFrame(species,action,direction,now),flipX:false,originY:.9};
 if(!rig)return {frame:species+(action==='attack'?3:action==='idle'?0:Math.floor(now/180)%3),flipX:lastSide==='right',originY:.9};
 const selected=rig.counts[action]?action:'idle',side=['left','right'].includes(direction)?direction:lastSide;
 const cadence=selected==='idle'?220:selected==='run'?85:140;
 const frame=Math.floor(Math.max(0,now)/cadence)%rig.counts[selected];
 return {frame:`wa-${species}-${selected}-${rig.directional?direction:'side'}-${frame}`,flipX:!rig.directional&&side!==rig.facing,originY:rig.origins[rig.directional?direction:'side']};
}
// Quiet woodland species use the supplied pack's actual identity. These animals
// flee from the farmer, have no combat/drop/save state and do not guard treasure.
export const WOODLAND_WILDLIFE=[
 {species:'deer',name:'Deer',x:480,y:4680},{species:'deer',name:'Deer',x:520,y:4736},
 {species:'hare',name:'Hare',x:480,y:4840},{species:'hare',name:'Hare',x:520,y:4896},
 {species:'fox',name:'Fox',x:1760,y:3784},{species:'fox',name:'Fox',x:1800,y:3840},
 {species:'grouse',name:'Grouse',x:4320,y:2792},{species:'grouse',name:'Grouse',x:4360,y:2848},
];
