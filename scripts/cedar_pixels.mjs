import {PNG,propPixels} from './prop_pixels.mjs';
export {PNG};
// The approved bench ramp, extended only for muted stone, water, metal and cloth.
export const CEDAR_COLORS=['2d2421','40312b','554034','6a4e3f','7b5c48','907059','a18469','b59b7b','c5b08d','3c4330','545d40','6e7751','8a9368','a3ac82','d6cbb1','e7dfc7','baa29a','ceafa7','e0c2ba','b39e70','cbb680','555650','797b70','402f2a','9e8a71','b8aa91','87907c','b9bea6','747764','464a3c','c8bfa8','c6b4a6','394c4e','586e70','7e9698','a9bdbb','cfdbd1','59545d','827a86','ada5ae','875d57','a87b70','c5998b','ece4ce','6c7054','bdc49c','3b413c','76938a'].map(s=>s.match(/../g).map(v=>parseInt(v,16)));
export function cedarPixels(src,w,h,{stretch=false}={}){
 const high=propPixels(src,w*2,h*2,{colors:CEDAR_COLORS,stretch}),im=new PNG({width:w,height:h});
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const cells=[];for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const i=((y*2+dy)*high.width+x*2+dx)*4;const c=[...high.data.subarray(i,i+4)];if(c[3])cells.push(c);}
  if(cells.length<2)continue;const votes=new Map();for(const c of cells){const k=c.join(',');votes.set(k,(votes.get(k)||0)+1);}
  const dark=cells.filter(c=>c[0]+c[1]+c[2]<225),winner=dark.length>=2?dark.sort((a,b)=>a[0]+a[1]+a[2]-b[0]-b[1]-b[2])[0]:[...votes].sort((a,b)=>b[1]-a[1])[0][0].split(',').map(Number);im.data.set(winner,(y*w+x)*4);
 }return im;
}
