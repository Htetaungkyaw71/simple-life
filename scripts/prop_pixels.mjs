// Offline native pixel conversion: bounded area votes prevent point-sampling speckles.
import {createRequire} from 'node:module';
export const {PNG}=createRequire(import.meta.url)(process.env.SIMPLE_LIFE_PNGJS||'/Users/mac/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/pngjs');
export const PROP_COLORS=['352228','5e342e','8c4b38','b46c4b','d99a6f','bb9471','dfbc91','f6dbb3','fff0ce','3c482e','647b3c','91a355','bdc47d','62605a','938575','c1b29a','e2d5b8','5c4b4a','9d5a52','ca806f','e5ab8d','344c49','5e8173','9fb69b','b7c397','455963','79939c','bacac6','a77539','d5a54f','f0d18a','d56b56','b1a562'].map(s=>s.match(/../g).map(v=>parseInt(v,16)));
const closest=(rgb,colors)=>{let best=0,distance=Infinity;for(let k=0;k<colors.length;k++){const d=colors[k].reduce((sum,v,n)=>sum+(v-rgb[n])**2,0);if(d<distance){distance=d;best=k;}}return best;};
export function propPixels(src,w,h,{padding=0,clean=false,stretch=false,colors=PROP_COLORS}={}){
 let x0=src.width,y0=src.height,x1=-1,y1=-1;
 for(let y=0;y<src.height;y++)for(let x=0;x<src.width;x++)if(src.data[(y*src.width+x)*4+3]>=224){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
 if(x1<0)throw Error('Empty prop source');
 const fit=Math.min((w-padding*2)/(x1-x0+1),(h-padding*2)/(y1-y0+1)),sxScale=stretch?(w-padding*2)/(x1-x0+1):fit,syScale=stretch?(h-padding*2)/(y1-y0+1):fit,left=(w-(x1-x0+1)*sxScale)/2,top=h-padding-(y1-y0+1)*syScale;
 const indices=new Int16Array(w*h).fill(-1);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const votes=new Map();let ink=0;
  for(const yy of [.2,.5,.8])for(const xx of [.2,.5,.8]){
   const sx=Math.floor(x0+(x+xx-left)/sxScale),sy=Math.floor(y0+(y+yy-top)/syScale);if(sx<x0||sx>x1||sy<y0||sy>y1)continue;
   const i=(sy*src.width+sx)*4;if(src.data[i+3]<224)continue;ink++;const c=closest(src.data.subarray(i,i+3),colors);votes.set(c,(votes.get(c)||0)+1);
  }
  if(ink<5)continue;indices[y*w+x]=[...votes].sort((a,b)=>b[1]-a[1])[0][0];
 }
 // Only old textured sources get a material-local isolated-speck cleanup. Dark
 // contours, holes, silhouettes and high-contrast small highlights are retained.
 if(clean){const original=new Int16Array(indices);for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
  const i=y*w+x,c=original[i];if(c<0||c===0)continue;let same=0,opaque=0;const counts=new Map();
  for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]){const n=original[(y+dy)*w+x+dx];if(n<0)continue;opaque++;if(n===c)same++;counts.set(n,(counts.get(n)||0)+1);}
  if(same>1||opaque<7)continue;const [best,count]=[...counts].sort((a,b)=>b[1]-a[1])[0],d=colors[c].reduce((sum,v,k)=>sum+(v-colors[best][k])**2,0);
  if(best!==0&&count>=4&&d<7000)indices[i]=best;
 }}
 const im=new PNG({width:w,height:h});for(let i=0;i<indices.length;i++)if(indices[i]>=0)im.data.set([...colors[indices[i]],255],i*4);return im;
}
