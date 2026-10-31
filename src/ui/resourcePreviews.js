import {PROJECTS} from '../data/settlement.js';
import {drawDecorationArt,decorationArtSize} from '../art/DecorationArt.js';
import {HOME_INTERIOR_ART} from '../data/homeInteriorArt.js';

// Previews reuse the exact local scenery frames. Paving is original pixel art.
const fit=(w,h,sw,sh)=>{const n=Math.min(w/sw,h/sh,3);return Math.max(.125,Math.floor(n*8)/8);};
export function decorationPreview(u,parent,type,cx,cy,w,h){
 if(type==='stove'){
  const art=HOME_INTERIOR_ART['home-fireplace'],[l,t,r,b]=art.visibleBounds,s=fit(w,h,r-l,b-t);
  const image=u.add.image(Math.round(cx-(l+r)*s/2),Math.round(cy-(t+b)*s/2),art.texture,art.frame).setOrigin(0).setScale(s);parent.add(image);return;
 }
 const def=decorationArtSize(type),[sw,sh]=[def.w,def.h],s=fit(w,h,sw,sh),x=Math.round(cx-sw*s/2),y=Math.round(cy-sh*s/2);
 drawDecorationArt(u,parent,type,'down',x,y+(type==='planter'?8*s:0),s);
}
export function projectPreview(u,parent,id,cx,cy,w,h){
 const p=PROJECTS.find(p=>p.id===id);if(!p)return;
 const props=p.props.filter(([name])=>['bench','planter'].includes(name)),minX=Math.min(...props.map(a=>a[1])),minY=Math.min(...props.map(a=>a[2]));
 const layout=props.map(([name,x,y])=>({name,x:(x-minX)/2,y:(y-minY)/2,w:name==='bench'?32:16,h:name==='bench'?20:16}));
 const sw=Math.max(...layout.map(d=>d.x+d.w)),sh=Math.max(...layout.map(d=>d.y+d.h)),s=fit(w-12,h-12,sw,sh),pw=Math.round(sw*s+10),ph=Math.round(sh*s+10),px=Math.round(cx-pw/2),py=Math.round(cy-ph/2);
 const ground=u.add.graphics();parent.add(ground);ground.fillStyle(0xb9c990).fillRect(px,py,pw,ph).fillStyle(0x91a66d).fillRect(px,py+ph-3,pw,3).fillStyle(0xd6d8ab).fillRect(px+2,py+2,pw-4,2);
 if(id==='flowerCourt'){ground.fillStyle(0xb9ad8d).fillRect(Math.round(cx-3),py+5,6,ph-10).fillRect(px+5,Math.round(cy-3),pw-10,6);}
 else if(id==='commons')ground.fillStyle(0xb9ad8d).fillRect(px+5,py+ph-11,pw-10,5);
 else ground.fillStyle(0xc2b595).fillRect(Math.round(cx-pw*.22),py+ph-13,Math.round(pw*.44),6);
 for(const d of layout.sort((a,b)=>a.y-b.y||a.x-b.x))drawDecorationArt(u,parent,d.name,'down',Math.round(px+5+d.x*s),Math.round(py+5+d.y*s),s);
}
export const decorationThumb=type=>(u,parent,cx,cy,w,h)=>decorationPreview(u,parent,type,cx,cy,w,h);
export const projectThumb=id=>(u,parent,cx,cy,w,h)=>projectPreview(u,parent,id,cx,cy,w,h);
