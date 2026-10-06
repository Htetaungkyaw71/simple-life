// Native source-pixel geometry, shared by rendering, physics and save validation.
export const HOUSE={x:400,y:320,door:{x:480,y:438},porch:{x:480,y:450},exit:{x:480,y:470}};
export function houseSolids(x,y){
 return [[32,0,15,8],[24,8,34,8],[9,16,62,16],[6,32,68,20],[6,52,25,4],[48,52,26,4]].map(([dx,dy,w,h])=>[x+dx*2,y+dy*2,w*2,h*2]);
}
export function pondInset(y,h,w=288){const t=Math.min(1,Math.abs(y/h-.5)*2);return Math.round(Math.min(w/2-1,Math.max(8,w/2*(1-Math.sqrt(1-t*t))+8*Math.sin(y*.05))));}
export function pondRows([x,y,w,h]){
 return Array.from({length:h/2},(_,row)=>{const inset=Math.round(pondInset(row*2,h,w)/2)*2;return [x+inset,y+row*2,w-inset*2,2];}).filter(row=>row[2]>0);
}
