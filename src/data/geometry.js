// Native source-pixel geometry, shared by rendering, physics and save validation.
export const HOUSE={x:400,y:320,door:{x:480,y:492},porch:{x:480,y:492},exit:{x:480,y:528}};
// Opaque house-atlas runs through foundation row 54, including the chimney.
// Porch steps (rows 55–58) stay walkable; entry is a separate approach zone.
export function houseSolids(x,y){
 return [[35, 0, 10, 1], [34, 1, 12, 1], [33, 2, 14, 1], [32, 3, 16, 1], [31, 4, 18, 1], [57, 4, 10, 3], [30, 5, 20, 1], [29, 6, 22, 1], [28, 7, 24, 1], [58, 7, 8, 6], [27, 8, 26, 1], [26, 9, 28, 1], [25, 10, 30, 1], [24, 11, 32, 1], [23, 12, 34, 1], [22, 13, 44, 1], [21, 14, 45, 1], [8, 15, 64, 14], [6, 29, 68, 15], [6, 44, 69, 2], [6, 46, 68, 8], [12, 54, 2, 1], [31, 54, 21, 1], [55, 54, 8, 1], [65, 54, 2, 1]].map(([dx,dy,w,h])=>[x+dx*2,y+dy*2,w*2,h*2]);
}
export function pondInset(y,h,w=288){const t=Math.min(1,Math.abs(y/h-.5)*2);return Math.round(Math.min(w/2-1,Math.max(8,w/2*(1-Math.sqrt(1-t*t))+8*Math.sin(y*.05))));}
export function pondRows([x,y,w,h]){
 return Array.from({length:h/2},(_,row)=>{const inset=Math.round(pondInset(row*2,h,w)/2)*2;return [x+inset,y+row*2,w-inset*2,2];}).filter(row=>row[2]>0);
}
