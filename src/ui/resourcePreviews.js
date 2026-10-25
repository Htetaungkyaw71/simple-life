import {icon} from './pixelWidgets.js';
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
export function projectPreview(u,parent,id,cx,cy,w,h){const p=PROJECTS.find(p=>p.id===id);if(!p)return;const minX=Math.min(...p.props.map(a=>a[1])),minY=Math.min(...p.props.map(a=>a[2])),sw=Math.max(...p.props.map(([name,x])=>(x-minX)/2+(name==='bench'?32:16))),sh=Math.max(...p.props.map(([name,,y])=>(y-minY)/2+(name==='bench'?20:16))),s=fit(w,h,sw,sh),ox=Math.round(cx-sw*s/2),oy=Math.round(cy-sh*s/2);for(const [name,x,y]of p.props){if(name==='flowers2'&&p.props.some(([n,xx,yy])=>n==='planter'&&xx===x&&yy===y+16))continue;if(name==='planter')drawDecorationArt(u,parent,'planter','down',ox+(x-minX)/2*s,oy+(y-minY)/2*s,s);else icon(u,parent,name,ox+(x-minX)/2*s,oy+(y-minY)/2*s,s);}}
export const decorationThumb=type=>(u,parent,cx,cy,w,h)=>decorationPreview(u,parent,type,cx,cy,w,h);
