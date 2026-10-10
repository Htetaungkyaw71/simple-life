import {DECORATIONS,PROJECTS} from '../data/settlement.js';
import {farmDecorations,decorationRect,overlaps} from '../systems/settlementGeometry.js';
import {ROOM} from '../data/interior.js';
// Reused licensed local scenery plus original pixel stone paving/hearth pan.
const sprite=(scene,name,x,y,depth)=>scene.add.image(x,y,'town',name).setOrigin(0).setScale(2).setDepth(depth);
export function settlementRects(s,area){return area==='farm'?farmDecorations(s).map(decorationRect):area==='city'?PROJECTS.filter(p=>s?.settlement?.projects.includes(p.id)).flatMap(p=>p.props.map(([name,x,y])=>({x,y,w:name==='bench'?64:32,h:name==='bench'?40:32}))):[];}
export const settlementCovers=(s,area,x,y)=>settlementRects(s,area).some(r=>overlaps(r,{x:x-12,y:y-24,w:24,h:24},4));
function drawPath(scene,d){const g=scene.add.graphics().setDepth(1).setPosition(d.x-24,d.y-48);g.fillStyle(0x756f61).fillRect(0,0,48,48);for(let row=0;row<3;row++)for(let col=0;col<3;col++){const x=col*16,y=row*16;g.fillStyle((row+col)%2?0xa8a28d:0xb8b09a).fillRect(x+1,y+1,14,14);g.fillStyle(0xd4ccb6).fillRect(x+2,y+2,12,2);g.fillStyle(0x8c8673).fillRect(x+2,y+13,12,1);}return g;}
export function drawSettlement(scene,area){const s=scene.app.state;if(!s?.settlement)return;
 if(area==='farm')for(const d of farmDecorations(s)){const def=DECORATIONS[d.type];if(d.type==='path')drawPath(scene,d);else{sprite(scene,def.frame,d.x-def.w/2,d.y-def.h,d.y);if(d.type==='planter')sprite(scene,'flowers2',d.x-16,d.y-48,d.y+1);}}
 if(area==='city')for(const p of PROJECTS){if(s.settlement.projects.includes(p.id))for(const [name,x,y]of p.props)sprite(scene,name,x,y,y+(name==='bench'?40:32));else{sprite(scene,'post',p.x-16,p.y-32,p.y);scene.add.bitmapText(p.x,p.y-48,'pixel','PROJECT',6).setOrigin(.5,0).setScale(2).setTint(0xffedcc).setDepth(p.y+1);}}
 if(area==='interior'&&s.settlement.stove){const g=scene.add.graphics().setPosition(ROOM.width/2-84,88).setScale(2).setDepth(129);g.fillStyle(0x3f3c35).fillRect(2,0,22,7).fillRect(24,1,7,2);g.fillStyle(0xa2aaa1).fillRect(4,1,18,2);g.fillStyle(0xa97043).fillRect(8,3,5,3).fillRect(14,2,5,3);}
}
