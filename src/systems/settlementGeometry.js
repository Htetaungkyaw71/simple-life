import {DECORATIONS} from '../data/settlement.js';
export const farmDecorations=s=>(s?.settlement?.decorations||[]).filter(d=>d.farm===(s.currentFarm||0));
export function decorationShape(d){const def=DECORATIONS[d.type];if(!def)return null;const side=['left','right'].includes(d.direction);if(side&&['bench','table'].includes(d.type))return {w:def.h,h:def.w,box:[-def.h/2+4,-def.w+8,def.h-8,def.w-8]};if(side&&d.type==='fence')return {w:24,h:48,box:[-6,-40,12,40]};return def;}
export function decorationBoxes(s,area){return area==='farm'?farmDecorations(s).flatMap(d=>{const b=decorationShape(d)?.box;return b?[[d.x+b[0],d.y+b[1],b[2],b[3]]]:[];}):[];}
export function decorationBlocked(s,area,x,y,r){return decorationBoxes(s,area).some(([a,b,w,h])=>x+r>a&&x-r<a+w&&y>b&&y-r<b+h);}
export function decorationRect(d){const def=decorationShape(d);return {x:d.x-def.w/2,y:d.y-def.h,w:def.w,h:def.h};}
export const overlaps=(a,b,pad=0)=>a.x+a.w>b.x-pad&&a.x<b.x+b.w+pad&&a.y+a.h>b.y-pad&&a.y<b.y+b.h+pad;
