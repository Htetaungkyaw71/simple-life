import {icon} from './pixelWidgets.js';
import {PROJECTS} from '../data/settlement.js';
import {drawDecorationArt} from '../art/DecorationArt.js';
import {decorationShape} from '../systems/settlementGeometry.js';

// Previews reuse the exact local scenery frames. Paving is original pixel art.
const fit=(w,h,sw,sh)=>{const n=Math.min(w/sw,h/sh,3);return Math.max(.5,Math.floor(n*2)/2);};
export function decorationPreview(u,parent,type,cx,cy,w,h){
 const def=decorationShape({type}),[sw,sh]=type==='stove'?[40,60]:[def.w/2,type==='planter'?24:def.h/2],s=fit(w,h,sw,sh),x=Math.round(cx-sw*s/2),y=Math.round(cy-sh*s/2);
 if(type==='stove'){icon(u,parent,'home-fireplace',x,y,s);const g=u.add.graphics();parent.add(g);g.setPosition(x+9*s,y+41*s).setScale(s);g.fillStyle(0x3f3c35).fillRect(0,0,20,5).fillRect(20,1,6,2);g.fillStyle(0xa2aaa1).fillRect(2,1,16,1);return;}
 drawDecorationArt(u,parent,type,'down',x,y+(type==='planter'?8*s:0),s);
}
export function projectPreview(u,parent,id,cx,cy,w,h){const p=PROJECTS.find(p=>p.id===id);if(!p)return;const minX=Math.min(...p.props.map(a=>a[1])),minY=Math.min(...p.props.map(a=>a[2])),sw=Math.max(...p.props.map(([name,x])=>(x-minX)/2+(name==='bench'?32:16))),sh=Math.max(...p.props.map(([name,,y])=>(y-minY)/2+(name==='bench'?20:16))),s=fit(w,h,sw,sh),ox=Math.round(cx-sw*s/2),oy=Math.round(cy-sh*s/2);for(const [name,x,y]of p.props)icon(u,parent,name,ox+(x-minX)/2*s,oy+(y-minY)/2*s,s);}
export const decorationThumb=type=>(u,parent,cx,cy,w,h)=>decorationPreview(u,parent,type,cx,cy,w,h);
