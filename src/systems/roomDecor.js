import {ROOM} from '../data/interior.js';
import {DECORATIONS} from '../data/settlement.js';
import {validDecoration} from './settlement.js';
// A narrow phone room can have less floor space. Keep paid pieces in the Bag
// when proportional relocation cannot preserve clear furniture/door approaches.
export function resizeRoomDecor(s,old){
 const indoor=s.settlement.decorations.filter(d=>d.area==='interior');
 s.settlement.decorations=s.settlement.decorations.filter(d=>d.area!=='interior');
 for(const d of indoor){const moved={...d,x:Math.round(d.x*ROOM.width/old.width/8)*8,y:Math.round(d.y*ROOM.height/old.height/8)*8};
  if(validDecoration(s,moved))s.settlement.decorations.push(moved);
  else s.inventory[DECORATIONS[d.type].item]=Math.min(9999,s.inventory[DECORATIONS[d.type].item]+1);
 }
 return indoor.length-s.settlement.decorations.filter(d=>d.area==='interior').length;
}
