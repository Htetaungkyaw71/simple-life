import {ROOM} from '../data/interior.js';
import {keepsakePixels} from '../ui/KeepsakeArt.js';
export function drawHomeKeepsake(scene,s){if(s?.area!=='interior'||s.story?.keepsake!=='placed')return;const g=scene.add.graphics().setDepth(165);keepsakePixels(g,ROOM.width-80,128,2);}
