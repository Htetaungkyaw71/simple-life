// Depth is anchored to the feet, while overlap uses the full visible sprite.
// A character in front of the trunk never makes a tree transparent.
export function canopyOccludes(bounds,foot,position,bodyHeight=60){
 const inset=Math.min(12,bounds.width/8),left=bounds.x+inset,right=bounds.x+bounds.width-inset;
 return position.y<foot-4&&position.x+14>left&&position.x-14<right&&position.y>bounds.y+8&&position.y-bodyHeight<bounds.y+bounds.height;
}
