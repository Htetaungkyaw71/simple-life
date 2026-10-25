// Dedicated resident art; player wardrobe and shared legacy NPC variants stay independent.
import {PEOPLE} from './appearance.js';
export const MATCHING_NPCS={
 'city-nell':{prefix:'npc-nell',scale:1.5,originY:56/64,height:60},
 'city-sol':{prefix:'npc-sol',scale:1.5,originY:56/64,height:60},
};
const DIRECTIONS=['down','up','left','right'];
export const NPC_IDLE_DURATIONS=[1500,1200,120,1500];
export const NPC_WALK_DURATIONS=[150,150,150,150,150,150];
export function residentVisual(n){
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
