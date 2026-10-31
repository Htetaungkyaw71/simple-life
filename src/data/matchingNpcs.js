// Dedicated resident art; player wardrobe and shared legacy NPC variants stay independent.
import {PEOPLE} from './appearance.js';
export const MATCHING_NPCS={
 'city-nell':{prefix:'npc-nell',scale:1.5,originY:56/64,height:60},
 'city-sol':{prefix:'npc-sol',scale:1.5,originY:56/64,height:60},
};
export const CUSTOM_NPC_SHEETS={
 'girl-child':{columns:10,walkFrames:[4,4,8],sitFrames:[5,5,9],stepPixels:[5,5,3],sitShift:5},
 'boy-child':{columns:10,walkFrames:[8,8,8],sitFrames:[9,9,9],stepPixels:[3,3,3],sitShift:4},
 'purple-woman':{columns:10,walkFrames:[4,4,8],sitFrames:[5,5,9],stepPixels:[5,5,3],sitShift:5,scaleMultiplier:1.05},
 'elder-man':{columns:6,walkFrames:[4,4,4],sitFrames:[5,5,5],stepPixels:[5,5,5],sitShift:5,scaleMultiplier:1},
 'seed-seller':{columns:6,walkFrames:[4,4,4],sitFrames:[5,5,5],stepPixels:[5,5,5],sitShift:5,scaleMultiplier:1},
 'produce-seller':{columns:6,walkFrames:[4,4,4],sitFrames:[5,5,5],stepPixels:[5,5,5],sitShift:5,scaleMultiplier:1},
 'produce-seller-new':{columns:6,walkFrames:[4,4,4],sitFrames:[5,5,5],stepPixels:[5,5,5],sitShift:5,scaleMultiplier:1},
 'lamplighter':{columns:6,walkFrames:[4,4,4],sitFrames:[5,5,5],stepPixels:[5,5,5],sitShift:5,scaleMultiplier:1},
 'barber-npc':{columns:6,walkFrames:[4,4,4],sitFrames:[5,5,5],stepPixels:[5,5,5],sitShift:5,scaleMultiplier:1},
};
const DIRECTIONS=['down','up','left','right'];
export const NPC_IDLE_DURATIONS=[1500,1200,120,1500];
export const NPC_WALK_DURATIONS=[150,150,150,150,150,150];
export function residentVisual(n){
 const sheet=CUSTOM_NPC_SHEETS[n.spriteSheet];
 if(sheet)return {customSheet:true,texture:n.spriteSheet,originY:56/64,height:64,...sheet};
 const custom=MATCHING_NPCS[n.id];
 return custom?{...custom,custom:true}:{custom:false,scale:PEOPLE.scale,originY:PEOPLE.originY,height:PEOPLE.height*PEOPLE.scale};
}
export function residentFrame(n){
 if(!MATCHING_NPCS[n.id])return `town-person-${n.art}-${n.direction}-${n.moving?1+Math.floor(n.elapsed/120)%4:0}`;
 const durations=n.moving?NPC_WALK_DURATIONS:NPC_IDLE_DURATIONS,total=durations.reduce((a,b)=>a+b),direction=DIRECTIONS.includes(n.direction)?n.direction:'down';
 let elapsed=Math.max(0,n.elapsed||0)%total,phase=0;
 while(phase<durations.length-1&&elapsed>=durations[phase])elapsed-=durations[phase++];
 return `${MATCHING_NPCS[n.id].prefix}-${n.moving?'walking':'idle'}-${direction}-${phase}`;
}
export function residentPoseFrame(n,pose){return MATCHING_NPCS[n.id]?`${MATCHING_NPCS[n.id].prefix}-${pose}-0`:`town-person-${n.art}-${pose}-0`;}
