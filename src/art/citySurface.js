import {CITY_LAYOUT} from '../data/cityLayout.js';
import {CITY_NATIVE_SIZE,citySurfaceMasks} from '../data/citySurfaceGeometry.js';
// Original masonry and curb construction, rendered on the existing ground bake.
// All masks use the same native contour; faces project south by three pixels.
const rgb=hex=>[1,3,5].map(n=>parseInt(hex.slice(n,n+2),16));
const cream=['#d8cebb','#dbd1be','#d6cdbb','#d9d0bd'].map(rgb);
const road=['#aaa99d','#b0ad9f','#b4afa0','#a9ab9f','#aeaea2'].map(rgb);
const color=Object.fromEntries(Object.entries({creamJoint:'#cfc6b4',roadJoint:'#9fa193',roadLight:'#b9b3a4',lip:'#d6c9ae',light:'#e6dac0',crest:'#e6d7b9',face:'#aa9d85',bottom:'#90836f',faceJoint:'#9f937d',threshold:'#d8ccb5',soil:'#827b57'}).map(([k,v])=>[k,rgb(v)]));
const hash=(x,y)=>{let n=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(9,1442695041))|0;n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0;};
const put=(data,p,c)=>{data[p*4]=c[0];data[p*4+1]=c[1];data[p*4+2]=c[2];data[p*4+3]=255;};
const at=(m,x,y,w,h)=>x>=0&&y>=0&&x<w&&y<h?m[y*w+x]:0;
function gardenMask(gardens,w,h){const m=new Uint8Array(w*h);for(const [rx,ry,rw,rh]of gardens){const x0=rx/2,y0=ry/2,x1=x0+rw/2,y1=y0+rh/2;for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const dx=Math.max(x0+5-x,0,x-(x1-6)),dy=Math.max(y0+5-y,0,y-(y1-6));if(dx*dx+dy*dy<=25)m[y*w+x]=1;}}return m;}
function curb(data,top,roads,ramps,w,h){
 const face=new Uint8Array(w*h),shoulder=new Uint8Array(w*h);
 if(ramps)for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(ramps[y*w+x])for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(x+dx>=0&&x+dx<w&&y+dy>=0&&y+dy<h)shoulder[(y+dy)*w+x+dx]=1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=y*w+x;if(!top[p]||ramps?.[p])continue;const height=shoulder[p]?1:3;for(let dy=1;dy<=height&&y+dy<h;dy++)if(!top[p+dy*w])face[p+dy*w]=1;}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=y*w+x;
  if(roads[p]&&!face[p]&&!top[p]&&at(face,x,y-1,w,h)){const i=p*4;put(data,p,[0,1,2].map(c=>Math.round(data[i+c]*.82+[97,95,80][c]*.18)));}
  if(face[p])put(data,p,x%20===0?color.faceJoint:at(face,x,y+1,w,h)?color.face:color.bottom);
  if(!top[p]||ramps?.[p])continue;
  let edge=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(!at(top,x+dx,y+dy,w,h))edge=true;
  if(edge)put(data,p,color.lip);
  if(!at(top,x,y-1,w,h)||!at(top,x-1,y,w,h))put(data,p,color.light);
  if(!at(top,x,y+1,w,h))put(data,p,color.crest);
 }
 if(ramps)for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=y*w+x;if(!top[p]||!ramps[p])continue;let edge=false;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(!at(top,x+dx,y+dy,w,h))edge=true;if(edge)put(data,p,color.threshold);}
}
export function paintCityPixels(data,map){
 const {width:w,height:h}=CITY_NATIVE_SIZE,{cream:cm,road:rd,island,ramp,walk}=citySurfaceMasks(),gardens=gardenMask(map.gardens,w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const p=y*w+x;if(island[p]||gardens[p]||(!cm[p]&&!rd[p]))continue;
  const isCream=cm[p],th=isCream?7:6,row=Math.floor(y/th),xx=x+(row%2?9:0),column=Math.floor(xx/18),localX=xx%18,k=hash(column-(row%2?1:0),row)%(isCream?cream.length:road.length);
  let c=localX===17||y%th===th-1?(isCream?color.creamJoint:color.roadJoint):(isCream?cream[k]:road[k]);
  if(!isCream&&k===2&&y%th===0&&localX>=2&&localX<=13)c=color.roadLight;
  put(data,p,c);
 }
 curb(data,cm,rd,ramp,w,h);curb(data,island,rd,null,w,h);curb(data,gardens,rd,null,w,h);
 // Small clipped soil pockets under the approved grouped planting. All other
 // green pixels retain the existing paintGround palette, noise and grass marks.
 for(const a of map.cityPlanting||CITY_LAYOUT.planting){if(a.kind==='grass')continue;const [fx,fy]=a.foot,cx=fx/2,cy=fy/2-2.5;for(let y=Math.floor(cy-4.5);y<=cy+4.5;y++)for(let x=Math.floor(cx-11);x<=cx+12;x++){
  if(((x-cx-.5)/11.5)**2+((y-cy)/4.5)**2>1)continue;
  const p=y*w+x;if(x<0||y<0||x>=w||y>=h)continue;
  // Keep soil away from the three-pixel stone cap and off every walkway.
  let allowed=a.group.startsWith('island')?!!island[p]:a.group.startsWith('garden')?!!gardens[p]:!walk[p];
  if(allowed&&(island[p]||gardens[p]))for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(!at(island[p]?island:gardens,x+dx,y+dy,w,h))allowed=false;
  if(allowed)put(data,p,color.soil);
 }}
 // Existing canal embankments; bridge art paints their open landings above it.
 for(const [y,c]of [[14,[215,207,181]],[15,[215,207,181]],[80,[215,207,181]],[81,[215,207,181]],[82,[215,207,181]],[83,[120,126,112]],[84,[120,126,112]]])for(let x=0;x<w;x++)put(data,y*w+x,c);
 return data;
}
export function paintCity(ctx,map){const {width:w,height:h}=CITY_NATIVE_SIZE,pixels=ctx.getImageData(0,0,w,h);paintCityPixels(pixels.data,map);ctx.putImageData(pixels,0,0);}
