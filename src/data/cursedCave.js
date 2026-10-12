// One optional seal in the eastern Dark Forest. Existing skull-cave clearing.
export const CURSED_CAVE={x:8046,y:1214,approach:{x:8046,y:1238},radius:76,coins:200,cost:{money:600,wood:48,stone:32,meat:20}};
export const CURSE_DUSK=1140,CURSE_DAWN=360;
export const CURSE_GHOST={count:3,health:3,speed:86,damage:12,respawn:5000,arrival:1200,windup:700,recovery:1100};
export const freshGhost=i=>({id:'curse-ghost-'+i,health:CURSE_GHOST.health,area:null,position:null,respawn:0,arrival:CURSE_GHOST.arrival,windup:0,recovery:0});
export const freshCurse=()=>({stage:'sealed',discovered:false,brokenDay:0,restoredDay:0,nightKey:null,paid:Object.fromEntries(Object.keys(CURSED_CAVE.cost).map(k=>[k,0])),ghosts:Array.from({length:CURSE_GHOST.count},(_,i)=>freshGhost(i))});
export const curseNight=s=>s.minute>=CURSE_DUSK||s.minute<CURSE_DAWN;
export const curseComplete=c=>Object.entries(CURSED_CAVE.cost).every(([key,n])=>c.paid[key]>=n);
