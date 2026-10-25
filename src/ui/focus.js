export function highlightControls(controls,focus){
 const choices=controls.filter(c=>!c.disabled);
 choices.forEach((c,i)=>c.box?.setStrokeStyle?.(i===focus?2:1));
}
export function controlAtPoint(controls,x,y,scale=2){
 return controls.some(c=>x>=c.x*scale&&x<(c.x+c.w)*scale&&y>=c.y*scale&&y<(c.y+c.h)*scale);
}
export function promptSuppressed(now,until){return now<until;}
