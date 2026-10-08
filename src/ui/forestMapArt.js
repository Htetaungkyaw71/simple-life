import {forestRegion} from '../data/forest.js';
import {waterAt} from '../data/water.js';
import {groundHash,FOREST_GROUND_PALETTES} from '../art/groundSurface.js';
// Smooth world-coordinate fields form broad miniature groves, independent of viewport.
function patchField(p,step,salt){
 const x=p.x/step,y=p.y/step,ix=Math.floor(x),iy=Math.floor(y),ease=t=>t*t*(3-2*t),fx=ease(x-ix),fy=ease(y-iy),at=(a,b)=>groundHash(a,b,salt)/4294967295;
 const a=at(ix,iy)*(1-fx)+at(ix+1,iy)*fx,b=at(ix,iy+1)*(1-fx)+at(ix+1,iy+1)*fx;return a*(1-fy)+b*fy;
}
export function forestMapPixels(map,explored,w,h){
 const pixels=new Uint8ClampedArray(w*h*4),known=new Set(explored);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const p={x:(x+.5)/w*map.size.width,y:(y+.5)/h*map.size.height},r=forestRegion(p),i=(y*w+x)*4;
  let color;if(!known.has(r.id))color=(x+y)%9<2?[222,190,137]:[241,221,176];
  else if(waterAt(map,p,false))color=[94,125,116];
  else {const grove=patchField(p,840,451),soil=patchField(p,600,617),shade=grove>.64?-18:grove>.51?-8:grove<.29?8:0,base=FOREST_GROUND_PALETTES[r.biome];color=soil>.76&&r.biome!=='snow'?[175,152,102]:base.map(c=>c+shade);}
  pixels.set([...color,255],i);
 }
 return pixels;
}
export function mapPoint(p,rect,size){return {x:Math.round(rect.x+Math.max(0,Math.min(size.width,p.x))/size.width*rect.w),y:Math.round(rect.y+Math.max(0,Math.min(size.height,p.y))/size.height*rect.h)};}
