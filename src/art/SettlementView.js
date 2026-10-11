import {PROJECTS} from '../data/settlement.js';
import {areaDecorations,decorationRect,overlaps} from '../systems/settlementGeometry.js';
import {drawDecorationArt} from './DecorationArt.js';
import {ROOM} from '../data/interior.js';
// Reused licensed local scenery plus original pixel stone paving/hearth pan.
const sprite=(scene,name,x,y,depth)=>scene.add.image(x,y,'town',name).setOrigin(0).setScale(2).setDepth(depth);
export function settlementRects(s,area){return ['home','farm','interior'].includes(area)?areaDecorations(s,area).map(decorationRect):area==='city'?PROJECTS.filter(p=>s?.settlement?.projects.includes(p.id)).flatMap(p=>p.props.map(([name,x,y])=>({x,y,w:name==='bench'?64:32,h:name==='bench'?40:32}))):[];}
export const settlementCovers=(s,area,x,y)=>settlementRects(s,area).some(r=>overlaps(r,{x:x-12,y:y-24,w:24,h:24},4));
export function drawSettlement(scene,area){const s=scene.app.state;if(!s?.settlement)return;
 if(['home','farm','interior'].includes(area))for(const d of areaDecorations(s,area)){if(d===scene.app.placement?.original)continue;const r=decorationRect(d);drawDecorationArt(scene,null,d.type,d.direction||'down',r.x,r.y,2,['path','rug','flowers'].includes(d.type)?1:d.y);}
 if(area==='city')for(const p of PROJECTS){if(s.settlement.projects.includes(p.id))for(const [name,x,y]of p.props)sprite(scene,name,x,y,y+(name==='bench'?40:32));else{sprite(scene,'post',p.x-16,p.y-32,p.y);scene.add.bitmapText(p.x,p.y-48,'pixel','PROJECT',6).setOrigin(.5,0).setScale(2).setTint(0xffedcc).setDepth(p.y+1);}}
 if(area==='interior'&&s.settlement.stove){const g=scene.add.graphics().setPosition(ROOM.width/2-84,88).setScale(2).setDepth(129);g.fillStyle(0x3f3c35).fillRect(2,0,22,7).fillRect(24,1,7,2);g.fillStyle(0xa2aaa1).fillRect(4,1,18,2);g.fillStyle(0xa97043).fillRect(8,3,5,3).fillRect(14,2,5,3);}
}
