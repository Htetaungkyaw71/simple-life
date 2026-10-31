import {ROOM} from '../data/interior.js';
import {keepsakeSprite} from '../ui/KeepsakeArt.js';
export function drawHomeKeepsake(scene,s){if(s?.area!=='interior'||s.story?.keepsake!=='placed')return;keepsakeSprite(scene,null,ROOM.width-64,145).setDepth(165);}
