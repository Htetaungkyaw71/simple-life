import {propImage} from './PropArt.js';
import {worldText} from '../i18n/myanmarText.js';
import {PROJECTS} from '../data/settlement.js';
import {areaDecorations,decorationRect,overlaps} from '../systems/settlementGeometry.js';
import {drawDecorationArt} from './DecorationArt.js';
import {ROOM} from '../data/interior.js';
// Reused licensed local scenery plus original pixel stone paving/hearth pan.
const sprite=(scene,name,x,y,depth)=>name==='planter'?drawDecorationArt(scene,null,'planter','down',x,y,2,depth):propImage(scene,name,x,y,2,depth);
export function settlementRects(s,area){return ['home','farm','interior'].includes(area)?areaDecorations(s,area).map(decorationRect):area==='city'?PROJECTS.filter(p=>s?.settlement?.projects.includes(p.id)).flatMap(p=>p.props.map(([name,x,y])=>({x,y,w:name==='bench'?64:32,h:name==='bench'?40:32}))):[];}
export const settlementCovers=(s,area,x,y)=>settlementRects(s,area).some(r=>overlaps(r,{x:x-12,y:y-24,w:24,h:24},4));
export function drawSettlement(scene,area){const s=scene.app.state;if(!s?.settlement)return;
 if(['home','farm','interior'].includes(area))for(const d of areaDecorations(s,area)){if(d===scene.app.placement?.original)continue;const r=decorationRect(d);drawDecorationArt(scene,null,d.type,d.direction||'down',r.x,r.y,2,['path','rug','flowers'].includes(d.type)?1:d.y);}
 if(area==='city')for(const p of PROJECTS){
  if(s.settlement.projects.includes(p.id)){
   for(const [name,x,y]of p.props){
    const plantedOverlay=name==='flowers2'&&p.props.some(([n,xx,yy])=>n==='planter'&&xx===x&&yy===y+16);
    if(!plantedOverlay)sprite(scene,name,x,y,y+(name==='bench'?40:32));
   }
  }else{
   sprite(scene,'post',p.x-16,p.y-32,p.y);
   worldText(scene,p.x,p.y-48,'PROJECT',6).setOrigin(.5,0).setScale(2).setTint(0xffedcc).setDepth(p.y+1);
  }
 }
 if(area==='interior'&&s.settlement.stove)propImage(scene,'cooking-pan',ROOM.hearth.x-20,88,2,129);
}
