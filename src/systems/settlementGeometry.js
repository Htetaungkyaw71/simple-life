import {DECORATIONS} from '../data/settlement.js';
export const farmDecorations=s=>(s?.settlement?.decorations||[]).filter(d=>d.farm===(s.currentFarm||0));
export function decorationBoxes(s,area){return area==='farm'?farmDecorations(s).flatMap(d=>{const b=DECORATIONS[d.type]?.box;return b?[[d.x+b[0],d.y+b[1],b[2],b[3]]]:[];}):[];}
export function decorationBlocked(s,area,x,y,r){return decorationBoxes(s,area).some(([a,b,w,h])=>x+r>a&&x-r<a+w&&y>b&&y-r<b+h);}
export function decorationRect(d){const def=DECORATIONS[d.type];return {x:d.x-def.w/2,y:d.y-def.h,w:def.w,h:def.h};}
export const overlaps=(a,b,pad=0)=>a.x+a.w>b.x-pad&&a.x<b.x+b.w+pad&&a.y+a.h>b.y-pad&&a.y<b.y+b.h+pad;
